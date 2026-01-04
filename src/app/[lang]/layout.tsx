
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthSessionProvider } from "@/providers/session-provider";
import { Header } from "@/components/layout/header";
import { hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buy Now Pay Later - Education Financing",
  description: "Education financing platform for schools and universities",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const pageParams = await params;

  if (!hasLocale(pageParams?.lang)) {
    notFound();
  }

  const isRtl = pageParams?.lang === 'ar';

  return (
    <html lang={pageParams?.lang} suppressHydrationWarning dir={isRtl ? 'rtl' : 'ltr'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header lang={pageParams?.lang} />
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
