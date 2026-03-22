export type Role =
  | "super_admin"
  | "product_manager"
  | "order_manager"
  | "inventory_manager";

export const rolePermissions: Record<Role, string[]> = {
  super_admin: [
    "dashboard",
    "catalog",
    "orders",
    "customers",
    "inventory",
    "purchases",
    "vendors",
    "promotions",
    "content",
    "reports",
    "settings",
    "marg-sync"
  ],
  product_manager: [
    "dashboard",
    "catalog",
    "inventory",
    "purchases",
    "promotions",
    "vendors"
  ],
  order_manager: ["dashboard", "orders", "customers", "reports"],
  inventory_manager: ["dashboard", "inventory", "purchases", "vendors", "reports"]
};

export const routePermissions: Array<{
  prefix: string;
  roles: Role[];
}> = [
  {
    prefix: "/admin",
    roles: ["super_admin", "product_manager", "order_manager", "inventory_manager"]
  },
  { prefix: "/admin/catalog", roles: ["super_admin", "product_manager"] },
  { prefix: "/admin/orders", roles: ["super_admin", "order_manager"] },
  { prefix: "/admin/customers", roles: ["super_admin", "order_manager"] },
  {
    prefix: "/admin/inventory",
    roles: ["super_admin", "product_manager", "inventory_manager"]
  },
  { prefix: "/admin/purchases", roles: ["super_admin", "product_manager", "inventory_manager"] },
  { prefix: "/admin/vendors", roles: ["super_admin", "product_manager", "inventory_manager"] },
  { prefix: "/admin/promotions", roles: ["super_admin", "product_manager"] },
  { prefix: "/admin/content", roles: ["super_admin"] },
  {
    prefix: "/admin/reports",
    roles: ["super_admin", "order_manager", "inventory_manager"]
  },
  { prefix: "/admin/settings", roles: ["super_admin"] },
  { prefix: "/admin/marg-sync", roles: ["super_admin"] },
  {
    prefix: "/admin/denied",
    roles: ["super_admin", "product_manager", "order_manager", "inventory_manager"]
  }
];

export const hasPermission = (role: Role, permission: string) =>
  rolePermissions[role]?.includes(permission);

export const isRouteAllowed = (role: Role, pathname: string) => {
  const rule = routePermissions.find((entry) => pathname.startsWith(entry.prefix));
  if (!rule) {
    return false;
  }
  return rule.roles.includes(role);
};
