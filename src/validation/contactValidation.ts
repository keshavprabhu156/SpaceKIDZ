import type { ContactEnquiry } from "@/types/contact";
import { EMAIL_RE } from "./authValidation";

/** Returns an error string, or null when the enquiry is valid. */
export function validateContactEnquiry(
  body: Partial<ContactEnquiry> | null
): string | null {
  if (!body) return "Invalid request";
  if (!body.name?.trim() || !body.message?.trim()) {
    return "Name and message are required";
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return "A valid email is required";
  }
  return null;
}
