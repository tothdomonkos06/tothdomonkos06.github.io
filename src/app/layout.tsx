import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tothdomonkos.me"),
  title: "Tóth Domonkos — Szoftverfejlesztő",
  description:
    "Mérnökinformatikus hallgató a BME-n. Szoftvereket fejlesztek az alacsony szintű C-től a webig. Projektek, technológiák, kapcsolat.",
  openGraph: {
    title: "Tóth Domonkos — Szoftverfejlesztő",
    description: "Mérnökinformatikus hallgató a BME-n. Szoftvereket fejlesztek az alacsony szintű C-től a webig.",
    url: "https://tothdomonkos.me",
    siteName: "tothdomonkos.me",
    type: "website",
    locale: "hu_HU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-svh bg-black text-zinc-100">
        <LanguageProvider>
          <SmoothScroll>
            <Navbar />
            {children}
            <Footer />
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
