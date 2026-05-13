'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart
} from 'recharts';
import { AnalyticsData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AnalyticsSectionProps {
  analytics: AnalyticsData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="capitalize">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Weekly Activity + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Activity */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Weekly Barter Activity</CardTitle>
              <CardDescription className="text-xs">Matches and connections this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={analytics.weeklyActivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="connGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="matches" stroke="#7c3aed" fill="url(#matchGrad)" strokeWidth={2} dot={false} name="matches" />
                  <Area type="monotone" dataKey="connections" stroke="#f97316" fill="url(#connGrad)" strokeWidth={2} dot={false} name="connections" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Barter Category Breakdown</CardTitle>
              <CardDescription className="text-xs">Top categories by match opportunity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryBreakdown}
                      cx="50%" cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {analytics.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5">
                  {analytics.categoryBreakdown.map((cat) => (
                    <div key={cat.category} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-[11px] text-muted-foreground flex-1 truncate">{cat.category}</span>
                      <span className="text-[11px] font-semibold text-foreground">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Match Score Trend */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Match Quality Trend</CardTitle>
            <CardDescription className="text-xs">Average AI match score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={analytics.matchScoreTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4 }} name="score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Industries */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Match Industries</CardTitle>
            <CardDescription className="text-xs">Industries with highest barter potential for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {analytics.topIndustries.map((item, i) => (
                <div key={item.industry}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{item.industry}</span>
                    <span className="text-muted-foreground">{item.count} businesses</span>
                  </div>
                  <Progress
                    value={(item.count / analytics.topIndustries[0].count) * 100}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
