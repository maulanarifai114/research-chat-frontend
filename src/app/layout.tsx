"use client";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { ThemeModeScript, useThemeMode } from "flowbite-react";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.title = "Chat App by Rain Hub";
  }, []);

  const theme = useThemeMode();
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} h-full bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white`}>
        <div onClick={() => theme.toggleMode()} className="fixed right-4 top-4 cursor-pointer rounded bg-white px-2 py-2 text-xs text-gray-700 shadow dark:bg-gray-700 dark:text-white">
          Toggle
        </div>
        {children}
      </body>
    </html>
  );
}
