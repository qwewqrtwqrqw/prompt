import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeaderClient } from "@/components/layout/SiteHeaderClient";
import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Prompt Studio",
    template: "%s | Prompt Studio",
  },
  description:
    "Платформа для изучения промпт-инженерии, создания шаблонов и обмена ими",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <a href="#main-content" className="skip-link">
          Перейти к содержимому
        </a>
        <AuthProvider>
          <SiteHeaderClient />
          <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
            {children}
          </main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
