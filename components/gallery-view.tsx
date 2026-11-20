"use client";

import { useEffect, useRef, useState } from "react";
import { EmptyState, ReaderHead, ResultCount, Tags } from "@/components/reader-shell";
import { VIEWS, countWorks, filterWorks, type GalleryWork, type ViewId } from "@/lib/gallery";
import { HUB_URL, SOURCE_URL } from "@/lib/site";

/** The gallery index: head, view chips, a count, then the work cards or an empty state. */
export function GalleryView({ works }: { works: readonly GalleryWork[] }) {
  const [view, setView] = useState<ViewId>("all");
  const shown = filterWorks(works, view);
  const label = VIEWS.find((item) => item.id === view)!.label;
  const allChip = useRef<HTMLButtonElement>(null);
  // "Show all files" unmounts itself when the view changes; once the new view is on screen, focus
  // the "All files" chip so a keyboard user keeps their place next to the filters.
  const focusAll = useRef(false);
  useEffect(() => {
    if (!focusAll.current) return;
    focusAll.current = false;
    allChip.current?.focus();
  }, [view]);

  return (
    <>
      <ReaderHead
        eyebrow="AI Art Gallery"
        title={works.length === 0 ? "A gallery waiting for its first work" : "Works on the wall, provenance on file"}
        lede={
          works.length === 0
            ? "Every work here will carry its provenance: the model or artist, and where it came from. None has been filed yet, and no generation feed is connected."
            : "Each work is shown with its provenance. Generated samples are labelled Synthetic."
        }
      />

      {works.length === 0 ? (
        <EmptyState
          title="No works on file yet"
          action={
            <>
              <a className="rs-button" href={HUB_URL}>See finished projects</a>
              <a className="rs-plain" href={SOURCE_URL}>Follow the source</a>
            </>
          }
        >
          Works appear here once they are filed with an image, alt text and provenance. Until then, the rest of the portfolio is on bookchaowalit.com.
        </EmptyState>
      ) : (
        <section aria-labelledby="works-title">
          <h2 id="works-title" className="rs-sr">Works</h2>
          <div className="rs-toolbar">
            <div className="rs-chips" role="group" aria-label="Collection view">
              <ul>
                {VIEWS.map((item) => (
                  <li key={item.id}>
                    <button type="button" className="rs-chip" ref={item.id === "all" ? allChip : undefined} aria-pressed={view === item.id} onClick={() => setView(item.id)}>
                      {item.label}<small>{countWorks(works, item.id)}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <ResultCount shown={shown.length} total={works.length} noun="work" filter={view === "all" ? undefined : label} />
          </div>
          {shown.length === 0 ? (
            <EmptyState title={`Nothing in ${label} yet`} headingLevel={3} action={<button type="button" className="rs-plain" onClick={() => { focusAll.current = true; setView("all"); }}>Show all files</button>}>
              Other views have works; this one is empty for now.
            </EmptyState>
          ) : (
            <ul className="ag-grid" role="list">
              {shown.map((work) => (
                <li key={work.id}>
                  <figure className="ag-card">
                    {/* eslint-disable-next-line @next/next/no-img-element -- registry images may be remote; no optimizer config needed */}
                    <img src={work.imageUrl} alt={work.alt} loading="lazy" decoding="async" />
                    <figcaption>
                      <h3>{work.title}</h3>
                      <p className="rs-entry-meta">{work.artist} · {work.year}</p>
                      <p className="ag-provenance">Provenance: {work.provenance}</p>
                      {work.synthetic ? <Tags tags={["Synthetic"]} label="Labels" /> : null}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
