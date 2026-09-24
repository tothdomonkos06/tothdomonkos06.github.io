"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type TerminalSequenceItem = {
  text: string;
  delay: number;
};

interface TerminalBlockProps {
  filename: string;
  code?: string;
  sequence?: TerminalSequenceItem[];
}

export function TerminalBlock({ filename, code, sequence }: TerminalBlockProps) {
  const [terminalText, setTerminalText] = useState("");

  const activeSequence = sequence || (code ? [{ text: code, delay: 0 }] : []);

  useEffect(() => {
    let currentText = "";
    let step = 0;
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    const typeNext = () => {
      if (step >= activeSequence.length) return;
      
      const currentSequence = activeSequence[step];
      
      if (charIndex < currentSequence.text.length) {
        currentText += currentSequence.text.charAt(charIndex);
        setTerminalText(currentText);
        charIndex++;
        // Very fast typing, like the old contact version
        timeout = setTimeout(typeNext, 10);
      } else {
        step++;
        charIndex = 0;
        if (step < activeSequence.length) {
          timeout = setTimeout(typeNext, activeSequence[step].delay);
        }
      }
    };

    timeout = setTimeout(typeNext, 300);
    return () => clearTimeout(timeout);
  }, [activeSequence]);

  return (
    <div className="bg-[#0f172a] border border-[#334155] rounded-lg overflow-hidden font-code-md text-[14px] text-on-surface flex flex-col h-full shadow-lg">
      <div className="bg-[#1e293b] border-b border-[#334155] px-sm py-xs flex items-center">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56] mr-1.5" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-1.5" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f] mr-1.5" />
        <div className="ml-sm text-on-surface-variant text-[12px] font-label-sm">{filename}</div>
      </div>
      <div className="p-sm flex-grow flex flex-col gap-xs bg-[#050914] overflow-x-auto h-[250px] min-h-[250px]">
        <div className="whitespace-pre-wrap">
          {terminalText}
          <motion.span 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-primary align-middle ml-1"
          />
        </div>
      </div>
    </div>
  );
}
