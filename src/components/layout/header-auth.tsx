'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type Locale, type Dictionary } from '@/app/[lang]/dictionaries';

interface HeaderAuthProps {
  lang: Locale;
  dict: Dictionary['auth'];
}

export function HeaderAuth({ lang, dict }: HeaderAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push(`/${lang}`);
    router.refresh();
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {dict.welcome}, {session.user.name}
        </span>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          {dict.signOut}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${lang}/signin`}>{dict.signInButton}</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href={`/${lang}/signup`}>{dict.signUpButton}</Link>
      </Button>
    </div>
  );
}

