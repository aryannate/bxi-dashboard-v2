'use client';

import { Sparkles, ChevronRight } from 'lucide-react';
import { Match } from '@/types';
import { MatchCard } from './MatchCard';
import { Button } from '@/components/ui/button';

interface RecommendedMatchesProps {
  matches: Match[];
}

export function RecommendedMatches({ matches }: RecommendedMatchesProps) {
  const top = matches.slice(0, 6);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Recommended Matches</h2>
            <p className="text-xs text-muted-foreground">Top picks based on your profile</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
          View All <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {top.map((match, i) => (
          <MatchCard key={match.business.id} match={match} index={i} />
        ))}
      </div>
    </section>
  );
}
