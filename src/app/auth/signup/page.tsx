'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Anchor,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Ship,
  PartyPopper,
  Heart,
  Sparkles,
} from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isBoatOwner, setIsBoatOwner] = useState(false);
  const [lookingFor, setLookingFor] = useState<string>('both');
  const [gender, setGender] = useState<string>('');

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden flex items-center justify-center px-4 py-8 vhs-effect">
      {/* Animated wave background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 w-[200%] wave-animate"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
        >
          <path
            fill="var(--ocean)"
            fillOpacity="0.4"
            d="M0,192L60,186.7C120,181,240,171,360,186.7C480,203,600,245,720,250.7C840,256,960,224,1080,202.7C1200,181,1320,171,1440,176C1560,181,1680,203,1800,213.3C1920,224,2040,224,2160,213.3C2280,203,2400,181,2520,181.3C2640,181,2760,203,2820,213.3L2880,224L2880,320L2820,320C2760,320,2640,320,2520,320C2400,320,2280,320,2160,320C2040,320,1920,320,1800,320C1680,320,1560,320,1440,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-[200%] wave-animate"
          style={{ animationDelay: '-2s', animationDuration: '8s' }}
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
        >
          <path
            fill="var(--deep-purple)"
            fillOpacity="0.3"
            d="M0,256L60,250.7C120,245,240,235,360,213.3C480,192,600,160,720,165.3C840,171,960,213,1080,234.7C1200,256,1320,256,1440,240C1560,224,1680,192,1800,186.7C1920,181,2040,203,2160,218.7C2280,235,2400,245,2520,240C2640,235,2760,213,2820,202.7L2880,192L2880,320L2820,320C2760,320,2640,320,2520,320C2400,320,2280,320,2160,320C2040,320,1920,320,1800,320C1680,320,1560,320,1440,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>

        {/* Floating anchor decorations */}
        <motion.div
          className="absolute top-[8%] right-[8%] text-gold/10"
          animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <Anchor className="w-20 h-20" />
        </motion.div>
        <motion.div
          className="absolute bottom-[25%] left-[5%] text-electric-blue/10"
          animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: 'easeInOut',
            delay: 1.5,
          }}
        >
          <Ship className="w-24 h-24" />
        </motion.div>
      </div>

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-cream brutal-border p-8"
        style={{ boxShadow: '10px 10px 0px var(--navy), 10px 10px 0px 3px var(--hot-pink)' }}
      >
        {/* Title */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Anchor className="w-12 h-12 text-hot-pink" />
          </motion.div>
          <h1 className="font-display text-5xl text-navy tracking-wider mt-2">
            JOIN THE CREW
          </h1>
          <p className="font-script text-sm text-hot-pink mt-1">
            A Prestige Worldwide Production
          </p>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
              FULL NAME
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Brennan Huff"
                className="w-full pl-11 pr-4 py-3 bg-white brutal-border font-body text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-hot-pink"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@prestigeworldwide.com"
                className="w-full pl-11 pr-4 py-3 bg-white brutal-border font-body text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-hot-pink"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-11 pr-12 py-3 bg-white brutal-border font-body text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-hot-pink"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full pl-11 pr-12 py-3 bg-white brutal-border font-body text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-hot-pink"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Boat Owner Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-ocean" />
              <span className="font-display text-sm text-navy tracking-wider">
                ARE YOU A BOAT OWNER?
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsBoatOwner(!isBoatOwner)}
              className={`relative w-14 h-7 brutal-border transition-colors ${
                isBoatOwner ? 'bg-lime' : 'bg-white'
              }`}
            >
              <motion.div
                animate={{ x: isBoatOwner ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-5 h-5 bg-navy brutal-border"
              />
            </button>
          </div>

          {/* Looking For - Radio Buttons */}
          <div>
            <label className="font-display text-sm text-navy/60 tracking-wider block mb-2">
              WHAT ARE YOU LOOKING FOR?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  value: 'boat_party',
                  label: 'Boat Parties',
                  icon: PartyPopper,
                  color: 'bg-electric-blue',
                },
                {
                  value: 'dating',
                  label: 'Dating',
                  icon: Heart,
                  color: 'bg-hot-pink',
                },
                {
                  value: 'both',
                  label: 'Both',
                  icon: Sparkles,
                  color: 'bg-gold',
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLookingFor(option.value)}
                  className={`flex flex-col items-center gap-1 p-3 brutal-border text-center transition-all ${
                    lookingFor === option.value
                      ? `${option.color} text-navy brutal-shadow-sm`
                      : 'bg-white text-navy/60 hover:bg-cream'
                  }`}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="font-display text-xs tracking-wider">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Gender Select */}
          <div>
            <label className="font-display text-sm text-navy/60 tracking-wider block mb-1">
              GENDER
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 bg-white brutal-border font-body text-navy focus:outline-none focus:ring-2 focus:ring-hot-pink appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-hot-pink text-white font-display text-2xl tracking-widest brutal-border brutal-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all mt-2"
          >
            LAUNCH INTO THE OCEAN
          </motion.button>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="font-body text-sm text-navy/50">
            Already have an account?{' '}
          </span>
          <Link
            href="/auth/login"
            className="font-display text-sm text-gold tracking-wider hover:underline"
          >
            BOARD THE SHIP
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
