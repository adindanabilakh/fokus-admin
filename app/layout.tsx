"use client";

import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";
import "./resizable.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Kalau belum login dan bukan di halaman login, redirect ke /login
    if (!token && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname]);

  // Jika sedang di halaman login, jangan tampilkan Sidebar & Header
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="umkm-theme"
        >
          {isLoginPage ? (
            <>{children}</> // Tampilkan hanya halaman login tanpa layout utama
          ) : (
            <div className="flex h-screen bg-background">
              <Sidebar />
              <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-hidden bg-background relative">
                  {children}
                </main>
              </div>
            </div>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
