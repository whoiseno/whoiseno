const timeoutMs = 3_000;
const cache = new Map<string, Promise<string | null>>();

async function createPlaceholder(url: string) {
  try {
    // Imported here so a server that cannot load sharp renders covers without a preview instead of failing the page.
    const { default: sharp } = await import("sharp");
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) throw new Error(`${response.status} from ${url}`);
    const preview = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize({ width: 16 })
      .webp({ quality: 30 })
      .toBuffer();
    return `data:image/webp;base64,${preview.toString("base64")}`;
  } catch (error) {
    console.warn(`[placeholders] ${url}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * A 16px-wide WebP of a remote image as a data URI (about 100 to 300 bytes), small enough to inline in the HTML and
 * blur while the full image loads. Kept for the life of the server. Resolves to `null` when the image cannot be read,
 * and never rejects.
 */
export function getPlaceholder(url: string) {
  let placeholder = cache.get(url);
  if (!placeholder) {
    placeholder = createPlaceholder(url);
    cache.set(url, placeholder);
    // Keep only hits, so an image that failed is tried again on the next render.
    void placeholder.then((value) => value ?? cache.delete(url));
  }
  return placeholder;
}
