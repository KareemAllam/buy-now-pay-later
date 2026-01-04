import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { getRequiredRole, isProtectedRoute } from "./config/routes";

// --- CONFIGURATION ---
const locales = ['en', 'ar'] as const;
const defaultLocale = 'en';

// --- 1. I18N LAYER ---
function handleI18n(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    const headers = { 'accept-language': request.headers.get('accept-language') || 'en' };
    const languages = new Negotiator({ headers }).languages();
    const locale = match(languages, locales as unknown as string[], defaultLocale);

    return NextResponse.redirect(new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url));
  }
  return null; // Continue to next layer
}

// --- 2. AUTH & ROLE LAYER ---
async function handleAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split('/')[1];
  const routeWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  if (!isProtectedRoute(routeWithoutLocale)) {
    return null;
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
  }

  const requiredRole = getRequiredRole(routeWithoutLocale);
  const userRole = token.role as string;

  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === 'admin'
      ? `/${locale}/admin/dashboard`
      : `/${locale}/dashboard`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return null;
}

// --- MAIN PROXY ENTRY ---
export default async function proxy(request: NextRequest) {
  // Layer 1: Internationalization
  const i18nResponse = handleI18n(request);
  if (i18nResponse) return i18nResponse;

  // Layer 2: Authentication
  const authResponse = await handleAuth(request);
  if (authResponse) return authResponse;

  // Final: If all layers pass
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};