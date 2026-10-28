"use client";

import { motion } from "framer-motion";

/**
 * Link text that rolls up on hover: the word slides out the top while a copy
 * slides in from below, one letter after another. The hover comes from the
 * nearest motion parent (give it initial="rest" whileHover="hover").
 */
export function RollText({ children, className = "" }: { children: string; className?: string }) {
  const letters = children.split("");
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="relative inline-flex">
        {letters.map((ch, i) => (
          <span key={i} className="relative inline-block">
            <motion.span
              className="inline-block"
              variants={{ rest: { y: "0%" }, hover: { y: "-100%" } }}
              transition={{ duration: 0.32, delay: i * 0.018, ease: [0.65, 0, 0.35, 1] }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
            <motion.span
              className="absolute left-0 top-full inline-block"
              variants={{ rest: { y: "0%" }, hover: { y: "-100%" } }}
              transition={{ duration: 0.32, delay: i * 0.018, ease: [0.65, 0, 0.35, 1] }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}
