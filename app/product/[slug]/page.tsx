import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import AddToCartButton from "@/components/ProductAddToCart";

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const product = products.find((item) => item.slug === params.slug);
  if (!product) {
    notFound();
  }
  const category = categories.find(
    (item) => item.slug === product.categorySlug
  );

  return (
    <section className="section-padding mx-auto py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl bg-brand-50 p-8">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={520}
            height={420}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-500">
            {category?.name}
          </p>
          <h1 className="mt-2 text-4xl font-display text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-brand-700">?{product.price}</p>
          <p className="mt-4 text-sm text-slate-600">{product.description}</p>
          {product.brand && (
            <p className="mt-3 text-sm text-slate-500">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <AddToCartButton product={product} />
            <p className="text-xs text-slate-400">
              Free shipping above ?999
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
