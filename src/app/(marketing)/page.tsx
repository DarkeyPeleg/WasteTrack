import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();
  if (session?.role === "ADMIN") redirect("/admin");
  if (session?.role === "RESIDENT") redirect("/dashboard");

  return (
    <div className="landing">
      <section className="landing-hero" aria-label="Introduction">
        <div
          className="landing-hero-media"
          style={{ backgroundImage: "url(/hero-collection.jpg)" }}
          role="img"
          aria-label="Waste collection truck on a residential street"
        />
        <div className="landing-hero-content container">
          <p className="landing-brand reveal">
            <Image src="/logo.png" alt="" width={48} height={48} className="brand-mark" />
            WasteTrack Ghana
          </p>
          <h1 className="reveal reveal-delay-1">Request collection. Track every job.</h1>
          <p className="landing-lead reveal reveal-delay-2">
            A simple online system for residents to submit household waste requests and for staff
            to assign collectors and update status.
          </p>
          <div className="landing-cta reveal reveal-delay-3">
            <Link href="/register" className="btn btn-primary">
              Get started
            </Link>
            <Link href="/login" className="btn btn-on-dark">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-section" id="how-it-works">
        <div className="container">
          <h2>How it works</h2>
          <p className="landing-section-lead">
            Three clear steps from request to completed collection.
          </p>
          <ol className="landing-steps">
            <li>
              <span className="step-num">1</span>
              <div>
                <h3>Submit a request</h3>
                <p>Residents enter address, waste type, preferred date, and a short description.</p>
              </div>
            </li>
            <li>
              <span className="step-num">2</span>
              <div>
                <h3>Staff assign a collector</h3>
                <p>Administrators review outstanding jobs and assign a collector to each pending request.</p>
              </div>
            </li>
            <li>
              <span className="step-num">3</span>
              <div>
                <h3>Track status online</h3>
                <p>
                  Status moves from Pending to Assigned, In Progress, then Collected — visible to
                  the resident without phone calls.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="landing-section landing-section-alt" id="for-whom">
        <div className="container">
          <h2>Built for both sides of collection</h2>
          <p className="landing-section-lead">
            One system, two roles — each with only the tools they need.
          </p>
          <div className="landing-split">
            <div>
              <h3>Residents</h3>
              <ul>
                <li>Register and log in securely</li>
                <li>Submit collection requests</li>
                <li>View request history and live status</li>
              </ul>
              <Link href="/register" className="text-link">
                Create a resident account →
              </Link>
            </div>
            <div>
              <h3>Administrators</h3>
              <ul>
                <li>See all outstanding requests</li>
                <li>Assign collectors and update status</li>
                <li>Filter by status and review workload stats</li>
              </ul>
              <Link href="/login" className="text-link">
                Staff log in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-closing">
        <div className="container landing-closing-inner">
          <h2>Ready to digitise collection requests?</h2>
          <p>Register as a resident or log in with your staff account to continue.</p>
          <div className="landing-cta">
            <Link href="/register" className="btn btn-primary">
              Register
            </Link>
            <Link href="/login" className="btn btn-secondary">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <p>WasteTrack Ghana — household waste request and tracking</p>
        </div>
      </footer>
    </div>
  );
}
