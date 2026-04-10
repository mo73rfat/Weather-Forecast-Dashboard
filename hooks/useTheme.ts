"use client";
import { useEffect, useState } from "react";
type Theme = "light" | "dark";
export function useTheme() 
{
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect
    (
        () => 
        {
            const stored = localStorage.getItem("weather-theme") as Theme | null;
            if (stored) 
            {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTheme(stored);
            } 
            else 
            {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                setTheme(prefersDark ? "dark" : "light");
            }
            setMounted(true);
        }, []
    );

    useEffect
    (
        () => 
        {
            if (!mounted) 
                return;

            const root = document.documentElement;

            if (theme === "dark") 
                root.classList.add("dark");
            else 
            root.classList.remove("dark");

            localStorage.setItem("weather-theme", theme);
        }, [theme, mounted]
    );

    const toggleTheme = () => 
    {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return { theme, toggleTheme, mounted };
}