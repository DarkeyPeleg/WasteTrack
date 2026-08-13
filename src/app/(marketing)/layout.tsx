import { AppHeader } from "@/components/app-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="marketing-main">{children}</div>
    </>
  );
}
