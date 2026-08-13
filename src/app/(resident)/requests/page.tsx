import Link from "next/link";
import { redirect } from "next/navigation";
import { CancelRequestButton } from "@/components/cancel-request-button";
import { Pagination } from "@/components/pagination";
import { StatusBadge } from "@/components/status-badge";
import { getSession } from "@/lib/auth";
import { PAGE_SIZE, paginationSkip, parsePage, totalPages } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function RequestsPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RESIDENT") redirect("/admin");

  const params = await searchParams;
  const requestedPage = parsePage(params.page);
  const where = { residentId: session.id };
  const total = await prisma.collectionRequest.count({ where });
  const pages = totalPages(total);
  const page = Math.min(requestedPage, pages);

  const requests = await prisma.collectionRequest.findMany({
    where,
    include: { collector: true },
    orderBy: { createdAt: "desc" },
    skip: paginationSkip(page),
    take: PAGE_SIZE,
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

      {total === 0 ? (
        <div className="panel empty">You have not submitted any requests yet.</div>
      ) : (
        <>
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
                      <div className="btn-row">
                        <Link href={`/requests/${request.id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                        <CancelRequestButton id={request.id} status={request.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={pages}
            total={total}
            hrefFor={(nextPage) => (nextPage === 1 ? "/requests" : `/requests?page=${nextPage}`)}
          />
        </>
      )}
    </section>
  );
}
