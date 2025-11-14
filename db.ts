import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not set");
}

const DB_NAME = "mp5-urls";
export const URL_COLLECTION = "url-collection";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// i had to modify this function because i was receiving the following Error
//    MongoTopologyClosedError: Topology is closed
// this is ocurring because our mongodb connection is being closed prematurely
// so i am now caching the client and db in memory
async function connect(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedDb && cachedClient) {
    return { client: cachedClient, db: cachedDb };
  }

  // if there's no cached client or it's not connected, create a new one
  const client = new MongoClient(MONGO_URI!);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(DB_NAME);

  return { client: cachedClient, db: cachedDb };
}

export default async function getCollection(
  collectionName: string,
): Promise<Collection> {
  const { db } = await connect();
  return db.collection(collectionName);
}
