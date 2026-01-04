'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">BNPL Education</span>
          </Link>
          {/* {isAuthenticated && (
            <nav className="flex items-center gap-4">
              {profile?.role === 'admin' ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/schools"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Schools
                  </Link>
                  <Link
                    href="/admin/applications"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Applications
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/schools"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Browse Schools
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </nav>
          )} */}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || 'User'}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={'/signin'}>Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={'/signup'}>Sign Up</Link>
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </header>
  );
}
