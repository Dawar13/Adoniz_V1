# Adoniz V1 — Landing Page: Knowledge Transfer

**Project:** Adoniz — AI Voice of Customer Intelligence
**Type:** Marketing / landing page (frontend only, no backend)
**Working directory:** `c:\Users\djtde\Downloads\Adoniz_V1\`
**Last updated:** 2026-03-30

---

## 1. Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.1 |
| UI Library | React | 19.2.4 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS v4 + CSS custom properties | 4.x |
| Animation | Framer Motion | 12.38.0 |
| Fonts | Google Fonts via `next/font/google` | — |
| Package manager | npm | — |
| Build toolchain | Turbopack (default in Next 16) | — |

**No backend. No database. No API routes.** Everything is static/client-rendered UI.

---

## 2. Repository Structure

```
Adoniz_V1/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, body wrapper
│   ├── page.tsx            # Single page — renders all sections in order
│   └── globals.css         # Design tokens, keyframes, all mobile CSS
│
├── components/
│   ├── navbar/             Navbar.tsx
│   ├── hero/               HeroSection.tsx
│   ├── device-showcase/    DeviceShowcase.tsx
│   ├── features/           FeaturesSection.tsx
│   ├── connections/        ConnectionsSection.tsx
│   ├── filters/            FiltersSection.tsx
│   ├── cta/                CTASection.tsx
│   ├── footer/             Footer.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── GradientBlob.tsx
│       └── ScrollReveal.tsx
│
├── hooks/
│   ├── useScrollPosition.ts   window.scrollY listener (passive)
│   ├── useIsMobile.ts         window.matchMedia ≤767px — SSR-safe
│   └── useInView.ts           IntersectionObserver wrapper
│
├── lib/
│   └── constants.ts        All copy, data arrays, integration logos
│
├── public/
│   ├── logos/              15 integration logo PNGs + adoniz-logo.svg
│   └── images/
│       └── people/         5 avatar PNGs for hero trust row
│
├── next.config.ts          Empty (no overrides needed)
├── tsconfig.json           Strict, bundler resolution, @/* path alias
└── package.json
```

**Path alias:** `@/*` maps to the project root. So `@/lib/constants` resolves to `lib/constants.ts`.

---

## 3. Design System

### 3.1 Color Tokens

Defined twice — in `@theme {}` for Tailwind utilities, and in `:root {}` for raw CSS variable access. Both must stay in sync.

```
60% Dominant (backgrounds, text):
  --adoniz-pine:          #003D31   (deep forest green — primary CTA bg)
  --adoniz-forest:        #005840   (slightly lighter — hover states, links)
  --adoniz-teal-spill:    #032425   (darkest — footer bg)
  --adoniz-device-green:  #013540   (device showcase section bg)
  --adoniz-snow:          #F2F7F7   (light section bg)
  --adoniz-lighthouse:    #F3F4F4   (card bg, browser bars)
  --adoniz-mist:          #ECF0EF   (subtle backgrounds, pills)

30% Supporting (UI elements):
  --adoniz-fluorescent:   #F0FF3D   (primary CTA button, accent text)
  --adoniz-electric-lime: #D1F843   (active states, highlights)
  --adoniz-yellow-ace:    #F1FF58   (hover state of fluorescent)
  --adoniz-distant-cloud: #E5EAE6   (borders, dividers)
  --adoniz-june-ivy:      #416858   (muted green text/elements)

10% Accent (use sparingly):
  --adoniz-neptune:       #11425D
  --adoniz-midnight:      #002233
```

### 3.2 Typography

Three fonts loaded via `next/font/google`, injected as CSS variables:

| Variable | Font | Usage |
|---|---|---|
| `--font-serif` | Instrument Serif (400, normal+italic) | Section headings, italic emphasis |
| `--font-sans` | Plus Jakarta Sans (300–800) | Everything else |
| `--font-mono` | JetBrains Mono (400, 500, 600) | Data values in dashboard |

**Font size pattern:** `clamp(min, viewport-unit, max)` everywhere — no fixed px headlines.

### 3.3 Easing

Two named easings used consistently:

```js
const EASE = [0.16, 1, 0.3, 1]   // Entrance — fast-out spring feel
// CSS: --ease-entrance: cubic-bezier(0.16, 1, 0.3, 1)
// CSS: --ease-default:  cubic-bezier(0.4, 0, 0.2, 1)
```

### 3.4 Spacing / Breakpoints

Tailwind v4 is configured in `globals.css` via `@import "tailwindcss"` and `@theme {}`. No `tailwind.config.ts` file exists — that's intentional for v4.

Mobile breakpoints (custom, enforced via `@media` rules in globals.css):
- `≤480px` — narrow mobile (hero CTA stack)
- `≤639px` — mobile (trust row, CTA form, marquee)
- `≤767px` — all mobile (navbar, dashboard, footer, blobs, device frames)
- `≥1024px` — desktop (Tailwind's `lg:` prefix)

---

## 4. Page Architecture

`app/page.tsx` renders every section sequentially. Gradient transition divs are inserted between sections to create seamless color fades:

```
Navbar                     (fixed, z-50)
├── HeroSection            bg: white → fades to #013540 at bottom
├── DeviceShowcase         bg: #013540 (device-green), contains FeatureMarquee
├── TransitionGreenToWhite 200px gradient strip
├── FeaturesSection        bg: #F2F7F7 (snow)
├── ConnectionsSection     bg: #FFFFFF
├── FiltersSection         bg: #F2F7F7 (snow)
├── TransitionWhiteToDark  300px gradient strip
├── CTASection             bg: pine → teal-spill gradient
├── TransitionDarkToFooter 100px gradient strip
└── Footer                 bg: #032425 (teal-spill)
```

---

## 5. Component Reference

### 5.1 Navbar (`components/navbar/Navbar.tsx`)

**Behavior:**
- `position: fixed`, `z-50`, always on top
- Unscrolled state: transparent, full-width, no border
- Scrolled state (> 80px): liquid glass capsule morphs in
  - Desktop: `minWidth: 800px`, `borderRadius: 18px`, floating capsule with shadow
  - Mobile: full-width bar, no capsule morph

**Liquid glass effect (3-layer stack):**
1. **Displacement layer** — `<div style={{ filter: "url(#navbar-glass)" backdropFilter: "blur(3px)" }}>` — SVG `feDisplacementMap` warps pixels beneath
2. **White tint layer** — `rgba(255,255,255,0.52)` semi-transparent fill
3. **Sheen layer** (desktop only) — inset `box-shadow` for highlight edge

**SVG filter pipeline:**
```
feTurbulence → feComponentTransfer → feGaussianBlur
→ feSpecularLighting → feComposite → feDisplacementMap
```
Two filters exist: `#navbar-glass` (desktop, scale=90) and `#navbar-glass-mobile` (mobile, scale=60, softer turbulence).

**Mobile menu:** Slides in from right (`x: "100%" → 0`) using `AnimatePresence`. Full-screen dark pine overlay with large nav links and two CTA buttons at the bottom.

**Key hooks:** `useScrollPosition()`, `useIsMobile()`

---

### 5.2 HeroSection (`components/hero/HeroSection.tsx`)

**Layout:** Centered flex column, `min-height: 100vh`, gradient background fading from white to `#013540`.

**Sub-components:**
- `AvatarStack` — 5 overlapping avatar images + "Trusted by 200+ early SaaS teams"
- `BookDemoButton` — custom compound button (fluorescent icon block + dark label)
- `SearchBar` — fake AI search input with lime focus ring, "Analyze" button

**Background layers (bottom-up):**
1. White-to-dark CSS gradient on section
2. `<GradientBlob />` — 3 animated color blobs (drift-1/2/3 keyframes)
3. Geometric grid overlay (`repeating-linear-gradient`, opacity 0.025)

**CSS classes used:** `hero-cta-row`, `trust-row`, `trust-text`, `hero-search-input`, `btn-book-demo`

**Mobile:** CTA buttons stack vertically at ≤480px. Avatar + text stack vertically at ≤639px.

---

### 5.3 DeviceShowcase (`components/device-showcase/DeviceShowcase.tsx`)

Most complex component. Contains:

**`AnimatedQA`** — 6-phase state machine:
```
idle → typing → loading → response → cursor → analytics → idle
```
- `typing`: types `QUERY_TEXT` at 30ms/char with blinking cursor
- `loading`: 580ms bouncing dots
- `response`: AI numbered response with "View Analytics →" link
- `cursor`: SVG cursor animates to hover/click the link
- `analytics`: horizontal bar chart reveals via `width: 0 → N%`
- Loops every ~8s total

**`WhiteDashboard`** — simulated SaaS dashboard:
- macOS window chrome (traffic light dots, URL bar)
- Green sidebar (Adoniz branding, nav items, workspace badge)
- 4 stat cards with `CountUp` animation
- Donut chart (SVG `stroke-dasharray` trick) + category bars
- Recent conversations table
- AnimatedQA embedded at bottom

**`PhoneContent`** — simulated mobile app:
- Fake iOS status bar (time, signal SVG, WiFi SVG, battery SVG)
- 2×2 stat grid with CountUp
- Mini bar chart (7-day sentiment)
- Trending topic pills
- Recent conversation list
- AI search bar at bottom

**`LaptopFrame` / `PhoneFrame`** — titanium-colored device bezels built entirely from CSS gradients + SVG-free. No images used.

**`FeatureMarquee`** — infinite horizontal scroll of feature pills. Powered by `marquee-track` CSS class + `translateX(-50%)` animation.

**Mobile CSS classes:** `device-laptop`, `device-phone`, `white-dashboard`, `dashboard-sidebar`, `dashboard-stats`, `dashboard-charts`, `dashboard-recent`

---

### 5.4 FeaturesSection (`components/features/FeaturesSection.tsx`)

**Bento grid layout** — 6 cards defined in `lib/constants.ts` as `FEATURES[]`. Each has:
- `span`: Tailwind `col-span-N row-span-N` string applied dynamically
- `dark`: boolean — dark pine background variant
- `muted`: boolean — reduced opacity variant

**Special card content:**
- **Ingestion card** — logo strip with 5 integration logos
- **PII card** — animated redaction chips cycling through fake emails/IDs
- **Q&A card** (dark, `row-span-2`) — `ask-your-data.png` image mockup
- **Sentiment card** — `SentimentChart`: smooth SVG area chart with:
  - Catmull-Rom → cubic bezier conversion for organic curves
  - `pathLength: 0 → 1` draw animation on viewport entry
  - `linearGradient` green fill beneath line
  - Animated dot on last data point
- **Theme card** — cycling color tag pills
- **Summaries card** — stacked one-line summary items

**CSS classes:** `bento-grid`, `bento-filler`

---

### 5.5 ConnectionsSection (`components/connections/ConnectionsSection.tsx`)

**The sticky scroll pattern:**
- Outer div: `height: 300vh`, `position: relative`
- Inner div: `position: sticky; top: 0; height: 100vh`
- Scroll progress: `getBoundingClientRect()` on outer div, `progress = -rect.top / (rect.height - window.innerHeight)`
- `window.addEventListener("scroll", handler, { passive: true })`

This creates the "freeze and animate" effect — the viewport appears locked while the user scrolls 200vh of invisible distance.

**Orbital layout math:**
```ts
function ellipsePos(angleDeg, rx, ry) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cos(rad) * rx, y: sin(rad) * ry };
}
```
Inner ring: 7 logos evenly distributed at 0°, 51°, 103°... around an ellipse
Outer ring: 7 logos offset by half-step (`+ 360/(n*2)`) to interleave with inner

**Stagger order:** `INNER_STAGGER = [0,4,2,5,1,3,6]` — logos don't reveal left-to-right, they alternate sides for visual interest.

**Line drawing:** SVG `stroke-dasharray = length`, `stroke-dashoffset = length * (1 - progress)` — classic SVG path draw trick.

**Responsive dimensions:**

| Dimension | Desktop | Mobile (≤767px) |
|---|---|---|
| Canvas W×H | 860×460 | 360×340 |
| Inner RX/RY | 210/100 | 90/72 |
| Outer RX/RY | 410/195 | 160/130 |
| Logo size | 52px | 36px |

---

### 5.6 FiltersSection (`components/filters/FiltersSection.tsx`)

**Left side:** Static content — badge, h2, body copy, 3 feature-point table rows, CTA button.

**Right side:** Interactive browser-chrome mockup:
- Toggle pills (`FILTER_CATEGORIES`) control which conversations show
- `MOCK_CONVERSATIONS[]` filtered by active categories
- Each conversation card: sentiment dot + colored badge + category badge + summary text
- Framer Motion `layout` prop enables smooth reflow animation when cards appear/disappear

**CSS classes:** `filter-pills-row` (horizontal scroll on mobile, prevents wrapping to circles)

---

### 5.7 CTASection (`components/cta/CTASection.tsx`)

Simple email capture form. States:
- Default: email input + "Get Early Access" button
- Submitted: replaced by "✓ You're on the list!" confirmation div

Background: `linear-gradient(160deg, pine, teal-spill)` + radial lime glow + subtle grid overlay.

**CSS class:** `cta-form` — stacks vertically on mobile ≤639px, both input and button become `width: 100%, height: 56px`.

---

### 5.8 Footer (`components/footer/Footer.tsx`)

**Top section:** `footer-top-grid` — 4 column CSS grid with link columns: Product, Social, Address, Contact.
- Desktop: `grid-cols-4`, dividers between columns
- Mobile: stays `repeat(4,1fr)`, dividers removed, fonts shrink to 11px

**Bottom section:** `footer-bottom-grid` — `30% 1fr` grid:
- Left (`footer-left-panel`): Adoniz logo, DecorativeMark SVG (concentric circles), copyright
- Right (`footer-wordmark-cell`): Massive "Adoniz" wordmark at `opacity: 0.28`, `fontSize: clamp(8rem, 18vw, 16rem)`

**Mobile overrides:**
- Left panel hidden completely
- Wordmark cell takes full width, `padding: 0`, `font-size: 28vw`
- Mobile-only copyright line (`footer-mobile-copy`) shown instead

---

### 5.9 UI Components (`components/ui/`)

**`GradientBlob`** — Three absolutely positioned divs with large `blur()` filters, animated via `drift-1/2/3` CSS keyframes (80s, 70s, 90s loops). On mobile: blob-3 hidden, blur reduced.

**`ScrollReveal`** — Framer Motion wrapper that animates children `opacity: 0→1` + directional translate. Configurable: `direction`, `distance`, `delay`, `duration`, `once`.

**`StaggerContainer` / `StaggerItem`** — Companion components for stagger-reveal patterns. `StaggerContainer` sets a `initialDelay` and `staggerDelay`, `StaggerItem` reads from context.

**`Button`** — Variants: `primary` (fluorescent bg), `secondary` (pine bg), `outline` (pine border), `ghost` (transparent). Sizes: `sm/md/lg`.

**`Badge`** — Small label pill. Variants: `lime`, `pine`, `mist`, `new`.

---

## 6. Custom Hooks

### `useScrollPosition()`
```ts
// Returns window.scrollY, updated on every scroll event (passive).
// Used in Navbar to detect scrolled > 80px.
```

### `useIsMobile(breakpoint = 767)`
```ts
// SSR-safe: starts false, updates after mount via window.matchMedia.
// Used in Navbar (different animate values), ConnectionsSection (orbital radii),
// DeviceShowcase (nothing direct), FeaturesSection (stagger delay).
// breakpoint is configurable — pass 1023 for tablet detection.
```

### `useInView(options)`
```ts
// IntersectionObserver wrapper. Returns { ref, inView }.
// Options: threshold (default 0.1), rootMargin (default "0px 0px -60px 0px"), once (default true).
// Note: Framer Motion's useInView is also used directly in some components.
```

---

## 7. `lib/constants.ts` — Data Reference

All user-visible copy and data arrays live here. To update content, only touch this file.

| Export | Type | Used in |
|---|---|---|
| `NAV_LINKS` | `{label, href}[]` | Navbar |
| `HERO_BADGE_TEXT` | string | HeroSection |
| `HERO_SUBHEADLINE` | string | HeroSection |
| `DEVICE_QUOTE` | string | DeviceShowcase (not used directly — inline) |
| `MARQUEE_ITEMS` | string[] | DeviceShowcase FeatureMarquee |
| `INTEGRATIONS_INNER` | `{name, file}[]` | ConnectionsSection (inner ring, 7 logos) |
| `INTEGRATIONS_OUTER` | `{name, file}[]` | ConnectionsSection (outer ring, 7 logos) |
| `INTEGRATIONS_ALL` | flat concat of above | (legacy, currently unused) |
| `FEATURES` | complex object[] | FeaturesSection bento grid |
| `FILTER_CATEGORIES` | `{label, active}[]` | FiltersSection pills |
| `MOCK_CONVERSATIONS` | `{sentiment, category, summary}[]` | FiltersSection cards |

**To add a new integration:** Drop the logo PNG in `public/logos/`, add `{ name: "...", file: "....png" }` to either `INTEGRATIONS_INNER` or `INTEGRATIONS_OUTER` in constants.ts. The orbital system auto-distributes logos evenly — no coordinate math needed.

---

## 8. CSS Architecture

All CSS lives in one file: `app/globals.css`. It is structured in this order:

1. `@import "tailwindcss"` — pulls in Tailwind v4
2. `@theme {}` — Tailwind token registration (maps design tokens to utility classes)
3. `:root {}` — CSS custom properties (same tokens, accessible via `var(--adoniz-*)`)
4. Base reset (`box-sizing`, `html`, `body`)
5. Typography helpers (`.font-serif`, `.font-sans`, `.font-mono`)
6. Component-specific global styles:
   - `.blob-1/2/3` + drift keyframes
   - `.marquee-track` + marquee keyframe
   - `.btn-book-demo` full button styles + `icon-slide-right` keyframe
   - `.nav-link` underline hover
   - `.hero-search-input::placeholder` italic-only placeholder
   - `.typing-cursor` blink keyframe
7. Scrollbar styling
8. `@media (prefers-reduced-motion)` — disables blobs, marquee
9. **Mobile section** (all `@media` rules below `≤767px`):
   - Global overflow clip
   - Touch targets (44px min-height)
   - Blob simplification
   - Hero CTA stack (≤480px)
   - Trust row stack (≤639px)
   - Bento grid single column
   - CTA form stack + height (≤639px)
   - Footer grid adjustments
   - Marquee sizing
   - Device frame scaling + hiding
   - Dashboard simplification + zoom
   - Filter pills fix
   - Navbar full-width override

**Important CSS gotcha:** `overflow-x: hidden` on `<body>` breaks `position: sticky` in Chrome (body becomes the scroll container). This project uses `overflow-x: clip` instead — it clips horizontal overflow without creating a new scroll container, so sticky still works correctly.

---

## 9. Animation Patterns

### Scroll-driven reveal (Framer Motion)
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
>
```
Used on almost every section heading and content block.

### Sticky scroll progress
```ts
// ConnectionsSection
useEffect(() => {
  const handler = () => {
    const rect = outerRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
    setProgress(p);
  };
  window.addEventListener("scroll", handler, { passive: true });
}, []);
```

### SVG path draw
```tsx
// SentimentChart in FeaturesSection
<motion.path
  d={smoothPath}
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 1.4, ease: EASE }}
/>
```

### Count-up
```ts
// CountUp in DeviceShowcase
const run = (now) => {
  const t = Math.min((now - startTime) / (duration * 1000), 1);
  const eased = 1 - Math.pow(1 - t, 3);  // ease-out cubic
  setCount(Math.round(eased * to));
  if (t < 1) requestAnimationFrame(run);
};
requestAnimationFrame(run);
```

### SVG line draw (orbital connections)
```ts
// strokeDasharray trick
const len = Math.sqrt(pos.x ** 2 + pos.y ** 2);
strokeDasharray={len}
strokeDashoffset={len * (1 - lineP)}  // lineP: 0→1 from scroll progress
```

---

## 10. Public Assets

```
/public/logos/
  adoniz-logo.svg          Brand mark (used in navbar, footer, orbital capsule)
  Intercom.png             }
  Slack.png                }
  Gmail.png                } Inner ring integrations (7)
  Zendesk.png              }
  Hubspot.png              }
  Mixpanel.png             }
  Salesforce.png           }
  Amplitude.png            }
  Discord.png              }
  Gorgias.png              } Outer ring integrations (7)
  Jira.png                 }
  Linear.png               }
  ms-teams.png             }
  Notion.png               }

/public/images/people/
  avatar-1.png … avatar-5.png    Hero trust row avatars

/public/images/
  ask-your-data.png              Used in Features Q&A card
```

All logo files are referenced by filename in `lib/constants.ts`. Adding a new integration = add PNG to `/public/logos/` + add entry to constants.

---

## 11. Running Locally

```bash
cd c:\Users\djtde\Downloads\Adoniz_V1
npm install       # already done
npm run dev       # starts on http://localhost:3000 (or 3001 if 3000 is taken)
npm run build     # production build
npm run start     # serve production build
```

**No environment variables required.** No `.env` file needed to run the landing page.

---

## 12. Known Quirks & Non-obvious Decisions

| # | Quirk | Why |
|---|---|---|
| 1 | `overflow-x: clip` on body (not `hidden`) | `hidden` makes body the scroll container, breaking `position: sticky` in Chrome |
| 2 | Tailwind v4 uses `@theme {}` not `tailwind.config.ts` | v4 breaking change — config is in CSS now |
| 3 | All Framer Motion `animate` values are objects, not variants | Allows direct value interpolation from scroll progress without variant lookup overhead |
| 4 | `useIsMobile` starts as `false` on SSR | Prevents hydration mismatch — mobile layout kicks in after mount |
| 5 | Orbital logos use precomputed position arrays | SVG lines and DOM logos must share the same `ellipsePos()` result; if either recalculates independently you get coordinate mismatch |
| 6 | `zoom: 0.72` on `.white-dashboard` mobile | CSS `transform: scale()` breaks sticky/fixed children; `zoom` is the only property that scales layout without creating a new stacking context |
| 7 | SVG filter `filterUnits="objectBoundingBox"` on navbar-glass | Makes coordinates relative to element size — the filter scales with the capsule as it morphs from full-width to pill |
| 8 | No `next.config.ts` overrides | The Turbopack multi-lockfile warning is cosmetic (caused by a `package-lock.json` in a parent directory) and doesn't affect builds |
| 9 | `INTEGRATIONS_ALL` exported but unused | Legacy from when mobile used a static grid; kept in constants for future use |
| 10 | `CountUp` uses `requestAnimationFrame` not CSS transitions | Allows easing function control (ease-out cubic) and gives access to the numeric value for rendering |
