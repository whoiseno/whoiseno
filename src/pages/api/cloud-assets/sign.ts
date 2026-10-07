import { createHash } from "node:crypto";

import type { APIRoute } from "astro";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "astro:env/server";

import keystaticConfig from "../../../../keystatic.config";

export const prerender = false;

/** Every upload lands under this folder, so the Cloudinary library stays tidy. */
const rootFolder = "whoiseno";
const folderPattern = /^[a-z0-9][a-z0-9/_-]*$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

/**
 * The same gate as the CMS: a signed-in GitHub user with write access to the content repository. Local storage only
 * exists under `pnpm dev`, where there is no sign-in to check.
 */
async function canWrite(token: string | undefined) {
  const { storage } = keystaticConfig;
  if (storage.kind === "local") return true;
  if (storage.kind !== "github" || !token) return false;

  const repo = typeof storage.repo === "string" ? storage.repo : `${storage.repo.owner}/${storage.repo.name}`;
  const response = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      "accept": "application/vnd.github+json",
      "authorization": `Bearer ${token}`,
      "user-agent": "whoiseno-site",
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return false;
  const { permissions } = (await response.json()) as { permissions?: { push?: boolean } };
  return permissions?.push === true;
}

/**
 * Signs one upload for the CMS. The browser sends the file straight to Cloudinary with these parameters, so the file
 * never passes through this function (Vercel limits a request body to 4.5 MB) and the API secret never leaves the
 * server.
 */
export const POST: APIRoute = async ({ cookies, request }) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return json(
      { error: "Cloudinary is not set up: add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET." },
      500,
    );
  }
  if (!(await canWrite(cookies.get("keystatic-gh-access-token")?.value))) {
    return json({ error: "Sign in to the CMS with a GitHub account that can write to the repository." }, 403);
  }

  const body = (await request.json().catch(() => null)) as { folder?: unknown } | null;
  const folder = typeof body?.folder === "string" ? body.folder : "";
  if (!folderPattern.test(folder))
    return json({ error: "The folder must be lowercase letters, digits, - _ and /." }, 400);

  // Cloudinary signs the parameters sorted by name and joined with `&`, with the secret on the end.
  const params = {
    folder: `${rootFolder}/${folder}`,
    timestamp: String(Math.round(Date.now() / 1000)),
    unique_filename: "true",
    use_filename: "true",
  };
  const payload = Object.entries(params)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const signature = createHash("sha1")
    .update(payload + CLOUDINARY_API_SECRET)
    .digest("hex");

  return json({
    // `auto` lets Cloudinary tell an image from a video or an audio clip.
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    params: { ...params, api_key: CLOUDINARY_API_KEY, signature },
  });
};
