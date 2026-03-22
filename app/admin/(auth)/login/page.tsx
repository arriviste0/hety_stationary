import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminUser } from "@/lib/models/adminUser";
import { signAdminToken } from "@/lib/jwt";

export default function AdminLoginPage({
  searchParams
}: {
  searchParams: { next?: string };
}) {
  async function loginAction(formData: FormData) {
    "use server";

    await connectToDatabase();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    const user = (await AdminUser.findOne({ email }).lean()) as
      | {
          _id: { toString(): string };
          name: string;
          email: string;
          role: "super_admin" | "product_manager" | "order_manager" | "inventory_manager";
          status: string;
          passwordHash: string;
        }
      | null;
    if (!user || user.status !== "Active") {
      redirect("/admin/login?error=Invalid%20credentials");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      redirect("/admin/login?error=Invalid%20credentials");
    }

    const token = await signAdminToken({
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email
    });

    cookies().set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    redirect(searchParams?.next || "/admin");
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          HETY STATIONERY Admin
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Sign in to your panel
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Demo login: admin@hetystationery.com / admin123
        </p>
      </div>
      <form action={loginAction} className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue="admin@hetystationery.com"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Password
          </label>
          <input
            name="password"
            type="password"
            defaultValue="admin123"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
        >
          Enter Admin Panel
        </button>
      </form>
    </div>
  );
}
