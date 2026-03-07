'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        toast.error(resetError.message);
      } else {
        setSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred');
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and click the link to reset your password.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => setSent(false)}
                  className="w-full"
                >
                  Try a Different Email
                </Button>
                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
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
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-primary hover:underline inline-flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
