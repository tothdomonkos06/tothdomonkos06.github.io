"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the intro loader has finished. The hero waits for it so its
 * entrance plays after the curtain lifts, not hidden under it.
 */
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false
  );
}
