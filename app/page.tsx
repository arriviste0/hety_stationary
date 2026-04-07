import HeroCarousel from "@/components/HeroCarousel";
import CategoryCircles from "@/components/CategoryCircles";
import ProductCarousel from "@/components/ProductCarousel";
import PromoBanners from "@/components/PromoBanners";
import NewsletterStrip from "@/components/NewsletterStrip";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import { Brand } from "@/lib/models/brand";
import { AdminSetting } from "@/lib/models/adminSetting";
import { Product } from "@/lib/models/product";
import { mapProductToStorefrontProduct, normalizeImageUrl } from "@/lib/storefront";

export const dynamic = "force-dynamic";

const legacyProductRangeHeading = "Stationery, copier, art and craft essentials";
const legacyProductRangeDescription =
  "Featured products from our current business mix including HETY branding items, school essentials, office supplies, and creative materials.";
const defaultProductRangeHeading = "Everyday stationery for school, office, and creative work";
const defaultProductRangeDescription =
  "Explore a practical mix of HETY-branded products, school supplies, office essentials, and art materials selected for daily use.";

const quickPoints = [
  {
    title: "Retail and wholesale",
    text: "Supplying stationery, copier, art and craft products for daily business demand."
  },
  {
    title: "Franchise growth",
    text: "Offering expansion opportunities for people interested in the stationery business."
  },
  {
    title: "Service standards",
    text: "Focused on on-time delivery, effective pricing, quality, and customization."
  }
];

const fallbackCategories = [
  {
    name: "Branding Items",
    slug: "branding-items",
    image: "/images/hety_stationary.png"
  },
  {
    name: "Writing Instruments",
    slug: "writing-instruments",
    image: "/images/Premium_Pens_720x.avif"
  },
  {
    name: "School Supplies",
    slug: "school-supplies",
    image: "/images/School_Supplies_720x.avif"
  },
  {
    name: "Art and Craft",
    slug: "art-and-craft",
    image: "/images/craft.png"
  },
  {
    name: "Office Supplies",
    slug: "office-supplies",
    image: "/images/Office_Supplies_27b30b26-e42d-4a26-9de0-5cca17c4cd83_720x.avif"
  },
  {
    name: "Copier Solutions",
    slug: "copier-solutions",
    image: "/images/slider1.png"
  },
  {
    name: "Premium Stationery",
    slug: "premium-stationery",
    image: "/images/slider3.png"
  }
];

export default async function Home() {
  let categoryList = fallbackCategories;
  let brandList = ["HETY", "Flair", "DOMS", "Saino", "Camlin", "Aerotix", "Officemate"];
  let featuredProducts = [] as ReturnType<typeof mapProductToStorefrontProduct>[];
  let productRangeSection = {
    eyebrow: "Product Range",
    heading: defaultProductRangeHeading,
    description: defaultProductRangeDescription
  };
  let brandsSection = {
    eyebrow: "Product Range",
    heading: "Trusted names across writing, office, and creative supply",
    description: "Stationery, copier, art and craft essentials",
    body:
      "Featured products from our current business mix including HETY branding items, school essentials, office supplies, and creative materials."
  };

  try {
    await connectToDatabase();

    const [categories, brands, settings, products] = await Promise.all([
      Category.find({ status: "Active", visibility: "Visible" })
        .sort({ sortOrder: 1, name: 1 })
        .limit(7)
        .lean(),
      Brand.find({ status: "Active" }).sort({ name: 1 }).lean(),
      AdminSetting.findOne().lean(),
      Product.find({ "visibility.status": "Active" })
        .populate("category")
        .populate("brand")
        .sort({ "visibility.featured": -1, updatedAt: -1 })
        .limit(8)
        .lean()
    ]);

    if (categories.length > 0) {
      categoryList = (categories as Array<Record<string, any>>).map((category) => ({
        name: category.name,
        slug: category.slug,
        image: normalizeImageUrl(category.image)
      }));
    }

    if (brands.length > 0) {
      brandList = (brands as Array<Record<string, any>>).map((brand) => brand.name);
    }

    if (products.length > 0) {
      featuredProducts = (products as Array<Record<string, any>>).map(mapProductToStorefrontProduct);
    }

    const storefrontContent = (settings as Record<string, any> | null)?.storefrontContent;
    if (storefrontContent) {
      productRangeSection = {
        eyebrow:
          storefrontContent.productRangeEyebrow || productRangeSection.eyebrow,
        heading:
          storefrontContent.productRangeHeading === legacyProductRangeHeading
            ? defaultProductRangeHeading
            : storefrontContent.productRangeHeading || productRangeSection.heading,
        description:
          storefrontContent.productRangeDescription === legacyProductRangeDescription
            ? defaultProductRangeDescription
            : storefrontContent.productRangeDescription || productRangeSection.description
      };

      brandsSection = {
        eyebrow: storefrontContent.brandsSectionEyebrow || brandsSection.eyebrow,
        heading: storefrontContent.brandsSectionHeading || brandsSection.heading,
        description:
          storefrontContent.brandsSectionDescription || brandsSection.description,
        body: storefrontContent.brandsSectionBody || brandsSection.body
      };

      if (
        Array.isArray(storefrontContent.brandsSectionItems) &&
        storefrontContent.brandsSectionItems.length > 0
      ) {
        brandList = storefrontContent.brandsSectionItems
          .map((item: unknown) => String(item || "").trim())
          .filter(Boolean);
      }
    }
  } catch {
    // Keep storefront fallbacks if database content is unavailable.
  }

  return (
    <div>
      <HeroCarousel />

      <section className="section-padding mx-auto -mt-8 relative z-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {quickPoints.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.75rem] border border-brand-100 bg-white p-6 shadow-soft"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div id="categories">
        <CategoryCircles categories={categoryList} />
      </div>

      <ProductCarousel products={featuredProducts} content={productRangeSection} />
      <PromoBanners />

      <section id="brands" className="section-padding mx-auto py-16">
        <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-500">
                {brandsSection.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-display text-brand-800">
                {brandsSection.heading}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                {brandsSection.description}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                {brandsSection.body}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {brandList.map((brand) => (
              <div
                key={brand}
                className="rounded-full border border-brand-100 bg-brand-50 px-5 py-3 text-sm font-semibold text-brand-700"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterStrip />
    </div>
  );
}
