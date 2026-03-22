"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CreateAccountView() {
  const router = useRouter();
  const { signup } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    const result = await signup({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Could not create account.");
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <section className="section-padding mx-auto py-12">
      <div className="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">
          Create Account
        </p>
        <h1 className="mt-2 text-3xl font-display text-slate-900">
          Join Hety Stationery
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Create an account to track orders, save addresses, and build your
          wishlist.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="input-base rounded-2xl px-4 py-3 text-sm"
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="input-base rounded-2xl px-4 py-3 text-sm"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="input-base rounded-2xl px-4 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="input-base rounded-2xl px-4 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
            }
            className="input-base rounded-2xl px-4 py-3 text-sm sm:col-span-2"
          />
        </div>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary mt-6 w-full px-6 py-3 text-sm font-semibold"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </div>
    </section>
  );
}
