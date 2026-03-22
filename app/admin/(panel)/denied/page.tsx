export default function AccessDeniedPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Access denied</h1>
      <p className="mt-2 text-sm text-slate-600">
        You do not have permission to view this section. Please contact an
        administrator if you need access.
      </p>
    </div>
  );
}
