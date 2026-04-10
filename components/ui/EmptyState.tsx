"use client";
import { Cloud, Search, MapPin } from "lucide-react";
interface EmptyStateProps 
{
    onGeolocate: () => void;
}

export function EmptyState({ onGeolocate }: EmptyStateProps) 
{
    return (
        <div className="card p-12 flex flex-col items-center gap-6 text-center animate-fade-in">
            <div
                className="w-24 h-24 rounded-full flex items-center justify-center weather-gradient"
            >
                <Cloud size={48} style={{ color: "var(--accent)" }} />
            </div>
            <div>
                <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--text-primary)" }}
                >
                    Welcome to Weather Forecast Dashboard
                </h2>
                <p className="text-base max-w-md" style={{ color: "var(--text-secondary)" }}>
                    Search for any city to get current weather conditions and a 5-day forecast, or use your location for instant updates.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <div
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: "var(--bg-primary)", color: "var(--text-secondary)" }}
                >
                    <Search size={16} style={{ color: "var(--accent)" }} />
                    Type a city name above
                </div>
                <button
                    onClick={onGeolocate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "var(--accent)", color: "#fff" }}
                >
                    <MapPin size={16} />
                    Use My Location
                </button>
            </div>
        </div>
    );
}