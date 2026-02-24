# Kaustav & Himasree — Bengali Royal Wedding Application

A cinematic, production-grade Bengali Royal wedding web application with dual-themed experience.

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Wouter routing
- **Backend**: Express.js, TypeScript, Node.js
- **Database**: PostgreSQL via Drizzle ORM
- **Authentication**: JWT (HttpOnly cookies)
- **Automation**: node-cron for reminder scheduling
- **External Integration**: WhatsApp Cloud API (Meta)
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query + React Context

## Architecture

### Dual Royal Theme System

Two themed modes toggled via header:
- **Groom Side (Ka Theme)**: Royal Cream (#EFE6D8), Antique Gold (#B9975B), Deep Charcoal (#2E2A27), Warm Beige (#D8C3A5)
- **Bride Side (Himasree Theme)**: Sindoor Red (#8B0000), Deep Vermilion (#A1122F), Royal Gold (#C6A75E), Ivory Base (#F8F1E7)

Implemented via CSS custom properties (`--wedding-bg`, `--wedding-accent`, etc.) and `data-side` attribute.

### Cinematic Entry

WaxSealIntro component with:
- Fullscreen royal textured background
- Envelope layout with circular wax seal
- Gold embossed KH crest
- Floating dust particles
- SVG clipPath animation (seal splits into halves)
- Phase state machine: idle → cracking → opening → fadeout → complete
- Wax crack sound effect on interaction
- Music fade-in via React Context

### KH Royal Crest

SVG component with:
- Circular gold embossed emblem
- Outer ring text: "Kaustav & Himasree" / "Est. 2026"
- Center interlocking serif "KH"
- Gold gradient + radial gradient
- Inner shadow filter
- Scalable size prop

## Project Structure

```
/client/src/
  /pages/
    Home.tsx              - Public site (hero, story, events, venue, RSVP, shagun, FAQs)
    Invite.tsx            - Personalized invite page /invite/:slug
    AdminLogin.tsx        - Admin authentication
    AdminDashboard.tsx    - Full admin panel (8 tabs)
  /components/
    Header.tsx            - Header with theme toggle + mute control
    Countdown.tsx         - Wedding countdown timer
    FloatingContact.tsx   - Floating chat widget (WhatsApp + Call, side-dynamic)
    KHCrest.tsx           - SVG royal crest component
    WaxSealIntro.tsx      - Cinematic wax seal entry
  /context/
    ThemeContext.tsx       - Dual theme (groom/bride) provider
    MusicContext.tsx       - Background music player
    SealContext.tsx        - Wax seal open state

/server/
  index.ts               - Express server entry point
  routes.ts              - All API route handlers
  storage.ts             - Database storage interface (IStorage)
  db.ts                  - Drizzle ORM connection
  seed.ts                - Database seeder
  /services/
    whatsapp.ts          - WhatsApp Cloud API integration
    reminders.ts         - node-cron reminder engine
  /middleware/
    auth.ts              - JWT auth middleware

/shared/
  schema.ts              - Drizzle + Zod schemas (source of truth)
```

## Database Tables

- `wedding_config` — Singleton config (date, venue, story, UPI, music URL, WhatsApp toggle, groom/bride phone & WhatsApp numbers)
- `guests` — Guest list with invite slugs, RSVP, adults/children count, food preference
- `wedding_events` — Events with accommodation, travel info, contact person
- `story_milestones` — Our Story timeline entries
- `venues` — Venue details with maps, directions, accommodation
- `faqs` — FAQ entries with categories
- `message_logs` — WhatsApp message audit log
- `users` — Admin users (bcrypt password)

## Features

### Public Website (/)
- Wax seal cinematic entry
- Hero with couple names, countdown
- Our Story alternating timeline
- Horizontal date-based event calendar
- Event cards with travel/accommodation details, ICS download
- Venue & Travel section with Google Maps embed
- RSVP section (redirects to personalized invite)
- Digital Shagun with UPI QR code
- FAQ accordion
- KH crest footer watermark

### Personalized Invite (/invite/:slug)
- Auto-prefills guest data
- RSVP form: attendance, adults/children, food preference, events multi-select
- WhatsApp opt-in
- Theme auto-matches guest side

### Admin Dashboard (/admin)
- 8-tab interface: Overview, Guests, Events, Stories, Venues, FAQs, Config, WhatsApp
- Full CRUD for all entities
- CSV guest export
- UPI ID and background music URL management
- WhatsApp automation toggle

## API Routes

### Public
- `GET /api/config`, `/api/events`, `/api/stories`, `/api/venues`, `/api/faqs`
- `GET /api/invite/:slug`
- `POST /api/rsvp`
- `GET /api/events/:id/calendar`

### Admin (JWT protected)
- Full CRUD for config, guests, events, stories, venues, FAQs
- CSV export, WhatsApp toggle, manual message send

## Default Credentials
Admin: `admin` / `wedding2025`

## Environment Variables
- `SESSION_SECRET` — JWT signing (already set)
- `DATABASE_URL` — PostgreSQL (already set)
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN` — For WhatsApp automation
