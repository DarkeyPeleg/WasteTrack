import { NextResponse } from "next/server";
import { getSession, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRequestSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  const auth = requireUser(session);
  if ("error" in auth && auth.error) return auth.error;

  const requests = await prisma.collectionRequest.findMany({
    where: { residentId: auth.session!.id },
    include: { collector: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  const session = await getSession();
  const auth = requireUser(session);
  if ("error" in auth && auth.error) return auth.error;

  if (auth.session!.role !== "RESIDENT") {
    return NextResponse.json({ error: "Only residents can submit requests" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const created = await prisma.collectionRequest.create({
      data: {
        residentId: auth.session!.id,
        address: parsed.data.address,
        wasteType: parsed.data.wasteType,
        preferredDate: new Date(parsed.data.preferredDate),
        description: parsed.data.description,
        status: "PENDING",
      },
    });

    return NextResponse.json({ request: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create request" }, { status: 500 });
  }
}
