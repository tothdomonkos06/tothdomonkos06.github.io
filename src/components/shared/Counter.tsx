"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

/** Spins a number up from `from` to `to` the first time it scrolls into view. */
export function Counter({ from = 0, to, duration = 1.6, className }: { from?: number; to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {from}
    </span>
  );
}
