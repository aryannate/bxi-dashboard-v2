import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai-suggestions';
import { UserProfile } from '@/types';

// Future: Replace mock responses with real Gemini API
// FUTURE_INTEGRATION: const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
// FUTURE_INTEGRATION: const model = genAI.getGenerativeModel({ model: "gemini-pro" })
// FUTURE_INTEGRATION: const result = await model.generateContent(prompt)
// FUTURE_INTEGRATION: WhatsApp integration via n8n webhook for barter alerts

export async function POST(request: Request) {
  try {
    const { message, userProfile, matchCount } = await request.json();

    if (!message || !userProfile) {
      return NextResponse.json({ error: 'Missing message or profile' }, { status: 400 });
    }

    // Simulate AI processing time
    await new Promise(r => setTimeout(r, 200));

    const response = generateChatResponse(message, userProfile as UserProfile, matchCount || 0);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Chat processing failed' }, { status: 500 });
  }
}
