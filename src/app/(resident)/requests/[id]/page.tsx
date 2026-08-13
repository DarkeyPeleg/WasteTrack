import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CancelRequestButton } from "@/components/cancel-request-button";
import { CollectorCard } from "@/components/collector-card";
import { StatusBadge } from "@/components/status-badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ResidentRequestDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RESIDENT") redirect("/admin");

  const { id } = await params;
  const request = await prisma.collectionRequest.findUnique({
    where: { id },
    include: { collector: true },
  });

  if (!request || request.residentId !== session.id) notFound();

  return (
    <section>
      <p className="page-sub">
        <Link href="/requests" className="text-link">
          ← My requests
        </Link>
      </p>
      <h1 className="page-title">Collection request</h1>
      <p className="page-sub">
        <StatusBadge status={request.status} />
      </p>

      <div className="detail-grid">
        <div className="panel">
          <h2>Your request</h2>
          <dl className="detail-list">
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
          <h2>Collector assigned</h2>
          <CollectorCard collector={request.collector} />
        </div>
      </div>

      {request.status !== "COLLECTED" && request.status !== "CANCELLED" && (
        <div className="panel" style={{ marginTop: "1rem" }}>
          <h2>Cancel this request</h2>
          <p className="muted">Stop this collection if you no longer need it.</p>
          <div style={{ marginTop: "0.75rem" }}>
            <CancelRequestButton id={request.id} status={request.status} />
          </div>
        </div>
      )}
    </section>
  );
}
