'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiveResult {
  score: number;
  tier: string;
  feePercentage: number;
}

interface SplashEffectProps {
  diveResult: DiveResult | null;
}

export function SplashEffect({ diveResult }: SplashEffectProps) {
  if (!diveResult) return null;

  const getSplashSize = () => {
    if (diveResult.score >= 80) return 'large';
    if (diveResult.score >= 60) return 'medium';
    if (diveResult.score >= 40) return 'small';
    return 'tiny';
  };

  const getSplashColor = () => {
    if (diveResult.score >= 80) return 'from-blue-200 to-white';
    if (diveResult.score >= 60) return 'from-cyan-200 to-blue-100';
    if (diveResult.score >= 40) return 'from-blue-100 to-cyan-100';
    return 'from-gray-200 to-gray-100';
  };

  const splashSize = getSplashSize();
  const splashColor = getSplashColor();

  const sizeClasses = {
    large: 'w-32 h-32',
    medium: 'w-24 h-24',
    small: 'w-16 h-16',
    tiny: 'w-12 h-12'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {/* Main splash */}
        <motion.div
          initial={{ scale: 0, y: 0 }}
          animate={{ scale: 1, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`${sizeClasses[splashSize]} bg-gradient-to-b ${splashColor} rounded-full opacity-80`}
        />
        
        {/* Ripple effects */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2 + i * 0.5, opacity: 0 }}
            transition={{ 
              duration: 0.8 + i * 0.2, 
              delay: i * 0.1,
              ease: "easeOut" 
            }}
            className={`absolute w-16 h-16 border-2 border-white/50 rounded-full`}
          />
        ))}
        
        {/* Score display */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -60, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute text-white font-bold text-lg drop-shadow-lg"
        >
          {diveResult.score}!
        </motion.div>
        
        {/* Tier display */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -80, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute text-white/90 font-semibold text-sm drop-shadow-lg"
        >
          {diveResult.tier}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
