import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

export function getMatchColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 65) return 'text-yellow-400';
  if (score >= 50) return 'text-orange-400';
  return 'text-slate-400';
}

export function getMatchBg(score: number): string {
  if (score >= 80) return 'bg-emerald-400/10 border-emerald-400/20';
  if (score >= 65) return 'bg-yellow-400/10 border-yellow-400/20';
  if (score >= 50) return 'bg-orange-400/10 border-orange-400/20';
  return 'bg-slate-400/10 border-slate-400/20';
}

export function getMatchLabel(score: number): string {
  if (score >= 85) return 'Excellent Match';
  if (score >= 70) return 'Strong Match';
  if (score >= 55) return 'Good Match';
  if (score >= 40) return 'Potential Match';
  return 'Possible Match';
}

export function getIndustryEmoji(industry: string): string {
  const map: Record<string, string> = {
    'Hospitality': '🏨',
    'Events': '🎉',
    'Media': '📺',
    'Travel': '✈️',
    'Wellness': '💪',
    'Advertising': '📢',
    'Beauty & Personal Care': '💄',
    'Influencer Marketing': '📸',
    'Creative Agency': '🎨',
    'Catering': '🍽️',
    'Digital Media': '💻',
    'Travel & Hospitality': '🌴',
    'Photography': '📷',
    'Beauty & Wellness': '💅',
    'Corporate Gifting': '🎁',
    'Boutique Hospitality': '🏡',
    'Aviation & Logistics': '🛫',
    'Venues & Events': '🏛️',
    'Media & Publishing': '📰',
    'Home & Corporate Services': '🏠',
    'Exhibitions & Trade Shows': '🏢',
    'Fitness & Wellness': '🏋️',
    'Automotive & Transport': '🚗',
    'Food & Corporate Catering': '🍱',
    'Printing & Stationery': '🖨️',
    'Medical Aesthetics': '✨',
    'Entertainment & Events': '🎭',
    'Budget Hospitality': '🏩',
    'Spa & Wellness': '🧖',
    'Exhibition & Event Venues': '🏗️',
    'Media & Journalism': '📡',
    'Digital Marketing': '📊',
    'Floristry & Event Decor': '🌸',
  };
  return map[industry] || '🏢';
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 7) return `${Math.floor(days / 7)}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
