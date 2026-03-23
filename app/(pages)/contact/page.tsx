const contacts = [
  {
    title: "Call Us",
    text: "+91 97149 92464, +91 98791 52220, +91 9979242499"
  },
  {
    title: "Email Us",
    text: "HETYfranchise@gmail.com"
  },
  {
    title: "WhatsApp",
    text: "+91 97149 92464, +91 98791 52220, +91 9979242499"
  },
  {
    title: "Working Hours",
    text: "9:30 AM to 9:00 PM"
  }
];

export default function ContactPage() {
  return (
    <section className="section-padding mx-auto py-12">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">Contact Us</p>
        <h1 className="mt-2 text-3xl font-display text-slate-900">
          Contact HAPY FRANCHISE LLP
        </h1>
        <p className="mt-4 text-sm text-slate-600">
          Reach us for product enquiries, wholesale supply, store support, or
          franchise discussion.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map((card) => (
            <div key={card.title} className="rounded-2xl border border-brand-100 bg-white p-4">
              <h2 className="text-sm font-semibold text-brand-700">{card.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-700">Business Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 p-4">
              <p className="text-xs uppercase tracking-wide text-accent-pink">Company Name</p>
              <p className="mt-2 text-sm text-slate-600">HAPY FRANCHISE LLP</p>
            </div>
            <div className="rounded-2xl border border-brand-100 p-4">
              <p className="text-xs uppercase tracking-wide text-accent-pink">Brand Name</p>
              <p className="mt-2 text-sm text-slate-600">
                HETY STATIONERY - COPIER-ART & CRAFT
              </p>
            </div>
            <div className="rounded-2xl border border-brand-100 p-4">
              <p className="text-xs uppercase tracking-wide text-accent-pink">Contact Persons</p>
              <p className="mt-2 text-sm text-slate-600">
                Zankhana Arunbhai Raval
                <br />
                Vaishaliben Pinkalkumar Soni
              </p>
            </div>
            <div className="rounded-2xl border border-brand-100 p-4">
              <p className="text-xs uppercase tracking-wide text-accent-pink">GST Number</p>
              <p className="mt-2 text-sm text-slate-600">24AATFH1531J1ZB</p>
            </div>
            <div className="rounded-2xl border border-brand-100 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-accent-pink">Office Address</p>
              <p className="mt-2 text-sm text-slate-600">
                6, Pramukh E Lite, Mota Chiloda, beside SBI Bank, Dehgam - Mota
                Chiloda Road, Gandhinagar, Gujarat - 382355
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="mailto:HETYfranchise@gmail.com"
              className="btn-primary px-6 py-3 text-sm font-semibold"
            >
              Email Sales
            </a>
            <a
              href="https://maps.app.goo.gl/hn7qxCy7zcfjD7dx5"
              className="btn-secondary px-6 py-3 text-sm font-semibold"
            >
              Open Google Map
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-700">Find Us</h2>
          <p className="mt-2 text-sm text-slate-600">
            Mota Chiloda, Gandhinagar, Gujarat
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-brand-100">
            <iframe
              title="HETY STATIONERY Location"
              src="https://maps.google.com/maps?q=Pramukh%20E%20Lite%20Mota%20Chiloda%20Gandhinagar&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="220"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
