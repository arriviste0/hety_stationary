import mongoose from "mongoose";

const isProduction = process.env.NODE_ENV === "production";
const MONGODB_URI =
  process.env.MONGODB_URI ||
  (!isProduction ? "mongodb://127.0.0.1:27017/hety_stationery_admin" : "");

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache = globalThis.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: "hety_stationery_admin"
    });
  }

  cache.conn = await cache.promise;
  globalThis.mongooseCache = cache;
  return cache.conn;
}
