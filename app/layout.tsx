import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = 
{
  title: "Weather Forecast Dashboard",
  description: "A modern weather forecast dashboard built with Next.js and React, providing current conditions and a 5-day forecast for any city worldwide.",
  keywords: [ "weather", "forecast", "dashboard", "current conditions", "5-day forecast", "city search", "temperature", "humidity", "wind speed", "weather icons", "responsive design", "Next.js", "React" ],
  authors: [{ name: "Mohammad Arafat", url: "https://mo73rfat.com/" }],
  creator: "Mohammad Arafat",
  publisher: "Mohammad Arafat",
};
export default function RootLayout
(
  {
    children,
  }: 
  {
    children: React.ReactNode;
  }
) 
{
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* This script ensures the correct theme is applied on initial load to prevent FOUC (Flash of Unstyled Content) */ }
        <script
          dangerouslySetInnerHTML=
          {
            {
              __html: `
                (
                  function() 
                  {
                    try 
                    {
                      var theme = localStorage.getItem('weather-theme');
                      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) 
                        document.documentElement.classList.add('dark');
                      } 
                    catch(e) 
                    {
                    }
                  }
                )();
              `,
            }
          }
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col m-0 p-0 bg-white dark:bg-slate-950 transition-colors duration-300`}>
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <footer
            className="w-full py-6 border-t backdrop-blur-md"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="font-medium">
              Developed by <a href="https://mo73rfat.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Mohammad Arafat</a>
            </div>
            <div className="flex items-center gap-2">
              <span>Weather data provided by</span>
              <a 
                href="https://openweathermap.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold hover:text-blue-500 transition-colors underline underline-offset-4"
              >
                OpenWeatherMap
              </a>
            </div>
            <div className="text-xs opacity-75">
              © {new Date( ).getFullYear()} • All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}