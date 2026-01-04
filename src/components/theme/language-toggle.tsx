'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
] as const;

export function LanguageToggle() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';

  const redirectedPathname = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {languages.map((language) => {
          const isActive = language.code === currentLocale;
          return (
            <DropdownMenuItem
              key={language.code}
              asChild
              className={cn(
                "flex items-center gap-2 cursor-pointer",
              )}
            >
              <Link href={redirectedPathname(language.code)}>
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1 text-sm font-medium">{language.name}</span>
                {isActive && (
                  <Check className="h-4 w-4 text-primary ml-auto" />
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
