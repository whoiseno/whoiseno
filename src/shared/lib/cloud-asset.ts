import type { ImageMetadata } from "astro";

/** A file the CMS uploaded to Cloudinary. An image also carries its size, so a page can reserve the space for it. */
export interface TypeCloudAsset {
  url: string;
  width?: number;
  height?: number;
}

/** What an image field holds: a file imported from `src/assets`, or an upload on Cloudinary. */
export type TypeImageSource = ImageMetadata | TypeCloudAsset;

const cloudinaryImage = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export function isCloudAsset(value: unknown): value is TypeCloudAsset {
  return typeof value === "object" && value !== null && "url" in value && typeof value.url === "string";
}

/**
 * The URL of an uploaded image, resized by Cloudinary when it is requested instead of when the site is built. `width`
 * caps the size (a smaller original is never enlarged) and `format` is the best one the browser accepts unless a fixed
 * one is needed, such as JPEG for a social preview. SVG and files on any other host are returned as they are.
 */
export function cloudImageUrl(url: string, { width, format = "auto" }: { width?: number; format?: string } = {}) {
  const match = cloudinaryImage.exec(url);
  if (!match || /\.svg(\?|$)/i.test(url)) return url;
  const transformation = [`f_${format}`, "q_auto", width && `c_limit,w_${width}`].filter(Boolean).join(",");
  return `${match[1]}${transformation}/${match[2]}`;
}

/** A `srcset` with one file for each width, none larger than the original. */
export function cloudImageSrcset(asset: TypeCloudAsset, widths: number[]) {
  const sizes = new Set(widths.map((width) => (asset.width ? Math.min(width, asset.width) : width)));
  return [...sizes].map((width) => `${cloudImageUrl(asset.url, { width })} ${width}w`).join(", ");
}
