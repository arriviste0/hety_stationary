import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { Product } from "@/lib/models/product";
import { getCustomerSession } from "@/lib/customer-auth";
import { mapProductToStorefrontProduct } from "@/lib/storefront";

export const dynamic = "force-dynamic";

function normalizeWishlist(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return Array.from(
    new Set(
      input
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )
  );
}

export async function GET() {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customer = (await Customer.findById(session.id).lean()) as Record<string, any> | null;

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const wishlist = normalizeWishlist(customer.wishlist);
  const products = wishlist.length
    ? ((await Product.find({
        _id: { $in: wishlist },
        "visibility.status": "Active"
      })
        .populate("category")
        .populate("brand")
        .lean()) as Array<Record<string, any>>)
    : [];

  return NextResponse.json({
    wishlist,
    products: products.map(mapProductToStorefrontProduct)
  });
}

export async function PATCH(request: Request) {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    wishlist?: unknown;
  };

  const wishlist = normalizeWishlist(body.wishlist);

  await Customer.updateOne(
    { _id: session.id },
    { $set: { wishlist } }
  );

  return NextResponse.json({ ok: true, wishlist });
}
