import { MongoClient, Collection } from "mongodb";
import { readEnv } from "@/core/infrastructure/config/env";

let client: MongoClient | null = null;
let env: ReturnType<typeof readEnv> | null = null;

function getEnv() {
  return (env ??= readEnv());
}

export async function getMongoCollection(): Promise<Collection> {
  const currentEnv = getEnv();

  if (!client) {
    client = new MongoClient(currentEnv.mongoUri, { tls: true });
    await client.connect();
  }

  return client.db(currentEnv.mongoDatabase).collection(currentEnv.mongoCollection);
}

export async function closeMongoClient(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
