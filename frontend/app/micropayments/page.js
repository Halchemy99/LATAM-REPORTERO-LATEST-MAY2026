'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Wallet, ArrowUpRight, ArrowDownLeft, DollarSign, TrendingUp, CreditCard } from 'lucide-react';

// Mock transactions
const mockTransactions = [
  { id: 1, type: 'earning', amount: 12.50, description: 'Article: Water Crisis Solutions', date: '2026-03-05', status: 'completed' },
  { id: 2, type: 'earning', amount: 8.75, description: 'Article: Renewable Energy in Chile', date: '2026-03-03', status: 'completed' },
  { id: 3, type: 'withdrawal', amount: -20.00, description: 'Withdrawal to PayPal', date: '2026-03-01', status: 'completed' },
  { id: 4, type: 'earning', amount: 15.00, description: 'Article: Education Reform', date: '2026-02-28', status: 'completed' },
  { id: 5, type: 'earning', amount: 5.25, description: 'Reader tips', date: '2026-02-25', status: 'pending' },
];

export default function MicropaymentsPage() {
  const { t } = useTranslation();
  const { user, role, isLoading } = useUserRole();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const isContributor = role === 'contributor' || role === 'editor' || role === 'admin';
  
  const totalEarnings = mockTransactions
    .filter(t => t.type === 'earning')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawn = Math.abs(mockTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0));
  
  const balance = totalEarnings - totalWithdrawn;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Wallet className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Micropayments</h1>
              <p className="text-muted-foreground">
                {isContributor ? 'Manage your earnings and withdrawals' : 'Support writers you love'}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-3xl font-bold text-primary">${balance.toFixed(2)}</p>
                  </div>
                  <Wallet className="h-10 w-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Withdrawn</p>
                    <p className="text-3xl font-bold">${totalWithdrawn.toFixed(2)}</p>
                  </div>
                  <ArrowUpRight className="h-10 w-10 text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              {isContributor && <TabsTrigger value="withdraw">Withdraw</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {tx.type === 'earning' ? (
                            <div className="p-2 bg-green-100 rounded-full">
                              <ArrowDownLeft className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="p-2 bg-gray-100 rounded-full">
                              <ArrowUpRight className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-sm text-muted-foreground">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.type === 'earning' ? 'text-green-600' : ''}`}>
                            {tx.type === 'earning' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                          </p>
                          <Badge variant={tx.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === 'earning' ? 'default' : 'secondary'}>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tx.status === 'completed' ? 'secondary' : 'outline'}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${tx.type === 'earning' ? 'text-green-600' : ''}`}>
                          {tx.type === 'earning' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {isContributor && (
              <TabsContent value="withdraw">
                <Card>
                  <CardHeader>
                    <CardTitle>Withdraw Earnings</CardTitle>
                    <CardDescription>
                      Minimum withdrawal amount is $10.00. Processing takes 3-5 business days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                      <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
                    </div>
                    <Button disabled={balance < 10}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {balance < 10 ? 'Minimum $10 required' : 'Withdraw Funds'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
