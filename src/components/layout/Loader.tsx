"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { finishIntro } from "@/lib/intro";
import { motionDisabled } from "@/lib/motion";

export const INTRO_KEY = "intro-seen";
// Matches the CSS animation in globals.css (.loader-count / .loader-bar).
const COUNT_MS = 1300;
const noop = () => () => {};

function alreadySeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1" || motionDisabled();
  } catch {
    return motionDisabled();
  }
}

/**
 * First visit in a tab: a 0-100 counter, then a curtain lifts off the page.
 * The counting is pure CSS, so it runs from the first paint even while the
 * JavaScript is still loading; React only decides when to lift the curtain.
 */
export function Loader() {
  const skip = useSyncExternalStore(noop, alreadySeen, () => false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (skip) {
      finishIntro();
      return;
    }
    // The CSS counter started at first paint; wait out whatever is left of it.
    const left = Math.max(150, COUNT_MS + 120 - performance.now());
    const id = window.setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      setDone(true);
      // Start the hero while the curtain is still lifting.
      window.setTimeout(finishIntro, 350);
    }, left);
    return () => window.clearTimeout(id);
  }, [skip]);

  const show = !skip && !done;

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {show && (
        <motion.div
          key="loader"
          data-loader
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black p-6 sm:p-10"
          exit={{ y: "-100%", borderBottomLeftRadius: "40% 12%", borderBottomRightRadius: "40% 12%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="grid size-6 place-items-center rounded-full bg-white font-mono text-[10px] font-bold text-black">TD</span>
            tothdomonkos.me
          </div>
          <div className="flex items-end justify-between gap-6">
            <span
              aria-hidden
              className="loader-count font-mono text-[22vw] font-semibold leading-none tracking-tighter text-white sm:text-[14vw]"
            />
            <div className="mb-[3vw] h-px w-1/3 overflow-hidden bg-white/10">
              <div className="loader-bar h-full bg-gradient-to-r from-moss via-sage to-sand" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
