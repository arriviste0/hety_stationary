"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminToastListener from "@/components/admin/AdminToastListener";
import type { Role } from "@/lib/rbac";

type AdminShellProps = {
  role: Role;
  name: string;
  email: string;
  logoutAction: () => Promise<void>;
  children: ReactNode;
};

export default function AdminShell({
  role,
  name,
  email,
  logoutAction,
  children
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminToastListener />
      <div className="flex">
        <AdminSidebar
          role={role}
          isMobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="flex min-h-screen flex-1 flex-col">
          <AdminTopbar
            role={role}
            name={name}
            email={email}
            onOpenMobile={() => setMobileOpen(true)}
            logoutAction={logoutAction}
          />
          <div className="px-6 pb-10 pt-6">
            <AdminBreadcrumbs />
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
