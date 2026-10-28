"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import FlowField from "@/components/kokonutui/flow-field";
import { Magnetic } from "@/components/shared/Magnetic";
import { useLang, useT } from "@/lib/i18n";
import { useIntroDone } from "@/lib/intro";

const EASE = [0.22, 1, 0.36, 1] as const;

const HIDDEN = { opacity: 0, y: 20, filter: "blur(8px)" };
// Nothing plays until the intro curtain has lifted (`go`).
const fadeUp = (delay: number, go: boolean) => ({
  initial: HIDDEN,
  animate: go ? { opacity: 1, y: 0, filter: "blur(0px)" } : HIDDEN,
  transition: { duration: 0.9, delay, ease: EASE },
});

/** Each letter flips up out of the baseline, one after another. */
function FlipLetters({
  text,
  delay,
  className,
  letterClassName,
  go,
}: {
  text: string;
  delay: number;
  go: boolean;
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
                animate={go ? { opacity: 1, rotateX: 0, y: "0em", filter: "blur(0px)" } : { opacity: 0, rotateX: -95, y: "0.4em", filter: "blur(10px)" }}
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
  const { lang } = useLang();
  const t = useT();
  const go = useIntroDone();

  return (
    <section id="top" ref={ref} className="relative flex min-h-svh items-center justify-center overflow-hidden bg-black">
      {/* Wind streamlines behind the content. The canvas takes its colour from
          the text colour; the cursor parts the streams, a click sends a gust. */}
      <FlowField className="text-zinc-300" density={1.1} speed={0.7} />
      {/* Two slow, blurred colour blobs: wine and sky, very low key. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[12%] top-[18%] size-[38vw] rounded-full bg-wine/50 blur-[120px]"
        animate={{ x: [0, 80, -40, 0], y: [0, 50, 90, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[10%] right-[8%] size-[30vw] rounded-full bg-sky/10 blur-[120px]"
        animate={{ x: [0, -70, 30, 0], y: [0, -60, -20, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
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
            {...fadeUp(0.05, go)}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur-sm"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-tangerine opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-tangerine" />
            </span>
            {t.hero.badge}
          </motion.div>

          <h1 className="text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-tighter sm:text-7xl md:text-8xl">
            <FlipLetters key={`a-${lang}`} text={t.hero.line1} delay={0.15} go={go} />
            <FlipLetters
              key={`b-${lang}`}
              text={t.hero.line2}
              delay={0.5}
              go={go}
              className="mt-2 pb-2"
              letterClassName="bg-gradient-to-b from-white via-butter to-tangerine bg-clip-text text-transparent"
            />
          </h1>

          <motion.p
            {...fadeUp(1.0, go)}
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            {t.hero.intro}
          </motion.p>

          <motion.div {...fadeUp(1.15, go)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
              >
                {t.hero.work}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex h-11 items-center rounded-full border border-white/15 bg-black/40 px-6 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/5"
              >
                {t.hero.contact}
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.a
          href="#work"
          aria-label={t.hero.scroll}
          initial={{ opacity: 0 }}
          animate={{ opacity: go ? 1 : 0 }}
          transition={{ delay: go ? 1.6 : 0, duration: 1 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-zinc-600 transition-colors hover:text-white"
        >
          <ArrowDown className="size-5 animate-bounce" />
        </motion.a>
    </section>
  );
}
