'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

// Source display helpers
const sourceNameMap: Record<string, string> = {
  boatsetter: 'Boatsetter',
  getmyboat: 'GetMyBoat',
  click_and_boat: 'Click&Boat',
  sailo: 'Sailo',
};

// Generate a smart AI response based on query + conversation history
function generateAIResponse(query: string, prevMessages: Message[]): { text: string; listings: AggregatedListing[] } {
  const q = query.toLowerCase();

  // Check for booking / link intents — look at last AI message for context
  const lastAiMsg = [...prevMessages].reverse().find(m => m.is_ai);
  const isBookingIntent = /\b(book|reserve|rent|charter|hire|get it|sign me up|let'?s do it|let'?s go|i'?m in|i want it|yes|yeah|yep|sure|sounds good|perfect)\b/i.test(q);
  const isLinkIntent = /\b(link|url|website|take me|go to|open|visit|where|how do i book|how to book)\b/i.test(q);
  const isCompareIntent = /\b(compare|vs|versus|difference|better|cheaper|which one|alternatives)\b/i.test(q);
  const isPriceIntent = /\b(price|cost|how much|budget|cheap|affordable|expensive|under \$|per hour|per day)\b/i.test(q);

  // If user wants to book or get a link, find the last mentioned listings
  if ((isBookingIntent || isLinkIntent) && lastAiMsg) {
    // Find listings that were mentioned in the last AI message
    const mentionedListings = mockAggregatedListings.filter(l =>
      lastAiMsg.content.toLowerCase().includes(l.name.toLowerCase())
    );
    if (mentionedListings.length > 0) {
      const listing = mentionedListings[0];
      const source = sourceNameMap[listing.source] || listing.source;
      return {
        text: `Here you go, captain! Click the link below to book the ${listing.name} on ${source}. They have a ${listing.owner_response_time.toLowerCase()} response time and a ${listing.cancellation_policy} cancellation policy. Tell 'em Captain Prestige sent you! 🚢`,
        listings: mentionedListings.slice(0, 1),
      };
    }
    return {
      text: "I'd love to get you booked! Which boat caught your eye? Give me a location, group size, or budget and I'll pull up the best options with direct booking links.",
      listings: [],
    };
  }

  // Search for matching listings
  const matchedListings = findListings(query);

  // If compare intent, try to find 2+ listings to compare
  if (isCompareIntent && matchedListings.length >= 2) {
    const a = matchedListings[0];
    const b = matchedListings[1];
    const aSource = sourceNameMap[a.source] || a.source;
    const bSource = sourceNameMap[b.source] || b.source;
    return {
      text: `Great question! Let me break it down:\n\n${a.name} on ${aSource} — $${a.price_per_hour}/hr, ${a.capacity} guests, ${a.rating}★ (${a.review_count} reviews). ${a.captain_included ? 'Captain included!' : 'BYOC.'}\n\n${b.name} on ${bSource} — $${b.price_per_hour}/hr, ${b.capacity} guests, ${b.rating}★ (${b.review_count} reviews). ${b.captain_included ? 'Captain included!' : 'BYOC.'}\n\nBoth are solid picks. Want me to pull up the booking links?`,
      listings: matchedListings.slice(0, 2),
    };
  }

  // If we found listings, return them with context
  if (matchedListings.length > 0) {
    const top = matchedListings[0];
    const source = sourceNameMap[top.source] || top.source;
    const captain = top.captain_included ? 'Captain included!' : 'Bring your own captain (BYOC).';
    const instant = top.instant_book ? ' Instant bookable!' : '';
    const price = top.price_per_hour ? `$${top.price_per_hour}/hr` : `$${top.price_per_day}/day`;

    let intro = `I just searched across Boatsetter, GetMyBoat, Click&Boat, and Sailo for you!`;
    if (matchedListings.length === 1) {
      return {
        text: `${intro}\n\nFound the ${top.name} — a ${top.length_ft}ft ${top.type.replace('_', ' ')} on ${source} at ${price} in ${top.location}. ${top.rating}★ with ${top.review_count} reviews. ${captain}${instant}\n\nTop amenities: ${top.amenities.slice(0, 4).join(', ')}.\n\nClick below to view and book, or tell me to find more options!`,
        listings: matchedListings,
      };
    }

    const others = matchedListings.slice(1).map(l => {
      const lSource = sourceNameMap[l.source] || l.source;
      const lPrice = l.price_per_hour ? `$${l.price_per_hour}/hr` : `$${l.price_per_day}/day`;
      return `${l.name} on ${lSource} (${lPrice}, ${l.capacity} guests, ${l.rating}★)`;
    }).join('\n• ');

    return {
      text: `${intro}\n\nTop pick: ${top.name} — ${top.length_ft}ft ${top.type.replace('_', ' ')} on ${source} at ${price} in ${top.location}. ${top.rating}★ (${top.review_count} reviews). ${captain}${instant}\n\nAlso found:\n• ${others}\n\nClick any listing below to book, or ask me to compare!`,
      listings: matchedListings,
    };
  }

  // Price-specific queries with no listing match
  if (isPriceIntent) {
    const cheapest = [...mockAggregatedListings].sort((a, b) => (a.price_per_hour ?? 9999) - (b.price_per_hour ?? 9999)).slice(0, 3);
    return {
      text: `Looking for the best deals? Here's what I found across all 4 platforms:\n\nPrices range from $${cheapest[0].price_per_hour}/hr (${cheapest[0].name}) to $2,500/hr for mega-yachts. Here are the most affordable options:`,
      listings: cheapest,
    };
  }

  // Generic / greeting queries
  if (/\b(hi|hello|hey|sup|yo|what'?s up|howdy)\b/i.test(q)) {
    return {
      text: "Ahoy, captain! I'm Captain Prestige, your personal boat concierge. I search across Boatsetter, GetMyBoat, Click&Boat, and Sailo to find you the perfect vessel. Tell me your location, group size, budget, or vibe and I'll find your dream boat!",
      listings: [],
    };
  }

  // Catalina Wine Mixer easter egg
  if (/catalina/i.test(q)) {
    const catalina = mockAggregatedListings.find(l => l.name.includes('Pacific Dream'));
    return {
      text: `The f***ing Catalina Wine Mixer! I found the PERFECT vessel for this legendary event. The Pacific Dream is a 55ft Luxury Catamaran on Click&Boat with a WINE CELLAR, trampolines, full bar, and it sails right to Catalina. 4.9 stars. It was literally made for this. POW!`,
      listings: catalina ? [catalina] : [],
    };
  }

  // Fallback — nothing matched, ask for more details
  return {
    text: "I searched all 4 platforms but need a bit more to narrow it down. Try telling me:\n\n• A location (Miami, Key West, Lake Tahoe...)\n• Boat type (yacht, pontoon, catamaran, fishing...)\n• Group size or budget\n• Or your vibe (party, chill, fishing, watersports)\n\nThe more details, the better I can match you!",
    listings: [],
  };
}

type Mode = 'text' | 'voice';

// Extended message type with optional listing attachments
interface ChatMessage extends Message {
  listings?: AggregatedListing[];
}

function ConciergeContent() {
  const [mode, setMode] = useState<Mode>('text');
  const [messages, setMessages] = useState<ChatMessage[]>([...mockMessages]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const hasSentInitialQuery = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
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

    // Use smart AI response generation
    setTimeout(() => {
      setMessages((prev) => {
        const { text, listings } = generateAIResponse(content, prev);
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          conversation_id: '2',
          sender_id: 'ai',
          content: text,
          is_ai: true,
          created_at: new Date().toISOString(),
          listings: listings.length > 0 ? listings : undefined,
        };
        return [...prev, aiMessage];
      });
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  // Auto-send query from URL params (from /boats AI search bar)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !hasSentInitialQuery.current) {
      hasSentInitialQuery.current = true;
      setTimeout(() => sendMessage(q), 500);
    }
  }, [searchParams]);

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
                        <div className="flex gap-3 max-w-[90%] md:max-w-[80%]">
                          <div className="flex-shrink-0 w-9 h-9 rounded-full glass-dark border border-gold/30 flex items-center justify-center mt-1">
                            <Bot className="w-5 h-5 text-gold" />
                          </div>
                          <div className="space-y-2">
                            <span className="font-display text-xs text-gold/60 tracking-widest mb-1 block">
                              CAPTAIN PRESTIGE
                            </span>
                            <div className="glass-dark rounded-2xl rounded-tl-sm px-4 py-3 brutal-border brutal-shadow-sm">
                              <p className="font-body text-sm text-cream/90 leading-relaxed whitespace-pre-line">
                                {message.content}
                              </p>
                            </div>
                            {/* Listing cards attached to AI messages */}
                            {(message as ChatMessage).listings && (message as ChatMessage).listings!.map((listing) => {
                              const srcColor: Record<string, string> = { boatsetter: '#4A90D9', getmyboat: '#2ECC71', click_and_boat: '#E67E22', sailo: '#9B59B6' };
                              const srcName = sourceNameMap[listing.source] || listing.source;
                              return (
                                <a
                                  key={listing.id}
                                  href={listing.external_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block group"
                                >
                                  <motion.div
                                    whileHover={{ y: -2, x: 2 }}
                                    className="flex items-center gap-3 p-3 bg-ocean/40 border-2 border-cream/10 rounded-lg hover:border-gold/50 transition-all cursor-pointer"
                                  >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-cream/20 flex-shrink-0 relative">
                                      <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="px-1.5 py-0.5 text-[9px] font-display tracking-wider text-white rounded" style={{ backgroundColor: srcColor[listing.source] || '#999' }}>
                                          {srcName.toUpperCase()}
                                        </span>
                                        <span className="font-body text-[10px] text-gold">
                                          {listing.rating}★ ({listing.review_count})
                                        </span>
                                      </div>
                                      <h4 className="font-display text-sm text-cream tracking-wider truncate">
                                        {listing.name}
                                      </h4>
                                      <div className="flex items-center gap-3 mt-0.5">
                                        <span className="font-display text-gold text-sm">
                                          {listing.price_per_hour ? `$${listing.price_per_hour}/hr` : `$${listing.price_per_day}/day`}
                                        </span>
                                        <span className="font-body text-[10px] text-cream/40">
                                          {listing.capacity} guests · {listing.length_ft}ft
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                                      <ExternalLink className="w-4 h-4 text-cream/30 group-hover:text-gold transition-colors" />
                                      <span className="font-display text-[8px] text-cream/30 tracking-wider group-hover:text-gold transition-colors">BOOK</span>
                                    </div>
                                  </motion.div>
                                </a>
                              );
                            })}
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

export default function ConciergePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <ConciergeContent />
    </Suspense>
  );
}
