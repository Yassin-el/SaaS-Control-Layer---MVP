// Auth API routes
import { Hono } from 'hono';
import type { Bindings, Variables } from '../types';
import { generateId, hashPassword, verifyPassword, createToken } from '../utils';

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// POST /api/auth/signup
auth.post('/signup', async (c) => {
  const { email, password, name } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }
  if (password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  // Check if user exists
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) {
    return c.json({ error: 'Email already registered' }, 409);
  }

  const id = generateId('usr');
  const passwordHash = await hashPassword(password);

  await c.env.DB.prepare(
    'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)'
  ).bind(id, email, passwordHash, name || email.split('@')[0]).run();

  const token = await createToken(id);

  return c.json({ success: true, userId: id }, 201, {
    'Set-Cookie': `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
  });
});

// POST /api/auth/login
auth.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const user = await c.env.DB.prepare(
    'SELECT id, password_hash FROM users WHERE email = ?'
  ).bind(email).first<{ id: string; password_hash: string }>();

  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const token = await createToken(user.id);

  return c.json({ success: true, userId: user.id }, 200, {
    'Set-Cookie': `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
  });
});

// POST /api/auth/logout
auth.post('/logout', async (c) => {
  return c.json({ success: true }, 200, {
    'Set-Cookie': 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
  });
});

// GET /api/auth/me
auth.get('/me', async (c) => {
  const { verifyToken } = await import('../utils');
  const token = c.req.header('Cookie')?.match(/session=([^;]+)/)?.[1];

  if (!token) {
    return c.json({ authenticated: false }, 401);
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return c.json({ authenticated: false }, 401);
  }

  const user = await c.env.DB.prepare(
    'SELECT id, email, name, onboarded, gmail_connected, created_at FROM users WHERE id = ?'
  ).bind(userId).first();

  if (!user) {
    return c.json({ authenticated: false }, 401);
  }

  return c.json({ authenticated: true, user });
});

export default auth;
