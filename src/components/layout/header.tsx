import { ThemeToggle } from '@/components/theme/theme-toggle';
import Link from 'next/link';
import { LanguageToggle } from '../theme/language-toggle';
import { getDictionary, type Locale } from '@/app/[lang]/dictionaries';
import { HeaderAuth } from './header-auth';
import { DashboardButton } from './dashboard-button';

export async function Header({ lang }: { lang: Locale }) {
  const dictionary = getDictionary(lang);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <span className="text-xl font-bold">{dictionary.header.title}</span>
          </Link>
          <DashboardButton lang={lang} />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageToggle lang={lang} />
          <HeaderAuth lang={lang} dict={dictionary.auth} />
        </div>
      </div>
    </header>
  );
}
