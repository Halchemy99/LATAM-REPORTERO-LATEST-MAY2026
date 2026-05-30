'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Database,
  Shield,
  Eye,
  Trash2,
  Download,
  UserX
} from 'lucide-react';

export default function DataTransparencyPage() {
  const { t } = useTranslation();

  const dataWeCollect = [
    { data: 'Email address', purpose: 'Account creation and communications', required: true },
    { data: 'Name', purpose: 'Personalization and attribution', required: false },
    { data: 'Reading history', purpose: 'Personalized recommendations', required: false },
    { data: 'Bookmarks', purpose: 'Save articles for later', required: false },
    { data: 'Poll votes', purpose: 'Community engagement', required: false },
    { data: 'Payment info', purpose: 'Subscription processing (via Stripe)', required: false },
  ];

  const dataWeNeverCollect = [
    'Location data',
    'Contact lists',
    'Device identifiers for tracking',
    'Browsing history outside our platform',
    'Social media data',
    'Biometric data'
  ];

  const userRights = [
    { right: 'Access', description: 'Request a copy of all your data', icon: Download },
    { right: 'Correction', description: 'Update or correct your information', icon: Eye },
    { right: 'Deletion', description: 'Request deletion of your account and data', icon: Trash2 },
    { right: 'Portability', description: 'Export your data in standard format', icon: Database },
    { right: 'Objection', description: 'Opt out of certain data processing', icon: UserX },
  ];

  const securityMeasures = [
    'All data encrypted in transit (TLS 1.3) and at rest (AES-256)',
    'Hosted on SOC 2 certified infrastructure',
    'Regular security audits and penetration testing',
    'Employee access strictly limited and logged',
    'Two-factor authentication available',
    'Automatic session timeouts'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <Link href="/transparency" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Back to Transparency Hub')}
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Lock className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('Data Privacy')}</h1>
              <p className="text-muted-foreground">{t('How we protect your information')}</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Data We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t('What We Collect')}
                </CardTitle>
                <CardDescription>{t('Data we collect and why')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataWeCollect.map((item) => (
                    <div key={item.data} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{t(item.data)}</p>
                          <p className="text-sm text-muted-foreground">{t(item.purpose)}</p>
                        </div>
                      </div>
                      <Badge variant={item.required ? 'default' : 'secondary'}>
                        {item.required ? t('Required') : t('Optional')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data We Never Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  {t('What We Never Collect')}
                </CardTitle>
                <CardDescription>{t('Data we will never ask for or collect')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {dataWeNeverCollect.map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span>{t(item)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('Your Rights')}
                </CardTitle>
                <CardDescription>{t('Control over your data (GDPR-compliant)')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {userRights.map((right) => (
                    <div key={right.right} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <right.icon className="h-5 w-5 text-primary" />
                        <p className="font-medium">{t('Right to')} {t(right.right)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{t(right.description)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4">
                  <Button>{t('Download My Data')}</Button>
                  <Button variant="outline">{t('Delete My Account')}</Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t('How We Protect Your Data')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {securityMeasures.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{t(item)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Third Parties */}
            <Card>
              <CardHeader>
                <CardTitle>{t('Third-Party Services')}</CardTitle>
                <CardDescription>{t('Services that process your data')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Supabase</p>
                      <p className="text-sm text-muted-foreground">{t('Authentication & database')}</p>
                    </div>
                    <Badge variant="outline">SOC 2</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-muted-foreground">{t('Payment processing')}</p>
                    </div>
                    <Badge variant="outline">PCI DSS</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Vercel</p>
                      <p className="text-sm text-muted-foreground">{t('Hosting')}</p>
                    </div>
                    <Badge variant="outline">SOC 2</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {t('We only use services that meet our security standards. We never sell your data to anyone.')}
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">{t('Questions About Your Data?')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('Contact our Data Protection Officer for any privacy-related inquiries.')}
                    </p>
                    <Button variant="outline">privacy@latamreportero.com</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
