import { useReadContract, useWriteContract } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { CONTRACTS, STAKING_ABI, ERC20_ABI } from '@/lib/contracts';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';
// import { useAllPoolsData } from './useAllPoolsData';

export interface PoolInfo {
  pid: number;
  lpToken: string;
  allocPoint: bigint;
  lastRewardBlock: bigint;
  accRewardPerShare: bigint;
  totalStaked: bigint;
  isActive: boolean;
  minStake: bigint;
  apr: number;
  tvl: string;
  minMax: string;
  endDate: string;
  endTime: string;
  // Legacy fields for backward compatibility
  emission?: string;
  health?: string;
  healthColor?: string;
}

export function useStaking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Pool data
  const { data: poolLength } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'poolCount',
  });

  // These functions don't exist in the official ABI

  // Token data
  const { data: tokenBalance } = useReadContract({
    address: CONTRACTS.BARIN_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: tokenDecimals } = useReadContract({
    address: CONTRACTS.BARIN_TOKEN,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: tokenSymbol } = useReadContract({
    address: CONTRACTS.BARIN_TOKEN,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  // Legacy functions for backward compatibility
  const { data: totalStaked } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getTotalStaked',
  });

  // These functions don't exist in the official ABI

  // Pool data fetching - using placeholder for now
  const pools: PoolInfo[] = [];

  // Calculate APR for pools
  const calculatePoolAPR = (allocPoint: bigint, totalAllocPoint: bigint, rewardPerBlock: bigint, totalStaked: bigint) => {
    if (!totalAllocPoint || !rewardPerBlock || !totalStaked || totalStaked === BigInt(0)) return 0;
    
    // Assuming 2.5 seconds per block on Polygon
    const blocksPerYear = BigInt(365 * 24 * 60 * 60 / 2.5);
    const poolRewardPerBlock = (rewardPerBlock * allocPoint) / totalAllocPoint;
    const annualRewards = poolRewardPerBlock * blocksPerYear;
    
    // Convert to percentage
    return Number((annualRewards * BigInt(10000)) / totalStaked) / 100;
  };

  // Write functions
  const stake = async (pid: number, amount: string) => {
    if (!address || !tokenDecimals) return;
    
    const amountWei = parseUnits(amount, tokenDecimals);
    
    // First approve the staking contract to spend tokens
    writeContract({
      address: CONTRACTS.BARIN_TOKEN,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.STAKING, amountWei],
    });

    // Then stake
    writeContract({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [BigInt(pid), amountWei],
    });
  };

  const unstake = async (pid: number, amount: string) => {
    if (!tokenDecimals) return;
    
    const amountWei = parseUnits(amount, tokenDecimals);
    
    writeContract({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'withdraw',
      args: [BigInt(pid), amountWei],
    });
  };

  const claimRewards = async (pid: number) => {
    // Note: There's no direct claimRewards function in the official ABI
    // Rewards are typically claimed when withdrawing or through a separate mechanism
    console.log('Claim rewards not implemented in official ABI');
  };

  // Legacy functions for backward compatibility
  const stakeLegacy = async (amount: string) => {
    if (!address || !tokenDecimals) return;
    
    const amountWei = parseUnits(amount, tokenDecimals);
    
    // First approve the staking contract to spend tokens
    writeContract({
      address: CONTRACTS.BARIN_TOKEN,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.STAKING, amountWei],
    });

    // Then stake - using legacy function without pool ID
    writeContract({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [BigInt(0), amountWei], // Default to pool 0 for legacy
    });
  };

  const unstakeLegacy = async (amount: string) => {
    if (!tokenDecimals) return;
    
    const amountWei = parseUnits(amount, tokenDecimals);
    
    writeContract({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'withdraw',
      args: [BigInt(0), amountWei], // Default to pool 0 for legacy
    });
  };

  const claimRewardsLegacy = async () => {
    // Note: There's no direct claimRewards function in the official ABI
    console.log('Claim rewards not implemented in official ABI');
  };

  // Format data for display
  const formatTokenAmount = (amount: bigint | undefined, decimals: number | undefined) => {
    if (!amount || !decimals) return '0';
    return formatUnits(amount, decimals);
  };

  return {
    // Pool data
    pools,
    poolLength: poolLength ? Number(poolLength) : 0,
    totalAllocPoint: 0, // Not available in official ABI
    rewardPerBlock: '0', // Not available in official ABI
    startBlock: 0, // Not available in official ABI
    endBlock: 0, // Not available in official ABI
    
    // Legacy data for backward compatibility
    totalStaked: formatTokenAmount(totalStaked, tokenDecimals),
    userStake: null, // Not available in official ABI
    userRewards: '0', // Not available in official ABI
    apr: 0, // Not available in official ABI
    minStake: '0', // Not available in official ABI
    maxStake: '0', // Not available in official ABI
    tokenBalance: formatTokenAmount(tokenBalance, tokenDecimals),
    tokenSymbol: tokenSymbol || 'BARIN',
    
    // Actions
    stake,
    unstake,
    claimRewards,
    
    // Legacy actions
    stakeLegacy,
    unstakeLegacy,
    claimRewardsLegacy,
    
    // Utils
    formatTokenAmount: (amount: string) => formatTokenAmount(BigInt(amount), tokenDecimals),
    calculatePoolAPR,
  };
}
