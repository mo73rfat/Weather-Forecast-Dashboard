// A simple in-memory cache for weather data, with TTL support.
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CacheEntry<T> 
{
    data: T;
    expiresAt: number;
}

class InMemoryCache 
{
    private store = new Map<string, CacheEntry<unknown>>();

    set<T>(key: string, value: T): void {
        this.store.set(key, {
        data: value,
        expiresAt: Date.now() + CACHE_TTL_MS,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
        this.store.delete(key);
        return null;
        }
        return entry.data as T;
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    delete(key: string): void {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }

    // Returns remaining TTL in seconds for a key, or 0 if expired/absent.
    ttl(key: string): number {
        const entry = this.store.get(key);
        if (!entry) return 0;
        const remaining = entry.expiresAt - Date.now();
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    }
}

// Singleton — shared across all route handler invocations in the same process.
export const weatherCache = new InMemoryCache();