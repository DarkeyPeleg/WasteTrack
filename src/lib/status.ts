import type { RequestStatus } from "@/lib/types";

const allowed: Record<RequestStatus, RequestStatus[]> = {
  PENDING: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COLLECTED", "CANCELLED"],
  COLLECTED: [],
  CANCELLED: [],
};

export function canTransition(from: string, to: string) {
  if (!(from in allowed)) return false;
  return allowed[from as RequestStatus].includes(to as RequestStatus);
}

export function statusLabel(status: RequestStatus | string) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "ASSIGNED":
      return "Assigned";
    case "IN_PROGRESS":
      return "In Progress";
    case "COLLECTED":
      return "Collected";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export function statusClass(status: RequestStatus | string) {
  switch (status) {
    case "PENDING":
      return "badge badge-pending";
    case "ASSIGNED":
      return "badge badge-assigned";
    case "IN_PROGRESS":
      return "badge badge-progress";
    case "COLLECTED":
      return "badge badge-collected";
    case "CANCELLED":
      return "badge badge-cancelled";
    default:
      return "badge badge-pending";
  }
}
