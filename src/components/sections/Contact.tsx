"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import { EMAIL, FORMSPREE_ENDPOINT, SOCIALS } from "@/lib/site";
import { Reveal } from "@/components/shared/Reveal";
import { GithubIcon, LinkedinIcon } from "@/components/shared/BrandIcons";
import { useLang, useT } from "@/lib/i18n";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const { lang } = useLang();
  const t = useT().contact;
  const sectionRef = useRef<HTMLElement>(null);
  // A circle grows up from the bottom edge as the section scrolls in.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start 0.15"] });
  const radius = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 100%)`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative scroll-mt-24 overflow-hidden">
      <motion.div
        aria-hidden
        style={{ clipPath }}
        className="pointer-events-none absolute inset-0 bg-zinc-950 bg-[radial-gradient(ellipse_60%_50%_at_20%_100%,rgba(255,74,0,0.22),transparent),radial-gradient(ellipse_50%_40%_at_90%_10%,rgba(210,255,244,0.08),transparent)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-28 sm:py-36 lg:grid-cols-2">
        <Reveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{t.eyebrow}</p>
          <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tighter text-white sm:text-7xl">
            {t.title.map((word, i) => (
              <span key={`${lang}-${word}`} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", rotate: 6 }}
                  whileInView={{ y: "0%", rotate: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-zinc-400">
            {t.intro}
          </p>

          <button
            type="button"
            onClick={copyEmail}
            data-cursor={t.copy}
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-5 pr-2 text-sm text-zinc-200 transition-colors hover:border-white/25"
          >
            {EMAIL}
            <span className="grid size-8 place-items-center rounded-full bg-ember text-black transition-transform group-hover:rotate-12">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </span>
          </button>
          <p className="mt-2 h-4 pl-5 text-xs text-zinc-500" aria-live="polite">
            {copied ? t.copied : ""}
          </p>

          <div className="mt-8 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
              >
                {s.label === "GitHub" ? <GithubIcon className="size-4" /> : <LinkedinIcon className="size-4" />}
                {s.label}
                <ArrowUpRight className="size-3.5 text-zinc-500 transition-colors group-hover:text-white" />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-white/[0.08] bg-zinc-950/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t.name} name="name" placeholder={t.namePh} />
              <Field label={t.email} name="email" type="email" placeholder={t.emailPh} />
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm text-zinc-400">{t.message}</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={t.messagePh}
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-white/30"
              />
            </label>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-500" aria-live="polite">
                {status === "sent" && <span className="text-emerald-400">{t.sent}</span>}
                {status === "error" && <span className="text-red-400">{t.error}</span>}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-ember disabled:opacity-60"
              >
                {status === "sending" ? t.sending : t.send}
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-zinc-400">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-white/10 bg-black px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-white/30"
      />
    </label>
  );
}
