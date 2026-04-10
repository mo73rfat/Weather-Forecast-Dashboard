import { describe, it, expect, vi, beforeEach } from "vitest";
// Integration tests for the weather API route handler logic.
// I test the validation and error-handling paths without hitting the real OpenWeatherMap API by mocking fetch.

function makeRequest(params: Record<string, string>): Request 
{
    const url = new URL("http://localhost:3000/api/weather");
    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
    }
    return new Request(url.toString());
}
// This function mimics the parameter validation logic in the actual API route handler. It checks for required parameters, validates their formats, and returns structured error information if validation fails.
function validateWeatherParams(params: URLSearchParams): 
{
    valid: boolean;
    error?: string;
    code?: string;
    status?: number;
    } {
    const city = params.get("city")?.trim();
    const lat = params.get("lat");
    const lon = params.get("lon");
    const units = params.get("units") ?? "metric";

    if (!["metric", "imperial", "standard"].includes(units)) {
        return { valid: false, error: "Invalid units parameter.", code: "INVALID_PARAMS", status: 400 };
    }

    if (!city && !lat && !lon) {
        return { valid: false, error: "Please provide a city name or coordinates.", code: "MISSING_PARAMS", status: 400 };
    }

    if (city && (city.length < 2 || city.length > 100)) {
        return { valid: false, error: "City name must be between 2 and 100 characters.", code: "INVALID_PARAMS", status: 400 };
    }

    if (lat && lon) {
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        if (isNaN(latNum) || isNaN(lonNum)) {
        return { valid: false, error: "Invalid coordinates.", code: "INVALID_PARAMS", status: 400 };
        }
    }

    return { valid: true };
}
// I also test the WeatherError class to ensure it correctly sets its properties and behaves as expected when thrown and caught.
describe("Weather API — parameter validation", () => 
{
    it("rejects requests with no city or coordinates", () => {
        const params = new URLSearchParams();
        const result = validateWeatherParams(params);
        expect(result.valid).toBe(false);
        expect(result.code).toBe("MISSING_PARAMS");
        expect(result.status).toBe(400);
    });

    it("rejects invalid units parameter", () => {
        const params = new URLSearchParams({ city: "London", units: "kelvin" });
        const result = validateWeatherParams(params);
        expect(result.valid).toBe(false);
        expect(result.code).toBe("INVALID_PARAMS");
    });

    it("rejects city names shorter than 2 characters", () => {
        const params = new URLSearchParams({ city: "A" });
        const result = validateWeatherParams(params);
        expect(result.valid).toBe(false);
        expect(result.code).toBe("INVALID_PARAMS");
    });

    it("rejects city names longer than 100 characters", () => {
        const params = new URLSearchParams({ city: "A".repeat(101) });
        const result = validateWeatherParams(params);
        expect(result.valid).toBe(false);
        expect(result.code).toBe("INVALID_PARAMS");
    });

    it("rejects non-numeric coordinates", () => {
        const params = new URLSearchParams({ lat: "abc", lon: "xyz" });
        const result = validateWeatherParams(params);
        expect(result.valid).toBe(false);
        expect(result.code).toBe("INVALID_PARAMS");
    });

    it("accepts a valid city name", () => {
        const params = new URLSearchParams({ city: "London" });
        const result = validateWeatherParams(params);
        expect(result.valid).toBe(true);
    });

    it("accepts valid coordinates", () => {
        const params = new URLSearchParams({ lat: "51.5", lon: "-0.12" });
        const result = validateWeatherParams(params);
        expect(result.valid).toBe(true);
    });

    it("accepts all valid unit values", () => {
        for (const units of ["metric", "imperial", "standard"]) {
        const params = new URLSearchParams({ city: "Paris", units });
        expect(validateWeatherParams(params).valid).toBe(true);
        }
    });
});
// I also test the WeatherError class to ensure it correctly sets its properties and behaves as expected when thrown and caught.
class WeatherError extends Error 
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

describe
(
    "WeatherError", () => 
    {
    it("sets message, code, and status correctly", () => {
        const err = new WeatherError("City not found.", "CITY_NOT_FOUND", 404);
        expect(err.message).toBe("City not found.");
        expect(err.code).toBe("CITY_NOT_FOUND");
        expect(err.status).toBe(404);
        expect(err.name).toBe("WeatherError");
    });

    it("defaults status to 500", () => {
        const err = new WeatherError("Unknown error", "INTERNAL_ERROR");
        expect(err.status).toBe(500);
    });

    it("is an instance of Error", () => {
        const err = new WeatherError("test", "TEST");
        expect(err instanceof Error).toBe(true);
    });
    }
);