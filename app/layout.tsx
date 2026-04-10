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
      <body className={inter.className}>{children}</body>
    </html>
  );
}