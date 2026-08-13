import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { collectorSchema } from "@/lib/validations";

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

export async function POST(request: Request) {
  const session = await getSession();
  const auth = requireAdmin(session);
  if ("error" in auth && auth.error) return auth.error;

  const body = await request.json();
  const parsed = collectorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const collector = await prisma.collector.create({
    data: parsed.data,
  });

  return NextResponse.json({ collector }, { status: 201 });
}
