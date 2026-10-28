"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

export type Lang = "hu" | "en";
const STORAGE_KEY = "lang";
const EVENT = "langchange";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void };
const LangContext = createContext<Ctx>({ lang: "hu", setLang: () => {}, toggle: () => {} });

function readLang(): Lang {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "hu";
  } catch {
    return "hu";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Hungarian by default; a visitor's choice is remembered in localStorage. */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "hu" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const toggle = useCallback(() => setLang(lang === "hu" ? "en" : "hu"), [lang, setLang]);

  return <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** The strings for the current language. */
export function useT() {
  const { lang } = useLang();
  return DICT[lang];
}

/** A value that exists in both languages. */
export type L = { hu: string; en: string };

export type Service = {
  title: string;
  text: string;
  points: string[];
  example?: { label: string; href: string };
};

const hu = {
  nav: {
    services: "Mit csinálok",
    work: "Munkák",
    about: "Rólam",
    contact: "Kapcsolat",
    top: "Tóth Domonkos, vissza a tetejére",
    switchTo: "Switch to English",
  },
  hero: {
    badge: "Mérnökinformatika @ BME · Budapest",
    line1: "Tóth Domonkos",
    line2: "mérnökinformatikus.",
    intro:
      "Az alacsony szintű C-től a gyors, igényes webappokig. Mérnökinformatikát tanulok, és saját projekteken dolgozom.",
    work: "Munkáim",
    contact: "Írj nekem",
    scroll: "Görgess a munkákhoz",
  },
  statement: {
    text: "Egy designos portfolio művészeknek, vagy professzionális weboldal vállalkozásoknak? Jöhet.",
    highlight: ["művészeknek", "vállalkozásoknak"],
  },
  services: {
    eyebrow: "01 — Mit csinálok",
    title: "Ebben tudok segíteni",
    exampleLabel: "Élőben:",
    items: [
      {
        title: "Portfólió művészeknek",
        text: "Fotós, grafikus, zenész vagy? Kapsz egy oldalt, ami pont olyan egyedi, mint a munkáid. Mozog, emlékezetes, és nem sablonszagú.",
        points: ["Egyedi design", "Görgetésre mozgó animációk", "Mobilon is ütős", "Villámgyors betöltés"],
      },
      {
        title: "Weboldal vállalkozásoknak",
        text: "Bemutatkozó oldal, foglalás vagy komplett webshop rendeléskezeléssel. Letisztult, gyors, és a Google is megtalálja.",
        points: ["Webshop és rendeléskezelés", "Kapcsolati űrlap, e-mailek", "SEO alapok", "Domain és hosting beállítás"],
        example: { label: "densitylab.hu", href: "https://densitylab.hu" },
      },
      {
        title: "Kis webappok ötletekre",
        text: "Van egy problémád, amit egy okos kis app megoldana? Pont így készült a Race Fuel Planner és a Washing Expert is.",
        points: ["Ötlettől az élesítésig", "Böngészőben fut, telepítés nélkül", "Egyszerű, érthető felület"],
      },
    ] as Service[],
  },
  work: {
    eyebrow: "02 — Válogatott munkák",
    title: "Amiket építettem",
    intro:
      "Egyetemi és saját projektek, egy C-ben írt terminálos játéktól a böngészőben azonnal kipróbálható webappokig.",
    scroll: "Görgess",
    count: (n: number) => `${String(n).padStart(2, "0")} projekt`,
    source: "Forráskód",
    video: "Videó",
    screenshot: "képernyőkép",
    openNewTab: "Megnyitás új lapon",
    close: "Bezárás",
    tryIt: "Próbáld ki itt helyben",
  },
  about: {
    eyebrow: "03 — Rólam",
    title: "Mérnöknek tanulok, építeni szeretek",
    intro:
      "Másodéves mérnökinformatikus hallgató vagyok a Budapesti Műszaki és Gazdaságtudományi Egyetemen. Az órákon az elméletet tanulom, a fenti projektekben pedig a gyakorlatba ültetem.",
    education: "Tanulmányok",
    school: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    degree: "BSc, mérnökinformatika · 2025 – 2029",
    subjects: [
      "Algoritmusok és adatszerkezetek",
      "OOP C++-ban és Javában",
      "Szoftvertechnológia",
      "Digitális technika és FPGA",
      "Matematika",
    ],
    graduation: "Várható végzés",
    year: "2. év a 4-ből",
    running: "Futás",
    runningTitle: "Hobbiból futni is szoktam.",
    runningText:
      "Szeretem a futás technikai oldalát: tempóstratégia, frissítés, adatok. Ebből a kíváncsiságból lett a Race Fuel Planner.",
    music: "Zene",
    musicYears: "év ének-zenei iskolában",
    musicText:
      "Megtanított csapatként gondolkodni, és habár más irányt vett a karrierem, ezt mindenhol tudom hasznosítani.",
    stack: "04 — Stack",
  },
  contact: {
    eyebrow: "05 — Kapcsolat",
    title: ["Építsünk", "valamit."],
    intro:
      "Gyakornoki hely, projektötlet, vagy csak egy kérdés valamelyik appommal kapcsolatban? Írj, és válaszolok.",
    copied: "Vágólapra másolva",
    name: "Név",
    namePh: "A neved",
    email: "E-mail",
    emailPh: "te@pelda.hu",
    message: "Üzenet",
    messagePh: "Min dolgozol?",
    sent: "Köszönöm, az üzenet elment.",
    error: "Valami hiba történt. Írj inkább e-mailt.",
    sending: "Küldés…",
    send: "Üzenet küldése",
  },
  footer: {
    built: "Next.js, Tailwind CSS és Kokonut UI felhasználásával készült.",
    top: "Vissza a tetejére",
  },
};

type Dict = typeof hu;

const en: Dict = {
  nav: {
    services: "Services",
    work: "Work",
    about: "About",
    contact: "Contact",
    top: "Tóth Domonkos, back to top",
    switchTo: "Váltás magyarra",
  },
  hero: {
    badge: "Computer Engineering @ BME · Budapest",
    line1: "Tóth Domonkos",
    line2: "computer engineer.",
    intro:
      "From low-level C to fast, good-looking web apps. I study computer engineering and build my own stuff on the side.",
    work: "See my work",
    contact: "Hit me up",
    scroll: "Scroll to work",
  },
  statement: {
    text: "A portfolio with real style for artists, or a clean, professional site for businesses? Say less.",
    highlight: ["artists", "businesses"],
  },
  services: {
    eyebrow: "01 — What I do",
    title: "Here's how I can help",
    exampleLabel: "Live:",
    items: [
      {
        title: "Portfolios for artists",
        text: "Photographer, designer, musician? You get a site as one-of-a-kind as your work. It moves, it sticks in people's heads, and it doesn't look like a template.",
        points: ["Custom design", "Scroll-driven animations", "Looks great on mobile", "Loads in a blink"],
      },
      {
        title: "Websites for businesses",
        text: "A landing page, bookings or a full webshop with order management. Clean, fast, and Google can actually find it.",
        points: ["Webshop & order management", "Contact forms & emails", "SEO basics", "Domain & hosting setup"],
        example: { label: "densitylab.hu", href: "https://densitylab.hu" },
      },
      {
        title: "Small web apps for ideas",
        text: "Got a problem a smart little app could fix? That's exactly how Race Fuel Planner and Washing Expert happened.",
        points: ["From idea to launch", "Runs in the browser, no install", "Simple, obvious UI"],
      },
    ],
  },
  work: {
    eyebrow: "02 — Selected work",
    title: "Stuff I've built",
    intro:
      "Uni projects and side projects, from a terminal game in C to web apps you can try right in your browser.",
    scroll: "Scroll",
    count: (n: number) => `${String(n).padStart(2, "0")} projects`,
    source: "Source code",
    video: "Video",
    screenshot: "screenshot",
    openNewTab: "Open in new tab",
    close: "Close",
    tryIt: "Try it right here",
  },
  about: {
    eyebrow: "03 — About",
    title: "Studying engineering, addicted to building",
    intro:
      "I'm a second-year Computer Engineering student at the Budapest University of Technology and Economics. Lectures give me the theory; the projects above are where I actually use it.",
    education: "Education",
    school: "Budapest University of Technology and Economics",
    degree: "BSc in Computer Engineering · 2025 – 2029",
    subjects: [
      "Algorithms & data structures",
      "OOP in C++ & Java",
      "Software engineering",
      "Digital systems & FPGA",
      "Mathematics",
    ],
    graduation: "Expected graduation",
    year: "Year 2 of 4",
    running: "Running",
    runningTitle: "I also run, just for fun.",
    runningText:
      "I'm into the nerdy side of running: pace strategy, fuelling, data. That curiosity is literally how Race Fuel Planner was born.",
    music: "Music",
    musicYears: "years at a choir-focused school",
    musicText:
      "It taught me to think as part of a team. My career went a different way, but that skill comes with me everywhere.",
    stack: "04 — Stack",
  },
  contact: {
    eyebrow: "05 — Contact",
    title: ["Let's", "build", "something."],
    intro:
      "Internship, a project idea, or just a question about one of my apps? Drop me a message and I'll get back to you.",
    copied: "Copied to clipboard",
    name: "Name",
    namePh: "Your name",
    email: "Email",
    emailPh: "you@example.com",
    message: "Message",
    messagePh: "What are you working on?",
    sent: "Thanks, message sent.",
    error: "Something went wrong. Try email instead.",
    sending: "Sending…",
    send: "Send message",
  },
  footer: {
    built: "Built with Next.js, Tailwind CSS and Kokonut UI.",
    top: "Back to top",
  },
};

const DICT: Record<Lang, Dict> = { hu, en };
