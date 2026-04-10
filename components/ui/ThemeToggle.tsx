"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle() 
{
    const { theme, toggleTheme, mounted } = useTheme();

    if (!mounted) 
    {
        return (
            <div className="w-10 h-10 rounded-full" style={{ background: "var(--border)" }} />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "border"
            )}
        style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
        }}
        >
        {theme === "dark" ? (
            <Sun size={18} className="text-yellow-400" />
        ) : (
            <Moon size={18} />
        )}
        </button>
    );
}