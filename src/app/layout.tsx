"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilContextProvider } from "@/contexts/RecoilContext";

import { ThemeModeScript, useThemeMode } from "flowbite-react";
import { useEffect } from "react";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { LoadingPageProvider } from "@/contexts/LoadingPageContext";
import { LoadingBarProvider } from "@/contexts/LoadingBarContext";
import { FaSun, FaMoon, FaPowerOff } from "react-icons/fa";
import { clearAuth } from "@/utils/clear-auth";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useThemeMode();

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/auth";
  };

  useEffect(() => {
    document.title = "Chat App by Rain Hub";
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className={`h-full ${theme.mode === "dark" ? "dark" : ""}`}>
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} h-full bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white`}>
        <RecoilContextProvider>
          <SnackbarProvider>
            <LoadingPageProvider>
              <LoadingBarProvider>
                <div className="fixed right-4 top-4 flex gap-4">
                  <div onClick={() => theme.toggleMode()} className="cursor-pointer rounded-full bg-white p-3 text-gray-700 shadow dark:bg-gray-700 dark:text-white">
                    {theme.mode === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
                  </div>
                  <div onClick={handleLogout} className="flex cursor-pointer items-center justify-center rounded-full bg-white p-3 text-red-700 shadow dark:bg-gray-700 dark:text-red-500">
                    <FaPowerOff />
                  </div>
                </div>
                {children}
              </LoadingBarProvider>
            </LoadingPageProvider>
          </SnackbarProvider>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
