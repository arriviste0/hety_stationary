"use client";

import { useState } from "react";
import SalesChart from "@/components/admin/SalesChart";
import StatusDonut from "@/components/admin/StatusDonut";
import { orderStatus, sales30Days, sales7Days } from "@/data/admin/dashboard";

export default function DashboardOverview() {
  const [range, setRange] = useState<"7" | "30">("7");
  const data = range === "7" ? sales7Days : sales30Days;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Sales</h2>
            <p className="text-xs text-slate-500">Last {range} days revenue</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRange("7")}
              className={`rounded-full px-3 py-1 font-semibold ${
                range === "7" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              7 days
            </button>
            <button
              type="button"
              onClick={() => setRange("30")}
              className={`rounded-full px-3 py-1 font-semibold ${
                range === "30" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              30 days
            </button>
          </div>
        </div>
        <div className="mt-4">
          <SalesChart data={data} />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Orders by Status</h2>
        <div className="mt-4 flex items-center gap-4">
          <StatusDonut data={orderStatus} />
          <ul className="space-y-2 text-xs text-slate-600">
            {orderStatus.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span
                  className="inline-flex h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label} ({item.value})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
