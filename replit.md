# Kaustav & Himasree Wedding Application

A production-grade, secure, modular wedding web application built with Clean Architecture principles.

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Wouter routing
- **Backend**: Express.js, TypeScript, Node.js
- **Database**: PostgreSQL via Drizzle ORM
- **Authentication**: JWT (HttpOnly cookies) via jsonwebtoken
- **Automation**: node-cron for reminder scheduling
- **External Integration**: WhatsApp Cloud API (Meta)
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)

## Architecture

Follows Clean Architecture principles:
- **Presentation Layer**: React pages + components (`client/src/pages/`, `client/src/components/`)
- **API Layer**: Express route handlers (`server/routes.ts`)
- **Application Layer**: Services (`server/services/`)
- **Infrastructure Layer**: Drizzle ORM + WhatsApp integration
- **Config Layer**: Zod environment validation

## Project Structure

```
/client/src/
  /pages/
    Home.tsx              - Public wedding website (hero, story, events, RSVP)
    Invite.tsx            - Personalized invite page /invite/:slug
    AdminLogin.tsx        - Admin authentication
    AdminDashboard.tsx    - Admin management panel
  /components/
    ThemeToggle.tsx       - Dark/light mode toggle
    Countdown.tsx         - Wedding countdown timer
  /lib/
    queryClient.ts        - TanStack Query setup

/server/
  index.ts               - Express server entry point
  routes.ts              - All API route handlers
  storage.ts             - Database storage interface (IStorage)
  db.ts                  - Drizzle ORM database connection
  seed.ts                - Database seeder with sample data
  /services/
    whatsapp.ts          - WhatsApp Cloud API integration
    reminders.ts         - node-cron reminder engine
  /middleware/
    auth.ts              - JWT auth middleware

/shared/
  schema.ts              - Drizzle + Zod schemas (single source of truth)
```

## Features

### Public Website (`/`)
- Hero section with couple names, wedding date, countdown
- Our Story timeline
- Wedding events with Add-to-Calendar (ICS) download
- Google Maps integration
- RSVP form (redirects to personal invite link)

### Personalized Invite Links (`/invite/:slug`)
- Auto-prefills guest info from database
- Secure random slug system (prevents enumeration)
- Full RSVP form with WhatsApp opt-in
- Plus-one support, dietary requirements, personal message

### Admin Dashboard (`/admin`)
- JWT HttpOnly cookie authentication
- Overview stats (RSVP breakdown, attendance counts)
- Full guest CRUD with CSV export
- Wedding events CRUD
- Wedding configuration management (date, venue, story)
- WhatsApp automation toggle
- Message log viewer with status tracking

### WhatsApp Automation Engine
- WhatsApp Cloud API (Meta Business API) integration
- Pre-approved template sending with personalized variables
- Message logging in database (MessageLogs table)
- Retry mechanism (up to 3 attempts with exponential backoff)
- Duplicate prevention per guest+messageType
- Webhook signature verification

### Reminder Engine (node-cron)
- Runs hourly at minute 0 (Asia/Kolkata timezone)
- 30-day reminder
- 7-day reminder
- 1-day reminder
- Wedding morning message (6 AM on wedding day)
- Event start notification
- Thank-you message (9 AM next morning)
- Only sends to confirmed, opted-in guests

## Security
- JWT auth with HttpOnly cookies (24h expiry)
- Rate limiting on RSVP endpoint (5 req/min per IP)
- Input validation and sanitization via Zod
- Webhook signature verification (HMAC-SHA256)
- Admin password hashed with bcrypt (12 rounds)
- SQL injection protection via Drizzle ORM parameterized queries

## Database Schema

Tables:
- `users` — Admin users (bcrypt password)
- `wedding_config` — Singleton config (date, venue, story, WhatsApp toggle)
- `guests` — Guest list with invite slugs and RSVP data
- `wedding_events` — Wedding ceremony events
- `message_logs` — WhatsApp message audit log

## API Routes

### Public
- `GET /api/config` — Wedding configuration
- `GET /api/events` — Wedding events list
- `GET /api/invite/:slug` — Invite details by slug
- `POST /api/rsvp` — Submit RSVP
- `GET /api/events/:id/calendar` — Download ICS file

### Admin (JWT protected)
- `POST /api/admin/login` — Login
- `POST /api/admin/logout` — Logout
- `GET /api/admin/me` — Auth status check
- `GET/PATCH /api/admin/config` — Wedding config CRUD
- `GET/POST /api/admin/guests` — Guest management
- `PATCH/DELETE /api/admin/guests/:id` — Individual guest operations
- `GET /api/admin/guests/export` — CSV export
- `GET/POST /api/admin/events` — Event management
- `PATCH/DELETE /api/admin/events/:id` — Individual event operations
- `GET /api/admin/message-logs` — WhatsApp logs
- `POST /api/admin/whatsapp/toggle` — Toggle automation
- `POST /api/admin/whatsapp/send` — Manual send

### Webhooks
- `GET/POST /api/webhooks/whatsapp` — WhatsApp status webhooks

## Default Credentials

Admin login: `admin` / `wedding2025`
(Change immediately in production via the admin interface)

## Environment Variables Required for Full Functionality

The following secrets must be configured for WhatsApp:
- `WHATSAPP_ACCESS_TOKEN` — Meta Cloud API access token
- `WHATSAPP_PHONE_NUMBER_ID` — WhatsApp Business phone number ID
- `WHATSAPP_APP_SECRET` — App secret for webhook signature verification
- `WHATSAPP_VERIFY_TOKEN` — Custom webhook verify token
- `SESSION_SECRET` — JWT signing secret (already set)
- `DATABASE_URL` — PostgreSQL connection (already set)

## User Preferences

- Playfair Display serif font for headings
- Plus Jakarta Sans for body text
- Rose/blush pastel color palette (primary: rose)
- Dark mode supported throughout
- Bengali/Indian cultural elements in design and copy
