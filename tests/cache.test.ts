import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// I Tests for the in-memory cache implementation used by Next.js. This is a simplified version of the actual cache logic, focused on testing the core functionality in isolation.
class InMemoryCache 
{
    private store = new Map<string, { data: unknown; expiresAt: number }>();
    private ttlMs: number;

    constructor(ttlMs = 600_000) {
        this.ttlMs = ttlMs;
    }

    set<T>(key: string, value: T): void {
        this.store.set(key, { data: value, expiresAt: Date.now() + this.ttlMs });
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

    ttl(key: string): number {
        const entry = this.store.get(key);
        if (!entry) return 0;
        const remaining = entry.expiresAt - Date.now();
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    }
    }

    describe("InMemoryCache", () => {
    let cache: InMemoryCache;

    beforeEach(() => {
        cache = new InMemoryCache(10_000); // 10 second TTL for tests
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("stores and retrieves a value", () => {
        cache.set("key1", { city: "London" });
        expect(cache.get("key1")).toEqual({ city: "London" });
    });

    it("returns null for missing keys", () => {
        expect(cache.get("nonexistent")).toBeNull();
    });

    it("returns null after TTL expires", () => {
        cache.set("key2", "value");
        vi.advanceTimersByTime(11_000); // advance past TTL
        expect(cache.get("key2")).toBeNull();
    });

    it("has() returns true for live entries and false for expired ones", () => {
        cache.set("key3", 42);
        expect(cache.has("key3")).toBe(true);
        vi.advanceTimersByTime(11_000);
        expect(cache.has("key3")).toBe(false);
    });

    it("delete() removes a key", () => {
        cache.set("key4", "hello");
        cache.delete("key4");
        expect(cache.get("key4")).toBeNull();
    });

    it("clear() removes all keys", () => {
        cache.set("a", 1);
        cache.set("b", 2);
        cache.clear();
        expect(cache.get("a")).toBeNull();
        expect(cache.get("b")).toBeNull();
    });

    it("ttl() returns remaining seconds for a live key", () => {
        cache.set("key5", "data");
        vi.advanceTimersByTime(3_000);
        const remaining = cache.ttl("key5");
        expect(remaining).toBeGreaterThan(0);
        expect(remaining).toBeLessThanOrEqual(10);
    });

    it("ttl() returns 0 for an expired key", () => {
        cache.set("key6", "data");
        vi.advanceTimersByTime(11_000);
        expect(cache.ttl("key6")).toBe(0);
    });
});