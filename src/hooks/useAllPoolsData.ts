import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';
import { useMemo } from 'react';
import { PoolInfo } from './useStaking';

export function useAllPoolsData(tokenDecimals: number, userAddress?: string) {
  const { data: poolLength } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'poolCount',
  });

  // Fetch individual pool data for the first few pools
  const numPools = poolLength ? Math.min(Number(poolLength), 5) : 0; // Limit to first 5 pools for performance
  
  const pool0 = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'pools',
    args: [BigInt(0)],
  });

  const pool1 = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'pools',
    args: [BigInt(1)],
  });

  const pool2 = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'pools',
    args: [BigInt(2)],
  });

  const pool3 = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'pools',
    args: [BigInt(3)],
  });

  const pool4 = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'pools',
    args: [BigInt(4)],
  });

  // Calculate end date and time from endTime timestamp
  const calculateEndDateTime = (endTime: bigint) => {
    if (!endTime || endTime === BigInt(0)) return { endDate: 'N/A', endTime: 'N/A' };
    
    const endTimestamp = Number(endTime);
    const endDate = new Date(endTimestamp * 1000);
    
    const endDateStr = endDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC'
    });
    
    const endTimeStr = endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      hour12: false
    });
    
    return { endDate: endDateStr, endTime: endTimeStr };
  };

  const pools = useMemo(() => {
    if (!poolLength || !tokenDecimals || numPools === 0) return [];
    
    const poolData: PoolInfo[] = [];
    const poolResults = [pool0, pool1, pool2, pool3, pool4];
    
    for (let i = 0; i < numPools; i++) {
      const poolResult = poolResults[i];
      
      if (poolResult.data) {
        // Based on the official ABI, pools returns: [rewardPerSec, minStake, endTime, totalStaked, accRewardPerShare, lastRewardTime, exists]
        const [rewardPerSec, minStake, endTime, totalStaked, accRewardPerShare, lastRewardTime, exists] = poolResult.data;
        
        // Calculate APR based on rewardPerSec
        const calculateAPR = () => {
          if (!totalStaked || totalStaked === BigInt(0)) return Infinity; // Return Infinity for infinite APR
          
          // Convert rewardPerSec to annual rewards
          const annualRewards = rewardPerSec * BigInt(365 * 24 * 60 * 60);
          
          // Convert to numbers considering decimals for proper calculation
          const annualRewardsNum = Number(formatUnits(annualRewards, tokenDecimals));
          const totalStakedNum = Number(formatUnits(totalStaked, tokenDecimals));
          
          const apr = (annualRewardsNum / totalStakedNum) * 100;
          return apr;
        };

        const apr = calculateAPR();
        const tvl = formatUnits(totalStaked, tokenDecimals);
        const minStakeFormatted = formatUnits(minStake, tokenDecimals);
        
        // Calculate end date and time for this specific pool
        const { endDate, endTime: endTimeStr } = calculateEndDateTime(endTime);
        
                poolData.push({
                  pid: i,
                  lpToken: CONTRACTS.BARIN_TOKEN, // All pools use the same token
                  allocPoint: BigInt(0), // Not available in this ABI
                  lastRewardBlock: lastRewardTime, // Using lastRewardTime as equivalent
                  accRewardPerShare,
                  totalStaked,
                  isActive: exists,
                  minStake,
                  rewardPerSec, // Include rewardPerSec for total calculation
                  apr,
                  tvl,
                  minMax: `${minStakeFormatted}/∞`,
                  endDate,
                  endTime: endTimeStr,
                  userStaked: userAddress ? '0' : 'N/A', // Placeholder - will be updated when we have user staking data
                });
      } else {
        // Fallback data if pool doesn't exist or is loading
        poolData.push({
          pid: i,
          lpToken: CONTRACTS.BARIN_TOKEN,
          allocPoint: BigInt(0),
          lastRewardBlock: BigInt(0),
          accRewardPerShare: BigInt(0),
          totalStaked: BigInt(0),
          isActive: false,
          minStake: BigInt(0),
          rewardPerSec: BigInt(0),
          apr: 0,
          tvl: '0',
          minMax: '0/∞',
          endDate: 'N/A',
          endTime: 'N/A',
          userStaked: userAddress ? '0' : 'N/A',
        });
      }
    }
    
    return poolData;
  }, [pool0.data, pool1.data, pool2.data, pool3.data, pool4.data, poolLength, tokenDecimals, numPools]);

  return pools;
}
