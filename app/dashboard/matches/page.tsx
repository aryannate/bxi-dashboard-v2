'use client';

import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { MatchCard } from '@/components/dashboard/MatchCard';
import { useUserStore } from '@/store/userStore';
import { getMatches } from '@/lib/matching-engine';
import businesses from '@/data/businesses.json';

export default function MatchesPage() {
  const { userProfile, matches } = useUserStore();

  const allMatches = useMemo(() => {
    if (matches.length > 0) return matches;
    if (!userProfile) return [];
    // @ts-ignore
    return getMatches(userProfile, businesses);
  }, [userProfile, matches]);

  return (
    <div className="page-in">
      <Header title="My Matches" subtitle={`${allMatches.length} AI-matched businesses`} />
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allMatches.map((match, i) => (
            <MatchCard key={match.business.id} match={match} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
