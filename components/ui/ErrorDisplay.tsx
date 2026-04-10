"use client";
import { AlertTriangle, RefreshCw, CloudOff, MapPinOff } from "lucide-react";
interface ErrorDisplayProps 
{
    error: string;
    onRetry?: () => void;
}
function getErrorIcon(error: string) 
{
    if (error.toLowerCase().includes("city not found") || error.toLowerCase().includes("invalid city")) 
        return <MapPinOff size={40} className="text-orange-400" />;

    if (error.toLowerCase().includes("network") || error.toLowerCase().includes("connection")) 
        return <CloudOff size={40} className="text-blue-400" />;

    return <AlertTriangle size={40} className="text-red-400" />;
}
export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) 
{
    return (
        <div className="card p-10 flex flex-col items-center gap-4 text-center animate-fade-in">
            {getErrorIcon(error)}
            <div>
                <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "var(--text-primary)" }}
                >
                Something went wrong
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>{error}</p>
            </div>
            {onRetry && (
                <button
                onClick={onRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--accent)", color: "#fff" }}
                >
                <RefreshCw size={16} />
                Try Again
                </button>
            )}
        </div>
    );
}