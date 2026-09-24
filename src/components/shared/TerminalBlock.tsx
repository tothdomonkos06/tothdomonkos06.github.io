"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TerminalBlockProps {
  filename: string;
  code: string; // The raw code to type
}

export function TerminalBlock({ filename, code }: TerminalBlockProps) {
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const typeNextChar = () => {
      setTypedChars((prev) => {
        if (prev >= code.length) return prev;
        
        // Randomize typing speed slightly for realism
        const char = code[prev];
        let nextDelay = Math.random() * 80 + 70; // 70-150ms per character
        
        // Add prominent pauses for realism (newline or punctuation)
        if (char === '\n') nextDelay += 800; // Long pause on newline
        if (char === '{' || char === '}') nextDelay += 400;
        if (char === ';') nextDelay += 300;
        if (char === ' ') nextDelay += 50; // Slight pause on space
        
        timeout = setTimeout(typeNextChar, nextDelay);
        
        return prev + 1;
      });
    };

    // Start typing after a short delay
    timeout = setTimeout(typeNextChar, 500);

    return () => clearTimeout(timeout);
  }, [code]);

  // Very simple syntax highlighting for C++ (keywords, strings, comments)
  const renderHighlightedCode = (text: string) => {
    // We do simple replacements. In a real app we'd use prismjs or highlight.js,
    // but we can do a naive approach for this specific snippet.
    return text.split('\n').map((line, i) => {
      // Colorize comments
      if (line.includes('//')) {
        const [codePart, commentPart] = line.split('//');
        return (
          <div key={i} className="whitespace-pre">
            {highlightLine(codePart)}
            <span className="text-outline-variant">//{commentPart}</span>
          </div>
        );
      }
      return <div key={i} className="whitespace-pre">{highlightLine(line)}</div>;
    });
  };

  const highlightLine = (line: string) => {
    const keywords = ['class', 'public:', 'void'];
    let result = line;
    
    // Naive string replace
    result = result.replace(/"([^"]+)"/g, '<span class="text-secondary">"$1"</span>');
    keywords.forEach(kw => {
      result = result.replace(new RegExp(`\\b${kw}\\b`, 'g'), `<span class="text-primary">${kw}</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const currentCode = code.substring(0, typedChars);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-[0_0_40px_rgba(78,222,163,0.05)] w-full">
      <div className="bg-surface-container flex items-center gap-2 px-sm py-xs border-b border-outline-variant">
        <div className="w-3 h-3 rounded-full bg-error/80"></div>
        <div className="w-3 h-3 rounded-full bg-tertiary-container/80"></div>
        <div className="w-3 h-3 rounded-full bg-primary/80"></div>
        <span className="ml-sm font-label-sm text-[12px] text-on-surface-variant">{filename}</span>
      </div>
      <div className="p-sm font-code-md text-[14px] text-on-surface-variant overflow-x-auto h-[220px]">
        {renderHighlightedCode(currentCode)}
        {typedChars < code.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-primary ml-[1px] align-middle"
          />
        )}
      </div>
    </div>
  );
}
