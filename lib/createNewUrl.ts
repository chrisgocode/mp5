"use server";

import getCollection, { URL_COLLECTION } from "@/db";
import { Url } from "@/types/url";

export default async function createNewUrl(
  url: string,
  alias: string,
): Promise<Url> {
  console.log("creating new url");

  const urlData = {
    url: url,
    alias: alias,
  };

  const urlCollection = await getCollection(URL_COLLECTION);
  const res = urlCollection.insertOne({ ...urlData });

  if (!(await res).acknowledged) {
    throw new Error("DB insert failed");
  }

  return { ...urlData, id: (await res).insertedId.toHexString() };
}
