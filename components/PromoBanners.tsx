"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PromoBanners() {
  return (
    <section id="gifts" className="section-padding mx-auto py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          {
            title: "Schooling is now fun!",
            text: "Bright kits, notebooks, and bundles ready for every grade.",
            cta: "Shop School",
            href: "/category/school-supplies",
            color: "bg-accent-yellow"
          },
          {
            title: "Note it down with Hety Pens!",
            text: "Premium pens crafted for smooth signatures and sketches.",
            cta: "Shop Pens",
            href: "/category/premium-pens",
            color: "bg-accent-yellow"
          }
        ].map((banner) => (
          <motion.div
            key={banner.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className={`rounded-3xl ${banner.color} p-10 text-slate-900 shadow-soft`}
          >
            <h3 className="text-2xl sm:text-3xl font-display">
              {banner.title}
            </h3>
            <p className="mt-3 max-w-md text-sm text-white/90">{banner.text}</p>
            <Link
              href={banner.href}
              className="mt-6 inline-flex items-center rounded-full border border-slate-900 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-wide text-slate-900 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border hover:border-slate-900 hover:bg-accent-pink hover:text-white"
            >
              {banner.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
