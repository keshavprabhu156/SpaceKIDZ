import apiClient from "./apiClient";

/** Client-side call for the admin enquiry inbox's "mark handled" toggle. */
export const setEnquiryHandled = (id: string, handled: boolean) =>
  apiClient.patch<{ ok: boolean }>(`/api/admin/enquiries/${id}`, { handled });
