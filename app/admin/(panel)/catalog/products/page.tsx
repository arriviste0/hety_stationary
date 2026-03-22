import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";
import { Category } from "@/lib/models/category";
import { Brand } from "@/lib/models/brand";
import ProductsTable from "@/components/admin/ProductsTable";
import Pagination from "@/components/admin/Pagination";
import { deleteProduct } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { page?: string };
}) {
  await connectToDatabase();
  const page = Number(searchParams.page || 1);
  const limit = 20;
  const total = await Product.countDocuments();
  const products = (await Product.find()
    .populate("category")
    .populate("brand")
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()) as unknown as Array<Record<string, any>>;
  const categories = (await Category.find().sort({ name: 1 }).lean()) as unknown as Array<{ name: string }>;
  const brands = (await Brand.find().sort({ name: 1 }).lean()) as unknown as Array<{ name: string }>;

  const categoryNames = categories.map((category) => category.name);
  const brandNames = brands.map((brand) => brand.name);
  const rows = products.map((product) => ({
    ...product,
    _id: product._id.toString(),
    category: (product.category as { name?: string })?.name,
    brand: (product.brand as { name?: string })?.name,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : undefined
  })) as any;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-100">
              Catalog
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Products</h1>
            <p className="mt-2 text-sm text-blue-100">
              Create, update, and sync products with Marg ERP.
            </p>
          </div>
          <Link
            href="/admin/marg-sync"
            className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Go to Marg Sync
          </Link>
        </div>
      </div>
      <ProductsTable
        products={rows}
        categories={categoryNames}
        brands={brandNames}
        deleteProduct={deleteProduct}
      />
      <Pagination page={page} total={total} limit={limit} basePath="/admin/catalog/products" />
    </div>
  );
}
