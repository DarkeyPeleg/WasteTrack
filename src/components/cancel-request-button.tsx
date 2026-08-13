"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  status: string;
};

export function CancelRequestButton({ id, status }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "COLLECTED" || status === "CANCELLED") {
    return null;
  }

  async function cancel() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not cancel request");
      return;
    }
    router.refresh();
  }

  return (
    <div className="action-stack">
      <button
        type="button"
        className="btn btn-danger btn-sm"
        disabled={loading}
        onClick={cancel}
      >
        {loading ? "Cancelling…" : "Cancel"}
      </button>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
