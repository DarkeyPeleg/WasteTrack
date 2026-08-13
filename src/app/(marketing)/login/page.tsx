import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";

export default function LoginPage() {
  return (
    <div className="auth-simple">
      <div className="auth-simple-card">
        <BrandLogo href="/" />
        <h1>Log in</h1>
        <p className="auth-simple-sub">
          Residents and administrators use the same login.
        </p>

        <div className="demo-creds" aria-label="Demo login credentials">
          <p>
            <strong>Admin:</strong> admin@wastetrack.gh · Password123!
          </p>
          <p>
            <strong>Resident:</strong> resident@wastetrack.gh · Password123!
          </p>
        </div>

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
