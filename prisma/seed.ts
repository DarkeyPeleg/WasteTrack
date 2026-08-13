import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@wastetrack.gh" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@wastetrack.gh",
      passwordHash,
      role: "ADMIN",
    },
  });

  const resident = await prisma.user.upsert({
    where: { email: "resident@wastetrack.gh" },
    update: {},
    create: {
      name: "Ama Mensah",
      email: "resident@wastetrack.gh",
      passwordHash,
      role: "RESIDENT",
    },
  });

  console.log("Seeded users:");
  console.log(`  Admin:    ${admin.email} / Password123!`);
  console.log(`  Resident: ${resident.email} / Password123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
