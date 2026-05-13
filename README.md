# BXI — Barter Exchange of India

AI-powered B2B barter marketplace dashboard. Built with Next.js 14, TailwindCSS, Zustand, Recharts, and Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Login

Click **"Try Demo — The Grand Meridian Hotel"** on the login page.
Pre-loaded with a hotel profile that generates immediate AI matches across 35 mock businesses.

## Tech Stack

- **Frontend**: Next.js 14 App Router + TypeScript
- **Styling**: TailwindCSS + custom CSS variables (dark/light mode)
- **State**: Zustand (persisted via localStorage)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI**: Custom components (shadcn/ui-compatible)

## Features

- AI-powered barter matchmaking engine
- Multi-step onboarding with smart tag inputs
- Personalized dashboard with 4 sections (Recommended, Looking For You, AI Insights, Marketplace)
- Floating AI chat assistant
- Analytics with charts and leaderboard
- Full marketplace with filters
- Dark/light mode
- 35 mock Indian businesses across 15+ industries

## Project Structure

```
app/              — Next.js pages and API routes
components/       — UI, layout, dashboard, onboarding components
data/             — businesses.json (35 mock businesses)
lib/              — matching engine, AI suggestions, utils
store/            — Zustand user store
types/            — TypeScript interfaces
```

## Future Integrations (placeholders in code)

- Gemini/OpenAI embeddings for semantic matching
- Supabase for persistent storage + vector search
- n8n workflows for automation
- WhatsApp notifications via n8n
- Real Gemini API for AI chat
