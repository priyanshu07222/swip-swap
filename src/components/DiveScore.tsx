'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DiveResult {
  score: number;
  tier: string;
  feePercentage: number;
}

interface DiveScoreProps {
  diveHeight: number;
  onDiveHeightChange: (height: number) => void;
  diveResult: DiveResult | null;
}

export function DiveScore({ diveHeight, onDiveHeightChange, diveResult }: DiveScoreProps) {
  const getHeightLabel = (height: number) => {
    if (height >= 90) return "Olympic Dive";
    if (height >= 70) return "High Dive";
    if (height >= 50) return "Medium Dive";
    if (height >= 30) return "Low Dive";
    return "Belly Flop";
  };

  const getHeightColor = (height: number) => {
    if (height >= 80) return "from-green-400 to-green-600";
    if (height >= 60) return "from-yellow-400 to-yellow-600";
    if (height >= 40) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-white font-bold text-lg mb-4">🎯 Dive Power</h3>
      
      {/* Height Slider */}
      <div className="mb-4">
        <div className="flex justify-between text-white/80 text-sm mb-2">
          <span>Low Power</span>
          <span className="font-semibold">{getHeightLabel(diveHeight)}</span>
          <span>High Power</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={diveHeight}
            onChange={(e) => onDiveHeightChange(Number(e.target.value))}
            className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${getHeightColor(diveHeight).replace('from-', '').replace(' to-', ', ')})`
            }}
          />
          
          {/* Power meter visualization */}
          <motion.div
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg opacity-30"
            style={{ width: `${diveHeight}%` }}
            animate={{ width: `${diveHeight}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        
        <div className="text-center text-white/70 text-sm mt-2">
          Power: {diveHeight}%
        </div>
      </div>

      {/* Dive Result Display */}
      {diveResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 rounded-xl p-4 border border-white/30"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">
              {diveResult.score}/100
            </div>
            <div className="text-white/90 font-semibold mb-2">
              {diveResult.tier}
            </div>
            <div className="text-sm text-white/80">
              Fee: {diveResult.feePercentage}%
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="text-white/70 text-sm mt-4">
        <p>💡 Higher dive = Lower fees!</p>
        <p>🎯 Aim for the center of the pool</p>
      </div>
    </div>
  );
}
