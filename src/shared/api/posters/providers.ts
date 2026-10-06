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

/** Sources that can supply a cover. The rest (Wikidata) only link back. */
export const posterProviders: Partial<Record<TypeMediaSourceName, TypePosterProvider>> = {
  "tmdb-movie": async (id) => tmdbPoster((await tmdb().movies.details({ movie_id: Number(id) })).poster_path),
  "tmdb-tv": async (id) => tmdbPoster((await tmdb().tv_series.details({ series_id: Number(id) })).poster_path),
  "anilist": anilist("id"),
  "myanimelist": anilist("idMal"),
};
