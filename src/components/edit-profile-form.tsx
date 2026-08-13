"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  name: string;
  email: string;
};

export function EditProfileForm({ name, email }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const payload: { name: string; email: string; password?: string } = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
    };
    if (password) payload.password = password;

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not update profile");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <form className="auth-form form-card" onSubmit={onSubmit}>
      <label className="field">
        <span className="field-label">Full name</span>
        <input name="name" type="text" required defaultValue={name} autoComplete="name" />
      </label>
      <label className="field">
        <span className="field-label">Email</span>
        <input name="email" type="email" required defaultValue={email} autoComplete="email" />
      </label>
      <label className="field">
        <span className="field-label">New password</span>
        <input
          name="password"
          type="password"
          minLength={6}
          autoComplete="new-password"
          placeholder="Leave blank to keep current password"
        />
        <span className="field-hint">Optional. Minimum 6 characters if you change it.</span>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="btn-row">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </button>
        <Link href="/profile" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
