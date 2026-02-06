'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Anchor,
  Ship,
  Heart,
  Bot,
  Star,
  Users,
  MapPin,
  Clock,
  Waves,
  Compass,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Zap,
  Crown,
  Send,
  X as XIcon,
  Instagram,
  Twitter,
  Music,
  ExternalLink,
  Search,
  Globe,
  UserPlus,
} from 'lucide-react';

import { mockAggregatedListings } from '@/lib/mock-data';

/* ───────────────────────────────────────────
   ANIMATED SECTION WRAPPER
   ─────────────────────────────────────────── */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ───────────────────────────────────────────
   HERO SECTION
   ─────────────────────────────────────────── */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const ySubtitle = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-navy vhs-effect"
    >
      {/* Animated bg particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Radial glow behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <motion.div style={{ y: yTitle, opacity }} className="relative z-10 text-center px-4">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-gold/10 border border-gold/30 rounded-full"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="font-body text-sm text-gold tracking-widest uppercase">Now Accepting Reservations</span>
          <Sparkles className="w-4 h-4 text-gold" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] leading-[0.85] tracking-wider gold-shimmer select-none"
        >
          BOATS
          <br />
          N&apos; HOES
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          style={{ y: ySubtitle }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="font-script text-2xl sm:text-3xl md:text-4xl text-electric-blue mt-4 neon-blue">
            A Prestige Worldwide Production
          </p>
          <p className="font-body text-cream/50 text-sm sm:text-base tracking-[0.3em] uppercase mt-3">
            Presented by Huff &apos;N Doback
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 justify-center items-center"
        >
          <Link href="/boats">
            <motion.div
              whileHover={{ x: -3, y: -3 }}
              whileTap={{ x: 3, y: 3 }}
              className="relative px-8 py-4 bg-gold text-navy font-display text-2xl sm:text-3xl tracking-wider brutal-border brutal-shadow-lg cursor-pointer transition-shadow hover:shadow-[4px_4px_0px_var(--navy)]"
            >
              <Ship className="inline-block w-6 h-6 mr-2 -mt-1" />
              RENT A BOAT
            </motion.div>
          </Link>

          <Link href="/dating">
            <motion.div
              whileHover={{ x: -3, y: -3 }}
              whileTap={{ x: 3, y: 3 }}
              className="relative px-8 py-4 bg-hot-pink text-white font-display text-2xl sm:text-3xl tracking-wider brutal-border brutal-shadow-lg cursor-pointer transition-shadow hover:shadow-[4px_4px_0px_var(--navy)]"
            >
              <Heart className="inline-block w-6 h-6 mr-2 -mt-1" />
              FIND YOUR MATCH
            </motion.div>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-body text-xs text-cream/40 tracking-[0.4em] uppercase">Scroll Down</span>
            <Waves className="w-6 h-6 text-gold/50" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Wave SVG at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
            fill="var(--gold)"
            initial={{ d: 'M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z' }}
            animate={{
              d: [
                'M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z',
                'M0,80 C360,20 720,100 1080,40 C1260,60 1380,90 1440,80 L1440,120 L0,120 Z',
                'M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z',
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M0,80 C480,30 960,100 1440,80 L1440,120 L0,120 Z"
            fill="var(--cream)"
            initial={{ d: 'M0,80 C480,30 960,100 1440,80 L1440,120 L0,120 Z' }}
            animate={{
              d: [
                'M0,80 C480,30 960,100 1440,80 L1440,120 L0,120 Z',
                'M0,60 C480,110 960,20 1440,60 L1440,120 L0,120 Z',
                'M0,80 C480,30 960,100 1440,80 L1440,120 L0,120 Z',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </svg>
      </div>

      {/* VHS timestamp overlay */}
      <div className="absolute top-6 right-6 z-20 font-mono text-xs text-cream/30 tracking-wider">
        <span className="bg-red-600/80 px-2 py-0.5 text-white mr-2 text-[10px] font-bold rounded-sm">
          ● REC
        </span>
        PRESTIGE-CAM-01
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────
   MARQUEE TICKER
   ─────────────────────────────────────────── */
function MarqueeTicker() {
  const tickerText =
    'PRESTIGE WORLDWIDE \u2022 THE FIRST WORD IN ENTERTAINMENT \u2022 MANAGEMENT \u2022 FINANCIAL PORTFOLIOS \u2022 INSURANCE \u2022 COMPUTERS \u2022 BLACK LEATHER GLOVES \u2022 RESEARCH AND DEVELOPMENT \u2022 PUTTING IN THE HOURS \u2022 ';

  return (
    <div className="relative bg-gold border-y-[4px] border-navy overflow-hidden py-3 z-30">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="font-display text-xl sm:text-2xl text-navy tracking-[0.2em] mx-4"
          >
            {tickerText}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   AGGREGATOR SECTION
   ─────────────────────────────────────────── */
function AggregatorSection() {
  const sources = [
    { name: 'Boatsetter', color: '#4A90D9' },
    { name: 'GetMyBoat', color: '#2ECC71' },
    { name: 'Click&Boat', color: '#E67E22' },
    { name: 'Sailo', color: '#9B59B6' },
  ];

  const sourceColorMap: Record<string, string> = {
    boatsetter: '#4A90D9',
    getmyboat: '#2ECC71',
    click_and_boat: '#E67E22',
    sailo: '#9B59B6',
  };

  const sourceNameMap: Record<string, string> = {
    boatsetter: 'Boatsetter',
    getmyboat: 'GetMyBoat',
    click_and_boat: 'Click&Boat',
    sailo: 'Sailo',
  };

  return (
    <AnimatedSection className="py-24 px-4 sm:px-8 bg-cream relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-40 h-40 border-4 border-navy/5 rounded-full" />
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-gold/5 rotate-12" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Globe className="w-5 h-5 text-electric-blue" />
            <span className="font-body text-sm tracking-[0.4em] uppercase text-ocean">
              One Search. Every Boat.
            </span>
            <Globe className="w-5 h-5 text-electric-blue" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-6xl sm:text-7xl md:text-8xl text-navy tracking-wider"
          >
            SEARCH EVERY
            <br />
            BOAT, EVERYWHERE
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-navy/60 mt-4 max-w-xl mx-auto"
          >
            We aggregate listings from Boatsetter, GetMyBoat, Click&Boat, Sailo, and more.
            One search. Every boat.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-32 h-1 bg-gold mx-auto mt-4"
          />
        </div>

        {/* Source Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {sources.map((source) => (
            <span
              key={source.name}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white brutal-border font-body text-sm text-navy tracking-wider"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: source.color }}
              />
              {source.name}
            </span>
          ))}
        </motion.div>

        {/* Fake Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <Link href="/boats">
            <motion.div
              whileHover={{ y: -3 }}
              className="flex items-center gap-4 px-6 py-5 bg-white brutal-border shadow-[6px_6px_0px_var(--navy)] cursor-pointer transition-all hover:shadow-[4px_4px_0px_var(--navy)]"
            >
              <Globe className="w-6 h-6 text-navy/40 shrink-0" />
              <span className="flex-1 font-body text-lg text-navy/40">
                Tell our AI what you need...
              </span>
              <div className="w-12 h-12 bg-gold flex items-center justify-center brutal-border shrink-0">
                <Send className="w-5 h-5 text-navy" />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Aggregated Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockAggregatedListings.slice(0, 4).map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <a
                href={listing.external_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group bg-white brutal-border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[6px_6px_0px_var(--gold)]"
                >
                  {/* Source badge */}
                  <div className="absolute z-10 top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-body font-medium brutal-border">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: sourceColorMap[listing.source] || '#999' }}
                      />
                      {sourceNameMap[listing.source] || listing.source}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative h-[200px] overflow-hidden">
                    <Image
                      src={listing.images[0]}
                      alt={listing.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <ExternalLink className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="font-display text-xl text-navy tracking-wider line-clamp-1">
                      {listing.name}
                    </h3>
                    <div className="font-display text-2xl text-gold mt-1">
                      ${listing.price_per_hour}/hr
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs font-body text-navy/60">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-navy/40" />
                        {listing.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-navy/40" />
                        {listing.capacity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        {listing.rating}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/boats">
            <motion.div
              whileHover={{ x: -3, y: -3 }}
              whileTap={{ x: 3, y: 3 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-navy font-display text-2xl tracking-wider brutal-border brutal-shadow-lg cursor-pointer transition-shadow hover:shadow-[3px_3px_0px_var(--navy)]"
            >
              SEARCH ALL BOATS
              <Search className="w-6 h-6" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   HOW IT WORKS
   ─────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'LIST YOUR BOAT',
      description:
        'Got a vessel? Throw it on the platform. Yacht, pontoon, kayak with a motor taped to it - we don\'t judge. Set your price, add some glamour shots, and watch the booking requests roll in.',
      icon: Ship,
      accent: 'bg-electric-blue',
      shadow: 'shadow-[6px_6px_0px_var(--electric-blue)]',
      borderHover: 'hover:border-electric-blue',
    },
    {
      number: '02',
      title: 'FIND YOUR CREW',
      description:
        'Swipe through profiles of people who actually want to party on a boat. Match with your ideal crew based on vibe, music taste, and willingness to do the Catalina Wine Mixer.',
      icon: Heart,
      accent: 'bg-hot-pink',
      shadow: 'shadow-[6px_6px_0px_var(--hot-pink)]',
      borderHover: 'hover:border-hot-pink',
    },
    {
      number: '03',
      title: 'SET SAIL',
      description:
        'Book it. Board it. Blast \'Boats N\' Hoes\' on the speakers. Our AI concierge handles the rest - catering, route planning, and making sure nobody falls overboard (again).',
      icon: Compass,
      accent: 'bg-gold',
      shadow: 'shadow-[6px_6px_0px_var(--gold)]',
      borderHover: 'hover:border-gold',
    },
  ];

  return (
    <AnimatedSection className="py-24 px-4 sm:px-8 bg-cream relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 border-4 border-navy/5 rotate-12" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-hot-pink/5 rotate-45" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-gold/10 rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block font-body text-sm tracking-[0.4em] uppercase text-ocean mb-4"
          >
            It&apos;s Stupid Simple
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-6xl sm:text-7xl md:text-8xl text-navy tracking-wider"
          >
            HOW IT WORKS
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-32 h-1 bg-hot-pink mx-auto mt-4"
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ y: -8, rotate: i === 1 ? 1 : i === 2 ? -1 : 0 }}
                className={`relative bg-white p-8 brutal-border ${step.shadow} transition-all duration-200`}
              >
                {/* Step number */}
                <div
                  className={`absolute -top-5 -left-3 ${step.accent} w-14 h-14 flex items-center justify-center brutal-border`}
                >
                  <span className="font-display text-2xl text-navy">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6 mt-4">
                  <div className={`w-20 h-20 ${step.accent} flex items-center justify-center brutal-border`}>
                    <step.icon className="w-10 h-10 text-navy" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-3xl text-navy tracking-wider text-center mb-4">
                  {step.title}
                </h3>
                <p className="font-body text-navy/70 text-center leading-relaxed">
                  {step.description}
                </p>

                {/* Decorative corner */}
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${step.accent}`} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Connecting arrows (desktop only) */}
        <div className="hidden md:flex justify-center items-center mt-[-180px] mb-[120px] pointer-events-none">
          <div className="flex items-center gap-4 w-full max-w-2xl mx-auto justify-between px-20">
            <ArrowRight className="w-10 h-10 text-navy/20" />
            <ArrowRight className="w-10 h-10 text-navy/20" />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   FEATURED BOATS (THE FLEET)
   ─────────────────────────────────────────── */
function FeaturedBoats() {
  const boats = [
    {
      name: 'The Prestige',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
      rate: 750,
      location: 'Marina Del Rey, CA',
      capacity: 20,
      rating: 4.9,
      reviews: 127,
      type: 'LUXURY YACHT',
      length: '85 ft',
    },
    {
      name: 'Drum Solo',
      image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80',
      rate: 350,
      location: 'Long Beach, CA',
      capacity: 8,
      rating: 4.7,
      reviews: 83,
      type: 'SPEEDBOAT',
      length: '32 ft',
    },
    {
      name: 'Catalina Dreamer',
      image: 'https://images.unsplash.com/photo-1534854638093-bada1813ca19?w=800&q=80',
      rate: 450,
      location: 'Catalina Island, CA',
      capacity: 12,
      rating: 4.8,
      reviews: 56,
      type: 'SAILBOAT',
      length: '45 ft',
    },
  ];

  return (
    <AnimatedSection className="py-24 px-4 sm:px-8 bg-navy relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Anchor className="w-5 h-5 text-gold" />
            <span className="font-body text-sm tracking-[0.4em] uppercase text-gold">
              Prestige Worldwide Fleet
            </span>
            <Anchor className="w-5 h-5 text-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-7xl sm:text-8xl md:text-9xl text-cream tracking-wider"
          >
            THE FLEET
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-cream/50 mt-4 max-w-lg mx-auto"
          >
            Hand-picked vessels for maximum sea-based shenanigans. Each one inspected
            by our team of two grown men who still live with their parents.
          </motion.p>
        </div>

        {/* Boats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {boats.map((boat, i) => (
            <motion.div
              key={boat.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.div
                whileHover={{ y: -6 }}
                whileTap={{ y: 2 }}
                className="group bg-ocean/30 brutal-border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[8px_8px_0px_var(--gold)]"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={boat.image}
                    alt={boat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Rate badge */}
                  <div className="absolute top-3 right-3 bg-gold text-navy font-display text-xl px-3 py-1 brutal-border">
                    ${boat.rate}/hr
                  </div>
                  {/* Type badge */}
                  <div className="absolute top-3 left-3 bg-navy/80 text-electric-blue font-body text-xs tracking-wider px-2 py-1 border border-electric-blue/30">
                    {boat.type}
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-2xl text-cream tracking-wider">
                      {boat.name}
                    </h3>
                    <span className="font-body text-sm text-cream/40">{boat.length}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm font-body text-cream/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      {boat.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-electric-blue" />
                      {boat.capacity} guests
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream/10">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="font-body text-sm text-cream font-medium">
                        {boat.rating}
                      </span>
                      <span className="font-body text-xs text-cream/40">
                        ({boat.reviews} reviews)
                      </span>
                    </div>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-1 text-gold font-body text-sm font-medium"
                    >
                      View <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/boats">
            <motion.div
              whileHover={{ x: -3, y: -3 }}
              whileTap={{ x: 3, y: 3 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-cream text-navy font-display text-2xl tracking-wider brutal-border brutal-shadow-gold cursor-pointer transition-shadow hover:shadow-[3px_3px_0px_var(--gold)]"
            >
              VIEW ALL BOATS
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   DATING SECTION (FIND YOUR FIRST MATE)
   ─────────────────────────────────────────── */
function DatingSection() {
  const profiles = [
    { name: 'Marina', age: 26, img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Marina&backgroundColor=d1f4d1', bio: 'Champagne enthusiast. Named after the harbor.' },
    { name: 'Alice', age: 28, img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alice&backgroundColor=ffdfbf', bio: 'Love the ocean, love a good party.' },
    { name: 'Captain Jack', age: 45, img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jack&backgroundColor=b6e3f4', bio: 'Why is the rum always gone?' },
  ];

  return (
    <AnimatedSection className="py-24 px-4 sm:px-8 bg-cream relative overflow-hidden">
      {/* Pink glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-hot-pink/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Heart className="w-5 h-5 text-hot-pink fill-hot-pink" />
            <span className="font-body text-sm tracking-[0.4em] uppercase text-hot-pink">
              Swipe. Match. Sail.
            </span>
            <Heart className="w-5 h-5 text-hot-pink fill-hot-pink" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-6xl sm:text-7xl md:text-8xl text-navy tracking-wider"
          >
            FIND YOUR
            <br />
            <span className="gradient-text">FIRST MATE</span>
          </motion.h2>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="relative w-[300px] h-[580px] bg-navy rounded-[40px] p-3 brutal-border shadow-[8px_8px_0px_var(--hot-pink)]">
                <div className="w-full h-full bg-ocean/40 rounded-[28px] overflow-hidden relative">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 py-3 bg-navy/50">
                    <span className="font-body text-xs text-cream/50">9:41</span>
                    <span className="font-display text-sm text-gold tracking-wider">
                      BOATS N&apos; HOES
                    </span>
                    <Heart className="w-4 h-4 text-hot-pink" />
                  </div>

                  {/* Profile Card Stack */}
                  <div className="relative p-4 h-[calc(100%-100px)]">
                    {profiles.map((profile, i) => (
                      <motion.div
                        key={profile.name}
                        className="absolute inset-4 bg-white rounded-2xl overflow-hidden brutal-border"
                        style={{
                          zIndex: profiles.length - i,
                          rotate: i === 0 ? 0 : i === 1 ? 3 : -2,
                          scale: 1 - i * 0.05,
                          y: i * 8,
                        }}
                        animate={
                          i === 0
                            ? {
                                rotate: [0, 2, -1, 0],
                              }
                            : {}
                        }
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        {/* Profile image area */}
                        <div className="h-[55%] bg-gradient-to-br from-hot-pink/20 to-gold/20 flex items-center justify-center relative">
                          <Image
                            src={profile.img}
                            alt={profile.name}
                            width={120}
                            height={120}
                            className="rounded-full"
                          />
                          <div className="absolute bottom-3 right-3 bg-lime text-navy font-body text-xs px-2 py-0.5 brutal-border font-bold">
                            2.4 mi
                          </div>
                        </div>
                        {/* Profile info */}
                        <div className="p-4">
                          <h4 className="font-display text-2xl text-navy tracking-wider">
                            {profile.name}, {profile.age}
                          </h4>
                          <p className="font-body text-sm text-navy/60 mt-1">
                            {profile.bio}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <span className="text-xs font-body bg-electric-blue/10 text-electric-blue px-2 py-0.5 rounded-full">
                              Yacht Parties
                            </span>
                            <span className="text-xs font-body bg-hot-pink/10 text-hot-pink px-2 py-0.5 rounded-full">
                              Sunsets
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 bg-white rounded-full flex items-center justify-center brutal-border cursor-pointer"
                    >
                      <XIcon className="w-7 h-7 text-red-500" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 bg-hot-pink rounded-full flex items-center justify-center brutal-border cursor-pointer"
                    >
                      <Heart className="w-7 h-7 text-white fill-white" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 bg-gold rounded-full flex items-center justify-center brutal-border cursor-pointer"
                    >
                      <Star className="w-7 h-7 text-navy fill-navy" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 bg-hot-pink text-white font-display text-sm px-3 py-1 brutal-border rotate-6"
              >
                IT&apos;S A MATCH!
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-6 bg-gold text-navy font-display text-sm px-3 py-1 brutal-border -rotate-3"
              >
                <Anchor className="w-4 h-4 inline mr-1" />
                SWIPE RIGHT
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="font-body text-lg text-navy/80 leading-relaxed">
              It&apos;s like Tinder, but with <span className="font-bold text-hot-pink">boats</span>.
              Match with boat owners who want crew members, or find your soulmate
              who also thinks the Catalina Wine Mixer is peak civilization.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Heart,
                  title: 'Swipe on People AND Boats',
                  desc: 'Why choose? Match with a hot person AND their hot yacht.',
                  color: 'text-hot-pink',
                  bg: 'bg-hot-pink/10',
                },
                {
                  icon: Ship,
                  title: 'Boat Owner? Get Matched with Crew',
                  desc: 'Fill your boat with compatible party people. No weirdos (probably).',
                  color: 'text-electric-blue',
                  bg: 'bg-electric-blue/10',
                },
                {
                  icon: Sparkles,
                  title: 'AI-Powered Compatibility',
                  desc: 'Our algorithm factors in vibe, music taste, and sea-sickness probability.',
                  color: 'text-gold',
                  bg: 'bg-gold/10',
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-4 bg-white brutal-border brutal-shadow-sm"
                >
                  <div className={`w-10 h-10 ${feature.bg} flex items-center justify-center rounded-lg shrink-0`}>
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-navy tracking-wider">
                      {feature.title}
                    </h4>
                    <p className="font-body text-sm text-navy/60 mt-1">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/dating">
              <motion.div
                whileHover={{ x: -3, y: -3 }}
                whileTap={{ x: 3, y: 3 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-hot-pink text-white font-display text-2xl tracking-wider brutal-border brutal-shadow cursor-pointer mt-4 transition-shadow hover:shadow-[3px_3px_0px_var(--navy)]"
              >
                START SWIPING
                <Heart className="w-6 h-6 fill-white" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   BOATS N' BROS
   ─────────────────────────────────────────── */
function BoatsNBrosSection() {
  const broPreviewCards = [
    {
      name: 'Chad W.',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Chad&backgroundColor=c0aede',
      vibe: 'Watersports',
      distance: '2.4 mi away',
      sentRequest: false,
    },
    {
      name: 'Tony M.',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Tony&backgroundColor=ffd5dc',
      vibe: 'Fishing',
      distance: '3.1 mi away',
      sentRequest: true,
    },
    {
      name: 'Mike S.',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Mike&backgroundColor=d1f4d1',
      vibe: 'Chill',
      distance: '1.8 mi away',
      sentRequest: false,
    },
  ];

  const features = [
    {
      icon: UserPlus,
      title: 'Match with Bros',
      desc: 'Find guys who share your boat vibe. Party bros, fishing bros, chill bros - we got em all.',
      color: 'text-[#BFFF00]',
      bg: 'bg-[#BFFF00]/10',
    },
    {
      icon: Users,
      title: 'Form a Crew',
      desc: 'Build your squad, plan trips together. Strength in numbers, savings in splitting.',
      color: 'text-electric-blue',
      bg: 'bg-electric-blue/10',
    },
    {
      icon: Crown,
      title: 'Split the Cost',
      desc: 'Why pay full price when you can split? That $750/hr yacht is way cheaper with 6 bros.',
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
  ];

  return (
    <AnimatedSection className="py-24 px-4 sm:px-8 bg-navy relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#BFFF00]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Users className="w-5 h-5 text-[#BFFF00]" />
            <span className="font-body text-sm tracking-[0.4em] uppercase text-[#BFFF00]">
              Find Your Crew. Split the Bill. Double the Fun.
            </span>
            <Users className="w-5 h-5 text-[#BFFF00]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-6xl sm:text-7xl md:text-8xl text-[#BFFF00] tracking-wider"
          >
            BOATS N&apos; BROS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-cream/50 mt-4 max-w-lg mx-auto"
          >
            Find Your Crew. Split the Bill. Double the Fun.
          </motion.p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Bro Profile Preview Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-[380px] space-y-4">
              {broPreviewCards.map((bro, i) => (
                <motion.div
                  key={bro.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ x: 8 }}
                  className="relative flex items-center gap-4 p-4 bg-ocean/30 brutal-border cursor-pointer transition-all"
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden brutal-border shrink-0 bg-white">
                    <Image
                      src={bro.avatar}
                      alt={bro.name}
                      width={64}
                      height={64}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="font-display text-xl text-cream tracking-wider">
                      {bro.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-body bg-[#BFFF00]/10 text-[#BFFF00] px-2 py-0.5 rounded-full">
                        {bro.vibe}
                      </span>
                      <span className="text-xs font-body text-cream/40">
                        {bro.distance}
                      </span>
                    </div>
                  </div>

                  {/* Bro Request Sent Tag */}
                  {bro.sentRequest && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-3 -right-3 bg-[#BFFF00] text-navy font-display text-xs px-3 py-1 brutal-border rotate-3"
                    >
                      BRO REQUEST SENT!
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-8 -right-4 bg-[#BFFF00] text-navy font-display text-sm px-3 py-1 brutal-border rotate-6 z-10"
              >
                DID WE JUST BECOME BEST FRIENDS?
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -left-4 bg-electric-blue text-navy font-display text-sm px-3 py-1 brutal-border -rotate-3 z-10"
              >
                YUP!
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-4 bg-ocean/30 brutal-border"
                >
                  <div className={`w-10 h-10 ${feature.bg} flex items-center justify-center rounded-lg shrink-0`}>
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-cream tracking-wider">
                      {feature.title}
                    </h4>
                    <p className="font-body text-sm text-cream/60 mt-1">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/bros">
              <motion.div
                whileHover={{ x: -3, y: -3 }}
                whileTap={{ x: 3, y: 3 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#BFFF00] text-navy font-display text-2xl tracking-wider brutal-border brutal-shadow cursor-pointer mt-4 transition-shadow hover:shadow-[3px_3px_0px_var(--cream)]"
              >
                FIND YOUR CREW
                <Users className="w-6 h-6" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   AI CONCIERGE PREVIEW
   ─────────────────────────────────────────── */
function AIConciergeSection() {
  const messages = [
    {
      role: 'ai' as const,
      content:
        "Ahoy, Captain! I'm your Boats N' Hoes AI Concierge, powered by Prestige Worldwide's cutting-edge technology. What can I help you with today?",
      delay: 0,
    },
    {
      role: 'user' as const,
      content:
        'I need a yacht for 15 people this weekend in Marina Del Rey. Budget around $2000.',
      delay: 0.4,
    },
    {
      role: 'ai' as const,
      content:
        'Great taste! I\'d recommend **The Prestige** - an 85ft yacht at $750/hr. Hot tub, full bar, DJ booth, and karaoke machine. For a 3-hour cruise: $2,250. Want me to check Saturday availability?',
      delay: 0.8,
    },
    {
      role: 'user' as const,
      content: 'Does it have a karaoke machine? Asking for a friend (it\'s me).',
      delay: 1.2,
    },
    {
      role: 'ai' as const,
      content:
        'Absolutely! Full karaoke setup with 10,000+ songs. I\'ve already queued up "Boats N\' Hoes" as song #1. Shall I book it? I can also arrange catering - our lobster & champagne package is *chef\'s kiss*.',
      delay: 1.6,
    },
  ];

  return (
    <AnimatedSection className="py-24 px-4 sm:px-8 bg-deep-purple relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-electric-blue/5 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-electric-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Bot className="w-5 h-5 text-electric-blue" />
            <span className="font-body text-sm tracking-[0.4em] uppercase text-electric-blue">
              AI-Powered Excellence
            </span>
            <Bot className="w-5 h-5 text-electric-blue" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-6xl sm:text-7xl md:text-8xl text-cream tracking-wider"
          >
            YOUR PERSONAL
            <br />
            <span className="neon-blue text-electric-blue">BOAT BUTLER</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-cream/50 mt-4 max-w-lg mx-auto"
          >
            Ask anything. Book anything. Our AI knows every boat, every captain, and every
            happy hour deal on the water.
          </motion.p>
        </div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-dark rounded-2xl overflow-hidden brutal-border shadow-[8px_8px_0px_var(--electric-blue)]">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-cream/10 bg-navy/50">
              <div className="relative">
                <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-electric-blue" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime rounded-full border-2 border-navy" />
              </div>
              <div>
                <h4 className="font-display text-lg text-cream tracking-wider">
                  CONCIERGE AI
                </h4>
                <p className="font-body text-xs text-lime">Online - Ready to serve</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold" />
                <span className="font-body text-xs text-gold">Powered by Prestige Worldwide</span>
              </div>
            </div>

            {/* Messages */}
            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: msg.delay, duration: 0.4 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      msg.role === 'ai'
                        ? 'bg-ocean/40 text-cream border border-electric-blue/20 rounded-bl-md'
                        : 'bg-gold/90 text-navy rounded-br-md'
                    }`}
                  >
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Bot className="w-3.5 h-3.5 text-electric-blue" />
                        <span className="font-body text-xs text-electric-blue font-medium">
                          Concierge AI
                        </span>
                      </div>
                    )}
                    <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input area */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-3 bg-navy/50 border border-cream/10 rounded-xl px-4 py-3">
                <input
                  type="text"
                  placeholder="Ask me anything about boats..."
                  className="flex-1 bg-transparent font-body text-sm text-cream placeholder-cream/30 outline-none"
                  readOnly
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 bg-electric-blue rounded-lg flex items-center justify-center"
                >
                  <Send className="w-4 h-4 text-navy" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mt-10"
        >
          {[
            'Instant Booking',
            'Route Planning',
            'Weather Alerts',
            'Catering Orders',
            'Music Playlists',
            'Party Planning',
          ].map((feature) => (
            <span
              key={feature}
              className="font-body text-xs tracking-wider text-cream/50 px-4 py-2 border border-cream/10 rounded-full hover:border-electric-blue/50 hover:text-electric-blue transition-colors cursor-default"
            >
              {feature}
            </span>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   STATS BAR
   ─────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { number: '25,000+', label: 'BOATS AGGREGATED', bg: 'bg-gold', text: 'text-navy', icon: Ship },
    { number: '50,000+', label: 'MATCHES MADE', bg: 'bg-hot-pink', text: 'text-white', icon: Heart },
    { number: '1M+', label: 'HOURS ON WATER', bg: 'bg-electric-blue', text: 'text-navy', icon: Clock },
    { number: '420', label: 'VIBES PER HOUR', bg: 'bg-lime', text: 'text-navy', icon: Zap },
  ];

  return (
    <section className="relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.bg} ${stat.text} p-8 sm:p-10 text-center border-y-[3px] border-navy ${i < stats.length - 1 ? 'border-r-[3px]' : ''} ${i === 0 ? 'border-l-0' : ''}`}
          >
            <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-60" />
            <motion.div
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider"
            >
              {stat.number}
            </motion.div>
            <p className="font-body text-xs sm:text-sm tracking-[0.3em] mt-2 opacity-70 uppercase">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────
   TESTIMONIAL / SOCIAL PROOF BAR
   ─────────────────────────────────────────── */
function SocialProofBar() {
  return (
    <AnimatedSection className="py-20 px-4 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-display text-[20rem] text-navy/[0.02] tracking-wider select-none">
          BOATS
        </span>
      </div>
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Crown className="w-12 h-12 text-gold mx-auto mb-6" />
            <blockquote className="font-display text-4xl sm:text-5xl md:text-6xl text-navy tracking-wider leading-tight">
              &ldquo;DID WE JUST BECOME
              <br />
              <span className="text-hot-pink">BEST FRIENDS?</span>&rdquo;
            </blockquote>
            <p className="font-display text-3xl sm:text-4xl text-gold mt-4 tracking-wider">
              &ldquo;YUP!&rdquo;
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-gold fill-gold" />
              </div>
              <p className="font-body text-navy/60 text-sm">
                - Brennan Huff & Dale Doback, Co-Founders
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   FOOTER
   ─────────────────────────────────────────── */
function Footer() {
  const footerLinks = {
    Company: ['About', 'Careers', 'Press', 'Blog'],
    Product: ['Boats', 'Dating', 'AI Concierge', 'Enterprise'],
    Legal: ['Terms', 'Privacy', 'Cookies', 'DMCA'],
    Support: ['Help Center', 'Contact', 'Safety', 'Accessibility'],
  };

  return (
    <footer className="bg-navy border-t-[4px] border-gold relative overflow-hidden">
      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,40 1440,30 L1440,0 L0,0 Z"
            fill="var(--navy)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-20 pb-10 relative">
        {/* Top area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Anchor className="w-10 h-10 text-gold" />
              <div>
                <h3 className="font-display text-3xl text-gold tracking-wider">
                  BOATS N&apos; HOES
                </h3>
                <p className="font-script text-sm text-electric-blue">
                  A Prestige Worldwide Production
                </p>
              </div>
            </div>
            <p className="font-script text-2xl text-gold/80 mb-6">
              Prestige Worldwide
            </p>
            <p className="font-body text-cream/40 text-sm leading-relaxed max-w-sm">
              The first word in entertainment, management, financial portfolios,
              insurance, computers, black leather gloves, and research &amp; development.
              We put in the hours and we put in the time.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Music, label: 'TikTok' },
                { icon: Anchor, label: 'Anchor' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 1 }}
                  className="w-10 h-10 bg-ocean/30 border border-cream/10 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-lg text-cream tracking-wider mb-4">
                {category.toUpperCase()}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="font-body text-sm text-cream/40 hover:text-gold transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-cream/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-cream/30">
              &copy; 2026 Prestige Worldwide LLC. A Huff &apos;N Doback Joint.
              All rights reserved. Boats sold separately. Side effects may include
              excessive fun and spontaneous karaoke.
            </p>
            <div className="flex items-center gap-2">
              <span className="font-body text-xs text-cream/30">Built with</span>
              <Heart className="w-3 h-3 text-hot-pink fill-hot-pink" />
              <span className="font-body text-xs text-cream/30">and sea water</span>
            </div>
          </div>

          {/* Easter egg */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 font-display text-xs text-cream/10 tracking-[0.5em]"
          >
            POW! POW!
          </motion.p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────────────────────────
   MAIN PAGE COMPONENT
   ─────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <HeroSection />
      <MarqueeTicker />
      <AggregatorSection />
      <HowItWorks />
      <FeaturedBoats />
      <DatingSection />
      <BoatsNBrosSection />
      <AIConciergeSection />
      <StatsBar />
      <SocialProofBar />
      <Footer />
    </main>
  );
}
