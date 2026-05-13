'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/store/userStore';
import { Badge } from '@/components/ui/badge';
import { Save, User, Bell, Shield, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { userProfile, setUserProfile } = useUserStore();
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-in">
      <Header title="Settings" subtitle="Manage your BXI profile and preferences" />
      <div className="px-6 py-6 max-w-2xl space-y-6">

        {/* Profile Settings */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Company Profile</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-1.5 block">Company Name</Label>
              <Input defaultValue={userProfile?.companyName} className="h-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1.5 block">Industry</Label>
                <Input defaultValue={userProfile?.industry} className="h-9" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">City</Label>
                <Input defaultValue={userProfile?.city} className="h-9" />
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Description</Label>
              <Textarea defaultValue={userProfile?.description} className="h-20 text-xs" />
            </div>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-foreground">AI Matching Preferences</h3>
            <Badge variant="purple" className="text-[9px]">PRO</Badge>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Prioritize local matches (same city)', checked: true },
              { label: 'Include complementary industry suggestions', checked: true },
              { label: 'Enable AI opportunity alerts', checked: false },
              { label: 'WhatsApp notifications for new matches', checked: false },
            ].map((pref) => (
              <label key={pref.label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 rounded border-border" />
                <span className="text-sm text-foreground">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
