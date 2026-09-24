"use client";


import Link from "next/link";
import Image from "next/image";
import { Terminal, Code, User, Network } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { TextReveal } from "@/components/ui/TextReveal";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <main ref={containerRef} className="flex-grow flex flex-col gap-xl py-xl px-margin md:px-gutter max-w-screen-xl mx-auto w-full relative z-10">
      {/* Hero Section */}
      <section className="grid grid-cols-4 md:grid-cols-12 gap-gutter items-center min-h-[614px] relative">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-4 md:col-span-7 flex flex-col gap-md z-20"
        >
          <div className="flex items-center gap-xs">
            <Terminal className="text-primary" size={20} />
            <span className="font-label-sm text-[12px] text-primary uppercase tracking-widest">BME Computer Engineering</span>
          </div>
          
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface leading-tight">
            <TextReveal text="Computer Engineering Student at BME | Interested in Software Development & Algorithms" />
          </h1>
          
          <p className="font-code-md text-[16px] md:text-[18px] text-secondary max-w-3xl mt-sm leading-relaxed">
            I am a first-year engineering student passionate about IT, building scalable software, and system architecture. Always looking for new challenges, both in code and on the marathon track.
          </p>
          
          <div className="flex flex-wrap gap-sm pt-xs">
            <Magnetic>
              <Link 
                href="/portfolio" 
                className="bg-primary-container text-on-primary-container font-label-sm text-[12px] uppercase px-md py-sm rounded hover:bg-primary transition-colors flex items-center gap-xs shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
              >
                <Network size={18} />
                Explore Architecture
              </Link>
            </Magnetic>
            <Magnetic>
              <a 
                href="https://github.com/tothdomonkos06" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-transparent border border-outline-variant text-on-surface font-label-sm text-[12px] uppercase px-md py-sm rounded hover:border-primary hover:text-primary transition-all flex items-center gap-xs hover:-translate-y-1"
              >
                <Code size={18} />
                View GitHub
              </a>
            </Magnetic>
            <Magnetic>
              <a 
                href="https://www.linkedin.com/in/domonkos-t%C3%B3th/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-transparent border border-outline-variant text-on-surface font-label-sm text-[12px] uppercase px-md py-sm rounded hover:border-primary hover:text-primary transition-all flex items-center gap-xs hover:-translate-y-1"
              >
                <User size={18} />
                LinkedIn
              </a>
            </Magnetic>
          </div>
        </motion.div>

        {/* Decorative Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={{ y: yParallax }}
          className="col-span-4 md:col-span-5 relative h-64 md:h-96 rounded-lg border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-8 border-b border-outline-variant bg-surface-container-low flex items-center px-sm gap-xs z-20 backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-error" />
            <div className="w-3 h-3 rounded-full bg-tertiary-container" />
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="ml-sm font-code-md text-[10px] text-on-surface-variant">sys_kernel.c — vim</span>
          </div>
          
          <Image 
            src="/37d2b488845ea785f3c6ea24f61ff265.jpg"
            alt="Code abstraction"
            fill
            className="object-cover opacity-60 mt-4 mix-blend-screen z-10 transition-opacity duration-700 hover:opacity-100"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>
      </section>

      {/* Tech Stack / Skills */}
      <motion.section 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="flex flex-col gap-sm border-t border-outline-variant pt-xl"
      >
        <h2 className="font-headline-md text-[24px] text-on-surface">Core Competencies</h2>
        <div className="flex flex-wrap gap-xs">
          {["C / C++", "Algorithms & Data Structures", "Verilog / FPGA", "Computer Architecture", "Assembly", "Discrete Math & Linear Algebra"].map((skill, index) => (
            <motion.span 
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, backgroundColor: "var(--color-surface-container-high)", borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
              className="bg-surface-container border border-outline-variant text-on-surface font-code-md text-[14px] px-sm py-base rounded transition-colors cursor-pointer shadow-sm hover:shadow-md"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
