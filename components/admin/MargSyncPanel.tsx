"use client";

import { useEffect, useState } from "react";

type SyncJob = {
  _id: string;
  jobId: string;
  syncType: string;
  startTime?: string;
  endTime?: string;
  status: string;
  recordsFetched?: number;
  recordsUpdated?: number;
  errors?: string[];
};

type SyncLog = {
  _id: string;
  level: string;
  message: string;
  createdAt?: string;
};

export default function MargSyncPanel() {
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [status, setStatus] = useState("Idle");
  const lastSync = jobs[0];

  const loadData = async () => {
    const response = await fetch("/api/admin/marg-sync");
    const data = await response.json();
    setJobs(data.jobs || []);
    setLogs(data.logs || []);
  };

  const runSync = async (syncType: string) => {
    setStatus("Running");
    await fetch("/api/admin/marg-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ syncType })
    });
    await loadData();
    setStatus("Success");
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Marg Sync</h2>
            <p className="text-xs text-slate-500">
              Last sync: {lastSync?.endTime ? new Date(lastSync.endTime).toLocaleString() : "—"} · Status: {status}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => runSync("Masters")}
              className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white"
            >
              Sync Masters
            </button>
            <button
              type="button"
              onClick={() => runSync("Stock")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Sync Stock
            </button>
            <button
              type="button"
              onClick={() => runSync("Orders")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Sync Orders
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700">Sync Jobs</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Job ID</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Start</th>
                  <th className="px-3 py-2">End</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Fetched</th>
                  <th className="px-3 py-2">Updated</th>
                  <th className="px-3 py-2">Errors</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-semibold text-slate-700">
                      {job.jobId}
                    </td>
                    <td className="px-3 py-2">{job.syncType}</td>
                    <td className="px-3 py-2">
                      {job.startTime
                        ? new Date(job.startTime).toLocaleTimeString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {job.endTime
                        ? new Date(job.endTime).toLocaleTimeString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2">{job.status}</td>
                    <td className="px-3 py-2">{job.recordsFetched ?? 0}</td>
                    <td className="px-3 py-2">{job.recordsUpdated ?? 0}</td>
                    <td className="px-3 py-2">{job.errors?.length ?? 0}</td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-sm text-slate-500" colSpan={8}>
                      No sync jobs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700">Error Logs</h3>
          <div className="mt-4 space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="rounded-xl border border-slate-100 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-700">{log.level}</p>
                <p>{log.message}</p>
                <p className="text-[10px] text-slate-400">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
                </p>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-slate-500">No logs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
