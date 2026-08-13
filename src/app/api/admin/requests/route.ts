import { NextRequest, NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isRequestStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const auth = requireAdmin(session);
  if ("error" in auth && auth.error) return auth.error;

  const status = request.nextUrl.searchParams.get("status");
  const where =
    status && status !== "ALL" && isRequestStatus(status)
      ? { status }
      : {};

  const requests = await prisma.collectionRequest.findMany({
    where,
    include: {
      resident: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}
