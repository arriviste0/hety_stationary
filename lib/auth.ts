import { cookies } from "next/headers";
import type { Role } from "@/lib/rbac";
import { verifyAdminToken } from "@/lib/jwt";

export type AdminSession = {
  isAuthenticated: boolean;
  role: Role;
  name: string;
  email: string;
};

export const getAdminSession = async (): Promise<AdminSession> => {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const payload = await verifyAdminToken(token);

  if (!payload) {
    return {
      isAuthenticated: false,
      role: "inventory_manager",
      name: "",
      email: ""
    };
  }

  return {
    isAuthenticated: true,
    role: payload.role,
    name: payload.name,
    email: payload.email
  };
};
