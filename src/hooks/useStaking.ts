import { useReadContract, useWriteContract } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { CONTRACTS, STAKING_ABI, ERC20_ABI } from '@/lib/contracts';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { useAllPools } from './usePoolData';

export interface PoolInfo {
  pid: number;
  lpToken: string;
  allocPoint: bigint;
  lastRewardBlock: bigint;
  accRewardPerShare: bigint;
  totalStaked: bigint;
  isActive: boolean;
  apr: number;
  tvl: string;
  minMax: string;
  emission: string;
  health: string;
  healthColor: string;
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

  const { data: totalAllocPoint } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'totalAllocPoint',
  });

  const { data: rewardPerBlock } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'rewardPerBlock',
  });

  const { data: startBlock } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'startBlock',
  });

  const { data: endBlock } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'endBlock',
  });

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

  const { data: userStake } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getUserStake',
    args: address ? [address] : undefined,
  });

  const { data: userRewards } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getUserRewards',
    args: address ? [address] : undefined,
  });

  const { data: apr } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getAPR',
  });

  const { data: minStake } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getMinStake',
  });

  const { data: maxStake } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getMaxStake',
  });

  // Pool data fetching
  const pools = useAllPools(tokenDecimals || 18);

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
      functionName: 'unstake',
      args: [BigInt(pid), amountWei],
    });
  };

  const claimRewards = async (pid: number) => {
    writeContract({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'claimRewards',
      args: [BigInt(pid)],
    });
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
      functionName: 'unstake',
      args: [BigInt(0), amountWei], // Default to pool 0 for legacy
    });
  };

  const claimRewardsLegacy = async () => {
    writeContract({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'claimRewards',
      args: [BigInt(0)], // Default to pool 0 for legacy
    });
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
    totalAllocPoint: totalAllocPoint ? Number(totalAllocPoint) : 0,
    rewardPerBlock: formatTokenAmount(rewardPerBlock, tokenDecimals),
    startBlock: startBlock ? Number(startBlock) : 0,
    endBlock: endBlock ? Number(endBlock) : 0,
    
    // Legacy data for backward compatibility
    totalStaked: formatTokenAmount(totalStaked, tokenDecimals),
    userStake: userStake ? {
      amount: formatTokenAmount(userStake[0], tokenDecimals),
      timestamp: userStake[1],
      lockTime: userStake[2],
    } : null,
    userRewards: formatTokenAmount(userRewards, tokenDecimals),
    apr: apr ? Number(apr) / 100 : 0, // Convert from basis points
    minStake: formatTokenAmount(minStake, tokenDecimals),
    maxStake: formatTokenAmount(maxStake, tokenDecimals),
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
