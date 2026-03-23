"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Boxes,
  Building2,
  ChartBar,
  ClipboardList,
  FileBarChart2,
  FolderKanban,
  Layers,
  LayoutDashboard,
  RefreshCcw,
  Settings,
  ShoppingBag,
  Tags,
  Truck,
  Users,
  Warehouse
} from "lucide-react";
import type { Role } from "@/lib/rbac";
import { hasPermission } from "@/lib/rbac";

type NavItem = {
  label: string;
  href: string;
  icon: JSX.Element;
  permission: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboard size={18} />,
        permission: "dashboard"
      }
    ]
  },
  {
    title: "Catalog",
    items: [
      {
        label: "Products",
        href: "/admin/catalog/products",
        icon: <Boxes size={18} />,
        permission: "catalog"
      },
      {
        label: "Categories",
        href: "/admin/catalog/categories",
        icon: <FolderKanban size={18} />,
        permission: "catalog"
      },
      {
        label: "Brands",
        href: "/admin/catalog/brands",
        icon: <Tags size={18} />,
        permission: "catalog"
      }
    ]
  },
  {
    title: "Sales",
    items: [
      {
        label: "Orders",
        href: "/admin/orders",
        icon: <ShoppingBag size={18} />,
        permission: "orders"
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: <Users size={18} />,
        permission: "customers"
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        label: "Inventory",
        href: "/admin/inventory",
        icon: <Warehouse size={18} />,
        permission: "inventory"
      },
      {
        label: "Purchases",
        href: "/admin/purchases",
        icon: <Truck size={18} />,
        permission: "purchases"
      },
      {
        label: "Vendors",
        href: "/admin/vendors",
        icon: <Building2 size={18} />,
        permission: "vendors"
      }
    ]
  },
  {
    title: "Growth",
    items: [
      {
        label: "Promotions",
        href: "/admin/promotions",
        icon: <ClipboardList size={18} />,
        permission: "promotions"
      },
      {
        label: "Content",
        href: "/admin/content",
        icon: <Layers size={18} />,
        permission: "content"
      }
    ]
  },
  {
    title: "Insights",
    items: [
      {
        label: "Reports",
        href: "/admin/reports",
        icon: <ChartBar size={18} />,
        permission: "reports"
      },
      {
        label: "Marg Sync",
        href: "/admin/marg-sync",
        icon: <RefreshCcw size={18} />,
        permission: "marg-sync"
      }
    ]
  },
  {
    title: "Admin",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: <Settings size={18} />,
        permission: "settings"
      },
      {
        label: "Denied",
        href: "/admin/denied",
        icon: <FileBarChart2 size={18} />,
        permission: "dashboard"
      }
    ]
  }
];

type AdminSidebarProps = {
  role: Role;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function AdminSidebar({
  role,
  isMobileOpen,
  onCloseMobile
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Overview: true,
    Catalog: true,
    Sales: true,
    Growth: true
  });

  const sections = useMemo(
    () =>
      navSections.map((section) => ({
        ...section,
        items: section.items.filter((item) => hasPermission(role, item.permission))
      })),
    [role]
  );

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-[86vw] max-w-72 border-r border-slate-200 bg-white/95 backdrop-blur transition-transform duration-200 lg:static lg:w-72 lg:max-w-none lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-200 px-4 sm:px-5">
          <Link href="/admin" className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            HETY Admin
          </Link>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700 sm:text-xs">
            {role.replace(/_/g, " ")}
          </span>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 pb-6 pt-4 sm:px-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <button
                type="button"
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    [section.title]: !prev[section.title]
                  }))
                }
                className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                <span>{section.title}</span>
                <span>{openSections[section.title] ? "-" : "+"}</span>
              </button>
              {openSections[section.title] && (
                <ul className="mt-3 space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onCloseMobile}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? "bg-brand-600 text-white shadow-soft"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="text-base">{item.icon}</span>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
