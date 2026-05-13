import { NextResponse } from 'next/server';
import businesses from '@/data/businesses.json';

// Future: replace with Supabase query + vector similarity search
// FUTURE_INTEGRATION: supabase.from('businesses').select('*').match({ city })
// FUTURE_INTEGRATION: vectorSearch(embeddings, userProfileEmbedding, topK=20)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const industry = searchParams.get('industry');
  const search = searchParams.get('search');

  let filtered = [...businesses];

  if (city) {
    filtered = filtered.filter(b => b.city === city);
  }
  if (industry) {
    filtered = filtered.filter(b => b.industry.toLowerCase().includes(industry.toLowerCase()));
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(b =>
      b.name.toLowerCase().includes(s) ||
      b.industry.toLowerCase().includes(s) ||
      b.offers.some(o => o.toLowerCase().includes(s)) ||
      b.description.toLowerCase().includes(s)
    );
  }

  return NextResponse.json({
    data: filtered,
    total: filtered.length,
    timestamp: new Date().toISOString(),
  });
}
