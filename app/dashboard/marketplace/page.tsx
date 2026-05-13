'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Store, Zap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatchCard } from '@/components/dashboard/MatchCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUserStore } from '@/store/userStore';
import { getMatches } from '@/lib/matching-engine';
import { cn } from '@/lib/utils';
import businesses from '@/data/businesses.json';

const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Ahmedabad'];
const INDUSTRIES = [
  'All Industries', 'Hospitality', 'Events', 'Media', 'Travel', 'Wellness',
  'Advertising', 'Beauty & Personal Care', 'Photography', 'Digital Marketing',
];

export default function MarketplacePage() {
  const { userProfile } = useUserStore();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'value'>('match');

  const allMatches = useMemo(() => {
    if (!userProfile) return [];
    // @ts-ignore
    return getMatches(userProfile, businesses);
  }, [userProfile]);

  const filtered = useMemo(() => {
    return allMatches.filter(m => {
      const b = m.business;
      const matchSearch = !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.industry.toLowerCase().includes(search.toLowerCase()) ||
        b.offers.some(o => o.toLowerCase().includes(search.toLowerCase()));
      const matchCity = cityFilter === 'All Cities' || b.city === cityFilter;
      const matchIndustry = industryFilter === 'All Industries' || b.industry === industryFilter;
      return matchSearch && matchCity && matchIndustry;
    }).sort((a, b) => {
      if (sortBy === 'match') return b.score - a.score;
      if (sortBy === 'value') return parseInt(b.estimatedValue || '0') - parseInt(a.estimatedValue || '0');
      return 0;
    });
  }, [allMatches, search, cityFilter, industryFilter, sortBy]);

  return (
    <div className="page-in">
      <Header
        title="Marketplace"
        subtitle="Browse and filter all barter opportunities"
      />

      <div className="px-6 py-6">
        {/* Header stats */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by business name, industry, or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* City filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={cn(
                'flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all font-medium',
                cityFilter === city
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              )}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Industry filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(ind)}
              className={cn(
                'flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all',
                industryFilter === ind
                  ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 font-medium'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all" className="text-xs">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="high" className="text-xs">High Match 80%+</TabsTrigger>
              <TabsTrigger value="local" className="text-xs">Local ({userProfile?.city})</TabsTrigger>
            </TabsList>

            {/* Sort */}
            <div className="flex gap-1">
              {(['match', 'recent', 'value'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-lg transition-all capitalize',
                    sortBy === s
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((match, i) => (
                  <MatchCard key={match.business.id} match={match} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Store className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No businesses match your filters</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="high" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.filter(m => m.score >= 80).map((match, i) => (
                <MatchCard key={match.business.id} match={match} index={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="local" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.filter(m => m.business.city === userProfile?.city).map((match, i) => (
                <MatchCard key={match.business.id} match={match} index={i} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
