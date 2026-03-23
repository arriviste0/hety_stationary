"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white text-slate-700">
      <div className="section-padding mx-auto grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="HETY STATIONERY logo"
              width={64}
              height={64}
              className="h-14 w-14 rounded-xl object-contain"
            />
            <div>
              <h3 className="text-lg font-semibold text-accent-pink">Company</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                HETY STATIONERY
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            HAPY FRANCHISE LLP operates HETY STATIONERY - COPIER-ART & CRAFT as a
            retailer, wholesaler, and franchise-focused stationery business.
          </p>
          <div className="mt-6 space-y-2 text-sm text-slate-500">
            <p>GSTIN: 24AATFH1531J1ZB</p>
            <p>Established: 2026</p>
            <p>Business Type: Retailer / Wholesaler</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-accent-pink">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li><Link href="/products" className="link-underline text-brand-600">All Products</Link></li>
            <li><Link href="/categories" className="link-underline text-brand-600">All Categories</Link></li>
            <li><Link href="/about" className="link-underline text-brand-600">About Us</Link></li>
            <li><Link href="/stores" className="link-underline text-brand-600">Stores</Link></li>
            <li><Link href="/franchise" className="link-underline text-brand-600">Franchise</Link></li>
            <li><Link href="/contact" className="link-underline text-brand-600">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-accent-pink">Policies</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li><Link href="/privacy-policy" className="link-underline text-brand-600">Privacy Policy</Link></li>
            <li><Link href="/refund-policy" className="link-underline text-brand-600">Refund Policy</Link></li>
            <li><Link href="/terms" className="link-underline text-brand-600">Terms and Conditions</Link></li>
            <li><Link href="/shipping-policy" className="link-underline text-brand-600">Shipping Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-accent-pink">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-brand-600" />
              <span>
                6, Pramukh E Lite, Mota Chiloda, beside SBI Bank, Dehgam - Mota
                Chiloda Road, Gandhinagar, Gujarat 382355
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-brand-600" />
              <span>+91 97149 92464 / +91 98791 52220 / +91 9979242499</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-brand-600" />
              <a href="mailto:hapyfranchise@gmail.com" className="link-underline text-brand-600">
                hapyfranchise@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Instagram size={16} className="text-brand-600" />
              <span className="flex flex-wrap items-center gap-2">
                <a
                  href="https://www.instagram.com/hetystationerychiloda"
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-brand-600"
                >
                  @hetystationerychiloda
                </a>
                <span>/</span>
                <a
                  href="https://www.instagram.com/hetystationery"
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-brand-600"
                >
                  @hetystationery
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-100 py-4 text-center text-xs text-slate-500">
        Copyright 2026 HAPY FRANCHISE LLP. All rights reserved.
      </div>
    </footer>
  );
}
