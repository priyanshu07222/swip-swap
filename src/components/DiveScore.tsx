"use client";

import React from "react";
import { motion } from "framer-motion";

interface DiveResult {
  score: number;
  tier: string;
  feePercentage: number;
  style?: string;
  angle?: number;
  rotations?: number;
}

interface DiveScoreProps {
  diveHeight: number;
  onDiveHeightChange: (height: number) => void;
  diveResult: DiveResult | null;
}

export function DiveScore({
  diveHeight,
  onDiveHeightChange,
  diveResult,
}: DiveScoreProps) {
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
              background: `linear-gradient(to right, ${getHeightColor(
                diveHeight
              )
                .replace("from-", "")
                .replace(" to-", ", ")})`,
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

      {/* Advanced Dive Result Display */}
      {diveResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-4 border border-white/30"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              {diveResult.score}/100
              {diveResult.score >= 90 && "🏆"}
              {diveResult.score >= 80 && diveResult.score < 90 && "🥇"}
              {diveResult.score >= 70 && diveResult.score < 80 && "🥈"}
              {diveResult.score >= 60 && diveResult.score < 70 && "🥉"}
            </div>
            <div className="text-white/90 font-semibold mb-3 text-lg">
              {diveResult.tier}
            </div>

            {/* Style breakdown */}
            {diveResult.style && (
              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div className="bg-blue-500/20 rounded-lg p-2 border border-blue-400/30">
                  <div className="text-blue-200 font-semibold">Style</div>
                  <div className="text-white">
                    {diveResult.style.replace("_", " ")}
                  </div>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-2 border border-purple-400/30">
                  <div className="text-purple-200 font-semibold">Fee</div>
                  <div className="text-white">
                    {diveResult.feePercentage.toFixed(2)}%
                  </div>
                </div>
                {diveResult.rotations !== undefined && (
                  <div className="bg-green-500/20 rounded-lg p-2 border border-green-400/30">
                    <div className="text-green-200 font-semibold">
                      Rotations
                    </div>
                    <div className="text-white">
                      {diveResult.rotations.toFixed(1)}
                    </div>
                  </div>
                )}
                {diveResult.angle !== undefined && (
                  <div className="bg-orange-500/20 rounded-lg p-2 border border-orange-400/30">
                    <div className="text-orange-200 font-semibold">
                      Entry Angle
                    </div>
                    <div className="text-white">
                      {diveResult.angle.toFixed(1)}°
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Fee impact indicator */}
            <div
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                diveResult.feePercentage <= 0.5
                  ? "bg-green-500/20 text-green-200"
                  : diveResult.feePercentage <= 1.0
                  ? "bg-yellow-500/20 text-yellow-200"
                  : "bg-red-500/20 text-red-200"
              }`}
            >
              {diveResult.feePercentage <= 0.5
                ? "🎉 Excellent! Low fees!"
                : diveResult.feePercentage <= 1.0
                ? "👍 Good dive, normal fees"
                : "💸 Practice more for better fees"}
            </div>
          </div>
        </motion.div>
      )}

      {/* Advanced Instructions */}
      <div className="text-white/70 text-sm mt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-blue-300 font-semibold">🏊‍♂️ Swan Dive</div>
            <div>Drag wide + high for style bonus</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-cyan-300 font-semibold">💣 Cannonball</div>
            <div>Drag wide for maximum splash</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-green-300 font-semibold">📏 Straight</div>
            <div>Drag straight up for precision</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-red-300 font-semibold">🤕 Belly Flop</div>
            <div>Poor form = higher fees!</div>
          </div>
        </div>
        <p className="text-center">
          🎯 Master different styles to minimize swap fees!
        </p>
      </div>
    </div>
  );
}
