"use client";

import Card, { CardTitle, CardContent } from "./ui/Card";
import MetricCard from "./ui/MetricCard";
import { useStaking } from "@/hooks/useStaking";
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACTS, STAKING_ABI } from "@/lib/contracts";
import { readContract } from 'wagmi/actions';
import { formatUnits } from "viem";
import { useMemo, useEffect, useState } from "react";
import { config } from '@/lib/wagmi';

export default function UserInfo() {
  const { isConnected, address } = useAccount();
  const { 
    tokenBalance, 
    tokenSymbol,
    tokenDecimals,
    poolLength,
    pools,
    userStake, 
    userRewards, 
    apr 
  } = useStaking();

  const [totalPendingRewards, setTotalPendingRewards] = useState('0.00');

  // Fetch total staked across all pools for this user
  const { data: totalStakedData } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getTotalStaked',
    args: address ? [address] : undefined,
  });

  const totalStaked = useMemo(() => {
    if (!totalStakedData || !tokenDecimals) return '0.00';
    const formatted = formatUnits(totalStakedData as bigint, tokenDecimals);
    return parseFloat(formatted).toFixed(2);
  }, [totalStakedData, tokenDecimals]);

  // Fetch pending rewards dynamically for all pools
  useEffect(() => {
    const fetchPendingRewards = async () => {
      if (!address || !poolLength || !tokenDecimals) {
        setTotalPendingRewards('0.00');
        return;
      }

      const numPools = Number(poolLength);
      const rewardPromises = [];

      for (let i = 0; i < numPools; i++) {
        rewardPromises.push(
          readContract(config, {
            address: CONTRACTS.STAKING,
            abi: STAKING_ABI,
            functionName: 'pendingRewards',
            args: [address as `0x${string}`, BigInt(i)],
          })
        );
      }

      try {
        const rewards = await Promise.all(rewardPromises);
        const total = rewards.reduce((sum, reward) => {
          return sum + (reward ? (reward as bigint) : BigInt(0));
        }, BigInt(0));
        
        const formatted = formatUnits(total, tokenDecimals);
        setTotalPendingRewards(parseFloat(formatted).toFixed(2));
      } catch (error) {
        console.error('Error fetching pending rewards:', error);
        setTotalPendingRewards('0.00');
      }
    };

    fetchPendingRewards();
  }, [address, poolLength, tokenDecimals]);

  if (!isConnected) {
    return (
      <Card>
        <CardTitle>User-Specific Information</CardTitle>
        <CardContent className="space-y-6">
          <div className="text-center py-8" style={{ color: 'var(--color-muted)' }}>
            Connect your wallet to view your staking information
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>User-Specific Information</CardTitle>
      
      <CardContent className="space-y-6">
        {/* Wallet Overview */}
        <div className="space-y-4">
          <h3 className="text-base lg:text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Wallet Overview</h3>
          <div className="grid grid-cols-1 gap-3">
            <MetricCard 
              label="Available Balance" 
              value={`${parseFloat(tokenBalance).toFixed(2)}`} 
            />
            <MetricCard 
              label="Rewards Pending" 
              value={`${totalPendingRewards}`}
            />
          </div>
        </div>

        {/* Per-pool Details (Mobile) */}
        <div className="space-y-3 lg:hidden">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Per-pool Details</h3>
          {pools.slice(0, 2).map((pool, index) => (
            <div 
              key={pool.pid}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: 'var(--color-card)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {pool.pid % 2 === 0 ? 'Flexible Pool' : 'Locked Pool'}
                </span>
                <span className="text-sm font-semibold" style={{ color: pool.pid % 2 === 0 ? '#00ff88' : '#ffd700' }}>
                  {pool.pid % 2 === 0 ? 'APR: 15%' : 'APY: 25%'}
                </span>
              </div>
              {pool.pid % 2 !== 0 && (
                <div className="text-xs mt-1" style={{ color: '#ff4444' }}>
                  Penalty: -10% if unstaked early
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Voting Power (Mobile) */}
        <div className="space-y-3 hidden">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Voting Power</h3>
          <div 
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: 'var(--color-card)' }}
          >
            <div className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>Total Voting Power</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>1,500 VP</div>
          </div>
        </div>

        {/* Desktop - Total Staked */}
        <div className="hidden lg:block">
          <MetricCard 
            label="Total Staked Amount" 
            value={`${totalStaked} ${tokenSymbol}`}
          />
        </div>

        {/* Staking Details */}
        {false && ( // Not available in official ABI
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Staking Details</h3>
            
            <div style={{ backgroundColor: 'var(--color-card)' }} className="p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Active Stake</h4>
                <span className="font-semibold" style={{ color: '#00ff88' }}>APR: {apr.toFixed(2)}%</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Staked:</span>
                  <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>
                    0 {tokenSymbol} {/* Not available in official ABI */}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Rewards:</span>
                  <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>
                    {userRewards} {tokenSymbol}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Staked Since:</span>
                  <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>
                    N/A {/* Not available in official ABI */}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Lock Time:</span>
                  <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>
                    N/A {/* Not available in official ABI */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
