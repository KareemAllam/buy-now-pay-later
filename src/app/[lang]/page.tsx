import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, FileText, ArrowRight } from 'lucide-react';
import { getDictionary, hasLocale } from './dictionaries';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }]
}

export default async function Home({ params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {dict.home.title}
            <br />
            <span className="text-primary">{dict.home.subtitle}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {dict.home.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${lang}/institutions`}>
              <Button size="lg">
                {dict.home.browseSchools}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/${lang}/signup`}>
              <Button size="lg" variant="outline">
                {dict.home.getStarted}
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{dict.home.howItWorks}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <School className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{dict.home.browseSchoolsTitle}</CardTitle>
                <CardDescription>
                  {dict.home.browseSchoolsDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/${lang}/institutions`}>
                  <Button variant="outline" className="w-full">
                    {dict.home.browseNow}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{dict.home.applyForFinancing}</CardTitle>
                <CardDescription>
                  {dict.home.applyForFinancingDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/${lang}/signin`}>
                  <Button variant="outline" className="w-full">
                    {dict.home.applyNow}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{dict.home.applyForFinancing}</CardTitle>
                <CardDescription>
                  {dict.home.applyForFinancingDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/${lang}/signin`}>
                  <Button variant="outline" className="w-full">
                    {dict.home.applyNow}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{dict.home.readyToGetStarted}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {dict.home.readyDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${lang}/signup`}>
                <Button size="lg">
                  {dict.home.createAccount}
                </Button>
              </Link>
              <Link href={`/${lang}/signin`}>
                <Button size="lg" variant="outline">
                  {dict.home.signIn}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}