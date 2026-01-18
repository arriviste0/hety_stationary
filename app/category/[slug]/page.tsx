import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: { slug: string };
};

export default function CategoryPage({ params }: Props) {
  const category = categories.find((item) => item.slug === params.slug);
  if (!category) {
    notFound();
  }
  const filtered = products.filter(
    (product) => product.categorySlug === category.slug
  );

  return (
    <section className="section-padding mx-auto py-12">
      <div className="rounded-3xl bg-brand-50 p-8">
        <p className="text-sm uppercase tracking-wide text-brand-500">
          Category
        </p>
        <h1 className="mt-2 text-4xl font-display text-brand-800">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Curated stationery picks for {category.name.toLowerCase()}.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500">No products found.</p>
        )}
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
