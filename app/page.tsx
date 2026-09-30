"use client";

import Link from "next/link";
import { useState } from "react";
import { WORKS } from "@/data/works";
import { VIEWS, countWorks, exhibitableWorks, filterWorks, registerCount } from "@/lib/gallery";
import type { ViewId } from "@/lib/gallery";

const sheetSlots = ["A / 01", "A / 02", "B / 01", "B / 02"];
const collection = exhibitableWorks(WORKS);
const totalCount = registerCount(collection.length);

export default function Home() {
  const [view, setView] = useState<ViewId>("all");
  const selectedView = VIEWS.find((item) => item.id === view) ?? VIEWS[0];
  const visibleWorks = filterWorks(collection, view);

  return (
    <main className="gallery-shell">
      <header className="gallery-masthead">
        <Link className="gallery-wordmark" href="/">
          <span className="gallery-mark">AG</span>
          <span>AI ART / GALLERY</span>
        </Link>
        <nav className="gallery-nav" aria-label="Gallery navigation">
          <Link href="/more-projects">More projects</Link>
          <a href="https://github.com/bookchaowalit-ai/bookchaowalit-ai-art-gallery-frontend" target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
        </nav>
      </header>

      <section className="gallery-hero">
        <div className="hero-copy">
          <p className="section-code">COLLECTION / {totalCount} WORKS</p>
          <h1>{collection.length === 0 ? "A gallery for images that have not arrived yet." : "Works on the wall, provenance on file."}</h1>
          <p className="hero-note">
            The gallery shell is ready. The current repository has no verified
            artwork or connected generation feed, so the empty room stays visible.
          </p>
          <div className="hero-links">
            <a className="signal-link" href="https://github.com/bookchaowalit-ai/bookchaowalit-ai-art-gallery-frontend" target="_blank" rel="noreferrer">Follow the source <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
            <span className="hero-caption">Last registry check · 24 AUG 2026</span>
          </div>
        </div>

        <aside className="gallery-register" aria-label="Collection register">
          <div className="register-line"><span>Status</span><strong>{collection.length === 0 ? "UNCONNECTED" : "REGISTERED"}</strong></div>
          <div className="register-line"><span>Verified works</span><strong>{totalCount}</strong></div>
          <div className="register-line"><span>Generation feed</span><strong>NOT ON FILE</strong></div>
          <p>Sample images are intentionally absent. A real work should earn its frame.</p>
        </aside>
      </section>

      <section className="gallery-sheet" aria-labelledby="sheet-title">
        <div className="sheet-header">
          <div>
            <p className="section-code">CONTACT SHEET / INDEX</p>
            <h2 id="sheet-title">{visibleWorks.length === 0 ? "Nothing filed in this view." : `${visibleWorks.length} filed in this view.`}</h2>
          </div>
          <div className="sheet-filter" role="group" aria-label="Collection view">
            {VIEWS.map((item) => (
              <button key={item.id} type="button" aria-pressed={view === item.id} className={view === item.id ? "is-active" : ""} onClick={() => setView(item.id)}>
                <span>{item.label}</span><b>{registerCount(countWorks(collection, item.id))}</b>
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-grid" data-view={view}>
          {visibleWorks.length > 0
            ? visibleWorks.map((work) => (
                <figure className="sheet-slot" key={work.id}>
                  <div className="slot-frame slot-frame--filled">
                    {/* eslint-disable-next-line @next/next/no-img-element -- registry images may be remote; no optimizer config needed */}
                    <img src={work.imageUrl} alt={work.alt} loading="lazy" />
                    {work.synthetic ? <span className="slot-badge">SYNTHETIC</span> : null}
                  </div>
                  <figcaption className="slot-label">
                    <span>{work.title}</span>
                    <span>{work.artist} · {work.year}</span>
                  </figcaption>
                  <p className="slot-provenance">Provenance: {work.provenance}</p>
                </figure>
              ))
            : sheetSlots.map((slot, index) => (
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
          Viewing <strong>{selectedView.label.toLowerCase()}</strong> · {visibleWorks.length === 0 ? (collection.length === 0 ? "no verified files" : "no files in this view") : `${visibleWorks.length} verified ${visibleWorks.length === 1 ? "file" : "files"}`}
        </p>
      </section>

      <footer className="gallery-footer">
        <span>bookchaowalit / AI domain</span>
        <span>Built as a visible work in progress</span>
        <a href="https://bookchaowalit.com">Portfolio <span aria-hidden="true">↗</span></a>
      </footer>
    </main>
  );
}
