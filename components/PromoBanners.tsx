"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PromoBanners() {
  return (
    <section className="section-padding mx-auto py-16">
      <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
        {[
          {
            title: "Grow with a HETY STATIONERY franchise",
            text:
              "We are inviting business-minded partners who want to enter or expand in the stationery segment with our brand support and customer-first approach.",
            cta: "Franchise Enquiry",
            href: "/franchise",
            color: "bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white",
            textColor: "text-white/85",
            buttonClass:
              "border-white/20 bg-white text-brand-700 hover:border-white hover:bg-accent-yellow hover:text-slate-900"
          },
          {
            title: "Supply support for daily retail and wholesale demand",
            text:
              "Serving schools, offices, resellers, and creative buyers with dependable product availability, quality focus, and flexible customer support.",
            cta: "Contact Team",
            href: "/contact",
            color: "bg-brand-50 text-slate-900",
            textColor: "text-slate-600",
            buttonClass:
              "border-slate-900 bg-white text-slate-900 hover:border-slate-900 hover:bg-accent-pink hover:text-white"
          }
        ].map((banner) => (
          <motion.div
            key={banner.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className={`rounded-[2rem] ${banner.color} p-10 shadow-soft`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.3em] opacity-80">
                Business Focus
              </p>
              <Link
                href={banner.href}
                className={`inline-flex items-center rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ease-out hover:-translate-y-0.5 ${banner.buttonClass}`}
              >
                {banner.cta}
              </Link>
            </div>
            <h3 className="mt-4 text-2xl font-display sm:text-3xl">{banner.title}</h3>
            <p className={`mt-4 max-w-md text-sm leading-7 ${banner.textColor}`}>
              {banner.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
