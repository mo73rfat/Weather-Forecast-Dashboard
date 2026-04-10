import { NextRequest, NextResponse } from "next/server";
import { getWeatherData, getWeatherByCoords, WeatherError } from "@/lib/weather";
import { addRecentSearch } from "@/lib/db";
import type { ApiResponse, WeatherData } from "@/types/weather";
export const runtime = "nodejs";
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<WeatherData>>> 
{
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim();
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const units = searchParams.get("units") ?? "metric";

    // Validate units
    if (!["metric", "imperial", "standard"].includes(units)) 
    {
        return NextResponse.json
        (
            { success: false, error: "Invalid units parameter.", code: "INVALID_PARAMS" },
            { status: 400 }
        );
    }
    try 
    {
        let data: WeatherData;

        if (lat && lon) 
        {
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);

            if (isNaN(latNum) || isNaN(lonNum)) 
            {
                return NextResponse.json
                (
                    { success: false, error: "Invalid coordinates.", code: "INVALID_PARAMS" },
                    { status: 400 }
                );
            }

            data = await getWeatherByCoords(latNum, lonNum, units);

            // Save to recent searches after successful fetch
            addRecentSearch(data.current.city, data.current.country);
        } 
        else if (city) 
        {
            if (city.length < 2 || city.length > 100) 
            {
                return NextResponse.json
                (
                    { success: false, error: "City name must be between 2 and 100 characters.", code: "INVALID_PARAMS" },
                    { status: 400 }
                );
            }

            data = await getWeatherData(city, units);

            // Save to recent searches after successful fetch
            addRecentSearch(data.current.city, data.current.country);
        } 
        else 
        {
            return NextResponse.json
            (
                { success: false, error: "Please provide a city name or coordinates.", code: "MISSING_PARAMS" },
                { status: 400 }
            );
        }
            
        return NextResponse.json({ success: true, data });
    } 
    catch (err) 
    {
        if (err instanceof WeatherError) 
        {
            return NextResponse.json
            (
                { success: false, error: err.message, code: err.code },
                { status: err.status }
            );
        }
        return NextResponse.json
        (
            { success: false, error: "An unexpected error occurred. Please try again.", code: "INTERNAL_ERROR" },
            { status: 500 }
        );
    }
}