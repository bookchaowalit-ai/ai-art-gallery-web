import Link from "next/link";
import { EmptyState, Reader, ReaderFoot, ReaderHead, ReaderTop } from "@/components/reader-shell";
import { SOURCE_URL } from "@/lib/site";

export default function NotFound() {
  return (
    <Reader>
      <ReaderTop name="AI Art Gallery" tagline="Works with provenance" links={[{ href: SOURCE_URL, label: "Source" }]} />
      <main id="main" className="rs-main">
        <ReaderHead eyebrow="Page not found" title="This room is not in the gallery" lede="The link may have moved. The collection starts on the front page." />
        <EmptyState title="Where to next" action={<Link className="rs-button" href="/">Back to the gallery</Link>}>
          The front page lists every work on file.
        </EmptyState>
      </main>
      <ReaderFoot source={SOURCE_URL} />
    </Reader>
  );
}
