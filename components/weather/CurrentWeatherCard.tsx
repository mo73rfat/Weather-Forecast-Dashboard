"use client";
import Image from "next/image";
import 
{
    Droplets,
    Wind,
    Eye,
    Gauge,
    Sunrise,
    Sunset,
    Thermometer,
} from "lucide-react";
import 
{
    formatTime,
    formatDate,
    windDirection,
    owmIconUrl,
    titleCase,
    formatVisibility,
} from "@/lib/utils";
import type { CurrentWeather } from "@/types/weather";
interface CurrentWeatherCardProps 
{
    weather: CurrentWeather;
    unit: "metric" | "imperial";
}
function StatItem
(
    {
        icon,
        label,
        value,
    }: 
    {
        icon: React.ReactNode;
        label: string;
        value: string;
    }
) 
{
    return (
        <div
            className="flex flex-col items-center gap-1 p-3 rounded-xl"
            style={{ background: "var(--bg-primary)" }}
        >
        <div style={{ color: "var(--accent)" }}>{icon}</div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {label}
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {value}
            </span>
        </div>
    );
}
export function CurrentWeatherCard({ weather, unit }: CurrentWeatherCardProps) 
{
    const tempUnit = unit === "metric" ? "°C" : "°F";
    const windUnit = unit === "metric" ? "m/s" : "mph";

    return (
        <div className="card p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2
                        className="text-2xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {weather.city}
                        <span
                        className="ml-2 text-base font-normal"
                        style={{ color: "var(--text-secondary)" }}
                        >
                        {weather.country}
                        </span>
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                        {formatDate(weather.dt, weather.timezone)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Updated {new Date(weather.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>
            {/* Main temperature display */}
            <div className="flex items-center gap-4 mb-6">
                <div className="weather-gradient rounded-2xl p-2">
                    <Image
                        src={owmIconUrl(weather.icon, "4x")}
                        alt={weather.description}
                        width={96}
                        height={96}
                        className="drop-shadow-md"
                        unoptimized
                    />
                </div>
                <div>
                    <div
                        className="text-6xl font-black tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {weather.temperature}
                        <span className="text-3xl font-light ml-1">{tempUnit}</span>
                    </div>
                    <p
                        className="text-lg capitalize mt-1"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {titleCase(weather.description)}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                        Feels like {weather.feelsLike}{tempUnit} · H:{weather.tempMax}{tempUnit} L:{weather.tempMin}{tempUnit}
                    </p>
                </div>
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <StatItem
                    icon={<Droplets size={18} />}
                    label="Humidity"
                    value={`${weather.humidity}%`}
                />
                <StatItem
                    icon={<Wind size={18} />}
                    label="Wind"
                    value={`${weather.windSpeed} ${windUnit} ${windDirection(weather.windDeg)}`}
                />
                <StatItem
                    icon={<Eye size={18} />}
                    label="Visibility"
                    value={formatVisibility(weather.visibility)}
                />
                <StatItem
                    icon={<Gauge size={18} />}
                    label="Pressure"
                    value={`${weather.pressure} hPa`}
                />
                <StatItem
                    icon={<Sunrise size={18} />}
                    label="Sunrise"
                    value={formatTime(weather.sunrise, weather.timezone)}
                />
                <StatItem
                    icon={<Sunset size={18} />}
                    label="Sunset"
                    value={formatTime(weather.sunset, weather.timezone)}
                />
            </div>
        </div>
    );
}