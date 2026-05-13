'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Store,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Zap,
  Bell,
  Users,
  ArrowLeftRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    href: '/dashboard/marketplace',
    label: 'Marketplace',
    icon: Store,
    badge: null,
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    href: '/dashboard/matches',
    label: 'My Matches',
    icon: Users,
    badge: '12',
  },
  {
    href: '/dashboard/messages',
    label: 'Messages',
    icon: MessageSquare,
    badge: '3',
  },
  {
    href: '/dashboard/transactions',
    label: 'Transactions',
    icon: ArrowLeftRight,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, clearProfile } = useUserStore();

  const initials = userProfile?.companyName
    ?.split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('') || 'BX';

  return (
    <aside className="flex flex-col h-screen w-60 border-r border-border bg-card/50 backdrop-blur-sm fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <div>
          <div className="font-bold text-sm text-foreground leading-tight">BXI</div>
          <div className="text-[10px] text-muted-foreground leading-tight">Barter Exchange of India</div>
        </div>
        <div className="ml-auto">
          <Badge variant="purple" className="text-[9px] px-1.5 py-0">AI</Badge>
        </div>
      </div>

      {/* AI Status */}
      <div className="mx-3 my-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-violet-400 font-medium">AI Engine Active</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Analyzing 35 businesses</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-item',
                isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border border-violet-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400">Pro Features</span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">
          Unlock AI deep-matching, WhatsApp alerts & analytics
        </p>
        <button className="w-full text-[10px] font-medium bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-md py-1.5 transition-colors">
          Upgrade to Pro →
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-border mx-3" />

      {/* Profile + Logout */}
      <div className="px-3 py-3 space-y-0.5">
        <Link href="/dashboard/settings" className="sidebar-item sidebar-item-inactive">
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span>Settings</span>
        </Link>
        <button
          onClick={() => { clearProfile(); router.push('/login'); }}
          className="sidebar-item sidebar-item-inactive w-full text-left text-red-400 hover:text-red-300 hover:bg-red-400/5"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{userProfile?.companyName}</p>
            <p className="text-[10px] text-muted-foreground truncate">{userProfile?.industry} · {userProfile?.city}</p>
          </div>
          <Bell className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
