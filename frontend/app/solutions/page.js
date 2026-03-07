'use client';

import { useState, useEffect } from 'react';
import { useTranslation, useContentMode } from '@/lib/providers';
import { mockArticles } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, X, Lightbulb } from 'lucide-react';

export default function SolutionsPage() {
  const { t } = useTranslation();
  const { mode, setMode } = useContentMode();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('all');

  useEffect(() => {
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 500);
  }, []);

  const filteredArticles = articles.filter(article => {
    // Content mode filter
    if (mode === 'ai' && !article.isAiGenerated) return false;
    if (mode === 'human' && article.isAiGenerated) return false;

    // Category filter
    if (category !== 'all' && article.category !== category) return false;

    // Region filter
    if (region !== 'all' && article.region !== region && article.region !== 'all') return false;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const categories = ['all', 'environment', 'economy', 'health', 'education', 'politics', 'technology'];
  const regions = ['all', 'mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru', 'venezuela', 'ecuador'];

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setRegion('all');
    setMode('all');
  };

  const hasFilters = search || category !== 'all' || region !== 'all' || mode !== 'all';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">{t('nav.solutions')}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover solutions-oriented journalism from across Latin America. Every story follows our Problem → Solutions → Impact format.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Content Type */}
              <Tabs value={mode} onValueChange={setMode}>
                <TabsList>
                  <TabsTrigger value="all">{t('news.allStories')}</TabsTrigger>
                  <TabsTrigger value="human">{t('news.humanWritten')}</TabsTrigger>
                  <TabsTrigger value="ai">{t('news.aiVerified')}</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Category */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : t(`categories.${cat}`) || cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Region */}
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(reg => (
                    <SelectItem key={reg} value={reg}>
                      {t(`regions.${reg}`) || reg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {search && (
                  <Badge variant="secondary">
                    Search: "{search}"
                    <button onClick={() => setSearch('')} className="ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {mode !== 'all' && (
                  <Badge variant="secondary">
                    {mode === 'human' ? 'Human Written' : 'AI Verified'}
                    <button onClick={() => setMode('all')} className="ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {category !== 'all' && (
                  <Badge variant="secondary">
                    {t(`categories.${category}`) || category}
                    <button onClick={() => setCategory('all')} className="ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {region !== 'all' && (
                  <Badge variant="secondary">
                    {t(`regions.${region}`) || region}
                    <button onClick={() => setRegion('all')} className="ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-8">
          <div className="container">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'} found
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-[350px] rounded-xl" />
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No stories found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
