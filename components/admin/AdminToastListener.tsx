"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminToastListener() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const toast = searchParams.get("toast");
    if (toast) {
      setMessage(decodeURIComponent(toast));
      const timer = setTimeout(() => setMessage(""), 2800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [searchParams]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-6 top-6 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-soft">
      {message}
    </div>
  );
}
