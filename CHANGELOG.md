# Wedding Invitation — Development Changelog
**Project:** Kaustav & Himasree — Wedding 2026
**Stack:** React + TypeScript + Vite + Express + PostgreSQL + Drizzle ORM + Framer Motion + Tailwind CSS

---

## Table of Contents
1. [Phase 1 — Core UI Fixes](#phase-1)
2. [Phase 2 — Hero & Section Refinements](#phase-2)
3. [Phase 3 — Hero Name Theming](#phase-3)
4. [Phase 4 — Wardrobe Planner — Live Data](#phase-4)
5. [Phase 5 — Brand Identity](#phase-5)
6. [Phase 6 — Bug Fixes: Views & Mobile UX](#phase-6)
7. [Phase 7 — Mobile Button Visibility Fix](#phase-7)
8. [Phase 8 — Side Switcher Mobile Fix](#phase-8)

---

## Architecture Overview

```
/client/src
  /pages          Home, Invite, AdminLogin, AdminDashboard
  /components     Header, SideSelectionLanding, ViewingSideOverlay,
                  CrestIntro, KHCrest, FloatingContact, WaxSealIntro
  /context        ThemeContext (dual theme), MusicContext, SealContext
/server
  routes.ts       All API endpoints
  storage.ts      DB abstraction layer (IStorage)
  db.ts           Drizzle ORM connection
  seed.ts         Auto-seeds DB on start
  /services       whatsapp.ts, reminders.ts (cron)
  /middleware     auth.ts (JWT via HttpOnly cookies)
/api
  index.ts        Vercel serverless entry point (mirrors server/routes.ts)
/shared
  schema.ts       Drizzle tables + Zod validators (source of truth)
```

### Dual Theme System
| Property | Groom (Ka) | Bride (Himasree) |
|---|---|---|
| Background | Cream `#EFE6D8` | Off-white `#F8F1E7` |
| Accent | Gold `#B9975B` | Sindoor Red `#8B0000` |
| Text | Charcoal `#2E2A27` | Deep Brown |
| CSS var | `--wedding-accent` | `--wedding-accent` |

Toggle via `data-side="groom"` / `data-side="bride"` on the document root. Managed by `ThemeContext` + `useWeddingTheme()` hook.

---

<a name="phase-1"></a>
## Phase 1 — Core UI Fixes

**Files changed:** `Header.tsx`, `Home.tsx`, `ViewingSideOverlay.tsx`

### 1.1 — Down Arrow Scroll
- **Problem:** Hero section down arrow was animated but clicking it did nothing.
- **Fix:** Added `onClick` handler calling `scrollToSection("find-invite")` on the arrow button.

### 1.2 — Navbar Improvements
- **Problem:** Hash fragments were being added to the URL on nav clicks; mobile menu stayed open after navigation.
- **Changes:**
  - `scrollToSection()` helper uses `el.scrollIntoView({ behavior: "smooth" })` + `window.history.replaceState(null, "", window.location.pathname)` — no hash in URL, no history entry.
  - All nav items changed from `<a href="#...">` to `<button onClick>`.
  - Mobile menu auto-closes after any nav click (`setMobileMenuOpen(false)`).
  - Added **"Find Your Invitation"** as a nav item pointing to `#find-invite`.

### 1.3 — Missing Events (Vidai & Bashi Biye)
- **Problem:** `EventsSection` was filtering events by the current `side`, hiding cross-side events like Vidai and Bashi Biye.
- **Fix:** Removed the side filter from `EventsSection` — all events are now always shown.

### 1.4 — Switch Side Overlay Sizing
- **Problem:** The "Viewing As" overlay widget was too large on mobile.
- **Fix:** Added responsive sizing (`px-3 py-2.5 sm:px-4 sm:py-3`, `text-sm sm:text-base`, `minWidth: 160px`).

### 1.5 — Venue & Travel Section
- **Changes:**
  - Added **Reception (Faridabad)** as a second venue tab alongside the existing venue.
  - Added 3 sub-section buttons inside each venue: **Map / Directions**, **Where to Stay**, **How to Reach**.
  - Sub-sections render conditionally on button click.

### 1.6 — Section Order
- **Old order:** Hero → Events → Story → RSVP → …
- **New order:** Hero → Find Your Invitation → Events → Venue & Travel → Wardrobe Planner → Our Story → RSVP → FAQs → Footer
- Alternating `--wedding-bg` / `--wedding-alt-bg` backgrounds between sections for visual rhythm.

---

<a name="phase-2"></a>
## Phase 2 — Hero & Section Refinements

**Files changed:** `Home.tsx`

### 2.1 — Hero Name Font Size
- **Problem:** Names were too large, felt overwhelming on mobile.
- **Old:** `text-6xl sm:text-8xl lg:text-9xl`
- **New:** `text-4xl sm:text-6xl lg:text-7xl`

### 2.2 — "Find by Invite" → "Find Your Invitation"
- Section title and nav label updated for better clarity.

### 2.3 — RSVP Scroll — Remove Hash
- **Problem:** The "Skip to RSVP" link in the Find Your Invitation section used `<a href="#rsvp">`, adding a hash to the URL.
- **Fix:** Changed to `<button onClick>` with `document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })` + `history.replaceState`.

### 2.4 — GoldDivider → SimpleDivider
- **Problem:** The `GoldDivider` component (a `KHCrest` SVG) was visually heavy and overused.
- **Replacement:** New `SimpleDivider` component — three small dots between two short horizontal lines using CSS custom properties for automatic theme adaptation.
- **Used in:** Our Story, Wedding Events, Venue & Travel, RSVP, Wardrobe Planner, Find Your Invitation, FAQs (7 sections).

```tsx
function SimpleDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 my-1">
      <div className="h-px w-16" style={{ background: "var(--wedding-border)" }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.5 }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.75 }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.5 }} />
      <div className="h-px w-16" style={{ background: "var(--wedding-border)" }} />
    </div>
  );
}
```

---

<a name="phase-3"></a>
## Phase 3 — Hero Name Theming

**Files changed:** `Home.tsx` (`HeroSection`)

### 3.1 — Per-Side Name Colors
| Element | Groom Side | Bride Side |
|---|---|---|
| Name color | `#8B6914` (dark antique gold) | `var(--wedding-accent)` (sindoor red) |
| "&" ampersand color | `#A1122F` (vermilion red) | `#C6A75E` (classic gold) |

```tsx
const { side } = useWeddingTheme();
const nameColor = side === "groom" ? "#8B6914" : "var(--wedding-accent)";
const ampColor  = side === "groom" ? "#A1122F" : "#C6A75E";
```

**Rationale:** On the groom side, the gold names with a red "&" create contrast; on the bride side, red names with a gold "&" mirror the palette inversion.

---

<a name="phase-4"></a>
## Phase 4 — Wardrobe Planner — Live API Data

**Files changed:** `Home.tsx` (`WardrobePlannerSection`)

### 4.1 — Drive Wardrobe Items from Live Events
- **Problem:** `WardrobePlannerSection` used a hardcoded static array of wardrobe tips that was out of sync with actual events in the database.
- **Fix:** Section now accepts an `events: WeddingEvent[]` prop and derives wardrobe items dynamically.

```tsx
function WardrobePlannerSection({ events }: { events: WeddingEvent[] }) {
  const wardrobeItems = events.map((ev) => ({
    event: ev.title,
    date: ev.eventDate,
    ...getWardrobeTip(ev.title, ev.dressCode),
  }));
  ...
}
```

### 4.2 — `getWardrobeTip()` Helper
Maps event title keywords and `dressCode` field → `{ style, desc, tip, footwear }`.

| Keyword match | Style label |
|---|---|
| "wedding" / "biye" | Royal Traditional |
| "reception" | Cocktail / Festive |
| "vidai" | Emotional Comfort |
| "mehndi" / "haldi" | Vibrant & Playful |
| default | Smart Festive |

---

<a name="phase-5"></a>
## Phase 5 — Brand Identity

**Files changed:** `client/index.html`, `client/public/favicon.svg` (new file)

### 5.1 — Custom Favicon
Created `/client/public/favicon.svg`:
- Dark charcoal circle (`#2E2A27`) with gold border (`#B9975B`)
- Inner dashed decorative ring
- "K & H" serif initials in gold with an italic "&" separator

### 5.2 — HTML Head Meta Tags
```html
<title>Kaustav &amp; Himasree — Wedding 2026</title>
<meta name="description" content="..." />
<meta name="author" content="Kaustav & Himasree" />
<meta name="theme-color" content="#2E2A27" />

<!-- Open Graph -->
<meta property="og:title" content="Kaustav &amp; Himasree — Wedding 2026" />
<meta property="og:description" content="..." />
<meta property="og:site_name" content="K &amp; H Wedding" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="Kaustav &amp; Himasree — Wedding 2026" />

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate icon" href="/favicon.png" />
```

---

<a name="phase-6"></a>
## Phase 6 — Bug Fixes: Website Views & Mobile UX

**Files changed:** `api/index.ts`, `SideSelectionLanding.tsx`

### 6.1 — Website Views Not Tracking in Production
- **Problem:** `POST /api/increment-view` existed in `server/routes.ts` (local dev Express) but was **missing from `api/index.ts`** (Vercel serverless entry). Every call from the frontend returned 404 in production — view count was always 0.
- **Fix:** Added the full route to `api/index.ts`:

```typescript
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";
import { weddingConfig } from "../shared/schema.js";

app.post("/api/increment-view", async (_req, res) => {
  const [updated] = await db
    .update(weddingConfig)
    .set({
      viewCount: sql`${weddingConfig.viewCount} + 1`,
      updatedAt: new Date(),
    })
    .returning({ viewCount: weddingConfig.viewCount });

  res.json({ viewCount: updated.viewCount });
});
```

- **Client-side guard** (`Home.tsx`) limits increments to once per browser session via `sessionStorage.getItem("view_counted")`.

### 6.2 — Side Selection Buttons: Mobile Mis-tap
- **Problem:** The side selection screen buttons (Bride's Side / Groom's Side) appeared mid-animation on mobile. The 0.3s delay + 0.7s duration meant buttons were visible and touchable during their entrance animation, causing accidental selections.
- **Original approach** used `onAnimationComplete` to set `buttonsReady`, but `onAnimationComplete` silently fails on iOS (Reduce Motion enabled, low-power mode).
- **Fix:** Replaced with `useEffect` + `setTimeout(1150ms)` (300ms delay + 700ms duration + 150ms buffer). Moved click guard to `disabled` prop on each button.

```tsx
useEffect(() => {
  const t = setTimeout(() => setButtonsReady(true), 1150);
  return () => clearTimeout(t);
}, []);

<motion.button disabled={!buttonsReady || !!selectedSide} onClick={() => handleSelect("bride")} ...>
```

---

<a name="phase-7"></a>
## Phase 7 — Mobile Button Visibility Fix

**Files changed:** `FloatingContact.tsx`

### 7.1 — Music Button Invisible on Mobile
- **Problem:** Music control button in `FloatingContact` had `initial={{ opacity: 0, scale: 0 }}` with `animate={{ opacity: 1, scale: 1 }}`. If Framer Motion's mount animation is dropped on mobile (low-power, Reduce Motion), the button stays at `scale: 0` — zero size, invisible.
- **Fix:** Removed `initial`, `animate`, and `transition` props. Button renders at full size immediately. Interactive `whileHover` / `whileTap` animations are retained.

---

<a name="phase-8"></a>
## Phase 8 — Side Switcher Mobile Fix (ViewingSideOverlay)

**Files changed:** `ViewingSideOverlay.tsx`

### 8.1 — Options Panel Flashes and Disappears on Mobile
- **Problem:** The "Viewing As" overlay used `onMouseEnter`/`onMouseLeave` to toggle options on desktop, plus `onTouchStart` for mobile. On mobile, `onTouchStart` opens the panel but `onMouseLeave` fires immediately after, collapsing it — net result: a visible flash with no usable interaction.
- **Root cause:** Mixing hover and touch events on the same state variable.

**Old code:**
```tsx
const [isHovered, setIsHovered] = useState(false);
...
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
onTouchStart={() => setIsHovered(true)}   // ← no close handler, broken
{isHovered && <OptionsPanel />}
```

**New behavior:**
- Single `isOpen` boolean toggled by a **tap/click** on the widget header.
- `useEffect` attaches `mousedown` + `touchstart` listeners to `document` when open — tapping outside closes the panel.
- Options panel closes itself after any action (switch side / back to selection).
- Chevron `▾` / `▴` icon indicates open/closed state.

```tsx
const [isOpen, setIsOpen] = useState(false);
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleOutside(e: MouseEvent | TouchEvent) {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }
  if (isOpen) {
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleOutside);
    document.removeEventListener("touchstart", handleOutside);
  };
}, [isOpen]);
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/config` | Public | Wedding config (no password hash) |
| POST | `/api/increment-view` | Public | Increment view counter |
| GET | `/api/events` | Public | All wedding events |
| GET | `/api/stories` | Public | Story milestones |
| GET | `/api/faqs` | Public | FAQs |
| GET | `/api/invite/:slug` | Public | Guest details by slug |
| POST | `/api/rsvp` | Public | Submit RSVP (known guest) |
| POST | `/api/rsvp/public` | Public | Submit RSVP (new guest) |
| POST | `/api/admin/login` | — | Admin auth (sets HttpOnly cookie) |
| GET | `/api/admin/guests` | Admin | All guests + stats |
| POST | `/api/admin/guests` | Admin | Create guest |
| PATCH | `/api/admin/config` | Admin | Update wedding config |
| POST | `/api/admin/whatsapp/send` | Admin | Manual WhatsApp send |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | JWT signing secret |
| `WHATSAPP_ACCESS_TOKEN` | Optional | Meta WhatsApp Cloud API token |
| `WHATSAPP_PHONE_ID` | Optional | WhatsApp Business phone number ID |
| `WHATSAPP_VERIFY_TOKEN` | Optional | Webhook verification token |
| `WHATSAPP_WEBHOOK_SECRET` | Optional | Webhook HMAC signature secret |

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (Express + Vite HMR on port 5000)
npm run dev

# TypeScript check (no emit)
npm run check

# Push schema changes to DB
npm run db:push

# Production build
npm run build

# Serve production build
npm start
```

---

*Last updated: March 2026*
