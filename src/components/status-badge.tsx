import type { RequestStatus } from "@/lib/types";
import { isRequestStatus } from "@/lib/types";
import { statusClass, statusLabel } from "@/lib/status";

export function StatusBadge({ status }: { status: string }) {
  const value: RequestStatus = isRequestStatus(status) ? status : "PENDING";
  return <span className={statusClass(value)}>{statusLabel(value)}</span>;
}
