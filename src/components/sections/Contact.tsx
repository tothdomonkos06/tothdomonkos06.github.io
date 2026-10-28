"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import { EMAIL, FORMSPREE_ENDPOINT, SOCIALS } from "@/lib/site";
import { Reveal } from "@/components/shared/Reveal";
import { GithubIcon, LinkedinIcon } from "@/components/shared/BrandIcons";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

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
    <section id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.06]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-28 sm:py-36 lg:grid-cols-2">
        <Reveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">04 — Contact</p>
          <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tighter text-white sm:text-7xl">
            {["Let's", "build", "something."].map((word, i) => (
              <span key={word} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
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
            Internship, a project idea, or just a question about one of my apps. Write to me and I&apos;ll
            get back to you.
          </p>

          <button
            type="button"
            onClick={copyEmail}
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-5 pr-2 text-sm text-zinc-200 transition-colors hover:border-white/25"
          >
            {EMAIL}
            <span className="grid size-8 place-items-center rounded-full bg-white text-black">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </span>
          </button>
          <p className="mt-2 h-4 pl-5 text-xs text-zinc-500" aria-live="polite">
            {copied ? "Copied to clipboard" : ""}
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
              <Field label="Name" name="name" placeholder="Your name" />
              <Field label="Email" name="email" type="email" placeholder="you@example.com" />
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm text-zinc-400">Message</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="What are you working on?"
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-white/30"
              />
            </label>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-500" aria-live="polite">
                {status === "sent" && <span className="text-emerald-400">Thanks, message sent.</span>}
                {status === "error" && <span className="text-red-400">Something went wrong. Try email instead.</span>}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
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
