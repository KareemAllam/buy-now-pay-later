import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'] as const;
const defaultLocale = 'en';

export type Locale = typeof locales[number];

// Get the preferred locale based on Accept-Language header
function getLocale(request: NextRequest): Locale {
  const headers = { 'accept-language': request.headers.get('accept-language') || 'en' };
  const languages = new Negotiator({ headers }).languages();
  const matchedLocale = match(languages, locales as unknown as string[], defaultLocale);
  return matchedLocale as Locale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If locale is already in pathname, continue
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /institutions
  // The new URL is now /en/institutions
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
};

