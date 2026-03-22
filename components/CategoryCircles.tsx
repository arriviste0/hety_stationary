"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type CategoryCircle = {
  name: string;
  slug: string;
  image: string;
};

export default function CategoryCircles({
  categories
}: {
  categories: CategoryCircle[];
}) {
  return (
    <section className="section-padding mx-auto py-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent-pink">
            Categories
          </p>
          <h2 className="mt-2 text-3xl font-display text-slate-900">
            Explore the core business range
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Product categories shaped around daily customer demand across school,
            office, retail counter, copier, and creative supply needs.
          </p>
        </div>
        <Link href="/stores" className="text-sm font-semibold text-brand-600">
          Visit our stores
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.08 }
          }
        }}
        className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
      >
        {categories.map((category) => (
          <motion.div
            key={category.slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Link
              href={`/category/${category.slug}`}
              className="group flex h-full flex-col items-center rounded-[1.5rem] border border-brand-100 bg-white p-4 text-center shadow-soft transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent-pink"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-brand-100 bg-brand-50">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="96px"
                  className="object-cover object-center transition duration-300 ease-out group-hover:scale-110"
                />
              </div>
              <span className="mt-4 text-sm font-semibold text-brand-700">
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
