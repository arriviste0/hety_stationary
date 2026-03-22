import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/ProductAddToCart";
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
          <p className="text-sm uppercase tracking-wide text-brand-500">{category?.name || "-"}</p>
          <h1 className="mt-2 text-4xl font-display text-slate-900">{product.name}</h1>
          <p className="mt-4 text-lg text-brand-700">
            {product.priceLabel ?? `Rs. ${product.price}`}
          </p>
          <p className="mt-4 text-sm text-slate-600">{product.description}</p>
          {product.brand && (
            <p className="mt-3 text-sm text-slate-500">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          )}
          {product.specification && (
            <p className="mt-3 text-sm text-slate-500">
              Specifications: <span className="font-medium">{product.specification}</span>
            </p>
          )}
          {productRecord?.pricing?.gstPercent ? (
            <p className="mt-3 text-sm text-slate-500">
              GST: <span className="font-medium">{productRecord.pricing.gstPercent}%</span>
            </p>
          ) : null}
          {productRecord?.inventory?.stockQuantity !== undefined ? (
            <p className="mt-3 text-sm text-slate-500">
              Stock: <span className="font-medium">{productRecord.inventory.stockQuantity}</span>
            </p>
          ) : null}
          {product.delivery && (
            <p className="mt-3 text-sm text-slate-500">
              Delivery: <span className="font-medium">{product.delivery}</span>
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <AddToCartButton product={product} />
            <p className="text-xs text-slate-400">Retail and wholesale business</p>
          </div>
        </div>
      </div>
    </section>
  );
}
