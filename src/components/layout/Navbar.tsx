"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className={cn(
          "pointer-events-auto flex w-full max-w-3xl items-center justify-between rounded-full border px-2 py-2 transition-all duration-500",
          scrolled
            ? "border-white/10 bg-zinc-950/70 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <a
          href="#top"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white"
          aria-label="Tóth Domonkos, back to top"
        >
          <span className="grid size-6 place-items-center rounded-full bg-white font-mono text-[10px] font-bold text-black">
            TD
          </span>
          <span className="hidden sm:inline">Tóth Domonkos</span>
        </a>

        <div className="flex items-center gap-1">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-1 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
