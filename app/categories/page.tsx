import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import { Product } from "@/lib/models/product";
import { mapCategoryToStorefrontCategory } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function AllCategoriesPage() {
  await connectToDatabase();

  const categories = (await Category.find({
    status: "Active",
    visibility: "Visible"
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean()) as Array<Record<string, any>>;

  const counts = await Product.aggregate([
    { $match: { "visibility.status": "Active" } },
    { $group: { _id: "$category", total: { $sum: 1 } } }
  ]);

  const countMap = new Map(
    counts.map((item) => [String(item._id), Number(item.total || 0)])
  );

  const categoryCards = categories.map((category) => ({
    ...mapCategoryToStorefrontCategory(category),
    id: String(category._id),
    description: String(category.description || ""),
    totalProducts: countMap.get(String(category._id)) || 0
  }));

  return (
    <section className="section-padding mx-auto py-12">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">All Categories</p>
        <h1 className="mt-2 text-4xl font-display text-brand-800">
          Explore every stationery category
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Browse all active categories across stationery, copier, office, art, and
          craft products.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryCards.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-soft transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent-pink"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-100 bg-brand-50">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition duration-300 ease-out group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-lg font-semibold text-brand-700">{category.name}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
              {category.description || "Browse products available in this category."}
            </p>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
              {category.totalProducts} products
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
