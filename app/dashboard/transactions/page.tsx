'use client';

import { Header } from '@/components/layout/Header';
import { ArrowLeftRight, CheckCircle2, Clock, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MOCK_TRANSACTIONS = [
  { id: '1', partner: 'WedMeGood Events', offered: 'Banquet Hall (2 days)', received: 'Event Photography (20hrs)', value: '₹4L', status: 'completed', date: '2024-05-10' },
  { id: '2', partner: 'Percept Limited', offered: 'Corporate Catering', received: 'Social Media Campaign', value: '₹6.5L', status: 'in-progress', date: '2024-05-08' },
  { id: '3', partner: 'Times Network', offered: 'Conference Room (5 days)', received: 'TV Ad Slot (30 sec)', value: '₹12L', status: 'pending', date: '2024-05-05' },
  { id: '4', partner: 'Influencer.in', offered: 'Luxury Suite (3 nights)', received: 'Instagram Campaign', value: '₹2.5L', status: 'completed', date: '2024-04-28' },
];

const statusConfig = {
  completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle2 },
  'in-progress': { label: 'In Progress', variant: 'warning' as const, icon: Clock },
  pending: { label: 'Pending', variant: 'muted' as const, icon: Clock },
};

export default function TransactionsPage() {
  return (
    <div className="page-in">
      <Header title="Transactions" subtitle="Barter exchange history and tracking" />
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Bartered', value: '₹25L', icon: IndianRupee, color: 'bg-emerald-500/10 text-emerald-400' },
            { label: 'Completed Deals', value: '2', icon: CheckCircle2, color: 'bg-blue-500/10 text-blue-400' },
            { label: 'Active Exchanges', value: '1', icon: ArrowLeftRight, color: 'bg-violet-500/10 text-violet-400' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
                <div className={cn('p-2 rounded-lg w-fit mb-2', stat.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {MOCK_TRANSACTIONS.map((tx, i) => {
            const status = statusConfig[tx.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg flex-shrink-0">
                  🤝
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{tx.partner}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="text-emerald-400">Offered:</span> {tx.offered} ·{' '}
                    <span className="text-blue-400">Received:</span> {tx.received}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-foreground">{tx.value}</p>
                  <Badge variant={status.variant} className="text-[9px] mt-1">
                    <StatusIcon className="w-2.5 h-2.5 mr-1" />
                    {status.label}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
