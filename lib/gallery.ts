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

/** Two-digit register count, e.g. 0 -> "00", 7 -> "07"; NaN/Infinity read as "00". */
export function registerCount(count: number): string {
  if (!Number.isFinite(count)) return "00";
  return String(Math.max(0, Math.floor(count))).padStart(2, "0");
}

const INVISIBLE = /[\u200B-\u200D\u2060\uFEFF\u00AD]/g;

/** Text with zero-width characters / BOM removed and whitespace trimmed. */
export function visibleText(value: string): string {
  return value.replace(INVISIBLE, "").trim();
}

/** Identity key for duplicate detection: NFC, no invisible characters, case-folded. */
export function workKey(id: string): string {
  return visibleText(id.normalize("NFC")).toLowerCase();
}

/** https URL or a same-origin /public path (not a protocol-relative "//host"). */
function isAllowedImageUrl(url: string): boolean {
  if (/^https:\/\/[^/\s]/.test(url)) return true;
  return url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\");
}

/** Returns the reasons a work may not be exhibited (empty when valid). */
export function validateWork(work: GalleryWork): string[] {
  const problems: string[] = [];
  if (!visibleText(work.id)) problems.push("id is required");
  if (!visibleText(work.title)) problems.push("title is required");
  if (!visibleText(work.alt)) problems.push("alt text is required");
  if (!visibleText(work.provenance)) problems.push("provenance is required");
  if (!isAllowedImageUrl(work.imageUrl)) {
    problems.push("imageUrl must be https or a /public path");
  }
  if (!Number.isInteger(work.year) || work.year < 1900 || work.year > 9999) problems.push("year must be a valid year");
  return problems;
}

/**
 * Only works that pass validation, with duplicate ids removed. Ids that differ
 * only by case, surrounding spaces, zero-width characters or Unicode
 * normalization count as the same work.
 */
export function exhibitableWorks(works: readonly GalleryWork[]): GalleryWork[] {
  const seen = new Set<string>();
  return works.filter((work) => {
    const key = workKey(work.id);
    if (seen.has(key) || validateWork(work).length > 0) return false;
    seen.add(key);
    return true;
  });
}
