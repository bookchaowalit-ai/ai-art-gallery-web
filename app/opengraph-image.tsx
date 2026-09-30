import { ImageResponse } from "next/og";

// Generated at build time so social cards never point at a missing file.
// Text stays ASCII: the built-in ImageResponse font has no Thai glyphs.
export const alt = "AI Art / Gallery — bookchaowalit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {"bg":"#101112","ink":"#f2eee7","muted":"#a7a098","accent":"#b6f36b"};
const KICKER = "AI ART / GALLERY";
const TITLE = "A gallery in progress";
const SUBTITLE = "Every work filed with its provenance in view.";
const CHIPS: readonly string[] = ["Provenance","Catalogue","MCP list_works"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: colors.bg,
          color: colors.ink,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: colors.accent }}>{KICKER}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>{TITLE}</div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: colors.muted }}>{SUBTITLE}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {CHIPS.map((chip) => (
            <div
              key={chip}
              style={{ display: "flex", padding: "10px 18px", borderRadius: 8, border: `2px solid ${colors.accent}`, fontSize: 22 }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
