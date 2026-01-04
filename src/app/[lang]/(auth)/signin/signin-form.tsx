'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface SignInFormProps {
  lang: string;
  dict: any;
}

export function SignInForm({ lang, dict }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(dict.signIn.errors.invalidCredentials);
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Get the session to determine redirect based on role
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        
        // Redirect based on user role
        if (session?.user?.role === 'admin') {
          router.push(`/${lang}/admin/dashboard`);
        } else {
          router.push(`/${lang}/dashboard`);
        }
        router.refresh();
      }
    } catch (err) {
      setError(dict.signIn.errors.generic);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{dict.signIn.email}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={dict.signIn.emailPlaceholder}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{dict.signIn.password}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder={dict.signIn.passwordPlaceholder}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? dict.signIn.submitting : dict.signIn.submit}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {dict.signIn.noAccount}{' '}
        <Link href={`/${lang}/signup`} className="text-primary hover:underline">
          {dict.signIn.signUpLink}
        </Link>
      </div>
    </form>
  );
}

