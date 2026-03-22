import type { ReactNode } from "react";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
