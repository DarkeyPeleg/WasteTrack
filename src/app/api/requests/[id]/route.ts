import { NextResponse } from "next/server";
import { getSession, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
