"use client";

import { useState } from "react";
import { submitEnquiry } from "@/services/contactService";
import { validateContactEnquiry } from "@/validation/contactValidation";
import type { ContactEnquiry } from "@/types/contact";

export type ContactStatus = "idle" | "sending" | "sent" | "error";

const EMPTY: ContactEnquiry = { name: "", email: "", organization: "", message: "" };

/** Form state, client-side validation and submission for the contact section. */
export function useContactForm() {
  const [form, setForm] = useState<ContactEnquiry>(EMPTY);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof ContactEnquiry) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Validate before hitting the network — same rules the API enforces.
    const invalid = validateContactEnquiry(form);
    if (invalid) {
      setError(invalid);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError(null);
    try {
      await submitEnquiry(form);
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return { form, set, submit, status, error };
}

export default useContactForm;
