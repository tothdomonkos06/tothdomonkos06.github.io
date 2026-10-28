"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useT, type Service } from "@/lib/i18n";
import { Reveal } from "@/components/shared/Reveal";

// Each card gets its own accent, taken from earlier projects.
const ACCENTS = [
  { glow: "from-tangerine/25", text: "text-tangerine", ring: "ring-tangerine/30", dot: "bg-tangerine" },
  { glow: "from-sky/20", text: "text-sky", ring: "ring-sky/25", dot: "bg-sky" },
  { glow: "from-wine/50", text: "text-butter", ring: "ring-wine/60", dot: "bg-butter" },
];

const MQ = "(min-width: 768px)";
const subscribeMq = (cb: () => void) => {
  const m = window.matchMedia(MQ);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useDesktop = () => useSyncExternalStore(subscribeMq, () => window.matchMedia(MQ).matches, () => true);

/**
 * Stacking cards: each one sticks near the top as you scroll, the next slides
 * over it, and the ones underneath shrink and dim a little.
 */
export function Services() {
  const t = useT().services;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = t.items.length;

  return (
    <section id="services" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 pt-28 sm:pt-36">
      <Reveal className="mb-6 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{t.eyebrow}</p>
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">{t.title}</h2>
      </Reveal>

      <div ref={ref} className="relative">
        {t.items.map((item, i) => (
          <Card key={item.title} item={item} index={i} total={n} progress={scrollYProgress} exampleLabel={t.exampleLabel} />
        ))}
      </div>
    </section>
  );
}

function Card({
  item,
  index,
  total,
  progress,
  exampleLabel,
}: {
  item: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  exampleLabel: string;
}) {
  const a = ACCENTS[index % ACCENTS.length];
  // Phones get a plain list: the cards are taller than the screen there.
  const desktop = useDesktop();
  // Once the following cards arrive, this one recedes.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.06]);
  const dim = useTransform(progress, [start, 1], [0, (total - 1 - index) * 0.35]);

  return (
    <div
      className={desktop ? `sticky flex items-start justify-center ${index < total - 1 ? "h-[62svh]" : "pb-28"}` : "pb-2"}
      style={desktop ? { top: `calc(12svh + ${index * 28}px)` } : undefined}
    >
      <motion.article
        style={desktop ? { scale } : undefined}
        className={`relative mt-8 w-full origin-top overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 p-8 ring-1 ${a.ring} sm:p-12`}
      >
        <div aria-hidden className={`pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-gradient-to-br ${a.glow} to-transparent blur-3xl`} />
        <motion.div aria-hidden style={{ opacity: desktop ? dim : 0 }} className="pointer-events-none absolute inset-0 z-20 bg-black" />

        <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className={`font-mono text-sm ${a.text}`}>{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">{item.title}</h3>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-zinc-400">{item.text}</p>
            {item.example && (
              <a
                href={item.example.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-flex items-center gap-1.5 text-sm ${a.text} underline-offset-4 hover:underline`}
              >
                {exampleLabel} {item.example.label}
                <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
          <ul className="space-y-3">
            {item.points.map((p, k) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.15 + k * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-zinc-200"
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full ${a.dot} text-black`}>
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {p}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.article>
    </div>
  );
}
