import { useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';

export function useBestPool(stakeAmount: string, tokenDecimals: number = 18) {
  const { data: bestPoolData } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getBestPoolForStaking',
    args: stakeAmount && parseFloat(stakeAmount) > 0 
      ? [parseUnits(stakeAmount, tokenDecimals)] 
      : undefined,
  });

  // bestPoolData returns [poolId, maxReward]
  const bestPoolId = bestPoolData ? Number(bestPoolData[0]) : null;
  const maxReward = bestPoolData ? bestPoolData[1] : null;

  return {
    bestPoolId,
    maxReward,
  };
}

