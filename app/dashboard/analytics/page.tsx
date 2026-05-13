'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { useUserStore } from '@/store/userStore';
import { getMatches, getRecommended } from '@/lib/matching-engine';
import { getProfileCompleteness } from '@/lib/ai-suggestions';
import { AnalyticsData } from '@/types';
import businesses from '@/data/businesses.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getIndustryEmoji, getMatchColor, cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const { userProfile, matches } = useUserStore();

  const allMatches = useMemo(() => {
    if (!userProfile || matches.length > 0) return matches;
    // @ts-ignore
    return getMatches(userProfile, businesses);
  }, [userProfile, matches]);

  const recommended = useMemo(() => getRecommended(allMatches), [allMatches]);

  const avgScore = useMemo(() =>
    allMatches.length > 0
      ? Math.round(allMatches.slice(0, 10).reduce((a, m) => a + m.score, 0) / Math.min(allMatches.length, 10))
      : 0,
    [allMatches]
  );

  const analytics: AnalyticsData = useMemo(() => ({
    totalOpportunities: allMatches.length,
    averageMatchScore: avgScore,
    activeRecommendations: recommended.length,
    estimatedBarterValue: 2500000 + allMatches.length * 50000,
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
  }), [allMatches, avgScore, recommended, userProfile]);

  return (
    <div className="page-in">
      <Header title="Analytics" subtitle="Track your barter activity and match performance" />

      <div className="px-6 py-6 space-y-6">
        <StatsBar analytics={analytics} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Charts */}
          <div className="xl:col-span-2">
            <AnalyticsSection analytics={analytics} />
          </div>

          {/* Top Matches Leaderboard */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Top Match Leaderboard</CardTitle>
                <CardDescription className="text-xs">Your highest AI-scored businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {allMatches.slice(0, 10).map((match, i) => (
                  <motion.div
                    key={match.business.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-muted-foreground w-4 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-base flex-shrink-0">{getIndustryEmoji(match.business.industry)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{match.business.name}</p>
                      <p className="text-[10px] text-muted-foreground">{match.business.city}</p>
                    </div>
                    <span className={cn('text-sm font-bold flex-shrink-0', getMatchColor(match.score))}>
                      {match.score}%
                    </span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* AI Health Score */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Profile AI Score</CardTitle>
                <CardDescription className="text-xs">How well your profile drives matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="relative w-28 h-28 mx-auto">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke={analytics.profileCompleteness >= 70 ? '#10b981' : '#f59e0b'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${analytics.profileCompleteness * 2.51} 251`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-foreground">{analytics.profileCompleteness}</span>
                      <span className="text-[10px] text-muted-foreground">out of 100</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Company Info', done: true },
                    { label: 'Offerings (3+)', done: (userProfile?.offers?.length || 0) >= 3 },
                    { label: 'Needs (3+)', done: (userProfile?.needs?.length || 0) >= 3 },
                    { label: 'Barter Categories', done: (userProfile?.barterCategories?.length || 0) >= 2 },
                    { label: 'Excess Inventory', done: (userProfile?.excessInventory?.length || 0) > 0 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={cn(
                        'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
                        item.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'
                      )}>
                        {item.done ? '✓' : '○'}
                      </div>
                      <span className={cn('text-xs', item.done ? 'text-foreground' : 'text-muted-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
