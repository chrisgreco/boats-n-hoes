'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Heart, MessageCircle, Bot, User, Menu, X, Ship } from 'lucide-react';

const navLinks = [
  { href: '/boats', label: 'BOATS', icon: Ship, color: 'bg-electric-blue' },
  { href: '/dating', label: 'DATING', icon: Heart, color: 'bg-hot-pink' },
  { href: '/chat', label: 'CHAT', icon: MessageCircle, color: 'bg-lime' },
  { href: '/concierge', label: 'AI CONCIERGE', icon: Bot, color: 'bg-gold' },
  { href: '/profile', label: 'PROFILE', icon: User, color: 'bg-sunset' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy border-b-[4px] border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Anchor className="w-8 h-8 text-gold" />
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl text-gold tracking-wider">
                  BOATS N&apos; HOES
                </span>
                <span className="font-script text-[10px] text-electric-blue tracking-wide">
                  A Prestige Worldwide Production
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-cream/80 hover:text-cream font-body text-sm font-medium tracking-wide transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </motion.div>
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-[3px] ${link.color} origin-left`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              ))}
              <Link href="/post-boat">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-2 px-4 py-1.5 bg-gold text-navy font-display text-lg tracking-wider brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  LIST YOUR BOAT
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gold p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Ticker Bar */}
        <div className="bg-hot-pink overflow-hidden h-6 flex items-center">
          <div className="animate-marquee whitespace-nowrap flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="text-white font-display text-sm tracking-widest mx-8">
                PRESTIGE WORLDWIDE - THE FIRST WORD IN ENTERTAINMENT - BOATS N&apos; HOES -
                MANAGEMENT - FINANCIAL PORTFOLIOS - INSURANCE - COMPUTERS -
                BLACK LEATHER GLOVES - RESEARCH AND DEVELOPMENT - SECURITY -
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-navy pt-24 px-6"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 p-4 ${link.color} text-navy font-display text-3xl tracking-wider brutal-border brutal-shadow-sm`}
                  >
                    <link.icon className="w-8 h-8" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Link
                  href="/post-boat"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 bg-gold text-navy font-display text-3xl tracking-wider brutal-border brutal-shadow-sm"
                >
                  <Anchor className="w-8 h-8" />
                  LIST YOUR BOAT
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-[88px]" />
    </>
  );
}
