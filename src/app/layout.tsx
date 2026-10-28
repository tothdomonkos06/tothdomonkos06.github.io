import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

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
  title: "Tóth Domonkos — Software Developer",
  description:
    "Computer Engineering student at BME building software from low-level C to the web. Projects, stack and contact.",
  openGraph: {
    title: "Tóth Domonkos — Software Developer",
    description: "Computer Engineering student at BME building software from low-level C to the web.",
    url: "https://tothdomonkos.me",
    siteName: "tothdomonkos.me",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-svh bg-black text-zinc-100">
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
