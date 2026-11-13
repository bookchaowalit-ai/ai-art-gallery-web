# Design direction — Signal Gallery

## World

An after-hours image archive: black exhibition walls, registration marks,
contact-sheet geometry, and small curator notes. The page feels like a gallery
that is ready for work without pretending that work has arrived.

## First viewport

The first screen states the honest condition immediately: zero verified works on
file. A large typographic title sits beside a numbered collection register, and
the contact-sheet frame below is an empty but intentional surface rather than a
fake artwork grid.

## Palette and material

- Graphite `#101112` and warm paper `#f2eee7` are the exhibition room.
- Signal green `#b6f36b` marks active registration and focus.
- Rust `#d6754e` marks a missing connection, never a success state.
- Thin rules, crosshair marks, and crop guides carry the contact-sheet grammar.

## Type

`Instrument Serif` is the gallery voice for the title. `DM Mono` carries
accession numbers, metadata, and state labels. Body copy stays in a restrained
sans stack for reading comfort.

## Interaction and states

The collection filter is a small index control with visible pressed state. Empty,
incoming, and archive views remain honest and explain what would populate them.
Focus rings use the signal green and reduced motion removes the sheet reveal.

## Responsive rules

Desktop uses a two-column curator register and contact sheet. On narrow screens
the register becomes a horizontal strip and the sheet keeps its marks legible
as a single-column stack.


---

## Storybook

Storybook 10 (`@storybook/nextjs-vite`) shows this design system with the app's real CSS, tokens and fonts.

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build in storybook-static/ (CI: .github/workflows/storybook.yml)
```

- **Foundations/Tokens** reads every CSS custom property the app defines at runtime, so it never drifts from the code.
- **Design/DESIGN.md** renders this file.
- **Components/**, **Sections/** and **Pages/** show the UI with mock data only (no network, analytics off).
- Toolbar: locale, theme (light / dark, when the app has a dark theme), viewports 320 / 375 / 768 / 1440. The a11y panel runs axe (WCAG 2.2 AA).
- Rule: a new shared component or page section ships with a story in `stories/`.
