import type { Role } from "@/lib/rbac";

const isProduction = process.env.NODE_ENV === "production";
const JWT_SECRET =
  process.env.JWT_SECRET || (!isProduction ? "hety-admin-dev-secret" : "");

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable.");
}

export type AdminTokenPayload = {
  id: string;
  role: Role;
  name: string;
  email: string;
  exp?: number;
};

export type CustomerTokenPayload = {
  id: string;
  name: string;
  email: string;
  exp?: number;
};

const encoder = new TextEncoder();

const toBase64Url = (input: string | ArrayBuffer) => {
  const bytes =
    typeof input === "string"
      ? encoder.encode(input)
      : new Uint8Array(input);

  let str = "";
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }

  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const fromBase64Url = (input: string) => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
};

const importKey = async () =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

export const signAdminToken = async (payload: AdminTokenPayload) => {
  return signToken(payload);
};

export const verifyAdminToken = async (
  token?: string
): Promise<AdminTokenPayload | null> => {
  return (await verifyToken(token)) as AdminTokenPayload | null;
};

export const signCustomerToken = async (payload: CustomerTokenPayload) => {
  return signToken(payload);
};

export const verifyCustomerToken = async (
  token?: string
): Promise<CustomerTokenPayload | null> => {
  return (await verifyToken(token)) as CustomerTokenPayload | null;
};

async function signToken(payload: Record<string, unknown>) {
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await importKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));

  return `${data}.${toBase64Url(signature)}`;
}

async function verifyToken(token?: string): Promise<Record<string, unknown> | null> {
  if (!token) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await importKey();
  const signatureBytes = Uint8Array.from(fromBase64Url(encodedSignature), (char) =>
    char.charCodeAt(0)
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    encoder.encode(data)
  );

  if (!isValid) return null;

  const payload = JSON.parse(fromBase64Url(encodedPayload)) as Record<string, unknown>;
  if (
    typeof payload.exp === "number" &&
    payload.exp < Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  return payload;
}
