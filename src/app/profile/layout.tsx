import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { getSession } from "@/lib/auth";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="app-shell">
      <AppSidebar
        role={session.role}
        userName={session.name}
        userEmail={session.email}
      />
      <div className="app-shell-main">
        <div className="app-shell-content">{children}</div>
      </div>
    </div>
  );
}
