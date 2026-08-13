import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminRequestActions } from "@/components/admin-request-actions";
import { StatusBadge } from "@/components/status-badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isRequestStatus } from "@/lib/types";

const filters: Array<{ label: string; value: string }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Collected", value: "COLLECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminRequestsPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  const params = await searchParams;
  const status = params.status ?? "ALL";
  const where =
    status !== "ALL" && isRequestStatus(status)
      ? { status }
      : {};

  const requests = await prisma.collectionRequest.findMany({
    where,
    include: {
      resident: { select: { name: true, email: true } },
      collector: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section>
      <h1 className="page-title">All collection requests</h1>
      <p className="page-sub">Assign collectors and progress each job through its lifecycle.</p>

      <div className="filter-bar">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "ALL" ? "/admin/requests" : `/admin/requests?status=${filter.value}`}
            className={status === filter.value ? "active" : undefined}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="panel empty">No requests match this filter.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Resident</th>
                <th>Address</th>
                <th>Collector</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    {request.resident.name}
                    <div className="muted">{request.resident.email}</div>
                  </td>
                  <td>
                    <div>{request.address}</div>
                    <div className="muted">
                      {request.wasteType} · {request.preferredDate.toISOString().slice(0, 10)}
                    </div>
                  </td>
                  <td>
                    {request.collector ? (
                      <>
                        <div>{request.collector.name}</div>
                        <div className="muted">{request.collector.phone}</div>
                      </>
                    ) : (
                      <span className="muted">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td>
                    <AdminRequestActions id={request.id} status={request.status} />
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
