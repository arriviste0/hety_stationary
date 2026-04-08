import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import {
  AUTH_COOKIE_OPTIONS,
  VERIFICATION_CODE_TTL_MS,
  consumeRateLimit,
  getRequestClientKey,
  hashVerificationCode
} from "@/lib/auth-security";
import { sendEmailVerification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientKey = getRequestClientKey(request);
    const ipLimit = consumeRateLimit(`signup:ip:${clientKey}`, 10, 15 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

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

    const emailLimit = consumeRateLimit(`signup:email:${email}`, 3, 15 * 60 * 1000);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const existing = (await Customer.findOne({ email })) as any;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = hashVerificationCode(email, code);

    if (existing?.emailVerified) {
      cookies().delete("customer_token");
      return NextResponse.json({
        ok: true,
        requiresVerification: true,
        email
      });
    }

    if (existing && !existing.emailVerified) {
      existing.name = name || existing.name;
      existing.phone = phone || existing.phone;
      if (!existing.passwordHash) {
        existing.passwordHash = await bcrypt.hash(password, 10);
      }
      existing.authProvider = "password";
      existing.emailVerification = {
        codeHash,
        expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
        sentAt: new Date(),
        attempts: 0
      };
      await existing.save();
    } else {
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
          codeHash,
          expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
          sentAt: new Date(),
          attempts: 0
        }
      });
    }

    await sendEmailVerification({
      customerName: name,
      customerEmail: email,
      code
    });

    cookies().set("customer_token", "", {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0
    });

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
