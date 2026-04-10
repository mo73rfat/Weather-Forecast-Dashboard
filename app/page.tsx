"use client";
import { useEffect, useState, useCallback } from "react";
import { Cloud } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UnitToggle } from "@/components/ui/UnitToggle";
import { SearchBar } from "@/components/weather/SearchBar";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { ForecastSection } from "@/components/weather/ForecastSection";
import { WeatherSkeleton } from "@/components/ui/Skeleton";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { EmptyState } from "@/components/ui/EmptyState";
import { useWeather, useRecentSearches } from "@/hooks/useWeather";

export default function HomePage() 
{
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [geoloading, setGeoloading] = useState(false);
  const [lastCity, setLastCity] = useState<string | null>(null);
  const { data, loading, error, fetchWeather, fetchWeatherByCoords, clearError } = useWeather();
  const { searches, refresh: refreshSearches } = useRecentSearches();

  // Load recent searches on mount
  useEffect(() => { refreshSearches(); }, [refreshSearches]);

  // Refresh recent searches after successful weather fetch
  useEffect(() => { if (data) refreshSearches(); }, [data, refreshSearches]);

  const handleSearch = useCallback(
    async (city: string) => 
    {
      setLastCity(city);
      await fetchWeather(city);
    },
    [fetchWeather]
  );

  const handleGeolocate = useCallback(() => 
  {
    if (!navigator.geolocation) 
    {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGeoloading(true);
    navigator.geolocation.getCurrentPosition
    (
      async ({ coords }) => 
      {
        await fetchWeatherByCoords(coords.latitude, coords.longitude);
        setGeoloading(false);
      },
      () => 
      {
        setGeoloading(false);
        alert("Unable to retrieve your location. Please allow location access.");
      },
      { timeout: 10000 }
    );
  }, [fetchWeatherByCoords]);

  const handleRetry = useCallback(() => 
  {
    clearError();
    if (lastCity) 
      fetchWeather(lastCity);
  }, [clearError, fetchWeather, lastCity]);

  const handleUnitChange = useCallback
  (
    (newUnit: "metric" | "imperial") => {
      setUnit(newUnit);
      if (lastCity) fetchWeather(lastCity);
    },
    [fetchWeather, lastCity]
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 mr-auto">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <img
                src="./favicon.ico"
                alt="Weather Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className="font-bold text-lg hidden sm:block"
              style={{ color: "var(--text-primary)" }}
            >
              Weather Forecast Dashboard
            </span>
          </div>
          <UnitToggle unit={unit} onChange={handleUnitChange} />
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Search */}
        <section>
          <SearchBar
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
            recentSearches={searches}
            geoloading={geoloading}
            disabled={loading}
          />
        </section>

        {/* Content */}
        <section>
          {loading && <WeatherSkeleton />}

          {!loading && error && (
            <ErrorDisplay error={error} onRetry={handleRetry} />
          )}

          {!loading && !error && data && (
            <div className="space-y-6">
              <CurrentWeatherCard weather={data.current} unit={unit} />
              <ForecastSection forecast={data.forecast} unit={unit} />
            </div>
          )}

          {!loading && !error && !data && (
            <EmptyState onGeolocate={handleGeolocate} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-16 py-6 text-center text-sm"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p>
          Developed by{" "}
          <a
            href="https://www.mo73rfat.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            Mohammad Arafat
          </a>
        </p>

        <p className="mt-2">
          Weather data provided by{" "}
          <a
            href="https://openweathermap.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            OpenWeatherMap
          </a>
        </p>
      </footer>
    </div>
  );
}