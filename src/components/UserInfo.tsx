"use client";

import Card, { CardTitle, CardContent } from "./ui/Card";
import MetricCard from "./ui/MetricCard";
import { useStaking } from "@/hooks/useStaking";
import { useAccount } from 'wagmi';

export default function UserInfo() {
  const { isConnected, address } = useAccount();
  const { 
    tokenBalance, 
    tokenSymbol, 
    userStake, 
    userRewards, 
    apr 
  } = useStaking();

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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Wallet Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard 
              label="Total Staked Amount" 
              value={userStake ? `${userStake.amount} ${tokenSymbol}` : `0 ${tokenSymbol}`} 
            />
            <MetricCard 
              label="Available Balance" 
              value={`${tokenBalance} ${tokenSymbol}`} 
            />
          </div>
          <MetricCard 
            label="Rewards Pending" 
            value={`${userRewards} ${tokenSymbol}`} 
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Wallet Address</h3>
          <div 
            className="p-3 rounded-lg font-mono text-sm"
            style={{ 
              backgroundColor: 'var(--color-card)', 
              color: 'var(--color-muted)' 
            }}
          >
            {address}
          </div>
        </div>

        {/* Staking Details */}
        {userStake && parseFloat(userStake.amount) > 0 && (
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
                    {userStake.amount} {tokenSymbol}
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
                    {new Date(Number(userStake.timestamp) * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Lock Time:</span>
                  <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>
                    {userStake.lockTime > 0 ? `${userStake.lockTime} days` : 'Flexible'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No staking info */}
        {(!userStake || parseFloat(userStake.amount) === 0) && (
          <div className="text-center py-4" style={{ color: 'var(--color-muted)' }}>
            You haven&apos;t staked any tokens yet. Start staking to earn rewards!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
