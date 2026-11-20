// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GalleryView } from "@/components/gallery-view";
import type { GalleryWork } from "@/lib/gallery";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const work = (id: string, status: GalleryWork["status"], synthetic = false): GalleryWork => ({
  id, title: `Work ${id}`, artist: "Artist", year: 2026, status, imageUrl: `/works/${id}.png`, alt: `Alt ${id}`, provenance: `Log ${id}`, synthetic,
});

let root: Root;
let host: HTMLDivElement;
const press = (el: Element) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
const chip = (label: string) => [...host.querySelectorAll(".rs-chip")].find((b) => b.textContent?.startsWith(label))!;
const titles = () => [...host.querySelectorAll(".ag-card h3")].map((h) => h.textContent);

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("GalleryView", () => {
  it("shows the empty room with links on when nothing is filed", () => {
    act(() => root.render(<GalleryView works={[]} />));
    expect(host.querySelector(".rs-empty h2")?.textContent).toBe("No works on file yet");
    expect(host.querySelector(".rs-chip")).toBeNull();
  });

  it("lists works as cards with lazy images, alt text, provenance and the Synthetic label", () => {
    act(() => root.render(<GalleryView works={[work("a", "incoming", true), work("b", "incoming")]} />));
    expect(titles()).toEqual(["Work a", "Work b"]);
    const img = host.querySelector("img")!;
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.getAttribute("alt")).toBe("Alt a");
    expect(host.textContent).toContain("Provenance: Log a");
    expect(host.querySelectorAll(".rs-tag")).toHaveLength(1);
    expect(host.querySelector('[role="status"]')?.textContent).toBe("2 works");
  });

  it("filters by view with counts, says what is shown, and offers a way back from an empty view", () => {
    act(() => root.render(<GalleryView works={[work("a", "incoming"), work("b", "archive")]} />));
    expect(chip("Archive").textContent).toBe("Archive1");
    press(chip("Archive"));
    expect(chip("Archive").getAttribute("aria-pressed")).toBe("true");
    expect(titles()).toEqual(["Work b"]);
    expect(host.querySelector('[role="status"]')?.textContent).toBe("Showing 1 of 2 works in Archive");
    act(() => root.render(<GalleryView works={[work("a", "incoming")]} />));
    expect(host.querySelector(".rs-empty h3")?.textContent).toBe("Nothing in Archive yet");
    press([...host.querySelectorAll("button")].find((b) => b.textContent === "Show all files")!);
    expect(titles()).toEqual(["Work a"]);
    expect(document.activeElement).toBe(chip("All files"));
    expect(chip("All files").getAttribute("aria-pressed")).toBe("true");
  });

  it("keeps the work grid announced as a list in Safari/VoiceOver", () => {
    act(() => root.render(<GalleryView works={[work("a", "incoming")]} />));
    expect(host.querySelector(".ag-grid")?.getAttribute("role")).toBe("list");
  });
});
