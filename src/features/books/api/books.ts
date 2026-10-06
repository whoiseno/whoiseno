import { cached, hardcover } from "@/shared/api/hardcover";

export interface TypeBook {
  id: number;
  title: string;
  author?: string;
  cover?: string;
  rating?: number;
  /** An excerpt of the owner's review. */
  review?: string;
  status: "want" | "reading" | "read";
  startedAt?: Date;
  finishedAt?: Date;
  url: string;
}

export interface TypeBookPage {
  page: number;
  pageCount: number;
  /** Only on the first page. */
  reading: TypeBook[];
  library: TypeBook[];
}

interface TypeUserBook {
  id: number;
  status_id: 1 | 2 | 3;
  rating: number | string | null;
  review_raw: string | null;
  review_has_spoilers: boolean;
  first_started_reading_date: string | null;
  last_read_date: string | null;
  book: {
    slug: string;
    title: string;
    cached_image: { url?: string } | null;
    cached_contributors: { author: { name: string }; contribution: string | null }[] | null;
  };
}

const pageSize = 12;
const readingLimit = 20;
const reviewLength = 200;
const cacheMs = 5 * 60_000;

const statuses = { 1: "want", 2: "reading", 3: "read" } as const;

// Public entries only: this is a public site. The nested book fields are JSON columns, which keeps the query within
// Hardcover's depth limit and avoids joining the contributors and editions tables.
const fields = `
  id status_id rating review_raw review_has_spoilers first_started_reading_date last_read_date
  book { slug title cached_image cached_contributors }`;
const libraryFilter = `where: {user_id: {_eq: $userId}, status_id: {_in: [1, 3]}, privacy_setting_id: {_eq: 1}}`;

const queries = {
  user: `{ me { id } }`,
  total: `query ($userId: Int!) { user_books_aggregate(${libraryFilter}) { aggregate { count } } }`,
  reading: `query ($userId: Int!, $limit: Int!) {
    user_books(
      where: {user_id: {_eq: $userId}, status_id: {_eq: 2}, privacy_setting_id: {_eq: 1}}
      order_by: [{first_started_reading_date: desc_nulls_last}, {id: desc}]
      limit: $limit
    ) { ${fields} }
  }`,
  library: `query ($userId: Int!, $limit: Int!, $offset: Int!) {
    user_books(
      ${libraryFilter}
      order_by: [{status_id: desc}, {last_read_date: desc_nulls_last}, {id: desc}]
      limit: $limit
      offset: $offset
    ) { ${fields} }
  }`,
};

const toDate = (value: string | null) => (value ? new Date(value) : undefined);

function excerpt(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= reviewLength ? clean : `${clean.slice(0, reviewLength).replace(/\s+\S*$/, "")}…`;
}

function toBook(row: TypeUserBook): TypeBook {
  const { book } = row;
  const contributors = book.cached_contributors ?? [];
  const authors = contributors.filter(({ contribution }) => !contribution || contribution === "Author");
  return {
    id: row.id,
    title: book.title,
    author: (authors.length > 0 ? authors : contributors).map(({ author }) => author.name).join(", ") || undefined,
    cover: book.cached_image?.url,
    rating: row.rating == null ? undefined : Number(row.rating),
    // A review marked as containing spoilers stays on Hardcover.
    review: row.review_raw && !row.review_has_spoilers ? excerpt(row.review_raw) : undefined,
    status: statuses[row.status_id],
    startedAt: toDate(row.first_started_reading_date),
    finishedAt: toDate(row.last_read_date),
    url: `https://hardcover.app/books/${book.slug}`,
  };
}

async function userBooks(query: string, variables: Record<string, unknown>) {
  const { user_books } = await hardcover<{ user_books: TypeUserBook[] }>(query, variables);
  return user_books.map(toBook);
}

/**
 * One page of the owner's public Hardcover library: the books being read (first page only), then read and
 * want-to-read books, newest first. Each request is cached, and the total is checked first so a page number past the
 * end never reaches the API.
 */
export async function getBooks(page: number): Promise<TypeBookPage> {
  const userId = await cached("user", Infinity, async () => {
    // `me` is a list with one entry.
    const { me } = await hardcover<{ me: { id: number }[] }>(queries.user);
    if (!me[0]) throw new Error("Hardcover returned no user for this token");
    return me[0].id;
  });

  const total = await cached("total", cacheMs, async () => {
    const { user_books_aggregate } = await hardcover<{ user_books_aggregate: { aggregate: { count: number } } }>(
      queries.total,
      { userId },
    );
    return user_books_aggregate.aggregate.count;
  });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (page > pageCount) return { page, pageCount, reading: [], library: [] };

  const [reading, books] = await Promise.all([
    page === 1
      ? cached("reading", cacheMs, () => userBooks(queries.reading, { userId, limit: readingLimit }))
      : Promise.resolve([]),
    cached(`library:${page}`, cacheMs, () =>
      userBooks(queries.library, { userId, limit: pageSize, offset: (page - 1) * pageSize }),
    ),
  ]);
  return { page, pageCount, reading, library: books };
}
