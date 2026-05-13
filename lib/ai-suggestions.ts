import { UserProfile, Match, ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

export interface AISuggestion {
  id: string;
  type: 'opportunity' | 'insight' | 'action' | 'warning';
  icon: string;
  title: string;
  description: string;
  ctaText?: string;
  impact: 'high' | 'medium' | 'low';
  estimatedValue?: string;
}

export function generateAISuggestions(
  userProfile: UserProfile,
  topMatches: Match[]
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const city = userProfile.city;
  const industry = userProfile.industry;

  // Excess inventory suggestion
  if (userProfile.excessInventory?.length > 0) {
    const item = userProfile.excessInventory[0];
    suggestions.push({
      id: generateId(),
      type: 'opportunity',
      icon: '⚡',
      title: `Monetize Your Excess ${item}`,
      description: `Your ${item} appears underutilized. ${topMatches.slice(0, 3).map(m => m.business.name).join(', ')} are actively seeking this. A 3-month barter partnership could unlock ₹12–20L in equivalent value.`,
      ctaText: 'View Partners',
      impact: 'high',
      estimatedValue: '₹12–20L',
    });
  }

  // City-based insight
  const localMatches = topMatches.filter(m => m.business.city === city);
  if (localMatches.length > 0) {
    suggestions.push({
      id: generateId(),
      type: 'insight',
      icon: '📍',
      title: `${localMatches.length} Local Barter Opportunities in ${city}`,
      description: `Local barters have 3× faster closure rates. ${localMatches[0]?.business.name} and ${localMatches[1]?.business?.name || 'others'} are high-fit matches within ${city} right now.`,
      ctaText: 'Explore Local Matches',
      impact: 'high',
      estimatedValue: '₹8–25L',
    });
  }

  // Needs-based suggestion
  if (userProfile.needs?.length > 0) {
    const primaryNeed = userProfile.needs[0];
    const needMatch = topMatches.find(m =>
      m.business.offers.some(o => o.toLowerCase().includes(primaryNeed.toLowerCase().split(' ')[0]))
    );
    if (needMatch) {
      suggestions.push({
        id: generateId(),
        type: 'action',
        icon: '🎯',
        title: `Get ${primaryNeed} Through Barter`,
        description: `Instead of paying cash for ${primaryNeed}, ${needMatch.business.name} (${needMatch.score}% match) offers exactly this. Propose a service swap using your ${userProfile.offers[0]}.`,
        ctaText: 'Initiate Barter',
        impact: 'high',
        estimatedValue: '₹5–15L saved',
      });
    }
  }

  // Industry-specific insights
  if (industry === 'Hospitality') {
    suggestions.push({
      id: generateId(),
      type: 'opportunity',
      icon: '🎪',
      title: 'Weekday Venue Utilization Gap Detected',
      description: `Your Monday–Wednesday slots show the lowest demand industry-wide. Barter these with event companies, media agencies for shoots, and startup offices for offsites. Avg value: ₹2.5L/slot.`,
      ctaText: 'List Weekday Slots',
      impact: 'high',
      estimatedValue: '₹2.5L/slot',
    });
    suggestions.push({
      id: generateId(),
      type: 'insight',
      icon: '💡',
      title: 'Influencer Collaboration = 8× Media ROI',
      description: `Hotels that barter room nights with top influencers see 8× ROI vs paid media. 3 influencer platforms in your city are seeking exactly your category of property.`,
      ctaText: 'Connect Influencers',
      impact: 'medium',
    });
  }

  if (industry === 'Events') {
    suggestions.push({
      id: generateId(),
      type: 'opportunity',
      icon: '🏨',
      title: 'Bundle Venue + Catering for Higher Barter Value',
      description: `Partner with 2 hotels and 1 catering company to create an end-to-end event package. This 3-way barter club multiplies individual barter value by 2.4×.`,
      ctaText: 'Form Barter Club',
      impact: 'high',
      estimatedValue: '₹20–50L',
    });
  }

  if (industry === 'Media' || industry === 'Advertising' || industry === 'Digital Marketing') {
    suggestions.push({
      id: generateId(),
      type: 'opportunity',
      icon: '📡',
      title: 'Trade Unsold Ad Inventory for Premium Services',
      description: `Unsold media inventory worth ₹8–30L/month can be bartered for hotel stays, event venues, catering, and travel that your team currently pays cash for.`,
      ctaText: 'Value My Inventory',
      impact: 'high',
      estimatedValue: '₹8–30L/mo',
    });
  }

  if (industry === 'Travel' || industry === 'Travel & Hospitality') {
    suggestions.push({
      id: generateId(),
      type: 'insight',
      icon: '✈️',
      title: 'MICE Travel Is the Highest-Value Barter Category',
      description: `Corporate event planners in ${city} are seeking exactly your MICE packages. A barter deal with 3 event companies could generate ₹40L+ in exposure and leads.`,
      ctaText: 'Explore MICE Barters',
      impact: 'high',
      estimatedValue: '₹40L+',
    });
  }

  // Profile completeness nudge
  const completeness = getProfileCompleteness(userProfile);
  if (completeness < 80) {
    suggestions.push({
      id: generateId(),
      type: 'warning',
      icon: '⚠️',
      title: `Complete Your Profile for ${Math.round((100 - completeness) / 10) * 10}% More Matches`,
      description: `Your profile is ${completeness}% complete. Adding more details about your ${userProfile.offers.length < 3 ? 'offerings' : 'specific needs'} can unlock significantly better AI matches.`,
      ctaText: 'Complete Profile',
      impact: 'medium',
    });
  }

  return suggestions.slice(0, 5);
}

export function getProfileCompleteness(profile: UserProfile): number {
  let score = 0;
  if (profile.companyName) score += 15;
  if (profile.industry) score += 15;
  if (profile.city) score += 10;
  if (profile.description) score += 10;
  if (profile.offers?.length >= 3) score += 20;
  else if (profile.offers?.length > 0) score += 10;
  if (profile.needs?.length >= 3) score += 15;
  else if (profile.needs?.length > 0) score += 8;
  if (profile.barterCategories?.length >= 2) score += 10;
  if (profile.excessInventory?.length > 0) score += 5;
  return score;
}

// Mock AI chat responses
const RESPONSE_TEMPLATES = {
  greeting: [
    `Welcome to BXI! I'm your AI barter advisor. I've analyzed ${35} businesses on the platform and found several excellent matches for your profile. What would you like to explore?`,
  ],
  match: [
    (profile: UserProfile, count: number) =>
      `I've analyzed ${count} potential barter partners for ${profile.companyName}. Your top matches are in ${['Events', 'Media', 'Travel'].join(', ')} sectors. The strongest opportunity: your ${profile.offers?.[0] || 'offerings'} directly aligns with several high-value businesses seeking exactly what you offer.`,
  ],
  value: [
    (profile: UserProfile) =>
      `Based on your inventory and ${profile.city} market data, your barter potential is estimated at ₹15–40L annually. Key driver: your ${profile.offers?.[0] || 'primary service'} has the highest demand-to-supply ratio on BXI right now.`,
  ],
  howto: [
    `Barter on BXI works in 3 steps: (1) Connect with a match and propose a swap. (2) Agree on fair value using BXI's valuation engine. (3) Exchange services tracked on the platform. Payment in BXI Credits for any value difference.`,
  ],
  default: [
    (profile: UserProfile) =>
      `Great question! For ${profile.companyName} in the ${profile.industry} space, I see strong barter opportunities in ${profile.barterCategories?.[0] || 'your category'}. Would you like me to narrow down matches by city, value range, or specific service type?`,
  ],
};

export function generateChatResponse(
  userMessage: string,
  userProfile: UserProfile,
  matchCount: number
): ChatMessage {
  const msg = userMessage.toLowerCase();
  let content = '';

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('start')) {
    content = RESPONSE_TEMPLATES.greeting[0];
  } else if (msg.includes('match') || msg.includes('recommend') || msg.includes('partner') || msg.includes('who')) {
    content = RESPONSE_TEMPLATES.match[0](userProfile, matchCount);
  } else if (msg.includes('value') || msg.includes('worth') || msg.includes('much') || msg.includes('earn') || msg.includes('money')) {
    content = RESPONSE_TEMPLATES.value[0](userProfile);
  } else if (msg.includes('how') || msg.includes('work') || msg.includes('process') || msg.includes('start')) {
    content = RESPONSE_TEMPLATES.howto[0];
  } else if (msg.includes('hotel') || msg.includes('venue') || msg.includes('hospitality')) {
    content = `Hotels are one of the most active barter categories on BXI. They offer high-value assets like banquet halls, rooms, and catering that virtually every other industry needs. For your profile, hotel barters could cover your ${userProfile.needs?.[0] || 'key needs'} completely.`;
  } else if (msg.includes('media') || msg.includes('advertis') || msg.includes('marketing')) {
    content = `Media inventory is a goldmine for barter. Unsold ad slots, digital placements, and content creation hours are in massive demand from hotels, event companies, and luxury brands. BXI has 8 media partners looking for exactly what you offer.`;
  } else if (msg.includes('event') || msg.includes('wedding') || msg.includes('conference')) {
    content = `Events businesses are top barter performers on BXI. They need venue, catering, accommodation, and AV — and they offer event management, photography, and promotion. For ${userProfile.companyName}, event company partnerships could be transformative.`;
  } else if (msg.includes('travel') || msg.includes('hotel') || msg.includes('flight')) {
    content = `Travel is a universal barter currency. Holiday packages, MICE travel, and corporate stays are things every business needs but few pay cash for. BXI has MakeMyTrip, Club Mahindra, and IndiGo as active barter partners in the travel space.`;
  } else if (msg.includes('excess') || msg.includes('inventory') || msg.includes('waste') || msg.includes('unused')) {
    content = `Your excess inventory is your biggest untapped barter asset. BXI's AI identifies underutilized assets across your profile and matches them with businesses that have immediate demand. What specific excess do you want to monetize first?`;
  } else {
    content = RESPONSE_TEMPLATES.default[0](userProfile);
  }

  return {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
  };
}

// Quick action suggestions for AI chat
export const CHAT_QUICK_ACTIONS = [
  'Who are my best matches?',
  'What is my barter potential value?',
  'Show me local opportunities',
  'How does BXI barter work?',
  'What should I list first?',
];
