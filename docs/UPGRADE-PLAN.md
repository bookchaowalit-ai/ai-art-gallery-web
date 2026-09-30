# Upgrade plan

## Current state: 7/10 (was 4/10)

Honest, data-driven gallery shell with validated registry, real MCP tool,
tests, and CI; still no actual artwork on file.

## Backlog

### P0
- (none open)

### P1
- File the first real works (with provenance) in `data/works.ts`, or decide
  on a remote source and add a typed loader for it.
- Confirm the canonical domain and set `NEXT_PUBLIC_SITE_URL` (fallback is
  the Vercel project URL).

### P2
- Lightbox/detail view per work with keyboard navigation.
- Remove unused starter SVGs from `public/`.

## Done in this pass
- Registry model `lib/gallery.ts` + `data/works.ts`; counts, headings and the
  view filter are now derived from data instead of hard-coded "00" / "—".
- Validation (alt text, provenance, https-or-local image) with unit tests.
- Replaced stub `/api/mcp` with `list_works` on a shared JSON-RPC handler.
- GitHub Actions CI (lint, typecheck, test, build); fixed all lint errors.
- Metadata: canonical/og url no longer point at the portfolio root; broken
  og-image reference removed; robots/sitemap generated in-app.
- Data-driven, accessible `more-projects` page; external links announce new
  tabs; replaced create-next-app README.

## Done in this pass (pass 2)
- Generated `app/opengraph-image.tsx` social card (1200×630 PNG at build time, site palette) so `summary_large_image` has a real image. Twitter card upgraded from `summary`.

## Done in this pass (pass 3)
- Edge-case pass on `lib/gallery.ts` (regression tests in `tests/gallery.test.ts`):
  - `validateWork` accepted protocol-relative `//host/x.png` (and `/\host`)
    as a "/public path", letting a work load from any host over any scheme.
  - Alt text / provenance / title made only of zero-width characters or a BOM
    passed the "required" checks; now stripped before checking.
  - Duplicate detection compared raw ids, so `w1`, `﻿w1`, `W1​` and
    NFD/NFC variants were all exhibited; ids now compare by a normalized key.
  - `year` had no upper bound (`1e21` passed); `registerCount(NaN)` printed "NaN".
