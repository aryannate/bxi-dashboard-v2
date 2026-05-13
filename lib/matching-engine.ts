import { Business, UserProfile, Match } from '@/types';

// Industry complementarity matrix
const INDUSTRY_COMPLEMENTARY: Record<string, string[]> = {
  'Hospitality': ['Events', 'Media', 'Travel', 'Advertising', 'Corporate Gifting', 'Catering', 'Photography', 'Entertainment & Events', 'Floristry & Event Decor', 'Venues & Events', 'Boutique Hospitality', 'Influencer Marketing'],
  'Events': ['Hospitality', 'Media', 'Catering', 'Advertising', 'Photography', 'Floristry & Event Decor', 'Entertainment & Events', 'Venues & Events', 'Travel', 'Printing & Stationery'],
  'Media': ['Hospitality', 'Events', 'Advertising', 'Digital Marketing', 'Travel', 'Corporate Gifting', 'Entertainment & Events', 'Influencer Marketing'],
  'Travel': ['Hospitality', 'Media', 'Events', 'Advertising', 'Corporate Gifting', 'Aviation & Logistics', 'Boutique Hospitality'],
  'Advertising': ['Media', 'Events', 'Digital Marketing', 'Photography', 'Printing & Stationery', 'Creative Agency'],
  'Digital Marketing': ['Media', 'Advertising', 'Creative Agency', 'Influencer Marketing', 'Events'],
  'Wellness': ['Hospitality', 'Corporate Gifting', 'Spa & Wellness', 'Fitness & Wellness', 'Beauty & Personal Care', 'Medical Aesthetics'],
  'Beauty & Personal Care': ['Wellness', 'Media', 'Influencer Marketing', 'Events', 'Hospitality'],
  'Corporate Gifting': ['Hospitality', 'Events', 'Media', 'Travel', 'Advertising'],
  'Exhibition & Event Venues': ['Events', 'Hospitality', 'Travel', 'Media', 'Catering'],
  'Entertainment & Events': ['Hospitality', 'Media', 'Events', 'Travel', 'Advertising'],
};

function tokenize(str: string): string[] {
  return str.toLowerCase().split(/[\s,&\/]+/).filter(Boolean);
}

function semanticOverlap(arr1: string[], arr2: string[]): number {
  const tokens1 = arr1.flatMap(tokenize);
  const tokens2 = arr2.flatMap(tokenize);
  const set2 = new Set(tokens2);

  let hits = 0;
  for (const token of tokens1) {
    if (set2.has(token) && token.length > 3) hits++;
    else {
      for (const t2 of tokens2) {
        if ((token.includes(t2) || t2.includes(token)) && Math.min(token.length, t2.length) > 4) {
          hits += 0.5;
          break;
        }
      }
    }
  }
  return Math.min(hits / Math.max(tokens1.length, 1), 1);
}

function generateMatchReasons(
  userProfile: UserProfile,
  business: Business,
  offerNeedScore: number,
  needOfferScore: number,
  cityMatch: boolean,
  industryComp: boolean
): string[] {
  const reasons: string[] = [];

  if (cityMatch) {
    reasons.push(`Both based in ${userProfile.city} — local barter preferred`);
  }
  if (industryComp) {
    reasons.push(`${business.industry} and ${userProfile.industry} are natural barter partners`);
  }
  if (offerNeedScore > 0.2) {
    const matchedOffer = userProfile.offers.find(o =>
      business.needs.some(n => n.toLowerCase().includes(o.toLowerCase().split(' ')[0]) || o.toLowerCase().includes(n.toLowerCase().split(' ')[0]))
    );
    if (matchedOffer) {
      reasons.push(`Your "${matchedOffer}" directly matches their listed needs`);
    } else {
      reasons.push(`Your offerings align with their barter requirements`);
    }
  }
  if (needOfferScore > 0.2) {
    const matchedNeed = userProfile.needs.find(n =>
      business.offers.some(o => o.toLowerCase().includes(n.toLowerCase().split(' ')[0]) || n.toLowerCase().includes(o.toLowerCase().split(' ')[0]))
    );
    if (matchedNeed) {
      reasons.push(`They offer "${matchedNeed}" which is on your needs list`);
    } else {
      reasons.push(`Their offerings can fulfill your key barter needs`);
    }
  }
  if (business.excessInventory?.length > 0) {
    reasons.push(`They have excess "${business.excessInventory[0]}" ready to barter`);
  }
  if (reasons.length === 0) {
    reasons.push(`Compatible barter categories in ${business.barterCategories[0]}`);
  }
  return reasons.slice(0, 3);
}

export function calculateMatchScore(
  userProfile: UserProfile,
  business: Business
): { score: number; reasons: string[] } {
  let score = 0;

  // City match
  const cityMatch = userProfile.city === business.city;
  if (cityMatch) score += 18;
  else if (
    ['Mumbai', 'Delhi', 'Bangalore', 'NCR'].some(c => [userProfile.city, business.city].includes(c))
  ) score += 5;

  // Industry complementarity
  const compIndustries = INDUSTRY_COMPLEMENTARY[userProfile.industry] || [];
  const industryComp = compIndustries.some(i =>
    business.industry.toLowerCase().includes(i.toLowerCase()) ||
    i.toLowerCase().includes(business.industry.toLowerCase())
  );
  if (industryComp) score += 22;

  // Same industry (direct peer barter)
  if (userProfile.industry === business.industry) score += 10;

  // Offer matches their needs
  const offerNeedScore = semanticOverlap(userProfile.offers, business.needs);
  score += Math.round(offerNeedScore * 28);

  // Their offers match user needs
  const needOfferScore = semanticOverlap(userProfile.needs, business.offers);
  score += Math.round(needOfferScore * 28);

  // Barter category overlap
  const catOverlap = semanticOverlap(userProfile.barterCategories, business.barterCategories);
  score += Math.round(catOverlap * 15);

  // AI tag overlap
  const tagOverlap = semanticOverlap(userProfile.aiTags || [], business.aiTags);
  score += Math.round(tagOverlap * 10);

  // Excess inventory bonus
  if (business.excessInventory?.length > 0) score += 5;

  const finalScore = Math.min(Math.max(score, 10), 99);

  const reasons = generateMatchReasons(
    userProfile, business,
    offerNeedScore, needOfferScore,
    cityMatch, industryComp
  );

  return { score: finalScore, reasons };
}

export function getMatches(userProfile: UserProfile, businesses: Business[]): Match[] {
  return businesses
    .map(business => {
      const { score, reasons } = calculateMatchScore(userProfile, business);
      const matchType: Match['matchType'] =
        score >= 72 ? 'recommended' :
        score >= 52 ? 'looking_for_you' : 'opportunity';

      const estimatedValues = ['₹5L–15L', '₹2L–8L', '₹10L–30L', '₹1L–5L', '₹15L–50L'];
      const estimatedValue = estimatedValues[Math.floor(score / 20)];

      return {
        business: { ...business, matchScore: score, matchReasons: reasons },
        score,
        reasons,
        matchType,
        estimatedValue,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getRecommended(matches: Match[]): Match[] {
  return matches.filter(m => m.matchType === 'recommended').slice(0, 8);
}

export function getLookingForYou(matches: Match[]): Match[] {
  return matches.filter(m => m.matchType === 'looking_for_you').slice(0, 8);
}

export function getOpportunities(matches: Match[]): Match[] {
  return matches.filter(m => m.matchType === 'opportunity').slice(0, 6);
}
