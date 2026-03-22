import { cookies } from "next/headers";
import { verifyCustomerToken } from "@/lib/jwt";

export type CustomerSession = {
  isAuthenticated: boolean;
  id: string;
  name: string;
  email: string;
};

export async function getCustomerSession(): Promise<CustomerSession> {
  const token = cookies().get("customer_token")?.value;
  const payload = await verifyCustomerToken(token);

  if (!payload) {
    return {
      isAuthenticated: false,
      id: "",
      name: "",
      email: ""
    };
  }

  return {
    isAuthenticated: true,
    id: payload.id,
    name: payload.name,
    email: payload.email
  };
}
