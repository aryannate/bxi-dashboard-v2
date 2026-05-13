'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Building2, MapPin, Users, Layers, Package, ShoppingBag,
  Tag, ChevronRight, ChevronLeft, Check, Sparkles, X, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Company Info', icon: Building2, description: 'Tell us about your business' },
  { id: 2, title: 'What You Offer', icon: Package, description: 'Products & services you can barter' },
  { id: 3, title: 'What You Need', icon: ShoppingBag, description: 'What you want in exchange' },
  { id: 4, title: 'Excess Inventory', icon: Layers, description: 'Underutilized assets to barter' },
  { id: 5, title: 'Barter Categories', icon: Tag, description: 'Preferred exchange categories' },
];

const INDUSTRIES = [
  'Hospitality', 'Events', 'Media', 'Advertising', 'Travel', 'Wellness',
  'Beauty & Personal Care', 'Digital Marketing', 'Corporate Gifting', 'Catering',
  'Photography', 'Printing & Stationery', 'Automotive', 'Real Estate',
  'Fitness & Wellness', 'Retail', 'F&B / Restaurant', 'Aviation', 'Exhibition',
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata'];

const COMPANY_SIZES = [
  { value: 'Small', label: 'Small', sub: '1–20 employees' },
  { value: 'Medium', label: 'Medium', sub: '21–100 employees' },
  { value: 'Large', label: 'Large', sub: '100–500 employees' },
  { value: 'Enterprise', label: 'Enterprise', sub: '500+ employees' },
];

const BARTER_CATEGORIES = [
  'Hospitality', 'Events', 'Media', 'Travel', 'Marketing', 'Corporate',
  'Wellness', 'F&B', 'Creative', 'Technology', 'Retail', 'Education',
  'Entertainment', 'Advertising', 'Logistics', 'Real Estate',
];

interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder: string;
  suggestions?: string[];
  color?: 'purple' | 'blue' | 'emerald' | 'orange';
}

function TagInput({ tags, onAdd, onRemove, placeholder, suggestions = [], color = 'purple' }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onAdd(val);
      setInput('');
    }
  };

  const colorMap = {
    purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <div className="space-y-2">
      {/* Tags display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                colorMap[color]
              )}
            >
              {tag}
              <button onClick={() => onRemove(tag)} className="hover:opacity-70 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={handleAdd} disabled={!input.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions.filter(s => !tags.includes(s)).slice(0, 8).map((s) => (
            <button
              key={s}
              onClick={() => onAdd(s)}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors border border-border"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function OnboardingForm() {
  const router = useRouter();
  const { setUserProfile } = useUserStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    city: '',
    size: '',
    description: '',
    offers: [] as string[],
    needs: [] as string[],
    excessInventory: [] as string[],
    barterCategories: [] as string[],
  });

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const canProceed = () => {
    if (step === 1) return form.companyName.trim() && form.industry && form.city && form.size;
    if (step === 2) return form.offers.length >= 1;
    if (step === 3) return form.needs.length >= 1;
    if (step === 4) return true; // optional
    if (step === 5) return form.barterCategories.length >= 1;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setUserProfile({
      ...form,
      id: '',
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
      // @ts-ignore
      aiTags: form.offers.concat(form.barterCategories).map(s => s.toLowerCase().replace(/\s+/g, '-')),
    });
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                s.id < step
                  ? 'bg-emerald-500 text-white'
                  : s.id === step
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                  : 'bg-muted text-muted-foreground'
              )}>
                {s.id < step ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className={cn(
                'text-[9px] font-medium hidden sm:block',
                s.id === step ? 'text-primary' : 'text-muted-foreground'
              )}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Tell us about your company</h2>
                <p className="text-sm text-muted-foreground mt-1">This helps AI personalize your barter matches</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Company Name *</Label>
                  <Input
                    value={form.companyName}
                    onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))}
                    placeholder="e.g. The Grand Meridian Hotel"
                    className="h-10"
                  />
                </div>

                <div>
                  <Label className="text-xs mb-1.5 block">Industry *</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setForm(f => ({ ...f, industry: ind }))}
                        className={cn(
                          'text-[11px] px-2 py-1.5 rounded-lg border transition-all text-left truncate',
                          form.industry === ind
                            ? 'bg-primary/10 border-primary/40 text-primary font-medium'
                            : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                        )}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1.5 block">City *</Label>
                    <div className="grid grid-cols-2 gap-1">
                      {CITIES.map((city) => (
                        <button
                          key={city}
                          onClick={() => setForm(f => ({ ...f, city }))}
                          className={cn(
                            'text-[11px] px-2 py-1.5 rounded-lg border transition-all',
                            form.city === city
                              ? 'bg-primary/10 border-primary/40 text-primary font-medium'
                              : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                          )}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1.5 block">Company Size *</Label>
                    <div className="space-y-1">
                      {COMPANY_SIZES.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => setForm(f => ({ ...f, size: size.value }))}
                          className={cn(
                            'w-full text-left px-2.5 py-2 rounded-lg border transition-all',
                            form.size === size.value
                              ? 'bg-primary/10 border-primary/40'
                              : 'border-border hover:border-primary/30'
                          )}
                        >
                          <p className={cn('text-[11px] font-medium', form.size === size.value ? 'text-primary' : 'text-foreground')}>{size.label}</p>
                          <p className="text-[10px] text-muted-foreground">{size.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-1.5 block">Company Description (optional)</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of your business..."
                    className="h-16 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">What do you offer?</h2>
                <p className="text-sm text-muted-foreground mt-1">Products, services, or assets you can barter</p>
              </div>
              <TagInput
                tags={form.offers}
                onAdd={(t) => setForm(f => ({ ...f, offers: [...f.offers, t] }))}
                onRemove={(t) => setForm(f => ({ ...f, offers: f.offers.filter(x => x !== t) }))}
                placeholder="e.g. Banquet Halls, Catering Services..."
                color="purple"
                suggestions={[
                  'Banquet Halls', 'Hotel Rooms', 'Catering Services', 'Conference Rooms',
                  'Spa Services', 'Digital Marketing', 'Event Management', 'Print Media',
                  'TV Advertising', 'Photography', 'Video Production', 'Office Space',
                  'Holiday Packages', 'Gym Memberships', 'Beauty Services', 'Creative Design',
                ]}
              />
              <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/15">
                <p className="text-xs text-violet-400 font-medium mb-1">💡 Pro Tip</p>
                <p className="text-[11px] text-muted-foreground">Add at least 3 offerings. The more specific, the better your AI matches will be.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">What do you need?</h2>
                <p className="text-sm text-muted-foreground mt-1">Services or products you want to receive through barter</p>
              </div>
              <TagInput
                tags={form.needs}
                onAdd={(t) => setForm(f => ({ ...f, needs: [...f.needs, t] }))}
                onRemove={(t) => setForm(f => ({ ...f, needs: f.needs.filter(x => x !== t) }))}
                placeholder="e.g. Digital Marketing, Event Photography..."
                color="blue"
                suggestions={[
                  'Digital Marketing', 'Social Media Management', 'Event Photography',
                  'Travel Packages', 'Corporate Gifting', 'PR & Communications',
                  'Video Content', 'Print Advertising', 'Office Supplies',
                  'Training & Development', 'Recruitment Services', 'IT Services',
                ]}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Any excess inventory?</h2>
                <p className="text-sm text-muted-foreground mt-1">Underutilized assets — the AI will suggest who needs them</p>
              </div>
              <TagInput
                tags={form.excessInventory}
                onAdd={(t) => setForm(f => ({ ...f, excessInventory: [...f.excessInventory, t] }))}
                onRemove={(t) => setForm(f => ({ ...f, excessInventory: f.excessInventory.filter(x => x !== t) }))}
                placeholder="e.g. Weekday banquet slots, Off-season rooms..."
                color="orange"
                suggestions={[
                  'Weekday banquet slots', 'Off-season rooms', 'Unsold ad slots',
                  'Unused studio time', 'Extra print capacity', 'Off-peak travel packages',
                  'Empty cargo space', 'Unused membership slots', 'Excess raw materials',
                ]}
              />
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <p className="text-xs text-emerald-400 font-medium mb-1">💰 Did You Know?</p>
                <p className="text-[11px] text-muted-foreground">Businesses that list excess inventory get 2.3× more barter proposals on BXI.</p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Preferred barter categories</h2>
                <p className="text-sm text-muted-foreground mt-1">What industries do you want to partner with?</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {BARTER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setForm(f => ({
                        ...f,
                        barterCategories: f.barterCategories.includes(cat)
                          ? f.barterCategories.filter(c => c !== cat)
                          : [...f.barterCategories, cat],
                      }));
                    }}
                    className={cn(
                      'text-[11px] px-2 py-2 rounded-lg border transition-all font-medium',
                      form.barterCategories.includes(cat)
                        ? 'bg-primary/10 border-primary/40 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Summary */}
              {form.companyName && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">Your Profile Summary</p>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <p><span className="text-foreground font-medium">{form.companyName}</span> · {form.industry} · {form.city}</p>
                    <p>Offers: {form.offers.slice(0, 3).join(', ')}{form.offers.length > 3 ? ` +${form.offers.length - 3}` : ''}</p>
                    <p>Needs: {form.needs.slice(0, 3).join(', ')}{form.needs.length > 3 ? ` +${form.needs.length - 3}` : ''}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          className="gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        {step < STEPS.length ? (
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className="gap-1.5"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            variant="gradient"
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Launch AI Dashboard
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
