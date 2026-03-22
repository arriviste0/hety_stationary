import Image from "next/image";
import Link from "next/link";

const strengths = [
  {
    title: "On-time delivery",
    text: "Committed coordination and timely supply for day-to-day business demand."
  },
  {
    title: "Effective pricing",
    text: "Balanced pricing approach for both retail customers and wholesale buyers."
  },
  {
    title: "High quality products",
    text: "Focused on dependable stationery, copier, art and craft product selection."
  },
  {
    title: "Customization support",
    text: "Flexible response to customer-specific requirements wherever possible."
  }
];

const milestones = [
  { value: "2022", label: "Started in Dehgam" },
  { value: "4+", label: "Years of experience" },
  { value: "3", label: "Store locations" },
  { value: "100+", label: "Store vision across India" }
];

export default function AboutPage() {
  return (
    <section className="section-padding mx-auto py-12">
      <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-accent-yellow/30 shadow-soft">
        <div className="grid gap-10 p-8 lg:grid-cols-[1.3fr,0.7fr] lg:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent-pink">
              About Us
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-display leading-tight text-slate-900 sm:text-5xl">
              HETY STATIONERY grew from local interest into a family-led brand
              for stationery, copier, art and craft business.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              HETY STATIONERY started in Dehgam in 2022 with self interest.
              Considering business growth opportunities, the family business was
              expanded under HAPY FRANCHISE LLP with fresh HETY STATIONERY
              branding in February 2026.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary px-6 py-3 text-sm font-semibold">
                Contact Us
              </Link>
              <Link href="/franchise" className="btn-secondary px-6 py-3 text-sm font-semibold">
                Franchise Enquiry
              </Link>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-soft">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(236,72,153,0.12),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(250,204,21,0.22),_transparent_40%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-3 shadow-soft">
                  <Image
                    src="/images/logo.png"
                    alt="HETY STATIONERY logo"
                    width={84}
                    height={84}
                    className="h-20 w-20 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
                    HAPY FRANCHISE LLP
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Retailer, wholesaler, and franchise-focused business
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {milestones.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-brand-100 bg-white/90 p-4"
                  >
                    <p className="text-2xl font-display text-brand-800">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-pink">
            What We Do
          </p>
          <h2 className="mt-3 text-2xl font-display text-slate-900">
            Serving retail, wholesale, and franchise demand under one brand
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            We are retailer and wholesaler in the stationery business. We deal
            in stationery items, copier products, art and craft supplies, and
            we are also offering franchises with our brand to people interested
            in the stationery business.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-700">Business Type</p>
              <p className="mt-2 text-sm text-slate-600">Retailer / Wholesaler</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-700">Products</p>
              <p className="mt-2 text-sm text-slate-600">
                Stationery items, copier products, art and craft supplies
              </p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-700">Current Reach</p>
              <p className="mt-2 text-sm text-slate-600">3 stores and growing</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-700">Manufacturing</p>
              <p className="mt-2 text-sm text-slate-600">
                Future plan under consideration
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-pink">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-2xl font-display text-slate-900">
            A simple and reliable service approach
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Our business is built around dependable service standards that help
            customers order with confidence and continue with us for the long term.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {strengths.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-brand-100 bg-slate-50 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-pink">Vision</p>
          <h2 className="mt-3 text-2xl font-display text-slate-900">
            A creative, sustainable, and empowered business
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Our vision is to establish a creative, sustainable, and empowered
            business that grows with long-term customer trust and strong market
            presence.
          </p>
        </div>

        <div className="rounded-[2rem] border border-brand-100 bg-brand-50 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-pink">Mission</p>
          <h2 className="mt-3 text-2xl font-display text-slate-900">
            100+ stores across India with customer satisfaction as priority
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Our mission is to implement 100+ stores of our brand all over India
            while keeping customer satisfaction at the center of operations,
            service quality, and business expansion.
          </p>
        </div>
      </div>
    </section>
  );
}
