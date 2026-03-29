---
name: adoniz-design
description: Visual design system and content guidelines for the Adoniz landing page and all related web pages, components, and sections. Use this skill when building, styling, or editing any Adoniz frontend. Encodes the brand's color palette (60-30-10), typography, layout patterns, animation rules, component specs, and premium editorial aesthetic. The site must look like a $10,000 agency-designed page — surreal, editorial, premium, and unmistakably human-crafted.
---

# Adoniz — Design & Content System

This skill defines HOW Adoniz looks and feels. Every page, section, and component must follow these rules.

**The single test**: Would a senior creative director at a top agency approve this? If it looks like "a nice AI-generated website," it has failed.

---

## 1. Color System (60-30-10)

Use CSS custom properties. Never hardcode hex inline.

```css
:root {
  /* ─────────────────────────────────────────────
     60% DOMINANT — Brand Foundation
     Deep forest greens, blacks, whites, misty neutrals.
     Backgrounds, body text, hero sections, major surfaces.
     ───────────────────────────────────────────── */
  --adoniz-pine:           #003D31;   /* Primary dark green — navbars, hero bg, footer */
  --adoniz-forest:         #005840;   /* Heading text on light backgrounds */
  --adoniz-teal-spill:     #032425;   /* Deepest dark — dramatic sections */
  --adoniz-black:          #000000;   /* Pure black — body text, overlays */
  --adoniz-snow:           #F2F7F7;   /* Primary light background */
  --adoniz-lighthouse:     #F3F4F4;   /* Card backgrounds, secondary surfaces */
  --adoniz-mist:           #ECF0EF;   /* Section backgrounds, subtle dividers */
  --adoniz-white:          #FFFFFF;   /* Pure white */

  /* ─────────────────────────────────────────────
     30% SUPPORTING — Energy & Texture
     Electric limes, warm taupes, sage greens, grays.
     Accents, badges, highlights, hover states, secondary surfaces.
     ───────────────────────────────────────────── */
  --adoniz-fluorescent:    #F0FF3D;   /* Hero accent, highlight text, badges */
  --adoniz-electric-lime:  #D1F843;   /* Tags, pill buttons, active states */
  --adoniz-yellow-ace:     #F1FF58;   /* Hover states, secondary highlights */
  --adoniz-isotonic:       #DDFF55;   /* Alternative lime accent */
  --adoniz-cocoon:         #DEDBCC;   /* Warm neutral / stone surfaces */
  --adoniz-distant-cloud:  #E5EAE6;   /* Subtle dividers, card borders */
  --adoniz-cloudy:         #C0D8D7;   /* Soft sage surfaces */
  --adoniz-june-ivy:       #416858;   /* Mid-tone green — secondary text on dark */
  --adoniz-silver:         #BFCCF0;   /* Disabled states, inactive elements */

  /* ─────────────────────────────────────────────
     10% ACCENT — CTA Sparks & Special Moments
     Deep blues, lavenders, sky tones.
     Buttons, links, alerts, call-to-action elements.
     ───────────────────────────────────────────── */
  --adoniz-neptune:        #11425D;   /* Primary CTA button background */
  --adoniz-midnight:       #002233;   /* Dark CTA, overlay backgrounds */
  --adoniz-pacific:        #C0D6EA;   /* Info highlights, link underlines */
  --adoniz-grape:          #C5C0C9;   /* Secondary accent, muted badges */
  --adoniz-stormcloud:     #416870;   /* Teal CTA variant */
  --adoniz-cheviot:        #F6F2E8;   /* Warm light accent surfaces */
}
```

### Color Pairing Rules

- **Dark sections** (hero, CTA bands, footer): `--adoniz-pine` or `--adoniz-teal-spill` bg → `--adoniz-snow` text → `--adoniz-fluorescent` accent.
- **Light sections** (features, testimonials): `--adoniz-snow` or `--adoniz-white` bg → `--adoniz-forest` headings → `--adoniz-black` body.
- **Warm neutral sections** (trust, social proof): `--adoniz-cocoon` or `--adoniz-cheviot` bg → `--adoniz-pine` text.
- **Electric lime is NEVER a large-area background.** Use for badges, pills, highlighted words, small blocks, hover states only.
- **CTA buttons**: Primary = `--adoniz-fluorescent` bg + `--adoniz-pine` text. Secondary = `--adoniz-neptune` bg + `--adoniz-white` text. Outline = transparent + `--adoniz-pine` border.
- **Gradients**: Subtle dark-to-deeper-dark for hero (pine → teal-spill). Lime-to-transparent for decorative glows. NEVER garish rainbow or purple-to-blue.
- **Shadows**: Always tinted with brand green `rgba(0, 61, 49, 0.08)`, not generic gray `rgba(0,0,0,0.1)`.

---

## 2. Typography

### Font Stack
```css
/* Display / Headlines — pick ONE per build */
--font-display: 'Clash Display', 'Cabinet Grotesk', 'Satoshi', 'General Sans', sans-serif;

/* Body / UI — pick ONE per build */
--font-body: 'Satoshi', 'General Sans', 'Plus Jakarta Sans', 'DM Sans', sans-serif;

/* Mono / Data — for financial figures, code, data points */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

**NEVER use**: Inter, Roboto, Arial, Helvetica, Open Sans, system-ui as display font.

### Type Scale
```
Hero headline:        clamp(3.5rem, 8vw, 7rem)     weight: 800-900
Section headline:     clamp(2rem, 4vw, 3.5rem)      weight: 700-800
Sub-headline:         clamp(1.25rem, 2vw, 1.75rem)  weight: 500-600
Body large:           1.125rem (18px)                weight: 400
Body:                 1rem (16px)                    weight: 400
Caption / Small:      0.875rem (14px)                weight: 400
Overline / Label:     0.75rem (12px)                 weight: 600, letter-spacing: 0.1em, uppercase
```

### Typography Rules
1. **Headlines are BOLD and LARGE.** Hero headlines dominate the viewport.
2. **Mix weights dramatically.** 900-weight display paired with 300-weight body.
3. **Highlight key words** in accent color within sentences (e.g., "financial clarity" in `--adoniz-fluorescent`).
4. **Uppercase sparingly** — overline labels, CTA buttons, short badges only.
5. **Letter-spacing**: Tight (-0.02em to -0.04em) on display. Normal on body. Wide (0.08-0.12em) on overlines.
6. **Line-height**: 1.0–1.1 on display headlines. 1.5–1.7 on body text.

---

## 3. Layout Patterns

Never use the same layout pattern twice in a row. Alternate between these:

### Hero Section
- Full-viewport (100vh min), dark bg (pine or gradient to teal-spill).
- Massive headline (6-8rem), left-aligned or centered.
- Lighter-weight sub-headline below.
- 1-2 pill CTA buttons (48-56px tall, border-radius: 999px).
- Floating product mockup (chat interface or dashboard) on right or overlapping the fold.
- Background texture: noise grain, mesh gradient glow, or faint geometric grid.
- Trust bar below fold: partner logos, muted grayscale.

### Bento Grid Section
- CSS Grid with varied `grid-row` / `grid-column` spans.
- Mix: image cards, solid-color accent cards (lime), text cards, stat cards.
- Rounded corners (16-24px). Gap: 8-12px.
- Some cards 2x height, some 2x width. NEVER uniform.

### Feature Split Section
- Two-column (text left + visual right, or reversed).
- Large headline with highlighted keyword.
- 3-4 feature points with icons or numbered steps.
- Visual: app mockup, card UI, or abstract illustration.
- Generous padding (120-160px vertical).

### Numbered Steps / Process
- Large lime step numbers (4-6rem) in `--adoniz-fluorescent`: 01, 02, 03, 04.
- Bold title + brief description per step.
- Vertical timeline or stacked card layout.
- Optional connecting lines or progress indicators.

### Dark CTA Band
- Full-width, `--adoniz-pine` or `--adoniz-teal-spill` bg.
- Centered bold headline + sub-text.
- 1-2 pill CTA buttons.
- Optional decorative element (icon, lime accent shape).

### Testimonial / Social Proof
- Cards: avatar, quote, name, title.
- Horizontal scroll carousel or stacked grid.
- Subtle card border, light bg.
- Star ratings or metrics in `--adoniz-fluorescent`.

### Footer
- Dark bg (teal-spill or black). Multi-column links.
- Logo prominent top. Subtle divider line.
- Social icons: muted gray, lime on hover.

---

## 4. Components

### Buttons
```css
.btn-primary {
  background: var(--adoniz-fluorescent);
  color: var(--adoniz-pine);
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 999px;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:hover {
  background: var(--adoniz-yellow-ace);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(240, 255, 61, 0.25);
}
.btn-secondary { background: var(--adoniz-neptune); color: var(--adoniz-white); }
.btn-outline { background: transparent; border: 1.5px solid var(--adoniz-pine); color: var(--adoniz-pine); }
.btn-outline:hover { background: var(--adoniz-pine); color: var(--adoniz-snow); }
```

### Cards
- Border-radius: 16-24px. Background: white or lighthouse.
- Border: 1px solid distant-cloud (or none with tinted shadow).
- Padding: 24-32px. Hover: translateY(-4px) + shadow expansion.
- Dark cards: pine bg, snow text.

### Badges / Pills
- Background: fluorescent + pine text, OR pine + fluorescent text.
- border-radius: 999px. Padding: 6px 16px. Font: 12-13px, weight 600.

### Navigation
- Sticky, transparent on hero → solid on scroll (backdrop-filter: blur(16px)).
- Logo left, links center, CTA right.
- Active link: fluorescent underline or dot.
- Mobile: full-screen overlay with large type.

### Trust / Partner Logos
- Horizontal row, grayscale, opacity 0.4-0.6 (full on hover).
- 48-64px spacing between logos. Overline: "Trusted by" or "Works with."

---

## 5. Animation & Motion

### Principles
- Every animation has PURPOSE — entrance, state change, or guiding attention.
- Default easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
- Entrance easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Duration: 0.5-0.8s reveals, 0.2-0.3s micro-interactions.
- Always respect `prefers-reduced-motion`.

### Scroll-Triggered Reveals
```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
```
- IntersectionObserver triggers `.visible`.
- Stagger children: 0.08-0.12s incremental delay.

### Hero Entrance Choreography
1. Headline: fade up, 0.8s after load.
2. Sub-headline: +0.15s.
3. CTA buttons: +0.3s.
4. Product mockup: scale 0.9→1.0 + fade, +0.5s.

### Hover Micro-interactions
- Buttons: translateY(-2px) + shadow + color shift.
- Cards: translateY(-4px) + shadow grows.
- Links: underline slides in from left via `::after`.
- Images in cards: scale(1.03) with overflow:hidden.

### Parallax (Subtle)
- Background elements: 0.3x scroll speed.
- Decorative shapes: 0.1-0.2x scroll speed.
- NEVER on text.

### Number Counters
- Count 0 → target over 1.5-2s. IntersectionObserver triggered. Ease-out.

---

## 6. Visual Texture & Details

### Background Treatments
- **Noise grain**: SVG noise filter, 2-5% opacity on dark sections.
- **Mesh gradient glow**: Large soft radial of fluorescent at 5-10% opacity, off-center behind hero.
- **Geometric grid**: 1px lines, 3-5% opacity on dark backgrounds.
- **Section transitions**: 100-200px gradient fade between dark/light sections (not hard breaks).

### Decorative Elements
- Small lime accent shapes (circles, rounded rects) floating in compositions.
- Thin decorative lines connecting sections or framing content.
- Large watermark typography ("Adoniz" at massive scale, 3-5% opacity) in section backgrounds.

### Image Treatment
- Mockups: slight perspective tilt (rotateY 5-10deg) with deep shadow.
- Icons: custom line icons, 1.5-2px stroke in pine or forest.
- NEVER generic stock illustrations or default icon libraries.

---

## 7. Responsive Design

```css
@media (min-width: 640px)  { /* tablet portrait */ }
@media (min-width: 1024px) { /* tablet landscape / small desktop */ }
@media (min-width: 1280px) { /* desktop */ }
@media (min-width: 1536px) { /* large desktop */ }
```

- Hero headline: 2.5rem (mobile) → 7rem (desktop) via clamp().
- Bento grid: collapses to single column on mobile.
- Nav: hamburger below 1024px → full-screen overlay.
- Section padding: 60px (mobile) → 120-160px (desktop).
- Feature splits: stack vertically on mobile (image above text).
- Trust logos: horizontal scroll on mobile.

---

## 8. Anti-Patterns (NEVER DO THIS)

1. **Inter/Roboto/Arial** as display font — hallmark of AI.
2. **Purple gradients on white** — #1 AI design tell.
3. **Uniform 3-card grids** — always vary card sizing.
4. **Gray box-shadow: 0 2px 4px rgba(0,0,0,0.1)** — use tinted shadows.
5. **Centered everything** — use asymmetry.
6. **Icon-in-circle pattern** repeated 3-6x — find creative alternatives.
7. **"Get Started" as only CTA copy** — be specific and action-oriented.
8. **Flat lifeless sections** — no texture, no depth.
9. **Stock blob-people illustrations**.
10. **Identical spacing everywhere** — sections breathe differently.
11. **No hover/active states** — every interactive element needs them.
12. **No scroll animations** — premium sites reveal on scroll.
13. **Lorem ipsum or generic placeholder copy**.

---

## 9. Tech Stack

- **Framework**: Next.js (App Router) or HTML/CSS/JS for simple pages.
- **Styling**: Tailwind CSS preferred, CSS custom properties for color system.
- **Animations**: Framer Motion (React) or GSAP. CSS-only for hover states.
- **Fonts**: Google Fonts or Fontsource. Always `font-display: swap`.
- **Images**: `<picture>` with WebP + fallback. Lazy load below fold.
- **Performance**: Target 90+ Lighthouse. No layout shift. Preload hero fonts/images.

---

## 10. Reference Aesthetic DNA

The Adoniz website draws from:

- **Velto**: Bold condensed headlines, lime-on-dark hero, floating card mockups, trust badges, alternating dark/light sections.
- **AMPDRIVE**: Dark editorial layout, lime step numbers (01-04), accordion nav, dramatic typography, photography with dark overlays.
- **Bento courses page**: Mixed-size card grids, neon lime blocks, B&W photography mixed with color pops, brutalist-editorial energy.
- **ABINR**: Elegant white sections, green-highlighted keywords in body copy, card-based UI mockups, numbered steps, partner logo bar.

**Unifying thread**: Editorial confidence. Every element placed with intention. White space generous but purposeful. Color sparingly used with maximum impact. Typography is the hero. The lime accent is the signature — small, electric bursts, never overwhelming.
