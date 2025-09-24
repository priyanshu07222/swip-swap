'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  address: string;
  score: number;
  tier: string;
  timestamp: number;
}

interface LeaderboardProps {
  newEntry?: LeaderboardEntry;
}

export function Leaderboard({ newEntry }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load leaderboard from localStorage
    const saved = localStorage.getItem('swimswap-leaderboard');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (newEntry) {
      const updatedEntries = [...entries, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep top 10
      
      setEntries(updatedEntries);
      localStorage.setItem('swimswap-leaderboard', JSON.stringify(updatedEntries));
    }
  }, [newEntry, entries]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case 'Perfect Dive': return '🥇';
      case 'Great Dive': return '🥈';
      case 'Good Dive': return '🥉';
      case 'Splash Dive': return '💦';
      case 'Belly Flop': return '🤕';
      default: return '🏊‍♂️';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Perfect Dive': return 'text-yellow-300';
      case 'Great Dive': return 'text-gray-300';
      case 'Good Dive': return 'text-amber-600';
      case 'Splash Dive': return 'text-blue-300';
      case 'Belly Flop': return 'text-red-300';
      default: return 'text-white';
    }
  };

  return (
    <div className="fixed top-4 left-4 z-20">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white font-semibold hover:bg-white/20 transition-all duration-200"
      >
        🏆 Leaderboard
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-80 max-w-96"
          >
            <h3 className="text-white font-bold text-lg mb-4 text-center">
              🏊‍♂️ Best Divers Today
            </h3>

            {entries.length === 0 ? (
              <div className="text-white/70 text-center py-8">
                <p>No dives yet!</p>
                <p className="text-sm">Be the first to dive! 🏊‍♂️</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {entries.map((entry, index) => (
                  <motion.div
                    key={`${entry.address}-${entry.timestamp}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                      index === 1 ? 'bg-gray-400/20 border border-gray-400/30' :
                      index === 2 ? 'bg-amber-600/20 border border-amber-600/30' :
                      'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-white font-bold text-lg">
                        #{index + 1}
                      </div>
                      <div className="text-2xl">
                        {getTierEmoji(entry.tier)}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {formatAddress(entry.address)}
                        </div>
                        <div className={`text-sm ${getTierColor(entry.tier)}`}>
                          {entry.tier}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">
                        {entry.score}
                      </div>
                      <div className="text-white/70 text-xs">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-white/70 text-xs text-center">
                <p>💡 Higher scores = Lower fees!</p>
                <p>🎯 Aim for the center of the pool</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
