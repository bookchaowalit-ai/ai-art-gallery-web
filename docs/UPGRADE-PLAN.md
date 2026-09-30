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
- Add an Open Graph image (the previously referenced `/og-image.png` never
  existed, so it was removed from metadata).

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
