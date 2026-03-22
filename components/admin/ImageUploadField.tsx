"use client";

import { useRef, useState } from "react";

export default function ImageUploadField({
  name,
  defaultValue = "",
  multiple = false
}: {
  name: string;
  defaultValue?: string;
  multiple?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = (await response.json()) as { url: string };
        uploadedUrls.push(data.url);
      }

      setValue((current) => {
        const existing = current
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        const next = multiple ? [...existing, ...uploadedUrls] : uploadedUrls;
        return next.join(", ");
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <input
        name={name}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={multiple ? "Image URLs (comma separated)" : "Image URL"}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(event) => handleUpload(event.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-600 hover:bg-slate-50"
      >
        {isUploading ? "Uploading..." : multiple ? "Upload images" : "Upload image"}
      </button>
      {value && (
        <p className="text-xs text-slate-500">
          Saved URL{multiple ? "s" : ""}: {value}
        </p>
      )}
    </div>
  );
}
