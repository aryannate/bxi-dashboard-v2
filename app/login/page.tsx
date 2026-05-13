'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Building2, Zap, Users, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/store/userStore';

const STATS = [
  { label: 'Active Businesses', value: '2,400+', icon: Users },
  { label: 'Barter Value Exchanged', value: '₹85Cr+', icon: IndianRupee },
  { label: 'Cities', value: '28', icon: Building2 },
  { label: 'AI Match Accuracy', value: '94%', icon: Zap },
];

export default function LoginPage() {
  const router = useRouter();
  const { initDemoProfile } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    initDemoProfile();
    router.push('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    initDemoProfile();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background mesh-bg flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col w-[55%] relative overflow-hidden bg-gradient-to-br from-violet-950/50 via-background to-background border-r border-border p-12">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <div>
            <p className="font-black text-lg text-foreground leading-tight">BXI</p>
            <p className="text-xs text-muted-foreground leading-tight">Barter Exchange of India</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-violet-400 font-medium">AI-Powered Barter Matching</span>
            </div>

            <h1 className="text-4xl font-black text-foreground leading-[1.15] mb-6">
              India&apos;s Smartest{' '}
              <span className="gradient-text-brand">B2B Barter</span>{' '}
              Marketplace
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-lg">
              BXI uses AI to match your business with the perfect barter partners.
              Exchange services, unlock dormant inventory, and grow — without cash.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-3 mb-10"
          >
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {[
              '🤖 AI Matchmaking',
              '📊 Smart Analytics',
              '💬 AI Chat Advisor',
              '🔔 Real-time Alerts',
              '🌍 Pan-India Network',
              '💰 Value Estimation',
            ].map((f) => (
              <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-muted/50 border border-border text-muted-foreground">
                {f}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Login */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black">B</span>
            </div>
            <span className="font-black text-foreground">BXI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your BXI dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-xs mb-1.5 block">Email address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-10"
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo Login */}
          <Button
            variant="gradient"
            className="w-full h-10 gap-2"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Sparkles className="w-4 h-4" />
            Try Demo — The Grand Meridian Hotel
          </Button>

          <p className="text-[11px] text-muted-foreground text-center mt-3">
            Demo pre-loaded with hotel profile + AI matches
          </p>

          {/* Sign Up */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            New to BXI?{' '}
            <button
              onClick={() => router.push('/onboarding')}
              className="text-primary hover:underline font-medium"
            >
              Create your profile →
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
