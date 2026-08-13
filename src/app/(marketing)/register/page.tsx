import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <div className="auth-simple">
      <div className="auth-simple-card">
        <Link href="/" className="auth-simple-brand">
          WasteTrack <span>Ghana</span>
        </Link>
        <h1>Create account</h1>
        <p className="auth-simple-sub">
          Register as a resident to submit and track collection requests.
        </p>
        <AuthForm mode="register" />
        <p className="auth-switch">
          Already registered?{" "}
          <Link href="/login" className="text-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
