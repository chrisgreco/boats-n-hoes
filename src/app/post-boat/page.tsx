'use client';

import { useState, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ship,
  ChevronRight,
  ChevronLeft,
  Upload,
  Camera,
  MapPin,
  DollarSign,
  Anchor,
  Sparkles,
  Check,
  PartyPopper,
  Waves,
} from 'lucide-react';

const boatTypes = [
  { value: 'yacht', label: 'Yacht' },
  { value: 'sailboat', label: 'Sailboat' },
  { value: 'speedboat', label: 'Speedboat' },
  { value: 'pontoon', label: 'Pontoon' },
  { value: 'catamaran', label: 'Catamaran' },
  { value: 'fishing', label: 'Fishing Boat' },
  { value: 'houseboat', label: 'Houseboat' },
];

const amenityOptions = [
  'Hot Tub',
  'Full Bar',
  'DJ Booth',
  'Jet Skis',
  'Karaoke Machine',
  'Helicopter Pad',
  'Premium Sound System',
  'Wakeboard Rack',
  'LED Party Lights',
  'BBQ Grill',
  'Bluetooth Speakers',
  'Wine Cellar',
  'Sun Deck',
  'Kayaks',
  'Snorkeling Gear',
  'Paddleboards',
  'Waterslide',
  'Diving Board',
  'Hammocks',
  'Underwater Lights',
  'Fog Machine',
  'Drone Launch Pad',
  'Tiki Bar',
  'Trampolines',
  'Coolers',
  'Fishing Gear',
];

const stepLabels = ['Basics', 'Details', 'Pricing', 'Photos', 'Location'];

interface FormData {
  name: string;
  type: string;
  year: string;
  length: string;
  capacity: string;
  description: string;
  amenities: string[];
  hourlyRate: string;
  photos: string[];
  location: string;
}

export default function PostBoatPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    year: '',
    length: '',
    capacity: '',
    description: '',
    amenities: [],
    hourlyRate: '',
    photos: [],
    location: '',
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleNext = () => {
    if (currentStep < stepLabels.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Mock photo add
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, `photo-${Date.now()}`],
    }));
  }, []);

  const addMockPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, `photo-${Date.now()}`],
    }));
  };

  const progressPercent = ((currentStep + 1) / stepLabels.length) * 100;

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="anchor-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <text x="30" y="60" fontSize="40" fill="white" opacity="0.5">&#9875;</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#anchor-pattern)" />
        </svg>
      </div>

      <Navigation />

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50vw',
                  y: '40vh',
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1, 1, 0.5],
                  rotate: Math.random() * 720 - 360,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: 'easeOut',
                }}
                className="absolute w-3 h-3"
                style={{
                  backgroundColor: [
                    '#D4AF37',
                    '#FF2D78',
                    '#00D4FF',
                    '#BFFF00',
                    '#FF6B35',
                    '#FFF8E7',
                  ][i % 6],
                  borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0%' : '2px',
                }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.5, type: 'spring', damping: 15 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <PartyPopper className="w-16 h-16 text-gold mx-auto mb-4" />
                <h2 className="font-display text-5xl md:text-7xl text-gold tracking-wider neon-gold">
                  LAUNCHED!
                </h2>
                <p className="font-body text-lg text-cream/80 mt-2">
                  Your vessel is now part of the Prestige Worldwide fleet
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-6xl md:text-8xl text-gold tracking-wider gold-shimmer">
            LIST YOUR VESSEL
          </h1>
          <p className="font-body text-cream/60 mt-2 flex items-center justify-center gap-2">
            <Anchor className="w-4 h-4" />
            Join the Prestige Worldwide fleet
            <Anchor className="w-4 h-4" />
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            {stepLabels.map((label, index) => (
              <button
                key={label}
                onClick={() => setCurrentStep(index)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-full brutal-border flex items-center justify-center font-display text-lg transition-all ${
                    index < currentStep
                      ? 'bg-gold text-navy'
                      : index === currentStep
                      ? 'bg-hot-pink text-white border-hot-pink'
                      : 'bg-ocean/30 text-cream/40'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`font-body text-[10px] tracking-wide hidden sm:block ${
                    index <= currentStep ? 'text-gold' : 'text-cream/30'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
          <div className="w-full h-3 bg-ocean/30 brutal-border overflow-hidden">
            <motion.div
              className="h-full bg-gold"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Boat Basics */}
          {currentStep === 0 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="brutal-card bg-ocean/20 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Ship className="w-7 h-7 text-gold" />
                <h2 className="font-display text-3xl text-gold tracking-wider">
                  BOAT BASICS
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="font-display text-sm text-cream/80 tracking-wider block mb-2">
                    VESSEL NAME
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. The Prestige"
                    className="w-full px-4 py-3 bg-cream text-navy font-body text-sm placeholder:text-navy/40 border-[3px] border-navy focus:outline-none focus:ring-3 focus:ring-gold transition-all"
                  />
                </div>

                <div>
                  <label className="font-display text-sm text-cream/80 tracking-wider block mb-2">
                    BOAT TYPE
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => updateField('type', e.target.value)}
                    className="w-full px-4 py-3 bg-cream text-navy font-body text-sm border-[3px] border-navy focus:outline-none focus:ring-3 focus:ring-gold transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Select a type...</option>
                    {boatTypes.map((bt) => (
                      <option key={bt.value} value={bt.value}>
                        {bt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="font-display text-sm text-cream/80 tracking-wider block mb-2">
                      YEAR
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => updateField('year', e.target.value)}
                      placeholder="2024"
                      className="w-full px-4 py-3 bg-cream text-navy font-body text-sm placeholder:text-navy/40 border-[3px] border-navy focus:outline-none focus:ring-3 focus:ring-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-display text-sm text-cream/80 tracking-wider block mb-2">
                      LENGTH (FT)
                    </label>
                    <input
                      type="number"
                      value={formData.length}
                      onChange={(e) => updateField('length', e.target.value)}
                      placeholder="45"
                      className="w-full px-4 py-3 bg-cream text-navy font-body text-sm placeholder:text-navy/40 border-[3px] border-navy focus:outline-none focus:ring-3 focus:ring-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-display text-sm text-cream/80 tracking-wider block mb-2">
                      CAPACITY
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => updateField('capacity', e.target.value)}
                      placeholder="12"
                      className="w-full px-4 py-3 bg-cream text-navy font-body text-sm placeholder:text-navy/40 border-[3px] border-navy focus:outline-none focus:ring-3 focus:ring-gold transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Description & Amenities */}
          {currentStep === 1 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="brutal-card bg-ocean/20 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-7 h-7 text-gold" />
                <h2 className="font-display text-3xl text-gold tracking-wider">
                  DETAILS &amp; AMENITIES
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="font-display text-sm text-cream/80 tracking-wider block mb-2">
                    DESCRIPTION
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Tell the world about your vessel... Make it sound legendary."
                    rows={5}
                    className="w-full px-4 py-3 bg-cream text-navy font-body text-sm placeholder:text-navy/40 border-[3px] border-navy focus:outline-none focus:ring-3 focus:ring-gold transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="font-display text-sm text-cream/80 tracking-wider block mb-3">
                    AMENITIES
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {amenityOptions.map((amenity) => {
                      const isSelected = formData.amenities.includes(amenity);
                      return (
                        <motion.button
                          key={amenity}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-3 py-1.5 font-body text-xs font-semibold tracking-wide brutal-border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gold text-navy brutal-shadow-sm'
                              : 'bg-ocean/30 text-cream/60 hover:bg-ocean/50 hover:text-cream'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                          {amenity}
                        </motion.button>
                      );
                    })}
                  </div>
                  {formData.amenities.length > 0 && (
                    <p className="font-body text-xs text-gold/60 mt-2">
                      {formData.amenities.length} amenities selected
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 2 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="brutal-card bg-ocean/20 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-7 h-7 text-gold" />
                <h2 className="font-display text-3xl text-gold tracking-wider">
                  SET YOUR RATE
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-display text-sm text-cream/80 tracking-wider block mb-2">
                    HOURLY RATE (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold" />
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => updateField('hourlyRate', e.target.value)}
                      placeholder="500"
                      className="w-full pl-14 pr-6 py-5 bg-cream text-navy font-display text-4xl placeholder:text-navy/20 border-[3px] border-gold focus:outline-none focus:ring-3 focus:ring-gold transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-navy/40">
                      /hour
                    </span>
                  </div>
                </div>

                {formData.hourlyRate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass-dark rounded-lg p-5 brutal-border"
                  >
                    <h3 className="font-display text-lg text-gold tracking-wider mb-3">
                      EARNINGS ESTIMATE
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="font-display text-2xl text-cream">
                          ${(parseInt(formData.hourlyRate) * 3).toLocaleString() || 0}
                        </p>
                        <p className="font-body text-[10px] text-cream/40 mt-1">
                          3HR CRUISE
                        </p>
                      </div>
                      <div>
                        <p className="font-display text-2xl text-gold">
                          ${(parseInt(formData.hourlyRate) * 8).toLocaleString() || 0}
                        </p>
                        <p className="font-body text-[10px] text-cream/40 mt-1">
                          FULL DAY
                        </p>
                      </div>
                      <div>
                        <p className="font-display text-2xl text-electric-blue">
                          ${(parseInt(formData.hourlyRate) * 8 * 4).toLocaleString() || 0}
                        </p>
                        <p className="font-body text-[10px] text-cream/40 mt-1">
                          PER MONTH (EST)
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 3 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="brutal-card bg-ocean/20 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-7 h-7 text-gold" />
                <h2 className="font-display text-3xl text-gold tracking-wider">
                  SHOW IT OFF
                </h2>
              </div>

              <div className="space-y-5">
                {/* Drag and drop area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={addMockPhoto}
                  className={`border-[3px] border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-gold bg-gold/10 scale-[1.02]'
                      : 'border-cream/20 hover:border-gold/50 hover:bg-ocean/20'
                  }`}
                >
                  <Upload
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDragOver ? 'text-gold' : 'text-cream/30'
                    }`}
                  />
                  <p className="font-display text-xl text-cream/60 tracking-wider mb-1">
                    DRAG &amp; DROP PHOTOS HERE
                  </p>
                  <p className="font-body text-sm text-cream/30">
                    or click to browse -- PNG, JPG up to 10MB each
                  </p>
                </div>

                {/* Photo grid */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.photos.map((photo, index) => (
                      <motion.div
                        key={photo}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square bg-ocean/40 brutal-border rounded-md flex items-center justify-center relative overflow-hidden group"
                      >
                        <Waves className="w-8 h-8 text-cream/20" />
                        <span className="font-display text-xs text-cream/40 absolute bottom-2">
                          Photo {index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index),
                            }));
                          }}
                          className="absolute top-1 right-1 w-6 h-6 bg-hot-pink text-white rounded-full flex items-center justify-center font-body text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          x
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <p className="font-body text-xs text-cream/30 text-center">
                  {formData.photos.length} photo{formData.photos.length !== 1 ? 's' : ''} added
                  {formData.photos.length === 0 && ' -- add at least 2 for best results'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 5: Location */}
          {currentStep === 4 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="brutal-card bg-ocean/20 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-7 h-7 text-gold" />
                <h2 className="font-display text-3xl text-gold tracking-wider">
                  DOCK LOCATION
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="font-display text-sm text-cream/80 tracking-wider block mb-2">
                    WHERE IS YOUR BOAT DOCKED?
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="e.g. Marina Del Rey, CA"
                      className="w-full pl-12 pr-4 py-3 bg-cream text-navy font-body text-sm placeholder:text-navy/40 border-[3px] border-navy focus:outline-none focus:ring-3 focus:ring-gold transition-all"
                    />
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="w-full h-48 bg-ocean/30 brutal-border rounded-md flex flex-col items-center justify-center gap-2">
                  <MapPin className="w-10 h-10 text-cream/20" />
                  <p className="font-body text-sm text-cream/30">Map integration coming soon</p>
                  <p className="font-script text-xs text-gold/30">Prestige Worldwide GPS</p>
                </div>

                {/* Summary */}
                <div className="glass-dark rounded-lg p-5 brutal-border">
                  <h3 className="font-display text-lg text-gold tracking-wider mb-4">
                    VESSEL SUMMARY
                  </h3>
                  <div className="space-y-2 font-body text-sm text-cream/70">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="text-cream">{formData.name || '--'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="text-cream capitalize">{formData.type || '--'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Year / Length:</span>
                      <span className="text-cream">
                        {formData.year || '--'} / {formData.length ? `${formData.length}ft` : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="text-cream">
                        {formData.capacity ? `${formData.capacity} guests` : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="text-gold font-semibold">
                        {formData.hourlyRate ? `$${formData.hourlyRate}/hr` : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amenities:</span>
                      <span className="text-cream">
                        {formData.amenities.length > 0
                          ? `${formData.amenities.length} selected`
                          : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Photos:</span>
                      <span className="text-cream">{formData.photos.length} uploaded</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="text-cream">{formData.location || '--'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mt-6 gap-4"
        >
          {currentStep > 0 ? (
            <motion.button
              whileHover={{ scale: 1.03, x: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 bg-ocean/40 text-cream font-display text-xl tracking-wider brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              BACK
            </motion.button>
          ) : (
            <div />
          )}

          {currentStep < stepLabels.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.03, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-gold text-navy font-display text-xl tracking-wider brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
            >
              NEXT
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="flex items-center gap-3 px-10 py-4 bg-gold text-navy font-display text-2xl tracking-wider brutal-border brutal-shadow-lg hover:bg-hot-pink hover:text-white hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all cursor-pointer"
            >
              <Ship className="w-6 h-6" />
              LAUNCH YOUR BOAT
              <Sparkles className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
