'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  DollarSign, 
  FileText, 
  Lock, 
  ArrowRight,
  CheckCircle,
  Eye
} from 'lucide-react';

export default function TransparencyPage() {
  const { t } = useTranslation();

  const transparencyAreas = [
    {
      title: 'Financial Transparency',
      description: 'How we fund our journalism and where the money goes',
      icon: DollarSign,
      href: '/transparency/funding',
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Editorial Standards',
      description: 'Our fact-checking process and correction policies',
      icon: FileText,
      href: '/transparency/editorial',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Data Privacy',
      description: 'What data we collect and how we protect it',
      icon: Lock,
      href: '/transparency/data',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="container text-center">
            <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-6">
              <Eye className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Transparency Hub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe in open journalism. Here's everything you need to know about how we operate.
            </p>
          </div>
        </section>

        {/* Transparency Areas */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {transparencyAreas.map((area) => (
                <Link href={area.href} key={area.title}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className={`p-3 rounded-lg w-fit ${area.color} mb-2`}>
                        <area.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {area.title}
                      </CardTitle>
                      <CardDescription>{area.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-primary flex items-center gap-1 text-sm font-medium">
                        Learn more <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Our Commitments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Our Transparency Commitments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'All funding sources disclosed publicly',
                    'Clear distinction between news and opinion',
                    'Corrections issued within 24 hours',
                    'No data sold to third parties',
                    'Open methodology for trust scores',
                    'Regular financial reports published',
                    'Editorial independence from funders',
                    'Reader feedback actively incorporated'
                  ].map((commitment, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{commitment}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-muted/50">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              We're committed to answering your questions about our operations.
            </p>
            <Button>Contact Our Transparency Team</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
