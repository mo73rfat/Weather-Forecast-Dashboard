import { describe, it, expect } from "vitest";
import 
{
    formatTime,
    windDirection,
    formatVisibility,
    titleCase,
    formatTemp,
    formatWind,
    humidityDescription,
} from "@/lib/utils";

describe("formatTime", () => 
    {
    it("formats a Unix timestamp to HH:MM", () => {
        // 2024-01-01 12:00:00 UTC = 1704110400
        const result = formatTime(1704110400, 0);
        expect(result).toBe("12:00");
    });

    it("applies timezone offset correctly", () => {
        // 12:00 UTC + 3600s offset = 13:00 local
        const result = formatTime(1704110400, 3600);
        expect(result).toBe("13:00");
    });
    });

    describe("windDirection", () => {
    it("returns N for 0 degrees", () => {
        expect(windDirection(0)).toBe("N");
    });

    it("returns E for 90 degrees", () => {
        expect(windDirection(90)).toBe("E");
    });

    it("returns S for 180 degrees", () => {
        expect(windDirection(180)).toBe("S");
    });

    it("returns W for 270 degrees", () => {
        expect(windDirection(270)).toBe("W");
    });

    it("returns NE for 45 degrees", () => {
        expect(windDirection(45)).toBe("NE");
    });
    });

    describe("formatVisibility", () => {
    it("returns '10+ km' for visibility >= 10000m", () => {
        expect(formatVisibility(10000)).toBe("10+ km");
        expect(formatVisibility(15000)).toBe("10+ km");
    });

    it("returns formatted km for visibility < 10000m", () => {
        expect(formatVisibility(5000)).toBe("5.0 km");
        expect(formatVisibility(2500)).toBe("2.5 km");
    });
    });

    describe("titleCase", () => {
    it("capitalises the first letter of each word", () => {
        expect(titleCase("clear sky")).toBe("Clear Sky");
        expect(titleCase("light rain")).toBe("Light Rain");
    });

    it("handles single words", () => {
        expect(titleCase("overcast")).toBe("Overcast");
    });
    });

    describe("formatTemp", () => {
    it("formats metric temperature with °C", () => {
        expect(formatTemp(22, "metric")).toBe("22°C");
    });

    it("formats imperial temperature with °F", () => {
        expect(formatTemp(72, "imperial")).toBe("72°F");
    });
    });

    describe("formatWind", () => {
    it("formats metric wind speed with m/s", () => {
        expect(formatWind(5.5, "metric")).toBe("5.5 m/s");
    });

    it("formats imperial wind speed with mph", () => {
        expect(formatWind(12, "imperial")).toBe("12 mph");
    });
    });

    describe("humidityDescription", () => {
    it("returns Dry for humidity < 30", () => {
        expect(humidityDescription(20)).toBe("Dry");
    });

    it("returns Comfortable for humidity 30-59", () => {
        expect(humidityDescription(45)).toBe("Comfortable");
    });

    it("returns Humid for humidity 60-79", () => {
        expect(humidityDescription(70)).toBe("Humid");
    });

    it("returns Very Humid for humidity >= 80", () => {
        expect(humidityDescription(85)).toBe("Very Humid");
    });
});