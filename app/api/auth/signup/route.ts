import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { signCustomerToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await connectToDatabase();
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const password = String(body.password || "");

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 }
    );
  }

  const existing = await Customer.findOne({ email }).lean();
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await Customer.create({
    name,
    email,
    phone,
    passwordHash,
    status: "Active"
  });

  const token = await signCustomerToken({
    id: String(customer._id),
    name: customer.name,
    email: customer.email
  });

  cookies().set("customer_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  return NextResponse.json({ ok: true });
}
