import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  const auth = requireAdmin(session);
  if ("error" in auth && auth.error) return auth.error;

  const grouped = await prisma.collectionRequest.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts = {
    PENDING: 0,
    ASSIGNED: 0,
    IN_PROGRESS: 0,
    COLLECTED: 0,
    CANCELLED: 0,
    total: 0,
  };

  for (const row of grouped) {
    if (row.status in counts) {
      counts[row.status as keyof typeof counts] = row._count._all;
    }
    counts.total += row._count._all;
  }

  return NextResponse.json({ counts });
}
