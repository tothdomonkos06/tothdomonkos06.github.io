"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Send, Code, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const [terminalText, setTerminalText] = useState("");
  
  const terminalSequence = [
    { text: "$ whoami\n", delay: 300 },
    { text: "> Tóth Domonkos\n> Computer Engineer\n", delay: 100 },
    { text: "\n$ cat contact_info.json\n", delay: 500 },
    { text: '{\n  "email": "tothdomonkos06@gmail.com",\n  "location": "Budapest, HU",\n  "timezone": "UTC+1"\n}\n', delay: 100 },
    { text: "\n$ get_pgp_key\n", delay: 600 },
    { text: "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQINBGEq7oEBEAC7...[TRUNCATED_FOR_DISPLAY]...\n-----END PGP PUBLIC KEY BLOCK-----\n", delay: 100 }
  ];

  useEffect(() => {
    let currentText = "";
    let step = 0;
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    const typeNext = () => {
      if (step >= terminalSequence.length) return;
      
      const currentSequence = terminalSequence[step];
      
      if (charIndex < currentSequence.text.length) {
        currentText += currentSequence.text.charAt(charIndex);
        setTerminalText(currentText);
        charIndex++;
        timeout = setTimeout(typeNext, 10);
      } else {
        step++;
        charIndex = 0;
        if (step < terminalSequence.length) {
          timeout = setTimeout(typeNext, terminalSequence[step].delay);
        }
      }
    };

    timeout = setTimeout(typeNext, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="flex-grow w-full px-margin md:px-gutter max-w-screen-xl mx-auto py-xl relative z-10">
      <header className="mb-xl text-center md:text-left">
        <h1 className="font-headline-xl text-[48px] text-on-surface mb-sm">Initialize Connection</h1>
        <p className="font-code-md text-[16px] md:text-[18px] text-secondary mt-sm">System ready for secure data transfer. Awaiting input...</p>
      </header>
      
      <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
        {/* Contact Form Area */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-4 md:col-span-7 flex flex-col gap-lg"
        >
          <form 
            action="https://formspree.io/f/xpqnlogq" 
            method="POST" 
            className="bg-[#0f172a] border border-[#334155] shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] rounded-lg p-lg flex flex-col gap-md"
          >
            <div className="font-label-sm text-[12px] text-primary mb-sm uppercase tracking-widest">// Dispatch Protocol</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="relative rounded border border-outline-variant bg-surface-container-low transition-colors focus-within:border-primary group">
                <label className="absolute -top-3 left-3 bg-surface-container-low px-1 font-label-sm text-[12px] text-on-surface-variant transition-colors group-focus-within:text-primary">name_string</label>
                <input name="name" className="w-full bg-transparent border-none text-on-surface font-code-md text-[14px] p-sm focus:outline-none focus:ring-0" placeholder="John Doe" type="text" required />
              </div>
              <div className="relative rounded border border-outline-variant bg-surface-container-low transition-colors focus-within:border-primary group">
                <label className="absolute -top-3 left-3 bg-surface-container-low px-1 font-label-sm text-[12px] text-on-surface-variant transition-colors group-focus-within:text-primary">email_address</label>
                <input name="email" className="w-full bg-transparent border-none text-on-surface font-code-md text-[14px] p-sm focus:outline-none focus:ring-0" placeholder="john@domain.com" type="email" required />
              </div>
            </div>
            
            <div className="relative rounded border border-outline-variant bg-surface-container-low transition-colors mt-sm focus-within:border-primary group">
              <label className="absolute -top-3 left-3 bg-surface-container-low px-1 font-label-sm text-[12px] text-on-surface-variant transition-colors group-focus-within:text-primary">subject_context</label>
              <select name="subject" className="w-full bg-transparent border-none text-on-surface font-code-md text-[14px] p-sm focus:outline-none focus:ring-0 appearance-none">
                <option className="bg-surface-container-high" value="freelance">Freelance Inquiry</option>
                <option className="bg-surface-container-high" value="employment">Employment Opportunity</option>
                <option className="bg-surface-container-high" value="collab">Technical Collaboration</option>
                <option className="bg-surface-container-high" value="other">Other / Unknown</option>
              </select>
              <ChevronDown className="absolute right-sm top-[14px] text-on-surface-variant pointer-events-none" size={20} />
            </div>
            
            <div className="relative rounded border border-outline-variant bg-surface-container-low transition-colors mt-sm focus-within:border-primary group">
              <label className="absolute -top-3 left-3 bg-surface-container-low px-1 font-label-sm text-[12px] text-on-surface-variant transition-colors group-focus-within:text-primary">payload_body</label>
              <textarea name="message" className="w-full bg-transparent border-none text-on-surface font-code-md text-[14px] p-sm focus:outline-none focus:ring-0 resize-none" placeholder="Enter message parameters here..." rows={5} required></textarea>
            </div>
            
            <div className="mt-md flex justify-end">
              <button className="bg-primary-container text-on-primary-container font-label-sm text-[12px] px-lg py-sm rounded hover:bg-primary transition-colors flex items-center gap-xs" type="submit">
                <Send size={18} />
                EXECUTE_SEND
              </button>
            </div>
          </form>
        </motion.div>

        {/* Technical Identity & Terminal */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-4 md:col-span-5 flex flex-col gap-lg"
        >
          {/* Terminal Contact Info */}
          <div className="bg-[#0f172a] border border-[#334155] rounded-lg overflow-hidden font-code-md text-[14px] text-on-surface flex flex-col min-h-[300px]">
            <div className="bg-[#1e293b] border-b border-[#334155] px-sm py-xs flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] mr-1.5" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-1.5" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f] mr-1.5" />
              <div className="ml-sm text-on-surface-variant text-[12px]">contact@tothdomonkos.sh</div>
            </div>
            <div className="p-sm flex-grow flex flex-col gap-xs bg-[#050914]">
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
          
          {/* External Links Bento */}
          <div className="grid grid-cols-2 gap-sm">
            <a href="https://github.com/tothdomonkos06" target="_blank" rel="noopener noreferrer" className="bg-[#0f172a] border border-[#334155] rounded-lg p-sm flex flex-col items-center justify-center gap-xs hover:border-primary transition-colors group">
              <Code size={32} className="text-on-surface-variant group-hover:text-primary transition-colors" />
              <span className="font-label-sm text-[12px] text-on-surface">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/domonkos-tóth/" target="_blank" rel="noopener noreferrer" className="bg-[#0f172a] border border-[#334155] rounded-lg p-sm flex flex-col items-center justify-center gap-xs hover:border-primary transition-colors group">
              <Briefcase size={32} className="text-on-surface-variant group-hover:text-primary transition-colors" />
              <span className="font-label-sm text-[12px] text-on-surface">LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
