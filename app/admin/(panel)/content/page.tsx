import { connectToDatabase } from "@/lib/mongodb";
import { AdminSetting } from "@/lib/models/adminSetting";
import { saveAdminSettings } from "@/lib/actions/settings";
import ProductMenuEditor from "@/components/admin/ProductMenuEditor";
import { Product } from "@/lib/models/product";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await connectToDatabase();
  const [settings, products] = await Promise.all([
    AdminSetting.findOne().lean() as Promise<Record<string, any> | null>,
    Product.find().sort({ name: 1 }).lean() as Promise<Array<Record<string, any>>>
  ]);
  const storefrontContent = settings?.storefrontContent || {};
  const productOptions = products.map((product) => ({
    id: String(product._id),
    name: String(product.name || ""),
    slug: String(product.slug || "")
  }));
  const productMenuSectionsSource =
    Array.isArray(storefrontContent.productsMenuSections) &&
    storefrontContent.productsMenuSections.length > 0
      ? storefrontContent.productsMenuSections
      : [
          {
            title: storefrontContent.productsMenuPrimaryTitle || "Retail and Wholesale",
            items: productOptions.slice(0, 4).map((product) => ({
              productId: product.id,
              label: product.name,
              href: `/product/${product.slug}`
            }))
          },
          {
            title: storefrontContent.productsMenuBrandsTitle || "Featured Brands",
            items: productOptions.slice(4, 7).map((product) => ({
              productId: product.id,
              label: product.name,
              href: `/product/${product.slug}`
            }))
          },
          {
            title: storefrontContent.productsMenuPopularTitle || "Popular Range",
            items: productOptions.slice(7, 9).map((product) => ({
              productId: product.id,
              label: product.name,
              href: `/product/${product.slug}`
            }))
          }
        ];
  const productMenuSections = productMenuSectionsSource.map((section: Record<string, any>) => ({
    title: String(section.title || ""),
    items: Array.isArray(section.items)
      ? section.items.map((item: Record<string, any>) => ({
          label: String(item.label || ""),
          href: String(item.href || "/#categories")
        }))
      : []
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Content</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage storefront labels and section copy shown on the home page.
        </p>
      </div>

      <form action={saveAdminSettings} className="grid gap-6 lg:grid-cols-2">
        <ProductMenuEditor
          initialSections={productMenuSections}
          productOptions={productOptions}
        />

        <div className="lg:col-span-2">
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
            Save Storefront Content
          </button>
        </div>
      </form>
    </div>
  );
}
