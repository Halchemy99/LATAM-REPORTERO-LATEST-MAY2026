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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, user, role, isLoading, canAccessAdminDashboard } = useUserRole();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      // User is already logged in, redirect based on role
      let redirectUrl = '/dashboard';
      if (canAccessAdminDashboard) {
        redirectUrl = '/admin/dashboard';
      } else if (role === 'editor') {
        redirectUrl = '/editor/dashboard';
      } else if (role === 'contributor') {
        redirectUrl = '/contributor/dashboard';
      }
      // Use window.location for more reliable redirect
      window.location.href = redirectUrl;
    }
  }, [user, role, isLoading, canAccessAdminDashboard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Try Supabase login
    const result = await login({ email, password });
    
    if (result.success) {
      toast.success('Login successful!');
      // Wait a moment for state to update, then redirect
      setTimeout(() => {
        if (result.user) {
          router.push('/dashboard');
        }
      }, 100);
    } else {
      setError(result.error || 'Invalid email or password');
      toast.error(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  // Show loading while checking if already logged in
  if (isLoading || user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            {user ? 'Redirecting to dashboard...' : 'Loading...'}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('auth.loginTitle')}</CardTitle>
            <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('nav.login')}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  {t('nav.signup')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
