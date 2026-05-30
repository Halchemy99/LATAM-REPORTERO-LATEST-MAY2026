'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, user, isLoading } = useUserRole();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && user) router.push('/');
  }, [user, isLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login({ email, password });
    
    if (result.success) {
      toast.success(t('Welcome back!'));
      router.push('/');
    } else {
      setError(result.error || t('Invalid email or password'));
    }
    setLoading(false);
  };

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-[#666666]">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
              {t('Welcome Back')}
            </h1>
            <p className="text-sm text-[#666666]">{t('Sign in to access your account')}</p>
          </div>

          <div className="bg-white border border-[#1a1a1a]/10 p-6">
            {error && (
              <Alert variant="destructive" className="mb-4 rounded-none">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-[#666666]">{t('Email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#666666]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-none border-[#1a1a1a]/15 h-10"
                    required
                    data-testid="login-email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-[#666666]">{t('Password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#666666]" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('Enter password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 rounded-none border-[#1a1a1a]/15 h-10"
                    required
                    data-testid="login-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-[#666666] hover:text-[#1a1a1a]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full rounded-none bg-[#1a1a1a] hover:bg-[#160A26] h-10" disabled={loading} data-testid="login-submit">
                {loading ? t('Signing in...') : t('Sign In')}
              </Button>

              <p className="text-center text-sm text-[#666666]">
                {t("Don't have an account?")}{' '}
                <Link href="/auth/signup" className="text-[#6111ff] hover:underline font-medium">
                  {t('Create one')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
