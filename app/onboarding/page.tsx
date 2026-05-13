'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background mesh-bg flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">BXI</p>
            <p className="text-[10px] text-muted-foreground">Barter Exchange of India</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span className="text-xs text-violet-400 font-medium">AI Onboarding</span>
          </div>
          <Link
            href="/login"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <OnboardingForm />
        </motion.div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {['🔒 Secure & Private', '🤖 AI-Powered Matching', '🇮🇳 Made for India', '✅ Free to Start'].map((b) => (
            <span key={b} className="text-[11px] text-muted-foreground">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
