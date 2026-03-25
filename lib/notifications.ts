import nodemailer from "nodemailer";

const DEFAULT_ADMIN_EMAIL = "pranshu.arvind.patel@gmail.com";

type OrderNotificationItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderNotificationInput = {
  orderId: string;
  totalAmount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  notifyCustomer?: boolean;
  shippingAddress?: {
    name?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items: OrderNotificationItem[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
}

function formatAddress(address?: OrderNotificationInput["shippingAddress"]) {
  if (!address) return "Not provided";

  const lines = [
    address.name,
    address.phone,
    address.line1,
    address.line2,
    [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
    address.country
  ].filter(Boolean);

  return lines.length > 0 ? lines.join(", ") : "Not provided";
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user,
      pass
    }
  });
}

function buildItemsMarkup(items: OrderNotificationItem[]) {
  return items
    .map(
      (item) =>
        `<li>${item.name} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}</li>`
    )
    .join("");
}

function buildItemsText(items: OrderNotificationItem[]) {
  return items
    .map((item) => `- ${item.name} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}`)
    .join("\n");
}

export async function sendOrderPlacedNotifications(input: OrderNotificationInput) {
  const transporter = getTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;

  if (!transporter || !from) {
    return { skipped: true };
  }

  const itemListHtml = buildItemsMarkup(input.items);
  const itemListText = buildItemsText(input.items);
  const shippingAddress = formatAddress(input.shippingAddress);

  const sends: Promise<unknown>[] = [];

  sends.push(
    transporter.sendMail({
      from,
      to: adminEmail,
      subject: `New order placed: ${input.orderId}`,
      text: [
        "A new order has been placed.",
        `Order ID: ${input.orderId}`,
        `Customer: ${input.customerName}`,
        `Email: ${input.customerEmail || "Not provided"}`,
        `Phone: ${input.customerPhone || "Not provided"}`,
        `Total: ${formatCurrency(input.totalAmount)}`,
        `Shipping Address: ${shippingAddress}`,
        "Items:",
        itemListText
      ].join("\n"),
      html: `
        <div>
          <h2>New order placed</h2>
          <p><strong>Order ID:</strong> ${input.orderId}</p>
          <p><strong>Customer:</strong> ${input.customerName}</p>
          <p><strong>Email:</strong> ${input.customerEmail || "Not provided"}</p>
          <p><strong>Phone:</strong> ${input.customerPhone || "Not provided"}</p>
          <p><strong>Total:</strong> ${formatCurrency(input.totalAmount)}</p>
          <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
          <p><strong>Items:</strong></p>
          <ul>${itemListHtml}</ul>
        </div>
      `
    })
  );

  if (input.notifyCustomer && input.customerEmail) {
    sends.push(
      transporter.sendMail({
        from,
        to: input.customerEmail,
        subject: `Your HETY STATIONERY order ${input.orderId}`,
        text: [
          `Hi ${input.customerName},`,
          "",
          "Your order has been placed successfully.",
          `Order ID: ${input.orderId}`,
          `Total: ${formatCurrency(input.totalAmount)}`,
          `Shipping Address: ${shippingAddress}`,
          "",
          "Items:",
          itemListText,
          "",
          "We will contact you with the next update."
        ].join("\n"),
        html: `
          <div>
            <p>Hi ${input.customerName},</p>
            <p>Your order has been placed successfully.</p>
            <p><strong>Order ID:</strong> ${input.orderId}</p>
            <p><strong>Total:</strong> ${formatCurrency(input.totalAmount)}</p>
            <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
            <p><strong>Items:</strong></p>
            <ul>${itemListHtml}</ul>
            <p>We will contact you with the next update.</p>
          </div>
        `
      })
    );
  }

  await Promise.allSettled(sends);

  return { skipped: false };
}
