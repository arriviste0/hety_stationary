import MargSyncPanel from "@/components/admin/MargSyncPanel";

export default function MargSyncPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Marg Sync</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sync masters, stock, and orders with Marg ERP.
        </p>
      </div>
      <MargSyncPanel />
    </div>
  );
}
