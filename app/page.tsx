"use client";

import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import createNewUrl from "@/lib/createNewUrl";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

// form schema using zod
const formSchema = z.object({
  // z.url() manages our frontend url validation
  url: z.url("Invalid URL"),
  alias: z.string(),
});

export default function Home() {
  const [url, setUrl] = useState<string | null>(null);
  const [alias, setAlias] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const PUBLIC_URL = process.env.NEXT_PUBLIC_URL;
  if (!PUBLIC_URL) {
    throw new Error("PUBLIC_URL not set");
  }

  // defines our form object for shadcn form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      alias: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    createNewUrl(values.url, values.alias)
      .then((u) => {
        setUrl(u.url);
        setAlias(u.alias);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Card className="max-w-2xl w-full p-8 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">URL Shortener</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Long URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the URL you want to shorten
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Custom Alias</FormLabel>
                  <FormControl>
                    <Input placeholder="my-link" className="h-11" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the alias for your new URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isLoading ? (
              <Button type="submit" className="w-full h-11 text-base">
                Shorten URL
              </Button>
            ) : (
              <Spinner className="size-6 m-auto" />
            )}
          </form>
        </Form>

        {url && (
          <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">
              Your shortened URL:
            </p>
            <Link
              href={PUBLIC_URL + alias}
              className="text-green-700 hover:underline font-semibold text-lg break-all"
            >
              {PUBLIC_URL + alias}
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
