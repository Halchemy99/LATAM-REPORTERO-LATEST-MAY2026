'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function SignupPage() {
  const { t } = useTranslation();
  const { signup } = useUserRole();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferences, setPreferences] = useState({
    environment: false,
    economy: false,
    health: false,
    education: false,
    politics: false,
    technology: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await signup(email, password, name);
    
    if (result.success) {
      // Save preferences to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      if (result.needsConfirmation) {
        // Supabase requires email confirmation
        setSuccess(true);
        toast.success('Account created! Please check your email to confirm.');
      } else {
        // Auto-confirmed or demo mode - redirect to dashboard
        toast.success('Account created! Welcome to LATAM Reportero.');
        // Small delay to ensure state is properly set
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      }
    } else {
      setError(result.error || 'Failed to create account');
      toast.error(result.error || 'Failed to create account');
    }
    setLoading(false);
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a confirmation link to <strong>{email}</strong>. 
                Please click the link to activate your account.
              </p>
              <div className="space-y-3">
                <Button onClick={() => router.push('/auth/login')} className="w-full">
                  Go to Login
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSuccess(false)}
                  className="w-full"
                >
                  Use a Different Email
                </Button>
              </div>
            </CardContent>
          </Card>
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
            <CardTitle className="text-2xl">{t('auth.signupTitle')}</CardTitle>
            <CardDescription>{t('auth.signupSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Auth Mode Indicator */}
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Create your account to access solutions-oriented journalism for Latin America.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

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
                    minLength={6}
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
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <div className="space-y-3">
                <Label>News Preferences (optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={() => togglePreference(key)}
                      />
                      <label htmlFor={key} className="text-sm capitalize cursor-pointer">
                        {t(`categories.${key}`) || key}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('nav.signup')}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t('auth.hasAccount')}{' '}
                <Link href="/auth/login" className="text-primary hover:underline">
                  {t('nav.login')}
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
