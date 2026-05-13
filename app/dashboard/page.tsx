'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { RecommendedMatches } from '@/components/dashboard/RecommendedMatches';
import { BusinessesLookingForYou } from '@/components/dashboard/BusinessesLookingForYou';
import { AISuggestions } from '@/components/dashboard/AISuggestions';
import { MarketplaceFeed } from '@/components/dashboard/MarketplaceFeed';
import { useUserStore } from '@/store/userStore';
import { getMatches, getRecommended, getLookingForYou } from '@/lib/matching-engine';
import { generateAISuggestions, getProfileCompleteness } from '@/lib/ai-suggestions';
import { AnalyticsData, MarketplaceListing } from '@/types';
import businesses from '@/data/businesses.json';
import { generateId } from '@/lib/utils';

function generateMarketplaceListings(matches: ReturnType<typeof getMatches>): MarketplaceListing[] {
  const templates = [
    (b: any, score: number) => ({
      title: `${b.offers[0]} ↔ ${b.needs[0]}`,
      offeringItem: b.offers[0],
      seekingItem: b.needs[0],
      estimatedValue: score >= 70 ? '₹8–20L' : '₹3–10L',
      urgency: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
    }),
    (b: any, score: number) => ({
      title: `${b.name} — Barter Partnership`,
      offeringItem: b.inventoryType,
      seekingItem: b.needs[1] || b.needs[0],
      estimatedValue: score >= 70 ? '₹5–15L' : '₹2–8L',
      urgency: score >= 75 ? 'medium' : 'low',
    }),
  ];

  return matches.slice(0, 9).map((match, i) => {
    const tmpl = templates[i % templates.length](match.business, match.score);
    return {
      id: generateId(),
      business: match.business,
      title: tmpl.title,
      offeringItem: tmpl.offeringItem,
      seekingItem: tmpl.seekingItem,
      estimatedValue: tmpl.estimatedValue as string,
      urgency: tmpl.urgency as 'high' | 'medium' | 'low',
      postedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 80) + 10,
      relevanceScore: match.score,
    };
  });
}

export default function DashboardPage() {
  const { userProfile, matches, setMatches } = useUserStore();

  useEffect(() => {
    if (userProfile && businesses.length > 0) {
      // @ts-ignore
      const computed = getMatches(userProfile, businesses);
      setMatches(computed);
    }
  }, [userProfile, setMatches]);

  const recommended = useMemo(() => getRecommended(matches), [matches]);
  const lookingForYou = useMemo(() => getLookingForYou(matches), [matches]);
  const listings = useMemo(() => generateMarketplaceListings(matches), [matches]);
  const suggestions = useMemo(
    () => userProfile ? generateAISuggestions(userProfile, matches) : [],
    [userProfile, matches]
  );

  const analytics: AnalyticsData = useMemo(() => {
    const avgScore = matches.length > 0
      ? Math.round(matches.slice(0, 10).reduce((a, m) => a + m.score, 0) / Math.min(matches.length, 10))
      : 0;

    return {
      totalOpportunities: matches.length,
      averageMatchScore: avgScore,
      activeRecommendations: recommended.length,
      estimatedBarterValue: 2500000 + matches.length * 50000,
      profileCompleteness: userProfile ? getProfileCompleteness(userProfile) : 0,
      weeklyActivity: [
        { day: 'Mon', matches: 8, connections: 2 },
        { day: 'Tue', matches: 12, connections: 4 },
        { day: 'Wed', matches: 9, connections: 3 },
        { day: 'Thu', matches: 15, connections: 6 },
        { day: 'Fri', matches: 18, connections: 7 },
        { day: 'Sat', matches: 6, connections: 2 },
        { day: 'Sun', matches: 4, connections: 1 },
      ],
      categoryBreakdown: [
        { category: 'Events', value: 28, color: '#7c3aed' },
        { category: 'Media', value: 22, color: '#3b82f6' },
        { category: 'Travel', value: 18, color: '#10b981' },
        { category: 'Marketing', value: 15, color: '#f97316' },
        { category: 'Corporate', value: 17, color: '#f59e0b' },
      ],
      matchScoreTrend: [
        { week: 'W1', score: 52 },
        { week: 'W2', score: 58 },
        { week: 'W3', score: 63 },
        { week: 'W4', score: 71 },
        { week: 'W5', score: avgScore },
      ],
      topIndustries: [
        { industry: 'Events', count: 8 },
        { industry: 'Media', count: 6 },
        { industry: 'Travel', count: 5 },
        { industry: 'Marketing', count: 4 },
        { industry: 'Wellness', count: 3 },
      ],
    };
  }, [matches, recommended, userProfile]);

  if (!userProfile) return null;

  return (
    <div className="page-in">
      <Header
        title={`Welcome, ${userProfile.companyName}`}
        subtitle={`${userProfile.industry} · ${userProfile.city} · AI Dashboard`}
      />

      <div className="px-6 py-6 space-y-8">
        {/* Stats Bar */}
        <StatsBar analytics={analytics} />

        {/* Personalization Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent p-4"
        >
          <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
          <div className="relative flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                AI found <span className="text-violet-400">{matches.length} barter opportunities</span> for {userProfile.companyName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on your {userProfile.industry.toLowerCase()} profile in {userProfile.city} — {recommended.length} high-confidence matches ready
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <p className="text-lg font-black text-violet-400">{analytics.averageMatchScore}%</p>
                <p className="text-[10px] text-muted-foreground">Avg Match Score</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section A: Recommended Matches */}
        <RecommendedMatches matches={recommended} />

        {/* Sections B + C: Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Section B: Businesses Looking For You */}
          <div className="xl:col-span-3">
            <BusinessesLookingForYou matches={lookingForYou} />
          </div>

          {/* Section C: AI Suggestions */}
          <div className="xl:col-span-2">
            <AISuggestions suggestions={suggestions} />
          </div>
        </div>

        {/* Section D: Marketplace Feed */}
        <MarketplaceFeed listings={listings} />
      </div>
    </div>
  );
}
