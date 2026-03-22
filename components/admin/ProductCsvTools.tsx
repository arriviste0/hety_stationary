"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCsvTools() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (file: File | null) => {
    if (!file) {
      return;
    }

    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }

      router.refresh();
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href="/api/admin/products/export"
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Export CSV
      </a>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => handleImport(event.target.files?.[0] || null)}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        {isImporting ? "Importing..." : "Import CSV"}
      </button>
    </div>
  );
}
