"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { motionDisabled } from "@/lib/motion";
import { setLenis } from "@/lib/scroll";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const still = motionDisabled();

  useEffect(() => {
    if (motionDisabled()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -80 },
      autoRaf: true,
      // Let scrollable areas inside a modal scroll on their own.
      prevent: (node) => !!node.closest("[data-lenis-prevent]"),
    });
    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion={still ? "always" : "never"}>
      <ScrollProgress />
      {children}
    </MotionConfig>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-moss via-sage to-sand"
    />
  );
}
