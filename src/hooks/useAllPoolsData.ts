import { useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { readContract } from 'wagmi/actions';
import { formatUnits } from 'viem';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';
import { PoolInfo } from './useStaking';
import { config } from '@/lib/wagmi';

export function useAllPoolsData(tokenDecimals: number, userAddress?: string, refreshTrigger?: number): PoolInfo[] {
  const [pools, setPools] = useState<PoolInfo[]>([]);

  const { data: poolLength, refetch: refetchPoolLength } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'poolCount',
  });

  useEffect(() => {
    const fetchAllPools = async () => {
      // Refetch pool count first to get latest count
      await refetchPoolLength();
      
      if (!poolLength || !tokenDecimals) return;

      const numPools = Number(poolLength);
      const poolPromises = [];

      for (let i = 0; i < numPools; i++) {
        poolPromises.push(fetchPoolData(i, tokenDecimals, userAddress));
      }

      const fetchedPools = await Promise.all(poolPromises);
      setPools(fetchedPools.filter((pool): pool is PoolInfo => pool !== null));
    };

    fetchAllPools();
  }, [poolLength, tokenDecimals, userAddress, refreshTrigger, refetchPoolLength]);

  return pools;
}

async function fetchPoolData(
  poolId: number,
  tokenDecimals: number,
  userAddress?: string
): Promise<PoolInfo | null> {
  try {
    // Fetch pool data
    const poolData = await readContract(config, {
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'pools',
      args: [BigInt(poolId)],
    });

    if (!poolData) return null;

    // Fetch user stake data if address provided
    let userStakeData;
    if (userAddress) {
      userStakeData = await readContract(config, {
        address: CONTRACTS.STAKING,
        abi: STAKING_ABI,
        functionName: 'stakes',
        args: [userAddress as `0x${string}`, BigInt(poolId)],
      });
    }

    // Parse pool data: [rewardPerSec, minStake, endTime, totalStaked, accRewardPerShare, lastRewardTime, exists]
    const [rewardPerSec, minStake, endTime, totalStaked, accRewardPerShare, lastRewardTime, exists] = poolData as readonly [
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      boolean
    ];

    // Calculate APR
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

    // Get user staked amount: stakes returns [amount, rewardDebt, unlockTime]
    const userStakedAmount = userStakeData ? (userStakeData as readonly [bigint, bigint, bigint])[0] : BigInt(0);
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
      endTimeTimestamp: endTime, // Store raw timestamp for filtering
      userStaked: userStakedFormatted,
    };
  } catch (error) {
    console.error(`Error fetching pool ${poolId}:`, error);
    return null;
  }
}
