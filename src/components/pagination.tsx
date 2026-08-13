import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  hrefFor: (page: number) => string;
};

export function Pagination({ page, totalPages, total, hrefFor }: Props) {
  if (total === 0) return null;

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="muted">
        Page {page} of {totalPages} · {total} {total === 1 ? "item" : "items"}
      </p>
      <div className="btn-row">
        {page > 1 ? (
          <Link href={hrefFor(prev)} className="btn btn-secondary btn-sm">
            Previous
          </Link>
        ) : (
          <span className="btn btn-secondary btn-sm" aria-disabled="true">
            Previous
          </span>
        )}
        {page < totalPages ? (
          <Link href={hrefFor(next)} className="btn btn-secondary btn-sm">
            Next
          </Link>
        ) : (
          <span className="btn btn-secondary btn-sm" aria-disabled="true">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
