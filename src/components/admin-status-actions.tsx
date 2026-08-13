"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  requestId: string;
  status: string;
};

export function AdminStatusActions({ requestId, status }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function patch(body: Record<string, string>) {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Update failed");
      return;
    }
    router.refresh();
  }

  if (status === "COLLECTED" || status === "CANCELLED") {
    return null;
  }

  return (
    <div className="action-stack">
      <div className="btn-row">
        {status === "ASSIGNED" && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={loading}
            onClick={() => patch({ status: "IN_PROGRESS" })}
          >
            Mark in progress
          </button>
        )}
        {status === "IN_PROGRESS" && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={loading}
            onClick={() => patch({ status: "COLLECTED" })}
          >
            Mark collected
          </button>
        )}
        <button
          type="button"
          className="btn btn-danger btn-sm"
          disabled={loading}
          onClick={() => patch({ status: "CANCELLED" })}
        >
          Cancel
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
