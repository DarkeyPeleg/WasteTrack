"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { wasteTypes } from "@/lib/validations";

export function NewRequestForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      address: String(form.get("address") ?? ""),
      wasteType: String(form.get("wasteType") ?? ""),
      preferredDate: String(form.get("preferredDate") ?? ""),
      description: String(form.get("description") ?? ""),
    };

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not submit request");
      return;
    }

    router.push("/requests");
    router.refresh();
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <label>
        Collection address
        <input name="address" required placeholder="12 Liberation Road, Accra" />
      </label>
      <label>
        Waste type
        <select name="wasteType" required defaultValue="">
          <option value="" disabled>
            Select type
          </option>
          {wasteTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label>
        Preferred date
        <input name="preferredDate" type="date" required min={today} />
      </label>
      <label>
        Description
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Bags by the gate, organic waste only"
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
