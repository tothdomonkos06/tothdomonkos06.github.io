"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const TEXT =
  "I like understanding a system all the way down to the bits, then making the part people actually touch feel effortless.";

/**
 * Pinned statement: the section sticks to the screen while each word lights
 * up in turn as you scroll, then the page releases and moves on.
 */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = TEXT.split(" ");

  const scale = useTransform(scrollYProgress, [0.85, 1], [1, 0.92]);
  const fade = useTransform(scrollYProgress, [0.85, 1], [1, 0.25]);

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6">
        <motion.p
          style={{ scale, opacity: fade }}
          className="max-w-5xl text-balance text-center text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl"
        >
          {words.map((word, i) => {
            const start = (i / words.length) * 0.8;
            const end = start + 0.8 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </motion.p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [12, 0]);
  const blur = useTransform(progress, range, [8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const highlight = /bits|effortless/.test(children);

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className={`mr-[0.25em] inline-block ${highlight ? "bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent" : "text-white"}`}
    >
      {children}
    </motion.span>
  );
}
