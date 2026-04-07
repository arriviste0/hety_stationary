import bcrypt from "bcryptjs";
import type { HydratedDocument } from "mongoose";
import { Category } from "@/lib/models/category";
import { Brand } from "@/lib/models/brand";
import { Product } from "@/lib/models/product";
import { Customer } from "@/lib/models/customer";
import { Order } from "@/lib/models/order";
import { OrderItem } from "@/lib/models/orderItem";
import { Inventory } from "@/lib/models/inventory";
import { Coupon } from "@/lib/models/coupon";
import { Vendor } from "@/lib/models/vendor";
import { PurchaseOrder } from "@/lib/models/purchaseOrder";
import { AdminUser } from "@/lib/models/adminUser";
import { AdminSetting } from "@/lib/models/adminSetting";
import { StockMovement } from "@/lib/models/stockMovement";

export async function seedAdminData() {
  const [categoryCount, productCount, adminUserCount, settingsCount] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
    AdminUser.countDocuments(),
    AdminSetting.countDocuments()
  ]);

  if (categoryCount === 0 && productCount === 0) {
    const categories = await Category.insertMany([
      {
        name: "Writing",
        slug: "writing",
        description: "Pens, pencils, markers, and writing accessories.",
        sortOrder: 1
      },
      {
        name: "School Supplies",
        slug: "school-supplies",
        description: "Daily classroom and student stationery.",
        sortOrder: 2
      },
      {
        name: "Art & Craft",
        slug: "art-craft",
        description: "Creative supplies for drawing, painting, and craft work.",
        sortOrder: 3
      },
      {
        name: "Office Essentials",
        slug: "office-essentials",
        description: "Files, desk tools, paper, and office support products.",
        sortOrder: 4
      },
      {
        name: "Paper",
        slug: "paper",
        description: "Copier paper and paper products.",
        sortOrder: 5
      }
    ]);

    const brands = await Brand.insertMany([
      { name: "HETY", status: "Active" },
      { name: "Camlin", status: "Active" },
      { name: "DOMS", status: "Active" },
      { name: "Officemate", status: "Active" }
    ]);

    const products = await Product.insertMany([
      {
        sku: "HETY-PEN-001",
        barcode: "890100000001",
        name: "Premium Gel Pen",
        slug: "premium-gel-pen",
        shortDescription: "Smooth daily-use gel pen.",
        description: "Reliable gel pen for retail, school, and office demand.",
        category: categories[0]._id,
        brand: brands[0]._id,
        pricing: {
          mrp: 60,
          sellingPrice: 45,
          costPrice: 30,
          discountPrice: 40,
          gstPercent: 12
        },
        inventory: { stockQuantity: 120, reorderLevel: 30, unit: "pcs" },
        imageUrls: ["/images/slider1.png"],
        visibility: { status: "Active", featured: true }
      },
      {
        sku: "DOMS-SCH-008",
        barcode: "890100000008",
        name: "Student Notebook A5",
        slug: "student-notebook-a5",
        shortDescription: "A5 ruled notebook for school use.",
        description: "High-rotation notebook suitable for school and retail counters.",
        category: categories[1]._id,
        brand: brands[2]._id,
        pricing: {
          mrp: 120,
          sellingPrice: 95,
          costPrice: 70,
          discountPrice: 90,
          gstPercent: 12
        },
        inventory: { stockQuantity: 45, reorderLevel: 20, unit: "pcs" },
        imageUrls: ["/images/notebooks.png"],
        visibility: { status: "Active", featured: false }
      },
      {
        sku: "CAM-ART-024",
        barcode: "890100000024",
        name: "Watercolor Set 24",
        slug: "watercolor-set-24",
        shortDescription: "24-color watercolor box.",
        description: "Popular art and craft supply for hobby, school, and creative buyers.",
        category: categories[2]._id,
        brand: brands[1]._id,
        pricing: {
          mrp: 560,
          sellingPrice: 499,
          costPrice: 410,
          discountPrice: 475,
          gstPercent: 18
        },
        inventory: { stockQuantity: 14, reorderLevel: 15, unit: "box" },
        imageUrls: ["/images/craft.png"],
        visibility: { status: "Active", featured: true }
      },
      {
        sku: "OFF-ORG-120",
        barcode: "890100000120",
        name: "Desk Organizer Kit",
        slug: "desk-organizer-kit",
        shortDescription: "Office desk organizer combo.",
        description: "Useful organizer product for office and gifting requirements.",
        category: categories[3]._id,
        brand: brands[3]._id,
        pricing: {
          mrp: 420,
          sellingPrice: 365,
          costPrice: 290,
          discountPrice: 340,
          gstPercent: 12
        },
        inventory: { stockQuantity: 8, reorderLevel: 12, unit: "pcs" },
        imageUrls: ["/images/Office_Supplies_27b30b26-e42d-4a26-9de0-5cca17c4cd83_720x.avif"],
        visibility: { status: "Inactive", featured: false }
      }
    ]);

    await Inventory.insertMany(
      products.map((product) => ({
        product: product._id,
        sku: product.sku,
        currentStock: product.inventory?.stockQuantity || 0,
        reorderLevel: product.inventory?.reorderLevel || 10,
        stockStatus:
          (product.inventory?.stockQuantity || 0) === 0
            ? "Out"
            : (product.inventory?.stockQuantity || 0) <
              (product.inventory?.reorderLevel || 0)
            ? "Low"
            : "In Stock",
        warehouse: "Main Warehouse"
      }))
    );

    const customers = await Customer.insertMany([
      {
        name: "Riya Shah",
        phone: "+91 90000 11111",
        email: "riya@demo.com",
        totalOrders: 5,
        totalSpend: 2450,
        lastOrderDate: new Date(),
        status: "Active"
      },
      {
        name: "Aman Singh",
        phone: "+91 90000 22222",
        email: "aman@demo.com",
        totalOrders: 2,
        totalSpend: 980,
        lastOrderDate: new Date(),
        status: "Active"
      }
    ]);

    const order = (await Order.create({
      orderId: "ORD-10021",
      customer: customers[0]._id,
      paymentStatus: "Paid",
      orderStatus: "Packed",
      totalAmount: 640,
      shippingStatus: "In Transit",
      source: "Web",
      invoiceNumber: "INV-2026-0021",
      shippingAddress: {
        name: "Riya Shah",
        phone: "+91 90000 11111",
        line1: "9, Sunrise Ave",
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380001",
        country: "India"
      }
    })) as HydratedDocument<unknown>;

    const items = await OrderItem.insertMany([
      {
        order: order._id,
        product: products[0]._id,
        sku: products[0].sku,
        name: products[0].name,
        quantity: 3,
        price: 45,
        discount: 0,
        tax: 6
      },
      {
        order: order._id,
        product: products[1]._id,
        sku: products[1].sku,
        name: products[1].name,
        quantity: 2,
        price: 95,
        discount: 10,
        tax: 12
      }
    ]);

    await Order.updateOne(
      { _id: order._id },
      { items: items.map((item) => item._id) }
    );

    const vendors = await Vendor.insertMany([
      {
        supplierName: "Office Depot India",
        contactPerson: "Arvind Patel",
        phone: "+91 90000 33333",
        email: "vendor@office.com",
        address: "Ahmedabad, Gujarat",
        gstNumber: "24ABCDE1234F1Z2"
      },
      {
        supplierName: "Artline Suppliers",
        contactPerson: "Pooja Shah",
        phone: "+91 90000 44444",
        email: "sales@artline.com",
        address: "Vadodara, Gujarat",
        gstNumber: "24AACCT8910F1Z2"
      }
    ]);

    await PurchaseOrder.insertMany([
      {
        poNumber: "PO-2401",
        vendor: vendors[0]._id,
        status: "Pending",
        totalAmount: 12400,
        items: [
          {
            product: products[0]._id,
            sku: products[0].sku,
            name: products[0].name,
            quantity: 100,
            receivedQuantity: 0,
            costPrice: 30
          }
        ]
      },
      {
        poNumber: "PO-2402",
        vendor: vendors[1]._id,
        status: "Received",
        totalAmount: 8200,
        receivedDate: new Date(),
        items: [
          {
            product: products[2]._id,
            sku: products[2].sku,
            name: products[2].name,
            quantity: 20,
            receivedQuantity: 20,
            costPrice: 410
          }
        ]
      }
    ]);

    await Coupon.insertMany([
      {
        code: "HETY10",
        type: "Percentage",
        discountValue: 10,
        minimumCartValue: 500,
        maximumDiscount: 200,
        isActive: true
      },
      {
        code: "SHIPFREE",
        type: "Flat",
        discountValue: 120,
        minimumCartValue: 999,
        maximumDiscount: 120,
        isActive: false
      }
    ]);

    await StockMovement.insertMany([
      {
        product: products[0]._id,
        sku: products[0].sku,
        quantityChange: 50,
        reason: "Opening stock",
        reference: "SEED",
        user: "system"
      },
      {
        product: products[2]._id,
        sku: products[2].sku,
        quantityChange: -2,
        reason: "Sample issue",
        reference: "SEED",
        user: "system"
      }
    ]);
  }

  if (adminUserCount === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await AdminUser.insertMany([
      {
        name: "Super Admin",
        email: "admin@hetystationery.com",
        passwordHash,
        role: "super_admin"
      },
      {
        name: "Product Manager",
        email: "products@hetystationery.com",
        passwordHash,
        role: "product_manager"
      },
      {
        name: "Order Manager",
        email: "orders@hetystationery.com",
        passwordHash,
        role: "order_manager"
      },
      {
        name: "Inventory Manager",
        email: "inventory@hetystationery.com",
        passwordHash,
        role: "inventory_manager"
      }
    ]);
  }

  if (settingsCount === 0) {
    await AdminSetting.create({
      companyName: "HAPY FRANCHISE LLP",
      brandName: "HETY STATIONERY - COPIER-ART & CRAFT",
      gstNumber: "24AATFH1531J1ZB",
      shippingPolicy: "Pan India shipping with customer-paid freight",
      paymentModes: ["Cash", "Online"],
      invoicePrefix: "HETY",
      companyAddress:
        "6, Pramukh E Lite, Mota Chiloda, beside SBI Bank, Gandhinagar, Gujarat",
      storefrontContent: {
        productsMenuPrimaryTitle: "Retail and Wholesale",
        productsMenuBrandsTitle: "Featured Brands",
        productsMenuPopularTitle: "Popular Range",
        productsMenuSections: [
          {
            title: "Retail and Wholesale",
            items: [
              { label: "Writing", href: "/category/writing" },
              { label: "School Supplies", href: "/category/school-supplies" },
              { label: "Art & Craft", href: "/category/art-craft" },
              { label: "Office Essentials", href: "/category/office-essentials" }
            ]
          },
          {
            title: "Featured Brands",
            items: [
              { label: "HETY", href: "/#brands" },
              { label: "Camlin", href: "/#brands" },
              { label: "DOMS", href: "/#brands" },
              { label: "Officemate", href: "/#brands" }
            ]
          },
          {
            title: "Popular Range",
            items: [
              { label: "Paper", href: "/category/paper" },
              { label: "Premium Gel Pen", href: "/#trending" },
              { label: "Student Notebook A5", href: "/#trending" },
              { label: "Watercolor Set 24", href: "/#trending" }
            ]
          }
        ],
        brandsSectionEyebrow: "Product Range",
        brandsSectionHeading: "Trusted names across writing, office, and creative supply",
        brandsSectionDescription: "Stationery, copier, art and craft essentials",
        brandsSectionBody:
          "Explore a practical mix of HETY-branded products, school supplies, office essentials, and art materials selected for daily use.",
        brandsSectionItems: ["HETY", "Camlin", "DOMS", "Officemate"],
        productRangeEyebrow: "Product Range",
        productRangeHeading: "Everyday stationery for school, office, and creative work",
        productRangeDescription:
          "Explore a practical mix of HETY-branded products, school supplies, office essentials, and art materials selected for daily use."
      }
    });
  }

  return {
    skipped: categoryCount > 0 || productCount > 0,
    adminUsersSeeded: adminUserCount === 0,
    settingsSeeded: settingsCount === 0
  };
}
