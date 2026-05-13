'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserStore } from '@/store/userStore';
import { generateChatResponse, CHAT_QUICK_ACTIONS } from '@/lib/ai-suggestions';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userProfile, chatMessages, addChatMessage, matches } = useUserStore();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userProfile) return;
    setInput('');

    // Add user message
    addChatMessage({
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    });

    setIsTyping(true);
    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    setIsTyping(false);

    const response = generateChatResponse(content, userProfile, matches.length);
    addChatMessage(response);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const displayMessages = chatMessages.slice(-20);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl shadow-violet-500/30 flex items-center justify-center glow-purple"
          >
            <Sparkles className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[520px] rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-gradient-to-r from-violet-500/10 to-purple-500/5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">BXI AI Advisor</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-[10px] text-muted-foreground">Powered by Gemini · Always on</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsOpen(false)}
                className="rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {displayMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">BXI AI Advisor</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ask me anything about barter opportunities, matches, or how to maximize your BXI profile.
                    </p>
                  </div>
                </div>
              )}

              {displayMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : '')}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="w-6 h-6 flex-shrink-0 mt-0.5">
                      <AvatarFallback className="text-[8px] bg-gradient-to-br from-violet-500 to-purple-600 text-white">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    'max-w-[78%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <Avatar className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <AvatarFallback className="text-[8px] bg-gradient-to-br from-violet-500 to-purple-600 text-white">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {displayMessages.length < 2 && (
              <div className="px-3 pb-2">
                <p className="text-[10px] text-muted-foreground mb-1.5">Quick questions:</p>
                <div className="flex flex-wrap gap-1">
                  {CHAT_QUICK_ACTIONS.slice(0, 3).map((action) => (
                    <button
                      key={action}
                      onClick={() => sendMessage(action)}
                      className="text-[10px] px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors border border-border"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-3 pb-3 pt-1 border-t border-border">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about barter opportunities..."
                className="flex-1 h-8 text-xs bg-muted/50"
              />
              <Button
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
