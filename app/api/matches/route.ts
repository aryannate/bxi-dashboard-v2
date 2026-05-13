import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/matching-engine';
import businesses from '@/data/businesses.json';
import { UserProfile } from '@/types';

// Future: integrate Gemini/OpenAI embeddings for semantic matching
// FUTURE_INTEGRATION: const embeddings = await gemini.embedContent(userProfile)
// FUTURE_INTEGRATION: const semanticMatches = await vectorStore.query(embeddings)
// FUTURE_INTEGRATION: n8n webhook trigger for async match computation

export async function POST(request: Request) {
  try {
    const userProfile: UserProfile = await request.json();

    if (!userProfile?.companyName) {
      return NextResponse.json({ error: 'Invalid user profile' }, { status: 400 });
    }

    // @ts-ignore
    const matches = getMatches(userProfile, businesses);
    const top = matches.slice(0, 20);

    return NextResponse.json({
      matches: top,
      total: matches.length,
      topScore: top[0]?.score || 0,
      averageScore: Math.round(top.reduce((a, m) => a + m.score, 0) / (top.length || 1)),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Match computation failed' }, { status: 500 });
  }
}
