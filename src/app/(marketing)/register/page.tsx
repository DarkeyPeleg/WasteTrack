import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";

export default function RegisterPage() {
  return (
    <div className="auth-simple">
      <div className="auth-simple-card">
        <BrandLogo href="/" />
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
