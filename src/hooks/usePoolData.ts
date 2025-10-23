import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';
import { useMemo } from 'react';
import { PoolInfo } from './useStaking';

export function usePoolData(poolId: number, tokenDecimals: number) {
  const { data: poolInfo } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'pools',
    args: [BigInt(poolId)],
  });

  // Note: The official ABI doesn't have totalAllocPoint or rewardPerBlock functions
  // We'll calculate APR based on rewardPerSec from the pool data

  const poolData = useMemo(() => {
    if (!poolInfo) {
      return null;
    }

    // Based on the official ABI, pools returns: [rewardPerSec, minStake, endTime, totalStaked, accRewardPerShare, lastRewardTime, exists]
    const [rewardPerSec, minStake, endTime, totalStaked, accRewardPerShare, lastRewardTime, exists] = poolInfo;

    // Calculate APR based on rewardPerSec
    const calculateAPR = () => {
      if (!totalStaked || totalStaked === BigInt(0)) return 0;
      
      // Convert rewardPerSec to annual rewards
      const annualRewards = rewardPerSec * BigInt(365 * 24 * 60 * 60);
      const apr = Number(annualRewards) / Number(totalStaked) * 100;
      return apr;
    };

    const apr = calculateAPR();
    const tvl = formatUnits(totalStaked, tokenDecimals);
    const minStakeFormatted = formatUnits(minStake, tokenDecimals);

    // Calculate end date and time
    const calculateEndDateTime = () => {
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

    const { endDate, endTime: endTimeStr } = calculateEndDateTime();

    return {
      pid: poolId,
      lpToken: CONTRACTS.BARIN_TOKEN, // All pools use the same token
      allocPoint: BigInt(0), // Not available in this ABI
      lastRewardBlock: lastRewardTime, // Using lastRewardTime as equivalent
      accRewardPerShare,
      totalStaked,
      isActive: exists,
      minStake,
      apr,
      tvl,
      minMax: `${minStakeFormatted}/∞`,
      endDate,
      endTime: endTimeStr,
    } as PoolInfo;
  }, [poolInfo, poolId, tokenDecimals]);

  return poolData;
}

export function useAllPools(tokenDecimals: number) {
  // This function is now replaced by useAllPoolsData from the separate hook
  // Keeping this for backward compatibility but it should use the new hook
  return [];
}
