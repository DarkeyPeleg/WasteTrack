import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export async function AppHeader() {
  const session = await getSession();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={session?.role === "ADMIN" ? "/admin" : session ? "/dashboard" : "/"} className="brand">
          WasteTrack <span>Ghana</span>
        </Link>
        <nav className="nav">
          {!session && (
            <>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/login">Log in</Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
          {session?.role === "RESIDENT" && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/requests">My requests</Link>
              <Link href="/requests/new">New request</Link>
              <LogoutButton />
            </>
          )}
          {session?.role === "ADMIN" && (
            <>
              <Link href="/admin">Admin</Link>
              <Link href="/admin/requests">All requests</Link>
              <LogoutButton />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
