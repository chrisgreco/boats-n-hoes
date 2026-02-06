'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Users,
  Star,
  ArrowLeft,
  Calendar,
  Clock,
  Anchor,
  Waves,
  Music,
  Wifi,
  UtensilsCrossed,
  Sparkles,
  PartyPopper,
  X,
  ChevronLeft,
  ChevronRight,
  Ship,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { mockBoats } from '@/lib/mock-data';

// Map amenity names to icons
const amenityIconMap: Record<string, React.ElementType> = {
  'Hot Tub': Waves,
  'Full Bar': UtensilsCrossed,
  'DJ Booth': Music,
  'Jet Skis': Waves,
  'Karaoke Machine': Music,
  'Helicopter Pad': Sparkles,
  'Premium Sound System': Music,
  'Wakeboard Rack': Anchor,
  Cooler: UtensilsCrossed,
  'LED Lights': Sparkles,
  'Wine Cellar': UtensilsCrossed,
  'Sun Deck': Sparkles,
  Kayaks: Anchor,
  'Snorkeling Gear': Waves,
  'BBQ Grill': UtensilsCrossed,
  Waterslide: Waves,
  'Diving Board': Anchor,
  'LED Party Lights': PartyPopper,
  'Bluetooth Speakers': Music,
  Coolers: UtensilsCrossed,
  'Tiki Bar': UtensilsCrossed,
  Trampolines: Sparkles,
  Paddleboards: Anchor,
  Hammocks: Sparkles,
  'Underwater Lights': Waves,
  'Neon Lighting': Sparkles,
  'Drone Launch Pad': Sparkles,
  'Fog Machine': PartyPopper,
};

const mockReviews = [
  {
    id: '1',
    user_name: 'Chad Thunderwake',
    avatar_seed: 'Chad',
    rating: 5,
    date: '2024-03-28',
    text: 'Absolutely LEGENDARY experience. The boat was pristine, the vibes were immaculate, and the sunset views were unreal. 10/10 would party on this vessel again. Prestige Worldwide delivers.',
  },
  {
    id: '2',
    user_name: 'Tiffany Shores',
    avatar_seed: 'Tiffany',
    rating: 5,
    date: '2024-03-15',
    text: 'We rented this for my bachelorette party and it was the BEST decision ever. The owner was super accommodating, the amenities were top-notch, and we had the time of our lives. The karaoke machine was a game changer.',
  },
  {
    id: '3',
    user_name: 'Marcus Wave',
    avatar_seed: 'Marcus',
    rating: 4,
    date: '2024-02-20',
    text: 'Great boat, amazing location. Only giving 4 stars because we ran out of champagne before sunset. Otherwise, flawless. Will definitely book again for the Catalina Wine Mixer.',
  },
];

export default function BoatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const boat = mockBoats.find((b) => b.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDuration, setBookingDuration] = useState(3);
  const [partySize, setPartySize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const similarBoats = useMemo(() => {
    if (!boat) return [];
    return mockBoats
      .filter((b) => b.id !== boat.id && (b.type === boat.type || b.location === boat.location))
      .slice(0, 3);
  }, [boat]);

  if (!boat) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation />
        <div className="flex flex-col items-center justify-center py-32">
          <Anchor className="w-20 h-20 text-navy/20 mb-6" />
          <h1 className="font-display text-5xl text-navy tracking-wider mb-4">BOAT NOT FOUND</h1>
          <p className="font-body text-navy/60 mb-8">
            This vessel has sailed off into the sunset.
          </p>
          <Link
            href="/boats"
            className="px-6 py-3 bg-gold text-navy font-display text-xl tracking-wider border-[3px] border-navy brutal-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
          >
            BACK TO FLEET
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = boat.hourly_rate * bookingDuration;

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <Link
          href="/boats"
          className="inline-flex items-center gap-2 font-body text-navy/60 hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Fleet</span>
        </Link>
      </div>

      {/* Hero Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          {/* Main Image */}
          <div className="relative h-[400px] lg:h-[500px] border-[3px] border-navy brutal-shadow overflow-hidden group">
            <Image
              src={boat.images[selectedImageIndex]}
              alt={boat.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            {/* Image navigation arrows */}
            {boat.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? boat.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-navy/80 text-cream border-[2px] border-cream/30 hover:bg-navy transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === boat.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-navy/80 text-cream border-[2px] border-cream/30 hover:bg-navy transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            {/* Type Badge */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-navy border-[2px] border-gold">
              <span className="font-display text-lg tracking-wider text-gold uppercase">
                {boat.type}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
            {boat.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative flex-shrink-0 h-24 lg:h-auto lg:flex-1 w-32 lg:w-full border-[3px] overflow-hidden transition-all ${
                  selectedImageIndex === idx
                    ? 'border-gold brutal-shadow-sm'
                    : 'border-navy/30 hover:border-navy'
                }`}
              >
                <Image
                  src={img}
                  alt={`${boat.name} - photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 128px, 33vw"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left Column - Details */}
          <div>
            {/* Name & Meta */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display text-5xl md:text-6xl text-navy tracking-wider">
                  {boat.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-navy/60">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="font-body text-sm">{boat.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-body text-sm font-semibold text-navy">{boat.rating}</span>
                  <span className="font-body text-sm text-navy/40">
                    ({boat.review_count} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-body text-sm">Up to {boat.capacity} guests</span>
                </div>
                <span className="font-body text-sm">{boat.length_ft}ft &middot; {boat.year}</span>
              </div>
            </div>

            {/* Hourly Rate Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-8 px-6 py-3 bg-gold/10 border-[3px] border-gold brutal-shadow-sm"
            >
              <span className="font-display text-4xl text-gold">${boat.hourly_rate}</span>
              <span className="font-body text-gold/70 ml-1">/hr</span>
            </motion.div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-navy tracking-wider mb-3">ABOUT THIS VESSEL</h2>
              <p className="font-body text-navy/80 leading-relaxed text-base">{boat.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-navy tracking-wider mb-4">AMENITIES</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {boat.amenities.map((amenity) => {
                  const IconComponent = amenityIconMap[amenity] || Sparkles;
                  return (
                    <motion.div
                      key={amenity}
                      whileHover={{ y: -2 }}
                      className="flex items-center gap-3 px-4 py-3 bg-white border-[3px] border-navy/20 hover:border-navy transition-colors"
                    >
                      <IconComponent className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="font-body text-sm text-navy">{amenity}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Owner Profile Card */}
            {boat.owner && (
              <div className="mb-8">
                <h2 className="font-display text-2xl text-navy tracking-wider mb-4">YOUR HOST</h2>
                <div className="bg-white border-[3px] border-navy brutal-shadow p-6 flex items-start gap-5">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border-[3px] border-gold">
                    <Image
                      src={boat.owner.avatar_url || ''}
                      alt={boat.owner.full_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-navy tracking-wider">
                      {boat.owner.full_name}
                    </h3>
                    <p className="font-body text-sm text-navy/50 mb-2">
                      {boat.owner.location} &middot; Boat Owner
                    </p>
                    <p className="font-body text-navy/70 text-sm leading-relaxed">
                      {boat.owner.bio}
                    </p>
                    {boat.owner.instagram_handle && (
                      <p className="font-body text-electric-blue text-sm mt-2">
                        {boat.owner.instagram_handle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-navy tracking-wider mb-4">
                REVIEWS ({boat.review_count})
              </h2>
              <div className="space-y-4">
                {mockReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border-[3px] border-navy/15 p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-[2px] border-navy">
                        <Image
                          src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${review.avatar_seed}&backgroundColor=b6e3f4`}
                          alt={review.user_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-navy">
                          {review.user_name}
                        </p>
                        <p className="font-body text-xs text-navy/40">{review.date}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="font-body text-sm text-navy/70 leading-relaxed">{review.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card (sticky) */}
          <div>
            <div className="lg:sticky lg:top-[100px]">
              <div className="bg-white border-[3px] border-navy brutal-shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-display text-3xl text-gold">${boat.hourly_rate}</span>
                    <span className="font-body text-navy/60 ml-1">/hr</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="font-body text-sm font-semibold">{boat.rating}</span>
                  </div>
                </div>

                {!showBookingForm ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBookingForm(true)}
                    className="w-full py-4 bg-hot-pink text-white font-display text-2xl tracking-wider border-[3px] border-navy brutal-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                  >
                    BOOK THIS BOAT
                  </motion.button>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {/* Date */}
                      <div>
                        <label className="font-display text-sm tracking-wider text-navy/70 mb-1 block">
                          DATE
                        </label>
                        <div className="flex items-center border-[3px] border-navy px-3 py-2">
                          <Calendar className="w-4 h-4 text-navy/40 mr-2" />
                          <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="flex-1 font-body text-sm bg-transparent outline-none"
                          />
                        </div>
                      </div>

                      {/* Time */}
                      <div>
                        <label className="font-display text-sm tracking-wider text-navy/70 mb-1 block">
                          START TIME
                        </label>
                        <div className="flex items-center border-[3px] border-navy px-3 py-2">
                          <Clock className="w-4 h-4 text-navy/40 mr-2" />
                          <input
                            type="time"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="flex-1 font-body text-sm bg-transparent outline-none"
                          />
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="font-display text-sm tracking-wider text-navy/70 mb-1 block">
                          DURATION (HOURS)
                        </label>
                        <div className="flex items-center gap-2">
                          {[2, 3, 4, 6, 8].map((hrs) => (
                            <button
                              key={hrs}
                              onClick={() => setBookingDuration(hrs)}
                              className={`flex-1 py-2 font-display text-sm tracking-wider border-[3px] border-navy transition-all ${
                                bookingDuration === hrs
                                  ? 'bg-gold text-navy'
                                  : 'bg-white text-navy hover:bg-gold/20'
                              }`}
                            >
                              {hrs}h
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Party Size */}
                      <div>
                        <label className="font-display text-sm tracking-wider text-navy/70 mb-1 block">
                          PARTY SIZE (MAX {boat.capacity})
                        </label>
                        <div className="flex items-center border-[3px] border-navy px-3 py-2">
                          <Users className="w-4 h-4 text-navy/40 mr-2" />
                          <input
                            type="number"
                            min={1}
                            max={boat.capacity}
                            value={partySize}
                            onChange={(e) => setPartySize(Number(e.target.value))}
                            className="flex-1 font-body text-sm bg-transparent outline-none"
                          />
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div>
                        <label className="font-display text-sm tracking-wider text-navy/70 mb-1 block">
                          SPECIAL REQUESTS
                        </label>
                        <textarea
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          rows={3}
                          placeholder="Extra champagne, specific music, decorations..."
                          className="w-full border-[3px] border-navy px-3 py-2 font-body text-sm bg-transparent outline-none resize-none placeholder:text-navy/30"
                        />
                      </div>

                      {/* Price Summary */}
                      <div className="border-t-[3px] border-navy/15 pt-4 space-y-2">
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-navy/60">
                            ${boat.hourly_rate} x {bookingDuration} hours
                          </span>
                          <span className="text-navy">${totalPrice}</span>
                        </div>
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-navy/60">Service fee</span>
                          <span className="text-navy">${Math.round(totalPrice * 0.1)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t-[2px] border-navy/15">
                          <span className="font-display text-xl text-navy tracking-wider">TOTAL</span>
                          <span className="font-display text-xl text-gold">
                            ${totalPrice + Math.round(totalPrice * 0.1)}
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-hot-pink text-white font-display text-2xl tracking-wider border-[3px] border-navy brutal-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                      >
                        CONFIRM BOOKING
                      </motion.button>

                      <button
                        onClick={() => setShowBookingForm(false)}
                        className="w-full py-2 font-body text-sm text-navy/50 hover:text-navy transition-colors text-center"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Quick Info */}
                <div className="mt-6 pt-4 border-t-[2px] border-navy/10 space-y-2">
                  <div className="flex items-center gap-2 text-navy/50">
                    <Ship className="w-4 h-4" />
                    <span className="font-body text-xs">
                      {boat.length_ft}ft {boat.type} &middot; Built {boat.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-navy/50">
                    <Users className="w-4 h-4" />
                    <span className="font-body text-xs">
                      Capacity: {boat.capacity} guests
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-navy/50">
                    <MapPin className="w-4 h-4" />
                    <span className="font-body text-xs">{boat.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Boats */}
      {similarBoats.length > 0 && (
        <section className="bg-navy py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-4xl text-gold tracking-wider mb-8 text-center">
              SIMILAR BOATS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarBoats.map((similar, index) => (
                <motion.div
                  key={similar.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/boats/${similar.id}`} className="block">
                    <div className="bg-cream border-[3px] border-gold brutal-shadow-sm cursor-pointer group hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={similar.images[0]}
                          alt={similar.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 bg-navy border-[2px] border-gold">
                          <span className="font-display text-sm tracking-wider text-gold uppercase">
                            {similar.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-display text-xl tracking-wider text-navy">
                            {similar.name}
                          </h3>
                          <span className="font-display text-lg text-gold">
                            ${similar.hourly_rate}/hr
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-navy/50">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="font-body text-xs">{similar.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-gold text-gold" />
                            <span className="font-body text-xs font-semibold">{similar.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span className="font-body text-xs">{similar.capacity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
