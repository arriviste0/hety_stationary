"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Trending Now", href: "/#trending" },
  { label: "School Supplies", href: "/category/school-supplies" },
  { label: "Art & Craft", href: "/category/craft" },
  { label: "Office Supplies", href: "/category/office-essentials" },
  { label: "Premium Products", href: "/category/premium-pens" },
  { label: "Shop by brands", href: "/#brands" },
  { label: "Gift Collections", href: "/#gifts" }
];

const megaMenus = {
  "School Supplies": [
    {
      title: "Stationery Basics",
      items: ["Pencils", "Sharpeners", "Erasers", "Mechanical Pencils", "Diaries", "Notebooks", "Drawing Books", "Geometry Tools", "Exam Boards", "Glue/Adhesives"]
    },
    {
      title: "School Utility",
      items: ["Ball Pens", "Roller Ball Pens", "Fountain Pens", "Highlighters", "Permanent Markers", "White Board Markers", "White/Chalk Boards"]
    },
    {
      title: "Junior Art",
      items: ["Poster Colors", "Acrylic Colors", "Water Colors", "Color Pencils", "Tempera Colors", "Sketch Books", "Crayons", "Glass Colors", "Sketch Pens", "Face Paints"]
    },
    {
      title: "School Products",
      items: ["School Bags", "Pencil Cases", "Water Bottles", "Lunch Boxes", "Pen Stands", "Calculators", "Study Table"]
    }
  ],
  "Art & Craft": [
    {
      title: "Art Paints",
      items: ["Acrylic Colours", "Water Colours", "Gouache Colors", "Fabric Colors", "Chalk Paints", "Alcohol Inks", "Pastel Colors", "Oil Colors", "Drawing Inks", "Spray Paints"]
    },
    {
      title: "Markers For Art",
      items: ["Fabric Markers", "Sketch Markers", "Brush Markers", "Glass Markers", "Acrylic Markers"]
    },
    {
      title: "Papers And Canvases",
      items: ["Water Color Papers", "Acrylic Papers", "Synthetic Papers", "Drawing Papers/Pads", "Mix Media Papers", "Stretched Canvas"]
    },
    {
      title: "Craft",
      items: ["Crafting Clay", "Stencils", "Spray Paints", "Tie Dye", "Craft Tools", "Craft Decor", "Card Stock Papers", "Miniature Decor"]
    }
  ],
  "Office Supplies": [
    {
      title: "Office Basics",
      items: ["Ball Pen", "Roller Ball Pen", "Fountain Pen", "Highlighters", "Note Pads", "Memo Pads", "Sticky Notes", "Adhesives", "Tapes", "Pen Drives"]
    },
    {
      title: "Office Utility",
      items: ["White Board Markers", "Permanent Markers", "White/Chalk Boards", "Staplers", "Punches", "Scissors", "Cutters", "Pins and Clips"]
    },
    {
      title: "Office Add On's",
      items: ["Stamp Pad", "Office Tools", "Paper Weight", "Card Holder", "Tea Coasters", "Laptop Sleeves", "Accessories Bag", "Printing Papers"]
    },
    {
      title: "Files And Folders",
      items: ["Paper Files", "Plastic Files", "Leather Files", "Folders"]
    }
  ],
  "Premium Products": [
    {
      title: "Writing Instruments",
      items: ["Fountain Pens", "Roller Ball Pens", "Ball Point Pens", "Premium Pens", "Pencils"]
    },
    {
      title: "Inks And Refills",
      items: ["Inks", "Refills"]
    },
    {
      title: "Accessories",
      items: ["Laptop Sleeves", "Laptop Bags", "Accessories Bag", "Wallets", "Cufflinks"]
    },
    {
      title: "Diaries and Planners",
      items: ["Soft Bound Diaries", "Hard Bound Diaries", "Leather Cover Diaries", "Planners"]
    }
  ],
  "Shop by brands": [
    {
      title: "Brands A-L",
      items: ["Beyond", "Brustro", "Camlin", "Copic", "Cross", "Epoke", "Faber Castell", "Icraft", "Just Spray", "Kaco"]
    },
    {
      title: "Brands M-R",
      items: ["Keyroad", "Lamy", "Lapis Bard", "Liquitex", "Magnet", "Maped", "Navneet", "Paper Club", "Parker", "Pebeo"]
    },
    {
      title: "Brands S-Z",
      items: ["Pentel", "Pidilite", "Pilot", "Rystor", "View All"]
    }
  ]
} as const;

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, toggleCart, wishlist } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="border-b border-brand-100 text-accent-pink text-xs sm:text-sm py-2">
        <div className="section-padding mx-auto flex items-center justify-center gap-2">
          <span>Free shipping on orders over ₹999</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Crafted for creative minds</span>
        </div>
      </div>

      <div className="section-padding mx-auto flex items-center justify-between py-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="text-xl sm:text-2xl font-display text-brand-700"
          >
            Hety Stationery
          </Link>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-700"
        >
          {navLinks.map((link) => {
            const mega = megaMenus[link.label as keyof typeof megaMenus];
            return (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className="link-underline inline-flex items-center gap-1 text-brand-600"
                >
                  {link.label}
                  {mega && <ChevronDown size={14} className="text-brand-600" />}
                </Link>
                {mega && (
                  <div className="invisible absolute left-1/2 top-full z-20 mt-5 w-[920px] -translate-x-1/2 rounded-2xl border border-brand-100 bg-white p-6 shadow-soft opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100">
                    <div className="grid grid-cols-4 gap-6">
                      {mega.map((group) => (
                        <div key={group.title}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-accent-pink">
                            {group.title}
                          </p>
                          <div className="mt-3 space-y-2 text-sm text-slate-600">
                            {group.items.map((item) => (
                              <Link
                                key={item}
                                href={link.href}
                                className="block rounded-lg px-2 py-1 transition-all duration-200 ease-out hover:bg-accent-pink/10 hover:text-brand-700"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="icon-btn p-2 text-brand-700"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <Link
            href="/wishlist"
            className="icon-btn relative p-2 text-brand-700"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-yellow text-[10px] text-slate-900">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className="icon-btn p-2 text-brand-700"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={toggleCart}
        className="btn-primary fixed right-6 top-1/2 z-50 flex h-14 w-14 -translate-y-1/2 items-center justify-center shadow-card"
        aria-label="Open cart"
      >
        <ShoppingBag size={22} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-yellow text-[11px] font-semibold text-slate-900">
            {cartCount}
          </span>
        )}
      </button>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
    </header>
  );
}
