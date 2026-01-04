import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Buy Now, Pay Later
            <br />
            <span className="text-primary">Education Financing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Make education accessible with flexible installment plans. Browse schools and universities,
            apply for financing, and pay in convenient monthly installments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={'/institutions'}>
              <Button size="lg">
                Browse Schools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={'/signup'}>
              <Button size="lg" variant="outline">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <School className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Browse Schools and Universities</CardTitle>
                <CardDescription>
                  Explore our network of schools and universities to find the perfect one for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={'/institutions'}>
                  <Button variant="outline" className="w-full">
                    Browse Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Apply for Financing</CardTitle>
                <CardDescription>
                  Submit your application for an installment plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={'/signin'}>
                  <Button variant="outline" className="w-full">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Apply for Financing</CardTitle>
                <CardDescription>
                  Submit your application for an installment plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={'/signin'}>
                  <Button variant="outline" className="w-full">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students and parents who are making education more affordable
              with our flexible payment plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={'/signup'}>
                <Button size="lg">
                  Create Account
                </Button>
              </Link>
              <Link href={'/signin'}>
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
