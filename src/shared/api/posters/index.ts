import type { TypeMediaSourceName } from "@/shared/config/media-sources";

import { posterProviders } from "./providers";

interface TypePosterLink {
  source: TypeMediaSourceName;
  id: string;
}

const timeoutMs = 10_000;
const cache = new Map<string, Promise<string | null>>();

function withTimeout<T>(promise: Promise<T>) {
  // AbortSignal.timeout does not keep the process alive, unlike a setTimeout that outlives the build.
  const signal = AbortSignal.timeout(timeoutMs);
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => signal.addEventListener("abort", () => reject(new Error("timed out")))),
  ]);
}

async function isImage(url: string) {
  const response = await fetch(url, { method: "HEAD" });
  return response.ok && (response.headers.get("content-type") ?? "").startsWith("image/");
}

async function fetchPoster(source: TypeMediaSourceName, id: string) {
  const provider = posterProviders[source];
  // A full URL in `id` is an attribution link only, there is no ID to look up.
  if (!provider || /^https?:\/\//.test(id)) return null;
  try {
    const found = await withTimeout(provider(id));
    // Astro fails the build when a remote image does not load, so check the image first.
    return found && (await withTimeout(isImage(found))) ? found : null;
  } catch (error) {
    console.warn(`[posters] ${source} ${id}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function lookup(source: TypeMediaSourceName, id: string) {
  const key = `${source}:${id}`;
  let poster = cache.get(key);
  if (!poster) {
    poster = fetchPoster(source, id);
    cache.set(key, poster);
    // Keep only hits, so a provider that was down is asked again on the next request in dev.
    void poster.then((url) => url ?? cache.delete(key));
  }
  return poster;
}

/**
 * The cover for an entry's links: the first source that has one, in the order they are listed. Resolves to `null`
 * when none has, and never rejects, so a provider outage cannot fail the build.
 */
export async function resolvePoster(links: readonly TypePosterLink[]) {
  for (const { source, id } of links) {
    const poster = await lookup(source, id.trim());
    if (poster) return poster;
  }
  return null;
}
