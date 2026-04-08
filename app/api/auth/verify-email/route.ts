import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import {
  AUTH_COOKIE_OPTIONS,
  VERIFICATION_MAX_ATTEMPTS,
  consumeRateLimit,
  getRequestClientKey,
  hashVerificationCode
} from "@/lib/auth-security";
import { signCustomerToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientKey = getRequestClientKey(request);
    const ipLimit = consumeRateLimit(`verify:ip:${clientKey}`, 20, 15 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

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
    if (!customer || customer.emailVerified) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    const savedCodeHash = String(customer.emailVerification?.codeHash || "");
    const expiresAt = customer.emailVerification?.expiresAt
      ? new Date(customer.emailVerification.expiresAt)
      : null;
    const attempts = Number(customer.emailVerification?.attempts || 0);

    if (
      !savedCodeHash ||
      !expiresAt ||
      expiresAt.getTime() < Date.now() ||
      attempts >= VERIFICATION_MAX_ATTEMPTS
    ) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    const candidateHash = hashVerificationCode(email, code);

    if (savedCodeHash !== candidateHash) {
      customer.emailVerification = {
        ...customer.emailVerification?.toObject?.(),
        ...customer.emailVerification,
        attempts: attempts + 1,
        lastAttemptAt: new Date()
      };
      await customer.save();
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    customer.emailVerified = true;
    customer.emailVerification = undefined;
    await customer.save();

    const token = await signCustomerToken({
      id: String(customer._id),
      name: customer.name,
      email: customer.email
    });

    cookies().set("customer_token", token, AUTH_COOKIE_OPTIONS);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not verify email.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
