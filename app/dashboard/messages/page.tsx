'use client';

import { Header } from '@/components/layout/Header';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const MOCK_MESSAGES = [
  { id: '1', from: 'WedMeGood Events', preview: 'Interested in bartering banquet space for event planning services...', time: '2h ago', unread: true },
  { id: '2', from: 'Times Network', preview: 'We have unsold TV ad slots — would love to explore a barter...', time: '5h ago', unread: true },
  { id: '3', from: 'Percept Limited', preview: 'Your catering offering matches our Q4 client requirements...', time: '1d ago', unread: false },
  { id: '4', from: 'Club Mahindra', preview: 'Looking to barter resort packages for banquet access during peak...', time: '2d ago', unread: false },
];

export default function MessagesPage() {
  return (
    <div className="page-in">
      <Header title="Messages" subtitle="Barter conversation threads" />
      <div className="px-6 py-6 max-w-2xl">
        <div className="space-y-2">
          {MOCK_MESSAGES.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 text-lg">
                🏢
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{msg.from}</p>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{msg.preview}</p>
              </div>
              {msg.unread && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center py-8 border border-dashed border-border rounded-xl">
          <Sparkles className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">WhatsApp Integration Coming Soon</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Get real-time barter proposals and alerts directly on WhatsApp via n8n automation
          </p>
        </div>
      </div>
    </div>
  );
}
