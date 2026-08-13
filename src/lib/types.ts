export const ROLES = ["RESIDENT", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const REQUEST_STATUSES = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "COLLECTED",
  "CANCELLED",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function isRequestStatus(value: string): value is RequestStatus {
  return (REQUEST_STATUSES as readonly string[]).includes(value);
}
