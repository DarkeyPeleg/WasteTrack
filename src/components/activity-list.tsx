import Link from "next/link";

export type ActivityItem = {
  id: string;
  type: string;
  message: string;
  createdAt: Date;
  href?: string;
};

function formatWhen(date: Date) {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityList({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="empty">No recent activity yet.</p>;
  }

  return (
    <ol className="activity-list">
      {items.map((item) => (
        <li key={item.id} className={`activity-item activity-${item.type.toLowerCase()}`}>
          <span className="activity-dot" aria-hidden="true" />
          <div>
            {item.href ? (
              <Link href={item.href} className="activity-message">
                {item.message}
              </Link>
            ) : (
              <p className="activity-message">{item.message}</p>
            )}
            <p className="activity-time">{formatWhen(item.createdAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
