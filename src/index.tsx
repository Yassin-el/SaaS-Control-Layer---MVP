import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { renderer } from './renderer';
import type { Bindings, Variables } from './types';
import { pageAuthMiddleware } from './middleware/auth';

// Route modules
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscriptions';
import analyticsRoutes from './routes/analytics';

// Page components
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { OnboardingPage } from './components/OnboardingPage';
import { AppShell } from './components/AppShell';
import { HomePage } from './components/HomePage';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { ToolDetailPage } from './components/ToolDetailPage';
import { SettingsPage } from './components/SettingsPage';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Global middleware
app.use('/api/*', cors());
app.use(renderer);

// ==================
// API Routes
// ==================
app.route('/api/auth', authRoutes);
app.route('/api/subscriptions', subscriptionRoutes);
app.route('/api', analyticsRoutes);

// ==================
// Public Pages
// ==================

// Landing / root redirect
app.get('/', (c) => {
  return c.redirect('/login');
});

// Login
app.get('/login', (c) => {
  return c.render(<LoginPage />, { title: 'Login - SaaS Control Layer' });
});

// Signup
app.get('/signup', (c) => {
  return c.render(<SignupPage />, { title: 'Sign Up - SaaS Control Layer' });
});

// ==================
// Protected Pages
// ==================

// Onboarding
app.get('/onboarding', pageAuthMiddleware, async (c) => {
  return c.render(<OnboardingPage />, { title: 'Get Started - SaaS Control Layer' });
});

// Main App - Home (Decision Engine)
app.get('/app', pageAuthMiddleware, async (c) => {
  // Check if user needs onboarding
  const userId = c.get('userId');
  const user = await c.env.DB.prepare('SELECT onboarded FROM users WHERE id = ?').bind(userId).first<{ onboarded: number }>();
  if (user && !user.onboarded) {
    return c.redirect('/onboarding');
  }

  return c.render(
    <AppShell activePage="home">
      <HomePage />
    </AppShell>,
    { title: 'Decisions - SaaS Control Layer' }
  );
});

// Subscriptions page
app.get('/app/subscriptions', pageAuthMiddleware, async (c) => {
  return c.render(
    <AppShell activePage="subscriptions">
      <SubscriptionsPage />
    </AppShell>,
    { title: 'Tools - SaaS Control Layer' }
  );
});

// Tool detail page
app.get('/app/tool/:id', pageAuthMiddleware, async (c) => {
  const id = c.req.param('id');
  return c.render(
    <AppShell activePage="subscriptions">
      <ToolDetailPage subId={id} />
    </AppShell>,
    { title: 'Tool Details - SaaS Control Layer' }
  );
});

// Settings page
app.get('/app/settings', pageAuthMiddleware, async (c) => {
  return c.render(
    <AppShell activePage="settings">
      <SettingsPage />
    </AppShell>,
    { title: 'Settings - SaaS Control Layer' }
  );
});

export default app;
