"use client";

import { useState } from "react";
import Card, { CardTitle, CardContent } from "./ui/Card";
import { useStaking } from "@/hooks/useStaking";
import { useAccount } from 'wagmi';
import { useStakeAmount, useSetStakeAmount, useClearStakeAmount, useAddTransaction, useAppStore } from "@/stores";
import { useBestPool } from "@/hooks/useBestPool";

export default function StakeSection() {
  const [isStaking, setIsStaking] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState(0);
  const { isConnected, address } = useAccount();
  const { 
    pools,
    tokenBalance, 
    tokenSymbol,
    tokenDecimals,
    minStake, 
    maxStake,
    stake,
    unstake,
    claimRewards,
    userRewards 
  } = useStaking();

  // Zustand store
  const amount = useStakeAmount();
  const setAmount = useSetStakeAmount();
  const clearAmount = useClearStakeAmount();
  const addTransaction = useAddTransaction();
  const { addNotification, setLoading } = useAppStore();

  const handleStake = async () => {
    if (!amount || !isConnected) return;
    
    setIsStaking(true);
    setLoading('staking', true);
    
    try {
      await stake(selectedPoolId, amount);
      
      // Add transaction to store (using a placeholder hash for now)
      const txHash = `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        type: 'stake',
        amount,
        status: 'pending',
      });
      
      // Add notification
      addNotification({
        type: 'success',
        title: 'Staking Initiated',
        message: `Staking ${amount} ${tokenSymbol} tokens to Pool ${selectedPoolId + 1}`,
      });
      
      clearAmount();
    } catch (error) {
      console.error('Staking failed:', error);
      addNotification({
        type: 'error',
        title: 'Staking Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsStaking(false);
      setLoading('staking', false);
    }
  };

  const handleUnstake = async () => {
    if (!amount || !isConnected) return;
    
    setIsStaking(true);
    setLoading('staking', true);
    
    try {
      await unstake(selectedPoolId, amount);
      
      // Add transaction to store (using a placeholder hash for now)
      const txHash = `unstake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        type: 'unstake',
        amount,
        status: 'pending',
      });
      
      // Add notification
      addNotification({
        type: 'success',
        title: 'Unstaking Initiated',
        message: `Unstaking ${amount} ${tokenSymbol} tokens from Pool ${selectedPoolId + 1}`,
      });
      
      clearAmount();
    } catch (error) {
      console.error('Unstaking failed:', error);
      addNotification({
        type: 'error',
        title: 'Unstaking Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsStaking(false);
      setLoading('staking', false);
    }
  };

  const handleClaimRewards = async () => {
    if (!isConnected) return;
    
    setLoading('claiming', true);
    
    try {
      await claimRewards(selectedPoolId);
      
      // Add transaction to store (using a placeholder hash for now)
      const txHash = `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        type: 'claim',
        amount: userRewards,
        status: 'pending',
      });
      
      // Add notification
      addNotification({
        type: 'success',
        title: 'Rewards Claimed',
        message: `Claimed ${userRewards} ${tokenSymbol} rewards from Pool ${selectedPoolId + 1}`,
      });
    } catch (error) {
      console.error('Claim rewards failed:', error);
      addNotification({
        type: 'error',
        title: 'Claim Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoading('claiming', false);
    }
  };

  // Get best pool recommendation based on stake amount
  const { bestPoolId } = useBestPool(amount, tokenDecimals);

  // Filter pools to only show active ones (current time < end time)
  const activePools = pools.filter(pool => {
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
    return pool.endTimeTimestamp > currentTimestamp;
  });

  const selectedPool = activePools.find(pool => pool.pid === selectedPoolId);
  const poolMinStake = selectedPool ? selectedPool.minMax.split('/')[0] : minStake;
  const userStakedInPool = selectedPool ? parseFloat(selectedPool.userStaked) : 0;
  
  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(tokenBalance);
  const canStake = isValidAmount && parseFloat(amount) >= parseFloat(poolMinStake) && parseFloat(amount) <= parseFloat(tokenBalance);
  const canUnstake = isValidAmount && parseFloat(amount) <= userStakedInPool && userStakedInPool > 0;

  return (
    <Card>
      <CardTitle className="text-xl lg:text-2xl">Stake Tokens</CardTitle>
      
      <CardContent>
        <div className="space-y-4">
          {/* Balance info - Hidden on Mobile */}
          <div className="flex justify-between text-sm" style={{ color: 'var(--color-muted)' }}>
            <span>Balance: {tokenBalance} {tokenSymbol}</span>
            <span>Staked: {userStakedInPool} {tokenSymbol}</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
              Select Pool
            </label>
            <select
              value={selectedPoolId}
              onChange={(e) => setSelectedPoolId(Number(e.target.value))}
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{
                backgroundColor: '#333333',
                border: '1px solid #404040',
                color: 'var(--color-foreground)',
              }}
              disabled={!isConnected}
            >
              {activePools.map((pool) => (
                <option key={pool.pid} value={pool.pid}>
                  Pool {pool.pid + 1} - Min: {pool.minMax.split('/')[0]} - Staked: {pool.userStaked}
                </option>
              ))}
            </select>
          </div>
          
          {/* Amount input */}
          <div>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Enter amount to stake"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow positive numbers or empty string
                if (value === '' || parseFloat(value) >= 0) {
                  setAmount(value);
                }
              }}
              className="w-full rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{
                backgroundColor: '#333333',
                border: '1px solid #404040',
                color: 'var(--color-foreground)',
              }}
              disabled={!isConnected}
            />
          </div>

          <button
            onClick={() => setAmount(tokenBalance)}
            className="text-sm px-3 py-1 rounded border"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
            disabled={!isConnected}
          >
            Max
          </button>
          
          {/* Action buttons */}
          <div className="space-y-2">
            <button 
              onClick={handleStake}
              disabled={!canStake || isStaking || !isConnected}
              className="w-full font-semibold lg:font-bold py-3 lg:py-3 text-base lg:text-base rounded-lg text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, #ffd700, #ffb347)`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = `linear-gradient(135deg, #ffed4e, #ffa726)`;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = `linear-gradient(135deg, #ffd700, #ffb347)`;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
            >
              {isStaking ? 'Staking...' : 'Stake'}
            </button>

            <button 
              onClick={handleUnstake}
              disabled={!canUnstake || isStaking || !isConnected}
              className="lg:flex w-full font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #ff4444',
                color: '#ff4444',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#ff4444';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ff4444';
                }
              }}
            >
              {isStaking ? 'Unstaking...' : 'Unstake'}
            </button>
          </div>

          {/* Claim rewards */}
          {userRewards && parseFloat(userRewards) > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: 'var(--color-muted)' }}>Pending Rewards:</span>
                <span style={{ color: 'var(--color-foreground)' }}>{userRewards} {tokenSymbol}</span>
              </div>
              <button 
                onClick={handleClaimRewards}
                disabled={!isConnected}
                className="w-full font-bold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, #00ff88, #00cc66)`,
                  color: 'black',
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = `linear-gradient(135deg, #00ffaa, #00dd77)`;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = `linear-gradient(135deg, #00ff88, #00cc66)`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                Claim Rewards
              </button>
            </div>
          )}

          {!isConnected && (
            <div className="text-center text-sm" style={{ color: 'var(--color-muted)' }}>
              Connect your wallet to start staking
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
