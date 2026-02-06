'use client';

import { useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from 'framer-motion';
import {
  X,
  Heart,
  Anchor,
  MapPin,
  Ship,
  Sparkles,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { mockSwipeProfiles, mockUsers } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';

// ---------- constants ----------
const SWIPE_THRESHOLD = 120;
const SWIPE_EXIT = 600;

// ---------- sparkle / confetti helpers ----------
function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute text-gold"
      initial={{ opacity: 0, scale: 0, x, y }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 0.8, 0],
        y: y - randomBetween(80, 200),
        x: x + randomBetween(-60, 60),
        rotate: randomBetween(0, 360),
      }}
      transition={{ duration: 1.6, delay, ease: 'easeOut' }}
    >
      <Sparkles className="w-5 h-5" />
    </motion.div>
  );
}

function ConfettiPiece({ delay, index }: { delay: number; index: number }) {
  const colors = [
    'bg-gold',
    'bg-hot-pink',
    'bg-electric-blue',
    'bg-lime',
    'bg-sunset',
    'bg-cream',
  ];
  const startX = randomBetween(-180, 180);
  const endX = startX + randomBetween(-100, 100);
  const size = randomBetween(6, 14);

  return (
    <motion.div
      className={`absolute rounded-sm ${colors[index % colors.length]}`}
      style={{ width: size, height: size * randomBetween(0.3, 1) }}
      initial={{ opacity: 0, x: startX, y: -20, rotate: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: endX,
        y: randomBetween(200, 500),
        rotate: randomBetween(180, 720),
        scale: [0, 1, 1, 0.5],
      }}
      transition={{ duration: randomBetween(1.4, 2.4), delay, ease: 'easeOut' }}
    />
  );
}

// ---------- main page ----------
export default function DatingPage() {
  const {
    swipeProfiles,
    currentSwipeIndex,
    matches,
    swipeRight,
    swipeLeft,
  } = useAppStore();

  const [showMatch, setShowMatch] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Framer motion values for drag
  const motionX = useMotionValue(0);
  const rotate = useTransform(motionX, [-300, 0, 300], [-18, 0, 18]);
  const matchOpacity = useTransform(motionX, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(motionX, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const currentProfile = swipeProfiles[currentSwipeIndex];
  const outOfProfiles = currentSwipeIndex >= swipeProfiles.length;

  // -- resolve matched user objects for sidebar --
  const matchedUsers = matches
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean);

  // -- handle swipe completion --
  const handleSwipeComplete = useCallback(
    (direction: 'left' | 'right') => {
      if (isAnimating || outOfProfiles) return;
      setIsAnimating(true);
      setExitDirection(direction);

      // Determine if this is a "match" — every other right-swipe is a match for demo
      if (direction === 'right' && currentProfile) {
        const isMatch = matches.length % 2 === 0; // simple demo logic
        swipeRight(currentProfile.user.id);
        if (isMatch) {
          setTimeout(() => setShowMatch(true), 400);
        }
      } else {
        swipeLeft();
      }

      setTimeout(() => {
        setExitDirection(null);
        setIsAnimating(false);
        motionX.set(0);
      }, 400);
    },
    [isAnimating, outOfProfiles, currentProfile, matches.length, swipeRight, swipeLeft, motionX],
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      handleSwipeComplete('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      handleSwipeComplete('left');
    } else {
      motionX.set(0);
    }
  };

  // -- button handlers --
  const handleReject = () => handleSwipeComplete('left');
  const handleSuperLike = () => handleSwipeComplete('right');
  const handleLike = () => handleSwipeComplete('right');

  return (
    <div className="min-h-screen bg-navy">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-24 lg:flex lg:gap-8">
        {/* ===== LEFT / CENTER COLUMN ===== */}
        <div className="flex-1 flex flex-col items-center">
          {/* ---- Header ---- */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-gold tracking-wider leading-none gold-shimmer">
              FIND YOUR FIRST MATE
            </h1>
            <p className="font-script text-xl sm:text-2xl text-electric-blue mt-2">
              Swipe right on your next adventure
            </p>
          </motion.div>

          {/* ---- Swipe Card Stack ---- */}
          <div className="relative w-full max-w-[420px] h-[600px] mb-8">
            {outOfProfiles ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-cream brutal-border brutal-shadow rounded-lg"
              >
                <Ship className="w-20 h-20 text-navy/30 mb-4" />
                <p className="font-display text-3xl text-navy tracking-wider mb-2">
                  ALL CAUGHT UP!
                </p>
                <p className="font-body text-navy/60 text-center px-8">
                  You&apos;ve seen everyone in the harbor. Check back soon for new sailors!
                </p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {/* Render up to 2 stacked cards (next card behind current) */}
                {swipeProfiles
                  .slice(currentSwipeIndex, currentSwipeIndex + 2)
                  .reverse()
                  .map((profile, reversedIndex) => {
                    const isFront =
                      reversedIndex ===
                      Math.min(1, swipeProfiles.length - currentSwipeIndex - 1);
                    const cardIndex =
                      currentSwipeIndex + (isFront ? 0 : 1);

                    return (
                      <motion.div
                        key={`card-${profile.user.id}-${cardIndex}`}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                        style={
                          isFront
                            ? { x: motionX, rotate, zIndex: 2 }
                            : { scale: 0.95, y: 12, zIndex: 1 }
                        }
                        drag={isFront ? 'x' : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.9}
                        onDragEnd={isFront ? handleDragEnd : undefined}
                        animate={
                          isFront && exitDirection
                            ? {
                                x: exitDirection === 'right' ? SWIPE_EXIT : -SWIPE_EXIT,
                                opacity: 0,
                                rotate: exitDirection === 'right' ? 20 : -20,
                              }
                            : {}
                        }
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      >
                        {/* ---- Card ---- */}
                        <div className="relative w-full h-full bg-cream rounded-lg brutal-border brutal-shadow overflow-hidden select-none">
                          {/* Background Image */}
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${
                                profile.boat?.images?.[0] ?? profile.user.avatar_url
                              })`,
                            }}
                          />
                          {/* Dark gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

                          {/* ---- MATCH / NOPE overlays (only on front card) ---- */}
                          {isFront && (
                            <>
                              <motion.div
                                className="absolute top-8 right-6 z-10 border-4 border-lime rounded-lg px-6 py-2 -rotate-12"
                                style={{ opacity: matchOpacity }}
                              >
                                <span className="font-display text-5xl text-lime tracking-wider">
                                  MATCH
                                </span>
                              </motion.div>
                              <motion.div
                                className="absolute top-8 left-6 z-10 border-4 border-hot-pink rounded-lg px-6 py-2 rotate-12"
                                style={{ opacity: nopeOpacity }}
                              >
                                <span className="font-display text-5xl text-hot-pink tracking-wider">
                                  NOPE
                                </span>
                              </motion.div>
                            </>
                          )}

                          {/* ---- Glass info overlay ---- */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 glass">
                            {/* Name / Age / Location */}
                            <div className="flex items-end justify-between mb-2">
                              <div>
                                <h2 className="font-display text-4xl text-cream tracking-wider leading-none">
                                  {profile.user.full_name.split(' ')[0]}
                                  {profile.user.age && (
                                    <span className="text-2xl text-cream/70 ml-2">
                                      {profile.user.age}
                                    </span>
                                  )}
                                </h2>
                                {profile.user.location && (
                                  <div className="flex items-center gap-1 mt-1 text-cream/70 font-body text-sm">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {profile.user.location}
                                    <span className="ml-2 text-electric-blue">
                                      {profile.distance_miles} mi
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bio */}
                            {profile.user.bio && (
                              <p className="font-body text-sm text-cream/80 line-clamp-2 mb-3">
                                {profile.user.bio}
                              </p>
                            )}

                            {/* Boat badge */}
                            {profile.boat && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 border border-gold/50 rounded-full mb-3">
                                <Anchor className="w-3.5 h-3.5 text-gold" />
                                <span className="font-display text-sm text-gold tracking-wider">
                                  {profile.boat.name}
                                </span>
                                <span className="text-gold/60 font-body text-xs capitalize">
                                  &middot; {profile.boat.type}
                                </span>
                              </div>
                            )}

                            {/* Mutual interests */}
                            {profile.mutual_interests.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {profile.mutual_interests.map((interest) => (
                                  <span
                                    key={interest}
                                    className="px-2.5 py-0.5 bg-electric-blue/20 border border-electric-blue/40 rounded-full font-body text-xs text-electric-blue"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            )}
          </div>

          {/* ---- Action Buttons ---- */}
          {!outOfProfiles && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6"
            >
              {/* Reject */}
              <motion.button
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReject}
                disabled={isAnimating}
                className="w-16 h-16 rounded-full bg-cream brutal-border flex items-center justify-center transition-shadow"
                style={{ boxShadow: '4px 4px 0px var(--navy)' }}
              >
                <X className="w-8 h-8 text-navy" strokeWidth={3} />
              </motion.button>

              {/* Super Like */}
              <motion.button
                whileHover={{ scale: 1.15, y: -6 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSuperLike}
                disabled={isAnimating}
                className="w-20 h-20 rounded-full bg-electric-blue brutal-border flex items-center justify-center transition-shadow"
                style={{ boxShadow: '5px 5px 0px var(--navy)' }}
              >
                <Anchor className="w-10 h-10 text-navy" strokeWidth={2.5} />
              </motion.button>

              {/* Like */}
              <motion.button
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                disabled={isAnimating}
                className="w-16 h-16 rounded-full bg-hot-pink brutal-border flex items-center justify-center transition-shadow"
                style={{ boxShadow: '4px 4px 0px var(--navy)' }}
              >
                <Heart className="w-8 h-8 text-cream" strokeWidth={2.5} fill="currentColor" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* ===== RIGHT SIDEBAR — Match List (desktop) ===== */}
        <div className="hidden lg:block w-80 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="sticky top-28 glass-dark rounded-lg p-5"
          >
            <h3 className="font-display text-2xl text-gold tracking-wider mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-hot-pink" fill="currentColor" />
              YOUR MATCHES
            </h3>

            {matchedUsers.length === 0 ? (
              <div className="text-center py-10">
                <Anchor className="w-10 h-10 text-cream/20 mx-auto mb-3" />
                <p className="font-body text-sm text-cream/40">
                  No matches yet. Start swiping!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {matchedUsers.map((user) =>
                  user ? (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-cream/5 hover:bg-cream/10 transition-colors cursor-pointer group"
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full brutal-border overflow-hidden bg-cream shrink-0">
                        <img
                          src={user.avatar_url ?? ''}
                          alt={user.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-lg text-cream tracking-wider truncate">
                          {user.full_name}
                        </p>
                        <p className="font-body text-xs text-cream/50 truncate">
                          {user.location ?? 'Somewhere on the water'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-cream/30 group-hover:text-gold transition-colors" />
                    </motion.div>
                  ) : null,
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ===== MATCH OVERLAY ===== */}
      <AnimatePresence>
        {showMatch && (
          <motion.div
            key="match-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 backdrop-blur-md"
          >
            {/* Confetti */}
            <div className="absolute inset-0 flex items-start justify-center overflow-hidden pointer-events-none">
              {Array.from({ length: 60 }).map((_, i) => (
                <ConfettiPiece key={`conf-${i}`} delay={i * 0.03} index={i} />
              ))}
            </div>

            {/* Sparkles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 18 }).map((_, i) => (
                <Sparkle
                  key={`spark-${i}`}
                  delay={0.2 + i * 0.08}
                  x={randomBetween(-200, 200)}
                  y={randomBetween(100, 400)}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="relative z-10 flex flex-col items-center text-center px-8"
            >
              {/* Matched avatars */}
              <div className="flex items-center -space-x-4 mb-6">
                <div className="w-24 h-24 rounded-full brutal-border overflow-hidden bg-cream z-10">
                  <img
                    src={mockUsers[0].avatar_url ?? ''}
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-24 h-24 rounded-full brutal-border overflow-hidden bg-cream"
                >
                  <img
                    src={
                      swipeProfiles[currentSwipeIndex - 1]?.user.avatar_url ?? ''
                    }
                    alt="Match"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-display text-7xl sm:text-8xl tracking-wider leading-none gold-shimmer mb-3"
              >
                IT&apos;S A MATCH!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-script text-xl sm:text-2xl text-electric-blue mb-10"
              >
                Did we just become best friends? YUP!
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => setShowMatch(false)}
                  className="px-8 py-3 bg-gold text-navy font-display text-2xl tracking-wider brutal-border brutal-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  SEND MESSAGE
                </button>
                <button
                  onClick={() => setShowMatch(false)}
                  className="px-8 py-3 bg-cream text-navy font-display text-2xl tracking-wider brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  KEEP SWIPING
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
