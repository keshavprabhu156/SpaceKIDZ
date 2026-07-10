"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { countries, languages, timezones } from "@/data/global";

const steps = ["Cadet Identity", "Academy Details", "Guardian & Location", "Secure Access"] as const;

interface FormState {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  schoolName: string;
  schoolId: string;
  email: string;
  phone: string;
  parentName: string;
  parentContact: string;
  city: string;
  state: string;
  country: string;
  language: string;
  timezone: string;
  password: string;
  confirm: string;
}

const initial: FormState = {
  fullName: "", dateOfBirth: "", gender: "", grade: "", schoolName: "", schoolId: "",
  email: "", phone: "", parentName: "", parentContact: "", city: "", state: "",
  country: "", language: "", timezone: "", password: "", confirm: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ studentId: string; name: string } | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const stepFields: (keyof FormState)[][] = useMemo(
    () => [
      ["fullName", "dateOfBirth", "gender", "grade"],
      ["schoolName", "email", "phone"],
      ["parentName", "parentContact", "city", "state", "country", "language", "timezone"],
      ["password", "confirm"],
    ],
    []
  );

  function validateStep(s: number): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    for (const f of stepFields[s]) {
      if (f === "schoolId") continue;
      if (!form[f].trim()) errs[f] = "Required";
    }
    if (s === 0 && form.dateOfBirth) {
      const age = (Date.now() - new Date(form.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 7 || age > 20) errs.dateOfBirth = "Age must be between 7 and 20";
    }
    if (s === 1) {
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
      if (form.phone && !/^[+\d][\d\s\-()]{6,17}$/.test(form.phone)) errs.phone = "Enter a valid phone number";
    }
    if (s === 2 && form.parentContact && !/^[+\d][\d\s\-()]{6,17}$/.test(form.parentContact))
      errs.parentContact = "Enter a valid contact number";
    if (s === 3) {
      if (form.password.length < 8) errs.password = "Minimum 8 characters";
      if (form.confirm !== form.password) errs.confirm = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit() {
    if (!validateStep(3)) return;
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          profile: {
            fullName: form.fullName,
            dateOfBirth: form.dateOfBirth,
            gender: form.gender,
            grade: Number(form.grade),
            schoolName: form.schoolName,
            schoolId: form.schoolId || undefined,
            phone: form.phone,
            parentName: form.parentName,
            parentContact: form.parentContact,
            city: form.city,
            state: form.state,
            country: form.country,
            language: form.language,
            timezone: form.timezone,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Registration failed");
        return;
      }
      setDone({ studentId: data.studentId, name: data.name });
    } catch {
      setServerError("Connection lost. Check your uplink and retry.");
    } finally {
      setLoading(false);
    }
  }

  const field = (
    name: keyof FormState,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div>
      <label className="label-holo" htmlFor={name}>{label}</label>
      <input id={name} className="input-holo" value={form[name]} onChange={set(name)} {...props} />
      {errors[name] && <p className="mt-1 text-[11px] text-red-400">⚠ {errors[name]}</p>}
    </div>
  );

  const select = (name: keyof FormState, label: string, options: readonly string[], placeholder: string) => (
    <div>
      <label className="label-holo" htmlFor={name}>{label}</label>
      <select id={name} className="input-holo" value={form[name]} onChange={set(name)}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-space-navy">{o}</option>
        ))}
      </select>
      {errors[name] && <p className="mt-1 text-[11px] text-red-400">⚠ {errors[name]}</p>}
    </div>
  );

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="holo-panel holo-border relative z-10 mx-auto max-w-lg p-10 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-electric/50 bg-electric/10 text-3xl shadow-holo-strong">
          🚀
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-wide text-star">
          Welcome Aboard, Cadet
        </h1>
        <p className="mt-3 text-sm text-star/60">
          {done.name}, your Academy credentials are active.
        </p>
        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/70">Student ID</p>
          <p className="mt-1 font-display text-xl font-bold tracking-widest text-gold text-glow-gold">
            {done.studentId}
          </p>
        </div>
        <button onClick={() => router.push("/student")} className="btn-primary mt-8 w-full">
          Enter Mission Control
        </button>
      </motion.div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-2xl">
      <div className="text-center">
        <span className="section-tag">Student Registration</span>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-star">
          Join the <span className="text-electric">Academy</span>
        </h1>
      </div>

      {/* Progress */}
      <div className="mt-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full transition-all duration-500 ${i <= step ? "bg-gradient-to-r from-electric to-galaxy-light shadow-holo" : "bg-white/10"}`} />
            <p className={`mt-2 hidden font-mono text-[9px] uppercase tracking-[0.15em] sm:block ${i <= step ? "text-electric" : "text-star/30"}`}>
              {String(i + 1).padStart(2, "0")} · {s}
            </p>
          </div>
        ))}
      </div>

      <div className="holo-panel mt-6 p-7 sm:p-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">{field("fullName", "Full Name", { placeholder: "As on school records", autoComplete: "name" })}</div>
                {field("dateOfBirth", "Date of Birth", { type: "date" })}
                {select("gender", "Gender", ["Female", "Male", "Other", "Prefer not to say"], "Select gender")}
                {select("grade", "Grade", ["4", "5", "6", "7", "8", "9", "10"], "Select grade")}
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">{field("schoolName", "School Name", { placeholder: "Full school name" })}</div>
                {field("schoolId", "School ID (optional)", { placeholder: "If provided by your school" })}
                {field("email", "Email", { type: "email", placeholder: "cadet@example.com", autoComplete: "email" })}
                {field("phone", "Phone Number", { type: "tel", placeholder: "+91 98765 43210" })}
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                {field("parentName", "Parent / Guardian Name")}
                {field("parentContact", "Parent Contact", { type: "tel", placeholder: "+91 98765 43210" })}
                {field("city", "City")}
                {field("state", "State / Province")}
                {select("country", "Country", countries.map((c) => c.name), "Select country")}
                {select("language", "Language Preference", languages, "Select language")}
                <div className="sm:col-span-2">{select("timezone", "Timezone", timezones, "Select timezone")}</div>
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-5">
                {field("password", "Create Password", { type: "password", placeholder: "Minimum 8 characters", autoComplete: "new-password" })}
                {field("confirm", "Confirm Password", { type: "password", autoComplete: "new-password" })}
                <p className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-[11px] leading-relaxed text-star/40">
                  Your Student ID is generated automatically on launch. Your data is encrypted
                  in transit and guardians can request access or deletion at any time.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {serverError && (
          <p role="alert" className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            ⚠ {serverError}
          </p>
        )}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost disabled:opacity-30"
          >
            ← Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => validateStep(step) && setStep((s) => s + 1)}
              className="btn-primary"
            >
              Continue →
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? "Launching…" : "🚀 Launch Registration"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
