"use client";

import { useState } from "react";
import Image from "next/image";
import { Code, User, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrambleText } from "@/components/ui/ScrambleText";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "software", label: "Software Dev" },
  { id: "embedded", label: "Embedded Systems" },
  { id: "ai", label: "AI & ML" },
  { id: "networks", label: "Networks" },
];

const PROJECTS = [
  {
    id: 1,
    title: "Doppler Velocimeter",
    category: "software",
    categoryLabel: "Software Development",
    description: "2026-ban Fizika 1 tárgyból készített projektünk.",
    image: "/soundwave_screenshot.png",
    link: "https://github.com/tothdomonkos06/Doppler-fizika-projekt",
    video: "https://youtu.be/tTv-7G6lbeY",
    tags: ["C++"],
  },
  {
    id: 2,
    title: "Prog1-Nagyhazi",
    category: "software",
    categoryLabel: "Software Development",
    description: "Prog1 tárgyból készített nagyházim újabb verziója.",
    image: "/legyenonismilliomos.png",
    link: "https://github.com/tothdomonkos06/Prog1-Nagyhazi",
    video: null,
    tags: ["C"],
  },
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = PROJECTS.filter(
    (project) => activeFilter === "all" || project.category === activeFilter
  );

  return (
    <main className="flex-grow w-full max-w-screen-xl mx-auto px-margin md:px-gutter py-xl relative z-10">
      
      <motion.header 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-xl max-w-3xl"
      >
        <h1 className="font-headline-xl text-[48px] text-on-surface mb-sm">Portfolio</h1>
        <p className="font-code-md text-[16px] md:text-[18px] text-secondary mb-md leading-relaxed">
          A collection of projects built during my first year at BME. From low-level C to cross-platform mobile apps — each one taught me something new.
        </p>
        <div className="flex gap-sm">
          <a href="https://github.com/tothdomonkos06" target="_blank" rel="noopener noreferrer" className="flex items-center gap-xs text-on-surface-variant font-code-md text-[14px] bg-surface-container-low border border-outline-variant px-sm py-xs rounded hover:text-primary hover:border-primary transition-all hover:-translate-y-1">
            <Code size={18} /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/domonkos-t%C3%B3th/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-xs text-on-surface-variant font-code-md text-[14px] bg-surface-container-low border border-outline-variant px-sm py-xs rounded hover:text-primary hover:border-primary transition-all hover:-translate-y-1">
            <User size={18} /> LinkedIn
          </a>
        </div>
      </motion.header>

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        aria-label="Project Categories" 
        className="mb-lg"
      >
        <div className="flex flex-wrap gap-xs">
          {CATEGORIES.map((category) => {
            const isActive = activeFilter === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`font-label-sm text-[12px] px-sm py-xs rounded transition-colors uppercase tracking-widest border ${
                  isActive
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </section>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-md">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="md:col-span-6 bg-surface border border-outline-variant rounded flex flex-col p-md hover:border-primary transition-all group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(project.link, "_blank")}
    >
      <div className="w-full h-48 bg-surface-container-highest rounded mb-sm overflow-hidden relative border border-outline-variant/50">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 mix-blend-luminosity group-hover:mix-blend-normal"
        />
      </div>
      <span className="font-label-sm text-[12px] text-secondary-fixed-dim uppercase tracking-widest mb-xs">
        {project.categoryLabel}
      </span>
      <h2 className="font-headline-md text-[24px] text-on-surface mb-sm group-hover:text-primary transition-colors">
        <ScrambleText text={project.title} isHovered={isHovered} />
      </h2>
      <div className="flex flex-col flex-grow mb-md gap-sm">
        <p className="font-body-md text-[16px] text-on-surface-variant">
          {project.description}
        </p>
        {project.video && (
          <a
            href={project.video}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-xs text-primary hover:text-primary-container transition-colors w-fit group/link mt-auto"
          >
            <PlayCircle size={20} className="group-hover/link:scale-110 transition-transform" />
            <span className="font-label-sm text-[12px] uppercase tracking-widest border-b border-transparent group-hover/link:border-primary-container transition-colors">
              Video demonstration
            </span>
          </a>
        )}
      </div>
      <div className="flex flex-wrap gap-xs mt-auto pt-sm border-t border-outline-variant/30">
        {project.tags.map((tag) => (
          <span key={tag} className="font-code-md text-[14px] text-primary bg-primary/10 px-xs py-base rounded">
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
