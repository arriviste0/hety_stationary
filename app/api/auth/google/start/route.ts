import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_OPTIONS } from "@/lib/auth-security";

export const dynamic = "force-dynamic";

function buildCallbackUrl() {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;
}

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/create-account?auth_error=google_not_configured", process.env.APP_URL || "http://localhost:3000")
    );
  }

  const state = crypto.randomBytes(24).toString("hex");
  cookies().set("google_oauth_state", state, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 60 * 10
  });

  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleUrl.searchParams.set("client_id", clientId);
  googleUrl.searchParams.set("redirect_uri", buildCallbackUrl());
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("state", state);
  googleUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(googleUrl);
}
