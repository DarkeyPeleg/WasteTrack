import { redirect } from "next/navigation";
import { AddCollectorForm } from "@/components/add-collector-form";
import { Pagination } from "@/components/pagination";
import { getSession } from "@/lib/auth";
import { PAGE_SIZE, paginationSkip, parsePage, totalPages } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminCollectorsPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  const params = await searchParams;
  const total = await prisma.collector.count();
  const pages = totalPages(total);
  const page = Math.min(parsePage(params.page), pages);

  const collectors = await prisma.collector.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { requests: true } } },
    skip: paginationSkip(page),
    take: PAGE_SIZE,
  });

  return (
    <section>
      <h1 className="page-title">Collectors</h1>
      <p className="page-sub">People who can be assigned to collection requests.</p>

      <div className="dashboard-split">
        <div className="panel">
          <h2>All collectors</h2>
          {total === 0 ? (
            <p className="empty">No collectors yet. Add one using the form.</p>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Area</th>
                      <th>Jobs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectors.map((collector) => (
                      <tr key={collector.id}>
                        <td>{collector.name}</td>
                        <td>{collector.phone}</td>
                        <td>{collector.area}</td>
                        <td>{collector._count.requests}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                totalPages={pages}
                total={total}
                hrefFor={(nextPage) =>
                  nextPage === 1 ? "/admin/collectors" : `/admin/collectors?page=${nextPage}`
                }
              />
            </>
          )}
        </div>

        <div>
          <h2 className="page-title" style={{ fontSize: "1.2rem" }}>
            Add collector
          </h2>
          <AddCollectorForm />
        </div>
      </div>
    </section>
  );
}
