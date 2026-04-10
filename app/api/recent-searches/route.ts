import { NextResponse } from "next/server";
import { getRecentSearches, clearRecentSearches } from "@/lib/db";
import type { ApiResponse, RecentSearch } from "@/types/weather";
export const runtime = "nodejs";
export async function GET(): Promise<NextResponse<ApiResponse<RecentSearch[]>>> 
{
    try 
    {
        const searches = getRecentSearches();
        return NextResponse.json({ success: true, data: searches });
    } 
    catch (err) 
    {
        console.error("[/api/recent-searches GET] Error:", err);
        return NextResponse.json
        (
            { success: false, error: "Failed to retrieve recent searches.", code: "DB_ERROR" },
            { status: 500 }
        );
    }
}
export async function DELETE(): Promise<NextResponse<ApiResponse<null>>> 
{
    try 
    {
        clearRecentSearches();
        return NextResponse.json({ success: true, data: null });
    } 
    catch (err) 
    {
        console.error("[/api/recent-searches DELETE] Error:", err);
        return NextResponse.json
        (
            { success: false, error: "Failed to clear recent searches.", code: "DB_ERROR" },
            { status: 500 }
        );
    }
}