/**
 * Animations always run, even when the OS asks for reduced motion (Doma's
 * Windows has animation effects off, which would freeze the whole site).
 * Visitors who want a still page can open it with `?nomotion`.
 */
export function motionDisabled(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("nomotion");
}
