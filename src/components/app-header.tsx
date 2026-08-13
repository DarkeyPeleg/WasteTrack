import Link from "next/link";

export async function AppHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          WasteTrack <span>Ghana</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#how-it-works" className="nav-link-away">
            How it works
          </Link>
          <div className="nav-auth">
            <Link href="/login">Log in</Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
