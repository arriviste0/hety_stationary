export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceLabel?: string;
  categorySlug: string;
  images: string[];
  rating?: number;
  description: string;
  specification?: string;
  delivery?: string;
  brand?: string;
  tags?: string[];
};

export const products: Product[] = [
  {
    id: "prod-001",
    name: "HETY Stationery Branding Items",
    slug: "hety-stationery-branding-items",
    price: 49,
    priceLabel: "Price on request",
    categorySlug: "branding-items",
    images: ["/images/hety_stationary.png"],
    rating: 4.8,
    description:
      "Custom and branded stationery solutions supplied under the HETY STATIONERY - COPIER-ART & CRAFT label for retail, wholesale, and franchise requirements.",
    specification: "Available in various sizes, materials, and thicknesses.",
    delivery: "Standard delivery time applicable.",
    brand: "HETY Stationery",
    tags: ["branding", "customization", "franchise", "stationery"]
  },
  {
    id: "prod-002",
    name: "Flair Writing Collection",
    slug: "flair-writing-collection",
    price: 10,
    priceLabel: "Starting from Rs. 10",
    categorySlug: "writing-instruments",
    images: ["/images/slider1.png"],
    rating: 4.6,
    description:
      "Popular Flair pens and writing essentials for schools, offices, counters, and bulk distribution.",
    specification: "Available in various sizes, pack formats, and tip options.",
    delivery: "Standard delivery time applicable.",
    brand: "Flair",
    tags: ["flair", "pens", "writing", "school"]
  },
  {
    id: "prod-003",
    name: "DOMS School Essentials",
    slug: "doms-school-essentials",
    price: 15,
    priceLabel: "Starting from Rs. 15",
    categorySlug: "school-supplies",
    images: ["/images/slider2.png"],
    rating: 4.7,
    description:
      "DOMS stationery assortment covering pencils, geometry sets, colors, and day-to-day student needs.",
    specification: "Available in various sizes, materials, and thicknesses.",
    delivery: "Standard delivery time applicable.",
    brand: "DOMS",
    tags: ["doms", "school", "student", "stationery"]
  },
  {
    id: "prod-004",
    name: "Saino Office and School Range",
    slug: "saino-office-school-range",
    price: 20,
    priceLabel: "Price on request",
    categorySlug: "office-supplies",
    images: ["/images/Office_Supplies_27b30b26-e42d-4a26-9de0-5cca17c4cd83_720x.avif"],
    rating: 4.3,
    description:
      "Saino utility products selected for routine office work, school counters, and wholesale supply.",
    specification: "Available in multiple practical variants.",
    delivery: "Standard delivery time applicable.",
    brand: "Saino",
    tags: ["saino", "office", "wholesale"]
  },
  {
    id: "prod-005",
    name: "Camlin Art and Craft Supplies",
    slug: "camlin-art-craft-supplies",
    price: 35,
    priceLabel: "Starting from Rs. 35",
    categorySlug: "art-and-craft",
    images: ["/images/craft.png"],
    rating: 4.9,
    description:
      "Camlin creative materials for sketching, painting, school projects, and hobby use.",
    specification: "Available in various sizes, materials, and pack combinations.",
    delivery: "Standard delivery time applicable.",
    brand: "Camlin",
    tags: ["camlin", "art", "craft", "creative"]
  },
  {
    id: "prod-006",
    name: "Aerotix Premium Utility Products",
    slug: "aerotix-premium-utility-products",
    price: 99,
    priceLabel: "Price on request",
    categorySlug: "premium-stationery",
    images: ["/images/Premium_Pens_720x.avif"],
    rating: 4.4,
    description:
      "Aerotix product range for customers looking for sharper presentation, premium feel, and dependable usage.",
    specification: "Available in multiple premium variants.",
    delivery: "Standard delivery time applicable.",
    brand: "Aerotix",
    tags: ["aerotix", "premium", "office", "gifting"]
  },
  {
    id: "prod-007",
    name: "Officemate Business Essentials",
    slug: "officemate-business-essentials",
    price: 65,
    priceLabel: "Starting from Rs. 65",
    categorySlug: "office-supplies",
    images: ["/images/notebooks.png"],
    rating: 4.5,
    description:
      "Officemate products for filing, desk organization, routine operations, and institutional supply.",
    specification: "Available in various sizes and office-use formats.",
    delivery: "Standard delivery time applicable.",
    brand: "Officemate",
    tags: ["officemate", "office", "business", "files"]
  },
  {
    id: "prod-008",
    name: "Copier Paper and Print Support Items",
    slug: "copier-paper-print-support-items",
    price: 120,
    priceLabel: "Price on request",
    categorySlug: "copier-solutions",
    images: ["/images/slider3.png"],
    rating: 4.2,
    description:
      "Copier-related paper and support items suited for shop counters, educational use, and office demand.",
    specification: "Available in different sizes, GSM options, and pack quantities.",
    delivery: "Standard delivery time applicable.",
    brand: "HETY Stationery",
    tags: ["copier", "paper", "printing", "office"]
  }
];
