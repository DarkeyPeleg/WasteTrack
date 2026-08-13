import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/edit-profile-form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true },
  });
  if (!user) redirect("/login");

  return (
    <section>
      <h1 className="page-title">Edit profile</h1>
      <p className="page-sub">Update your name, email, or password.</p>
      <EditProfileForm name={user.name} email={user.email} />
    </section>
  );
}
