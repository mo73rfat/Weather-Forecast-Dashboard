// OpenWeatherMap API Response Types 
export interface WeatherCondition 
{
    id: number;
    main: string;
    description: string;
    icon: string;
}
export interface MainWeatherData 
{
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}
export interface WindData 
{
    speed: number;
    deg: number;
    gust?: number;
}
export interface CloudsData 
{
    all: number;
}
export interface SysData 
{
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
}
export interface CoordData 
{
    lon: number;
    lat: number;
}
// Current Weather
export interface CurrentWeatherResponse 
{
    coord: CoordData;
    weather: WeatherCondition[];
    base: string;
    main: MainWeatherData;
    visibility: number;
    wind: WindData;
    clouds: CloudsData;
    dt: number;
    sys: SysData;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}
// 5-Day Forecast
export interface ForecastItem 
{
    dt: number;
    main: MainWeatherData;
    weather: WeatherCondition[];
    clouds: CloudsData;
    wind: WindData;
    visibility: number;
    pop: number;
    dt_txt: string;
}
export interface ForecastCity 
{
    id: number;
    name: string;
    coord: CoordData;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}
export interface ForecastResponse 
{
    cod: string;
    message: number;
    cnt: number;
    list: ForecastItem[];
    city: ForecastCity;
}
// Normalised App Types
export interface CurrentWeather 
{
    city: string;
    country: string;
    temperature: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    windSpeed: number;
    windDeg: number;
    description: string;
    icon: string;
    visibility: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    dt: number;
    timezone: number;
    coord: CoordData;
}
export interface DailyForecast 
{
    date: string;
    dayOfWeek: string;
    tempMin: number;
    tempMax: number;
    avgTemp: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    pop: number;
}
export interface WeatherData 
{
    current: CurrentWeather;
    forecast: DailyForecast[];
    cachedAt: number;
}
// Recent Searches
export interface RecentSearch 
{
    id: number;
    city: string;
    country: string;
    searchedAt: string;
}
// API Response Wrappers
export interface ApiSuccess<T> 
{
    success: true;
    data: T;
}
export interface ApiError 
{
    success: false;
    error: string;
    code: string;
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
// Geocoding
export interface GeocodingResult 
{
    name: string;
    local_names?: Record<string, string>;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}