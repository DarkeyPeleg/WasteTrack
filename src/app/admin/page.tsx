import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  const grouped = await prisma.collectionRequest.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts = {
    PENDING: 0,
    ASSIGNED: 0,
    IN_PROGRESS: 0,
    COLLECTED: 0,
    CANCELLED: 0,
    total: 0,
  };
  for (const row of grouped) {
    if (row.status in counts) {
      counts[row.status as keyof typeof counts] = row._count._all;
    }
    counts.total += row._count._all;
  }

  const recent = await prisma.collectionRequest.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { resident: { select: { name: true, email: true } } },
  });

  return (
    <div className="container">
    <section>
      <h1 className="page-title">Admin dashboard</h1>
      <p className="page-sub">Outstanding, assigned, and completed collection jobs.</p>

      <div className="stats">
        <div className="stat">
          <span className="muted">Total</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="stat">
          <span className="muted">Pending</span>
          <strong>{counts.PENDING}</strong>
        </div>
        <div className="stat">
          <span className="muted">Assigned</span>
          <strong>{counts.ASSIGNED}</strong>
        </div>
        <div className="stat">
          <span className="muted">In progress</span>
          <strong>{counts.IN_PROGRESS}</strong>
        </div>
        <div className="stat">
          <span className="muted">Collected</span>
          <strong>{counts.COLLECTED}</strong>
        </div>
        <div className="stat">
          <span className="muted">Cancelled</span>
          <strong>{counts.CANCELLED}</strong>
        </div>
      </div>

      <div className="btn-row" style={{ marginBottom: "1rem" }}>
        <Link href="/admin/requests" className="btn btn-primary">
          Manage all requests
        </Link>
        <Link href="/admin/requests?status=PENDING" className="btn btn-secondary">
          View pending
        </Link>
      </div>

      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Latest requests</h2>
        {recent.length === 0 ? (
          <p className="empty">No collection requests yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Resident</th>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((request) => (
                  <tr key={request.id}>
                    <td>
                      {request.resident.name}
                      <div className="muted">{request.resident.email}</div>
                    </td>
                    <td>{request.address}</td>
                    <td>{request.wasteType}</td>
                    <td>
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}
