'use client'

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Locale } from '@/app/[lang]/dictionaries';

export function DashboardButton({ lang }: { lang: Locale }) {
  const { data: session } = useSession();
  const isAuthenticated = session?.user;
  const isAdmin = session?.user?.role === 'admin';

  if (!isAuthenticated) return null;
  const redirectPath = isAdmin ? `/${lang}/admin/dashboard` : `/${lang}/dashboard`;
  return (
    <Link href={redirectPath}>
      <span className="text-base font-normal">Dashboard</span>
    </Link>
  )
}