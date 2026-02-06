'use client';

import { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { mockMessages } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Anchor, ArrowDown } from 'lucide-react';
import type { Message } from '@/lib/types';

const suggestedPrompts = [
  'Find me a yacht for 20 people',
  'Best boats in Miami',
  'Plan a bachelor party',
  'Catalina Wine Mixer packages',
];

const cannedResponses = [
  "Absolutely, captain! I've found 3 premium vessels that match your criteria. The Prestige (85ft yacht, $750/hr) is our top pick - it has a hot tub, DJ booth, and enough room for a legendary party. Want me to check availability?",
  "Great choice! Miami has some of the hottest boats on our platform. I'd recommend The Rum Runner - a 55ft catamaran with a tiki bar and trampolines. It's basically a floating paradise. Shall I book a tour?",
  "Oh, you're speaking my language! For a bachelor party, nothing beats the Party Pontoon in Key West - triple-decker with a waterslide, diving board, and LED party lights. Your buddy will never forget it. Want pricing details?",
  "The f***ing Catalina Wine Mixer! We have the Catalina Dreamer - a 45ft sailboat with a WINE CELLAR below deck. It was literally made for this. I can set up a full wine tasting package. Interested?",
  "I've got options ranging from $275/hr pontoons to $750/hr mega-yachts. Every vessel in our fleet is Prestige Worldwide certified. What's your vibe - chill sunset cruise or full-send party boat?",
  "Boats N' Hoes isn't just a lifestyle, it's a MOVEMENT. And I'm here to make sure your next boat day is absolutely legendary. Tell me more about what you're looking for!",
];

export default function ConciergePage() {
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 flex-shrink-0"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
              <Bot className="w-7 h-7 text-gold" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-3xl md:text-4xl text-gold tracking-wider">
                YOUR PERSONAL BOAT BUTLER
              </h1>
              <p className="font-body text-sm text-electric-blue/70 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Powered by Prestige Worldwide AI
              </p>
            </div>
          </div>
        </motion.div>

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
                        PRESTIGE AI
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
                      PRESTIGE AI
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
                placeholder="Ask your boat butler anything..."
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
          </div>
        </motion.form>
      </div>
    </div>
  );
}
