"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AuthModal() {
  const { isAuthOpen, closeAuth, login, signup } = useCart();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    if (mode === "login") {
      const result = await login(email, password);
      setIsSubmitting(false);

      if (!result.ok) {
        setError(result.error || "Something went wrong.");
        return;
      }
    } else {
      const result = await signup({ name, email, phone, password });
      setIsSubmitting(false);

      if (!result.ok) {
        setError(result.error || "Something went wrong.");
        return;
      }

      if (result.requiresVerification) {
        setPendingEmail(result.email || email);
        setNeedsVerification(true);
        setMessage("Verification code sent to your email.");
        return;
      }
    }

    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const verifyEmail = async () => {
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

    setNeedsVerification(false);
    closeAuth();
  };

  const resendCode = async () => {
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
    <AnimatePresence>
      {isAuthOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 px-4 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-lg rounded-3xl border border-brand-100 bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-accent-pink">
                  Account Required
                </p>
                <h2 className="mt-1 text-2xl font-display text-slate-900">
                  Sign in to continue
                </h2>
              </div>
              <button
                type="button"
                onClick={closeAuth}
                className="icon-btn rounded-full p-2 text-brand-600"
                aria-label="Close login"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Please sign in or create an account to save favorites or add items
              to your cart.
            </p>

            <Link
              href="/api/auth/google/start"
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              Continue with Google
            </Link>

            <div className="mt-5 space-y-4">
              {mode === "signup" && !needsVerification && (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  className="input-base w-full rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400"
                />
              )}
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                readOnly={needsVerification}
                className="input-base w-full rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400"
              />
              {mode === "signup" && !needsVerification && (
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone number"
                  className="input-base w-full rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400"
                />
              )}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                readOnly={needsVerification}
                className="input-base w-full rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400"
              />
              {needsVerification && (
                <input
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit verification code"
                  inputMode="numeric"
                  maxLength={6}
                  className="input-base w-full rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400"
                />
              )}
              {error && <p className="text-sm text-rose-600">{error}</p>}
              {message && <p className="text-sm text-emerald-700">{message}</p>}
              <button
                type="button"
                onClick={needsVerification ? verifyEmail : handleSubmit}
                className="btn-primary w-full px-6 py-3 text-sm font-semibold"
              >
                {isSubmitting
                  ? "Please wait..."
                  : needsVerification
                    ? "Verify Email"
                    : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
              </button>
              {needsVerification && (
                <button
                  type="button"
                  onClick={resendCode}
                  className="btn-secondary w-full px-6 py-3 text-sm font-semibold"
                >
                  Resend Code
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMode((current) => (current === "login" ? "signup" : "login"));
                  setError("");
                  setMessage("");
                  setNeedsVerification(false);
                  setVerificationCode("");
                }}
                className="btn-secondary w-full px-6 py-3 text-sm font-semibold"
              >
                {mode === "login" ? "Create Account" : "Back to Sign In"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
