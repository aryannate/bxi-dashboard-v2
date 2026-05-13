'use client';

import { motion } from 'framer-motion';
import { Brain, ArrowRight, Lightbulb } from 'lucide-react';
import { AISuggestion } from '@/lib/ai-suggestions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AISuggestionsProps {
  suggestions: AISuggestion[];
}

const impactColors = {
  high: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

const typeColors = {
  opportunity: 'border-emerald-500/20 hover:border-emerald-500/40',
  insight: 'border-blue-500/20 hover:border-blue-500/40',
  action: 'border-violet-500/20 hover:border-violet-500/40',
  warning: 'border-yellow-500/20 hover:border-yellow-500/40',
};

export function AISuggestions({ suggestions }: AISuggestionsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10">
            <Brain className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Opportunity Insights</h2>
            <p className="text-xs text-muted-foreground">Personalized for your business</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={cn(
              'p-3.5 rounded-xl border bg-card cursor-pointer transition-all duration-200 hover:shadow-md group',
              typeColors[suggestion.type]
            )}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg flex-shrink-0 mt-0.5">{suggestion.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-xs font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {suggestion.title}
                  </h4>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {suggestion.estimatedValue && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full border border-emerald-400/20">
                        {suggestion.estimatedValue}
                      </span>
                    )}
                    <span className={cn(
                      'text-[9px] font-semibold px-1.5 py-0.5 rounded-full border',
                      impactColors[suggestion.impact]
                    )}>
                      {suggestion.impact.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {suggestion.description}
                </p>
                {suggestion.ctaText && (
                  <button className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors">
                    {suggestion.ctaText}
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Powered by AI footer */}
      <div className="mt-3 flex items-center gap-1.5 justify-center">
        <Lightbulb className="w-3 h-3 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground">
          Insights powered by BXI AI Engine · Updates every 6h
        </p>
      </div>
    </section>
  );
}
