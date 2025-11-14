import { redirect } from "next/navigation";
import getUrl from "@/lib/getUrl";

export default async function AliasPage({
  params,
}: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;

  const urlData = await getUrl(alias).catch(() => {
    redirect("/");
  });

  redirect(urlData.url);
}
