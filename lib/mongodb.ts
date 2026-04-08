import mongoose from "mongoose";

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
  const mongodbUri = process.env.MONGODB_URI || "";
  if (!mongodbUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongodbUri, {
      dbName: "hety_stationery_admin"
    });
  }

  cache.conn = await cache.promise;
  globalThis.mongooseCache = cache;
  return cache.conn;
}
