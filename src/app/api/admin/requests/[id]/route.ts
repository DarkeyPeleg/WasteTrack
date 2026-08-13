import { NextRequest, NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminUpdateSchema } from "@/lib/validations";
import { canTransition } from "@/lib/status";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  const auth = requireAdmin(session);
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const existing = await prisma.collectionRequest.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = adminUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { collectorName, status } = parsed.data;

  if (collectorName) {
    if (existing.status !== "PENDING" && existing.status !== "ASSIGNED") {
      return NextResponse.json(
        { error: "Collector can only be set while pending or assigned" },
        { status: 400 },
      );
    }

    const updated = await prisma.collectionRequest.update({
      where: { id },
      data: {
        collectorName,
        status: existing.status === "PENDING" ? "ASSIGNED" : existing.status,
      },
      include: { resident: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ request: updated });
  }

  if (status) {
    if (status !== existing.status && !canTransition(existing.status, status)) {
      return NextResponse.json(
        { error: `Cannot change status from ${existing.status} to ${status}` },
        { status: 400 },
      );
    }
    if (status === "ASSIGNED" && !existing.collectorName) {
      return NextResponse.json(
        { error: "Assign a collector before setting status to Assigned" },
        { status: 400 },
      );
    }

    const updated = await prisma.collectionRequest.update({
      where: { id },
      data: { status },
      include: { resident: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ request: updated });
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}
