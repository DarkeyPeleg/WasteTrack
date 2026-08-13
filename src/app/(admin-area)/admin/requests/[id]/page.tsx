import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminStatusActions } from "@/components/admin-status-actions";
import { AssignCollectorForm } from "@/components/assign-collector-form";
import { CollectorCard } from "@/components/collector-card";
import { StatusBadge } from "@/components/status-badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ action?: string }>;
};

export default async function AdminRequestDetailPage({ params, searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;
  const { action } = await searchParams;

  const request = await prisma.collectionRequest.findUnique({
    where: { id },
    include: {
      resident: { select: { name: true, email: true } },
      collector: true,
    },
  });

  if (!request) notFound();

  const collectors = await prisma.collector.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const showAssign =
    action === "assign" || request.status === "PENDING" || request.status === "ASSIGNED";

  return (
    <section>
      <p className="page-sub">
        <Link href="/admin/requests" className="text-link">
          ← All requests
        </Link>
      </p>
      <h1 className="page-title">Request details</h1>
      <p className="page-sub">
        <StatusBadge status={request.status} />
      </p>

      <div className="detail-grid">
        <div className="panel">
          <h2>Collection</h2>
          <dl className="detail-list">
            <div>
              <dt>Resident</dt>
              <dd>
                {request.resident.name}
                <div className="muted">{request.resident.email}</div>
              </dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{request.address}</dd>
            </div>
            <div>
              <dt>Waste type</dt>
              <dd>{request.wasteType}</dd>
            </div>
            <div>
              <dt>Preferred date</dt>
              <dd>{request.preferredDate.toISOString().slice(0, 10)}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{request.description}</dd>
            </div>
          </dl>
        </div>

        <div className="panel">
          <h2>Assigned collector</h2>
          <CollectorCard collector={request.collector} />
          {showAssign && request.status !== "COLLECTED" && request.status !== "CANCELLED" && (
            <>
              <h3 className="panel-subtitle">
                {request.collector ? "Change collector" : "Assign collector"}
              </h3>
              <AssignCollectorForm
                requestId={request.id}
                collectors={collectors}
                selectedId={request.collectorId}
              />
            </>
          )}
        </div>
      </div>

      <div className="panel" style={{ marginTop: "1rem" }}>
        <h2>Update status</h2>
        <AdminStatusActions requestId={request.id} status={request.status} />
      </div>
    </section>
  );
}
