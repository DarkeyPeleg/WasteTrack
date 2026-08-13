import { prisma } from "@/lib/prisma";

export async function logActivity(input: {
  requestId: string;
  residentId: string;
  type: string;
  message: string;
}) {
  await prisma.activity.create({ data: input });
}
