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

function buildItemsText(items: OrderNotificationItem[]) {
  return items
    .map((item) => `- ${item.name} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}`)
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildItemsTableRows(items: OrderNotificationItem[]) {
  return items
    .map((item) => {
      const itemTotal = formatCurrency(item.price * item.quantity);
      return `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
            ${escapeHtml(item.name)}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #475569; font-size: 14px; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right; white-space: nowrap;">
            ${itemTotal}
          </td>
        </tr>
      `;
    })
    .join("");
}

function buildEmailShell(title: string, eyebrow: string, intro: string, body: string) {
  return `
    <div style="margin:0; padding:24px 12px; background:#f4f1ea;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e7dfd3; border-radius:20px; overflow:hidden;">
        <div style="padding:28px 32px; background:linear-gradient(135deg, #1f3b2f 0%, #35594a 100%); color:#ffffff;">
          <p style="margin:0 0 8px; font-size:12px; letter-spacing:1.6px; text-transform:uppercase; opacity:0.78;">${eyebrow}</p>
          <h1 style="margin:0 0 10px; font-size:28px; line-height:1.2; font-weight:700;">${title}</h1>
          <p style="margin:0; font-size:15px; line-height:1.7; color:rgba(255,255,255,0.88);">${intro}</p>
        </div>
        <div style="padding:32px;">
          ${body}
        </div>
      </div>
    </div>
  `;
}

function buildSummaryGrid(input: OrderNotificationInput, shippingAddress: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px; border-collapse:separate; border-spacing:0;">
      <tr>
        <td style="width:50%; padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; vertical-align:top;">
          <p style="margin:0 0 8px; font-size:12px; text-transform:uppercase; letter-spacing:1.3px; color:#64748b;">Order ID</p>
          <p style="margin:0; font-size:18px; font-weight:700; color:#0f172a;">${escapeHtml(input.orderId)}</p>
        </td>
        <td style="width:16px;"></td>
        <td style="width:50%; padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; vertical-align:top;">
          <p style="margin:0 0 8px; font-size:12px; text-transform:uppercase; letter-spacing:1.3px; color:#64748b;">Order Total</p>
          <p style="margin:0; font-size:18px; font-weight:700; color:#0f172a;">${formatCurrency(input.totalAmount)}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px; border-collapse:separate; border-spacing:0;">
      <tr>
        <td style="padding:18px; background:#fcfaf6; border:1px solid #eee4d7; border-radius:16px;">
          <p style="margin:0 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:1.3px; color:#8a6d46;">Shipping Address</p>
          <p style="margin:0; font-size:14px; line-height:1.7; color:#334155;">${escapeHtml(shippingAddress)}</p>
        </td>
      </tr>
    </table>
  `;
}

function buildItemsTable(items: OrderNotificationItem[]) {
  return `
    <div style="margin:0 0 24px; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
      <div style="padding:16px 20px; background:#f8fafc; border-bottom:1px solid #e5e7eb;">
        <p style="margin:0; font-size:14px; font-weight:700; color:#0f172a;">Items Ordered</p>
      </div>
      <div style="padding:0 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <thead>
            <tr>
              <th align="left" style="padding:14px 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:1.1px; color:#64748b;">Product</th>
              <th align="center" style="padding:14px 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:1.1px; color:#64748b;">Qty</th>
              <th align="right" style="padding:14px 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:1.1px; color:#64748b;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${buildItemsTableRows(items)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function buildAdminEmailHtml(input: OrderNotificationInput, shippingAddress: string) {
  const customerEmail = input.customerEmail || "Not provided";
  const customerPhone = input.customerPhone || "Not provided";

  return buildEmailShell(
    "New Order Received",
    "HETY STATIONERY",
    "A new web order has been placed and is ready for review in the admin panel.",
    `
      ${buildSummaryGrid(input, shippingAddress)}
      <div style="margin:0 0 24px; padding:18px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px;">
        <p style="margin:0 0 12px; font-size:14px; font-weight:700; color:#0f172a;">Customer Details</p>
        <p style="margin:0 0 6px; font-size:14px; line-height:1.7; color:#334155;"><strong>Name:</strong> ${escapeHtml(input.customerName)}</p>
        <p style="margin:0 0 6px; font-size:14px; line-height:1.7; color:#334155;"><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
        <p style="margin:0; font-size:14px; line-height:1.7; color:#334155;"><strong>Phone:</strong> ${escapeHtml(customerPhone)}</p>
      </div>
      ${buildItemsTable(input.items)}
    `
  );
}

function buildCustomerEmailHtml(input: OrderNotificationInput, shippingAddress: string) {
  return buildEmailShell(
    "Your Order Is Confirmed",
    "THANK YOU FOR SHOPPING",
    `Hi ${escapeHtml(input.customerName)}, your order has been placed successfully. We will share the next update once it is processed.`,
    `
      ${buildSummaryGrid(input, shippingAddress)}
      ${buildItemsTable(input.items)}
      <div style="padding:18px; background:#1f3b2f; border-radius:16px; color:#ffffff;">
        <p style="margin:0 0 8px; font-size:14px; font-weight:700;">What happens next</p>
        <p style="margin:0; font-size:14px; line-height:1.7; color:rgba(255,255,255,0.88);">
          Our team will review your order and contact you with shipping or payment updates if needed.
        </p>
      </div>
    `
  );
}

export async function sendOrderPlacedNotifications(input: OrderNotificationInput) {
  const transporter = getTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;

  if (!transporter || !from) {
    return { skipped: true };
  }

  const itemListText = buildItemsText(input.items);
  const shippingAddress = formatAddress(input.shippingAddress);
  const adminHtml = buildAdminEmailHtml(input, shippingAddress);
  const customerHtml = buildCustomerEmailHtml(input, shippingAddress);

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
      html: adminHtml
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
        html: customerHtml
      })
    );
  }

  await Promise.allSettled(sends);

  return { skipped: false };
}
