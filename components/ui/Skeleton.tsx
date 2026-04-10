"use client";
import { cn } from "@/lib/utils";
interface SkeletonProps 
{
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) 
{
    return (
        <div
            className={cn("rounded-lg animate-pulse", className)}
            style={{ background: "var(--border)" }}
        />
    );
}
export function WeatherSkeleton() 
{
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Current weather skeleton */}
            <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-24 w-24 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-14 w-36" />
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
            </div>
            {/* Forecast skeleton */}
        <div>
            <Skeleton className="h-6 w-36 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-52 rounded-2xl" />
                ))}
            </div>
        </div>
        {/* Chart skeleton */}
            <div className="card p-6">
                <Skeleton className="h-6 w-44 mb-6" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        </div>
    );
}