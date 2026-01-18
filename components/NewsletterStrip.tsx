export default function NewsletterStrip() {
  return (
    <section className="bg-white">
      <div className="section-padding mx-auto py-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-brand-100 bg-white px-8 py-10 md:flex-row">
          <div>
            <p className="text-sm uppercase tracking-wide text-accent-pink">
              Hety Newsletter
            </p>
            <h3 className="mt-2 text-2xl font-display text-brand-800">
              Join the stationery insiders list
            </h3>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="input-base w-full rounded-full px-4 py-3 text-sm placeholder:text-slate-400"
            />
            <button
              type="button"
              className="rounded-full border border-transparent bg-accent-yellow px-5 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-pink hover:bg-accent-pink hover:text-white hover:shadow-soft"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
