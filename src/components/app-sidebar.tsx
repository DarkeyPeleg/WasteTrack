"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";

type NavItem = { href: string; label: string };

type Props = {
  role: "RESIDENT" | "ADMIN";
  userName: string;
  userEmail: string;
};

const residentNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/requests", label: "My requests" },
  { href: "/requests/new", label: "New request" },
  { href: "/profile", label: "Profile" },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/requests", label: "All requests" },
  { href: "/admin/collectors", label: "Collectors" },
  { href: "/profile", label: "Profile" },
];

export function AppSidebar({ role, userName, userEmail }: Props) {
  const pathname = usePathname();
  const items = role === "ADMIN" ? adminNav : residentNav;
  const home = role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-top">
        <Link href={home} className="brand">
          WasteTrack <span>Ghana</span>
        </Link>
        <p className="app-sidebar-role">{role === "ADMIN" ? "Administrator" : "Resident"}</p>
      </div>

      <nav className="app-sidebar-nav" aria-label="Dashboard">
        {items.map((item) => {
          const active =
            item.href === "/profile"
              ? pathname.startsWith("/profile")
              : item.href === "/admin/collectors"
                ? pathname.startsWith("/admin/collectors")
                : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "sidebar-link active" : "sidebar-link"}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="app-sidebar-footer">
        <Link href="/profile" className="app-sidebar-user">
          <strong>{userName}</strong>
          <span>{userEmail}</span>
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
