'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { mockUsers, mockBoats, mockBookings } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ship,
  Calendar,
  Heart,
  Settings,
  MapPin,
  Star,
  Edit3,
  Instagram,
  Users,
  Clock,
  DollarSign,
  Anchor,
  Check,
  X,
} from 'lucide-react';

const currentUser = mockUsers[0]; // Brennan Huff

const tabs = [
  { id: 'boats', label: 'My Boats', icon: Ship },
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'matches', label: 'My Matches', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type TabId = (typeof tabs)[number]['id'];

const matchedUsers = [mockUsers[3], mockUsers[4], mockUsers[5]]; // Alice, Marina, Captain Jack

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('boats');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: currentUser.full_name,
    bio: currentUser.bio || '',
    looking_for: currentUser.looking_for || 'both',
    location: currentUser.location || '',
    instagram_handle: currentUser.instagram_handle || '',
  });

  const userBoats = mockBoats.filter((b) => b.owner_id === currentUser.id);

  const statusColors: Record<string, string> = {
    confirmed: 'bg-lime text-navy',
    pending: 'bg-gold text-navy',
    cancelled: 'bg-hot-pink text-white',
    active: 'bg-electric-blue text-navy',
    completed: 'bg-ocean text-cream',
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      {/* Header Banner */}
      <div className="relative bg-navy overflow-hidden">
        {/* Wave pattern background */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full wave-animate"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="var(--ocean)"
              d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <path
              fill="var(--deep-purple)"
              opacity="0.5"
              d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,165.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center py-12 px-4">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative"
          >
            <div className="w-[120px] h-[120px] rounded-full border-4 border-gold brutal-shadow-gold overflow-hidden bg-cream">
              <img
                src={currentUser.avatar_url || ''}
                alt={currentUser.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 bg-lime text-navy rounded-full p-1 brutal-border"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
          </motion.div>

          {/* Name & Info */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl text-gold tracking-wider mt-4"
          >
            {currentUser.full_name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-body text-cream/80 text-center max-w-md mt-2"
          >
            {currentUser.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mt-3"
          >
            <MapPin className="w-4 h-4 text-electric-blue" />
            <span className="font-body text-sm text-electric-blue">
              {currentUser.location}
            </span>
          </motion.div>

          {/* Edit Profile Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 px-6 py-2 bg-gold text-navy font-display text-xl tracking-wider brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'CANCEL EDIT' : 'EDIT PROFILE'}
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Boats Listed', value: '3', color: 'bg-electric-blue' },
            { label: 'Reviews', value: '127', color: 'bg-gold' },
            { label: 'Rating', value: '4.9', color: 'bg-lime' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`${stat.color} brutal-border brutal-shadow-sm p-4 text-center`}
            >
              <div className="font-display text-4xl text-navy">{stat.value}</div>
              <div className="font-body text-sm text-navy/70 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 font-display text-lg tracking-wider brutal-border transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-navy text-gold brutal-shadow-sm'
                  : 'bg-cream text-navy hover:bg-gold/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-20">
        <AnimatePresence mode="wait">
          {/* My Boats Tab */}
          {activeTab === 'boats' && (
            <motion.div
              key="boats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {userBoats.map((boat, i) => (
                <motion.div
                  key={boat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="brutal-card bg-white overflow-hidden cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={boat.images[0]}
                      alt={boat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-gold text-navy font-display text-sm px-3 py-1 brutal-border">
                      ${boat.hourly_rate}/HR
                    </div>
                    {boat.is_available && (
                      <div className="absolute top-3 left-3 bg-lime text-navy font-body text-xs font-bold px-2 py-1 brutal-border">
                        AVAILABLE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-2xl text-navy tracking-wider">
                      {boat.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm font-body text-navy/60">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {boat.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {boat.capacity} guests
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="font-body text-sm font-medium">
                        {boat.rating}
                      </span>
                      <span className="font-body text-sm text-navy/50">
                        ({boat.review_count} reviews)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {boat.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="bg-electric-blue/10 text-ocean font-body text-xs px-2 py-0.5 brutal-border"
                        >
                          {amenity}
                        </span>
                      ))}
                      {boat.amenities.length > 3 && (
                        <span className="font-body text-xs text-navy/50 flex items-center">
                          +{boat.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* My Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-4"
            >
              {mockBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="brutal-card bg-white p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Boat Image */}
                    <div className="w-full md:w-32 h-24 rounded overflow-hidden brutal-border shrink-0">
                      <img
                        src={booking.boat?.images[0]}
                        alt={booking.boat?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-display text-2xl text-navy tracking-wider">
                          {booking.boat?.name}
                        </h3>
                        <span
                          className={`px-3 py-0.5 font-display text-sm tracking-wider brutal-border ${
                            statusColors[booking.status]
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 font-body text-sm text-navy/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(booking.start_time).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(booking.start_time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}{' '}
                          -{' '}
                          {new Date(booking.end_time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {booking.party_size} guests
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />$
                          {booking.total_price.toLocaleString()}
                        </span>
                      </div>
                      {booking.special_requests && (
                        <p className="mt-2 font-body text-sm text-navy/50 italic">
                          &quot;{booking.special_requests}&quot;
                        </p>
                      )}
                    </div>

                    {/* Renter Avatar */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden brutal-border">
                        <img
                          src={booking.renter?.avatar_url || ''}
                          alt={booking.renter?.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-body text-xs text-navy/50">
                        {booking.renter?.full_name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {mockBookings.length === 0 && (
                <div className="text-center py-16">
                  <Anchor className="w-16 h-16 text-navy/20 mx-auto" />
                  <p className="font-display text-2xl text-navy/40 mt-4">
                    NO BOOKINGS YET
                  </p>
                  <p className="font-body text-navy/40 mt-1">
                    Time to get out on the water!
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* My Matches Tab */}
          {activeTab === 'matches' && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {matchedUsers.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="brutal-card bg-white p-4 flex flex-col items-center text-center cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-hot-pink brutal-shadow-pink">
                    <img
                      src={user.avatar_url || ''}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-display text-xl text-navy tracking-wider mt-3">
                    {user.full_name}
                  </h4>
                  <span className="font-body text-xs text-navy/50 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {user.location}
                  </span>
                  <div className="mt-2 bg-hot-pink/10 text-hot-pink font-body text-xs font-medium px-2 py-0.5 brutal-border">
                    <Heart className="w-3 h-3 inline mr-1 fill-hot-pink" />
                    MATCHED
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="brutal-card bg-white p-6 max-w-2xl"
            >
              <h2 className="font-display text-3xl text-navy tracking-wider mb-6">
                PROFILE SETTINGS
              </h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-cream brutal-border font-body text-navy disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
                    BIO
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-cream brutal-border font-body text-navy disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  />
                </div>

                {/* Looking For */}
                <div>
                  <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
                    LOOKING FOR
                  </label>
                  <select
                    value={formData.looking_for}
                    onChange={(e) =>
                      setFormData({ ...formData, looking_for: e.target.value as 'boat_party' | 'dating' | 'both' })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-cream brutal-border font-body text-navy disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="boat_party">Boat Parties</option>
                    <option value="dating">Dating</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-cream brutal-border font-body text-navy disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
                    INSTAGRAM
                  </label>
                  <div className="flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-hot-pink" />
                    <input
                      type="text"
                      value={formData.instagram_handle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagram_handle: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="flex-1 px-4 py-2.5 bg-cream brutal-border font-body text-navy disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 pt-2"
                  >
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-6 py-3 bg-gold text-navy font-display text-xl tracking-wider brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      SAVE CHANGES
                    </button>
                    <button
                      onClick={() => {
                        setFormData({
                          full_name: currentUser.full_name,
                          bio: currentUser.bio || '',
                          looking_for: currentUser.looking_for || 'both',
                          location: currentUser.location || '',
                          instagram_handle: currentUser.instagram_handle || '',
                        });
                        setIsEditing(false);
                      }}
                      className="px-6 py-3 bg-cream text-navy font-display text-xl tracking-wider brutal-border hover:bg-hot-pink/10 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      CANCEL
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
