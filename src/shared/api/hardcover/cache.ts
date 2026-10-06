interface TypeCacheEntry {
  value: unknown;
  expires: number;
}

// How long a stale value is served after a failed refresh, before the API is asked again.
const retryMs = 60_000;

const entries = new Map<string, TypeCacheEntry>();
const pending = new Map<string, Promise<unknown>>();

/**
 * Memoizes `load` per key for `ttlMs`. Concurrent calls share one request, and when a refresh fails the last good
 * value is served instead, so an outage or a rate limit shows slightly old books rather than an error.
 */
export function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const entry = entries.get(key);
  if (entry && entry.expires > Date.now()) return Promise.resolve(entry.value as T);

  let request = pending.get(key) as Promise<T> | undefined;
  if (!request) {
    request = load()
      .then((value) => {
        entries.set(key, { value, expires: Date.now() + ttlMs });
        return value;
      })
      .catch((error: unknown) => {
        if (!entry) throw error;
        console.warn(
          `[hardcover] ${key}: serving stale data, ${error instanceof Error ? error.message : String(error)}`,
        );
        entries.set(key, { value: entry.value, expires: Date.now() + retryMs });
        return entry.value as T;
      })
      .finally(() => pending.delete(key));
    pending.set(key, request);
  }
  return request;
}
