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
  kind: string;
  description: string;
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
    kind: "Web app",
    description:
      "Webapp, ami az adataid és a versenyterved alapján személyre szabott frissítési, hidratálási és elektrolit stratégiát készít futóversenyekre.",
    image: "/run-fuel-planner.png",
    tags: ["HTML", "CSS", "JavaScript"],
    live: "/projects/run-fuel-planner/index.html",
  },
  {
    slug: "washing-expert",
    title: "Washing Expert",
    year: "2026",
    kind: "Web app",
    description:
      "Webapp, ami a ruha típusa és anyaga alapján megmondja a mosási programot, a hőfokot, a mosószert és a szárítás módját.",
    image: "/washing-expert.png",
    tags: ["HTML", "CSS", "JavaScript"],
    live: "/projects/washing-expert/index.html",
  },
  {
    slug: "doppler-velocimeter",
    title: "Doppler Velocimeter",
    year: "2026",
    kind: "Physics · Signal processing",
    description: "2026-ban Fizika 1 tárgyból készített projektünk.",
    image: "/soundwave_screenshot.png",
    tags: ["C++"],
    code: "https://github.com/tothdomonkos06/Doppler-fizika-projekt",
    video: "https://youtu.be/tTv-7G6lbeY",
  },
  {
    slug: "prog1-nagyhazi",
    title: "Legyen Ön is milliomos",
    year: "2025",
    kind: "Terminal game",
    description: "Prog1 tárgyból készített nagyházim újabb verziója.",
    image: "/legyenonismilliomos.png",
    tags: ["C"],
    code: "https://github.com/tothdomonkos06/Prog1-Nagyhazi",
  },
];

export const STACK = [
  {
    group: "Languages",
    items: ["C", "C++", "Java", "TypeScript", "JavaScript", "Assembly", "Verilog"],
  },
  {
    group: "Web",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML & CSS"],
  },
  {
    group: "Tools & systems",
    items: ["Git", "Maven", "JUnit", "FPGA", "Computer architecture"],
  },
];
