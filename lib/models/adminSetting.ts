import mongoose, { Schema } from "mongoose";

const AdminSettingSchema = new Schema(
  {
    companyName: { type: String, default: "HAPY FRANCHISE LLP" },
    brandName: { type: String, default: "HETY STATIONERY - COPIER-ART & CRAFT" },
    gstNumber: { type: String, default: "24AATFH1531J1ZB" },
    shippingPolicy: { type: String, default: "Pan India shipping" },
    paymentModes: [{ type: String }],
    invoicePrefix: { type: String, default: "HETY" },
    companyAddress: { type: String, default: "" },
    storefrontContent: {
      productsMenuPrimaryTitle: { type: String, default: "Retail and Wholesale" },
      productsMenuBrandsTitle: { type: String, default: "Featured Brands" },
      productsMenuPopularTitle: { type: String, default: "Popular Range" },
      productsMenuSections: [
        {
          title: { type: String, required: true },
          items: [
            {
              productId: { type: String },
              label: { type: String, required: true },
              href: { type: String, default: "/#categories" }
            }
          ]
        }
      ],
      brandsSectionEyebrow: { type: String, default: "Product Range" },
      brandsSectionHeading: {
        type: String,
        default: "Trusted names across writing, office, and creative supply"
      },
      brandsSectionDescription: {
        type: String,
        default:
          "Stationery, copier, art and craft essentials"
      },
      brandsSectionBody: {
        type: String,
        default:
          "Featured products from our current business mix including HETY branding items, school essentials, office supplies, and creative materials."
      },
      brandsSectionItems: [{ type: String }],
      productRangeEyebrow: { type: String, default: "Product Range" },
      productRangeHeading: {
        type: String,
        default: "Stationery, copier, art and craft essentials"
      },
      productRangeDescription: {
        type: String,
        default:
          "Featured products from our current business mix including HETY branding items, school essentials, office supplies, and creative materials."
      }
    }
  },
  { timestamps: true }
);

export const AdminSetting =
  mongoose.models.AdminSetting || mongoose.model("AdminSetting", AdminSettingSchema);
