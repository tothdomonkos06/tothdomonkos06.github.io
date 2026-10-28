import type { L } from "@/lib/i18n";

export const EMAIL = "tothdomonkos06@gmail.com";
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqnlogq";

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/tothdomonkos06" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/domonkos-t%C3%B3th/" },
];

export type Project = {
  slug: string;
  title: string;
  year: string;
  kind: L;
  description: L;
  image: string;
  tags: string[];
  live?: string;
  code?: string;
  video?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "race-fuel-planner",
    title: "Race Fuel Planner",
    year: "2026",
    kind: { hu: "Webapp", en: "Web app" },
    description: {
      hu: "Webapp, ami az adataid és a versenyterved alapján személyre szabott frissítési, hidratálási és elektrolit stratégiát készít futóversenyekre.",
      en: "A web app that builds a personal fuelling, hydration and electrolyte strategy for running races from your details and race plan.",
    },
    image: "/run-fuel-planner.png",
    tags: ["HTML", "CSS", "JavaScript"],
    live: "/projects/run-fuel-planner/index.html",
  },
  {
    slug: "washing-expert",
    title: "Washing Expert",
    year: "2026",
    kind: { hu: "Webapp", en: "Web app" },
    description: {
      hu: "Webapp, ami a ruha típusa és anyaga alapján megmondja a mosási programot, a hőfokot, a mosószert és a szárítás módját.",
      en: "A web app that tells you the wash programme, temperature, detergent and drying method from the type and fabric of a garment.",
    },
    image: "/washing-expert.png",
    tags: ["HTML", "CSS", "JavaScript"],
    live: "/projects/washing-expert/index.html",
  },
  {
    slug: "doppler-velocimeter",
    title: "Doppler Velocimeter",
    year: "2026",
    kind: { hu: "Fizika · Jelfeldolgozás", en: "Physics · Signal processing" },
    description: {
      hu: "2026-ban Fizika 1 tárgyból készített projektünk.",
      en: "Our team project for the Physics 1 course in 2026.",
    },
    image: "/soundwave_screenshot.png",
    tags: ["C++"],
    code: "https://github.com/tothdomonkos06/Doppler-fizika-projekt",
    video: "https://youtu.be/tTv-7G6lbeY",
  },
  {
    slug: "prog1-nagyhazi",
    title: "Legyen Ön is milliomos",
    year: "2025",
    kind: { hu: "Terminálos játék", en: "Terminal game" },
    description: {
      hu: "Prog1 tárgyból készített nagyházim újabb verziója.",
      en: "A newer version of my major assignment for the Programming 1 course.",
    },
    image: "/legyenonismilliomos.png",
    tags: ["C"],
    code: "https://github.com/tothdomonkos06/Prog1-Nagyhazi",
  },
];

export const STACK: { group: L; items: (string | L)[] }[] = [
  {
    group: { hu: "Nyelvek", en: "Languages" },
    items: ["C", "C++", "Java", "TypeScript", "JavaScript", "Assembly", "Verilog"],
  },
  {
    group: { hu: "Web", en: "Web" },
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML & CSS"],
  },
  {
    group: { hu: "Eszközök és rendszerek", en: "Tools & systems" },
    items: ["Git", "Maven", "JUnit", "FPGA", { hu: "Számítógép-architektúrák", en: "Computer architecture" }],
  },
];
