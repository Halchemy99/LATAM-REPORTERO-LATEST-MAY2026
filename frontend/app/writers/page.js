'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { mockWriters } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustScoreRating from '@/components/TrustScoreRating';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, CheckCircle, FileText, MapPin, Users } from 'lucide-react';

export default function WritersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');

  const filteredWriters = mockWriters.filter(writer => {
    if (region !== 'all' && writer.region?.toLowerCase() !== region) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        writer.name.toLowerCase().includes(searchLower) ||
        writer.specialty.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const regions = ['all', 'mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">{t('nav.writers')}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Meet our verified journalists covering Latin America. Each writer has a Trust Score based on accuracy, sourcing, and community feedback.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b">
          <div className="container">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search writers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(reg => (
                    <SelectItem key={reg} value={reg}>
                      {reg === 'all' ? 'All Regions' : t(`regions.${reg}`) || reg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Writers Grid */}
        <section className="py-8">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWriters.map(writer => (
                <Card key={writer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-primary/10">
                        <img
                          src={writer.avatar}
                          alt={writer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{writer.name}</h3>
                      <p className="text-sm text-primary mb-2">{writer.specialty}</p>
                      
                      <div className="flex justify-center mb-3">
                        <TrustScoreRating score={writer.trustScore} />
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {writer.articleCount} articles
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {writer.region}
                        </Badge>
                        {writer.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {writer.bio}
                      </p>

                      <Button variant="outline" className="w-full" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredWriters.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No writers found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
