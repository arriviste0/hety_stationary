"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type PaymentStatus =
  | {
      ok: true;
      state: "PENDING" | "FAILED" | "COMPLETED";
      paymentStatus: "Pending" | "Failed" | "Paid";
      merchantOrderId: string;
      paymentMode?: string;
      transactionId?: string | null;
    }
  | {
      ok?: false;
      error?: string;
    };

function PhonePePaymentContent() {
  const searchParams = useSearchParams();
  const merchantOrderId = String(searchParams.get("merchantOrderId") || "");
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!merchantOrderId) {
      setStatus({ error: "Missing PhonePe order reference." });
      setIsLoading(false);
      return;
    }

    fetch(`/api/storefront/phonepe/status?merchantOrderId=${encodeURIComponent(merchantOrderId)}`, {
      cache: "no-store"
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as PaymentStatus;
        if (!response.ok) {
          throw new Error("error" in data && data.error ? data.error : "Could not verify payment.");
        }
        setStatus(data);

        if ("ok" in data && data.ok && data.state === "COMPLETED") {
          window.localStorage.setItem("hety_cart", "[]");
          window.setTimeout(() => {
            window.location.href = "/account";
          }, 1500);
        }
      })
      .catch((error: Error) => {
        setStatus({ error: error.message || "Could not verify payment." });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [merchantOrderId]);

  return (
    <section className="section-padding mx-auto py-16">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-accent-pink">PhonePe Payment</p>
        <h1 className="mt-3 text-3xl font-display text-slate-900">Payment Status</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {isLoading
            ? "Verifying your payment with PhonePe."
            : status && "ok" in status && status.ok
            ? `Order ${status.merchantOrderId}`
            : "We could not confirm the payment yet."}
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          {isLoading ? (
            <p className="text-sm font-medium text-slate-700">Checking PhonePe status...</p>
          ) : status && "ok" in status && status.ok ? (
            <>
              <p className="text-sm text-slate-500">Payment status</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {status.paymentStatus}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                {status.state === "COMPLETED"
                  ? "Payment received. Redirecting you to your account."
                  : status.state === "FAILED"
                  ? "PhonePe reported a failed payment. You can go back to the cart and try again."
                  : "PhonePe still shows this payment as pending. Refresh this page in a moment."}
              </p>
              {status.transactionId ? (
                <p className="mt-4 text-xs text-slate-500">Transaction ID: {status.transactionId}</p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-rose-600">{status?.error || "Could not verify payment."}</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/cart" className="btn-secondary inline-flex px-5 py-2.5 text-sm font-semibold">
            Back to Cart
          </Link>
          <Link href="/account" className="btn-primary inline-flex px-5 py-2.5 text-sm font-semibold">
            Go to Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PhonePePaymentPage() {
  return (
    <Suspense
      fallback={
        <section className="section-padding mx-auto py-16">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-brand-100 bg-white p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-pink">PhonePe Payment</p>
            <h1 className="mt-3 text-3xl font-display text-slate-900">Payment Status</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Preparing payment details.
            </p>
          </div>
        </section>
      }
    >
      <PhonePePaymentContent />
    </Suspense>
  );
}
