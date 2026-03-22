"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  admin: "Dashboard",
  catalog: "Catalog",
  products: "Products",
  categories: "Categories",
  brands: "Brands",
  orders: "Orders",
  customers: "Customers",
  inventory: "Inventory",
  purchases: "Purchases",
  promotions: "Promotions",
  content: "Content",
  reports: "Reports",
  settings: "Settings",
  "marg-sync": "Marg Sync",
  new: "New",
  edit: "Edit",
  denied: "Access Denied"
};

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: labelMap[segment] || segment,
      href
    };
  });

  return (
    <nav className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-300">/</span>}
            {index === crumbs.length - 1 ? (
              <span className="font-semibold text-slate-700">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-slate-700">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
