"use client";

import { motion } from "framer-motion";

export function TextReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: "120%", opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={`inline-flex flex-wrap ${className || ""}`}
    >
      {words.map((word, idx) => (
        <span key={idx} className="overflow-hidden inline-block mr-[0.25em] pb-[0.1em]">
          <motion.span variants={item} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
