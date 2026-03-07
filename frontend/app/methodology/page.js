'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Star, 
  Shield, 
  Users, 
  Target,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export default function MethodologyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <Badge>How We Work</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Methodology</h1>
              <p className="text-xl text-muted-foreground">
                LATAM Reportero is built on solutions-oriented journalism principles. Every story follows a structured approach to highlight not just problems, but the solutions making a difference.
              </p>
            </div>
          </div>
        </section>

        {/* Problem -> Solutions -> Impact */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Story Structure</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-t-4 border-t-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    The Problem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We start by clearly defining the challenge. Who is affected? What are the stakes? We provide context and data to help readers understand the issue's scope.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Lightbulb className="h-5 w-5" />
                    Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We highlight real solutions being implemented. This includes who is leading the effort, how the solution works, and what makes it innovative or replicable.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We measure and report on outcomes. What has changed? We include data, testimonials, and evidence of progress to show real-world impact.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Content Types */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Content Types</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Human-Written Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Written by verified journalists with regional expertise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Goes through editorial review process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Includes original reporting and interviews</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Available to premium subscribers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-600" />
                    AI-Verified Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Aggregated from trusted regional sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>AI-processed for accuracy and structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Cross-referenced with multiple sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Free for all readers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Score Link */}
        <section className="py-12">
          <div className="container text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-4">Trust Score System</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Every journalist on our platform has a Trust Score based on accuracy, sourcing, transparency, corrections, and reader engagement.
            </p>
            <Link href="/methodology/trust-score">
              <Button size="lg">
                Learn About Trust Scores
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
