'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { signUpAction } from './actions';

interface SignUpFormProps {
  lang: string;
  dict: any;
}

export function SignUpForm({ lang, dict }: SignUpFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signUpAction(fullName, email, password, 'customer');

      if (!result.success) {
        setError(result.error || dict.signUp.errors.generic);
        setIsLoading(false);
        return;
      }

      // Auto sign in after successful registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(dict.signUp.errors.signInFailed);
        setIsLoading(false);
        return;
      }

      if (signInResult?.ok) {
        // Redirect to dashboard
        router.push(`/${lang}/dashboard`);
        router.refresh();
      }
    } catch (err) {
      setError(dict.signUp.errors.generic);
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
        <Label htmlFor="full_name">{dict.signUp.fullName}</Label>
        <Input
          id="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder={dict.signUp.fullNamePlaceholder}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{dict.signUp.email}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={dict.signUp.emailPlaceholder}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{dict.signUp.password}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder={dict.signUp.passwordPlaceholder}
          disabled={isLoading}
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? dict.signUp.submitting : dict.signUp.submit}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {dict.signUp.hasAccount}{' '}
        <Link href={`/${lang}/signin`} className="text-primary hover:underline">
          {dict.signUp.signInLink}
        </Link>
      </div>
    </form>
  );
}

