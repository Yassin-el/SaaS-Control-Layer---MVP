# SaaS Control Layer

## A Decision-First Subscription Management Platform

Stop wasting money on SaaS tools you don't use. SaaS Control Layer is a **decision engine** - not a dashboard. Every screen answers one question: **"What should I do?"**

## Live URLs

- **App**: https://3000-i85spjmkgxjp5k3r04w8o-0e616f0a.sandbox.novita.ai
- **Login**: /login
- **Demo Account**: `demo@example.com` / `demo123`

## Features

### Implemented
- **Authentication**: Full signup/login/logout with cookie-based sessions
- **Onboarding Flow**: 3-step flow (connect data → add tools → instant insights) in < 60 seconds
- **Decision Engine**: Rule-based analysis that detects waste, suggests cancellations, downgrades, and consolidations
- **Waste Calculator**: Real-time total waste computation across all subscriptions
- **Recommendation Cards**: Color-coded actionable cards (red=cancel, yellow=downgrade, orange=consolidate, green=keep)
- **Weekly Usage Check**: Prompt users to log tool usage with Yes/No buttons
- **Subscription Management**: Full CRUD with sorting by cost, name, category
- **Tool Detail Pages**: Usage history grid, recommendations, quick usage logging
- **Alert System**: Upcoming renewal alerts, unused subscription warnings
- **Settings**: Account info, integrations status, alert management
- **Batch Usage Logging**: Log usage for all tools at once
- **Demo Data**: 12 realistic SaaS subscriptions with usage logs

### Not Yet Implemented
- Gmail OAuth integration (UI placeholder exists)
- Google OAuth signup
- Email notifications
- Cloudflare deployment (production)
- Background cron jobs (daily analysis)

## Tech Stack

- **Backend**: Hono (TypeScript) on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Server-rendered JSX + Tailwind CSS + FontAwesome
- **Auth**: Custom cookie-based JWT (HMAC SHA-256)
- **State**: Vanilla JS with fetch API (no framework overhead)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Current user info |
| GET | /api/subscriptions | List all subscriptions (sortable) |
| GET | /api/subscriptions/:id | Get subscription detail with usage logs |
| POST | /api/subscriptions | Create subscription |
| PUT | /api/subscriptions/:id | Update subscription |
| DELETE | /api/subscriptions/:id | Cancel subscription (soft delete) |
| POST | /api/usage | Log single usage entry |
| POST | /api/usage/batch | Log usage for multiple tools |
| GET | /api/usage/pending | Get tools needing usage logging today |
| GET | /api/insights | Get active insights |
| POST | /api/analyze | Run decision engine |
| GET | /api/stats | Quick stats overview |
| GET | /api/alerts | Get user alerts |
| PUT | /api/alerts/:id/read | Mark alert as read |
| POST | /api/onboarding/complete | Mark onboarding complete |

## Data Architecture

### Models
- **User**: Auth, onboarding state, Gmail connection
- **Subscription**: name, cost, billing cycle, usage level, category, source
- **UsageLog**: Daily yes/no usage entries per subscription
- **Insight**: Generated recommendations with action types and savings impact
- **Alert**: Renewal reminders, unused tool warnings

### Decision Engine Rules
1. **No usage + any cost** → CANCEL
2. **Low usage + high cost** → CANCEL
3. **Low usage + medium cost** → DOWNGRADE
4. **Medium usage + high cost** → DOWNGRADE
5. **Multiple tools same category** → CONSOLIDATE
6. **Regular usage + reasonable cost** → KEEP

## User Guide

1. **Sign up** or use demo account (`demo@example.com` / `demo123`)
2. **Onboarding**: Add your SaaS tools with costs
3. **Decisions page**: See your total waste and actionable recommendations
4. **Weekly check-in**: Log which tools you actually used
5. **Act**: Click "Act" on recommendations to cancel/downgrade

## Color System
- Green = Good (keep using)
- Yellow = Review (consider downgrading)
- Red = Waste (consider canceling)
- Orange = Consolidate (too many tools in same category)

## Development

```bash
npm run build                    # Build
npm run db:migrate:local         # Run migrations
npm run db:seed                  # Seed demo data
npm run db:reset                 # Reset database
pm2 start ecosystem.config.cjs  # Start dev server
```

## Deployment
- **Platform**: Cloudflare Pages + D1
- **Status**: Development (local)
- **Last Updated**: 2026-04-09
