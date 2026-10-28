"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Fades and lifts its children in once they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-14 max-w-2xl">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
      {children && <p className="mt-5 text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">{children}</p>}
    </Reveal>
  );
}
