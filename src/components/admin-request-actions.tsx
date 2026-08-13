"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
type Props = {
  id: string;
  status: string;
  collectorName: string | null;
};

export function AdminRequestActions({ id, status, collectorName }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function patch(body: Record<string, string>) {
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch(`/api/admin/requests/${id}`, {
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
    setMessage("Updated");
    router.refresh();
  }

  async function onAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await patch({ collectorName: String(form.get("collectorName") ?? "") });
  }

  return (
    <div className="action-stack">
      {(status === "PENDING" || status === "ASSIGNED") && (
        <form className="inline-form" onSubmit={onAssign}>
          <input
            name="collectorName"
            placeholder="Collector name"
            defaultValue={collectorName ?? ""}
            required
          />
          <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
            {status === "PENDING" ? "Assign collector" : "Update collector"}
          </button>
        </form>
      )}

      <div className="btn-row">
        {status === "ASSIGNED" && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={loading}
            onClick={() => patch({ status: "IN_PROGRESS" })}
          >
            Start progress
          </button>
        )}
        {status === "IN_PROGRESS" && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={loading}
            onClick={() => patch({ status: "COLLECTED" })}
          >
            Mark collected
          </button>
        )}
        {status !== "COLLECTED" && status !== "CANCELLED" && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={loading}
            onClick={() => patch({ status: "CANCELLED" })}
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-ok">{message}</p>}
    </div>
  );
}
