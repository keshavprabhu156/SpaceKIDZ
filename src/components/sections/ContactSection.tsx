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
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("We couldn’t reach the server. Check your connection and retry.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2">
          <div data-reveal>
            <span className="section-tag">VIII · Correspondence</span>
            <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-star sm:text-4xl">
              Bring the school to your <span className="text-grad">students.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-star/60">
              Schools, ministries of education and partners — request a full curriculum
              briefing, a pilot programme for your institution, or teacher-training details.
            </p>
            <ul className="mt-8 space-y-2.5 text-sm text-star/60">
              <li>missions@spacecurriculum.org — general enquiries</li>
              <li>schools@spacecurriculum.org — institutions &amp; pilots</li>
              <li>partnerships@spacecurriculum.org — country partners</li>
            </ul>
            <p className="mt-8 rounded-lg border border-star/10 bg-white/[0.015] p-4 text-sm leading-relaxed text-star/50">
              We reply within 24 hours, any timezone. Live demonstrations for school
              leadership teams are available every week.
            </p>
          </div>

          <div data-reveal className="rounded-xl border border-star/10 bg-space-navy/50 p-8">
            {status === "sent" ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="text-3xl text-electric">✦</span>
                <h3 className="mt-4 font-display text-xl font-medium text-star">
                  Message received
                </h3>
                <p className="mt-2 max-w-xs text-sm text-star/55">
                  Thank you, {form.name.split(" ")[0]}. We’ll be in touch within 24 hours.
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
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
