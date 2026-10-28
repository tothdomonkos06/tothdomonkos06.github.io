"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Play, X } from "lucide-react";
import { GithubIcon } from "@/components/shared/BrandIcons";
import { PROJECTS, type Project } from "@/lib/site";
import { Reveal } from "@/components/shared/Reveal";
import { useLang, useT } from "@/lib/i18n";
import { lockScroll, unlockScroll } from "@/lib/scroll";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const SPRING = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 } as const;

const urlOf = (p: Project) =>
  p.live ? `tothdomonkos.me${p.live.replace("/index.html", "")}` : `github.com/tothdomonkos06`;

const youtubeId = (url?: string) => url?.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1];

export function Work() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState<Project | null>(null);

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
                <ProjectCard project={project} index={i} hidden={open?.slug === project.slug} onOpen={() => setOpen(project)} />
              </Reveal>
            </div>
          ))}
        </motion.div>

        {pinned && (
          <div className="mx-auto mt-12 flex w-full max-w-6xl items-center gap-4 px-6 font-mono text-xs text-zinc-500">
            <span>{t.work.scroll}</span>
            <div className="h-px flex-1 overflow-hidden bg-white/10">
              <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-gradient-to-r from-ember to-mint" />
            </div>
            <span>{t.work.count(PROJECTS.length)}</span>
          </div>
        )}
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
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

/** The browser-window frame. Shared (layoutId) between a card and its modal. */
function BrowserBar({ project }: { project: Project }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 border-b border-white/[0.06] bg-zinc-900/80 px-3 py-2.5">
      <span className="size-2 rounded-full bg-zinc-700 transition-colors group-hover:bg-ember" />
      <span className="size-2 rounded-full bg-zinc-700 transition-colors delay-75 group-hover:bg-amber-300" />
      <span className="size-2 rounded-full bg-zinc-700 transition-colors delay-150 group-hover:bg-mint" />
      <span className="ml-3 truncate font-mono text-[10px] text-zinc-500">{urlOf(project)}</span>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  hidden,
  onOpen,
}: {
  project: Project;
  index: number;
  hidden: boolean;
  onOpen: () => void;
}) {
  const { lang } = useLang();
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 180, damping: 18 });
  const px = useTransform(mx, (v) => v * 100);
  const py = useTransform(my, (v) => v * 100);
  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${px}% ${py}%, rgba(255,122,69,0.12), transparent 65%)`;

  const open = () => {
    // Settle the tilt first so the frame grows out of a flat card.
    mx.set(0.5);
    my.set(0.5);
    rotateX.jump(0);
    rotateY.jump(0);
    onOpen();
  };

  return (
    <div className="h-full [perspective:1200px]">
      <motion.article
        ref={ref}
        data-cursor={t.work.open}
        style={{ rotateX, rotateY }}
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
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950 p-2 transition-colors duration-500 hover:border-ember/40"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />

        <motion.div
          layoutId={`frame-${project.slug}`}
          transition={SPRING}
          style={{ borderRadius: 18, opacity: hidden ? 0 : 1 }}
          className="relative overflow-hidden border border-white/[0.06] bg-zinc-900"
        >
          <BrowserBar project={project} />
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={project.image}
              alt={`${project.title} ${t.work.screenshot}`}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover object-left-top opacity-80 grayscale-[40%] transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 right-4 font-mono text-6xl font-bold tracking-tighter text-white/10 transition-colors duration-500 group-hover:text-ember/60">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        <div className="relative z-20 flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between font-mono text-xs text-zinc-500">
            <span>{project.kind[lang]}</span>
            <span>{project.year}</span>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight text-white">
            <button type="button" onClick={open} className="inline-flex items-center gap-2 text-left after:absolute after:inset-0">
              {project.title}
              <ArrowUpRight className="size-5 text-zinc-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember" />
            </button>
          </h3>

          <p className="mt-3 text-pretty leading-relaxed text-zinc-400">{project.description[lang]}</p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                {tag}
              </span>
            ))}
            <div className="relative z-30 ml-auto flex items-center gap-1">
              {project.code && (
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

const noopSubscribe = () => () => {};

/** Full-screen view: the card's frame grows into it and the live app loads inside. */
function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  // True only on the client, so the portal is never part of server HTML.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (!project) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [project, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>{project && <ModalBody key={project.slug} project={project} onClose={onClose} />}</AnimatePresence>,
    document.body
  );
}

function ModalBody({ project, onClose }: { project: Project; onClose: () => void }) {
  const { lang } = useLang();
  const t = useT();
  const [ready, setReady] = useState(false);
  const yt = youtubeId(project.video);
  const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } };

  // Fallback in case the layout animation is skipped (e.g. ?nomotion).
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={project.title}>
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        {...fade}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="relative z-10 mx-auto mb-3 flex w-full max-w-6xl flex-wrap items-center gap-3"
      >
        <div className="mr-auto min-w-0">
          <p className="font-mono text-xs text-ember">
            {project.kind[lang]} · {project.year}
          </p>
          <h3 className="truncate text-xl font-semibold text-white sm:text-2xl">{project.title}</h3>
        </div>
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-ember">
            {t.work.openNewTab} <ArrowUpRight className="size-4" />
          </a>
        )}
        {project.code && (
          <a href={project.code} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-4 text-sm text-white transition-colors hover:border-white/40">
            <GithubIcon className="size-4" /> {t.work.source}
          </a>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.work.close}
          className="grid size-9 place-items-center rounded-full border border-white/15 text-white transition-all hover:rotate-90 hover:border-ember hover:text-ember"
        >
          <X className="size-4" />
        </button>
      </motion.div>

      <motion.div
        layoutId={`frame-${project.slug}`}
        transition={SPRING}
        onLayoutAnimationComplete={() => setReady(true)}
        style={{ borderRadius: 18 }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden border border-white/10 bg-zinc-900 shadow-[0_40px_120px_-20px_rgba(255,74,0,0.25)]"
      >
        <BrowserBar project={project} />
        <div className="relative flex-1 bg-zinc-950" data-lenis-prevent>
          {/* The screenshot holds the space while the frame grows; the real thing replaces it. */}
          <Image src={project.image} alt="" fill sizes="100vw" className={`object-contain transition-opacity duration-500 ${ready && (project.live || yt) ? "opacity-0" : "opacity-100"}`} />
          {ready && project.live && (
            <motion.iframe
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={project.live}
              title={project.title}
              className="absolute inset-0 size-full bg-white"
            />
          )}
          {ready && !project.live && yt && (
            <motion.iframe
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
              title={project.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          )}
        </div>
      </motion.div>

      <motion.p
        {...fade}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="relative z-10 mx-auto mt-3 w-full max-w-6xl text-pretty text-sm text-zinc-400"
      >
        {project.description[lang]}
        {project.live && <span className="ml-2 text-mint">· {t.work.tryIt}</span>}
      </motion.p>
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
      className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-ember/50 hover:text-ember"
    >
      {children}
    </a>
  );
}
