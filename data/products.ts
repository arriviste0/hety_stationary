export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  categorySlug: string;
  images: string[];
  rating?: number;
  description: string;
  brand?: string;
  tags?: string[];
};

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Skyline Stapler Pro",
    slug: "skyline-stapler-pro",
    price: 349,
    categorySlug: "office-essentials",
    images: ["/images/product-1.jpg"],
    rating: 4.6,
    description: "A sturdy metal stapler designed for smooth, jam-free use.",
    brand: "Hety Office",
    tags: ["stapler", "office"]
  },
  {
    id: "prod-002",
    name: "Soft Grip Scissors",
    slug: "soft-grip-scissors",
    price: 199,
    categorySlug: "craft",
    images: ["/images/product-2.jpg"],
    rating: 4.4,
    description: "Ergonomic scissors with a precision edge for craft projects.",
    brand: "Hety Craft",
    tags: ["scissors", "craft"]
  },
  {
    id: "prod-003",
    name: "Crystal Tape Dispenser",
    slug: "crystal-tape-dispenser",
    price: 279,
    categorySlug: "office-essentials",
    images: ["/images/product-3.jpg"],
    rating: 4.2,
    description: "Weighted dispenser with a sleek, clear finish for desks.",
    brand: "Hety Office",
    tags: ["tape", "desk"]
  },
  {
    id: "prod-004",
    name: "Midnight Gel Pens (Set of 6)",
    slug: "midnight-gel-pens-set",
    price: 499,
    categorySlug: "premium-pens",
    images: ["/images/product-4.jpg"],
    rating: 4.8,
    description: "Smooth-flow gel pens in rich midnight tones.",
    brand: "Hety Pens",
    tags: ["pens", "premium"]
  },
  {
    id: "prod-005",
    name: "Pastel Highlighter Pack",
    slug: "pastel-highlighter-pack",
    price: 259,
    categorySlug: "school-supplies",
    images: ["/images/product-5.jpg"],
    rating: 4.5,
    description: "Soft pastel highlighters that glide without bleeding.",
    brand: "Hety School",
    tags: ["highlighter", "school"]
  },
  {
    id: "prod-006",
    name: "Precision Hole Punch",
    slug: "precision-hole-punch",
    price: 399,
    categorySlug: "office-essentials",
    images: ["/images/product-6.jpg"],
    rating: 4.1,
    description: "Two-hole punch with a firm grip and clean punch.",
    brand: "Hety Office",
    tags: ["punch", "office"]
  },
  {
    id: "prod-007",
    name: "Dotted Journal Notebook",
    slug: "dotted-journal-notebook",
    price: 299,
    categorySlug: "notebooks",
    images: ["/images/product-7.jpg"],
    rating: 4.7,
    description: "Premium dotted notebook for bullet journaling.",
    brand: "Hety Paper",
    tags: ["notebook", "journal"]
  },
  {
    id: "prod-008",
    name: "Color Burst Crayons",
    slug: "color-burst-crayons",
    price: 189,
    categorySlug: "crayons",
    images: ["/images/product-8.jpg"],
    rating: 4.3,
    description: "Bold, smooth crayons for classroom creativity.",
    brand: "Hety School",
    tags: ["crayons", "school"]
  },
  {
    id: "prod-009",
    name: "Calligraphy Brush Pen Set",
    slug: "calligraphy-brush-pen-set",
    price: 549,
    categorySlug: "calligraphy",
    images: ["/images/product-9.jpg"],
    rating: 4.9,
    description: "Flexible brush pens with rich ink flow.",
    brand: "Hety Pens",
    tags: ["calligraphy", "pens"]
  },
  {
    id: "prod-010",
    name: "Mini Binder Clips Pack",
    slug: "mini-binder-clips-pack",
    price: 149,
    categorySlug: "office-essentials",
    images: ["/images/product-10.jpg"],
    rating: 4.0,
    description: "Pack of 24 mini clips for neat paper stacks.",
    brand: "Hety Office",
    tags: ["clips", "office"]
  }
];
