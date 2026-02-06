'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Phone, PhoneOff, Volume2 } from 'lucide-react';

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
  const isConnecting = conversation.status === 'connecting';
  const isSpeaking = conversation.isSpeaking;

  const handleOrbClick = () => {
    if (isConnected) {
      stopConversation();
    } else if (!isConnecting) {
      startConversation();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Voice Status & Visualizer - THE ORB IS THE BUTTON */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Background wave rings when connected */}
        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 overflow-hidden pointer-events-none"
            >
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
                      width: `${120 + i * 50}px`,
                      height: `${120 + i * 50}px`,
                      borderColor: isSpeaking ? '#D4AF37' : '#00D4FF',
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* THE ORB - This IS the call/hangup button */}
        <motion.button
          onClick={handleOrbClick}
          disabled={isConnecting}
          className="relative z-10 flex flex-col items-center cursor-pointer disabled:cursor-wait focus:outline-none"
          whileHover={{ scale: isConnecting ? 1 : 1.05 }}
          whileTap={{ scale: isConnecting ? 1 : 0.95 }}
          animate={{
            scale: isConnected ? (isSpeaking ? [1, 1.08, 1] : 1) : 1,
          }}
          transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
        >
          {/* Main circle */}
          <motion.div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-[3px] border-navy transition-colors duration-300 ${
              isConnected
                ? isSpeaking
                  ? 'bg-gold'
                  : 'bg-electric-blue'
                : isConnecting
                ? 'bg-sunset'
                : 'bg-lime'
            }`}
            style={{
              boxShadow: isConnected
                ? isSpeaking
                  ? '0 0 40px rgba(212, 175, 55, 0.5), 6px 6px 0px #0A1628'
                  : '0 0 40px rgba(0, 212, 255, 0.3), 6px 6px 0px #0A1628'
                : '6px 6px 0px #0A1628',
            }}
          >
            {isConnected ? (
              isSpeaking ? (
                <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 text-navy" />
              ) : (
                <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-navy" />
              )
            ) : isConnecting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Phone className="w-10 h-10 sm:w-12 sm:h-12 text-navy" />
              </motion.div>
            ) : (
              <Phone className="w-10 h-10 sm:w-12 sm:h-12 text-navy" />
            )}
          </motion.div>

          {/* Status text */}
          <motion.p
            className="mt-3 font-display text-lg sm:text-xl tracking-wider text-cream select-none"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isConnected
              ? isSpeaking
                ? 'CAPTAIN PRESTIGE IS SPEAKING...'
                : 'LISTENING... TAP TO HANG UP'
              : isConnecting
              ? 'CONNECTING...'
              : 'TAP TO CALL CAPTAIN PRESTIGE'}
          </motion.p>

          {/* Audio bars visualization */}
          {isConnected && (
            <div className="flex items-end gap-1 mt-2 h-6">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 rounded-full ${isSpeaking ? 'bg-gold' : 'bg-electric-blue/50'}`}
                  animate={{
                    height: isSpeaking
                      ? [6, Math.random() * 22 + 4, 6]
                      : [3, Math.random() * 6 + 3, 3],
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
        </motion.button>

        {/* Hang up hint when connected */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 z-10"
          >
            <motion.button
              onClick={stopConversation}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-5 py-2 bg-hot-pink text-white font-display text-sm tracking-wider border-[3px] border-navy cursor-pointer"
              style={{ boxShadow: '4px 4px 0px #0A1628' }}
            >
              <PhoneOff className="w-4 h-4" />
              END CALL
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Transcript area */}
      {transcript.length > 0 && (
        <div
          ref={scrollRef}
          className="mx-4 mb-2 max-h-[150px] overflow-y-auto rounded-lg glass-dark p-3 space-y-2"
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
          className="mx-4 mb-2 p-3 bg-hot-pink/20 border border-hot-pink/40 rounded-lg text-hot-pink text-sm font-body text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Footer label */}
      <div className="text-center py-2 flex-shrink-0">
        <p className="font-display text-[10px] tracking-[0.25em] text-cream/30">
          POWERED BY ELEVENLABS + PRESTIGE WORLDWIDE AI
        </p>
      </div>
    </div>
  );
}
