"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { GithubIcon } from "@/components/shared/BrandIcons";
import { PROJECTS, type Project } from "@/lib/site";
import { Reveal, SectionHeading } from "@/components/shared/Reveal";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:py-36">
      <SectionHeading eyebrow="01 — Selected work" title="Things I've built">
        University projects and side projects, from a terminal game in C to web apps people can use
        right in the browser.
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(255,255,255,0.07), transparent 70%)`;
  const primary = project.live ?? project.code;

  return (
    <article
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-400);
        my.set(-400);
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950 p-2 transition-colors duration-500 hover:border-white/20"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: spotlight }} />

      {/* Screenshot, framed like a browser window */}
      <div className="relative overflow-hidden rounded-[18px] border border-white/[0.06] bg-zinc-900">
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-zinc-900/80 px-3 py-2.5">
          <span className="size-2 rounded-full bg-zinc-700" />
          <span className="size-2 rounded-full bg-zinc-700" />
          <span className="size-2 rounded-full bg-zinc-700" />
          <span className="ml-3 truncate font-mono text-[10px] text-zinc-500">
            {project.live ? `tothdomonkos.me${project.live.replace("/index.html", "")}` : `github.com/tothdomonkos06`}
          </span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-left-top opacity-80 grayscale-[40%] transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
        </div>
      </div>

      <div className="relative z-20 flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between font-mono text-xs text-zinc-500">
          <span>{project.kind}</span>
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

        <p className="mt-3 text-pretty leading-relaxed text-zinc-400">{project.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
              {tag}
            </span>
          ))}

          <div className="relative z-30 ml-auto flex items-center gap-1">
            {project.code && project.live && <IconLink href={project.code} label="Source code"><GithubIcon className="size-4" /></IconLink>}
            {project.video && <IconLink href={project.video} label="Video demo"><Play className="size-4" /></IconLink>}
          </div>
        </div>
      </div>
    </article>
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
