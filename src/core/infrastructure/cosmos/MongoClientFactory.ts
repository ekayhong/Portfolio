import { MongoClient, Collection } from "mongodb";
import { readEnv } from "@/core/infrastructure/config/env";

let client: MongoClient | null = null;
let env = readEnv();

export async function getMongoCollection(): Promise<Collection> {
  if (!client) {
    client = new MongoClient(env.mongoUri, { tls: true });
    await client.connect();
  }
  return client.db(env.mongoDatabase).collection(env.mongoCollection);
}

export async function closeMongoClient(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
