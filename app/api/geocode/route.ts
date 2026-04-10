import { NextRequest, NextResponse } from "next/server";
import { weatherCache } from "@/lib/cache";
import type { ApiResponse, GeocodingResult } from "@/types/weather";
export const runtime = "nodejs";
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<GeocodingResult[]>>> 
{
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) 
        return NextResponse.json({ success: true, data: [] });

    const cacheKey = `geocode:${query.toLowerCase()}`;

    const cached = weatherCache.get<GeocodingResult[]>(cacheKey);
    if (cached) 
        return NextResponse.json({ success: true, data: cached });

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) 
    {
        return NextResponse.json
        (
            { success: false, error: "API key not configured.", code: "CONFIG_ERROR" },
            { status: 500 }
        );
    }
    try 
    {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) 
        {
            return NextResponse.json
            (
                { success: false, error: "Geocoding service error.", code: "API_ERROR" },
                { status: res.status }
            );
        }

        const data = (await res.json()) as GeocodingResult[];
        weatherCache.set(cacheKey, data);

        return NextResponse.json({ success: true, data });
    } 
    catch (err) {
        console.error("[/api/geocode] Error:", err);
        return NextResponse.json
        (
            { success: false, error: "Failed to fetch city suggestions.", code: "NETWORK_ERROR" },
            { status: 500 }
        );
    }
}