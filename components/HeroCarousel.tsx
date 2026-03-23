"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: "slide-1",
    headline: "All kind of stationery items, copier products, art and craft under one brand.",
    subtext:
      "HETY STATIONERY - COPIER-ART & CRAFT serves retail, wholesale, and franchise buyers with reliable supply and practical pricing.",
    cta: "View Products",
    href: "/#trending",
    image: "/images/slider1.png"
  },
  {
    id: "slide-2",
    headline: "Built from Dehgam, expanding with a 100+ store vision across India.",
    subtext:
      "HAPY FRANCHISE LLP is growing HETY STATIONERY through customer-first service, strong product mix, and franchise opportunities.",
    cta: "Explore Franchise",
    href: "/franchise",
    image: "/images/slider2.png"
  },
  {
    id: "slide-3",
    headline: "On-time delivery, high quality, and customization for real business demand.",
    subtext:
      "From school and office needs to creative supplies, we support customers with flexible solutions and standard delivery timelines.",
    cta: "Contact Us",
    href: "/contact",
    image: "/images/slider3.png"
  }
];

const highlights = [
  { value: "3", label: "Store locations" },
  { value: "4+", label: "Years of market experience" },
  { value: "100+", label: "Store expansion vision" }
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-panel relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={slides[active].image}
          alt={slides[active].headline}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.78)_48%,rgba(255,255,255,0.58)_100%)]" />
      </div>

      <div className="section-padding relative z-10 mx-auto grid min-h-[78vh] gap-10 py-14 lg:grid-cols-[1.15fr,0.85fr] lg:items-end lg:py-18">
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[active].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-accent-pink">
                HETY STATIONERY
              </p>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mt-4 min-h-[160px] text-4xl font-display leading-tight text-brand-800 sm:text-5xl lg:text-6xl"
              >
                {slides[active].headline}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-5 max-w-2xl text-lg leading-8 text-slate-600"
              >
                {slides[active].subtext}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href={slides[active].href}
                  className="btn-primary inline-flex items-center px-6 py-3 text-sm font-semibold uppercase tracking-wide"
                >
                  {slides[active].cta}
                </Link>
                <Link
                  href="/about"
                  className="btn-secondary inline-flex items-center px-6 py-3 text-sm font-semibold uppercase tracking-wide"
                >
                  Know More
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2 w-10 rounded-full transition ${
                  index === active ? "bg-accent-yellow" : "bg-brand-100 hover:bg-accent-pink"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4 self-end">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-6 shadow-soft backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-brand-50 p-3">
                <Image
                  src="/images/logo.png"
                  alt="HETY STATIONERY logo"
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
                  Retail and Wholesale
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Stationery, copier, art and craft supply with franchise growth focus.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-brand-100 bg-slate-50 px-4 py-4"
                >
                  <p className="text-2xl font-display text-brand-800">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-brand-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_55%,#fdf2f8_100%)] p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-pink">
              Core Strengths
            </p>
            <h3 className="mt-3 text-xl font-display text-slate-900">
              Built around practical service standards
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["On-time delivery", "Effective pricing", "High quality", "Customization"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-brand-100 bg-white px-4 py-4 text-sm text-slate-700"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                        0{index + 1}
                      </span>
                      <span className="font-medium">{item}</span>
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
