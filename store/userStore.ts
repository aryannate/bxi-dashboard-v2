'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Match, ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

interface UserStore {
  userProfile: UserProfile | null;
  matches: Match[];
  chatMessages: ChatMessage[];
  isOnboarded: boolean;
  isDemoMode: boolean;

  setUserProfile: (profile: Partial<UserProfile>) => void;
  setMatches: (matches: Match[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearProfile: () => void;
  setDemoMode: (val: boolean) => void;
  initDemoProfile: () => void;
}

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user',
  companyName: 'The Grand Meridian Hotel',
  industry: 'Hospitality',
  city: 'Mumbai',
  size: 'Large',
  description: 'Premium 5-star hotel in South Mumbai offering luxury banquet halls, fine dining, spa, and 200 rooms. Known for corporate events and destination weddings.',
  offers: ['Banquet Halls', 'Catering Services', 'Luxury Rooms', 'Conference Facilities', 'Spa Services', 'Fine Dining'],
  needs: ['Digital Marketing', 'Event Photography', 'Social Media Management', 'Corporate Client Referrals', 'Travel Agency Partnerships'],
  barterCategories: ['Events', 'Media', 'Travel', 'Marketing', 'Corporate'],
  excessInventory: ['Weekday banquet slots (Mon-Thu)', 'Off-season luxury suites (Jun-Aug)', 'Weekday restaurant tables (lunch)'],
  onboardingComplete: true,
  createdAt: new Date().toISOString(),
  aiTags: ['venue', 'luxury', 'events', 'corporate', 'banquet', 'hospitality'],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userProfile: null,
      matches: [],
      chatMessages: [],
      isOnboarded: false,
      isDemoMode: false,

      setUserProfile: (profile) =>
        set((state) => ({
          userProfile: {
            ...DEMO_PROFILE,
            ...state.userProfile,
            ...profile,
            id: state.userProfile?.id || generateId(),
            onboardingComplete: true,
            createdAt: state.userProfile?.createdAt || new Date().toISOString(),
          },
          isOnboarded: true,
        })),

      setMatches: (matches) => set({ matches }),

      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      clearProfile: () =>
        set({
          userProfile: null,
          matches: [],
          chatMessages: [],
          isOnboarded: false,
          isDemoMode: false,
        }),

      setDemoMode: (val) => set({ isDemoMode: val }),

      initDemoProfile: () =>
        set({
          userProfile: DEMO_PROFILE,
          isOnboarded: true,
          isDemoMode: true,
          chatMessages: [
            {
              id: generateId(),
              role: 'assistant',
              content: `Welcome to BXI, ${DEMO_PROFILE.companyName}! 🎉 I've analyzed the marketplace and found 12 high-quality barter partners for you. Your banquet halls and catering services are in massive demand. Ready to explore?`,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
    }),
    {
      name: 'bxi-user-store',
      partialize: (state) => ({
        userProfile: state.userProfile,
        isOnboarded: state.isOnboarded,
        isDemoMode: state.isDemoMode,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
