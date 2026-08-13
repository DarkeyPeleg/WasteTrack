"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  status: string;
};

export function AdminRequestActions({ id, status }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canAssign = status === "PENDING" || status === "ASSIGNED";
  const canCancel = status !== "COLLECTED" && status !== "CANCELLED";

  async function cancel() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not cancel");
      return;
    }
    router.refresh();
  }

  return (
    <div className="action-stack">
      <div className="btn-row">
        {canAssign && (
          <Link href={`/admin/requests/${id}?action=assign`} className="btn btn-primary btn-sm">
            Assign
          </Link>
        )}
        {canCancel && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={loading}
            onClick={cancel}
          >
            Cancel
          </button>
        )}
        <Link href={`/admin/requests/${id}`} className="btn btn-secondary btn-sm">
          View
        </Link>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
