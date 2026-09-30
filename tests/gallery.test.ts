import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countWorks, exhibitableWorks, filterWorks, registerCount, validateWork } from "../lib/gallery.ts";
import type { GalleryWork } from "../lib/gallery.ts";
import { WORKS } from "../data/works.ts";

const base: GalleryWork = {
  id: "w1",
  title: "Harbour at dusk",
  artist: "bookchaowalit",
  year: 2026,
  status: "incoming",
  imageUrl: "/works/w1.webp",
  alt: "A harbour lit by orange dusk light",
  provenance: "Test fixture",
  synthetic: true,
};

describe("gallery registry", () => {
  it("filters by view and counts", () => {
    const works = [base, { ...base, id: "w2", status: "archive" as const }];
    assert.equal(filterWorks(works, "all").length, 2);
    assert.deepEqual(filterWorks(works, "archive").map((w) => w.id), ["w2"]);
    assert.equal(countWorks(works, "incoming"), 1);
  });

  it("formats register counts", () => {
    assert.equal(registerCount(0), "00");
    assert.equal(registerCount(7), "07");
    assert.equal(registerCount(123), "123");
  });

  it("rejects works without alt text, provenance, or a safe image url", () => {
    assert.deepEqual(validateWork(base), []);
    assert.ok(validateWork({ ...base, alt: " " }).includes("alt text is required"));
    assert.ok(validateWork({ ...base, provenance: "" }).includes("provenance is required"));
    assert.ok(validateWork({ ...base, imageUrl: "http://x/y.png" }).length > 0);
    assert.ok(validateWork({ ...base, imageUrl: "javascript:alert(1)" }).length > 0);
  });

  it("drops invalid and duplicate works from the exhibition", () => {
    const works = [base, { ...base }, { ...base, id: "w3", alt: "" }];
    assert.deepEqual(exhibitableWorks(works).map((w) => w.id), ["w1"]);
  });

  it("ships a collection where every entry is exhibitable", () => {
    assert.equal(exhibitableWorks(WORKS).length, WORKS.length);
  });
});
