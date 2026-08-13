import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="auth-simple">
      <div className="auth-simple-card">
        <Link href="/" className="auth-simple-brand">
          WasteTrack <span>Ghana</span>
        </Link>
        <h1>Log in</h1>
        <p className="auth-simple-sub">
          Residents and administrators use the same login.
        </p>
        <AuthForm mode="login" />
        <p className="auth-switch">
          New resident?{" "}
          <Link href="/register" className="text-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
