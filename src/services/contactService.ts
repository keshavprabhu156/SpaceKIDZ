import apiClient from "./apiClient";
import type { ContactEnquiry } from "@/types/contact";

export const submitEnquiry = (payload: ContactEnquiry) =>
  apiClient.post<{ ok: true }>("/api/contact", payload);
