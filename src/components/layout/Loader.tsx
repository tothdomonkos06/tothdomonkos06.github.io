"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { finishIntro } from "@/lib/intro";
import { motionDisabled } from "@/lib/motion";

const KEY = "intro-seen";
const noop = () => () => {};

function alreadySeen() {
  try {
    return sessionStorage.getItem(KEY) === "1" || motionDisabled();
  } catch {
    return motionDisabled();
  }
}

/** First visit in a tab: a 0-100 counter, then a curtain lifts off the page. */
export function Loader() {
  // The server always renders the curtain, so nothing flashes before it.
  const skip = useSyncExternalStore(noop, alreadySeen, () => false);
  const [done, setDone] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(count, [0, 100], [0, 1]);

  useEffect(() => {
    if (skip) {
      finishIntro();
      return;
    }
    const controls = animate(count, 100, {
      duration: 1.3,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
        setDone(true);
        // Start the hero while the curtain is still lifting.
        window.setTimeout(finishIntro, 350);
      },
    });
    return () => controls.stop();
  }, [count, skip]);

  const show = !skip && !done;

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black p-6 sm:p-10"
          exit={{ y: "-100%", borderBottomLeftRadius: "40% 12%", borderBottomRightRadius: "40% 12%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="grid size-6 place-items-center rounded-full bg-white font-mono text-[10px] font-bold text-black">TD</span>
            tothdomonkos.me
          </div>
          <div className="flex items-end justify-between gap-6">
            <motion.span className="font-mono text-[22vw] font-semibold leading-none tracking-tighter text-white sm:text-[14vw]">
              {rounded}
            </motion.span>
            <div className="mb-[3vw] h-px w-1/3 overflow-hidden bg-white/10">
              <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-gradient-to-r from-ember to-ember-soft" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
