// Usage, Insights, and Analysis API routes
import { Hono } from 'hono';
import type { Bindings, Variables, Subscription, UsageLog } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateId } from '../utils';
import { runAnalysis } from '../services/decisionEngine';

const analytics = new Hono<{ Bindings: Bindings; Variables: Variables }>();

analytics.use('*', authMiddleware);

// POST /api/usage - Log usage for a subscription
analytics.post('/usage', async (c) => {
  const userId = c.get('userId');
  const { subscriptionId, used } = await c.req.json();

  if (!subscriptionId) {
    return c.json({ error: 'subscriptionId is required' }, 400);
  }

  // Verify subscription belongs to user
  const sub = await c.env.DB.prepare(
    'SELECT id FROM subscriptions WHERE id = ? AND user_id = ?'
  ).bind(subscriptionId, userId).first();

  if (!sub) {
    return c.json({ error: 'Subscription not found' }, 404);
  }

  const id = generateId('ul');
  const today = new Date().toISOString().split('T')[0];

  // Check if already logged today
  const existingLog = await c.env.DB.prepare(
    'SELECT id FROM usage_logs WHERE subscription_id = ? AND user_id = ? AND logged_at = ?'
  ).bind(subscriptionId, userId, today).first();

  if (existingLog) {
    // Update existing
    await c.env.DB.prepare(
      'UPDATE usage_logs SET used = ? WHERE id = ?'
    ).bind(used ? 1 : 0, (existingLog as any).id).run();
    return c.json({ success: true, updated: true });
  }

  await c.env.DB.prepare(
    'INSERT INTO usage_logs (id, subscription_id, user_id, used, logged_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, subscriptionId, userId, used ? 1 : 0, today).run();

  return c.json({ success: true, id });
});

// POST /api/usage/batch - Log usage for multiple subscriptions at once
analytics.post('/usage/batch', async (c) => {
  const userId = c.get('userId');
  const { entries } = await c.req.json();

  if (!entries || !Array.isArray(entries)) {
    return c.json({ error: 'entries array is required' }, 400);
  }

  const today = new Date().toISOString().split('T')[0];
  const results = [];

  for (const entry of entries) {
    const { subscriptionId, used } = entry;
    const existingLog = await c.env.DB.prepare(
      'SELECT id FROM usage_logs WHERE subscription_id = ? AND user_id = ? AND logged_at = ?'
    ).bind(subscriptionId, userId, today).first();

    if (existingLog) {
      await c.env.DB.prepare('UPDATE usage_logs SET used = ? WHERE id = ?')
        .bind(used ? 1 : 0, (existingLog as any).id).run();
      results.push({ subscriptionId, updated: true });
    } else {
      const id = generateId('ul');
      await c.env.DB.prepare(
        'INSERT INTO usage_logs (id, subscription_id, user_id, used, logged_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(id, subscriptionId, userId, used ? 1 : 0, today).run();
      results.push({ subscriptionId, created: true });
    }
  }

  return c.json({ success: true, results });
});

// GET /api/insights
analytics.get('/insights', async (c) => {
  const userId = c.get('userId');

  const insights = await c.env.DB.prepare(
    `SELECT i.*, s.name as subscription_name, s.cost_monthly, s.category
     FROM insights i
     LEFT JOIN subscriptions s ON i.subscription_id = s.id
     WHERE i.user_id = ? AND i.status = 'active'
     ORDER BY i.impact_monthly DESC`
  ).bind(userId).all();

  return c.json({ insights: insights.results });
});

// POST /api/analyze - Run decision engine and save insights
analytics.post('/analyze', async (c) => {
  const userId = c.get('userId');

  // Get all active subscriptions
  const subs = await c.env.DB.prepare(
    `SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'`
  ).bind(userId).all<Subscription>();

  if (!subs.results.length) {
    return c.json({
      totalMonthlySpend: 0,
      totalWaste: 0,
      decisions: [],
      insights: [],
      message: 'No active subscriptions found. Add some tools to get started!'
    });
  }

  // Get usage logs for each subscription
  const subsWithLogs = await Promise.all(
    subs.results.map(async (sub) => {
      const logs = await c.env.DB.prepare(
        'SELECT * FROM usage_logs WHERE subscription_id = ? AND user_id = ? ORDER BY logged_at DESC LIMIT 7'
      ).bind(sub.id, userId).all<UsageLog>();
      return { subscription: sub, logs: logs.results };
    })
  );

  // Run the decision engine
  const analysis = runAnalysis(subsWithLogs);

  // Clear old insights and save new ones
  await c.env.DB.prepare(
    `UPDATE insights SET status = 'archived' WHERE user_id = ?`
  ).bind(userId).run();

  for (const insight of analysis.insights) {
    await c.env.DB.prepare(
      `INSERT INTO insights (id, user_id, subscription_id, action_type, message, impact_monthly, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`
    ).bind(
      insight.id, userId, insight.subscription_id,
      insight.action_type, insight.message, insight.impact_monthly
    ).run();
  }

  // Generate alerts for upcoming renewals
  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  const soonStr = soon.toISOString().split('T')[0];

  const upcomingRenewals = subs.results.filter(
    s => s.next_renewal && s.next_renewal <= soonStr
  );

  for (const sub of upcomingRenewals) {
    const existingAlert = await c.env.DB.prepare(
      `SELECT id FROM alerts WHERE user_id = ? AND type = 'renewal' AND message LIKE ? AND created_at > datetime('now', '-7 days')`
    ).bind(userId, `%${sub.name}%`).first();

    if (!existingAlert) {
      await c.env.DB.prepare(
        `INSERT INTO alerts (id, user_id, type, title, message) VALUES (?, ?, 'renewal', ?, ?)`
      ).bind(
        generateId('alt'),
        userId,
        `${sub.name} renewing soon`,
        `${sub.name} renews on ${sub.next_renewal} for $${sub.cost_monthly}/mo`
      ).run();
    }
  }

  return c.json(analysis);
});

// GET /api/alerts
analytics.get('/alerts', async (c) => {
  const userId = c.get('userId');

  const alerts = await c.env.DB.prepare(
    `SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`
  ).bind(userId).all();

  return c.json({ alerts: alerts.results });
});

// PUT /api/alerts/:id/read
analytics.put('/alerts/:id/read', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  await c.env.DB.prepare(
    'UPDATE alerts SET read = 1 WHERE id = ? AND user_id = ?'
  ).bind(id, userId).run();

  return c.json({ success: true });
});

// POST /api/onboarding/complete
analytics.post('/onboarding/complete', async (c) => {
  const userId = c.get('userId');

  await c.env.DB.prepare(
    'UPDATE users SET onboarded = 1, updated_at = datetime(\'now\') WHERE id = ?'
  ).bind(userId).run();

  return c.json({ success: true });
});

// GET /api/stats - Quick stats for the dashboard
analytics.get('/stats', async (c) => {
  const userId = c.get('userId');

  const totalSubs = await c.env.DB.prepare(
    `SELECT COUNT(*) as count, SUM(cost_monthly) as total FROM subscriptions WHERE user_id = ? AND status = 'active'`
  ).bind(userId).first<{ count: number; total: number }>();

  const activeInsights = await c.env.DB.prepare(
    `SELECT COUNT(*) as count, SUM(impact_monthly) as total FROM insights WHERE user_id = ? AND status = 'active'`
  ).bind(userId).first<{ count: number; total: number }>();

  const unreadAlerts = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND read = 0`
  ).bind(userId).first<{ count: number }>();

  // Check if user needs weekly usage check
  const lastUsageLog = await c.env.DB.prepare(
    `SELECT MAX(logged_at) as last_log FROM usage_logs WHERE user_id = ?`
  ).bind(userId).first<{ last_log: string | null }>();

  const needsUsageCheck = !lastUsageLog?.last_log ||
    (Date.now() - new Date(lastUsageLog.last_log).getTime()) > 3 * 24 * 60 * 60 * 1000;

  return c.json({
    subscriptionCount: totalSubs?.count || 0,
    totalMonthlySpend: totalSubs?.total || 0,
    insightCount: activeInsights?.count || 0,
    totalPotentialSavings: activeInsights?.total || 0,
    unreadAlerts: unreadAlerts?.count || 0,
    needsUsageCheck,
  });
});

// GET /api/usage/pending - Get subscriptions that need usage logging today
analytics.get('/usage/pending', async (c) => {
  const userId = c.get('userId');
  const today = new Date().toISOString().split('T')[0];

  const subs = await c.env.DB.prepare(
    `SELECT s.id, s.name, s.category, s.cost_monthly,
            CASE WHEN ul.id IS NOT NULL THEN 1 ELSE 0 END as logged_today,
            ul.used as used_today
     FROM subscriptions s
     LEFT JOIN usage_logs ul ON ul.subscription_id = s.id AND ul.user_id = ? AND ul.logged_at = ?
     WHERE s.user_id = ? AND s.status = 'active'
     ORDER BY s.name`
  ).bind(userId, today, userId).all();

  return c.json({ subscriptions: subs.results });
});

export default analytics;
