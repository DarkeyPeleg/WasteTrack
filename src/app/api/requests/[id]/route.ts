import { NextResponse } from "next/server";
import { getSession, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canTransition } from "@/lib/status";
import { logActivity } from "@/lib/activity";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  const auth = requireUser(session);
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const existing = await prisma.collectionRequest.findUnique({
    where: { id },
    include: { collector: true },
  });

  if (!existing || existing.residentId !== auth.session!.id) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json({ request: existing });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  const auth = requireUser(session);
  if ("error" in auth && auth.error) return auth.error;

  if (auth.session!.role !== "RESIDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.collectionRequest.findUnique({ where: { id } });
  if (!existing || existing.residentId !== auth.session!.id) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const body = await request.json();
  if (body?.status !== "CANCELLED") {
    return NextResponse.json({ error: "Residents can only cancel a request" }, { status: 400 });
  }

  if (!canTransition(existing.status, "CANCELLED")) {
    return NextResponse.json(
      { error: "This request can no longer be cancelled" },
      { status: 400 },
    );
  }

  const updated = await prisma.collectionRequest.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: { collector: true },
  });

  await logActivity({
    requestId: updated.id,
    residentId: updated.residentId,
    type: "CANCELLED",
    message: `Request cancelled — ${updated.address}`,
  });

  return NextResponse.json({ request: updated });
}
