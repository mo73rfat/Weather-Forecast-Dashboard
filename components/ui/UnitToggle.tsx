"use client";
import { cn } from "@/lib/utils";
interface UnitToggleProps 
{
    unit: "metric" | "imperial";
    onChange: (unit: "metric" | "imperial") => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) 
{
return (
        <div
            className="flex rounded-xl p-1 border"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
        {(["metric", "imperial"] as const).map((u) => (
            <button
            key={u}
            onClick={() => onChange(u)}
            className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
            )}
            style={{
                background: unit === u ? "var(--accent)" : "transparent",
                color: unit === u ? "#fff" : "var(--text-secondary)",
            }}
            aria-pressed={unit === u}
            >
            {u === "metric" ? "°C" : "°F"}
            </button>
        ))}
        </div>
    );
}