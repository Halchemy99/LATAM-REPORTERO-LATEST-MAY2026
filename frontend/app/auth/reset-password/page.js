'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setIsValidSession(false);
        } else if (session) {
          setIsValidSession(true);
        } else {
          // Check URL for recovery token
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const type = hashParams.get('type');
          
          if (accessToken && type === 'recovery') {
            // Exchange the token for a session
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || '',
            });
            
            if (!sessionError) {
              setIsValidSession(true);
            }
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
      setChecking(false);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(updateError.message);
        toast.error(updateError.message);
      } else {
        setSuccess(true);
        toast.success('Password updated successfully!');
        
        // Sign out to clear the recovery session
        await supabase.auth.signOut();
        
        // Clear any cached auth data
        localStorage.removeItem('supabaseUser');
        localStorage.removeItem('supabaseUserRole');
      }
    } catch (err) {
      console.error('Password update error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred');
    }

    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Verifying reset link...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isValidSession && !success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-bold mb-2">Invalid or Expired Link</h2>
              <p className="text-muted-foreground mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <div className="space-y-3">
                <Link href="/auth/forgot-password">
                  <Button className="w-full">Request New Reset Link</Button>
                </Link>
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

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2">Password Updated!</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              <Link href="/auth/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
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
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below.
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
                <Label htmlFor="password">New Password</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
