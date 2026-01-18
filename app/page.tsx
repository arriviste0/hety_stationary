import HeroCarousel from "@/components/HeroCarousel";
import CategoryCircles from "@/components/CategoryCircles";
import ProductCarousel from "@/components/ProductCarousel";
import PromoBanners from "@/components/PromoBanners";
import NewsletterStrip from "@/components/NewsletterStrip";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <CategoryCircles />
      <ProductCarousel products={products} />
      <PromoBanners />
      <section id="brands" className="section-padding mx-auto py-16">
        <div className="rounded-3xl bg-brand-50 p-10 text-center">
          <p className="text-sm uppercase tracking-wide text-brand-500">
            Trusted brands
          </p>
          <h2 className="mt-2 text-3xl font-display text-brand-800">
            Curated partners for every desk
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            We collaborate with leading stationery makers across India and
            beyond to bring you reliable essentials and premium finds.
          </p>
        </div>
      </section>
      <NewsletterStrip />
    </div>
  );
}
