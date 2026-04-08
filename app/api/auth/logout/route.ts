import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_OPTIONS } from "@/lib/auth-security";

export const dynamic = "force-dynamic";

export async function POST() {
  cookies().set("customer_token", "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0
  });
  return NextResponse.json({ ok: true });
}
