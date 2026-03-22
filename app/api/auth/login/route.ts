import bcrypt from "bcryptjs";
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
      password?: string;
    };

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const customer = (await Customer.findOne({ email }).lean()) as
      | {
          _id: { toString(): string };
          name: string;
          email: string;
          passwordHash?: string;
          status?: string;
        }
      | null;

    if (!customer || !customer.passwordHash || customer.status !== "Active") {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const matches = await bcrypt.compare(password, customer.passwordHash);
    if (!matches) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await signCustomerToken({
      id: customer._id.toString(),
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
    const message = error instanceof Error ? error.message : "Could not sign in.";

    return NextResponse.json(
      { error: message || "Could not sign in." },
      { status: 500 }
    );
  }
}
