'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useDragControls } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { SplashEffect } from './SplashEffect';
import { DiveScore } from './DiveScore';
import { SwapInterface } from './SwapInterface';
import { Leaderboard } from './Leaderboard';

interface DiveResult {
  score: number;
  tier: string;
  feePercentage: number;
}

export function SwimmingPool() {
  const { isConnected, address } = useAccount();
  const [diveResult, setDiveResult] = useState<DiveResult | null>(null);
  const [isDiving, setIsDiving] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [diveHeight, setDiveHeight] = useState(50);
  const [leaderboardEntry, setLeaderboardEntry] = useState<any>(null);
  
  const poolRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const scale = useTransform(y, [0, -100], [1, 1.2]);

  const calculateDiveScore = useCallback((height: number, accuracy: number): DiveResult => {
    // Base score from height (0-60 points)
    const heightScore = Math.min(height, 100) * 0.6;
    
    // Accuracy bonus (0-40 points)
    const accuracyScore = accuracy * 0.4;
    
    const totalScore = Math.round(heightScore + accuracyScore);
    
    // Determine tier and fee
    let tier: string;
    let feePercentage: number;
    
    if (totalScore >= 80) {
      tier = "Perfect Dive";
      feePercentage = 0.1;
    } else if (totalScore >= 60) {
      tier = "Great Dive";
      feePercentage = 0.5;
    } else if (totalScore >= 40) {
      tier = "Good Dive";
      feePercentage = 1.0;
    } else if (totalScore >= 20) {
      tier = "Splash Dive";
      feePercentage = 2.0;
    } else {
      tier = "Belly Flop";
      feePercentage = 5.0;
    }
    
    return {
      score: totalScore,
      tier,
      feePercentage
    };
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    if (!poolRef.current) return;
    
    const poolRect = poolRef.current.getBoundingClientRect();
    const dropX = event.clientX - poolRect.left;
    const dropY = event.clientY - poolRect.top;
    
    // Calculate accuracy based on how close to center the drop was
    const centerX = poolRect.width / 2;
    const centerY = poolRect.height / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2)
    );
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const accuracy = Math.max(0, 1 - (distanceFromCenter / maxDistance));
    
    setIsDiving(true);
    setShowSplash(true);
    
    // Calculate dive result
    const result = calculateDiveScore(diveHeight, accuracy);
    setDiveResult(result);
    
    // Add to leaderboard if connected
    if (address) {
      setLeaderboardEntry({
        address,
        score: result.score,
        tier: result.tier,
        timestamp: Date.now()
      });
    }
    
    // Reset after animation
    setTimeout(() => {
      setIsDiving(false);
      setShowSplash(false);
    }, 2000);
  }, [diveHeight, calculateDiveScore]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">🏊‍♂️ SwimSwap</h1>
          <p className="text-xl text-blue-100 mb-8">Connect your wallet to start diving!</p>
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

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Swimming Pool */}
          <div className="relative">
            <motion.div
              ref={poolRef}
              className="w-80 h-80 bg-gradient-to-b from-cyan-300 to-blue-500 rounded-full border-8 border-blue-300 shadow-2xl relative overflow-hidden"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              animate={showSplash ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {/* Pool water effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" />
              
              {/* Pool tiles */}
              <div className="absolute inset-4 border-4 border-white/30 rounded-full" />
              <div className="absolute inset-8 border-2 border-white/20 rounded-full" />
              
              {/* Splash effect */}
              {showSplash && <SplashEffect diveResult={diveResult} />}
              
              {/* Drop zone indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/50 text-lg font-semibold">
                  Drop your avatar here!
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls and Info */}
          <div className="space-y-6">
            {/* Dive Height Slider */}
            <DiveScore 
              diveHeight={diveHeight}
              onDiveHeightChange={setDiveHeight}
              diveResult={diveResult}
            />

            {/* Draggable Avatar */}
            <motion.div
              drag
              dragControls={dragControls}
              dragMomentum={false}
              style={{ x, y, rotate, scale }}
              className="w-16 h-16 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full border-4 border-white shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-2xl"
              whileDrag={{ scale: 1.1 }}
              whileHover={{ scale: 1.05 }}
            >
              🥔
            </motion.div>

            {/* Swap Interface */}
            <SwapInterface diveResult={diveResult} />
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 left-20 text-6xl opacity-20">🏖️</div>
      <div className="absolute top-40 right-32 text-4xl opacity-20">☀️</div>
      <div className="absolute bottom-20 left-32 text-5xl opacity-20">🐠</div>
      <div className="absolute bottom-40 right-20 text-4xl opacity-20">🌊</div>
    </div>
  );
}
