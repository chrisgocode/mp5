import getCollection, { URL_COLLECTION } from "@/db";
import { Url } from "@/types/url";

export default async function getUrl(alias: string): Promise<Url> {
  if (encodeURIComponent(alias) !== alias) {
    throw new Error("Invalid alias: You may only use valid URL characters");
  }

  const urlCollection = await getCollection(URL_COLLECTION);
  const data = await urlCollection.findOne({ alias: alias });

  if (!data) {
    throw new Error("Url not found for alias: " + alias);
  }

  const url: Url = {
    id: data._id.toHexString(),
    url: data.url,
    alias: alias,
  };

  return url;
}
