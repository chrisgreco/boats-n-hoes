'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Users,
  Star,
  Search,
  SlidersHorizontal,
  Anchor,
  X,
  Bot,
  Sparkles,
  Zap,
  Shield,
  ChevronDown,
  ExternalLink,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { mockAggregatedListings } from '@/lib/mock-data';
import type { AggregatedListing, AggregatorSource } from '@/lib/types';

const boatTypes = [
  'All',
  'Yacht',
  'Sailboat',
  'Speedboat',
  'Pontoon',
  'Catamaran',
  'Fishing',
  'Jet Ski',
  'Center Console',
] as const;

const sourceColors: Record<AggregatorSource, string> = {
  boatsetter: '#4A90D9',
  getmyboat: '#2ECC71',
  click_and_boat: '#E67E22',
  sailo: '#9B59B6',
};

const sourceLabels: Record<AggregatorSource, string> = {
  boatsetter: 'Boatsetter',
  getmyboat: 'GetMyBoat',
  click_and_boat: 'Click&Boat',
  sailo: 'Sailo',
};

const sourceFilterOptions: Array<{ key: 'all' | AggregatorSource; label: string; color: string }> = [
  { key: 'all', label: 'All Sources', color: '#D4AF37' },
  { key: 'boatsetter', label: 'Boatsetter', color: '#4A90D9' },
  { key: 'getmyboat', label: 'GetMyBoat', color: '#2ECC71' },
  { key: 'click_and_boat', label: 'Click&Boat', color: '#E67E22' },
  { key: 'sailo', label: 'Sailo', color: '#9B59B6' },
];

const chipExamples = [
  'Party yacht for 20 in Miami under $800/hr',
  'Fishing boat in Key West',
  'Cheapest pontoon near me',
  'Catalina Wine Mixer vessel',
];

type SortOption = 'rating' | 'price_low' | 'price_high' | 'reviews';

export default function BoatsPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeSource, setActiveSource] = useState<'all' | AggregatorSource>('all');
  const [captainIncluded, setCaptainIncluded] = useState(false);
  const [instantBook, setInstantBook] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showHourly, setShowHourly] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredListings = useMemo(() => {
    let results = mockAggregatedListings.filter((listing) => {
      const typeMap: Record<string, string> = {
        'All': 'all',
        'Yacht': 'yacht',
        'Sailboat': 'sailboat',
        'Speedboat': 'speedboat',
        'Pontoon': 'pontoon',
        'Catamaran': 'catamaran',
        'Fishing': 'fishing',
        'Jet Ski': 'jet_ski',
        'Center Console': 'center_console',
      };
      const matchesType =
        selectedType === 'All' || listing.type === typeMap[selectedType];
      const matchesSource =
        activeSource === 'all' || listing.source === activeSource;
      const matchesCaptain = !captainIncluded || listing.captain_included;
      const matchesInstant = !instantBook || listing.instant_book;
      return matchesType && matchesSource && matchesCaptain && matchesInstant;
    });

    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price_low': {
          const aPrice = showHourly ? (a.price_per_hour ?? a.price_per_day ?? 99999) : (a.price_per_day ?? a.price_per_hour ?? 99999);
          const bPrice = showHourly ? (b.price_per_hour ?? b.price_per_day ?? 99999) : (b.price_per_day ?? b.price_per_hour ?? 99999);
          return aPrice - bPrice;
        }
        case 'price_high': {
          const aPrice = showHourly ? (a.price_per_hour ?? a.price_per_day ?? 0) : (a.price_per_day ?? a.price_per_hour ?? 0);
          const bPrice = showHourly ? (b.price_per_hour ?? b.price_per_day ?? 0) : (b.price_per_day ?? b.price_per_hour ?? 0);
          return bPrice - aPrice;
        }
        case 'reviews':
          return b.review_count - a.review_count;
        default:
          return 0;
      }
    });

    return results;
  }, [selectedType, activeSource, captainIncluded, instantBook, sortBy, showHourly]);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      {/* ═══════════════════════════════════════════
          HERO HEADER
      ═══════════════════════════════════════════ */}
      <section className="bg-navy py-16 px-4 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-[-100px] right-[-80px] w-[300px] h-[300px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full bg-electric-blue/5 blur-3xl" />

        {/* Decorative wave bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 bg-cream"
          style={{
            clipPath:
              'polygon(0 100%, 100% 100%, 100% 0, 75% 60%, 50% 0, 25% 60%, 0 0)',
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-display text-7xl md:text-9xl text-gold tracking-wider"
          >
            FIND YOUR BOAT
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-body text-cream/70 text-lg mt-2 max-w-2xl mx-auto"
          >
            We search Boatsetter, GetMyBoat, Click&Boat, Sailo and more so you
            don&apos;t have to.
          </motion.p>

          {/* Source name badges */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-6"
          >
            {Object.entries(sourceLabels).map(([key, label]) => (
              <span
                key={key}
                className="px-4 py-1.5 font-display text-sm tracking-wider border-[2px] border-white/20"
                style={{
                  backgroundColor: `${sourceColors[key as AggregatorSource]}20`,
                  color: sourceColors[key as AggregatorSource],
                  borderColor: `${sourceColors[key as AggregatorSource]}50`,
                }}
              >
                {label.toUpperCase()}
              </span>
            ))}
          </motion.div>

          {/* ═══════════════════════════════════════
              AI SEARCH BAR
          ═══════════════════════════════════════ */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 max-w-3xl mx-auto"
          >
            <div className="relative">
              <div className="flex items-center bg-navy border-[3px] border-gold brutal-shadow-gold">
                <div className="flex items-center gap-2 pl-5 pr-3">
                  <Bot className="w-6 h-6 text-gold" />
                  <Sparkles className="w-4 h-4 text-electric-blue" />
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchValue.trim()) {
                      router.push(`/concierge?q=${encodeURIComponent(searchValue.trim())}`);
                    }
                  }}
                  placeholder="Tell Captain Prestige what you're looking for..."
                  className="flex-1 py-4 bg-transparent font-body text-cream text-lg placeholder:text-cream/40 outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (searchValue.trim()) {
                      router.push(`/concierge?q=${encodeURIComponent(searchValue.trim())}`);
                    }
                  }}
                  className="m-2 px-6 py-2.5 bg-gold text-navy font-display text-xl tracking-wider border-[3px] border-navy hover:bg-hot-pink hover:text-white transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Chip examples */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {chipExamples.map((chip) => (
                <motion.button
                  key={chip}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchValue(chip)}
                  className="px-3 py-1.5 bg-cream/10 border border-cream/20 text-cream/60 font-body text-xs hover:bg-gold/20 hover:text-gold hover:border-gold/40 transition-all cursor-pointer"
                >
                  &ldquo;{chip}&rdquo;
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SOURCE FILTER PILLS
      ═══════════════════════════════════════════ */}
      <section className="bg-cream border-b-[3px] border-navy/10 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sourceFilterOptions.map((source) => (
              <motion.button
                key={source.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSource(source.key)}
                className="px-5 py-2 font-display text-base tracking-wider border-[3px] transition-all"
                style={{
                  borderColor:
                    activeSource === source.key ? source.color : '#0A1628',
                  backgroundColor:
                    activeSource === source.key ? source.color : 'white',
                  color: activeSource === source.key ? 'white' : '#0A1628',
                  boxShadow:
                    activeSource === source.key
                      ? `3px 3px 0px ${source.color}60`
                      : 'none',
                }}
              >
                {source.label.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FILTER BAR (sticky)
      ═══════════════════════════════════════════ */}
      <section className="bg-cream border-b-[3px] border-navy sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Type Buttons Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {boatTypes.map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2 font-display text-lg tracking-wider border-[3px] border-navy transition-all ${
                  selectedType === type
                    ? 'bg-gold text-navy brutal-shadow-sm'
                    : 'bg-white text-navy hover:bg-gold/20'
                }`}
              >
                {type.toUpperCase()}
              </motion.button>
            ))}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto flex items-center gap-2 px-4 py-2 font-display text-lg tracking-wider border-[3px] border-navy bg-white text-navy hover:bg-navy hover:text-cream transition-all"
            >
              {showFilters ? (
                <X className="w-5 h-5" />
              ) : (
                <SlidersHorizontal className="w-5 h-5" />
              )}
              FILTERS
            </motion.button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap items-end gap-6 pb-3 overflow-hidden"
              >
                {/* Captain Included Toggle */}
                <div className="flex flex-col gap-1">
                  <label className="font-display text-sm tracking-wider text-navy/70">
                    CAPTAIN INCLUDED
                  </label>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCaptainIncluded(!captainIncluded)}
                    className={`flex items-center gap-2 px-4 py-2 border-[3px] border-navy font-body text-sm transition-all ${
                      captainIncluded
                        ? 'bg-electric-blue text-navy brutal-shadow-sm'
                        : 'bg-white text-navy hover:bg-electric-blue/20'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    {captainIncluded ? 'ON' : 'OFF'}
                  </motion.button>
                </div>

                {/* Instant Book Toggle */}
                <div className="flex flex-col gap-1">
                  <label className="font-display text-sm tracking-wider text-navy/70">
                    INSTANT BOOK
                  </label>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInstantBook(!instantBook)}
                    className={`flex items-center gap-2 px-4 py-2 border-[3px] border-navy font-body text-sm transition-all ${
                      instantBook
                        ? 'bg-gold text-navy brutal-shadow-sm'
                        : 'bg-white text-navy hover:bg-gold/20'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    {instantBook ? 'ON' : 'OFF'}
                  </motion.button>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="font-display text-sm tracking-wider text-navy/70">
                    SORT BY
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border-[3px] border-navy bg-white px-4 py-2 pr-10 font-body text-sm outline-none cursor-pointer appearance-none"
                    >
                      <option value="rating">Top Rated</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="reviews">Most Reviews</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/50 pointer-events-none" />
                  </div>
                </div>

                {/* Price toggle: hourly vs daily */}
                <div className="flex flex-col gap-1">
                  <label className="font-display text-sm tracking-wider text-navy/70">
                    SHOW PRICING
                  </label>
                  <div className="flex border-[3px] border-navy">
                    <button
                      onClick={() => setShowHourly(true)}
                      className={`px-4 py-2 font-display text-sm tracking-wider transition-all ${
                        showHourly
                          ? 'bg-navy text-cream'
                          : 'bg-white text-navy hover:bg-navy/10'
                      }`}
                    >
                      HOURLY
                    </button>
                    <button
                      onClick={() => setShowHourly(false)}
                      className={`px-4 py-2 font-display text-sm tracking-wider border-l-[3px] border-navy transition-all ${
                        !showHourly
                          ? 'bg-navy text-cream'
                          : 'bg-white text-navy hover:bg-navy/10'
                      }`}
                    >
                      DAILY
                    </button>
                  </div>
                </div>

                {/* Clear Filters */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedType('All');
                    setActiveSource('all');
                    setCaptainIncluded(false);
                    setInstantBook(false);
                    setSortBy('rating');
                    setShowHourly(true);
                  }}
                  className="px-4 py-2 font-display text-sm tracking-wider border-[3px] border-hot-pink bg-hot-pink text-white hover:bg-hot-pink/80 transition-all"
                >
                  CLEAR ALL
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <p className="font-body text-navy/60 text-sm">
          Showing{' '}
          <span className="font-semibold text-navy">
            {filteredListings.length}
          </span>{' '}
          {filteredListings.length === 1 ? 'listing' : 'listings'} across{' '}
          {activeSource === 'all' ? 'all sources' : sourceLabels[activeSource]}
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          RESULTS GRID
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        {filteredListings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Anchor className="w-16 h-16 text-navy/20 mx-auto mb-4" />
            <h3 className="font-display text-3xl text-navy/40 tracking-wider">
              NO BOATS FOUND
            </h3>
            <p className="font-body text-navy/40 mt-2">
              Try adjusting your filters or search across all sources, captain.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <div className="brutal-card bg-white group flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={listing.images[0]}
                      alt={listing.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Source badge - top left */}
                    <div
                      className="absolute top-3 left-3 px-3 py-1 border-[2px]"
                      style={{
                        backgroundColor: sourceColors[listing.source],
                        borderColor: 'white',
                      }}
                    >
                      <span className="font-display text-xs tracking-wider text-white uppercase">
                        {sourceLabels[listing.source]}
                      </span>
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-navy/80 border-[2px] border-gold/50">
                      <span className="font-display text-xs tracking-wider text-gold uppercase">
                        {listing.type.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Price on image bottom */}
                    <div className="absolute bottom-3 left-3 flex items-baseline gap-2">
                      <div className="px-3 py-1 bg-navy/90 border-[2px] border-gold">
                        {showHourly && listing.price_per_hour !== null ? (
                          <>
                            <span className="font-display text-xl text-gold">
                              ${listing.price_per_hour.toLocaleString()}
                            </span>
                            <span className="font-body text-xs text-gold/70">
                              /hr
                            </span>
                          </>
                        ) : listing.price_per_day !== null ? (
                          <>
                            <span className="font-display text-xl text-gold">
                              ${listing.price_per_day.toLocaleString()}
                            </span>
                            <span className="font-body text-xs text-gold/70">
                              /day
                            </span>
                          </>
                        ) : listing.price_per_hour !== null ? (
                          <>
                            <span className="font-display text-xl text-gold">
                              ${listing.price_per_hour.toLocaleString()}
                            </span>
                            <span className="font-body text-xs text-gold/70">
                              /hr
                            </span>
                          </>
                        ) : (
                          <span className="font-display text-lg text-gold">
                            Contact
                          </span>
                        )}
                      </div>
                      {/* Show secondary price if available */}
                      {showHourly &&
                        listing.price_per_hour !== null &&
                        listing.price_per_day !== null && (
                          <span className="font-body text-xs text-white/70">
                            ${listing.price_per_day.toLocaleString()}/day
                          </span>
                        )}
                      {!showHourly &&
                        listing.price_per_day !== null &&
                        listing.price_per_hour !== null && (
                          <span className="font-body text-xs text-white/70">
                            ${listing.price_per_hour.toLocaleString()}/hr
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Name and year */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-2xl tracking-wider text-navy leading-tight">
                        {listing.name}
                      </h3>
                      {listing.year && (
                        <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-navy/5 font-body text-xs text-navy/50 border border-navy/10">
                          {listing.year}
                        </span>
                      )}
                    </div>

                    {/* Location, Capacity, Rating */}
                    <div className="flex flex-wrap items-center gap-4 text-navy/60 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="font-body text-sm">
                          {listing.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="font-body text-sm">
                          {listing.capacity} guests
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-gold text-gold" />
                        <span className="font-body text-sm font-medium text-navy">
                          {listing.rating}
                        </span>
                        <span className="font-body text-xs text-navy/40">
                          ({listing.review_count})
                        </span>
                      </div>
                    </div>

                    {/* Amenity pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {listing.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 bg-cream border border-navy/10 font-body text-[11px] text-navy/60"
                        >
                          {amenity}
                        </span>
                      ))}
                      {listing.amenities.length > 4 && (
                        <span className="px-2 py-0.5 bg-cream border border-navy/10 font-body text-[11px] text-navy/40">
                          +{listing.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Captain + Instant Book badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {listing.captain_included ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 border-[2px] border-green-500">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          <span className="font-display text-[11px] tracking-wider text-green-700">
                            CAPTAIN INCLUDED
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 border-[2px] border-orange-400">
                          <span className="font-display text-[11px] tracking-wider text-orange-600">
                            BYOC
                          </span>
                        </div>
                      )}
                      {listing.instant_book && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 border-[2px] border-yellow-500">
                          <Zap className="w-3.5 h-3.5 text-yellow-600" />
                          <span className="font-display text-[11px] tracking-wider text-yellow-700">
                            INSTANT BOOK
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Owner info */}
                    <div className="flex items-center gap-2 pt-3 border-t-[2px] border-navy/10 mb-4">
                      {listing.owner_avatar && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border-[2px] border-navy flex-shrink-0">
                          <Image
                            src={listing.owner_avatar}
                            alt={listing.owner_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-body text-sm text-navy/80 font-medium">
                          {listing.owner_name}
                        </span>
                        <div className="flex items-center gap-2 text-navy/40">
                          <span className="font-body text-[11px]">
                            {listing.owner_response_rate}% response
                          </span>
                          <span className="font-body text-[11px] flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {listing.owner_response_time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons - pushed to bottom */}
                    <div className="flex gap-2 mt-auto">
                      <a
                        href={listing.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 font-display text-sm tracking-wider border-[3px] text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                          style={{
                            backgroundColor: sourceColors[listing.source],
                            borderColor: '#0A1628',
                            boxShadow: '3px 3px 0px #0A1628',
                          }}
                        >
                          VIEW ON {sourceLabels[listing.source].toUpperCase()}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </motion.div>
                      </a>
                      <Link href="/concierge" className="flex-shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-navy text-gold font-display text-sm tracking-wider border-[3px] border-navy brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                          title="Ask Captain Prestige"
                        >
                          <Bot className="w-4 h-4" />
                          <span className="hidden xl:inline">ASK CAPTAIN</span>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
