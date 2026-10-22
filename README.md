# AI Art / Gallery

An honest gallery shell for the bookchaowalit AI-art project. The page renders
only works registered in `data/works.ts` that carry alt text and provenance;
while the registry is empty it shows an intentional empty contact sheet
instead of fake artwork.

## Features
- Collection register and view filter (all / incoming / archive) with counts
  derived from the registry.
- Works flagged `synthetic: true` are labelled SYNTHETIC on the frame.
- `/api/mcp` JSON-RPC endpoint with a `list_works` tool (read-only, same data
  as the page).
- `robots.txt` / `sitemap.xml` generated from `lib/site.ts`
  (override with `NEXT_PUBLIC_SITE_URL`).

## Adding a work
Append an entry to `data/works.ts` (`id`, `title`, `artist`, `year`, `status`,
`imageUrl` as https or a `/public` path, `alt`, `provenance`, `synthetic`).
Entries failing `validateWork` in `lib/gallery.ts` are not exhibited, and the
unit tests fail if the shipped registry contains one.

## Run
```bash
npm ci
npm run dev
```

## Checks (same as CI)
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI (`.github/workflows/ci.yml`) runs these through the shared `platform-ci-workflows` `ci-node.yml` on pushes to `main` and on pull requests, plus its `security.yml` scans (Gitleaks, Semgrep, OSV-Scanner, Trivy). Reviewed OSV exceptions live in `osv-scanner.toml`.
