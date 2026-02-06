'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import { mockMessages } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Anchor, Mic, MessageSquare, Phone, Volume2, Waves, Globe, ExternalLink, Search } from 'lucide-react';
import type { Message, AggregatedListing } from '@/lib/types';
import { mockAggregatedListings } from '@/lib/mock-data';

// Dynamic import VoiceChat to avoid SSR issues with microphone APIs
const VoiceChat = dynamic(() => import('@/components/VoiceChat'), { ssr: false });

const suggestedPrompts = [
  'Find me a yacht for 20 in Miami under $800/hr',
  'Best fishing charters in Key West',
  'Cheapest pontoon near Lake Tahoe',
  'Catalina Wine Mixer catamaran',
  'Compare Boatsetter vs GetMyBoat prices',
  'Party boat with DJ booth for bachelor party',
];

// Helper to find relevant listings for AI responses
function findListings(query: string): AggregatedListing[] {
  const q = query.toLowerCase();
  return mockAggregatedListings.filter(l => {
    const text = `${l.name} ${l.type} ${l.location} ${l.description} ${l.amenities.join(' ')}`.toLowerCase();
    return q.split(' ').some(word => word.length > 3 && text.includes(word));
  }).slice(0, 3);
}

function formatListingResponse(listings: AggregatedListing[]): string {
  if (listings.length === 0) return '';
  const cards = listings.map(l => {
    const price = l.price_per_hour ? `$${l.price_per_hour}/hr` : `$${l.price_per_day}/day`;
    const captain = l.captain_included ? 'Captain included' : 'BYOC';
    return `${l.name} (${l.length_ft}ft ${l.type}, ${price}, ${l.location}) via ${l.source === 'getmyboat' ? 'GetMyBoat' : l.source === 'boatsetter' ? 'Boatsetter' : l.source === 'click_and_boat' ? 'Click&Boat' : 'Sailo'} - ${l.rating}★ (${l.review_count} reviews) - ${captain}`;
  });
  return '\n\nHere\'s what I found across our partner platforms:\n• ' + cards.join('\n• ');
}

const cannedResponses = [
  "I just searched across Boatsetter, GetMyBoat, Click&Boat, and Sailo for you! Found the Sea Breeze - an 80ft luxury motor yacht on Boatsetter at $850/hr in Marina Del Rey with a jacuzzi, full kitchen, and jet skis. Captain included! Want me to compare more options?",
  "Great choice, captain! I'm pulling listings from all our partner platforms. The Island Time 50ft Party Catamaran on GetMyBoat in Miami ($650/hr) has a tiki bar, trampolines, and LED lighting - plus it's instant bookable! The Rum Runner is another solid option at $550/hr.",
  "Oh, you're speaking my language! I searched 4 platforms and found the Reel Deal 36ft Center Console on Boatsetter in Key West at $400/hr - tournament-ready with fighting chair, live wells, and captain + mate included. 4.9 stars with 201 reviews. That's the real deal!",
  "The f***ing Catalina Wine Mixer! I found the Pacific Dream 55ft Luxury Catamaran on Click&Boat at $700/hr - it has a WINE CELLAR, trampolines, full bar, and sails right to Catalina. 4.9 stars. It was literally made for this. Shall I get a quote?",
  "I've scanned 25,000+ boats across Boatsetter, GetMyBoat, Click&Boat, and Sailo. Prices range from $95/hr jet skis to $2,500/hr mega-yachts. What's your vibe - chill sunset sail, fishing charter, or full-send party boat?",
  "Boats N' Hoes isn't just a platform, we're the SMARTEST boat search engine on the planet. I aggregate listings from every major platform so you get the best deal. Tell me your location, group size, and budget and I'll find your perfect vessel!",
];

type Mode = 'text' | 'voice';

export default function ConciergePage() {
  const [mode, setMode] = useState<Mode>('text');
  const [messages, setMessages] = useState<Message[]>([...mockMessages]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      conversation_id: '2',
      sender_id: '1',
      content: content.trim(),
      is_ai: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        conversation_id: '2',
        sender_id: 'ai',
        content: cannedResponses[Math.floor(Math.random() * cannedResponses.length)],
        is_ai: true,
        created_at: new Date().toISOString(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* Subtle wave pattern background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0 100 Q50 50 100 100 T200 100" fill="none" stroke="white" strokeWidth="2" />
              <path d="M0 150 Q50 100 100 150 T200 150" fill="none" stroke="white" strokeWidth="1.5" />
              <path d="M0 50 Q50 0 100 50 T200 50" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pb-4 flex flex-col" style={{ height: 'calc(100vh - 88px)' }}>
        {/* Header with Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4 flex-shrink-0"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
              <Bot className="w-7 h-7 text-gold" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-3xl md:text-4xl text-gold tracking-wider">
                CAPTAIN PRESTIGE
              </h1>
              <p className="font-body text-sm text-electric-blue/70 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Your Personal Boat Butler &bull; Prestige Worldwide AI
              </p>
            </div>
          </div>

          {/* Aggregator Badge */}
          <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-navy/50 border border-cream/10 rounded-full">
              <Globe className="w-3 h-3 text-electric-blue" />
              <span className="font-body text-[10px] text-cream/50 tracking-wider">SEARCHES ACROSS</span>
            </div>
            {[
              { name: 'Boatsetter', color: '#4A90D9' },
              { name: 'GetMyBoat', color: '#2ECC71' },
              { name: 'Click&Boat', color: '#E67E22' },
              { name: 'Sailo', color: '#9B59B6' },
            ].map(s => (
              <span key={s.name} className="font-body text-[10px] tracking-wider px-2 py-0.5 rounded-full border" style={{ color: s.color, borderColor: `${s.color}40` }}>
                {s.name}
              </span>
            ))}
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-5 py-2.5 font-display text-sm tracking-wider brutal-border transition-all ${
                mode === 'text'
                  ? 'bg-gold text-navy brutal-shadow-sm'
                  : 'bg-navy text-cream/60 hover:text-cream hover:bg-navy/80'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              TEXT CHAT
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('voice')}
              className={`flex items-center gap-2 px-5 py-2.5 font-display text-sm tracking-wider brutal-border transition-all ${
                mode === 'voice'
                  ? 'bg-electric-blue text-navy brutal-shadow-sm'
                  : 'bg-navy text-cream/60 hover:text-cream hover:bg-navy/80'
              }`}
            >
              <Mic className="w-4 h-4" />
              VOICE CALL
            </motion.button>
          </div>

          {/* Voice mode badge */}
          <AnimatePresence>
            {mode === 'voice' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mt-3"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-electric-blue/10 border border-electric-blue/30 rounded-full">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-electric-blue"
                  />
                  <span className="font-body text-xs text-electric-blue">
                    Real-time voice AI powered by ElevenLabs
                  </span>
                  <Volume2 className="w-3 h-3 text-electric-blue" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {mode === 'voice' ? (
            <motion.div
              key="voice"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 glass-dark rounded-2xl brutal-border overflow-hidden flex flex-col"
            >
              <VoiceChat />
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Messages Area */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-thin"
              >
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: index < mockMessages.length ? 0 : 0.1 }}
                      className={`flex ${message.is_ai ? 'justify-start' : 'justify-end'}`}
                    >
                      {message.is_ai ? (
                        <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
                          <div className="flex-shrink-0 w-9 h-9 rounded-full glass-dark border border-gold/30 flex items-center justify-center mt-1">
                            <Bot className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <span className="font-display text-xs text-gold/60 tracking-widest mb-1 block">
                              CAPTAIN PRESTIGE
                            </span>
                            <div className="glass-dark rounded-2xl rounded-tl-sm px-4 py-3 brutal-border brutal-shadow-sm">
                              <p className="font-body text-sm text-cream/90 leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-[85%] md:max-w-[75%]">
                          <div className="bg-gold rounded-2xl rounded-tr-sm px-4 py-3 brutal-border brutal-shadow-sm">
                            <p className="font-body text-sm text-navy font-medium leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-3 max-w-[75%]">
                        <div className="flex-shrink-0 w-9 h-9 rounded-full glass-dark border border-gold/30 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-gold animate-pulse" />
                        </div>
                        <div>
                          <span className="font-display text-xs text-gold/60 tracking-widest mb-1 block">
                            CAPTAIN PRESTIGE
                          </span>
                          <div className="glass-dark rounded-2xl rounded-tl-sm px-5 py-4 brutal-border">
                            <div className="flex gap-1.5">
                              <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                className="w-2.5 h-2.5 rounded-full bg-gold/70"
                              />
                              <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                                className="w-2.5 h-2.5 rounded-full bg-gold/70"
                              />
                              <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                                className="w-2.5 h-2.5 rounded-full bg-gold/70"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {messages.length <= mockMessages.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 justify-center py-3 flex-shrink-0"
                >
                  {suggestedPrompts.map((prompt) => (
                    <motion.button
                      key={prompt}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(prompt)}
                      className="px-4 py-2 bg-cream text-navy font-body text-xs font-semibold tracking-wide brutal-border brutal-shadow-sm hover:bg-gold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Chat Input */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
                className="flex-shrink-0 pt-2 pb-2"
              >
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask Captain Prestige anything..."
                      className="w-full px-5 py-3.5 bg-cream text-navy font-body text-sm placeholder:text-navy/40 brutal-border brutal-shadow-sm focus:outline-none focus:ring-2 focus:ring-gold focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                      disabled={isTyping}
                    />
                    <Anchor className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="w-14 h-14 bg-gold text-navy flex items-center justify-center brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                  {/* Quick switch to voice */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setMode('voice')}
                    className="w-14 h-14 bg-electric-blue text-navy flex items-center justify-center brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex-shrink-0 cursor-pointer"
                    title="Switch to voice mode"
                  >
                    <Phone className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
