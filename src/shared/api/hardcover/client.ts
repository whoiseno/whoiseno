import { HARDCOVER_API_KEY } from "astro:env/server";

const endpoint = "https://api.hardcover.app/v1/graphql";

/**
 * Runs a GraphQL query against Hardcover. Every top-level field in a query counts against the daily quota, so batch
 * only what is needed and put the result behind `cached`.
 */
export async function hardcover<T>(query: string, variables?: Record<string, unknown>) {
  if (!HARDCOVER_API_KEY) throw new Error("HARDCOVER_API_KEY is not set");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "whoiseno-site",
      // Hardcover shows the token without its "Bearer " prefix.
      "authorization": /^Bearer\s/i.test(HARDCOVER_API_KEY) ? HARDCOVER_API_KEY : `Bearer ${HARDCOVER_API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    const retryAfter = response.headers.get("retry-after");
    throw new Error(`${response.status} from Hardcover${retryAfter ? `, retry after ${retryAfter}s` : ""}`);
  }

  const { data, errors } = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (errors?.length || !data) throw new Error(errors?.[0]?.message ?? "Hardcover returned no data");
  return data;
}
