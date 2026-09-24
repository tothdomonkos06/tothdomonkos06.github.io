"use client";

import { useEffect, useRef } from "react";

export function InteractiveBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      bgRef.current.style.setProperty("--mouse-x", `${x}%`);
      bgRef.current.style.setProperty("--mouse-y", `${y}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 pointer-events-none -z-10 transition-[background] duration-100 ease-out"
      style={{
        background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(78, 222, 163, 0.04) 0%, transparent 40%)"
      }}
    />
  );
}
