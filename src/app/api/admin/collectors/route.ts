import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  const auth = requireAdmin(session);
  if ("error" in auth && auth.error) return auth.error;

  const collectors = await prisma.collector.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ collectors });
}
