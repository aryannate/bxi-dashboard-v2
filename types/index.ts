export interface Business {
  id: string;
  name: string;
  industry: string;
  city: string;
  size: 'Small' | 'Medium' | 'Large' | 'Enterprise';
  description: string;
  offers: string[];
  needs: string[];
  barterCategories: string[];
  inventoryType: string;
  aiTags: string[];
  excessInventory: string[];
  logo?: string;
  website?: string;
  contactEmail?: string;
  matchScore?: number;
  matchReasons?: string[];
}

export interface UserProfile {
  id: string;
  companyName: string;
  industry: string;
  city: string;
  size: string;
  description: string;
  offers: string[];
  needs: string[];
  barterCategories: string[];
  excessInventory: string[];
  onboardingComplete: boolean;
  createdAt: string;
}

export interface Match {
  business: Business;
  score: number;
  reasons: string[];
  matchType: 'recommended' | 'looking_for_you' | 'opportunity';
  estimatedValue?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AnalyticsData {
  totalOpportunities: number;
  averageMatchScore: number;
  activeRecommendations: number;
  estimatedBarterValue: number;
  profileCompleteness: number;
  weeklyActivity: { day: string; matches: number; connections: number }[];
  categoryBreakdown: { category: string; value: number; color: string }[];
  matchScoreTrend: { week: string; score: number }[];
  topIndustries: { industry: string; count: number }[];
}

export interface MarketplaceListing {
  id: string;
  business: Business;
  title: string;
  offeringItem: string;
  seekingItem: string;
  estimatedValue: string;
  urgency: 'low' | 'medium' | 'high';
  postedAt: string;
  expiresAt: string;
  views: number;
  relevanceScore: number;
}
