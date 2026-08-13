import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function RequestsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RESIDENT") redirect("/admin");

  const requests = await prisma.collectionRequest.findMany({
    where: { residentId: session.id },
    include: { collector: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section>
      <h1 className="page-title">My requests</h1>
      <p className="page-sub">Track the status of every collection request you have submitted.</p>
      <div className="btn-row" style={{ marginBottom: "1rem" }}>
        <Link href="/requests/new" className="btn btn-primary">
          New request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="panel empty">You have not submitted any requests yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Waste type</th>
                <th>Preferred date</th>
                <th>Collector</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.address}</td>
                  <td>{request.wasteType}</td>
                  <td>{request.preferredDate.toISOString().slice(0, 10)}</td>
                  <td>
                    {request.collector ? (
                      <>
                        <div>{request.collector.name}</div>
                        <div className="muted">{request.collector.phone}</div>
                      </>
                    ) : (
                      <span className="muted">Not assigned</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td>
                    <Link href={`/requests/${request.id}`} className="btn btn-secondary btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
