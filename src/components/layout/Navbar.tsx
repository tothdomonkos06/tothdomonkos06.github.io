"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full px-margin md:px-gutter max-w-screen-xl mx-auto py-sm flex justify-between items-center border-b border-outline-variant relative z-10">
      <Link href="/" className="flex items-center gap-xs font-label-sm text-label-sm text-primary uppercase tracking-widest group">
        <Terminal size={18} className="group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">TD_System</span>
      </Link>
      
      <nav className="flex gap-sm md:gap-md">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-code-md text-code-md px-xs py-base transition-colors ${
                isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
