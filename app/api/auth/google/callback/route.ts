import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { signCustomerToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

function buildCallbackUrl() {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;
}

function buildRedirect(path: string) {
  return new URL(path, process.env.APP_URL || "http://localhost:3000");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code") || "";
    const state = url.searchParams.get("state") || "";
    const savedState = cookies().get("google_oauth_state")?.value || "";

    cookies().delete("google_oauth_state");

    if (!code || !state || state !== savedState) {
      return NextResponse.redirect(buildRedirect("/create-account?auth_error=google_state"));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(buildRedirect("/create-account?auth_error=google_not_configured"));
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: buildCallbackUrl(),
        grant_type: "authorization_code"
      })
    });

    const tokenData = (await tokenResponse.json().catch(() => ({}))) as Record<string, any>;

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.redirect(buildRedirect("/create-account?auth_error=google_token"));
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${String(tokenData.access_token)}`
      },
      cache: "no-store"
    });

    const profile = (await profileResponse.json().catch(() => ({}))) as Record<string, any>;
    const email = String(profile.email || "").trim().toLowerCase();
    const name = String(profile.name || "").trim();
    const googleId = String(profile.id || "").trim();

    if (!profileResponse.ok || !email || !googleId) {
      return NextResponse.redirect(buildRedirect("/create-account?auth_error=google_profile"));
    }

    await connectToDatabase();

    let customer = (await Customer.findOne({ email })) as any;

    if (!customer) {
      customer = await Customer.create({
        name: name || email.split("@")[0],
        email,
        status: "Active",
        authProvider: "google",
        googleId,
        emailVerified: true
      });
    } else {
      customer.authProvider = customer.authProvider || "google";
      customer.googleId = googleId;
      customer.emailVerified = true;
      if (!customer.name && name) {
        customer.name = name;
      }
      await customer.save();
    }

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

    return NextResponse.redirect(buildRedirect("/account"));
  } catch {
    return NextResponse.redirect(buildRedirect("/create-account?auth_error=google_failed"));
  }
}
