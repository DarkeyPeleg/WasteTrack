import { redirect } from "next/navigation";
import { NewRequestForm } from "@/components/new-request-form";
import { getSession } from "@/lib/auth";

export default async function NewRequestPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RESIDENT") redirect("/admin");

  return (
    <div className="container">
      <section>
        <h1 className="page-title">New collection request</h1>
        <p className="page-sub">Tell collectors where to come, what to collect, and when you prefer.</p>
        <NewRequestForm />
      </section>
    </div>
  );
}
