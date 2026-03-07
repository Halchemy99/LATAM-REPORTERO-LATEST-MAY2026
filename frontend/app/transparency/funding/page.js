'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  ArrowLeft,
  PieChart,
  Users,
  FileText,
  Server,
  Heart,
  TrendingUp
} from 'lucide-react';

export default function FundingTransparencyPage() {
  const { t } = useTranslation();

  const revenueBreakdown = [
    { source: 'Reader Subscriptions', percentage: 45, amount: '$45,000', color: 'bg-blue-500' },
    { source: 'Foundation Grants', percentage: 30, amount: '$30,000', color: 'bg-green-500' },
    { source: 'Donations', percentage: 15, amount: '$15,000', color: 'bg-purple-500' },
    { source: 'Advertising', percentage: 10, amount: '$10,000', color: 'bg-orange-500' },
  ];

  const expenseBreakdown = [
    { category: 'Journalism & Content', percentage: 55, icon: FileText },
    { category: 'Technology & Platform', percentage: 20, icon: Server },
    { category: 'Operations & Admin', percentage: 15, icon: Users },
    { category: 'Community Programs', percentage: 10, icon: Heart },
  ];

  const majorSupporters = [
    { name: 'Open Society Foundations', type: 'Grant', since: '2024' },
    { name: 'Knight Foundation', type: 'Grant', since: '2025' },
    { name: 'Democracy Fund', type: 'Grant', since: '2025' },
    { name: 'Individual Donors (500+)', type: 'Donations', since: '2024' },
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
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Financial Transparency</h1>
              <p className="text-muted-foreground">How we fund independent journalism</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Revenue Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue Sources (2025)
                </CardTitle>
                <CardDescription>Total Revenue: $100,000</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {revenueBreakdown.map((item) => (
                  <div key={item.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.source}</span>
                      <span>{item.percentage}% ({item.amount})</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* How Funds Are Used */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  How We Spend
                </CardTitle>
                <CardDescription>Every dollar supports our mission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {expenseBreakdown.map((item) => (
                    <div key={item.category} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-2xl font-bold text-primary">{item.percentage}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Major Supporters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Our Supporters
                </CardTitle>
                <CardDescription>Organizations and individuals who make our work possible</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {majorSupporters.map((supporter) => (
                    <div key={supporter.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{supporter.name}</p>
                        <p className="text-sm text-muted-foreground">Supporting since {supporter.since}</p>
                      </div>
                      <Badge variant="outline">{supporter.type}</Badge>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  * No funder has editorial influence over our content. All grants are unrestricted.
                </p>
              </CardContent>
            </Card>

            {/* Editorial Independence */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Editorial Independence</h3>
                <p className="text-muted-foreground">
                  Our funders never influence our editorial decisions. We maintain a strict firewall 
                  between our business and editorial operations. All funding relationships are disclosed, 
                  and no single funder provides more than 30% of our annual revenue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
