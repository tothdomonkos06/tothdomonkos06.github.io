"use client";

import { MapPin, Code, User, GraduationCap, Building2, TerminalSquare, Cpu, GitBranch, Layers, Check, Trophy, Music, Network } from "lucide-react";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { motion } from "framer-motion";

export default function About() {
  const codeSnippet = `class Doma {
public:
    Doma() {
        university = "BME";
        major = "Computer Eng.";
        interests = ["Algorithms", "Systems"];
    }

    void runMarathon() {
        // Consistent training...
        keepPace(250); // optimize performance
    }
};`;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <main className="flex-grow w-full px-margin md:px-gutter max-w-screen-xl mx-auto py-xl flex flex-col gap-xl relative z-10">
      
      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center"
      >
        <motion.div variants={itemVariants} className="md:col-span-7 flex flex-col gap-sm">
          <div className="font-label-sm text-[12px] text-primary uppercase tracking-widest flex items-center gap-xs">
            <TerminalSquare size={16} />
            System Architecture & Engineering
          </div>
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface">
            Computer Engineering Student at BME | Software & Algorithms
          </h1>
          <p className="font-code-md text-[16px] md:text-[18px] text-secondary max-w-3xl mt-sm leading-relaxed">
            I am a first-year Computer Engineering student at BME (Budapest University of Technology and Economics). I am highly interested in software development, algorithms, and system architecture. Beyond the screen, I am a dedicated runner and a music enthusiast.
          </p>
          <div className="flex items-center gap-sm mt-sm flex-wrap">
            <div className="flex items-center gap-xs text-on-surface-variant font-code-md text-[14px] bg-surface-container-low border border-outline-variant px-sm py-xs rounded">
              <MapPin size={18} /> Budapest, Hungary
            </div>
            <a href="https://github.com/tothdomonkos06" target="_blank" rel="noopener noreferrer" className="flex items-center gap-xs text-on-surface-variant font-code-md text-[14px] bg-surface-container-low border border-outline-variant px-sm py-xs rounded hover:text-primary hover:border-primary transition-colors">
              <Code size={18} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/domonkos-t%C3%B3th/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-xs text-on-surface-variant font-code-md text-[14px] bg-surface-container-low border border-outline-variant px-sm py-xs rounded hover:text-primary hover:border-primary transition-colors">
              <User size={18} /> LinkedIn
            </a>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-5 w-full mt-lg md:mt-0">
          <TerminalBlock filename="profile.cpp" code={codeSnippet} />
        </motion.div>
      </motion.section>

      {/* Education Bento */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-md"
      >
        <h2 className="font-headline-lg text-[32px] text-on-surface border-b border-outline-variant pb-xs">Education Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-8 bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-md opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110">
              <GraduationCap size={120} />
            </div>
            <div className="font-label-sm text-[12px] text-primary flex items-center gap-xs">
              <Building2 size={16} /> Current Academic Focus
            </div>
            <div>
              <h3 className="font-headline-md text-[24px] text-on-surface">Budapest University of Technology and Economics (BME)</h3>
              <p className="font-body-lg text-[18px] text-on-surface-variant mt-xs">Bachelor of Science in Computer Engineering</p>
            </div>
            <div className="mt-auto pt-sm flex flex-wrap gap-xs relative z-10">
              {["Low-level & OOP", "Algorithms & Data Structures", "Digital Systems & FPGA", "Mathematical Foundations"].map(tag => (
                <span key={tag} className="px-xs py-base bg-surface-variant border border-outline-variant rounded font-label-sm text-[12px] text-on-surface transition-colors hover:bg-outline-variant">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 bg-surface border border-outline-variant rounded-lg p-md flex flex-col justify-center gap-sm">
            <div className="font-code-md text-[14px] text-on-surface-variant">Expected Graduation</div>
            <div className="font-headline-xl text-[48px] text-primary font-bold">2029</div>
            <div className="w-full bg-surface-variant h-1 mt-xs rounded-full overflow-hidden">
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 0.2 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="bg-primary h-full origin-left"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Technical Stack */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-md"
      >
        <h2 className="font-headline-lg text-[32px] text-on-surface border-b border-outline-variant pb-xs">Technical Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-surface-container-low border border-outline-variant rounded p-md flex flex-col gap-sm">
            <div className="font-label-sm text-[12px] text-on-surface-variant flex items-center gap-xs border-b border-outline-variant pb-xs">
              <Code size={16} /> Core Languages
            </div>
            <ul className="flex flex-col gap-xs font-code-md text-[14px] text-on-surface mt-xs">
              {["C", "C++ (OOP & STL)", "Assembly & Verilog"].map(lang => (
                <li key={lang} className="flex justify-between items-center group/item p-1 rounded hover:bg-surface-variant transition-colors cursor-default">
                  <span>{lang}</span>
                  <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-surface-container-low border border-outline-variant rounded p-md flex flex-col gap-sm">
            <div className="font-label-sm text-[12px] text-on-surface-variant flex items-center gap-xs border-b border-outline-variant pb-xs">
              <Cpu size={16} /> Hardware & Systems
            </div>
            <div className="flex flex-wrap gap-xs mt-xs">
              <div className="px-sm py-xs bg-surface border border-outline-variant rounded font-code-md text-[14px] text-on-surface flex items-center gap-xs hover:border-primary hover:text-primary transition-all cursor-default">
                <Cpu size={16} /> FPGA
              </div>
              <div className="px-sm py-xs bg-surface border border-outline-variant rounded font-code-md text-[14px] text-on-surface flex items-center gap-xs hover:border-primary hover:text-primary transition-all cursor-default">
                <GitBranch size={16} /> Git
              </div>
              <div className="px-sm py-xs bg-surface border border-outline-variant rounded font-code-md text-[14px] text-on-surface flex items-center gap-xs hover:border-primary hover:text-primary transition-all cursor-default">
                <Layers size={16} /> Computer Architecture
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low border border-outline-variant rounded p-md flex flex-col gap-sm">
            <div className="font-label-sm text-[12px] text-on-surface-variant flex items-center gap-xs border-b border-outline-variant pb-xs">
              <Network size={16} /> Engineering Principles
            </div>
            <ul className="flex flex-col gap-xs font-body-md text-[16px] text-on-surface mt-xs">
              {["Algorithm Design & Complexity", "Memory Management", "Discrete Math & Linear Algebra"].map(principle => (
                <li key={principle} className="flex items-start gap-xs p-1 group/item">
                  <Check size={20} className="text-primary group-hover/item:scale-125 transition-transform shrink-0" />
                  {principle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Beyond the Screen */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-md"
      >
        <h2 className="font-headline-lg text-[32px] text-on-surface border-b border-outline-variant pb-xs">Beyond the Screen</h2>
        <div className="flex flex-col gap-lg pl-sm border-l border-outline-variant ml-sm relative mt-sm">
          
          <div className="relative pl-lg py-sm group">
            <div className="absolute -left-[5px] top-4 w-[10px] h-[10px] rounded-full bg-primary ring-4 ring-background transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_10px_#4edea3]" />
            <div className="font-label-sm text-[12px] text-primary mb-base flex items-center gap-xs">
              <Trophy size={14} /> Sports & Performance
            </div>
            <h3 className="font-headline-md text-[24px] text-on-surface transition-colors group-hover:text-primary">Marathon Running</h3>
            <div className="font-code-md text-[14px] text-on-surface-variant mb-sm">Training, Tech & Tactics</div>
            <p className="font-body-md text-[16px] text-on-surface-variant max-w-3xl">
              I am an avid runner, currently training for a full marathon after completing several half-marathons. I love diving into the technical aspects of running, tracking pace strategies, and pushing my physical limits.
            </p>
          </div>
          
          <div className="relative pl-lg py-sm group">
            <div className="absolute -left-[5px] top-4 w-[10px] h-[10px] rounded-full bg-surface-variant border border-outline-variant ring-4 ring-background transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:scale-150 group-hover:shadow-[0_0_10px_#4edea3]" />
            <div className="font-label-sm text-[12px] text-on-surface-variant mb-base flex items-center gap-xs">
              <Music size={14} /> Interests
            </div>
            <h3 className="font-headline-md text-[24px] text-on-surface transition-colors group-hover:text-primary">A Passion for Music</h3>
            <div className="font-code-md text-[14px] text-on-surface-variant mb-sm">Choir, Discipline, Collaboration</div>
            <p className="font-body-md text-[16px] text-on-surface-variant max-w-3xl">
              Alongside my technical studies, music has been a lifelong passion. I spent 12 years at a choir-focused school, an experience that gave me a deep appreciation for discipline, collaboration, and the emotional depth that art can carry.
            </p>
          </div>

        </div>
      </motion.section>

    </main>
  );
}
