"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [message, setMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
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

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setMessage("");
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

    if (result.requiresVerification) {
      setPendingEmail(result.email || form.email);
      setNeedsVerification(true);
      setMessage("Verification code sent. Check your email to activate the account.");
      return;
    }

    router.push("/account");
    router.refresh();
  };

  const verifyEmail = async () => {
    if (!pendingEmail || !verificationCode) {
      setError("Enter the verification code sent to your email.");
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);
    const response = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingEmail, code: verificationCode })
    });
    const data = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error || "Could not verify email.");
      return;
    }

    router.push("/account");
    router.refresh();
  };

  const resendCode = async () => {
    if (!pendingEmail) return;
    setError("");
    setMessage("");
    setIsSubmitting(true);
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingEmail })
    });
    const data = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error || "Could not resend verification code.");
      return;
    }

    setMessage("A fresh verification code has been sent.");
  };

  return (
    <section className="section-padding mx-auto py-12">
      <div className="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">
          Create Account
        </p>
        <h1 className="mt-2 text-3xl font-display text-slate-900">
          Join HETY STATIONERY
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Create an account to track orders, save addresses, and build your
          wishlist.
        </p>

        <Link
          href="/api/auth/google/start"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          Continue with Google
        </Link>

        {!needsVerification ? (
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
        ) : (
          <div className="mt-6 space-y-4">
            <input
              type="email"
              value={pendingEmail}
              readOnly
              className="input-base w-full rounded-2xl px-4 py-3 text-sm text-slate-500"
            />
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit verification code"
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))}
              className="input-base w-full rounded-2xl px-4 py-3 text-sm"
            />
          </div>
        )}

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}

        {!needsVerification ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary mt-6 w-full px-6 py-3 text-sm font-semibold"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        ) : (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={verifyEmail}
              className="btn-primary flex-1 px-6 py-3 text-sm font-semibold"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
            <button
              type="button"
              onClick={resendCode}
              className="btn-secondary flex-1 px-6 py-3 text-sm font-semibold"
            >
              Resend Code
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
