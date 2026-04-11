"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Clock, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeocodingResult, RecentSearch } from "@/types/weather";
interface SearchBarProps 
{
    onSearch: (city: string) => void;
    onGeolocate: () => void;
    recentSearches: RecentSearch[];
    geoloading?: boolean;
    disabled?: boolean;
}

export function SearchBar
(
    {
        onSearch,
        onGeolocate,
        recentSearches,
        geoloading = false,
        disabled = false,
        }: SearchBarProps
) 
{
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   // Fetch suggestions from geocoding API
    const fetchSuggestions = useCallback
    (   
        async (q: string) => 
        {
            if (q.length < 2) 
            {
                setSuggestions([]);
                return;
            }
            setFetchingSuggestions(true);
        try 
        {
            const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
            const json = await res.json();

            if (json.success) 
                setSuggestions(json.data);
        } 
        catch 
        {
            setSuggestions([]);
        } 
        finally 
        {
            setFetchingSuggestions(false);
        }
        }, []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    {
        const val = e.target.value;
        setQuery(val);
        setHighlightIndex(-1);

        if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);

        setShowDropdown(true);
    };
    const handleSubmit = (e: React.FormEvent) => 
    {
        e.preventDefault();
        if (query.trim()) {
        onSearch(query.trim());
        setShowDropdown(false);
        setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (name: string) => 
    {
        setQuery(name);
        onSearch(name);
        setShowDropdown(false);
        setSuggestions([]);
        inputRef.current?.blur();
    };

    const handleSelectRecent = (city: string) => 
    {
        setQuery(city);
        onSearch(city);
        setShowDropdown(false);
        inputRef.current?.blur();
    };

    const handleClear = () => 
    {
        setQuery("");
        setSuggestions([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => 
    {
        const items = suggestions.length > 0 ? suggestions : recentSearches;
        const total = items.length;

        if (e.key === "ArrowDown") 
        {
            e.preventDefault();
            setHighlightIndex((prev) => (prev + 1) % total);
        } 
        else if (e.key === "ArrowUp") 
        {
            e.preventDefault();
            setHighlightIndex((prev) => (prev - 1 + total) % total);
        } 
        else if (e.key === "Enter" && highlightIndex >= 0) 
        {
            e.preventDefault();
            if (suggestions.length > 0) 
            {
                const s = suggestions[highlightIndex];
                handleSelectSuggestion(s.state ? `${s.name}, ${s.state}, ${s.country}` : `${s.name}, ${s.country}`);
            } 
            else if (recentSearches.length > 0) 
                handleSelectRecent(recentSearches[highlightIndex].city);
        } 
        else if (e.key === "Escape") 
            setShowDropdown(false);
    };

    // Close on outside click
    useEffect(
    () => 
        {
            const handler = (e: MouseEvent) => 
            {
                if 
                (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(e.target as Node) &&
                    !inputRef.current?.contains(e.target as Node)
                ) 
                    setShowDropdown(false);
            };
            document.addEventListener("mousedown", handler);
            return () => document.removeEventListener("mousedown", handler);
        }, []
    );

    const showRecent = showDropdown && query.length === 0 && recentSearches.length > 0;
    const showSuggestions = showDropdown && suggestions.length > 0;

    return (
        <div className="relative w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
            <div
            className="flex items-center rounded-2xl border transition-all duration-200 overflow-hidden"
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            >
            <Search
                size={20}
                className="ml-4 flex-shrink-0"
                style={{ color: "var(--text-muted)" }}
            />
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search for a city..."
                disabled={disabled}
                className="flex-1 min-w-0 px-3 py-4 bg-transparent outline-none text-base"
                style={{ color: "var(--text-primary)" }}
                autoComplete="off"
                spellCheck={false}
                aria-label="Search city"
                aria-autocomplete="list"
                aria-expanded={showDropdown}
            />
            {fetchingSuggestions && (
                <Loader2 size={16} className="mr-2 animate-spin" style={{ color: "var(--text-muted)" }} />
            )}
            {query && (
                <button
                type="button"
                onClick={handleClear}
                className="p-2 mr-1 rounded-full transition-colors"
                style={{ color: "var(--text-muted)" }}
                aria-label="Clear search"
                >
                <X size={16} />
                </button>
            )}
            <button
                type="button"
                onClick={onGeolocate}
                disabled={geoloading || disabled}
                className={cn(
                "p-3 mr-1 rounded-xl transition-all duration-200",
                "hover:scale-105 active:scale-95"
                )}
                style={{
                color: geoloading ? "var(--text-muted)" : "var(--accent)",
                }}
                aria-label="Use my location"
                title="Use my location"
            >
                {geoloading ? (
                <Loader2 size={18} className="animate-spin" />
                ) : (
                <MapPin size={18} />
                )}
            </button>
            <button
                type="submit"
                disabled={!query.trim() || disabled}
                className={cn(
                "px-5 py-4 font-semibold text-sm transition-all duration-200 rounded-r-2xl",
                "hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                )}
                style={{
                background: "var(--accent)",
                color: "#ffffff",
                }}
            >
                Search
            </button>
            </div>
        </form>

        {/* Dropdown */}
        {(showRecent || showSuggestions) && (
            <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border overflow-hidden z-50 animate-slide-down"
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
            >
            {showRecent && (
                <>
                <div
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                >
                    Recent Searches
                </div>
                {recentSearches.map((s, i) => (
                    <button
                    key={s.id}
                    onClick={() => handleSelectRecent(s.city)}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                        highlightIndex === i ? "opacity-80" : ""
                    )}
                    style={{
                        background: highlightIndex === i ? "var(--border)" : "transparent",
                        color: "var(--text-primary)",
                    }}
                    onMouseEnter={() => setHighlightIndex(i)}
                    >
                    <Clock size={14} style={{ color: "var(--text-muted)" }} />
                    <span className="flex-1">{s.city}</span>
                    {s.country && (
                        <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--border)", color: "var(--text-secondary)" }}
                        >
                        {s.country}
                        </span>
                    )}
                    </button>
                ))}
                </>
            )}

            {showSuggestions && (
                <>
                <div
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                >
                    Suggestions
                </div>
                {suggestions.map((s, i) => {
                    const label = s.state
                    ? `${s.name}, ${s.state}, ${s.country}`
                    : `${s.name}, ${s.country}`;
                    return (
                    <button
                        key={`${s.lat}-${s.lon}`}
                        onClick={() => handleSelectSuggestion(label)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                        style={{
                        background: highlightIndex === i ? "var(--border)" : "transparent",
                        color: "var(--text-primary)",
                        }}
                        onMouseEnter={() => setHighlightIndex(i)}
                    >
                        <MapPin size={14} style={{ color: "var(--accent)" }} />
                        <span className="flex-1">{s.name}</span>
                        <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                        >
                        {s.state ? `${s.state}, ` : ""}
                        {s.country}
                        </span>
                    </button>
                    );
                })}
                </>
            )}
            </div>
        )}
        </div>
    );
}