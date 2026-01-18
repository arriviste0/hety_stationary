"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

export default function CategoryCircles() {
  return (
    <section className="section-padding mx-auto py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.08 }
          }
        }}
        className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
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
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-brand-100 bg-white shadow-soft transition group-hover:-translate-y-1 group-hover:border-accent-pink">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={64}
                  height={64}
                />
              </div>
              <span className="link-underline text-sm font-medium text-brand-600">
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
