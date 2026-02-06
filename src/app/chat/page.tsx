'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { mockConversations, mockMessages, mockUsers } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, MessageCircle, Search, Anchor, ChevronLeft } from 'lucide-react';
import type { Message, Conversation } from '@/lib/types';

const additionalMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'c1-m1',
      conversation_id: '1',
      sender_id: '1',
      content: "Hey Alice! The Prestige is looking gorgeous this week. What day works best for you?",
      is_ai: false,
      created_at: '2024-04-10T14:00:00Z',
    },
    {
      id: 'c1-m2',
      conversation_id: '1',
      sender_id: '4',
      content: "Saturday would be perfect! We're celebrating my friend's birthday.",
      is_ai: false,
      created_at: '2024-04-10T14:15:00Z',
    },
    {
      id: 'c1-m3',
      conversation_id: '1',
      sender_id: '1',
      content: "Love it! I'll make sure the karaoke machine is stocked with the best hits. Should I prep the hot tub too?",
      is_ai: false,
      created_at: '2024-04-10T14:20:00Z',
    },
    {
      id: 'c1-m4',
      conversation_id: '1',
      sender_id: '4',
      content: 'Is The Prestige available this Saturday? I\'ve got a group of 12!',
      is_ai: false,
      created_at: '2024-04-10T14:30:00Z',
    },
  ],
  '2': mockMessages,
};

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const conversations = mockConversations;

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const participantNames = conv.participants?.map((p) => p.full_name.toLowerCase()) || [];
    const lastMsg = conv.last_message?.content.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return (
      participantNames.some((n) => n.includes(query)) ||
      lastMsg.includes(query) ||
      (conv.is_concierge && 'concierge ai bot'.includes(query))
    );
  });

  const getConversationMessages = (convId: string): Message[] => {
    return additionalMessages[convId] || [];
  };

  const getParticipantName = (conv: Conversation) => {
    if (conv.is_concierge) return 'AI Boat Concierge';
    const other = conv.participants?.find((p) => p.id !== '1');
    return other?.full_name || 'Unknown';
  };

  const getParticipantAvatar = (conv: Conversation) => {
    if (conv.is_concierge) return null;
    const other = conv.participants?.find((p) => p.id !== '1');
    return other?.avatar_url || null;
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation) return;
    setInputValue('');
  };

  const selectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setMobileShowChat(true);
  };

  return (
    <div className="min-h-screen bg-navy">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4" style={{ height: 'calc(100vh - 88px)' }}>
        <div className="flex h-full gap-4 py-4">
          {/* Left Sidebar - Conversation List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full md:w-[380px] flex-shrink-0 flex flex-col brutal-border bg-ocean/30 ${
              mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b-[3px] border-navy">
              <h2 className="font-display text-2xl text-gold tracking-wider flex items-center gap-2 mb-3">
                <MessageCircle className="w-6 h-6" />
                MESSAGES
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 bg-cream text-navy font-body text-sm placeholder:text-navy/40 brutal-border focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id;
                const isUnread = conv.id === '1';

                return (
                  <motion.button
                    key={conv.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectConversation(conv)}
                    className={`w-full p-4 flex gap-3 items-start text-left transition-all border-b-[2px] border-navy/30 cursor-pointer ${
                      isActive
                        ? 'bg-gold/20 border-l-4 border-l-gold'
                        : 'hover:bg-ocean/40 border-l-4 border-l-transparent'
                    } ${conv.is_concierge ? 'border-l-gold/60' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.is_concierge ? (
                        <div className="w-12 h-12 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                          <Bot className="w-6 h-6 text-gold" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full brutal-border overflow-hidden bg-cream">
                          {getParticipantAvatar(conv) ? (
                            <img
                              src={getParticipantAvatar(conv)!}
                              alt={getParticipantName(conv)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-navy font-display text-lg">
                              {getParticipantName(conv).charAt(0)}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Unread indicator */}
                      {isUnread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-hot-pink rounded-full border-2 border-navy animate-pulse" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-display text-sm tracking-wider truncate ${
                            conv.is_concierge ? 'text-gold' : 'text-cream'
                          }`}
                        >
                          {getParticipantName(conv)}
                        </span>
                        <span className="font-body text-[10px] text-cream/40 flex-shrink-0">
                          {conv.last_message ? formatTimestamp(conv.last_message.created_at) : ''}
                        </span>
                      </div>
                      <p
                        className={`font-body text-xs mt-1 truncate ${
                          isUnread ? 'text-cream/80 font-semibold' : 'text-cream/50'
                        }`}
                      >
                        {conv.last_message?.is_ai && (
                          <span className="text-gold/60 mr-1">[AI]</span>
                        )}
                        {conv.last_message?.content || 'No messages yet'}
                      </p>
                      {conv.is_concierge && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-gold/20 text-gold font-body text-[10px] font-semibold tracking-wide rounded-sm brutal-border border-gold/30">
                          AI CONCIERGE
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="p-8 text-center">
                  <Anchor className="w-10 h-10 text-cream/20 mx-auto mb-3" />
                  <p className="font-body text-sm text-cream/40">No conversations found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side - Active Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex-1 flex flex-col brutal-border bg-ocean/20 ${
              !mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div
                  className={`p-4 border-b-[3px] border-navy flex items-center gap-3 ${
                    activeConversation.is_concierge ? 'bg-gold/10' : 'bg-ocean/30'
                  }`}
                >
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden text-cream/60 hover:text-cream mr-1"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  {activeConversation.is_concierge ? (
                    <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                      <Bot className="w-5 h-5 text-gold" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full brutal-border overflow-hidden bg-cream">
                      {getParticipantAvatar(activeConversation) ? (
                        <img
                          src={getParticipantAvatar(activeConversation)!}
                          alt={getParticipantName(activeConversation)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-navy font-display text-lg">
                          {getParticipantName(activeConversation).charAt(0)}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <h3
                      className={`font-display text-lg tracking-wider ${
                        activeConversation.is_concierge ? 'text-gold' : 'text-cream'
                      }`}
                    >
                      {getParticipantName(activeConversation)}
                    </h3>
                    <p className="font-body text-[10px] text-cream/40">
                      {activeConversation.is_concierge
                        ? 'Always online - Powered by Prestige Worldwide AI'
                        : 'Last active 2h ago'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {getConversationMessages(activeConversation.id).map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.sender_id === '1' || message.is_ai ? '' : ''
                        } ${
                          message.is_ai
                            ? 'justify-start'
                            : message.sender_id === '1'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        {(message.is_ai || (message.sender_id !== '1' && !message.is_ai)) && (
                          <div className="flex gap-2.5 max-w-[80%]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                              {message.is_ai ? (
                                <div className="w-full h-full rounded-full glass-dark border border-gold/30 flex items-center justify-center">
                                  <Bot className="w-4 h-4 text-gold" />
                                </div>
                              ) : (
                                <div className="w-full h-full rounded-full brutal-border overflow-hidden bg-cream">
                                  {(() => {
                                    const sender = mockUsers.find(
                                      (u) => u.id === message.sender_id
                                    );
                                    return sender?.avatar_url ? (
                                      <img
                                        src={sender.avatar_url}
                                        alt={sender.full_name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-navy font-display text-xs">
                                        {sender?.full_name?.charAt(0) || '?'}
                                      </span>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                            <div>
                              {message.is_ai && (
                                <span className="font-display text-[10px] text-gold/50 tracking-widest block mb-1">
                                  PRESTIGE AI
                                </span>
                              )}
                              <div className="glass-dark rounded-2xl rounded-tl-sm px-4 py-2.5 brutal-border brutal-shadow-sm">
                                <p className="font-body text-sm text-cream/90 leading-relaxed">
                                  {message.content}
                                </p>
                              </div>
                              <span className="font-body text-[10px] text-cream/30 mt-1 block">
                                {formatTimestamp(message.created_at)}
                              </span>
                            </div>
                          </div>
                        )}

                        {message.sender_id === '1' && !message.is_ai && (
                          <div className="max-w-[80%]">
                            <div className="bg-gold rounded-2xl rounded-tr-sm px-4 py-2.5 brutal-border brutal-shadow-sm">
                              <p className="font-body text-sm text-navy font-medium leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                            <span className="font-body text-[10px] text-cream/30 mt-1 block text-right">
                              {formatTimestamp(message.created_at)}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t-[3px] border-navy bg-ocean/30"
                >
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        activeConversation.is_concierge
                          ? 'Ask the concierge...'
                          : 'Type a message...'
                      }
                      className="flex-1 px-4 py-3 bg-cream text-navy font-body text-sm placeholder:text-navy/40 brutal-border focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="w-12 h-12 bg-gold text-navy flex items-center justify-center brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </form>
              </>
            ) : (
              /* No conversation selected state */
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-dark border-2 border-gold/20 flex items-center justify-center">
                    <MessageCircle className="w-12 h-12 text-gold/30" />
                  </div>
                  <h3 className="font-display text-3xl text-cream/30 tracking-wider mb-2">
                    SELECT A CONVERSATION
                  </h3>
                  <p className="font-body text-sm text-cream/20 max-w-xs">
                    Choose a conversation from the list to start chatting. Connect with boat owners,
                    renters, or the AI Concierge.
                  </p>
                  <div className="mt-6 flex items-center gap-2 justify-center">
                    <Anchor className="w-4 h-4 text-gold/20" />
                    <span className="font-script text-sm text-gold/20">
                      A Prestige Worldwide Experience
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
