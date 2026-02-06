'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Anchor, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden flex items-center justify-center px-4 vhs-effect">
      {/* Animated wave background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Bottom waves */}
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
          className="absolute top-[10%] left-[8%] text-gold/10"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <Anchor className="w-24 h-24" />
        </motion.div>
        <motion.div
          className="absolute top-[20%] right-[10%] text-hot-pink/10"
          animate={{ y: [0, -15, 0], rotate: [0, -8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
            delay: 1,
          }}
        >
          <Anchor className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] left-[5%] text-electric-blue/10"
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: 'easeInOut',
            delay: 2,
          }}
        >
          <Anchor className="w-20 h-20" />
        </motion.div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-cream brutal-border p-8"
        style={{ boxShadow: '10px 10px 0px var(--navy), 10px 10px 0px 3px var(--gold)' }}
      >
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Anchor className="w-14 h-14 text-gold" />
          </motion.div>
          <h1 className="font-display text-5xl text-navy tracking-wider mt-3">
            BOATS N&apos; HOES
          </h1>
          <p className="font-script text-sm text-hot-pink mt-1">
            A Prestige Worldwide Production
          </p>
        </div>

        {/* Email Input */}
        <div className="space-y-4">
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
                placeholder="brennan@prestigeworldwide.com"
                className="w-full pl-11 pr-4 py-3 bg-white brutal-border font-body text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          {/* Password Input */}
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
                placeholder="Enter your password"
                className="w-full pl-11 pr-12 py-3 bg-white brutal-border font-body text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold"
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

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-gold text-navy font-display text-2xl tracking-widest brutal-border brutal-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all mt-2"
          >
            BOARD THE SHIP
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[3px] bg-navy/10" />
          <span className="font-body text-sm text-navy/40 font-medium">
            Or continue with
          </span>
          <div className="flex-1 h-[3px] bg-navy/10" />
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-3 bg-white brutal-border font-display text-lg text-navy tracking-wider hover:bg-cream transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            GOOGLE
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-3 bg-white brutal-border font-display text-lg text-navy tracking-wider hover:bg-cream transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            APPLE
          </motion.button>
        </div>

        {/* Signup Link */}
        <div className="text-center mt-8">
          <span className="font-body text-sm text-navy/50">
            Don&apos;t have an account?{' '}
          </span>
          <Link
            href="/auth/signup"
            className="font-display text-sm text-hot-pink tracking-wider hover:underline"
          >
            JOIN THE CREW
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
