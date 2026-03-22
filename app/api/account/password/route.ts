import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { getCustomerSession } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    currentPassword?: string;
    nextPassword?: string;
  };

  const currentPassword = String(body.currentPassword || "");
  const nextPassword = String(body.nextPassword || "");

  if (!currentPassword || !nextPassword) {
    return NextResponse.json(
      { error: "Current and new password are required." },
      { status: 400 }
    );
  }

  const customer = (await Customer.findById(session.id).lean()) as
    | Record<string, any>
    | null;

  if (!customer?.passwordHash) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  const matches = await bcrypt.compare(currentPassword, customer.passwordHash);
  if (!matches) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(nextPassword, 10);
  await Customer.updateOne({ _id: session.id }, { passwordHash });

  return NextResponse.json({ ok: true });
}
