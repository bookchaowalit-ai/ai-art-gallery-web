import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="gallery-shell">
      <section className="gallery-hero">
        <div className="hero-copy">
          <p className="section-code">404 / NOT ON FILE</p>
          <h1>This room is not in the gallery.</h1>
          <p className="hero-note">The link may have moved. The collection starts on the front page.</p>
          <div className="hero-links">
            <Link className="signal-link" href="/">Back to the gallery</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
