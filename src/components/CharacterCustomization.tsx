"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface CharacterConfig {
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  specialAbility: string;
  feeBonus: number;
}

const CHARACTERS: CharacterConfig[] = [
  {
    name: "Pro Swimmer",
    emoji: "🏊‍♂️",
    colors: { primary: "#3B82F6", secondary: "#1E40AF", accent: "#60A5FA" },
    specialAbility: "Perfect form reduces fees",
    feeBonus: 0.9, // 10% fee reduction
  },
  {
    name: "Daredevil Diver",
    emoji: "🤸‍♂️",
    colors: { primary: "#EF4444", secondary: "#DC2626", accent: "#F87171" },
    specialAbility: "High risk, high reward",
    feeBonus: 0.8, // 20% fee reduction on perfect dives
  },
  {
    name: "Olympic Champion",
    emoji: "🏆",
    colors: { primary: "#F59E0B", secondary: "#D97706", accent: "#FCD34D" },
    specialAbility: "Bonus points for style",
    feeBonus: 0.85, // 15% fee reduction
  },
  {
    name: "Water Spirit",
    emoji: "🧜‍♀️",
    colors: { primary: "#06B6D4", secondary: "#0891B2", accent: "#67E8F9" },
    specialAbility: "Natural water affinity",
    feeBonus: 0.9, // 10% fee reduction
  },
  {
    name: "Ninja Diver",
    emoji: "🥷",
    colors: { primary: "#6B7280", secondary: "#374151", accent: "#9CA3AF" },
    specialAbility: "Stealth splash reduces fees",
    feeBonus: 0.88, // 12% fee reduction
  },
  {
    name: "Party Swimmer",
    emoji: "🏖️",
    colors: { primary: "#EC4899", secondary: "#DB2777", accent: "#F9A8D4" },
    specialAbility: "Fun vibes boost performance",
    feeBonus: 0.95, // 5% fee reduction
  },
];

interface CharacterCustomizationProps {
  selectedCharacter: CharacterConfig;
  onCharacterSelect: (character: CharacterConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CharacterCustomization({
  selectedCharacter,
  onCharacterSelect,
  isOpen,
  onClose,
}: CharacterCustomizationProps) {
  const [hoveredCharacter, setHoveredCharacter] =
    useState<CharacterConfig | null>(null);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-blue-900/90 to-cyan-900/90 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            🏊‍♂️ Choose Your Swimmer
          </h2>
          <p className="text-white/80">
            Each character has unique abilities that affect your swap fees!
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {CHARACTERS.map((character) => (
            <motion.div
              key={character.name}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                selectedCharacter.name === character.name
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
              }`}
              style={{
                background:
                  selectedCharacter.name === character.name
                    ? `linear-gradient(135deg, ${character.colors.primary}20, ${character.colors.secondary}20)`
                    : undefined,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCharacterSelect(character)}
              onMouseEnter={() => setHoveredCharacter(character)}
              onMouseLeave={() => setHoveredCharacter(null)}
            >
              {/* Character Avatar */}
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{character.emoji}</div>
                <h3 className="font-bold text-white text-lg">
                  {character.name}
                </h3>
              </div>

              {/* Character Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Fee Bonus:</span>
                  <span
                    className="font-semibold px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: `${character.colors.primary}40`,
                      color: character.colors.accent,
                    }}
                  >
                    {Math.round((1 - character.feeBonus) * 100)}% off
                  </span>
                </div>
                <div className="text-white/60 text-xs">
                  {character.specialAbility}
                </div>
              </div>

              {/* Color Preview */}
              <div className="flex justify-center gap-1 mt-4">
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: character.colors.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: character.colors.secondary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: character.colors.accent }}
                />
              </div>

              {/* Selected Indicator */}
              {selectedCharacter.name === character.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 text-yellow-400 text-xl"
                >
                  ✨
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Character Preview */}
        {hoveredCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{hoveredCharacter.emoji}</div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  {hoveredCharacter.name}
                </h4>
                <p className="text-white/80">
                  {hoveredCharacter.specialAbility}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-white/60 text-sm">Fee Reduction</div>
                <div className="text-white font-bold">
                  {Math.round((1 - hoveredCharacter.feeBonus) * 100)}%
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Rarity</div>
                <div className="text-white font-bold">
                  {hoveredCharacter.feeBonus <= 0.8
                    ? "Legendary"
                    : hoveredCharacter.feeBonus <= 0.9
                    ? "Rare"
                    : "Common"}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Style Bonus</div>
                <div className="text-white font-bold">
                  {hoveredCharacter.name.includes("Olympic")
                    ? "+15%"
                    : hoveredCharacter.name.includes("Daredevil")
                    ? "+20%"
                    : "+10%"}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Current Selection */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{selectedCharacter.emoji}</div>
              <div>
                <h4 className="text-white font-bold">
                  Currently Selected: {selectedCharacter.name}
                </h4>
                <p className="text-white/70 text-sm">
                  {selectedCharacter.specialAbility}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Let's Dive! 🏊‍♂️
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export { CHARACTERS };
