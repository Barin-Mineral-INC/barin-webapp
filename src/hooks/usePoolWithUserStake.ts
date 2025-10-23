import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';
import { useMemo } from 'react';
import { PoolInfo } from './useStaking';

export function usePoolWithUserStake(poolId: number, tokenDecimals: number, userAddress?: string): PoolInfo | null {
  // Fetch pool data
  const { data: poolData } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'pools',
    args: [BigInt(poolId)],
  });

  // Fetch user stake data
  const { data: userStakeData } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'stakes',
    args: userAddress ? [userAddress as `0x${string}`, BigInt(poolId)] : undefined,
  });

  const pool = useMemo(() => {
    if (!poolData || !tokenDecimals) return null;

    // Based on the official ABI, pools returns: [rewardPerSec, minStake, endTime, totalStaked, accRewardPerShare, lastRewardTime, exists]
    const [rewardPerSec, minStake, endTime, totalStaked, accRewardPerShare, lastRewardTime, exists] = poolData;

    // Calculate APR based on rewardPerSec
    const calculateAPR = () => {
      if (!totalStaked || totalStaked === BigInt(0)) return Infinity;
      
      const annualRewards = rewardPerSec * BigInt(365 * 24 * 60 * 60);
      const annualRewardsNum = Number(formatUnits(annualRewards, tokenDecimals));
      const totalStakedNum = Number(formatUnits(totalStaked, tokenDecimals));
      
      return (annualRewardsNum / totalStakedNum) * 100;
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

    // Get user staked amount from stakes function
    // stakes returns [amount, rewardDebt, unlockTime]
    const userStakedAmount = userStakeData ? userStakeData[0] : BigInt(0);
    const userStakedFormatted = userAddress 
      ? formatUnits(userStakedAmount, tokenDecimals) 
      : 'N/A';

    return {
      pid: poolId,
      lpToken: CONTRACTS.BARIN_TOKEN,
      allocPoint: BigInt(0),
      lastRewardBlock: lastRewardTime,
      accRewardPerShare,
      totalStaked,
      isActive: exists,
      minStake,
      rewardPerSec,
      apr,
      tvl,
      minMax: `${minStakeFormatted}/∞`,
      endDate,
      endTime: endTimeStr,
      userStaked: userStakedFormatted,
    };
  }, [poolData, userStakeData, poolId, tokenDecimals, userAddress]);

  return pool;
}

