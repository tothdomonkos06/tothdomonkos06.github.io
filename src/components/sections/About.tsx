"use client";

import { motion } from "framer-motion";
import { GraduationCap, Music, Timer } from "lucide-react";
import { STACK } from "@/lib/site";
import { useLang, useT } from "@/lib/i18n";
import { Reveal, SectionHeading } from "@/components/shared/Reveal";

export function About() {
  const { lang } = useLang();
  const t = useT();
  const a = t.about;

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:py-36">
      <SectionHeading eyebrow={a.eyebrow} title={a.title}>
        {a.intro}
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4">
          <Tile className="h-full">
            <TileLabel icon={<GraduationCap className="size-4" />}>{a.education}</TileLabel>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">{a.school}</h3>
            <p className="mt-2 text-zinc-400">{a.degree}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {a.subjects.map((s) => (
                <span key={s} className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/[0.06]">
                  {s}
                </span>
              ))}
            </div>
          </Tile>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.1}>
          <Tile className="flex h-full flex-col justify-between">
            <TileLabel>{a.graduation}</TileLabel>
            <div>
              <p className="mt-6 font-mono text-6xl font-semibold tracking-tighter text-white">2029</p>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full origin-left rounded-full bg-white"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-3 font-mono text-xs text-zinc-500">{a.year}</p>
            </div>
          </Tile>
        </Reveal>

        <Reveal className="md:col-span-3">
          <Tile className="h-full">
            <TileLabel icon={<Timer className="size-4" />}>{a.running}</TileLabel>
            <h3 className="mt-6 text-xl font-semibold text-white">{a.runningTitle}</h3>
            <p className="mt-3 leading-relaxed text-zinc-400">{a.runningText}</p>
          </Tile>
        </Reveal>

        <Reveal className="md:col-span-3" delay={0.1}>
          <Tile className="h-full">
            <TileLabel icon={<Music className="size-4" />}>{a.music}</TileLabel>
            <h3 className="mt-6 text-xl font-semibold text-white">{a.musicTitle}</h3>
            <p className="mt-3 leading-relaxed text-zinc-400">{a.musicText}</p>
          </Tile>
        </Reveal>
      </div>

      <div id="stack" className="scroll-mt-28 pt-28">
        <Reveal className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{a.stack}</p>
        </Reveal>
        <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {STACK.map((row, i) => (
            <Reveal key={row.group.en} delay={i * 0.05}>
              <div className="grid gap-4 py-7 sm:grid-cols-[200px_1fr] sm:items-center">
                <p className="text-sm text-zinc-500">{row.group[lang]}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {row.items.map((item) => {
                    const label = typeof item === "string" ? item : item[lang];
                    return (
                      <span key={label} className="text-lg font-medium text-zinc-200 transition-colors hover:text-white sm:text-xl">
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-7 transition-colors duration-500 hover:border-white/15 ${className}`}
    >
      {children}
    </div>
  );
}

function TileLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-zinc-500">
      {icon}
      {children}
    </p>
  );
}
