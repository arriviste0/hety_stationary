import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import {
  VERIFICATION_CODE_TTL_MS,
  VERIFICATION_RESEND_COOLDOWN_MS,
  consumeRateLimit,
  getRequestClientKey,
  hashVerificationCode
} from "@/lib/auth-security";
import { sendEmailVerification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  try {
    const clientKey = getRequestClientKey(request);
    const ipLimit = consumeRateLimit(`resend:ip:${clientKey}`, 10, 15 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json({ ok: true });
    }

    await connectToDatabase();
    const body = (await request.json()) as {
      email?: string;
    };

    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const customer = (await Customer.findOne({ email })) as any;

    if (!customer || customer.emailVerified) {
      return NextResponse.json({ ok: true });
    }

    const sentAt = customer.emailVerification?.sentAt
      ? new Date(customer.emailVerification.sentAt).getTime()
      : 0;
    if (sentAt && Date.now() - sentAt < VERIFICATION_RESEND_COOLDOWN_MS) {
      return NextResponse.json({ ok: true });
    }

    const code = generateVerificationCode();
    customer.emailVerification = {
      codeHash: hashVerificationCode(email, code),
      expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
      sentAt: new Date(),
      attempts: 0
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
