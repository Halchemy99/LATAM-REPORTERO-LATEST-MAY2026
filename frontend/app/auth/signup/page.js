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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle } from 'lucide-react';

const PREFERENCE_OPTIONS = ['environment', 'economy', 'health', 'education', 'politics', 'technology'];

export default function SignupPage() {
  const { t } = useTranslation();
  const { signup, user, isLoading } = useUserRole();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && user) router.push('/');
  }, [user, isLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError(t('Password must be at least 6 characters'));
      setLoading(false);
      return;
    }

    const result = await signup(email, password, name);

    if (result.success) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      toast.success(t('Account created! Welcome to LATAM Reportero.'));
      router.push('/');
    } else {
      setError(result.error || t('Failed to create account'));
    }
    setLoading(false);
  };

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-[#666666]">{t('Loading...')}</div>
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
              {t('Join LATAM Reportero')}
            </h1>
            <p className="text-sm text-[#666666]">{t('Create your account to join the LATAM Reportero community')}</p>
          </div>

          <div className="bg-white border border-[#1a1a1a]/10 p-6">
            {error && (
              <Alert variant="destructive" className="mb-4 rounded-none">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" data-testid="signup-form">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-[#666666]">{t('Full Name')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-[#666666]" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('Your full name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 rounded-none border-[#1a1a1a]/15 h-10"
                    required
                    data-testid="signup-name"
                  />
                </div>
              </div>

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
                    data-testid="signup-email"
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
                    placeholder={t('Min. 6 characters')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 rounded-none border-[#1a1a1a]/15 h-10"
                    required
                    minLength={6}
                    data-testid="signup-password"
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

              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-wider text-[#666666]">{t('Interests (optional)')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PREFERENCE_OPTIONS.map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={!!preferences[key]}
                        onCheckedChange={() => setPreferences(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="rounded-none"
                      />
                      <label htmlFor={key} className="text-sm capitalize cursor-pointer text-[#1a1a1a]">
                        {t(key)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full rounded-none bg-[#6111ff] hover:bg-[#4a0dd6] h-10 text-white" disabled={loading} data-testid="signup-submit">
                {loading ? t('Creating account...') : t('Create Account')}
              </Button>

              <p className="text-center text-sm text-[#666666]">
                {t('Already have an account?')}{' '}
                <Link href="/auth/login" className="text-[#6111ff] hover:underline font-medium">
                  {t('Sign in')}
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
