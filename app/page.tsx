"use client";

import Link from "next/link";
import { useState } from "react";

const views = [
  { id: "all", label: "All files", count: "00" },
  { id: "incoming", label: "Incoming", count: "—" },
  { id: "archive", label: "Archive", count: "—" },
] as const;

const sheetSlots = ["A / 01", "A / 02", "B / 01", "B / 02"];

export default function Home() {
  const [view, setView] = useState<(typeof views)[number]["id"]>("all");
  const selectedView = views.find((item) => item.id === view) ?? views[0];

  return (
    <main className="gallery-shell">
      <header className="gallery-masthead">
        <Link className="gallery-wordmark" href="/">
          <span className="gallery-mark">AG</span>
          <span>AI ART / GALLERY</span>
        </Link>
        <nav className="gallery-nav" aria-label="Gallery navigation">
          <Link href="/more-projects">More projects</Link>
          <a href="https://github.com/bookchaowalit-ai/bookchaowalit-ai-art-gallery-frontend" target="_blank" rel="noreferrer">Source ↗</a>
        </nav>
      </header>

      <section className="gallery-hero">
        <div className="hero-copy">
          <p className="section-code">COLLECTION / 00 WORKS</p>
          <h1>A gallery for images that have not arrived yet.</h1>
          <p className="hero-note">
            The gallery shell is ready. The current repository has no verified
            artwork or connected generation feed, so the empty room stays visible.
          </p>
          <div className="hero-links">
            <a className="signal-link" href="https://github.com/bookchaowalit-ai/bookchaowalit-ai-art-gallery-frontend" target="_blank" rel="noreferrer">Follow the source ↗</a>
            <span className="hero-caption">Last registry check · 24 AUG 2026</span>
          </div>
        </div>

        <aside className="gallery-register" aria-label="Collection register">
          <div className="register-line"><span>Status</span><strong>UNCONNECTED</strong></div>
          <div className="register-line"><span>Verified works</span><strong>00</strong></div>
          <div className="register-line"><span>Generation feed</span><strong>NOT ON FILE</strong></div>
          <p>Sample images are intentionally absent. A real work should earn its frame.</p>
        </aside>
      </section>

      <section className="gallery-sheet" aria-labelledby="sheet-title">
        <div className="sheet-header">
          <div>
            <p className="section-code">CONTACT SHEET / INDEX</p>
            <h2 id="sheet-title">Nothing filed in this edition.</h2>
          </div>
          <div className="sheet-filter" role="group" aria-label="Collection view">
            {views.map((item) => (
              <button key={item.id} type="button" aria-pressed={view === item.id} className={view === item.id ? "is-active" : ""} onClick={() => setView(item.id)}>
                <span>{item.label}</span><b>{item.count}</b>
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-grid" data-view={view}>
          {sheetSlots.map((slot, index) => (
            <div className="sheet-slot" key={slot}>
              <div className="slot-frame" aria-hidden="true">
                <span className="slot-cross">+</span>
                <span className="slot-empty">NO IMAGE</span>
                <span className="slot-corner">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="slot-label"><span>{slot}</span><span>EMPTY FRAME</span></div>
            </div>
          ))}
        </div>
        <p className="sheet-footnote" aria-live="polite">
          Viewing <strong>{selectedView.label.toLowerCase()}</strong> · {selectedView.count === "00" ? "no verified files" : "no files in this view"}
        </p>
      </section>

      <footer className="gallery-footer">
        <span>bookchaowalit / AI domain</span>
        <span>Built as a visible work in progress</span>
        <Link href="https://bookchaowalit.com">Portfolio ↗</Link>
      </footer>
    </main>
  );
}
