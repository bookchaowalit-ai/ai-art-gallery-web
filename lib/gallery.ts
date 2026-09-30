/**
 * Gallery registry model. Works are only shown when they carry provenance and
 * alt text; synthetic/sample works must be flagged so the UI can label them.
 */

export type WorkStatus = "incoming" | "archive";

export interface GalleryWork {
  id: string;
  title: string;
  artist: string;
  year: number;
  status: WorkStatus;
  /** Absolute https URL or a path under /public. */
  imageUrl: string;
  alt: string;
  /** Where the work came from (model, prompt log, commission, ...). */
  provenance: string;
  /** True for generated placeholders or demo pieces. */
  synthetic: boolean;
}

export const VIEWS = [
  { id: "all", label: "All files" },
  { id: "incoming", label: "Incoming" },
  { id: "archive", label: "Archive" },
] as const;

export type ViewId = (typeof VIEWS)[number]["id"];

export function filterWorks(works: readonly GalleryWork[], view: ViewId): GalleryWork[] {
  return view === "all" ? [...works] : works.filter((work) => work.status === view);
}

export function countWorks(works: readonly GalleryWork[], view: ViewId): number {
  return filterWorks(works, view).length;
}

/** Two-digit register count, e.g. 0 -> "00", 7 -> "07". */
export function registerCount(count: number): string {
  return String(Math.max(0, Math.floor(count))).padStart(2, "0");
}

/** Returns the reasons a work may not be exhibited (empty when valid). */
export function validateWork(work: GalleryWork): string[] {
  const problems: string[] = [];
  if (!work.id.trim()) problems.push("id is required");
  if (!work.title.trim()) problems.push("title is required");
  if (!work.alt.trim()) problems.push("alt text is required");
  if (!work.provenance.trim()) problems.push("provenance is required");
  if (!/^https:\/\//.test(work.imageUrl) && !work.imageUrl.startsWith("/")) {
    problems.push("imageUrl must be https or a /public path");
  }
  if (!Number.isInteger(work.year) || work.year < 1900) problems.push("year must be a valid year");
  return problems;
}

/** Only works that pass validation, with duplicate ids removed. */
export function exhibitableWorks(works: readonly GalleryWork[]): GalleryWork[] {
  const seen = new Set<string>();
  return works.filter((work) => {
    if (seen.has(work.id) || validateWork(work).length > 0) return false;
    seen.add(work.id);
    return true;
  });
}
