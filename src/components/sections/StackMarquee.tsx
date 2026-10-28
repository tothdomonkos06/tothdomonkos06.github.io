"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const ROW_A = ["C", "C++", "Java", "TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"];
const ROW_B = ["Git", "Maven", "JUnit", "Verilog", "FPGA", "Algorithms", "OOP", "Assembly"];

/** Two endless rows that drift in opposite directions and speed up and skew with scroll speed. */
export function StackMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-10 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <Row items={ROW_A} baseVelocity={-2.2} />
      <Row items={ROW_B} baseVelocity={2.2} outline />
    </div>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row({ items, baseVelocity, outline = false }: { items: string[]; baseVelocity: number; outline?: boolean }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2000, 0, 2000], [12, 0, -12]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = velocityFactor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  // Four copies so the -25% wrap is seamless on wide screens.
  const copies = [0, 1, 2, 3];

  return (
    <motion.div style={{ x, skewX }} className="flex w-max whitespace-nowrap py-2">
      {copies.map((c) => (
        <div key={c} className="flex shrink-0 items-center" aria-hidden={c > 0}>
          {items.map((item) => (
            <span key={item} className="flex items-center">
              <span
                className={`px-6 text-5xl font-semibold tracking-tighter sm:text-7xl ${
                  outline ? "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]" : "text-zinc-200"
                }`}
              >
                {item}
              </span>
              <span className="size-2 rounded-full bg-zinc-700" />
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
