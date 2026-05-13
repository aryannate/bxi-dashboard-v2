'use client';

import { motion } from 'framer-motion';
import { Store, Clock, Eye, Flame, ArrowRight, ChevronRight } from 'lucide-react';
import { MarketplaceListing } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, getIndustryEmoji, getMatchColor, timeAgo } from '@/lib/utils';

interface MarketplaceFeedProps {
  listings: MarketplaceListing[];
}

const urgencyConfig = {
  high: { label: 'Urgent', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: Flame },
  medium: { label: 'Active', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: Clock },
  low: { label: 'Open', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: Clock },
};

function ListingCard({ listing, index }: { listing: MarketplaceListing; index: number }) {
  const { business, title, offeringItem, seekingItem, estimatedValue, urgency, postedAt, views, relevanceScore } = listing;
  const emoji = getIndustryEmoji(business.industry);
  const urgencyInfo = urgencyConfig[urgency];
  const UrgencyIcon = urgencyInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
    >
      {/* Relevance bar */}
      <div className="h-0.5 w-full bg-muted">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
          style={{ width: `${relevanceScore}%` }}
        />
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-2.5 mb-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback className="text-base bg-gradient-to-br from-muted to-muted/50">
              {emoji}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">{business.name} · {business.city}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={cn(
              'flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border',
              urgencyInfo.color
            )}>
              <UrgencyIcon className="w-2.5 h-2.5" />
              {urgencyInfo.label}
            </span>
            <span className={cn('text-xs font-bold', getMatchColor(relevanceScore))}>
              {relevanceScore}% match
            </span>
          </div>
        </div>

        {/* Offer ↔ Seek */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
            <p className="text-[9px] text-emerald-400 uppercase tracking-wider mb-0.5">Offering</p>
            <p className="text-xs font-medium text-foreground truncate">{offeringItem}</p>
          </div>
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="flex-1 p-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
            <p className="text-[9px] text-blue-400 uppercase tracking-wider mb-0.5">Seeking</p>
            <p className="text-xs font-medium text-foreground truncate">{seekingItem}</p>
          </div>
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Eye className="w-2.5 h-2.5" />{views} views
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />{timeAgo(postedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">{estimatedValue}</span>
            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2">
              Propose Barter
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MarketplaceFeed({ listings }: MarketplaceFeedProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-500/10">
            <Store className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Personalized Marketplace Feed</h2>
            <p className="text-xs text-muted-foreground">AI-curated listings relevant to you</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
          Full Marketplace <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {listings.map((listing, i) => (
          <ListingCard key={listing.id} listing={listing} index={i} />
        ))}
      </div>
    </section>
  );
}
