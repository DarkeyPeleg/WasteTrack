import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ResidentDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RESIDENT") redirect("/admin");

  const requests = await prisma.collectionRequest.findMany({
    where: { residentId: session.id },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    active: requests.filter((r) => r.status === "ASSIGNED" || r.status === "IN_PROGRESS").length,
    collected: requests.filter((r) => r.status === "COLLECTED").length,
  };

  return (
    <div className="container">
    <section>
      <h1 className="page-title">Hello, {session.name}</h1>
      <p className="page-sub">Your waste-collection request history at a glance.</p>

      <div className="stats">
        <div className="stat">
          <span className="muted">Total</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="stat">
          <span className="muted">Pending</span>
          <strong>{counts.pending}</strong>
        </div>
        <div className="stat">
          <span className="muted">In motion</span>
          <strong>{counts.active}</strong>
        </div>
        <div className="stat">
          <span className="muted">Collected</span>
          <strong>{counts.collected}</strong>
        </div>
      </div>

      <div className="btn-row" style={{ marginBottom: "1rem" }}>
        <Link href="/requests/new" className="btn btn-primary">
          New request
        </Link>
        <Link href="/requests" className="btn btn-secondary">
          View all requests
        </Link>
      </div>

      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Recent requests</h2>
        {requests.length === 0 ? (
          <p className="empty">No requests yet. Submit your first collection request.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Preferred</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((request) => (
                  <tr key={request.id}>
                    <td>{request.address}</td>
                    <td>{request.wasteType}</td>
                    <td>{request.preferredDate.toISOString().slice(0, 10)}</td>
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
