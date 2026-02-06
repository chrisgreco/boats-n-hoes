'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff, Volume2, Waves, Anchor } from 'lucide-react';

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || 'agent_0501kgsnecr8ecgv46te0m5wr2dm';

export default function VoiceChat() {
  const [transcript, setTranscript] = useState<Array<{ role: 'user' | 'agent'; text: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      setError(null);
    },
    onDisconnect: () => {
      // Disconnected
    },
    onMessage: (message) => {
      if (typeof message === 'object' && message !== null) {
        const msg = message as { message?: string; role?: string; source?: string };
        if (msg.message) {
          const role = msg.source === 'user' || msg.role === 'user' ? 'user' : 'agent';
          setTranscript(prev => [...prev, { role, text: msg.message! }]);
        }
      }
    },
    onError: (err) => {
      console.error('Voice chat error:', err);
      setError('Connection error. Please try again.');
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      setTranscript([]);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'webrtc',
      });
    } catch (err) {
      console.error('Failed to start voice chat:', err);
      setError('Could not access microphone. Please allow microphone access and try again.');
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === 'connected';
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="flex flex-col h-full">
      {/* Voice Status & Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
        {/* Background waves when connected */}
        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 overflow-hidden"
            >
              {/* Animated sound wave rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isSpeaking ? [1, 1.5, 1] : [0.95, 1.05, 0.95],
                    opacity: isSpeaking ? [0.3, 0, 0.3] : [0.1, 0.05, 0.1],
                  }}
                  transition={{
                    duration: isSpeaking ? 1.5 : 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <div
                    className="rounded-full border-2"
                    style={{
                      width: `${150 + i * 60}px`,
                      height: `${150 + i * 60}px`,
                      borderColor: isSpeaking ? '#D4AF37' : '#00D4FF',
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center orb */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{
            scale: isConnected ? (isSpeaking ? [1, 1.1, 1] : 1) : 1,
          }}
          transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
        >
          {/* Main circle */}
          <motion.div
            className={`w-32 h-32 rounded-full flex items-center justify-center brutal-border ${
              isConnected
                ? isSpeaking
                  ? 'bg-gold'
                  : 'bg-electric-blue'
                : 'bg-navy'
            }`}
            style={{
              boxShadow: isConnected
                ? isSpeaking
                  ? '0 0 40px rgba(212, 175, 55, 0.5), 6px 6px 0px #0A1628'
                  : '0 0 40px rgba(0, 212, 255, 0.3), 6px 6px 0px #0A1628'
                : '6px 6px 0px #0A1628',
            }}
            whileHover={!isConnected ? { scale: 1.05 } : {}}
          >
            {isConnected ? (
              isSpeaking ? (
                <Volume2 className="w-12 h-12 text-navy" />
              ) : (
                <Mic className="w-12 h-12 text-navy" />
              )
            ) : (
              <Anchor className="w-12 h-12 text-gold" />
            )}
          </motion.div>

          {/* Status text */}
          <motion.p
            className="mt-4 font-display text-xl tracking-wider"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isConnected
              ? isSpeaking
                ? 'CAPTAIN PRESTIGE IS SPEAKING...'
                : 'LISTENING...'
              : conversation.status === 'connecting'
              ? 'CONNECTING...'
              : 'TAP TO CALL CAPTAIN PRESTIGE'}
          </motion.p>

          {/* Audio bars visualization */}
          {isConnected && (
            <div className="flex items-end gap-1 mt-3 h-8">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 rounded-full ${isSpeaking ? 'bg-gold' : 'bg-electric-blue/50'}`}
                  animate={{
                    height: isSpeaking
                      ? [8, Math.random() * 28 + 4, 8]
                      : [4, Math.random() * 8 + 4, 4],
                  }}
                  transition={{
                    duration: isSpeaking ? 0.3 + Math.random() * 0.3 : 1 + Math.random(),
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Transcript area */}
      {transcript.length > 0 && (
        <div
          ref={scrollRef}
          className="mx-4 mb-4 max-h-[200px] overflow-y-auto rounded-lg glass-dark p-3 space-y-2"
        >
          {transcript.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-1.5 rounded-lg text-sm font-body ${
                  msg.role === 'user'
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'bg-cream/10 text-cream/90 border border-cream/20'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 p-3 bg-hot-pink/20 border border-hot-pink/40 rounded-lg text-hot-pink text-sm font-body text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Call controls */}
      <div className="flex items-center justify-center gap-6 p-6 border-t-[3px] border-navy/20">
        {!isConnected ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startConversation}
            disabled={conversation.status === 'connecting'}
            className="w-20 h-20 rounded-full bg-lime brutal-border brutal-shadow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone className="w-8 h-8 text-navy" />
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={stopConversation}
              className="w-20 h-20 rounded-full bg-hot-pink brutal-border brutal-shadow flex items-center justify-center"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </motion.button>
          </>
        )}
      </div>

      {/* Voice mode label */}
      <div className="text-center pb-4">
        <p className="font-display text-xs tracking-[0.3em] text-navy/40">
          POWERED BY ELEVENLABS + PRESTIGE WORLDWIDE AI
        </p>
      </div>
    </div>
  );
}
