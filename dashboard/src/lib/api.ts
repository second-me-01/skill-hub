/**
 * Resolve the internal API base URL for server-side fetch calls.
 * During build-time (no server running), returns null so pages can
 * gracefully render fallback / empty data.
 */
export function apiBase(): string {
  // Vercel / production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local dev / build
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Fetch wrapper for internal API routes.
 * Returns null when the fetch fails (e.g. during static build).
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${apiBase()}${path}`, {
      ...init,
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
