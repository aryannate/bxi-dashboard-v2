'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Zap, IndianRupee, Target, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsData } from '@/types';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  trend?: string;
  trendUp?: boolean;
  color: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, sub, trend, trendUp, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex-1 min-w-0 rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <div className={cn('p-2 rounded-lg', color)}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className={cn(
            'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
            trendUp
              ? 'text-emerald-400 bg-emerald-400/10'
              : 'text-red-400 bg-red-400/10'
          )}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </motion.div>
  );
}

interface StatsBarProps {
  analytics: AnalyticsData;
}

export function StatsBar({ analytics }: StatsBarProps) {
  const stats: StatCardProps[] = [
    {
      icon: Target,
      label: 'AI Matches Found',
      value: analytics.totalOpportunities.toString(),
      sub: 'Based on your profile',
      trend: '24%',
      trendUp: true,
      color: 'bg-violet-500/10 text-violet-400',
      delay: 0,
    },
    {
      icon: Zap,
      label: 'Avg Match Score',
      value: `${analytics.averageMatchScore}%`,
      sub: 'Quality of recommendations',
      trend: '8%',
      trendUp: true,
      color: 'bg-yellow-500/10 text-yellow-400',
      delay: 0.05,
    },
    {
      icon: Users,
      label: 'Active Matches',
      value: analytics.activeRecommendations.toString(),
      sub: 'Ready to connect now',
      trend: '12%',
      trendUp: true,
      color: 'bg-blue-500/10 text-blue-400',
      delay: 0.1,
    },
    {
      icon: IndianRupee,
      label: 'Barter Value',
      value: `₹${(analytics.estimatedBarterValue / 100000).toFixed(0)}L`,
      sub: 'Estimated annual potential',
      trend: '31%',
      trendUp: true,
      color: 'bg-emerald-500/10 text-emerald-400',
      delay: 0.15,
    },
    {
      icon: CheckCircle,
      label: 'Profile Score',
      value: `${analytics.profileCompleteness}%`,
      sub: 'Complete for better matches',
      color: 'bg-orange-500/10 text-orange-400',
      delay: 0.2,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
