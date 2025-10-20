import { useReadContract, useWriteContract } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { CONTRACTS, STAKING_ABI, ERC20_ABI } from '@/lib/contracts';
import { useAccount } from 'wagmi';

export function useStaking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Read contract data
  const { data: totalStaked } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'totalStaked',
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

  // Write functions
  const stake = async (amount: string) => {
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
      args: [amountWei],
    });
  };

  const unstake = async (amount: string) => {
    if (!tokenDecimals) return;
    
    const amountWei = parseUnits(amount, tokenDecimals);
    
    writeContract({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [amountWei],
    });
  };

  const claimRewards = async () => {
    writeContract({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'claimRewards',
    });
  };

  // Format data for display
  const formatTokenAmount = (amount: bigint | undefined, decimals: number | undefined) => {
    if (!amount || !decimals) return '0';
    return formatUnits(amount, decimals);
  };

  return {
    // Data
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
    
    // Utils
    formatTokenAmount: (amount: string) => formatTokenAmount(BigInt(amount), tokenDecimals),
  };
}
