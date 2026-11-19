# Design direction: AI Art Gallery on the Reader shell

Since 2026-11-19 the gallery uses the shared Reader shell (`app/reader-shell.css`,
`components/reader-shell.tsx`, `READER.md`), the calm, Apple-like look shared with the content
sites. The old "Signal Gallery" theme (graphite walls, Instrument Serif, DM Mono, 10px labels) is gone.

## First viewport

The top bar (brand, Source, Bookchaowalit hub), then one h1 and a lede that states the honest
condition: no works filed yet and no generation feed connected. While the registry is empty the
next block is the empty state with two ways on: "See finished projects" (bookchaowalit.com) and
"Follow the source". No fake frames, no hard-coded check dates.

## Works

When works are filed: view chips (All files / Incoming / Archive, `aria-pressed`, with counts), a
result count (`role="status"`), then a grid of cards: image (4:3, `loading="lazy"`, real alt text),
title, artist and year, provenance, and a Synthetic label for generated samples. An empty view gets
its own empty state with "Show all files".

## Floor

Reader shell tokens only (light and dark); Geist via `next/font` on `<html>`; text >= 12px, controls
>= 44px, 3px focus ring, forced-colors rules; the 404 page keeps the same top bar and footer.
