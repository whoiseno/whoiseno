import readingTime from "reading-time";

/** Whole minutes to read a Markdoc body. Tags and image syntax are markup, not prose. */
export function getReadingMinutes(body = ""): number {
  const prose = body.replace(/\{%[\s\S]*?%\}/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  return Math.max(1, Math.ceil(readingTime(prose).minutes));
}
