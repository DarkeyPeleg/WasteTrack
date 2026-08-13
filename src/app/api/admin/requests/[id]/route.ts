import { NextRequest, NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminUpdateSchema } from "@/lib/validations";
import { canTransition } from "@/lib/status";
import { logActivity } from "@/lib/activity";

type Params = { params: Promise<{ id: string }> };

const requestInclude = {
  resident: { select: { id: true, name: true, email: true } },
  collector: true,
} as const;

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  const auth = requireAdmin(session);
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const existing = await prisma.collectionRequest.findUnique({
    where: { id },
    include: requestInclude,
  });
  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }
  return NextResponse.json({ request: existing });
}

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

  const { collectorId, status } = parsed.data;

  if (collectorId) {
    if (existing.status !== "PENDING" && existing.status !== "ASSIGNED") {
      return NextResponse.json(
        { error: "Collector can only be set while pending or assigned" },
        { status: 400 },
      );
    }

    const collector = await prisma.collector.findFirst({
      where: { id: collectorId, active: true },
    });
    if (!collector) {
      return NextResponse.json({ error: "Collector not found" }, { status: 400 });
    }

    const updated = await prisma.collectionRequest.update({
      where: { id },
      data: {
        collectorId: collector.id,
        status: existing.status === "PENDING" ? "ASSIGNED" : existing.status,
      },
      include: requestInclude,
    });

    await logActivity({
      requestId: updated.id,
      residentId: updated.residentId,
      type: "ASSIGNED",
      message: `${collector.name} assigned to request — ${updated.address}`,
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
    if (status === "ASSIGNED" && !existing.collectorId) {
      return NextResponse.json(
        { error: "Assign a collector before setting status to Assigned" },
        { status: 400 },
      );
    }

    const updated = await prisma.collectionRequest.update({
      where: { id },
      data: { status },
      include: requestInclude,
    });

    const labels: Record<string, string> = {
      IN_PROGRESS: `Collection in progress — ${updated.address}`,
      COLLECTED: `Waste collected — ${updated.address}`,
      CANCELLED: `Request cancelled — ${updated.address}`,
      ASSIGNED: `Request assigned — ${updated.address}`,
    };

    if (status !== existing.status && labels[status]) {
      await logActivity({
        requestId: updated.id,
        residentId: updated.residentId,
        type: status,
        message: labels[status],
      });
    }

    return NextResponse.json({ request: updated });
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}
