'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Search,
  Users,
  Clock,
  Shield
} from 'lucide-react';

export default function EditorialTransparencyPage() {
  const { t } = useTranslation();

  const factCheckingSteps = [
    {
      step: 1,
      title: 'Source Verification',
      description: 'All sources are verified for credibility and expertise'
    },
    {
      step: 2,
      title: 'Multiple Source Requirement',
      description: 'Key claims require at least two independent sources'
    },
    {
      step: 3,
      title: 'Document Review',
      description: 'Original documents are reviewed when possible'
    },
    {
      step: 4,
      title: 'Expert Consultation',
      description: 'Subject matter experts review technical content'
    },
    {
      step: 5,
      title: 'Editorial Review',
      description: 'Senior editors review all content before publication'
    }
  ];

  const correctionPolicy = [
    'Errors are corrected immediately upon discovery',
    'Corrections are clearly labeled and timestamped',
    'Original text is preserved with strikethrough',
    'Significant corrections are noted at top of article',
    'Readers can report errors via feedback form'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <Link href="/transparency" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transparency Hub
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Editorial Standards</h1>
              <p className="text-muted-foreground">Our commitment to accurate, fair journalism</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Fact-Checking Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Fact-Checking Process
                </CardTitle>
                <CardDescription>Every article goes through our verification pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {factCheckingSteps.map((step, index) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          {step.step}
                        </div>
                        {index < factCheckingSteps.length - 1 && (
                          <div className="w-0.5 h-8 bg-border mx-auto mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Correction Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Correction Policy
                </CardTitle>
                <CardDescription>How we handle errors when they occur</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {correctionPolicy.map((policy, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Content Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Labeling
                </CardTitle>
                <CardDescription>We clearly distinguish between content types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Badge className="mb-2">News</Badge>
                    <p className="text-sm text-muted-foreground">
                      Factual reporting based on verified sources and documentation.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Badge variant="secondary" className="mb-2">Analysis</Badge>
                    <p className="text-sm text-muted-foreground">
                      Expert interpretation of events and data with clearly stated context.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Badge variant="outline" className="mb-2">Opinion</Badge>
                    <p className="text-sm text-muted-foreground">
                      Personal viewpoints from contributors, clearly labeled as such.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Badge className="bg-purple-100 text-purple-800 mb-2">AI-Assisted</Badge>
                    <p className="text-sm text-muted-foreground">
                      Content created with AI tools, always reviewed by human editors.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Commitments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-primary">24h</p>
                    <p className="text-sm text-muted-foreground">Error corrections</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-primary">48h</p>
                    <p className="text-sm text-muted-foreground">Reader inquiries</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold text-primary">7d</p>
                    <p className="text-sm text-muted-foreground">Right of reply</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ethics */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Our Ethics Commitment</h3>
                    <p className="text-muted-foreground">
                      We adhere to the highest standards of journalism ethics. Our reporters 
                      never pay for information, always disclose conflicts of interest, and 
                      protect the confidentiality of sources. We are members of the 
                      International Fact-Checking Network.
                    </p>
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
