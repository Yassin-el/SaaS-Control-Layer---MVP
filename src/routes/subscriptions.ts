// Subscriptions API routes
import { Hono } from 'hono';
import type { Bindings, Variables, Subscription } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateId } from '../utils';

const subscriptions = new Hono<{ Bindings: Bindings; Variables: Variables }>();

subscriptions.use('*', authMiddleware);

// GET /api/subscriptions
subscriptions.get('/', async (c) => {
  const userId = c.get('userId');
  const sort = c.req.query('sort') || 'cost_monthly';
  const order = c.req.query('order') || 'desc';

  const validSorts = ['cost_monthly', 'name', 'created_at', 'usage_level', 'category'];
  const sortCol = validSorts.includes(sort) ? sort : 'cost_monthly';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  const result = await c.env.DB.prepare(
    `SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY ${sortCol} ${sortOrder}`
  ).bind(userId).all<Subscription>();

  return c.json({ subscriptions: result.results });
});

// GET /api/subscriptions/:id
subscriptions.get('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  const sub = await c.env.DB.prepare(
    'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?'
  ).bind(id, userId).first<Subscription>();

  if (!sub) {
    return c.json({ error: 'Subscription not found' }, 404);
  }

  // Get usage logs
  const logs = await c.env.DB.prepare(
    'SELECT * FROM usage_logs WHERE subscription_id = ? ORDER BY logged_at DESC LIMIT 30'
  ).bind(id).all();

  // Get insights for this subscription
  const insights = await c.env.DB.prepare(
    `SELECT * FROM insights WHERE subscription_id = ? AND user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 5`
  ).bind(id, userId).all();

  return c.json({ subscription: sub, usageLogs: logs.results, insights: insights.results });
});

// POST /api/subscriptions
subscriptions.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const { name, costMonthly, billingCycle, category, source, nextRenewal, notes } = body;

  if (!name) {
    return c.json({ error: 'Name is required' }, 400);
  }

  const id = generateId('sub');
  // Convert yearly to monthly if needed
  let monthlyAmount = parseFloat(costMonthly) || 0;
  const cycle = billingCycle || 'monthly';
  if (cycle === 'yearly') {
    monthlyAmount = Math.round((monthlyAmount / 12) * 100) / 100;
  }

  await c.env.DB.prepare(
    `INSERT INTO subscriptions (id, user_id, name, cost_monthly, billing_cycle, category, source, next_renewal, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, userId, name, monthlyAmount, cycle,
    category || 'other', source || 'manual',
    nextRenewal || null, notes || ''
  ).run();

  const sub = await c.env.DB.prepare('SELECT * FROM subscriptions WHERE id = ?').bind(id).first();
  return c.json({ subscription: sub }, 201);
});

// PUT /api/subscriptions/:id
subscriptions.put('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  const body = await c.req.json();

  const existing = await c.env.DB.prepare(
    'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?'
  ).bind(id, userId).first();

  if (!existing) {
    return c.json({ error: 'Subscription not found' }, 404);
  }

  const { name, costMonthly, billingCycle, category, usageLevel, nextRenewal, notes, status } = body;

  let monthlyAmount = costMonthly !== undefined ? parseFloat(costMonthly) : undefined;
  if (monthlyAmount !== undefined && billingCycle === 'yearly') {
    monthlyAmount = Math.round((monthlyAmount / 12) * 100) / 100;
  }

  await c.env.DB.prepare(
    `UPDATE subscriptions SET
      name = COALESCE(?, name),
      cost_monthly = COALESCE(?, cost_monthly),
      billing_cycle = COALESCE(?, billing_cycle),
      category = COALESCE(?, category),
      usage_level = COALESCE(?, usage_level),
      next_renewal = COALESCE(?, next_renewal),
      notes = COALESCE(?, notes),
      status = COALESCE(?, status),
      updated_at = datetime('now')
    WHERE id = ? AND user_id = ?`
  ).bind(
    name ?? null, monthlyAmount ?? null, billingCycle ?? null,
    category ?? null, usageLevel ?? null, nextRenewal ?? null,
    notes ?? null, status ?? null, id, userId
  ).run();

  const updated = await c.env.DB.prepare('SELECT * FROM subscriptions WHERE id = ?').bind(id).first();
  return c.json({ subscription: updated });
});

// DELETE /api/subscriptions/:id
subscriptions.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  // Soft delete - set status to cancelled
  const result = await c.env.DB.prepare(
    `UPDATE subscriptions SET status = 'cancelled', updated_at = datetime('now') WHERE id = ? AND user_id = ?`
  ).bind(id, userId).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'Subscription not found' }, 404);
  }

  return c.json({ success: true });
});

export default subscriptions;
