"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import FlowField from "@/components/kokonutui/flow-field";
import { Magnetic } from "@/components/shared/Magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, delay, ease: EASE },
});

/** Each letter flips up out of the baseline, one after another. */
function FlipLetters({
  text,
  delay,
  className,
  letterClassName,
}: {
  text: string;
  delay: number;
  className?: string;
  letterClassName?: string;
}) {
  let index = 0;
  return (
    <span className={`block [perspective:800px] ${className ?? ""}`} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden className="inline-block whitespace-nowrap">
          {word.split("").map((ch) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className={`inline-block origin-bottom ${letterClassName ?? ""}`}
                initial={{ opacity: 0, rotateX: -95, y: "0.4em", filter: "blur(10px)" }}
                animate={{ opacity: 1, rotateX: 0, y: "0em", filter: "blur(0px)" }}
                transition={{ duration: 1, delay: delay + i * 0.035, ease: EASE }}
              >
                {ch}
              </motion.span>
            );
          })}
          {w < text.split(" ").length - 1 && <span className="inline-block w-[0.25em]" />}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // As you scroll away the headline lifts, shrinks and dissolves.
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.7], [0, 12]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section id="top" ref={ref} className="relative flex min-h-svh items-center justify-center overflow-hidden bg-black">
      {/* Wind streamlines behind the content. The canvas takes its colour from
          the text colour; the cursor parts the streams, a click sends a gust. */}
      <FlowField className="text-zinc-300" density={1.1} speed={0.7} />
      {/* Darkens the middle so the headline stays readable over the wind. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(0,0,0,0.85),transparent)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
        <motion.div
          style={{ y, scale, opacity, filter }}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 text-center"
        >
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

          <h1 className="text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-tighter sm:text-7xl md:text-8xl">
            <FlipLetters text="Tóth Domonkos" delay={0.3} />
            <FlipLetters
              text="builds software."
              delay={0.75}
              className="mt-2 pb-2"
              letterClassName="bg-gradient-to-b from-zinc-200 to-zinc-600 bg-clip-text text-transparent"
            />
          </h1>

          <motion.p
            {...fadeUp(1.3)}
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            From low-level C to fast, polished web apps. I study computer engineering, ship side
            projects that solve real problems, and train for marathons in between.
          </motion.p>

          <motion.div {...fadeUp(1.45)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
              >
                See my work
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex h-11 items-center rounded-full border border-white/15 bg-black/40 px-6 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/5"
              >
                Get in touch
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.a
          href="#work"
          aria-label="Scroll to work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-zinc-600 transition-colors hover:text-white"
        >
          <ArrowDown className="size-5 animate-bounce" />
        </motion.a>
    </section>
  );
}
