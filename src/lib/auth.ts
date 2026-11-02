import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booknook";
const client =
  globalForMongo.mongoClient ?? new MongoClient(mongoUri);
if (process.env.NODE_ENV !== "production") globalForMongo.mongoClient = client;

const db = client.db(process.env.DB_NAME || "booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret",
    },
  },
  plugins: [jwt()],
});