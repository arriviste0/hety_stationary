import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  async function logoutAction() {
    "use server";
    const cookieStore = cookies();
    cookieStore.set("admin_token", "", { maxAge: 0, path: "/" });
    redirect("/admin/login");
  }

  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      role={session.role}
      name={session.name}
      email={session.email}
      logoutAction={logoutAction}
    >
      {children}
    </AdminShell>
  );
}
