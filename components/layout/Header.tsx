'use client';

import { Search, Bell, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/userStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { userProfile } = useUserStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search businesses, categories..."
            className="pl-8 w-56 h-8 text-xs bg-muted/50 border-muted"
          />
        </div>

        {/* AI Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span className="text-xs text-violet-400 font-medium">
            {userProfile?.city ? `${userProfile.city} Market` : 'AI Active'}
          </span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-lg h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
        </Button>

        <ThemeToggle />
      </div>
    </header>
  );
}
