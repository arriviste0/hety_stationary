import type { Product as StorefrontProduct } from "@/data/products";

export type StorefrontCategory = {
  name: string;
  slug: string;
  image: string;
};

export function normalizeImageUrl(value: unknown, fallback = "/images/logo.png") {
  const src = String(value || "").trim();

  if (!src) {
    return fallback;
  }

  if (src.startsWith("/")) {
    return src;
  }

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  return fallback;
}

export function mapProductToStorefrontProduct(product: Record<string, any>): StorefrontProduct {
  const sellingPrice = Number(product.pricing?.sellingPrice || 0);
  const mrp = Number(product.pricing?.mrp || 0);
  const imageUrls = Array.isArray(product.imageUrls)
    ? product.imageUrls.map((item) => normalizeImageUrl(item, "")).filter(Boolean)
    : [];
  const categorySlug =
    (product.category as Record<string, any> | undefined)?.slug ||
    product.categorySlug ||
    "products";

  return {
    id: String(product._id || product.id || product.sku || product.slug),
    name: String(product.name || ""),
    slug: String(product.slug || ""),
    price: sellingPrice,
    priceLabel:
      product.pricing?.discountPrice && Number(product.pricing.discountPrice) > 0
        ? `Rs. ${Number(product.pricing.discountPrice)}`
        : mrp > 0
          ? `Rs. ${sellingPrice}`
          : "Price on request",
    categorySlug,
    images: imageUrls.length > 0 ? imageUrls : [fallbackImage()],
    description: String(product.description || product.shortDescription || ""),
    specification: [
      product.attributes?.size,
      product.attributes?.paperType,
      product.attributes?.gsm
    ]
      .filter(Boolean)
      .join(", ") || undefined,
    delivery: "Standard delivery time applicable.",
    brand:
      (product.brand as Record<string, any> | undefined)?.name ||
      product.attributes?.brandName ||
      "",
    tags: Array.isArray(product.visibility?.tags)
      ? product.visibility.tags.map((tag: Record<string, any> | string) =>
          typeof tag === "string" ? tag : String(tag.name || "")
        )
      : []
  };
}

export function mapCategoryToStorefrontCategory(category: Record<string, any>): StorefrontCategory {
  return {
    name: String(category.name || ""),
    slug: String(category.slug || ""),
    image: normalizeImageUrl(category.image)
  };
}

function fallbackImage() {
  return "/images/logo.png";
}
