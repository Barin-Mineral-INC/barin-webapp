import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';
import { useMemo } from 'react';
import { PoolInfo } from './useStaking';

export function usePoolData(poolId: number, tokenDecimals: number) {
  const { data: poolInfo } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'poolInfo',
    args: [BigInt(poolId)],
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

  const poolData = useMemo(() => {
    if (!poolInfo || !totalAllocPoint || !rewardPerBlock) {
      return null;
    }

    const [lpToken, allocPoint, lastRewardBlock, accRewardPerShare, totalStaked, isActive] = poolInfo;
    
    // Calculate APR
    const calculateAPR = () => {
      if (!totalAllocPoint || !rewardPerBlock || !totalStaked || totalStaked === BigInt(0)) return 0;
      
      // Assuming 2.5 seconds per block on Polygon
      const blocksPerYear = BigInt(365 * 24 * 60 * 60 / 2.5);
      const poolRewardPerBlock = (rewardPerBlock * allocPoint) / totalAllocPoint;
      const annualRewards = poolRewardPerBlock * blocksPerYear;
      
      // Convert to percentage
      return Number((annualRewards * BigInt(10000)) / totalStaked) / 100;
    };

    const apr = calculateAPR();
    const tvl = formatUnits(totalStaked, tokenDecimals);
    
    return {
      pid: poolId,
      lpToken: lpToken as string,
      allocPoint,
      lastRewardBlock,
      accRewardPerShare,
      totalStaked,
      isActive,
      apr,
      tvl,
      minMax: '0/∞', // This would need to be fetched from contract if available
      emission: 'Variable',
      health: isActive ? 'Active' : 'Inactive',
      healthColor: isActive ? '#00ff88' : '#ff6b6b',
    } as PoolInfo;
  }, [poolInfo, totalAllocPoint, rewardPerBlock, poolId, tokenDecimals]);

  return poolData;
}

export function useAllPools(tokenDecimals: number) {
  const { data: poolLength } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'poolCount',
  });

  const pools = useMemo(() => {
    if (!poolLength || !tokenDecimals) return [];
    
    const poolData: PoolInfo[] = [];
    const numPools = Number(poolLength);
    
    // For now, we'll create placeholder data
    // In a real implementation, you'd want to fetch each pool individually
    for (let i = 0; i < numPools; i++) {
      poolData.push({
        pid: i,
        lpToken: CONTRACTS.BARIN_TOKEN,
        allocPoint: BigInt(0),
        lastRewardBlock: BigInt(0),
        accRewardPerShare: BigInt(0),
        totalStaked: BigInt(0),
        isActive: true,
        apr: 0,
        tvl: '0',
        minMax: '0/∞',
        emission: 'Variable',
        health: 'Active',
        healthColor: '#00ff88',
      });
    }
    
    return poolData;
  }, [poolLength, tokenDecimals]);

  return pools;
}
