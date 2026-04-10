import type 
{
    CurrentWeather,
    CurrentWeatherResponse,
    DailyForecast,
    ForecastItem,
    ForecastResponse,
    WeatherData,
} from "@/types/weather";
import { weatherCache } from "./cache";
const BASE_URL = "https://api.openweathermap.org";
// Normalisation
function getApiKey(): string 
{
    const key = process.env.OPENWEATHERMAP_API_KEY;
    if (!key) 
        throw new Error("OPENWEATHERMAP_API_KEY environment variable is not set.");
    return key;
}
function normaliseCurrent(raw: CurrentWeatherResponse): CurrentWeather 
{
    return {
        city: raw.name,
        country: raw.sys.country,
        temperature: Math.round(raw.main.temp),
        feelsLike: Math.round(raw.main.feels_like),
        tempMin: Math.round(raw.main.temp_min),
        tempMax: Math.round(raw.main.temp_max),
        humidity: raw.main.humidity,
        windSpeed: raw.wind.speed,
        windDeg: raw.wind.deg,
        description: raw.weather[0]?.description ?? "",
        icon: raw.weather[0]?.icon ?? "01d",
        visibility: raw.visibility,
        pressure: raw.main.pressure,
        sunrise: raw.sys.sunrise,
        sunset: raw.sys.sunset,
        dt: raw.dt,
        timezone: raw.timezone,
        coord: raw.coord,
    };
}
function groupForecastByDay(items: ForecastItem[]): DailyForecast[] 
{
    const days = new Map<string, ForecastItem[]>();

    for (const item of items) {
        const date = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
        if (!days.has(date)) days.set(date, []);
        days.get(date)!.push(item);
    }

    const result: DailyForecast[] = [];

    for (const [date, dayItems] of days) {
        const temps = dayItems.map((i) => i.main.temp);
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        const tempMin = Math.min(...dayItems.map((i) => i.main.temp_min));
        const tempMax = Math.max(...dayItems.map((i) => i.main.temp_max));
        const avgHumidity =
        dayItems.reduce((a, b) => a + b.main.humidity, 0) / dayItems.length;
        const avgWind =
        dayItems.reduce((a, b) => a + b.wind.speed, 0) / dayItems.length;
        const maxPop = Math.max(...dayItems.map((i) => i.pop));

        // Pick the noon item (12:00) for icon/description, fall back to first
        const noonItem =
        dayItems.find((i) => i.dt_txt.includes("12:00:00")) ?? dayItems[0];

        const dateObj = new Date(date + "T12:00:00Z");
        const dayOfWeek = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
        });

        result.push({
        date,
        dayOfWeek,
        tempMin: Math.round(tempMin),
        tempMax: Math.round(tempMax),
        avgTemp: Math.round(avgTemp),
        humidity: Math.round(avgHumidity),
        windSpeed: Math.round(avgWind * 10) / 10,
        description: noonItem.weather[0]?.description ?? "",
        icon: noonItem.weather[0]?.icon ?? "01d",
        pop: Math.round(maxPop * 100),
        });
    }

    // Return next 5 days (skip today if we already have current weather)
    return result.slice(0, 5);
}
    //  API Calls
    async function fetchCurrentWeather(city: string, units: string = "metric"): Promise<CurrentWeatherResponse> 
    {
        const apiKey = getApiKey();
        const url = `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) 
        {
            if (res.status === 404) 
                throw new WeatherError("City not found. Please check the city name and try again.", "CITY_NOT_FOUND", 404);
            if (res.status === 401)
                throw new WeatherError("Invalid API key. Please check your configuration.", "INVALID_API_KEY", 401);
            if (res.status === 429) 
                throw new WeatherError("API rate limit exceeded. Please try again later.", "RATE_LIMIT", 429);
            throw new WeatherError(`Weather service error (${res.status}).`, "API_ERROR", res.status);
        }

        return res.json() as Promise<CurrentWeatherResponse>;
    }
    async function fetchForecast(city: string, units: string = "metric"): Promise<ForecastResponse> 
    {
        const apiKey = getApiKey();
        const url = `${BASE_URL}/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&cnt=40&appid=${apiKey}`;

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) 
        {
            if (res.status === 404) 
                throw new WeatherError("City not found.", "CITY_NOT_FOUND", 404);
            if (res.status === 429) 
                throw new WeatherError("API rate limit exceeded. Please try again later.", "RATE_LIMIT", 429);
            
            throw new WeatherError(`Forecast service error (${res.status}).`, "API_ERROR", res.status);
        }

        return res.json() as Promise<ForecastResponse>;
    }
// Public API
export class WeatherError extends Error 
{
    constructor
    (
        message: string,
        public readonly code: string,
        public readonly status: number = 500
    ) 
    {
        super(message);
        this.name = "WeatherError";
    }
}
// Fetch weather data for a city.
export async function getWeatherData(city: string, units: string = "metric"): Promise<WeatherData> 
{
    // Results are cached for 10 minutes per city 
    const cacheKey = `weather:${city.toLowerCase().trim()}:${units}`;

    const cached = weatherCache.get<WeatherData>(cacheKey);
    if (cached) return cached;

    // Parallel fetch for speed
    const [currentRaw, forecastRaw] = await Promise.all([ fetchCurrentWeather(city, units), fetchForecast(city, units),]);

    const data: WeatherData = 
    {
        current: normaliseCurrent(currentRaw),
        forecast: groupForecastByDay(forecastRaw.list),
        cachedAt: Date.now(),
    };

    weatherCache.set(cacheKey, data);
    return data;
}
// Fetch weather data by geographic coordinates.
export async function getWeatherByCoords(lat: number, lon: number, units: string = "metric"): Promise<WeatherData> 
{
    const cacheKey = `weather:coords:${lat.toFixed(2)},${lon.toFixed(2)}:${units}`;

    const cached = weatherCache.get<WeatherData>(cacheKey);
    if (cached) return cached;

    const apiKey = getApiKey();

    const [currentRes, forecastRes] = await Promise.all([
        fetch(
        `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`,
        { cache: "no-store" }
        ),
        fetch(
        `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&cnt=40&appid=${apiKey}`,
        { cache: "no-store" }
        ),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
        throw new WeatherError("Failed to fetch weather for your location.", "API_ERROR", 500);
    }

    const [currentRaw, forecastRaw] = await Promise.all([
        currentRes.json() as Promise<CurrentWeatherResponse>,
        forecastRes.json() as Promise<ForecastResponse>,
    ]);

    const data: WeatherData = {
        current: normaliseCurrent(currentRaw),
        forecast: groupForecastByDay(forecastRaw.list),
        cachedAt: Date.now(),
    };

    weatherCache.set(cacheKey, data);
    return data;
}