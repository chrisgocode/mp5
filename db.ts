import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not set");
}

const DB_NAME = "mp5-urls";
export const URL_COLLECTION = "url-collection";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGO_URI!);
    await client.connect();
  }
  return client.db(DB_NAME);
}

export default async function getCollection(
  collectionName: string,
): Promise<Collection> {
  if (!db) {
    db = await connect();
  }
  return db.collection(collectionName);
}
