import { GalleryView } from "@/components/gallery-view";
import { Reader, ReaderFoot, ReaderTop } from "@/components/reader-shell";
import { WORKS } from "@/data/works";
import { exhibitableWorks } from "@/lib/gallery";
import { SOURCE_URL } from "@/lib/site";

const collection = exhibitableWorks(WORKS);

export default function Home() {
  return (
    <Reader>
      <ReaderTop name="AI Art Gallery" tagline="Works with provenance" links={[{ href: SOURCE_URL, label: "Source" }]} />
      <main id="main" className="rs-main">
        <GalleryView works={collection} />
      </main>
      <ReaderFoot source={SOURCE_URL} note="Works are shown only when they are filed with alt text and provenance; generated samples are labelled Synthetic." />
    </Reader>
  );
}
