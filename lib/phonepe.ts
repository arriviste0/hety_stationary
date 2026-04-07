type PhonePeTokenResponse = {
  access_token: string;
  expires_at?: number | null;
  token_type?: string;
};

type PhonePeCreatePaymentResponse = {
  orderId: string;
  state: string;
  redirectUrl: string;
  expireAt?: number;
};

type PhonePeOrderStatusResponse = {
  orderId: string;
  state: "PENDING" | "FAILED" | "COMPLETED";
  amount: number;
  paymentDetails?: Array<{
    paymentMode?: string;
    transactionId?: string;
    state?: string;
    rail?: Record<string, unknown>;
    instrument?: Record<string, unknown>;
  }>;
  errorCode?: string;
  detailedErrorCode?: string;
};

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function getPhonePeBaseUrl() {
  return process.env.PHONEPE_ENV === "production"
    ? "https://api.phonepe.com"
    : "https://api-preprod.phonepe.com";
}

function getPhonePeAuthUrl() {
  return process.env.PHONEPE_ENV === "production"
    ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
}

export function isPhonePeConfigured() {
  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION;

  if (!clientId || !clientSecret || !clientVersion) {
    return false;
  }

  if (
    clientId.startsWith("DEMO_") ||
    clientSecret.startsWith("DEMO_")
  ) {
    return false;
  }

  return true;
}

function getAppBaseUrl(request?: Request) {
  const configuredUrl =
    process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (!request) {
    throw new Error("APP_URL is required when request context is unavailable.");
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const protocol = forwardedProto || "http";

  if (!host) {
    throw new Error("Could not resolve application base URL.");
  }

  return `${protocol}://${host}`;
}

async function getPhonePeAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION;

  if (!clientId || !clientSecret || !clientVersion) {
    throw new Error("PhonePe credentials are not configured.");
  }

  const response = await fetch(getPhonePeAuthUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_version: clientVersion,
      client_secret: clientSecret,
      grant_type: "client_credentials"
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`PhonePe auth failed: ${errorBody}`);
  }

  const data = (await response.json()) as PhonePeTokenResponse;
  const expiresAtMs = (data.expires_at || Math.floor(Date.now() / 1000) + 900) * 1000;

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: expiresAtMs
  };

  return data.access_token;
}

function getPhonePeHeaders(accessToken: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `O-Bearer ${accessToken}`
  };
}

export async function createPhonePePayment(input: {
  merchantOrderId: string;
  amountPaisa: number;
  redirectPath?: string;
  request?: Request;
}) {
  const accessToken = await getPhonePeAccessToken();
  const baseUrl = getAppBaseUrl(input.request);
  const redirectUrl = `${baseUrl}${input.redirectPath || "/payment/phonepe"}?merchantOrderId=${encodeURIComponent(
    input.merchantOrderId
  )}`;

  const response = await fetch(`${getPhonePeBaseUrl()}/apis/${
    process.env.PHONEPE_ENV === "production" ? "pg" : "pg-sandbox"
  }/checkout/v2/pay`, {
    method: "POST",
    headers: getPhonePeHeaders(accessToken),
    body: JSON.stringify({
      merchantOrderId: input.merchantOrderId,
      amount: input.amountPaisa,
      expireAfter: 1200,
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl
        }
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`PhonePe create payment failed: ${errorBody}`);
  }

  return (await response.json()) as PhonePeCreatePaymentResponse;
}

export async function getPhonePeOrderStatus(merchantOrderId: string, details = false) {
  const accessToken = await getPhonePeAccessToken();
  const url = new URL(
    `${getPhonePeBaseUrl()}/apis/${
      process.env.PHONEPE_ENV === "production" ? "pg" : "pg-sandbox"
    }/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status`
  );
  url.searchParams.set("details", details ? "true" : "false");

  const response = await fetch(url, {
    method: "GET",
    headers: getPhonePeHeaders(accessToken)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`PhonePe order status failed: ${errorBody}`);
  }

  return (await response.json()) as PhonePeOrderStatusResponse;
}
