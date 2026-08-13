import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, role: true },
  });
  if (!user) redirect("/login");

  return (
    <section>
      <h1 className="page-title">Profile</h1>
      <p className="page-sub">Your account details.</p>

      <div className="panel" style={{ maxWidth: 480 }}>
        <dl className="detail-list">
          <div>
            <dt>Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{user.role === "ADMIN" ? "Administrator" : "Resident"}</dd>
          </div>
        </dl>
        <div className="btn-row" style={{ marginTop: "1.25rem" }}>
          <Link href="/profile/edit" className="btn btn-primary">
            Edit profile
          </Link>
        </div>
      </div>
    </section>
  );
}
