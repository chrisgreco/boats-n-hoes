'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MapPin,
  Plus,
  X,
  UserPlus,
  Anchor,
  Waves,
  Fish,
  PartyPopper,
  Compass,
  Sun,
  Calendar,
  Quote,
  Ship,
  Crown,
  Sparkles,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { mockBroProfiles, mockCrews } from '@/lib/mock-data';
import type { BroProfile, Crew } from '@/lib/types';

// ─── Vibe config ─────────────────────────────────────────
type Vibe = 'all' | 'party' | 'adventure' | 'fishing' | 'watersports' | 'chill';

const vibeConfig: Record<
  Exclude<Vibe, 'all'>,
  { label: string; color: string; bg: string; border: string; icon: typeof PartyPopper }
> = {
  party: {
    label: 'Party',
    color: 'text-hot-pink',
    bg: 'bg-hot-pink',
    border: 'border-hot-pink',
    icon: PartyPopper,
  },
  adventure: {
    label: 'Adventure',
    color: 'text-electric-blue',
    bg: 'bg-electric-blue',
    border: 'border-electric-blue',
    icon: Compass,
  },
  fishing: {
    label: 'Fishing',
    color: 'text-gold',
    bg: 'bg-gold',
    border: 'border-gold',
    icon: Fish,
  },
  watersports: {
    label: 'Watersports',
    color: 'text-lime',
    bg: 'bg-lime',
    border: 'border-lime',
    icon: Waves,
  },
  chill: {
    label: 'Chill',
    color: 'text-sunset',
    bg: 'bg-sunset',
    border: 'border-sunset',
    icon: Sun,
  },
};

const vibeFilters: { key: Vibe; label: string; bg: string }[] = [
  { key: 'all', label: 'All', bg: 'bg-cream' },
  { key: 'party', label: 'Party', bg: 'bg-hot-pink' },
  { key: 'adventure', label: 'Adventure', bg: 'bg-electric-blue' },
  { key: 'fishing', label: 'Fishing', bg: 'bg-gold' },
  { key: 'watersports', label: 'Watersports', bg: 'bg-lime' },
  { key: 'chill', label: 'Chill', bg: 'bg-sunset' },
];

// ─── Vibe Badge component ────────────────────────────────
function VibeBadge({ vibe, size = 'md' }: { vibe: Exclude<Vibe, 'all'>; size?: 'sm' | 'md' }) {
  const config = vibeConfig[vibe];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 ${config.bg} text-navy font-display tracking-wider brutal-border ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {config.label.toUpperCase()}
    </span>
  );
}

// ─── Bro Profile Card ────────────────────────────────────
function BroCard({
  profile,
  index,
}: {
  profile: BroProfile;
  index: number;
}) {
  const [sent, setSent] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-cream brutal-border brutal-shadow flex flex-col overflow-hidden"
    >
      {/* Top section: avatar + basic info */}
      <div className="p-5 flex gap-4 items-start">
        {/* Avatar */}
        <div className="relative w-20 h-20 shrink-0 rounded-full brutal-border overflow-hidden bg-navy">
          <Image
            src={profile.user.avatar_url ?? '/placeholder-avatar.png'}
            alt={profile.user.full_name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-2xl text-navy tracking-wider leading-none">
              {profile.user.full_name}
            </h3>
            {profile.user.age && (
              <span className="font-body text-sm text-navy/50">{profile.user.age}</span>
            )}
          </div>

          {profile.user.location && (
            <div className="flex items-center gap-1 mt-1 text-navy/60 font-body text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {profile.user.location}
              <span className="ml-1 text-electric-blue font-medium">
                {profile.distance_miles} mi
              </span>
            </div>
          )}

          <div className="mt-2">
            <VibeBadge vibe={profile.vibe} size="sm" />
          </div>
        </div>
      </div>

      {/* Fun fact quote */}
      <div className="px-5 pb-3">
        <div className="flex gap-2 items-start bg-navy/5 rounded-lg p-3">
          <Quote className="w-4 h-4 text-navy/30 shrink-0 mt-0.5" />
          <p className="font-body text-sm text-navy/70 italic leading-snug">
            &ldquo;{profile.fun_fact}&rdquo;
          </p>
        </div>
      </div>

      {/* Boat preferences */}
      <div className="px-5 pb-3">
        <p className="font-display text-xs text-navy/40 tracking-wider mb-1.5">BOAT PREFERENCES</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.boat_preferences.map((pref) => (
            <span
              key={pref}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-navy/10 border border-navy/20 rounded-full font-body text-xs text-navy/70"
            >
              <Ship className="w-3 h-3" />
              {pref}
            </span>
          ))}
        </div>
      </div>

      {/* Mutual interests */}
      {profile.mutual_interests.length > 0 && (
        <div className="px-5 pb-4">
          <p className="font-display text-xs text-navy/40 tracking-wider mb-1.5">
            MUTUAL INTERESTS
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.mutual_interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-0.5 bg-lime/20 border border-lime/50 rounded-full font-body text-xs text-navy/80"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-auto border-t-[3px] border-navy flex">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSent(true)}
          disabled={sent}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-display text-lg tracking-wider transition-all ${
            sent
              ? 'bg-lime/30 text-navy/50 cursor-default'
              : 'bg-lime text-navy hover:bg-lime/80'
          }`}
        >
          {sent ? (
            <>
              <Sparkles className="w-4 h-4" />
              REQUEST SENT!
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              SEND BRO REQUEST
            </>
          )}
        </motion.button>
        <div className="w-[3px] bg-navy" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-3 bg-cream text-navy/50 hover:text-hot-pink hover:bg-hot-pink/10 font-display text-lg tracking-wider transition-all"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Crew Card ───────────────────────────────────────────
function CrewCard({ crew, index }: { crew: Crew; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-cream brutal-border brutal-shadow flex flex-col overflow-hidden"
    >
      {/* Header with crew avatar + name */}
      <div className="p-5 flex gap-4 items-start">
        <div className="relative w-16 h-16 shrink-0 rounded-lg brutal-border overflow-hidden bg-navy">
          <Image
            src={crew.avatar_url}
            alt={crew.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-2xl text-navy tracking-wider leading-tight">
            {crew.name}
          </h3>
          <div className="mt-1">
            <VibeBadge vibe={crew.vibe} size="sm" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pb-3">
        <p className="font-body text-sm text-navy/70 leading-snug">{crew.description}</p>
      </div>

      {/* Member avatars stacked */}
      <div className="px-5 pb-3">
        <p className="font-display text-xs text-navy/40 tracking-wider mb-2">CREW MEMBERS</p>
        <div className="flex items-center">
          <div className="flex -space-x-3">
            {crew.members.map((member, i) => (
              <div
                key={member.id}
                className="relative w-10 h-10 rounded-full brutal-border overflow-hidden bg-cream"
                style={{ zIndex: crew.members.length - i }}
              >
                <Image
                  src={member.avatar_url ?? '/placeholder-avatar.png'}
                  alt={member.full_name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <span className="ml-3 font-display text-lg text-navy/60 tracking-wider">
            {crew.members.length}/{crew.max_size} BROS
          </span>
        </div>
      </div>

      {/* Next trip */}
      {crew.next_trip && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
            <Calendar className="w-4 h-4 text-electric-blue shrink-0" />
            <div>
              <p className="font-display text-xs text-electric-blue tracking-wider">NEXT TRIP</p>
              <p className="font-body text-sm text-navy/80">{crew.next_trip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Captain badge */}
      {crew.captain && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-gold" />
            <span className="font-display text-xs text-gold tracking-wider">CAPTAIN:</span>
            <span className="font-body text-sm text-navy/70">{crew.captain.full_name}</span>
          </div>
        </div>
      )}

      {/* Join button */}
      <div className="mt-auto border-t-[3px] border-navy">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-lime text-navy font-display text-lg tracking-wider hover:bg-lime/80 transition-all"
        >
          <Anchor className="w-4 h-4" />
          JOIN CREW
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Create Crew Card ────────────────────────────────────
function CreateCrewCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-navy brutal-border brutal-shadow flex flex-col items-center justify-center min-h-[320px] cursor-pointer group"
    >
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.3 }}
        className="w-20 h-20 rounded-full border-[3px] border-dashed border-lime/50 flex items-center justify-center mb-4 group-hover:border-lime transition-colors"
      >
        <Plus className="w-10 h-10 text-lime/50 group-hover:text-lime transition-colors" />
      </motion.div>
      <p className="font-display text-2xl text-lime/70 tracking-wider group-hover:text-lime transition-colors">
        CREATE A CREW
      </p>
      <p className="font-body text-sm text-cream/40 mt-2 px-6 text-center">
        Round up the boys and hit the water
      </p>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────
export default function BrosPage() {
  const [activeTab, setActiveTab] = useState<'find' | 'crews'>('find');
  const [activeVibe, setActiveVibe] = useState<Vibe>('all');

  // Filter profiles by vibe
  const filteredProfiles =
    activeVibe === 'all'
      ? mockBroProfiles
      : mockBroProfiles.filter((p) => p.vibe === activeVibe);

  // Filter crews by vibe
  const filteredCrews =
    activeVibe === 'all'
      ? mockCrews
      : mockCrews.filter((c) => c.vibe === activeVibe);

  return (
    <div className="min-h-screen bg-navy">
      <Navigation />

      {/* ═══════ HERO HEADER ═══════ */}
      <section className="relative overflow-hidden bg-navy pb-8 pt-4">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-lime rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-electric-blue rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-7xl sm:text-8xl md:text-9xl tracking-wider leading-none">
              <span className="text-cream">BOATS N&apos;</span>{' '}
              <span
                className="text-lime"
                style={{ textShadow: '0 0 30px rgba(191,255,0,0.3)' }}
              >
                BROS
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-script text-xl sm:text-2xl text-electric-blue mt-3"
          >
            Find Your Crew. Split the Bill. Double the Fun.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="font-body text-sm text-cream/40 mt-3"
          >
            &ldquo;Did we just become best friends?&rdquo; &mdash; &ldquo;YUP!&rdquo;
          </motion.p>
        </div>
      </section>

      {/* ═══════ VIBE FILTER BAR (sticky) ═══════ */}
      <div className="sticky top-[88px] z-30 bg-navy/95 backdrop-blur-md border-b-[3px] border-lime/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-display text-sm text-cream/50 tracking-wider shrink-0 mr-2">
              VIBE:
            </span>
            {vibeFilters.map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveVibe(filter.key)}
                className={`shrink-0 px-4 py-1.5 font-display text-sm tracking-wider brutal-border transition-all ${
                  activeVibe === filter.key
                    ? `${filter.bg} text-navy brutal-shadow-sm`
                    : 'bg-navy text-cream/60 hover:text-cream border-cream/20'
                }`}
              >
                {filter.label.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ TABS ═══════ */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-3 font-display text-2xl tracking-wider border-[3px] border-r-[1.5px] transition-all ${
              activeTab === 'find'
                ? 'bg-lime text-navy border-navy brutal-shadow-sm'
                : 'bg-navy text-cream/50 border-cream/20 hover:text-cream'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              FIND BROS
            </span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('crews')}
            className={`flex-1 py-3 font-display text-2xl tracking-wider border-[3px] border-l-[1.5px] transition-all ${
              activeTab === 'crews'
                ? 'bg-lime text-navy border-navy brutal-shadow-sm'
                : 'bg-navy text-cream/50 border-cream/20 hover:text-cream'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Anchor className="w-5 h-5" />
              MY CREWS
            </span>
          </motion.button>
        </div>
      </div>

      {/* ═══════ TAB CONTENT ═══════ */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'find' ? (
            <motion.div
              key="find-bros"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProfiles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <Users className="w-16 h-16 text-cream/20 mx-auto mb-4" />
                  <p className="font-display text-3xl text-cream/30 tracking-wider">
                    NO BROS FOUND
                  </p>
                  <p className="font-body text-cream/20 mt-2">
                    Try a different vibe filter, bro
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile, i) => (
                    <BroCard key={profile.user.id} profile={profile} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="my-crews"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredCrews.length === 0 && activeVibe !== 'all' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <Anchor className="w-16 h-16 text-cream/20 mx-auto mb-4" />
                  <p className="font-display text-3xl text-cream/30 tracking-wider">
                    NO CREWS WITH THIS VIBE
                  </p>
                  <p className="font-body text-cream/20 mt-2">
                    Be the first to create one!
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCrews.map((crew, i) => (
                    <CrewCard key={crew.id} crew={crew} index={i} />
                  ))}
                  <CreateCrewCard index={filteredCrews.length} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════ BOTTOM CTA ═══════ */}
      <section className="border-t-[3px] border-lime/30 bg-navy">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-display text-3xl sm:text-4xl text-cream tracking-wider mb-3">
              CAN&apos;T FIND YOUR VIBE?
            </p>
            <p className="font-body text-cream/50 mb-6">
              Create your own crew and recruit bros for your next boat day.
              There&apos;s so much room for activities!
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-lime text-navy font-display text-2xl tracking-wider brutal-border brutal-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-6 h-6" />
                CREATE YOUR CREW
              </span>
            </motion.button>
            <p className="font-script text-lg text-electric-blue mt-6">
              &ldquo;So much room for activities!&rdquo;
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
