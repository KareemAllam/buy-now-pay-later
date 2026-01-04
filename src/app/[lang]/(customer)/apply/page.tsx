import { AwaitedPageParams } from "@/types/app.types";
import { redirect } from "next/navigation";

export default async function ApplyPage({ params }: AwaitedPageParams) {
  const { lang } = await params;

  redirect(`/${lang ?? "en"}/`);
}