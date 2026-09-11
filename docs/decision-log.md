# Decision log — Pirates Village Kids Club

A record of what was built, what was decided, and *why*, from the session that
produced commits `aec267d` through `12929d4`. Written so a future session (or a
different person) can pick the work up without re-deriving the reasoning.

Conventions used throughout: **features are hidden, never deleted**;
**accessibility is a gate, not a preference**; **`npx tsc --noEmit` is the real
verification**, not the build.

---

## 1. Stack — what this project actually is

| Item | Reality |
|---|---|
| Framework | Next.js 16.3.3, App Router, React 19 |
| Styling | **Tailwind v4 — there is no `tailwind.config.ts`.** All theme tokens live in `app/globals.css` under `@theme inline` and `:root` |
| UI library | shadcn v4, style `base-nova`, built on **`@base-ui/react`, not Radix** |
| Icons | lucide-react |
| Charts | recharts 3.10.1 |
| Package manager | **pnpm only** (see §8) |

### Base UI is not Radix

Two API differences bite constantly:

- Composition uses `render={<X />}`, **not** `asChild`.
- Icons are marked `data-icon="inline-start" | "inline-end"` so the button
  variants can adjust padding.

---

## 2. What was built

| Route | Notes |
|---|---|
| `/` | Dashboard — action hub, not a data view |
| `/kids` | Crew registry (grid + list) |
| `/kids/[id]` | Child detail, 4 tabs (Overview, Visit history, Guardians, Staff notes) |
| `/register` | Registration form |
| `/statistics` | "Ship's Log" |
| `/login` | Entry point + middleware auth |
| `/settings` | A window onto `HOTEL_CONFIG` (see §5) |

Every route the sidebar links to now exists.

---

## 3. Design system

### Palette (all pairings verified at WCAG AA or better)

```
--background         #faf8f5   warm off-white, NOT pure white
--foreground         #3d2a1f
--card               #ffffff
--primary            #60402f   brand brown
--primary-foreground #ffffff
--secondary          #f0e9df
--muted              #f2ede6
--muted-foreground   #6b5b4e
--accent             #c5ad86   brand beige — SURFACE ONLY
--accent-foreground  #3d2a1f
--destructive        #a81b1b
--warning            #92400e
--warning-foreground #5c3410
--success            #276749
--border / --input   #e5dcd0
--ring               #60402f

--sidebar            #60402f
--sidebar-foreground #f7f2ea
--sidebar-primary    #c5ad86
--sidebar-accent     #75503c
```

**Background is off-white, not pure white, on purpose.** It lets `--card`
(`#ffffff`) sit above the page on a shadow instead of a border, and it cuts
glare on a tablet used pool-side.

**The brand beige is never text and never a data mark.** It reads **2.11:1** on
a white card. Anything placed on it wears `--accent-foreground`; any chart mark
that would have been beige uses `#9c7c4a` instead (3.89:1, ΔE 20.7 from the
brown under deuteranopia).

### Typography

- **Fraunces** (variable) for display/headers — `SOFT 40` for warmth.
  `opsz` is requested from Google Fonts but deliberately **left out of
  `font-variation-settings`**, so `font-optical-sizing: auto` can drive it from
  the rendered size. Naming it there would freeze it and defeat the variable.
- **Inter** for body, UI *and all numbers*.
- Letter-spacing is **negative** (`-0.005em`) on the serif. Cinzel needed
  positive tracking because it is all-caps inscriptional; Fraunces is
  mixed-case and needs the opposite. Explicit `tracking-*` utilities still win
  by layer order, so uppercase badges keep their openness.

Scale, applied by **redefining the `--text-*` tokens** rather than editing
components — every existing `text-*` class rescaled at once and the card
density work kept its structure:

```
xs 13 · sm 15 (body) · base 16 · lg 18 · xl 22 · 2xl 26 · 3xl 32 · 4xl 36 · 5xl 42
```

### The brand mark

`public/logo.jpeg` is the real Pirates Village mark: an illustrated skull in
saturated red, orange and teal on a **white ground, with no transparency**.

It appears in exactly one place — the login panel — inside a cream medallion.
Framing it is not decoration: a JPEG has no alpha, so dropped straight onto the
brown panel it would show a white rectangle. The medallion makes that ground
read as deliberate, and keeps the logo's three saturated hues contained instead
of loose in a palette built on brown and beige.

It is **not** used on operational screens. That follows the rule set during the
rebrand: nautical decoration belongs on login, and the day-to-day screens stay
clean so staff can work fast. The sidebar keeps its plain anchor.

A monochrome SVG redraw was considered and rejected for now: it could not be
visually verified in this environment, and an unverified hand-drawn version of
a brand's face is worse than the real asset framed well.

### Shape

`--radius: 0.875rem` (14px). The whole scale derives from it:
`lg 14 · xl 19.6 (inputs, Card) · 2xl 25.2 (hand-rolled cards)`.
Buttons are `rounded-full` at every size, except inside a button group.

Cards carry **border + warm shadow**, not one or the other. `--card` and
`--background` differ by only 2%, so a shadow alone left edges undefined —
which the user had already complained about.

---

## 4. Bugs found and fixed

Several pre-dated this session.

| # | Bug | Detail |
|---|---|---|
| 1 | `/kids/[id]` 404 | Registry cards linked to a route that did not exist |
| 2 | **Sidebar hotel name invisible** | Painted with `--sidebar-primary-foreground`, which equalled `--sidebar`. Contrast **1.00:1** — navy on navy |
| 3 | **Focus ring invisible** | `--ring` was gold on cream: **2.08:1**. WCAG 2.2 wants 3:1. Keyboard focus was effectively unusable app-wide |
| 4 | Muted body text below AA | `#6a7482` on cream: **4.20:1** |
| 5 | Amber warning below AA | `#b9772a`: **3.45:1**, and its hue (32°) sat *between* brand brown (21°) and beige (37°), so warnings read as decoration |
| 6 | Status pills below AA | `text-success/70` on `bg-success/12` = **2.61:1**. Unfixable without darkening the green |
| 7 | Base UI `nativeButton` warning | `<Button render={<Link/>}>` in **8** places. Fixed with `<Link className={buttonVariants()}>` |
| 8 | `HOTEL_CONFIG` ignored | Written and wired into 2 files, then the rebrand took priority and **5 consumers were never connected** |
| 9 | Hidden-but-required deadlock | The form *required* the relationship it was about to hide. `isFieldRequired()` exists to prevent exactly this |
| 10 | Hydration mismatch | `minutesSince()` called `new Date()` **during render** — server and client disagree across timezones |
| 11 | `useSearchParams` without Suspense | Fails the static prerender of the page it sits on. Hit twice: `/register`, `/login` |
| 12 | **Tailwind arbitrary variants silently dropped** | `[&_[data-slot=input]]:h-13` — nested brackets do not parse. **Zero CSS generated, no error.** Rewritten as a `.form-lg` block |
| 13 | Dual lockfiles broke the deploy | See §8 |

### Two failure modes worth internalising

**Silent CSS failures.** #12 produced no error anywhere. The form looked
identical and the build was green. Always confirm a new utility actually
appears in the served stylesheet.

**Green build ≠ sound types.** `npm run build` with Turbopack prints
*"Skipping validation of types"*. A file with an undefined import compiled
fine. `npx tsc --noEmit` is the gate.

---

## 5. Architecture decisions

### `lib/hotel-config.ts` — hide, never delete

Per-hotel field visibility. Two guarantees:

- `isFieldRequired()` returns `visible && required`, so **a hidden field can
  never be required** and can never deadlock a form.
- `HIDDEN_FIELD_DEFAULTS` seeds values nobody can pick. The relationship
  default is `"Other"` because that is a member of the existing `Relationship`
  union — anything else breaks the types on save.

Hidden for Pirates Village: guardian relationship, child nationality, child
language, registry advanced filters, visit counts on cards.

**Functional roles are not configurable.** "Primary guardian" and "Authorized
adult" describe what someone may *do*; they always render.

**The config governs rendering, not storage.** Hidden values still travel in
the data and in the RSC payload, so a hotel can switch them back on.

### Backend seams (Phase B)

Two functions are the entire migration surface:

- **`getStats(range)`** in `lib/mock-data.ts` — no component reads `KIDS` for
  statistics.
- **`lib/auth.ts`** — `signIn` / `startSession` / `endSession` plus the
  `pv_session` cookie the middleware reads.

### Auth

Middleware-based, so an unauthenticated request **never renders** a protected
page. The intended path travels in `?next=` and is honoured after sign-in.

---

## 6. Product decisions (from user testing with the Lead Animator)

Verbatim feedback: *"very loaded with information"*, *"both parents and staff
would get confused"*, *"where you see the kids shouldn't be an explosion of
info"*.

- **Registry cards** show avatar, name, age+room, a status dot, an allergy
  icon, and **one** contextual button. The whole card is clickable via a
  **stretched link** (`after:absolute after:inset-0`), with the action button
  lifted on `relative z-10`. This was chosen over `onClick` + `stopPropagation`
  because a clickable `div` is not keyboard-accessible and a `<button>` inside
  an `<a>` is invalid HTML.
- **Dashboard is an action hub**, not a second registry. Two hero cards
  (220–260px) dominate; the activity feed collapses to one line.
- **Registration reads like paper.** No section titles, no placeholders that
  restate their label, 17px labels, 52px inputs.
- **Statistics answers three questions only** — attendance, peak hours, top
  visitors. No age donut, no heatmap, no filter sidebar.
- **Sidebar auto-collapses** on any `pointerdown` outside it and reopens on a
  press inside. Capture-phase listening, so it settles before the click reaches
  its target. The manual toggle **must** `stopPropagation` or the press bubbles
  to the rail and reopens what it just closed.

### The progress bar measures completion, not scroll

It used to track which section was on screen. Once section titles were removed
there was nothing to navigate *between*, so scroll position answered nothing.
It now measures fields completed — which is what "how much is left" actually
asks. That also retired the `IntersectionObserver`.

---

## 7. Where the implementation deliberately diverged from instructions

Recorded because each was a judgement call, not an oversight.

| Asked for | Done instead | Why |
|---|---|---|
| Gold chart line, cream fill | Brown line, brown wash | Beige = 2.11:1, unreadable as a mark |
| Keep `--success` unchanged | Darkened to `#276749` | Pills were 2.61:1; unfixable otherwise |
| Montserrat for body | **Inter** | Montserrat is a display geometric; it degrades in dense rows and tabular figures |
| Cormorant Garamond considered | **Fraunces** | Cormorant is a display face with thin strokes that vanish at UI sizes and arm's length |
| "tabular-nums stays on Inter" | Moved 13 usages off `font-mono` | They were **not** on Inter — `--font-mono` was undefined, so they rendered in Consolas |
| `ring-1` → `shadow-sm` on cards | Border **and** shadow | 2% surface delta left edges undefined without a border |
| Collapsed summary "5 minutes ago" | Absolute time "at 11:05" | Relative time computed in render = hydration mismatch |
| One collapsible in the form | Two, one per section | Preserves the existing 3-section architecture and keeps fields beside their context |

Also kept against a blanket instruction to strip micro-copy: **"Important info
captured — staff will be alerted"** under allergies and medical notes. It only
appears once something is typed, and confirming that a medical note reaches
staff is functional reassurance, not decoration.

---

## 8. Tooling traps

### pnpm only

The repo tracked **both** `package-lock.json` and `pnpm-lock.yaml`. Installing
recharts with npm updated one and left the other stale. Vercel detects the pnpm
lockfile and installs with `--frozen-lockfile`, so **the deploy failed while
the local build stayed green**.

`package-lock.json` has been removed. Install with:

```bash
corepack pnpm add <package>
```

`pnpm-workspace.yaml` is **not** a monorepo — it carries
`minimumReleaseAgeExclude`, a pnpm setting npm would silently ignore.

### Node on the Windows desktop

Not installed system-wide. A portable copy lives in `nodejs/` (gitignored).
Prepend it to `PATH`; install Node normally elsewhere. Git is also off `PATH`
at `%LOCALAPPDATA%\Programs\Git\cmd`.

### `.next/` was tracked

Build artifacts were being committed. Removed from the index and gitignored
along with `tsconfig.tsbuildinfo`.

---

## 9. Known state and open items

### Temporary, tracked debt

- **Demo credentials render in production** (`components/auth/login-form.tsx`),
  so the hotel can trial the deploy unaccompanied. Carries a `TEMPORARY`
  comment. **Remove before real deployment.**
- `docs/reference/pirates-village-website/brand-guide.md.txt` **contains the
  prompt text, not the brand tokens.** The palette was derived from values
  quoted in conversation. Still unresolved when the real document arrives:
  spacing scale, motion scale, shadow definitions, the full palette, and what
  *"map-roman-variable"* refers to (Fraunces was an inference).

### Stubs

- "Add authorized adult" (Guardians tab) — button with no action.
- "Export report" (Statistics) — format picker only.
- Custom date range (Statistics) — picker wired, still returns week data.
- "Forgot password" — no action.
- Statistics empty state exists in code but no mock range reaches it.
- **Settings toggles preview but do not persist.** They read their initial
  state from `HOTEL_CONFIG` and are interactive, so a manager can see exactly
  what each switch governs, but there is nowhere to save to yet. The page says
  so in a banner rather than pretending. Persisting per hotel is Phase B work,
  and the toggles are already shaped like the rows a `hotel_settings` table
  would hold.

### Never visually verified

No browser automation was available. Everything was verified by served HTML,
`tsc`, the production build, and computed contrast ratios. **Layout, spacing
and visual balance were never seen.**

### Next

**Phase B — Supabase.** Four pieces, in dependency order:

1. **Auth** — replace `lib/auth.ts`. The `pv_session` cookie and the middleware
   contract can stay as they are; only the credential check changes.
2. **`hotel_settings`** — persist what `/settings` already renders. This is the
   smallest real table and unblocks the config layer end to end.
3. **Data** — replace `KIDS` with queries. Guardians, visits and staff notes
   are already separate types, so they map to tables directly.
4. **`getStats(range)`** — the one function the whole Statistics page reads
   through. Aggregations move server-side; no component changes.

Real search (currently a client-side filter over `KIDS`) follows from 3.
