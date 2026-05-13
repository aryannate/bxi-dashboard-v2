'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { useUserStore } from '@/store/userStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isOnboarded } = useUserStore();

  useEffect(() => {
    if (!isOnboarded) {
      router.replace('/login');
    }
  }, [isOnboarded, router]);

  if (!isOnboarded) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
      <AIAssistant />
    </div>
  );
}
