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

const hu = {
  nav: {
    work: "Munkák",
    about: "Rólam",
    stack: "Stack",
    contact: "Kapcsolat",
    top: "Tóth Domonkos, vissza a tetejére",
    switchTo: "Switch to English",
  },
  hero: {
    badge: "Mérnökinformatika @ BME · Budapest",
    line1: "Tóth Domonkos",
    line2: "szoftvereket fejleszt.",
    intro:
      "Az alacsony szintű C-től a gyors, igényes webappokig. Mérnökinformatikát tanulok, valódi problémákat megoldó saját projekteken dolgozom, közben pedig maratonra edzek.",
    work: "Munkáim",
    contact: "Írj nekem",
    scroll: "Görgess a munkákhoz",
  },
  statement: {
    text: "Szeretem egy rendszert egészen a bitekig megérteni, aztán azt a részét, amihez az emberek hozzányúlnak, könnyeddé tenni.",
    highlight: ["bitekig", "könnyeddé"],
  },
  work: {
    eyebrow: "01 — Válogatott munkák",
    title: "Amiket építettem",
    intro:
      "Egyetemi és saját projektek, egy C-ben írt terminálos játéktól a böngészőben azonnal kipróbálható webappokig.",
    scroll: "Görgess",
    count: (n: number) => `${String(n).padStart(2, "0")} projekt`,
    source: "Forráskód",
    video: "Videó",
    screenshot: "képernyőkép",
  },
  about: {
    eyebrow: "02 — Rólam",
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
    runningTitle: "Több félmaraton után jöhet a maraton.",
    runningText:
      "Szeretem a futás technikai oldalát: tempóstratégia, frissítés, adatok. Ebből a kíváncsiságból lett a Race Fuel Planner.",
    music: "Zene",
    musicTitle: "12 év ének-zenei iskolában",
    musicText:
      "Megtanított a fegyelemre, és arra, hogyan legyek egy nagyobb egész része. A szoftveres csapatmunka nagyrészt erről szól.",
    stack: "03 — Stack",
  },
  contact: {
    eyebrow: "04 — Kapcsolat",
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
    work: "Work",
    about: "About",
    stack: "Stack",
    contact: "Contact",
    top: "Tóth Domonkos, back to top",
    switchTo: "Váltás magyarra",
  },
  hero: {
    badge: "Computer Engineering @ BME · Budapest",
    line1: "Tóth Domonkos",
    line2: "builds software.",
    intro:
      "From low-level C to fast, polished web apps. I study computer engineering, ship side projects that solve real problems, and train for marathons in between.",
    work: "See my work",
    contact: "Get in touch",
    scroll: "Scroll to work",
  },
  statement: {
    text: "I like understanding a system all the way down to the bits, then making the part people actually touch feel effortless.",
    highlight: ["bits", "effortless"],
  },
  work: {
    eyebrow: "01 — Selected work",
    title: "Things I've built",
    intro:
      "University projects and side projects, from a terminal game in C to web apps you can use right in the browser.",
    scroll: "Scroll",
    count: (n: number) => `${String(n).padStart(2, "0")} projects`,
    source: "Source code",
    video: "Video demo",
    screenshot: "screenshot",
  },
  about: {
    eyebrow: "02 — About",
    title: "Engineer in training, builder by habit",
    intro:
      "I'm a second-year Computer Engineering student at the Budapest University of Technology and Economics. Lectures cover the theory; the projects above are where I put it to work.",
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
    runningTitle: "Several half marathons. Full marathon next.",
    runningText:
      "I like the technical side of running: pace strategy, fuelling, data. That curiosity is what became the Race Fuel Planner.",
    music: "Music",
    musicTitle: "12 years at a choir-focused school",
    musicText:
      "It taught me discipline and how to work as one part of a bigger whole, which is most of what teamwork in software is.",
    stack: "03 — Stack",
  },
  contact: {
    eyebrow: "04 — Contact",
    title: ["Let's", "build", "something."],
    intro:
      "Internship, a project idea, or just a question about one of my apps. Write to me and I'll get back to you.",
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
