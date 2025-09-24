"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { SplashEffect } from "./SplashEffect";
import { DiveScore } from "./DiveScore";
import { SwapInterface } from "./SwapInterface";
import { Leaderboard } from "./Leaderboard";
import { GameCharacter } from "./GameCharacter";
import {
  CharacterCustomization,
  CHARACTERS,
  type CharacterConfig,
} from "./CharacterCustomization";

interface DiveResult {
  score: number;
  tier: string;
  feePercentage: number;
  style?: string;
  angle?: number;
  rotations?: number;
}

export function SwimmingPool() {
  const { isConnected, address } = useAccount();
  const [diveResult, setDiveResult] = useState<DiveResult | null>(null);
  const [isDiving, setIsDiving] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [diveHeight, setDiveHeight] = useState(50);
  const [leaderboardEntry, setLeaderboardEntry] = useState<any>(null);
  const [amountIn, setAmountIn] = useState("");
  const [poolDimensions, setPoolDimensions] = useState({
    x: 0,
    y: 0,
    width: 320,
    height: 320,
  });
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterConfig>(
    CHARACTERS[0]
  );
  const [showCharacterCustomization, setShowCharacterCustomization] =
    useState(false);

  const poolRef = useRef<HTMLDivElement>(null);

  const handleGameDive = useCallback(
    (result: DiveResult) => {
      // Apply character fee bonus
      const modifiedResult = {
        ...result,
        feePercentage: result.feePercentage * selectedCharacter.feeBonus,
      };

      setDiveResult(modifiedResult);
      setIsDiving(true);
      setShowSplash(true);

      // Add to leaderboard if connected
      if (address) {
        setLeaderboardEntry({
          address,
          score: modifiedResult.score,
          tier: modifiedResult.tier,
          style: modifiedResult.style || "Unknown",
          character: selectedCharacter.name,
          timestamp: Date.now(),
        });
      }

      // Reset after animation
      setTimeout(() => {
        setIsDiving(false);
        setShowSplash(false);
      }, 2000);
    },
    [address, selectedCharacter]
  );

  // Update pool dimensions when pool ref changes
  useEffect(() => {
    if (poolRef.current) {
      const rect = poolRef.current.getBoundingClientRect();
      setPoolDimensions({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">🏊‍♂️ SwimSwap</h1>
          <p className="text-xl text-blue-100 mb-8">
            Connect your wallet to start diving!
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 right-4 z-10">
        <ConnectButton />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-white">🏊‍♂️ SwimSwap</h1>
      </div>

      {/* Leaderboard */}
      {isConnected && <Leaderboard newEntry={leaderboardEntry} />}

      {/* Flow Indicator */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
          <div className="flex items-center gap-4 text-white text-sm">
            <div
              className={`flex items-center gap-2 ${
                amountIn ? "text-green-300" : "text-white/50"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-xs">
                1
              </span>
              Enter Amount
            </div>
            <div className="w-8 h-0.5 bg-white/30"></div>
            <div
              className={`flex items-center gap-2 ${
                diveResult ? "text-green-300" : "text-white/50"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-xs">
                2
              </span>
              Dive into Pool
            </div>
            <div className="w-8 h-0.5 bg-white/30"></div>
            <div
              className={`flex items-center gap-2 ${
                diveResult ? "text-green-300" : "text-white/50"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-xs">
                3
              </span>
              Execute Swap
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-8 pt-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Swimming Pool Arena */}
          <div className="relative">
            <motion.div
              ref={poolRef}
              className="w-80 h-80 relative"
              animate={showSplash ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* 3D Pool Structure */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-2xl" />

              {/* Pool Inner Basin */}
              <div className="absolute inset-2 bg-gradient-to-b from-cyan-200 to-blue-600 rounded-full shadow-inner overflow-hidden border-4 border-blue-200">
                {/* Animated Water Surface */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/80 to-blue-500/90 rounded-full animate-pulse" />

                {/* Water Ripples */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-white/20 rounded-full animate-bounce"
                    style={{ animationDelay: "0s", animationDuration: "3s" }}
                  />
                  <div
                    className="absolute top-8 left-1/3 w-24 h-1 bg-white/15 rounded-full animate-bounce"
                    style={{ animationDelay: "1s", animationDuration: "4s" }}
                  />
                  <div
                    className="absolute top-12 right-1/3 w-28 h-1 bg-white/10 rounded-full animate-bounce"
                    style={{ animationDelay: "2s", animationDuration: "5s" }}
                  />
                </div>

                {/* Pool Depth Gradient */}
                <div className="absolute inset-4 bg-gradient-radial from-transparent via-blue-400/30 to-blue-800/60 rounded-full" />

                {/* Pool Lane Lines */}
                <div className="absolute inset-6 border-2 border-white/20 rounded-full" />
                <div className="absolute inset-12 border border-white/15 rounded-full" />
                <div className="absolute inset-16 border border-white/10 rounded-full" />

                {/* Center Target Zone */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 border-2 border-yellow-300/50 rounded-full animate-ping" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-yellow-400/70 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400/80 rounded-full" />
                </div>

                {/* Underwater Bubble Effects */}
                <div
                  className="absolute bottom-8 left-8 w-2 h-2 bg-white/30 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s", animationDuration: "2s" }}
                />
                <div
                  className="absolute bottom-12 right-12 w-1 h-1 bg-white/40 rounded-full animate-bounce"
                  style={{ animationDelay: "1.5s", animationDuration: "3s" }}
                />
                <div
                  className="absolute bottom-6 left-1/2 w-1 h-1 bg-white/35 rounded-full animate-bounce"
                  style={{ animationDelay: "2.5s", animationDuration: "2.5s" }}
                />
              </div>

              {/* Pool Edge Highlights */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-white/40 rounded-full blur-sm" />
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-white/20 rounded-full blur-sm" />

              {/* Splash effect */}
              {showSplash && <SplashEffect diveResult={diveResult} />}

              {/* Arena indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white/60 text-sm font-semibold mb-2">
                    🏊‍♂️ SWAP ARENA
                  </div>
                  <div className="text-white/40 text-xs">
                    {diveResult
                      ? `${diveResult.style} - Execute swap!`
                      : "Use game character to dive!"}
                  </div>
                </div>
              </div>

              {/* Pool edge highlights */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white/30 rounded-full" />
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white/20 rounded-full" />
            </motion.div>

            {/* Pool label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-semibold">
              💦 Dive Pool
            </div>
          </div>

          {/* Controls and Info */}
          <div className="space-y-6">
            {/* Enhanced Dive Score Display */}
            <DiveScore
              diveHeight={diveHeight}
              onDiveHeightChange={setDiveHeight}
              diveResult={diveResult}
            />

            {/* Phaser Game Character */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">
                  🎮 Swimming Character
                </h3>
                <button
                  onClick={() => setShowCharacterCustomization(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200"
                >
                  Customize {selectedCharacter.emoji}
                </button>
              </div>

              {/* Character Info */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedCharacter.emoji}</div>
                  <div>
                    <div className="text-white font-semibold">
                      {selectedCharacter.name}
                    </div>
                    <div className="text-white/70 text-xs">
                      {selectedCharacter.specialAbility}
                    </div>
                    <div className="text-green-300 text-xs font-semibold">
                      {Math.round((1 - selectedCharacter.feeBonus) * 100)}% fee
                      reduction
                    </div>
                  </div>
                </div>
              </div>

              <GameCharacter
                onDive={handleGameDive}
                poolPosition={poolDimensions}
                isEnabled={isConnected && Boolean(amountIn)}
                characterConfig={selectedCharacter}
              />

              {diveResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-400/30"
                >
                  <div className="text-center">
                    <div className="text-white font-bold text-lg">
                      {diveResult.score}/100 🏆
                    </div>
                    <div className="text-white/90 text-sm">
                      {diveResult.tier}
                    </div>
                    {diveResult.style && (
                      <div className="text-blue-200 text-xs mt-1">
                        Style: {diveResult.style.replace("_", " ")}
                      </div>
                    )}
                    {diveResult.rotations && (
                      <div className="text-cyan-200 text-xs">
                        Rotations: {diveResult.rotations.toFixed(1)} | Angle:{" "}
                        {diveResult.angle?.toFixed(1)}°
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Swap Interface */}
            <SwapInterface
              diveResult={diveResult}
              onAmountChange={setAmountIn}
            />
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 left-20 text-6xl opacity-20">🏖️</div>
      <div className="absolute top-40 right-32 text-4xl opacity-20">☀️</div>
      <div className="absolute bottom-20 left-32 text-5xl opacity-20">🐠</div>
      <div className="absolute bottom-40 right-20 text-4xl opacity-20">🌊</div>

      {/* Character Customization Modal */}
      <CharacterCustomization
        selectedCharacter={selectedCharacter}
        onCharacterSelect={setSelectedCharacter}
        isOpen={showCharacterCustomization}
        onClose={() => setShowCharacterCustomization(false)}
      />
    </div>
  );
}
