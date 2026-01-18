"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    id: "slide-1",
    headline: "Sometimes stationery defines daily needs, sometimes the status.",
    subtext: "Discover polished tools for everyday wins.",
    cta: "Shop Now"
  },
  {
    id: "slide-2",
    headline: "Make school time brighter with curated essentials.",
    subtext: "From pastel notes to reliable organizers.",
    cta: "Explore School"
  },
  {
    id: "slide-3",
    headline: "Craft your story with premium inks and pens.",
    subtext: "Signature writing tools for every creator.",
    cta: "Browse Premium"
  }
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
    <section className="hero-panel">
      <div className="section-padding mx-auto flex min-h-[70vh] flex-col items-start justify-center py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[active].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="min-h-[120px] text-4xl sm:text-5xl lg:text-6xl font-display text-brand-800"
            >
              {slides[active].headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 min-h-[56px] text-lg text-slate-600"
            >
              {slides[active].subtext}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link
                href="/#trending"
                className="btn-primary mt-8 inline-flex items-center px-6 py-3 text-sm font-semibold uppercase tracking-wide"
              >
                {slides[active].cta}
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
    </section>
  );
}
