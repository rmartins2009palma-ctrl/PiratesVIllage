@AGENTS.md

# Project rules

## Package manager: pnpm only

Vercel detects `pnpm-lock.yaml` and installs with `--frozen-lockfile`, so a
lockfile that does not match `package.json` fails the deploy — while the local
build stays green, which makes it easy to miss.

Install dependencies with pnpm, never npm:

```bash
corepack pnpm add <package>
```

`package-lock.json` was removed deliberately. Do not reintroduce it: two
lockfiles means every dependency change has to update both or CI breaks.

`pnpm-workspace.yaml` is not a monorepo — it carries a pnpm setting
(`minimumReleaseAgeExclude`) that npm would silently ignore.

## Verification gate

`npm run build` uses Turbopack, which prints "Skipping validation of types". A
green build does **not** mean the types are sound. Always run:

```bash
npx tsc --noEmit
```

## Node

Node is not installed system-wide on the Windows desktop; a portable copy lives
in `nodejs/` (gitignored). Prepend it to `PATH`, or install Node normally on
other machines.

## Design system

- Semantic tokens only. No raw hex outside `app/globals.css` and
  `lib/brand-constants.ts` (which exists because a `<canvas>` cannot read a CSS
  variable).
- Every colour pairing must clear WCAG AA. Data marks in charts need 3:1
  against their card — the brand beige `#c5ad86` does not qualify and is a
  fill, never a line or a bar.
- Hidden fields are governed by `lib/hotel-config.ts`. Features are hidden,
  never deleted, and a hidden field is never required.
