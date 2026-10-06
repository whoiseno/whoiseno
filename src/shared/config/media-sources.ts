export type TypeMediaKind = "book" | "movie";

interface TypeMediaSource {
  /** Public name shown on the attribution link. */
  name: string;
  /** Option label in the CMS; says which ID to paste. */
  label: string;
  kinds: readonly TypeMediaKind[];
  url: (id: string) => string;
}

/** Free or open catalogues that an entry can link back to. `id` is the part of the entry URL that identifies it. */
export const mediaSourceCatalog = {
  "openlibrary": {
    name: "Open Library",
    label: "Open Library (work ID, e.g. OL45804W)",
    kinds: ["book"],
    url: (id) => `https://openlibrary.org/works/${id}`,
  },
  "openlibrary-isbn": {
    name: "Open Library",
    label: "Open Library (ISBN)",
    kinds: ["book"],
    url: (id) => `https://openlibrary.org/isbn/${id}`,
  },
  "googlebooks": {
    name: "Google Books",
    label: "Google Books (volume ID)",
    kinds: ["book"],
    url: (id) => `https://books.google.com/books?id=${id}`,
  },
  "hardcover": {
    name: "Hardcover",
    label: "Hardcover (book slug)",
    kinds: ["book"],
    url: (id) => `https://hardcover.app/books/${id}`,
  },
  "tmdb-movie": {
    name: "TMDB",
    label: "TMDB (movie ID)",
    kinds: ["movie"],
    url: (id) => `https://www.themoviedb.org/movie/${id}`,
  },
  "tmdb-tv": {
    name: "TMDB",
    label: "TMDB (TV ID)",
    kinds: ["movie"],
    url: (id) => `https://www.themoviedb.org/tv/${id}`,
  },
  "anilist": {
    name: "AniList",
    label: "AniList (anime ID)",
    kinds: ["movie"],
    url: (id) => `https://anilist.co/anime/${id}`,
  },
  "myanimelist": {
    name: "MyAnimeList",
    label: "MyAnimeList (anime ID)",
    kinds: ["movie"],
    url: (id) => `https://myanimelist.net/anime/${id}`,
  },
  "wikidata": {
    name: "Wikidata",
    label: "Wikidata (item ID, e.g. Q25188)",
    kinds: ["book", "movie"],
    url: (id) => `https://www.wikidata.org/wiki/${id}`,
  },
} as const satisfies Record<string, TypeMediaSource>;

export type TypeMediaSourceName = keyof typeof mediaSourceCatalog;

export function mediaSourceNames(kind: TypeMediaKind) {
  return (Object.keys(mediaSourceCatalog) as TypeMediaSourceName[]).filter((name) =>
    (mediaSourceCatalog[name].kinds as readonly TypeMediaKind[]).includes(kind),
  ) as [TypeMediaSourceName, ...TypeMediaSourceName[]];
}

/** Builds the attribution link for an entry. A full `http(s)` URL in `id` is used as is. */
export function resolveMediaLink(source: TypeMediaSourceName, id: string): { name: string; href: string } {
  const value = id.trim();
  const { name, url } = mediaSourceCatalog[source];
  return { name, href: /^https?:\/\//.test(value) ? value : url(encodeURIComponent(value)) };
}
