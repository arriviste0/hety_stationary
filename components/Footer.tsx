import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-700 border-t border-brand-100">
      <div className="section-padding mx-auto grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-700">About Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/about" className="link-underline text-brand-600">About</Link>
            </li>
            <li>
              <Link href="/stores" className="link-underline text-brand-600">Stores</Link>
            </li>
            <li>
              <Link href="/contact" className="link-underline text-brand-600">Contact Us</Link>
            </li>
            <li>
              <Link href="/franchise" className="link-underline text-brand-600">
                Franchise Enquiry
              </Link>
            </li>
          </ul>
          <div className="mt-6 text-sm text-slate-500">
            <p>Hety Stationery Pvt. Ltd.</p>
            <p>12, Blue Lane, Ahmedabad, Gujarat</p>
            <p>+91 98765 43210</p>
            <p>hello@hetystationery.com</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-700">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/category/school-supplies" className="link-underline text-brand-600">
                School Supplies
              </Link>
            </li>
            <li>
              <Link href="/category/craft" className="link-underline text-brand-600">
                Art & Craft
              </Link>
            </li>
            <li>
              <Link href="/category/office-essentials" className="link-underline text-brand-600">
                Office Supplies
              </Link>
            </li>
            <li>
              <Link href="/category/premium-pens" className="link-underline text-brand-600">
                Premium Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-700">Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/privacy-policy" className="link-underline text-brand-600">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="link-underline text-brand-600">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="link-underline text-brand-600">Terms</Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="link-underline text-brand-600">
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-700">Newsletter</h3>
          <p className="mt-4 text-sm text-slate-600">
            Get launches, drops, and inspiration right in your inbox.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="input-base w-full rounded-full px-4 py-2 text-sm placeholder:text-slate-400"
            />
            <button
              type="button"
              className="rounded-full border border-transparent bg-accent-yellow px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-pink hover:bg-accent-pink hover:text-white hover:shadow-soft"
            >
              Send
            </button>
          </div>
          <div className="mt-6 flex items-center gap-4 text-brand-700">
            <a href="https://facebook.com" aria-label="Facebook" className="icon-btn">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="icon-btn">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="icon-btn">
              <Twitter size={18} />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="icon-btn">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-100 py-4 text-center text-xs text-slate-500">
        © 2024 Hety Stationery. All rights reserved.
      </div>
    </footer>
  );
}
