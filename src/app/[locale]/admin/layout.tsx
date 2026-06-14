"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.endsWith("/admin/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-film-dark">
      <AdminSidebar />
      <div className="ml-[220px] flex min-h-screen flex-col">
        <AdminTopBar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
