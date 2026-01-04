import { redirect } from "next/navigation";

export default async function AdminInstitutionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/admin/dashboard`);
}

