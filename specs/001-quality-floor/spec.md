# SPEC-001: Quality floor (tests, Sentry, design floor)

- Status: implemented · Main-only: yes · Date: 2026-11-12
- Standards: ADR-0004 (TDD + SDD), ADR-0007 (design floor), Sentry scrub reference (web-starter `lib/sentry.ts`)

## Requirements
- R1 Tests run on Vitest with a line-coverage gate in CI (`coverage-threshold`, ratchet only upward). Measured 98.8% lines → gate 98.
- R2 Every route (pages, `/api/mcp`, robots, sitemap, social card, 404) has at least one test.
- R3 Sentry reports errors only, through the scrubbing reference copied unchanged; it stays off until `NEXT_PUBLIC_SENTRY_DSN` is set.
- R4 The design floor (checker 1.1.11) passes 12/12 on `/`, `/more-projects` and the 404 page at 320/375/390/768/1440.

## Acceptance
- AC-1 `npm test` green; `vitest run --coverage` ≥ 98% lines.
- AC-2 `node check.mjs --config design-floor.json` reports 12/12 PASS.
- AC-3 Red run before the fix: design floor 9/12 (contrast on the more-projects back link: the unlayered `a { color: inherit }` beat `text-blue-700`; target size of inline links; no skip link).
