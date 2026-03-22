const brands = [
  { name: "Camlin", status: "Active" },
  { name: "Faber Castell", status: "Active" },
  { name: "Pilot", status: "Inactive" }
];

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Brands</h1>
        <p className="mt-2 text-sm text-slate-500">
          Control brand visibility across the catalog.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Brand list</h2>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
            Add Brand
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Logo</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.name} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-700">
                    {brand.name}
                  </td>
                  <td className="px-3 py-2 text-slate-400">—</td>
                  <td className="px-3 py-2">{brand.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
