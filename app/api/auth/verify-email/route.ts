import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { signCustomerToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = (await request.json()) as {
      email?: string;
      code?: string;
    };

    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const customer = (await Customer.findOne({ email })) as any;

    if (!customer) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    if (customer.emailVerified) {
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    const savedCode = String(customer.emailVerification?.code || "");
    const expiresAt = customer.emailVerification?.expiresAt
      ? new Date(customer.emailVerification.expiresAt)
      : null;

    if (!savedCode || !expiresAt || expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Verification code expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (savedCode !== code) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    customer.emailVerified = true;
    customer.emailVerification = undefined;
    await customer.save();

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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not verify email.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
