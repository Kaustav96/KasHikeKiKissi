# Wedding Invitation Application - Copilot Instructions

## Architecture Overview

Full-stack TypeScript wedding invitation platform with dual royal theme system (groom/bride sides), WhatsApp integration, and admin management. Built on Express.js + React (Vite) with PostgreSQL.

**Key Pattern**: Shared schemas in `/shared/schema.ts` serve as single source of truth - all Drizzle ORM tables + Zod validators defined here. Import from `../shared/schema.js` in both client and server.

## Project Structure

```
/client/src          React frontend (Vite)
  /pages             Main routes: Home, Invite, AdminLogin, AdminDashboard
  /components        Reusable UI + custom components (Header, KHCrest, WaxSealIntro)
  /context           React contexts: ThemeContext, MusicContext, SealContext
  /lib               queryClient (TanStack Query), utils
/server              Express backend
  routes.ts          All API endpoints (RESTful)
  storage.ts         Database abstraction layer (IStorage interface)
  db.ts              Drizzle connection
  seed.ts            DB seeder (runs on server start)
  /services          whatsapp.ts, reminders.ts (cron jobs)
  /middleware        auth.ts (JWT via HttpOnly cookies)
/shared
  schema.ts          Drizzle tables + Zod schemas (shared by client/server)
/script
  build.ts           Production build (esbuild + Vite)
```

## Dual Theme System

Two royal themes toggled via `data-side="groom"` or `data-side="bride"` on document root:
- **Groom (Ka)**: Cream (#EFE6D8), Gold (#B9975B), Charcoal (#2E2A27)
- **Bride (Himasree)**: Sindoor Red (#8B0000), Vermilion (#A1122F), Royal Gold (#C6A75E)

CSS custom properties (`--wedding-bg`, `--wedding-accent`, etc.) switch automatically. ThemeContext (`client/src/context/ThemeContext.tsx`) manages state. Apply theme via `useWeddingTheme()` hook.

## Database Patterns

**Storage Layer**: All DB operations go through `server/storage.ts` IStorage interface. Never import `db` directly in routes - use the `storage` singleton.

**Key Tables**:
- `wedding_config` - Singleton config (wedding date, venue, UPI, WhatsApp settings)
- `guests` - Guest list with unique `inviteSlug` for personalized URLs
- `wedding_events` - Events with timing, dress code, accommodation
- `message_logs` - WhatsApp audit trail (prevents duplicate sends)

**Schema Updates**: Edit `shared/schema.ts` → run `npm run db:push` to sync PostgreSQL.

## API Routes (server/routes.ts)

Public endpoints:
- `GET /api/config` - Wedding config (excludes admin password)
- `GET /api/invite/:slug` - Guest details by invite slug
- `POST /api/rsvp` - Submit RSVP (validates via `rsvpSubmitSchema`)
- `POST /api/rsvp/public` - Public RSVP form (creates new guest)

Protected endpoints (require `requireAdmin` middleware):
- `GET /api/admin/guests` - All guests with stats
- `POST /api/admin/guests` - Create guest (auto-generates slug)
- `PATCH /api/admin/config` - Update wedding config
- `POST /api/admin/whatsapp/send` - Manual WhatsApp send

Authentication: JWT stored in HttpOnly cookie (`admin_token`). Use `setAuthCookie(res, { userId, username })` on login.

## WhatsApp Integration

**Service**: `server/services/whatsapp.ts` - Meta WhatsApp Cloud API wrapper.

**Template-Based**: All messages use pre-approved WhatsApp templates. Template name + components passed to `sendWhatsAppMessage()`.

**Duplicate Prevention**: Check `checkDuplicateMessage(guestId, messageType)` before sending. Each send logged in `message_logs` table.

**Phone Format**: Normalize to E.164 without + (e.g., 919876543210) via `normalizePhone()`.

**Reminder Engine**: `server/services/reminders.ts` runs hourly cron job. Checks wedding date proximity and sends staged reminders (30d, 7d, 1d, morning, start, thank-you).

## Frontend Patterns

**Routing**: Wouter (not React Router). Routes in `client/src/App.tsx`:
- `/` → Home
- `/invite/:slug` → Personalized invite
- `/admin/login` → Admin auth
- `/admin` → Dashboard

**Data Fetching**: TanStack Query (React Query). Use `useQuery` with `queryFn: getQueryFn()` helper from `lib/queryClient.ts`. Mutations via `useMutation` with `apiRequest()` wrapper.

**Forms**: React Hook Form + Zod resolvers. Example: `useForm({ resolver: zodResolver(rsvpSubmitSchema) })`.

**Animations**: Framer Motion for page transitions and WaxSealIntro sequence.

**UI Components**: shadcn/ui in `client/src/components/ui/`. Customizable via Tailwind variants.

## Special Components

**WaxSealIntro** (`components/WaxSealIntro.tsx`): Cinematic fullscreen entrance with wax seal animation. Uses SVG clipPath + phase state machine. Plays crack sound on seal break. Must wrap in SealContext.

**KHCrest** (`components/KHCrest.tsx`): SVG royal emblem with interlocking "KH" initials. Used throughout for branding. Scalable via `size` prop.

**Header** (`components/Header.tsx`): Fixed header with theme toggle (groom/bride) and music mute button. Syncs with ThemeContext and MusicContext.

**FloatingContact** (`components/FloatingContact.tsx`): Floating chat widget. Phone numbers dynamically switch based on active theme (groom vs bride side).

## Development Workflow

**Local Dev**: `npm run dev` - starts Express dev server with Vite middleware (HMR enabled)

**Build**: `npm run build` - runs `script/build.ts` (bundles server with esbuild, client with Vite)

**Production**: `npm start` - serves static client from `dist/` via Express

**Database**:
- Connection via `DATABASE_URL` env var (PostgreSQL with SSL in production)
- Push schema changes: `npm run db:push` (Drizzle Kit)
- Seeding happens automatically on server start (`server/seed.ts`)

**Type Safety**: Run `npm run check` for TypeScript compilation check (no build).

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - JWT signing secret (defaults to insecure value if missing)

Optional (WhatsApp):
- `WHATSAPP_ACCESS_TOKEN` - Meta WhatsApp API token
- `WHATSAPP_PHONE_ID` - WhatsApp Business Phone Number ID
- `WHATSAPP_VERIFY_TOKEN` - Webhook verification token
- `WHATSAPP_WEBHOOK_SECRET` - Webhook signature verification

## Common Tasks

**Add new guest**: Admin dashboard → Guests tab → Create button. Slug auto-generated from name.

**Update wedding config**: Admin dashboard → Config tab. Changes reflect immediately on public site.

**Create WhatsApp template**: Templates must be pre-approved in Meta Business Suite. Reference by name in `sendWhatsAppMessage()`.

**Add new event**: Admin dashboard → Events tab. Include dress code, venue, timing for proper display.

**Customize theme colors**: Edit CSS custom properties in `client/src/index.css` under `[data-side="groom"]` or `[data-side="bride"]`.

## Testing Gotchas

- WhatsApp sandbox requires phone numbers to be registered first
- Admin auth requires `SESSION_SECRET` env var in production
- Invite slugs must be unique (enforced at DB level)
- Background music requires user interaction to start (browser autoplay policy)
- Wax seal animation triggers only once per session (localStorage flag)

## Security Notes

- Admin passwords hashed with bcrypt (10 rounds)
- JWT tokens HttpOnly + SameSite strict cookies
- Rate limiting on public RSVP endpoints (5 req/min per IP)
- WhatsApp webhook signature verification via HMAC-SHA256
- SQL injection prevented by Drizzle parameterized queries
- XSS protection via React's default escaping
