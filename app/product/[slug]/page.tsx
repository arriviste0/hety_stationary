import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";
import { mapProductToStorefrontProduct } from "@/lib/storefront";

type Props = {
  params: { slug: string };
};

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  await connectToDatabase();
  const productRecord = (await Product.findOne({
    slug: params.slug,
    "visibility.status": "Active"
  })
    .populate("category")
    .populate("brand")
    .lean()) as Record<string, any> | null;

  const product = productRecord ? mapProductToStorefrontProduct(productRecord) : null;

  if (!product) {
    notFound();
  }
  const category = productRecord?.category as Record<string, any> | undefined;
  const brand = productRecord?.brand as Record<string, any> | undefined;
  const detailItems = [
    {
      label: "Brand",
      value: product.brand || brand?.name || "HETY"
    },
    {
      label: "Stock",
      value:
        productRecord?.inventory?.stockQuantity !== undefined
          ? String(productRecord.inventory.stockQuantity)
          : "Available on request"
    },
    {
      label: "GST",
      value: productRecord?.pricing?.gstPercent
        ? `${productRecord.pricing.gstPercent}%`
        : "As applicable"
    },
    {
      label: "Delivery",
      value: product.delivery || "Standard delivery time applicable."
    }
  ];

  return (
    <section className="section-padding mx-auto py-12">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="transition-colors hover:text-brand-700">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="transition-colors hover:text-brand-700">
          Products
        </Link>
        <span>/</span>
        <span className="text-slate-700">{product.name}</span>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_52%,#fff8ed_100%)] shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-brand-100/80 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_48px_rgba(37,99,235,0.08)] backdrop-blur sm:p-8">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-700">
                  {category?.name || "Product"}
                </span>
                {product.brand ? (
                  <span className="rounded-full bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-700">
                    {product.brand}
                  </span>
                ) : null}
              </div>
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_35%,#ffffff_100%)] p-6">
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-200/30 blur-2xl" />
                <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-brand-200/30 blur-2xl" />
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={620}
                  height={520}
                  className="relative h-[260px] w-full object-contain sm:h-[420px]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-accent-pink">
              Featured Product
            </p>
            <h1 className="mt-3 text-4xl font-display leading-tight text-slate-900 sm:text-[3rem]">
              {product.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-end gap-4">
              <p className="text-3xl font-semibold text-brand-700">
                {product.priceLabel ?? `Rs. ${product.price}`}
              </p>
              <p className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
                Retail and wholesale
              </p>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[0.96rem]">
              {product.description}
            </p>

            {product.specification ? (
              <div className="mt-6 rounded-[1.5rem] border border-brand-100 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-pink">
                  Specification
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {product.specification}
                </p>
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {detailItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.25rem] border border-brand-100 bg-white/80 p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-brand-100 bg-white/90 p-5">
              <ProductActions product={product} />
              <p className="mt-4 text-xs leading-6 text-slate-400">
                Save items to your wishlist for later or add them directly to your cart.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "Reliable daily-use stationery",
                "Suitable for school and office demand",
                "Bulk and retail inquiries supported"
              ].map((point) => (
                <div
                  key={point}
                  className="rounded-[1.25rem] border border-dashed border-brand-200 bg-white/60 px-4 py-4 text-sm leading-6 text-slate-600"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
