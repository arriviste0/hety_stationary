import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { sendEmailVerification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
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

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
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

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const passwordHash = await bcrypt.hash(password, 10);
    await Customer.create({
      name,
      email,
      phone,
      passwordHash,
      authProvider: "password",
      emailVerified: false,
      status: "Active",
      emailVerification: {
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        sentAt: new Date()
      }
    });

    await sendEmailVerification({
      customerName: name,
      customerEmail: email,
      code
    });

    cookies().delete("customer_token");

    return NextResponse.json({
      ok: true,
      requiresVerification: true,
      email
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create account.";

    return NextResponse.json(
      { error: message || "Could not create account." },
      { status: 500 }
    );
  }
}
