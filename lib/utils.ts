import { clsx, type ClassValue } from "clsx";
// Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string 
{
    return clsx(inputs);
}
// Format a Unix timestamp to a human-readable time string
export function formatTime(unix: number, timezone: number = 0): string 
{
    const date = new Date((unix + timezone) * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}
// Format a Unix timestamp to a date string
export function formatDate(unix: number, timezone: number = 0): string 
{
    const date = new Date((unix + timezone) * 1000);

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}
// Convert wind degrees to cardinal direction
export function windDirection(degrees: number): string 
{
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(degrees / 45) % 8];
}
// Get OpenWeatherMap icon URL
export function owmIconUrl(icon: string, size: "1x" | "2x" | "4x" = "2x"): string 
{
    return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}
// Convert Celsius to Fahrenheit
export function celsiusToFahrenheit(c: number): number 
{
  return Math.round((c * 9) / 5 + 32);
}
// Capitalise first letter of each word
export function titleCase(str: string): string 
{
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
// Format temperature with unit symbol
export function formatTemp(temp: number, unit: "metric" | "imperial" = "metric"): string 
{
    return `${temp}°${unit === "metric" ? "C" : "F"}`;
}
// Format wind speed with unit
export function formatWind(speed: number, unit: "metric" | "imperial" = "metric"): string 
{
    return unit === "metric" ? `${speed} m/s` : `${speed} mph`;
}
// UV index description
export function uvDescription(uv: number): string 
{
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
}
// Humidity level description
export function humidityDescription(humidity: number): string 
{
    if (humidity < 30) return "Dry";
    if (humidity < 60) return "Comfortable";
    if (humidity < 80) return "Humid";
    return "Very Humid";
}
// Visibility in km
export function formatVisibility(meters: number): string 
{
    const km = meters / 1000;
    return km >= 10 ? "10+ km" : `${km.toFixed(1)} km`;
}