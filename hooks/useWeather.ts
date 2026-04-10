"use client";
import { useState, useCallback } from "react";
import type { WeatherData, RecentSearch } from "@/types/weather";
interface WeatherState 
{
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
}
interface UseWeatherReturn extends WeatherState 
{
    fetchWeather: (city: string) => Promise<void>;
    fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
    clearError: () => void;
}
export function useWeather(): UseWeatherReturn 
{
    const [state, setState] = useState<WeatherState>({data: null, loading: false, error: null,});
    const fetchWeather = useCallback
    (   async (city: string) => 
        {
            if (!city.trim()) 
                return;

            setState({ data: null, loading: true, error: null });
            try 
            {
                const res = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
                const json = await res.json();
                    
                if (!json.success) 
                {
                    setState({ data: null, loading: false, error: json.error });
                    return;
                }
                setState({ data: json.data, loading: false, error: null });
            } 
            catch 
            {
                setState({data: null,loading: false,error: "Network error. Please check your connection and try again.",});
            }
        }, []
    );

    const fetchWeatherByCoords = useCallback
    (
        async (lat: number, lon: number) => 
        {
            setState({ data: null, loading: true, error: null });
            try 
            {
                const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
                const json = await res.json();

                if (!json.success) 
                {
                    setState({ data: null, loading: false, error: json.error });
                    return;
                }
                setState({ data: json.data, loading: false, error: null });
            } 
            catch 
            {
                setState({data: null,loading: false,error: "Failed to fetch weather for your location.",});
            }
        },[]
    );

    const clearError = useCallback(() => { setState((prev) => ({ ...prev, error: null })); }, []);

    return { ...state, fetchWeather, fetchWeatherByCoords, clearError };
}
// Recent Searches Types and Hook
interface UseRecentSearchesReturn 
{
    searches: RecentSearch[];
    loading: boolean;
    refresh: () => Promise<void>;
    clear: () => Promise<void>;
}
export function useRecentSearches(): UseRecentSearchesReturn 
{
    const [searches, setSearches] = useState<RecentSearch[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback
    (
        async () => 
        {
            setLoading(true);
            try 
            {
                const res = await fetch("/api/recent-searches");
                const json = await res.json();

                if (json.success) 
                    setSearches(json.data);
            } 
            catch 
            {
                // silently fail
            } 
            finally 
            {
                setLoading(false);
            }
        }, []
    );

    const clear = useCallback
    (
        async () => 
        {
            try 
            {
                await fetch("/api/recent-searches", { method: "DELETE" });
                setSearches([]);
            } 
            catch 
            {
                // silently fail
            }
        }, []
    );

    return { searches, loading, refresh, clear };
}