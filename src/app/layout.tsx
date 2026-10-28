import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";
import { Loader } from "@/components/layout/Loader";

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
    // The inline script below may add a class before hydration.
    <html lang="hu" suppressHydrationWarning className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        {/* Runs before first paint: a visitor who has already seen the intro
            loader in this tab (or asked for ?nomotion) never sees it flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("intro-seen")==="1"||location.search.indexOf("nomotion")>-1)document.documentElement.classList.add("intro-seen")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-svh bg-black text-zinc-100">
        <LanguageProvider>
          <SmoothScroll>
            <Loader />
            <Navbar />
            {children}
            <Footer />
            <div aria-hidden className="grain" />
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
