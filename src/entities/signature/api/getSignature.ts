import { getEntry } from "astro:content";

// Read as text at build time: the component animates the paths, so it needs the markup, not an image URL.
const files = import.meta.glob<string>("/src/assets/signature/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

/** The markup of the uploaded signature, or `null` while none is uploaded. */
export async function getSignature(): Promise<string | null> {
  const signature = await getEntry("signature", "index");
  const file = signature?.data.file;
  if (!file) return null;

  const name = file.split("/").pop();
  const svg = files[`/src/assets/signature/${name}`];
  if (!svg) {
    throw new Error(`The signature file "${name}" is not an SVG in src/assets/signature. Upload an .svg in Keystatic.`);
  }
  return svg;
}
