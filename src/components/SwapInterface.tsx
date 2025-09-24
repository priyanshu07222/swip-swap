'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';

interface DiveResult {
  score: number;
  tier: string;
  feePercentage: number;
}

interface SwapInterfaceProps {
  diveResult: DiveResult | null;
  onAmountChange: (amount: string) => void;
}

interface Token {
  symbol: string;
  address: string;
  decimals: number;
}

// Mock tokens for Monad testnet - replace with actual token addresses
const TOKENS: Token[] = [
  {
    symbol: 'MON',
    address: '0x0000000000000000000000000000000000000000', // Native token
    decimals: 18
  },
  {
    symbol: 'USDC',
    address: '0x1234567890123456789012345678901234567890', // Mock USDC
    decimals: 6
  },
  {
    symbol: 'WMON',
    address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701', // Wrapped MON
    decimals: 18
  }
];

export function SwapInterface({ diveResult, onAmountChange }: SwapInterfaceProps) {
  const { address, isConnected } = useAccount();
  const [tokenIn, setTokenIn] = useState<Token>(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState<Token>(TOKENS[1]);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Calculate final fee with dive modifier
  const finalFeePercentage = diveResult 
    ? Math.max(0.1, diveResult.feePercentage) // Minimum 0.1% fee
    : 1.0; // Default 1% fee

  const getQuote = async () => {
    if (!amountIn || !tokenIn || !tokenOut) return;

    setIsLoading(true);
    try {
      // 0x API call for quote
      const response = await fetch(
        `https://api.0x.org/swap/v1/quote?` +
        `sellToken=${tokenIn.address}&` +
        `buyToken=${tokenOut.address}&` +
        `sellAmount=${parseEther(amountIn).toString()}&` +
        `slippagePercentage=0.5&` +
        `skipValidation=true`
      );

      if (response.ok) {
        const quoteData = await response.json();
        setQuote(quoteData);
        setAmountOut(formatEther(BigInt(quoteData.buyAmount)));
      } else {
        console.error('Failed to get quote:', await response.text());
      }
    } catch (error) {
      console.error('Error getting quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async () => {
    if (!quote || !address) return;

    try {
      // For demo purposes, we'll simulate the swap
      // In a real implementation, you'd use the 0x API to get the transaction data
      // and then execute it with the modified fee
      
      const mockTxData = {
        to: quote.to,
        data: quote.data,
        value: quote.value || '0x0',
        gas: quote.gas,
        gasPrice: quote.gasPrice,
      };

      // Apply dive-based fee modification
      const modifiedTxData = {
        ...mockTxData,
        // In a real implementation, you'd modify the fee here
        // based on the dive result
      };

      writeContract({
        address: modifiedTxData.to as `0x${string}`,
        abi: [], // Would need actual ABI for the swap contract
        functionName: 'swap',
        args: [],
        value: BigInt(modifiedTxData.value),
      });
    } catch (error) {
      console.error('Error executing swap:', error);
    }
  };

  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      const timeoutId = setTimeout(getQuote, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [amountIn, tokenIn, tokenOut]);

  if (!isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <p className="text-white/70 text-center">Connect wallet to swap</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-white font-bold text-lg mb-4">💱 Swap Tokens</h3>

      {/* Token Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-2">From</label>
          <div className="flex gap-2">
            <select
              value={tokenIn.symbol}
              onChange={(e) => setTokenIn(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[0])}
              className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
            >
              {TOKENS.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => {
                setAmountIn(e.target.value);
                onAmountChange(e.target.value);
              }}
              className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">To</label>
          <div className="flex gap-2">
            <select
              value={tokenOut.symbol}
              onChange={(e) => setTokenOut(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[1])}
              className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
            >
              {TOKENS.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0.0"
              value={amountOut}
              readOnly
              className="flex-1 bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white/70"
            />
          </div>
        </div>
      </div>

      {/* Fee Display */}
      {diveResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-white/20 rounded-lg border border-white/30"
        >
          <div className="text-center">
            <div className="text-white font-semibold">
              🏊‍♂️ {diveResult.tier}
            </div>
            <div className="text-white/80 text-sm">
              Final Fee: {finalFeePercentage}%
            </div>
          </div>
        </motion.div>
      )}

      {/* Swap Button */}
      <button
        onClick={executeSwap}
        disabled={!quote || isPending || isConfirming || !diveResult}
        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
      >
        {isPending || isConfirming ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {isPending ? 'Preparing...' : 'Confirming...'}
          </span>
        ) : !diveResult ? (
          '🏊‍♂️ Dive into pool first!'
        ) : (
          `💦 Execute Swap (${finalFeePercentage}% fee)`
        )}
      </button>

      {/* Transaction Status */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
        >
          <p className="text-green-200 text-center">
            ✅ Swap completed successfully!
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
        >
          <p className="text-red-200 text-center">
            ❌ Swap failed: {error.message}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
