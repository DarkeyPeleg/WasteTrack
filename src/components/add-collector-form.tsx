"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AddCollectorForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const res = await fetch("/api/admin/collectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        area: String(data.get("area") ?? ""),
      }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Could not add collector");
      return;
    }

    form.reset();
    router.refresh();
  }

  return (
    <form className="auth-form form-card" onSubmit={onSubmit}>
      <label className="field">
        <span className="field-label">Full name</span>
        <input name="name" required placeholder="Kwame Boateng" />
      </label>
      <label className="field">
        <span className="field-label">Phone</span>
        <input name="phone" required placeholder="024 411 2201" />
      </label>
      <label className="field">
        <span className="field-label">Service area</span>
        <input name="area" required placeholder="East Legon / Airport" />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add collector"}
      </button>
    </form>
  );
}
