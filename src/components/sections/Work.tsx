"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { GithubIcon } from "@/components/shared/BrandIcons";
import { PROJECTS, type Project } from "@/lib/site";
import { Reveal } from "@/components/shared/Reveal";
import { useLang, useT } from "@/lib/i18n";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Work() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Desktop: the section pins and the cards slide sideways as you scroll.
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const track = trackRef.current;
      setPinned(mq.matches);
      if (!track || !mq.matches) return setDistance(0);
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const barScale = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative scroll-mt-0"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-28"}>
        <motion.div
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className={pinned ? "flex w-max items-stretch gap-8 pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pr-24" : "mx-auto flex max-w-6xl flex-col gap-6 px-6"}
        >
          <Intro pinned={pinned} />
          {PROJECTS.map((project, i) => (
            <div key={project.slug} className={pinned ? "w-[min(560px,42vw)] shrink-0" : ""}>
              <Reveal delay={pinned ? 0.1 * i : 0} className="h-full">
                <ProjectCard project={project} index={i} />
              </Reveal>
            </div>
          ))}
        </motion.div>

        {pinned && (
          <div className="mx-auto mt-12 flex w-full max-w-6xl items-center gap-4 px-6 font-mono text-xs text-zinc-500">
            <span>{t.work.scroll}</span>
            <div className="h-px flex-1 overflow-hidden bg-white/10">
              <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-white" />
            </div>
            <span>{t.work.count(PROJECTS.length)}</span>
          </div>
        )}
      </div>
    </section>
  );
}

function Intro({ pinned }: { pinned: boolean }) {
  const t = useT();
  return (
    <div className={pinned ? "flex w-[min(420px,32vw)] shrink-0 flex-col justify-center" : "mb-8 max-w-2xl"}>
      <Reveal>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{t.work.eyebrow}</p>
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          {t.work.title}
        </h2>
        <p className="mt-5 text-pretty leading-relaxed text-zinc-400 sm:text-lg">{t.work.intro}</p>
      </Reveal>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { lang } = useLang();
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 180, damping: 18 });
  const px = useTransform(mx, (v) => v * 100);
  const py = useTransform(my, (v) => v * 100);
  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${px}% ${py}%, rgba(255,255,255,0.09), transparent 65%)`;
  const primary = project.live ?? project.code;

  return (
    <div className="h-full [perspective:1200px]">
      <motion.article
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950 p-2 transition-colors duration-500 hover:border-white/20"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />

        <div className="relative overflow-hidden rounded-[18px] border border-white/[0.06] bg-zinc-900" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-zinc-900/80 px-3 py-2.5">
            <span className="size-2 rounded-full bg-zinc-700 transition-colors group-hover:bg-red-400/80" />
            <span className="size-2 rounded-full bg-zinc-700 transition-colors delay-75 group-hover:bg-amber-400/80" />
            <span className="size-2 rounded-full bg-zinc-700 transition-colors delay-150 group-hover:bg-emerald-400/80" />
            <span className="ml-3 truncate font-mono text-[10px] text-zinc-500">
              {project.live ? `tothdomonkos.me${project.live.replace("/index.html", "")}` : `github.com/tothdomonkos06`}
            </span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={project.image}
              alt={`${project.title} ${t.work.screenshot}`}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover object-left-top opacity-80 grayscale-[40%] transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 right-4 font-mono text-6xl font-bold tracking-tighter text-white/10 transition-colors duration-500 group-hover:text-white/25">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="relative z-20 flex flex-1 flex-col p-5 sm:p-6" style={{ transform: "translateZ(20px)" }}>
          <div className="mb-3 flex items-center justify-between font-mono text-xs text-zinc-500">
            <span>{project.kind[lang]}</span>
            <span>{project.year}</span>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight text-white">
            {primary ? (
              <a href={primary} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 after:absolute after:inset-0">
                {project.title}
                <ArrowUpRight className="size-5 text-zinc-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </a>
            ) : (
              project.title
            )}
          </h3>

          <p className="mt-3 text-pretty leading-relaxed text-zinc-400">{project.description[lang]}</p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                {tag}
              </span>
            ))}
            <div className="relative z-30 ml-auto flex items-center gap-1">
              {project.code && project.live && (
                <IconLink href={project.code} label={t.work.source}>
                  <GithubIcon className="size-4" />
                </IconLink>
              )}
              {project.video && (
                <IconLink href={project.video} label={t.work.video}>
                  <Play className="size-4" />
                </IconLink>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
    >
      {children}
    </a>
  );
}
