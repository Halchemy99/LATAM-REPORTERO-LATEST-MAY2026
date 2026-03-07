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
import { Eye, EyeOff, Lock, Mail, AlertCircle, PenTool, FileText, DollarSign } from 'lucide-react';

export default function ContributorLoginPage() {
  const { t } = useTranslation();
  const { login, user, role, isLoading } = useUserRole();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && user) {
      if (role === 'contributor' || role === 'editor' || role === 'admin') {
        router.push('/contributor/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, role, isLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login({ email, password });
    
    if (result.success) {
      toast.success('Login successful!');
      router.push('/contributor/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
      toast.error(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            {user ? 'Redirecting...' : 'Loading...'}
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
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-2">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Contributor Login</CardTitle>
              <CardDescription>Access your contributor dashboard</CardDescription>
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
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="password">Password</Label>
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
                    Forgot Password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Become a Contributor CTA */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Become a Contributor</CardTitle>
              <CardDescription>Share your stories with Latin America</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg h-fit">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Publish Your Stories</h4>
                    <p className="text-sm text-muted-foreground">
                      Share solutions-oriented journalism with our growing audience
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg h-fit">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Earn Micropayments</h4>
                    <p className="text-sm text-muted-foreground">
                      Get paid for every reader who engages with your content
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg h-fit">
                    <PenTool className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Join Our Network</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with journalists across Latin America
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link href="/submit">
                  <Button variant="outline" className="w-full">
                    Apply to Become a Contributor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
