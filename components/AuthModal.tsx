"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AuthModal() {
  const { isAuthOpen, closeAuth, login, signup } = useCart();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    const result =
      mode === "login"
        ? await login(email, password)
        : await signup({ name, email, phone, password });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Something went wrong.");
      return;
    }

    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
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

            <div className="mt-5 space-y-4">
              {mode === "signup" && (
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
                className="input-base w-full rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400"
              />
              {mode === "signup" && (
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
                className="input-base w-full rounded-2xl px-4 py-3 text-sm placeholder:text-slate-400"
              />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary w-full px-6 py-3 text-sm font-semibold"
              >
                {isSubmitting
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode((current) => (current === "login" ? "signup" : "login"));
                  setError("");
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
