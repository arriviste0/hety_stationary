"use client";

import type { FormEventHandler } from "react";
import { useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import type { Role } from "@/lib/rbac";

type AdminTopbarProps = {
  role: Role;
  name: string;
  email: string;
  onOpenMobile: () => void;
  logoutAction: () => Promise<void>;
};

export default function AdminTopbar({
  role,
  name,
  email,
  onOpenMobile,
  logoutAction
}: AdminTopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <form onSubmit={handleSearch} className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 md:flex">
            <Search size={16} className="text-slate-400" />
            <input
              type="search"
              placeholder="Search orders, products, customers"
              className="w-72 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </form>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
              4
            </span>
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
                {name?.[0] || "A"}
              </span>
              <span className="hidden sm:block">{name || "Admin User"}</span>
              <ChevronDown size={16} className="text-slate-500" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-soft">
                <p className="text-xs font-semibold uppercase text-slate-400">Signed in as</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{name}</p>
                <p className="text-xs text-slate-500">{email}</p>
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  Role: <span className="font-semibold capitalize text-slate-700">{role.replace(/_/g, " ")}</span>
                </div>
                <form action={logoutAction} className="mt-3">
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-slate-200 px-6 py-3 md:hidden">
        <Search size={16} className="text-slate-400" />
        <input
          type="search"
          placeholder="Search orders, products, customers"
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
    </header>
  );
}
