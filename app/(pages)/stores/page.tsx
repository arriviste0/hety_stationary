const stores = [
  {
    name: "HETY STATIONERY - COPIER-ART & CRAFT",
    address: "Mota Chiloda",
    phone: "+91 97149 92464",
    hours: "9:00 AM to 9:00 PM",
    map: "https://maps.app.goo.gl/hn7qxCy7zcfjD7dx5"
  },
  {
    name: "HETY STATIONERY AND COPIER",
    address: "Dehgam",
    phone: "+91 98791 52220",
    hours: "9:00 AM to 9:00 PM",
    map: "https://maps.app.goo.gl/DWdgVouvyxuBMdbi8"
  },
  {
    name: "HETY STATIONERY AND COPIER",
    address: "Hanspura-Naroda",
    phone: "+91 9979242499",
    hours: "9:00 AM to 9:00 PM",
    map: "https://maps.app.goo.gl/DWdgVouvyxuBMdbi8"
  }
];

export default function StoresPage() {
  return (
    <section className="section-padding mx-auto py-12">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">Our Stores</p>
        <h1 className="mt-2 text-3xl font-display text-slate-900">3 HETY Store Locations</h1>
        <p className="mt-4 text-sm text-slate-600">
          Visit our stores in Mota Chiloda, Dehgam, and Hanspura-Naroda for
          stationery, copier, art, and craft requirements.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {stores.map((store) => (
            <div key={`${store.name}-${store.address}`} className="rounded-2xl border border-brand-100 bg-white p-4 shadow-soft">
              <h2 className="text-sm font-semibold text-brand-700">{store.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{store.address}</p>
              <p className="text-xs text-slate-500">{store.phone}</p>
              <p className="text-xs text-slate-500">{store.hours}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={store.map} className="btn-secondary px-4 py-2 text-xs">
                  Google Maps
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-700">Map View</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-brand-100">
            <iframe
              title="HETY STATIONERY Stores"
              src="https://maps.google.com/maps?q=Mota%20Chiloda%20Gandhinagar&t=&z=10&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="360"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
