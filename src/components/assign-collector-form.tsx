"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Collector = {
  id: string;
  name: string;
  phone: string;
  area: string;
};

type Props = {
  requestId: string;
  collectors: Collector[];
  selectedId?: string | null;
};

export function AssignCollectorForm({ requestId, collectors, selectedId }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const res = await fetch(`/api/admin/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectorId: String(form.get("collectorId") ?? "") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not assign collector");
      return;
    }
    router.push(`/admin/requests/${requestId}`);
    router.refresh();
  }

  return (
    <form className="assign-form" onSubmit={onSubmit}>
      <label className="field">
        <span className="field-label">Collector</span>
        <select name="collectorId" required defaultValue={selectedId ?? ""}>
          <option value="" disabled>
            Select a collector
          </option>
          {collectors.map((collector) => (
            <option key={collector.id} value={collector.id}>
              {collector.name} — {collector.area}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
        {loading ? "Assigning…" : selectedId ? "Reassign" : "Assign collector"}
      </button>
    </form>
  );
}
