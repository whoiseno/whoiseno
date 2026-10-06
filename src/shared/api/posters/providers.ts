import type { TypeMediaSourceName } from "@/shared/config/media-sources";
import { TMDB } from "@lorenzopant/tmdb";
import { TMDB_TOKEN } from "astro:env/server";

/** Resolves a source's own ID to the URL of a cover image, or nothing when the work has none. */
type TypePosterProvider = (id: string) => Promise<string | null | undefined>;

async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status} from ${url}`);
  return (await response.json()) as T;
}

let tmdbClient: TMDB | undefined;
function tmdb() {
  if (!TMDB_TOKEN) throw new Error("TMDB_TOKEN is not set");
  return (tmdbClient ??= new TMDB(TMDB_TOKEN));
}

const tmdbPoster = (path?: string) => (path ? tmdb().images.poster(path, "w500") : null);

// Covers lists the cover IDs of a work or an edition; -1 marks a removed one.
const openLibraryCover = ({ covers }: { covers?: number[] }) => {
  const cover = covers?.find((id) => id > 0);
  return cover ? `https://covers.openlibrary.org/b/id/${cover}-L.jpg` : null;
};

// AniList can look an anime up by its MyAnimeList ID, so MyAnimeList entries need no second API.
const anilist =
  (field: "id" | "idMal"): TypePosterProvider =>
  async (id) => {
    const { data } = await requestJson<{ data: { Media: { coverImage: { extraLarge?: string } } | null } }>(
      "https://graphql.anilist.co",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query ($id: Int) { Media(${field}: $id, type: ANIME) { coverImage { extraLarge } } }`,
          variables: { id: Number(id) },
        }),
      },
    );
    return data.Media?.coverImage.extraLarge;
  };

/** Sources that can supply a cover. The rest (Hardcover, Wikidata) only link back. */
export const posterProviders: Partial<Record<TypeMediaSourceName, TypePosterProvider>> = {
  "openlibrary": async (id) =>
    openLibraryCover(await requestJson(`https://openlibrary.org/works/${encodeURIComponent(id)}.json`)),
  "openlibrary-isbn": async (id) =>
    openLibraryCover(await requestJson(`https://openlibrary.org/isbn/${encodeURIComponent(id)}.json`)),
  "googlebooks": async (id) => {
    // The volumes API has no usable keyless quota, so this uses the cover endpoint behind the book pages.
    // It answers 200 with a PNG placeholder for a missing cover, while real covers are JPEG.
    const url = `https://books.google.com/books/content?id=${encodeURIComponent(id)}&printsec=frontcover&img=1&zoom=2`;
    const response = await fetch(url, { method: "HEAD" });
    return response.headers.get("content-type") === "image/jpeg" ? url : null;
  },
  "tmdb-movie": async (id) => tmdbPoster((await tmdb().movies.details({ movie_id: Number(id) })).poster_path),
  "tmdb-tv": async (id) => tmdbPoster((await tmdb().tv_series.details({ series_id: Number(id) })).poster_path),
  "anilist": anilist("id"),
  "myanimelist": anilist("idMal"),
};
