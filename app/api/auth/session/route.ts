import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { getCustomerSession } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({
      isAuthenticated: false,
      customer: null
    });
  }

  const customer = (await Customer.findById(session.id).lean()) as Record<string, any> | null;

  if (!customer || customer.status !== "Active") {
    return NextResponse.json({
      isAuthenticated: false,
      customer: null
    });
  }

  return NextResponse.json({
    isAuthenticated: true,
    customer: {
      id: String(customer._id),
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      wishlist: Array.isArray(customer.wishlist)
        ? customer.wishlist.map((item: unknown) => String(item || "")).filter(Boolean)
        : []
    }
  });
}
