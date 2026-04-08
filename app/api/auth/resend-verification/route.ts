import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { sendEmailVerification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = (await request.json()) as {
      email?: string;
    };

    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const customer = (await Customer.findOne({ email })) as any;

    if (!customer) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    if (customer.emailVerified) {
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    const code = generateVerificationCode();
    customer.emailVerification = {
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      sentAt: new Date()
    };
    await customer.save();

    await sendEmailVerification({
      customerName: customer.name || "Customer",
      customerEmail: customer.email,
      code
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not resend verification code.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
