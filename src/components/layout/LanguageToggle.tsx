"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLang, useT } from "@/lib/i18n";

/** Round flag button: shows the current language, flips to the other on click. */
export function LanguageToggle() {
  const { lang, toggle } = useLang();
  const t = useT();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.switchTo}
      title={t.nav.switchTo}
      className="group relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-white/20 transition-all hover:scale-110 hover:ring-white/50 [perspective:200px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={lang}
          className="absolute inset-0"
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {lang === "hu" ? <HuFlag /> : <UkFlag />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function HuFlag() {
  return (
    <svg viewBox="0 0 6 6" className="size-full" aria-hidden>
      <rect width="6" height="2" fill="#CD2A3E" />
      <rect y="2" width="6" height="2" fill="#FFFFFF" />
      <rect y="4" width="6" height="2" fill="#436F4D" />
    </svg>
  );
}

function UkFlag() {
  return (
    <svg viewBox="0 0 60 60" className="size-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="60" height="60" fill="#012169" />
      <path d="M0 0 60 60M60 0 0 60" stroke="#fff" strokeWidth="12" />
      <path d="M0 0 60 60M60 0 0 60" stroke="#C8102E" strokeWidth="5" />
      <path d="M30 0v60M0 30h60" stroke="#fff" strokeWidth="18" />
      <path d="M30 0v60M0 30h60" stroke="#C8102E" strokeWidth="10" />
    </svg>
  );
}
