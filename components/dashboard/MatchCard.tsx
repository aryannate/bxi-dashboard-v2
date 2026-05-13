'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { Match } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, getIndustryEmoji, getMatchColor, getMatchLabel } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  index?: number;
  variant?: 'default' | 'compact';
}

function MatchScoreRing({ score }: { score: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    score >= 80 ? '#10b981' :
    score >= 65 ? '#f59e0b' :
    score >= 50 ? '#f97316' : '#64748b';

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 52 52">
        <circle
          cx="26" cy="26" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted/30"
        />
        <circle
          cx="26" cy="26" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-sm font-bold leading-none', getMatchColor(score))}>{score}</span>
        <span className="text-[9px] text-muted-foreground leading-none">%</span>
      </div>
    </div>
  );
}

export function MatchCard({ match, index = 0, variant = 'default' }: MatchCardProps) {
  const { business, score, reasons, estimatedValue } = match;
  const initials = business.name.split(' ').slice(0, 2).map(w => w[0]).join('');
  const emoji = getIndustryEmoji(business.industry);

  const gradients = [
    'from-violet-500/5 to-purple-500/5',
    'from-blue-500/5 to-cyan-500/5',
    'from-emerald-500/5 to-teal-500/5',
    'from-orange-500/5 to-amber-500/5',
    'from-pink-500/5 to-rose-500/5',
  ];
  const gradient = gradients[index % gradients.length];

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 bg-card card-hover cursor-pointer group"
      >
        <Avatar className="w-9 h-9 flex-shrink-0">
          <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            {emoji}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{business.name}</p>
          <p className="text-xs text-muted-foreground truncate">{business.industry} · {business.city}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('text-sm font-bold', getMatchColor(score))}>{score}%</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={cn(
        'relative rounded-xl border border-border bg-gradient-to-br',
        gradient,
        'bg-card card-hover cursor-pointer group overflow-hidden'
      )}
    >
      {/* Top gradient line */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r',
        score >= 80 ? 'from-emerald-400/50 via-emerald-400 to-emerald-400/50' :
        score >= 65 ? 'from-yellow-400/50 via-yellow-400 to-yellow-400/50' :
        'from-orange-400/50 via-orange-400 to-orange-400/50'
      )} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-11 h-11 flex-shrink-0">
            <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-border">
              {emoji}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm leading-tight truncate group-hover:text-primary transition-colors">
              {business.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge variant="muted" className="text-[10px] px-1.5 py-0">{business.industry}</Badge>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <MapPin className="w-2.5 h-2.5" />
                {business.city}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{business.size}</Badge>
            </div>
          </div>
          <MatchScoreRing score={score} />
        </div>

        {/* Match label */}
        <div className="mb-3">
          <span className={cn('text-[10px] font-semibold uppercase tracking-wider', getMatchColor(score))}>
            {getMatchLabel(score)}
          </span>
        </div>

        {/* Offers */}
        <div className="mb-2.5">
          <p className="text-[10px] text-muted-foreground font-medium mb-1.5 uppercase tracking-wider">They Offer</p>
          <div className="flex flex-wrap gap-1">
            {business.offers.slice(0, 3).map((offer) => (
              <Badge key={offer} variant="purple" className="text-[10px] px-1.5 py-0">{offer}</Badge>
            ))}
            {business.offers.length > 3 && (
              <Badge variant="muted" className="text-[10px] px-1.5 py-0">+{business.offers.length - 3}</Badge>
            )}
          </div>
        </div>

        {/* Needs */}
        <div className="mb-3">
          <p className="text-[10px] text-muted-foreground font-medium mb-1.5 uppercase tracking-wider">They Need</p>
          <div className="flex flex-wrap gap-1">
            {business.needs.slice(0, 3).map((need) => (
              <Badge key={need} variant="blue" className="text-[10px] px-1.5 py-0">{need}</Badge>
            ))}
          </div>
        </div>

        {/* AI Reason */}
        {reasons?.[0] && (
          <div className="mb-3 p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/15">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-snug">
                <span className="text-violet-400 font-medium">AI: </span>
                {reasons[0]}
              </p>
            </div>
          </div>
        )}

        {/* Excess inventory */}
        {business.excessInventory?.[0] && (
          <div className="mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <p className="text-[10px] text-emerald-400">
              Excess: <span className="font-medium">{business.excessInventory[0]}</span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border">
          {estimatedValue && (
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Est. Barter Value</p>
              <p className="text-xs font-semibold text-foreground">{estimatedValue}</p>
            </div>
          )}
          <div className="flex gap-1.5 ml-auto">
            <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5">
              View Profile
            </Button>
            <Button size="sm" className="h-7 text-[11px] px-2.5 gap-1">
              Connect
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
