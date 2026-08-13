import { NextResponse } from "next/server";
import { getSession, hashPassword, requireUser, setAuthCookie, signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  const auth = requireUser(session);
  if ("error" in auth && auth.error) return auth.error;

  const user = await prisma.user.findUnique({
    where: { id: auth.session!.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  const auth = requireUser(session);
  if ("error" in auth && auth.error) return auth.error;

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;
  if (password && password.length > 0 && password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }
  const taken = await prisma.user.findFirst({
    where: { email, NOT: { id: auth.session!.id } },
  });
  if (taken) {
    return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
  }

  const user = await prisma.user.update({
    where: { id: auth.session!.id },
    data: {
      name,
      email,
      ...(password ? { passwordHash: await hashPassword(password) } : {}),
    },
  });

  const token = await signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role === "ADMIN" ? "ADMIN" : "RESIDENT",
  });

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  setAuthCookie(response, token);
  return response;
}
