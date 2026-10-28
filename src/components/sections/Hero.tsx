"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import BackgroundPaths from "@/components/kokonutui/background-paths";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, delay, ease: EASE },
});

export function Hero() {
  return (
    <section id="top">
      <BackgroundPaths
        className="min-h-svh bg-black text-white dark:bg-black dark:text-white"
        count={48}
        angle={-10}
        speed={0.8}
      >
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 text-center">
          <motion.div
            {...fadeUp(0.2)}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur-sm"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            Computer Engineering @ BME · Budapest
          </motion.div>

          <motion.h1
            {...fadeUp(0.35)}
            className="text-balance text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-7xl md:text-8xl"
          >
            Tóth Domonkos
            <span className="mt-2 block bg-gradient-to-b from-zinc-300 to-zinc-600 bg-clip-text text-transparent">
              builds software.
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.5)}
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            From low-level C to fast, polished web apps. I study computer engineering, ship side
            projects that solve real problems, and train for marathons in between.
          </motion.p>

          <motion.div {...fadeUp(0.65)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#work"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition-all hover:bg-zinc-200"
            >
              See my work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-11 items-center rounded-full border border-white/15 bg-black/40 px-6 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/5"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        <motion.a
          href="#work"
          aria-label="Scroll to work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-zinc-600 transition-colors hover:text-white"
        >
          <ArrowDown className="size-5 animate-bounce" />
        </motion.a>
      </BackgroundPaths>
    </section>
  );
}
