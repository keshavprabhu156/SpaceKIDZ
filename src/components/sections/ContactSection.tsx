"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Transmission failed");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Connection lost. Check your uplink and retry.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div data-reveal>
            <span className="section-tag">08 · Contact</span>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide text-star sm:text-4xl">
              Open a <span className="text-electric">Channel</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-star/55">
              Schools, ministries of education and partners — request a full curriculum
              briefing, a pilot program for your institution, or teacher-training details.
            </p>
            <ul className="mt-8 space-y-3 font-mono text-[12px] uppercase tracking-[0.15em] text-star/50">
              <li>▸ missions@spacecurriculum.org — general</li>
              <li>▸ schools@spacecurriculum.org — institutions & pilots</li>
              <li>▸ partnerships@spacecurriculum.org — country partners</li>
            </ul>
            <p className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs leading-relaxed text-star/40">
              Response window: within 24 hours, any timezone. Live demos available for school
              leadership teams every week.
            </p>
          </div>

          <div data-reveal className="holo-panel holo-border p-8">
            {status === "sent" ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <p className="text-4xl">📡</p>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wider text-star">
                  Transmission Received
                </h3>
                <p className="mt-2 max-w-xs text-sm text-star/50">
                  Thank you, {form.name.split(" ")[0]}. Mission Control will respond within 24
                  hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-holo" htmlFor="c-name">Name</label>
                    <input id="c-name" required className="input-holo" value={form.name} onChange={set("name")} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="label-holo" htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" required className="input-holo" value={form.email} onChange={set("email")} placeholder="you@school.org" />
                  </div>
                </div>
                <div>
                  <label className="label-holo" htmlFor="c-org">School / Organization (optional)</label>
                  <input id="c-org" className="input-holo" value={form.organization} onChange={set("organization")} placeholder="Institution name" />
                </div>
                <div>
                  <label className="label-holo" htmlFor="c-msg">Message</label>
                  <textarea
                    id="c-msg"
                    required
                    rows={4}
                    className="input-holo resize-none"
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us about your school, grades of interest, and timeline…"
                  />
                </div>
                {error && (
                  <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
                    ⚠ {error}
                  </p>
                )}
                <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
                  {status === "sending" ? "Transmitting…" : "Transmit Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
