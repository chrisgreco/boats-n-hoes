'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Users, Star, Search, SlidersHorizontal, Plus, Anchor, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { mockBoats } from '@/lib/mock-data';

const boatTypes = ['All', 'Yacht', 'Sailboat', 'Speedboat', 'Pontoon', 'Catamaran'] as const;

const locations = [...new Set(mockBoats.map((b) => b.location))];

export default function BoatsPage() {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBoats = useMemo(() => {
    return mockBoats.filter((boat) => {
      const matchesType =
        selectedType === 'All' || boat.type === selectedType.toLowerCase();
      const matchesPrice =
        boat.hourly_rate >= priceRange[0] && boat.hourly_rate <= priceRange[1];
      const matchesLocation =
        selectedLocation === 'All' || boat.location === selectedLocation;
      return matchesType && matchesPrice && matchesLocation;
    });
  }, [selectedType, priceRange, selectedLocation]);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero Header */}
      <section className="bg-navy py-12 px-4 relative overflow-hidden">
        {/* Decorative wave shapes */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-cream" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 75% 60%, 50% 0, 25% 60%, 0 0)' }} />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-display text-7xl md:text-9xl text-gold tracking-wider"
          >
            THE FLEET
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-body text-cream/70 text-lg mt-2 max-w-xl mx-auto"
          >
            Prestige Worldwide&apos;s finest collection of vessels. Find your dream boat and make waves.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
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
              {showFilters ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
              FILTERS
            </motion.button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap items-end gap-6 pb-3"
            >
              {/* Price Range */}
              <div className="flex flex-col gap-1">
                <label className="font-display text-sm tracking-wider text-navy/70">PRICE RANGE</label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border-[3px] border-navy bg-white px-3 py-1.5">
                    <span className="text-gold font-display text-lg mr-1">$</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-20 font-body text-sm bg-transparent outline-none"
                      placeholder="Min"
                    />
                  </div>
                  <span className="font-display text-navy">TO</span>
                  <div className="flex items-center border-[3px] border-navy bg-white px-3 py-1.5">
                    <span className="text-gold font-display text-lg mr-1">$</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-20 font-body text-sm bg-transparent outline-none"
                      placeholder="Max"
                    />
                  </div>
                  <span className="font-body text-sm text-navy/60">/hr</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1">
                <label className="font-display text-sm tracking-wider text-navy/70">LOCATION</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border-[3px] border-navy bg-white px-4 py-2 font-body text-sm outline-none cursor-pointer appearance-none pr-8"
                >
                  <option value="All">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedType('All');
                  setPriceRange([0, 1000]);
                  setSelectedLocation('All');
                }}
                className="px-4 py-2 font-display text-sm tracking-wider border-[3px] border-hot-pink bg-hot-pink text-white hover:bg-hot-pink/80 transition-all"
              >
                CLEAR ALL
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <p className="font-body text-navy/60 text-sm">
          Showing <span className="font-semibold text-navy">{filteredBoats.length}</span>{' '}
          {filteredBoats.length === 1 ? 'vessel' : 'vessels'}
        </p>
      </div>

      {/* Boat Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        {filteredBoats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Anchor className="w-16 h-16 text-navy/20 mx-auto mb-4" />
            <h3 className="font-display text-3xl text-navy/40 tracking-wider">NO BOATS FOUND</h3>
            <p className="font-body text-navy/40 mt-2">Try adjusting your filters, captain.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredBoats.map((boat, index) => (
              <motion.div
                key={boat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link href={`/boats/${boat.id}`} className="block">
                  <div className="brutal-card bg-white cursor-pointer group">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={boat.images[0]}
                        alt={boat.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-navy border-[2px] border-gold">
                        <span className="font-display text-sm tracking-wider text-gold uppercase">
                          {boat.type}
                        </span>
                      </div>
                      {/* Availability */}
                      {boat.is_available && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-lime border-[2px] border-navy">
                          <span className="font-body text-xs font-semibold text-navy uppercase">
                            Available
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Name & Rate */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-2xl tracking-wider text-navy leading-tight">
                          {boat.name}
                        </h3>
                        <div className="flex-shrink-0 ml-2 px-3 py-1 bg-gold/10 border-[2px] border-gold">
                          <span className="font-display text-lg text-gold">${boat.hourly_rate}</span>
                          <span className="font-body text-xs text-gold/70">/hr</span>
                        </div>
                      </div>

                      {/* Details Row */}
                      <div className="flex items-center gap-4 text-navy/60 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="font-body text-sm">{boat.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-navy/60 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-body text-sm">{boat.capacity} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          <span className="font-body text-sm font-medium text-navy">
                            {boat.rating}
                          </span>
                          <span className="font-body text-xs text-navy/40">
                            ({boat.review_count})
                          </span>
                        </div>
                      </div>

                      {/* Owner */}
                      {boat.owner && (
                        <div className="flex items-center gap-2 pt-3 border-t-[2px] border-navy/10">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border-[2px] border-navy">
                            <Image
                              src={boat.owner.avatar_url || ''}
                              alt={boat.owner.full_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-body text-sm text-navy/70">
                            {boat.owner.full_name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      <Link href="/post-boat">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-6 py-4 bg-hot-pink text-white font-display text-xl tracking-wider border-[3px] border-navy brutal-shadow-lg cursor-pointer hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
        >
          <Plus className="w-6 h-6" strokeWidth={3} />
          LIST YOUR BOAT
        </motion.div>
      </Link>
    </div>
  );
}
