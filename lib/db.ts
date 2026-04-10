import path from "path";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import type { RecentSearch } from "@/types/weather";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "searches.json");

function ensureDataDir() 
{
    if (!existsSync(DATA_DIR)) 
        mkdirSync(DATA_DIR, { recursive: true });
}
function readDb(): RecentSearch[] 
{
    ensureDataDir();
    if (!existsSync(DB_PATH))
        return [];
    try 
    {
        const content = readFileSync(DB_PATH, "utf-8");
        return JSON.parse(content);
    } 
    catch (err) 
    {
        console.error("Error reading searches.json:", err);
        return [];
    }
}
function writeDb(data: RecentSearch[]) 
{
    ensureDataDir();
    try 
    {
        writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } 
    catch (err) 
    {
        console.error("Error writing searches.json:", err);
    }
}
// I keep only the latest MAX_RECENT entries to prevent unbounded growth of the file.
const MAX_RECENT = 5;
export function addRecentSearch(city: string, country: string = ""): void 
{
    const searches = readDb();

    // This ensures that if a user searches for the same city again, it moves to the front of the list.
    const filtered = searches.filter
    (
        (s) => s.city.toLowerCase() !== city.toLowerCase()
    );

    const newEntry: RecentSearch = 
    {
        id: Date.now(), 
        city,
        country,
        searchedAt: new Date().toISOString(),
    };

    // I add the new entry to the front of the list and then slice to keep only the most recent MAX_RECENT entries.
    const updated = [newEntry, ...filtered].slice(0, MAX_RECENT);

    writeDb(updated);
}
// This function is used to retrieve the list of recent searches, which can be displayed in the UI. It reads the data from the JSON file and returns it as an array of RecentSearch objects.
export function getRecentSearches(): RecentSearch[] 
{
    return readDb();
}
// This function is used to clear the list of recent searches, which can be triggered by a user action in the UI. It simply writes an empty array to the JSON file, effectively removing all stored searches.
/** Clear all recent searches. */
export function clearRecentSearches(): void 
{
    writeDb([]);
}