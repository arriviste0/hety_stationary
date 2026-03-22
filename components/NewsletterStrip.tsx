export default function NewsletterStrip() {
  return (
    <section className="bg-white">
      <div className="section-padding mx-auto py-12">
        <div className="rounded-[2rem] border border-brand-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_45%,#fdf2f8_100%)] px-8 py-10 shadow-soft">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-accent-pink">
                Business Enquiry
              </p>
              <h3 className="mt-3 text-3xl font-display text-brand-800">
                Connect for supply, stores, or franchise discussion
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Email HETYfranchise@gmail.com or call our team for product,
                wholesale, or franchise support. We work with a practical
                approach and direct communication.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <a
                href="mailto:HETYfranchise@gmail.com"
                className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              >
                Email Us
              </a>
              <a
                href="/contact"
                className="btn-secondary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              >
                Contact Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
