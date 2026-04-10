"use client";
import Image from "next/image";
import 
{
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Droplets, Wind } from "lucide-react";
import { owmIconUrl, titleCase } from "@/lib/utils";
import type { DailyForecast } from "@/types/weather";
interface ForecastSectionProps
{
    forecast: DailyForecast[];
    unit: "metric" | "imperial";
}
// Forecast Section with cards and area chart for 5-day forecast
function ForecastCard
(
    {
    day,
    unit,
    isFirst,
    }: {
    day: DailyForecast;
    unit: "metric" | "imperial";
    isFirst: boolean;
    }) {
    const tempUnit = unit === "metric" ? "°C" : "°F";

    return (
        <div
            className="card p-4 flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
            style={{
                borderColor: isFirst ? "var(--accent)" : "var(--border)",
                boxShadow: isFirst ? "0 0 0 2px var(--accent)" : undefined,
            }}
        >
            <p
                className="text-sm font-semibold"
                style={{ color: isFirst ? "var(--accent)" : "var(--text-secondary)" }}
            >
                {isFirst ? "Tomorrow" : day.dayOfWeek}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {day.date}
            </p>
            <Image
                src={owmIconUrl(day.icon, "2x")}
                alt={day.description}
                width={56}
                height={56}
                unoptimized
                className="drop-shadow-sm"
            />
            <p
                className="text-xs text-center capitalize"
                style={{ color: "var(--text-secondary)" }}
            >
                {titleCase(day.description)}
            </p>
            <div className="flex gap-2 text-sm font-semibold">
                <span style={{ color: "var(--text-primary)" }}>
                    {day.tempMax}{tempUnit}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                    {day.tempMin}{tempUnit}
                </span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <Droplets size={12} />
                    <span>{day.humidity}%</span>
                {day.pop > 0 && (
                    <span className="ml-1 text-blue-400">{day.pop}% rain</span>
                )}
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <Wind size={12} />
                <span>{day.windSpeed} {unit === "metric" ? "m/s" : "mph"}</span>
            </div>
        </div>
    );
}
// Custom tooltip for the area chart to show detailed info on hover
interface TooltipProps 
{
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
    unit: "metric" | "imperial";
}
function CustomTooltip({ active, payload, label, unit }: TooltipProps) 
{
    if (!active || !payload?.length) return null;
    const tempUnit = unit === "metric" ? "°C" : "°F";

    return (
        <div
            className="rounded-xl p-3 text-sm shadow-lg border"
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
            }}
            >
            <p className="font-semibold mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.name} style={{ color: p.color }}>
                {p.name}: {p.value}{p.name.includes("Temp") ? tempUnit : "%"}
                </p>
            ))}
        </div>
    );
}
// Main ForecastSection component that combines the cards and the area chart
export function ForecastSection({ forecast, unit }: ForecastSectionProps) 
{
    const chartData = forecast.map((d) => ({
        day: d.dayOfWeek,
        "Max Temp": d.tempMax,
        "Min Temp": d.tempMin,
        "Avg Temp": d.avgTemp,
        Humidity: d.humidity,
    }));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Cards */}
            <div>
                <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: "var(--text-primary)" }}
                >
                    5-Day Forecast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {forecast.map((day, i) => (
                        <ForecastCard key={day.date} day={day} unit={unit} isFirst={i === 0} />
                    ))}
                </div>
            </div>
            {/* Chart */}
            <div className="card p-6">
                <h3
                    className="text-lg font-semibold mb-6"
                    style={{ color: "var(--text-primary)" }}
                >
                    Temperature Trend
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                        </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip unit={unit} />} />
                        <Legend
                            wrapperStyle={{ color: "var(--text-secondary)", fontSize: 12 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Max Temp"
                            stroke="#f97316"
                            strokeWidth={2}
                            fill="url(#maxGrad)"
                            dot={{ fill: "#f97316", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Avg Temp"
                            stroke="#a78bfa"
                            strokeWidth={2}
                            fill="url(#avgGrad)"
                            dot={{ fill: "#a78bfa", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Min Temp"
                            stroke="#60a5fa"
                            strokeWidth={2}
                            fill="url(#minGrad)"
                            dot={{ fill: "#60a5fa", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}