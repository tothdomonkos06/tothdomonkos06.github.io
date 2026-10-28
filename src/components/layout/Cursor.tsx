"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { motionDisabled } from "@/lib/motion";

const noop = () => () => {};
const canUse = () => window.matchMedia("(pointer: fine)").matches && !motionDisabled();

/**
 * A small ember dot trailed by a ring. Over anything with `data-cursor="Label"`
 * the ring swells into a pill showing that label; over links it grows a bit.
 * Only for mouse users; touch devices keep their normal behaviour.
 */
export function Cursor() {
  const enabled = useSyncExternalStore(noop, canUse, () => false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 420, damping: 34, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el || !(el instanceof Element)) return;
      // The cursor can't follow into an iframe, so step aside there.
      if (el.tagName === "IFRAME") {
        setHidden(true);
        return;
      }
      const tagged = el.closest<HTMLElement>("[data-cursor]");
      setLabel(tagged?.dataset.cursor ?? null);
      setHovering(!!el.closest("a, button, [role='button'], label, select"));
    };
    const onLeave = () => setHidden(true);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 96 : hovering ? 44 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      {/* Trailing ring / label pill */}
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-solid"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: hidden ? 0 : 1,
          scale: down ? 0.85 : 1,
          backgroundColor: label ? "rgba(255,74,0,1)" : hovering ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
          borderColor: label ? "rgba(255,74,0,0)" : "rgba(255,255,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="text-[11px] font-semibold uppercase tracking-wider text-black"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Exact-position dot */}
      <motion.div
        className="absolute left-0 top-0 size-1.5 rounded-full bg-ember"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden || label ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
