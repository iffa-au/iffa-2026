type CacheEntry = { data: unknown; expires: number };

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 60 * 60 * 1000;

export async function fetchJsonCached<T>(
	url: string,
	options?: RequestInit & { ttlMs?: number },
): Promise<T | null> {
	const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
	const cached = cache.get(url);
	if (cached && cached.expires > Date.now()) {
		return cached.data as T;
	}

	const { ttlMs: _ttl, ...fetchOptions } = options ?? {};
	const res = await fetch(url, fetchOptions);

	if (!res.ok) return null;

	const data = (await res.json()) as T;
	cache.set(url, { data, expires: Date.now() + ttlMs });
	return data;
}
