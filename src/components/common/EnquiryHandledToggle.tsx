"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setEnquiryHandled } from "@/services/enquiryService";

export default function EnquiryHandledToggle({
  id,
  handled,
}: {
  id: string;
  handled: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    try {
      await setEnquiryHandled(id, !handled);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={handled ? "badge-ok" : "btn-console"}
      title={handled ? "Mark as not handled" : "Mark as handled"}
    >
      {pending ? "…" : handled ? "Handled" : "Mark handled"}
    </button>
  );
}
