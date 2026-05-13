'use client';

import { motion } from 'framer-motion';
import { Eye, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { Match } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, getIndustryEmoji, getMatchColor, getMatchLabel } from '@/lib/utils';

interface BusinessesLookingForYouProps {
  matches: Match[];
}

function LookingCard({ match, index }: { match: Match; index: number }) {
  const { business, score, reasons } = match;
  const emoji = getIndustryEmoji(business.industry);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card hover:border-blue-500/30 hover:shadow-sm transition-all duration-200 cursor-pointer group"
    >
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="text-base bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-border">
          {emoji}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-blue-400 transition-colors">
              {business.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="muted" className="text-[9px] px-1.5 py-0">{business.industry}</Badge>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <MapPin className="w-2.5 h-2.5" />
                {business.city}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={cn('text-sm font-bold', getMatchColor(score))}>{score}%</p>
            <p className="text-[9px] text-muted-foreground">{getMatchLabel(score)}</p>
          </div>
        </div>

        {/* What they want from you */}
        <div className="mt-2">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Seeking from you</p>
          <div className="flex flex-wrap gap-1">
            {business.needs.slice(0, 3).map((need) => (
              <Badge key={need} variant="blue" className="text-[10px] px-1.5 py-0">{need}</Badge>
            ))}
          </div>
        </div>

        {/* AI reason */}
        {reasons?.[0] && (
          <p className="text-[10px] text-muted-foreground mt-2 leading-snug line-clamp-1">
            <span className="text-violet-400">AI: </span>{reasons[0]}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </motion.div>
  );
}

export function BusinessesLookingForYou({ matches }: BusinessesLookingForYouProps) {
  const lookingMatches = matches.slice(0, 8);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Businesses Looking For You</h2>
            <p className="text-xs text-muted-foreground">They need what you offer</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
          View All <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-2">
        {lookingMatches.map((match, i) => (
          <LookingCard key={match.business.id} match={match} index={i} />
        ))}
      </div>
    </section>
  );
}
