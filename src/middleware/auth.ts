// Auth middleware - validates session token from cookie
import { createMiddleware } from 'hono/factory';
import type { Bindings, Variables } from '../types';
import { verifyToken } from '../utils';

export const authMiddleware = createMiddleware<{
  Bindings: Bindings;
  Variables: Variables;
}>(async (c, next) => {
  // Get token from cookie
  const token = c.req.header('Cookie')?.match(/session=([^;]+)/)?.[1];
  
  if (!token) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return c.json({ error: 'Invalid or expired session' }, 401);
  }

  c.set('userId', userId);
  await next();
});

// Page auth middleware - redirects to login page
export const pageAuthMiddleware = createMiddleware<{
  Bindings: Bindings;
  Variables: Variables;
}>(async (c, next) => {
  const token = c.req.header('Cookie')?.match(/session=([^;]+)/)?.[1];
  
  if (!token) {
    return c.redirect('/login');
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return c.redirect('/login');
  }

  c.set('userId', userId);
  await next();
});
