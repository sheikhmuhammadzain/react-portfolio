# CSS Theme Guide

## Theme Summary
- Design direction: dark, high-contrast, neon-accent portfolio UI.
- Styling system: Tailwind CSS utility classes + a few custom global classes in `src/index.css`.
- Tailwind config: no custom token extension yet (`tailwind.config.js` uses default palette + typography plugin).

## Core Colors

### Base Neutrals (Primary UI)
- `bg-neutral-950`: main page/background shell.
- `bg-neutral-900`, `bg-neutral-900/50`, `bg-neutral-800`, `bg-neutral-800/50`: cards, panels, chat areas.
- `border-neutral-900`, `border-neutral-800`, `border-neutral-700`: structure and separators.
- `text-neutral-100` to `text-neutral-600`: hierarchy from headings to muted helper text.

### Brand Accent (Purple)
- `bg-purple-600`, `bg-purple-500`, `text-purple-400`, `border-purple-500`.
- Used for: CTAs, active states, chat user bubble, highlight links, icon glow.

### Secondary Accent (Cyan)
- `text-cyan-400`, `bg-cyan-300` (selection), `text-cyan-*` on admin/context menu flows.
- Used for: secondary highlights and command/context affordances.

### Status Colors
- Success: `text-green-500`, `bg-green-500`.
- Warning: `text-yellow-400`, `bg-yellow-900/10`.
- Error: `text-red-400`, `bg-red-900/10`.

## Typography
- Global font: `Inter` (`:root { font-family: 'Inter', sans-serif; }`).
- Rendering: `antialiased` on main app wrapper.
- Markdown responses in chat use `prose prose-sm prose-invert`.

## Backgrounds and Atmosphere
- Main backdrop uses radial gradient:
  - `bg-neutral-950`
  - `bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]`
- This creates the subtle purple glow in the top area.

## Global Custom Classes

### `glass-ios-16`
- Purpose: translucent “liquid glass” surface.
- Uses:
  - `background: rgba(30,30,30,0.2)`
  - `backdrop-filter: blur(4px)`
  - layered inner/outer shadows for frosted depth
- Hover state darkens slightly (`rgba(40,40,40,0.3)`).

### `matrix-theme` (optional mode overrides)
- Recolors purple/cyan accents to green:
  - primary neon: `#00ff41`
  - dark green bg: `#003b00`
  - selection: `#008f11`
- Applies overrides to common utility classes via `!important`.

### `mac-key`
- Hyper-realistic keyboard key style for UI micro-elements.
- Uses gradient dark cap, top highlight, bottom depth border, press-down active transform.

## Component Surface Patterns
- Standard card: `rounded-2xl border border-neutral-800 bg-neutral-900`.
- Elevated/interactive card: add `shadow-*` and hover border/accent transitions.
- Chat assistant bubble: neutral surface + border.
- Chat user bubble: purple filled surface (`bg-purple-600 text-white`).

## Motion and Accessibility
- Reduced motion respected globally via `@media (prefers-reduced-motion: reduce)`.
- Custom spinner animation available via `.animate-spin`.
- Scrollbars are custom-themed for WebKit + Firefox.

## Layout Conventions
- App container: `container mx-auto px-4 sm:px-8`.
- Mobile-first responsive utilities across components.
- `min-h-screen` and `overflow-x-hidden` used globally to prevent horizontal bleed.

## Consistency Rules (Recommended)
- Keep `neutral` palette for all base surfaces and text hierarchy.
- Use purple for primary actions and identity.
- Use cyan only for secondary emphasis and system-like interactions.
- Reserve red/yellow/green for semantic status only.
- Reuse `glass-ios-16` instead of creating ad-hoc blur cards.

## Source of Truth
- Global theme/CSS: `src/index.css`
- Utility system config: `tailwind.config.js`
- App shell + background atmosphere: `src/App.jsx`
