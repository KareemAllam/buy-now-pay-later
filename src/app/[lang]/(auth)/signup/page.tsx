import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { SignUpForm } from "./signup-form";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang as any);
  return {
    title: dict.auth.signUp.title,
    description: dict.auth.signUp.description,
  };
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang as any);

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {dict.auth.signUp.title}
            </h1>
            <p className="text-muted-foreground">
              {dict.auth.signUp.description}
            </p>
          </div>

          <SignUpForm lang={lang} dict={dict.auth} />
        </div>
      </article>
    </main>
  );
}

