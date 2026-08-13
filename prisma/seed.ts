import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const collectors = [
  { name: "Kwame Boateng", phone: "024 411 2201", area: "East Legon / Airport" },
  { name: "Abena Owusu", phone: "020 778 3344", area: "Madina / Adenta" },
  { name: "Yaw Mensah", phone: "027 556 9012", area: "Osu / Labone" },
  { name: "Akua Darko", phone: "055 102 4488", area: "Tema / Spintex" },
];

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

  for (const collector of collectors) {
    const existing = await prisma.collector.findFirst({
      where: { name: collector.name, phone: collector.phone },
    });
    if (!existing) {
      await prisma.collector.create({ data: collector });
    }
  }

  console.log("Seeded users:");
  console.log(`  Admin:    ${admin.email} / Password123!`);
  console.log(`  Resident: ${resident.email} / Password123!`);
  console.log(`Seeded ${collectors.length} collectors.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
