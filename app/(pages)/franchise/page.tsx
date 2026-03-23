export default function FranchisePage() {
  return (
    <section className="section-padding mx-auto py-12">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">
          Franchise Enquiry
        </p>
        <h1 className="mt-2 text-3xl font-display text-slate-900">
          Partner with HETY STATIONERY
        </h1>
        <p className="mt-4 text-sm text-slate-600">
          We are offering franchises with our brand for people interested in the
          stationery business. Our mission is to establish 100+ stores all over
          India with strong customer satisfaction focus.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-700">Why Franchise With Us</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Growing brand with existing store presence</li>
            <li>Retail and wholesale stationery business experience</li>
            <li>On-time delivery, effective pricing, and quality focus</li>
            <li>Customization support based on local market need</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-700">Contact for Franchise</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Company: HAPY FRANCHISE LLP</p>
            <p>Phones: +91 97149 92464, +91 98791 52220, +91 9979242499</p>
            <p>Email: HETYfranchise@gmail.com</p>
            <p>
              Instagram:{" "}
              <a
                href="https://www.instagram.com/hetystationerychiloda"
                target="_blank"
                rel="noreferrer"
                className="link-underline text-brand-600"
              >
                @hetystationerychiloda
              </a>{" "}
              /{" "}
              <a
                href="https://www.instagram.com/hetystationery"
                target="_blank"
                rel="noreferrer"
                className="link-underline text-brand-600"
              >
                @hetystationery
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
