"use client";

import { useState } from "react";
import Card, { CardHeader, CardTitle, CardAction, CardContent } from "./ui/Card";
import MetricCard from "./ui/MetricCard";
import { useStaking } from "@/hooks/useStaking";
import { formatUnits } from "viem";
import { useBestPool } from "@/hooks/useBestPool";
import { useStakeAmount } from "@/stores";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS, STAKING_ABI } from "@/lib/contracts";
import AddPoolModal from "./AddPoolModal";

export default function PoolInfo() {
  const { address, isConnected } = useAccount();
  const [isAddPoolModalOpen, setIsAddPoolModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const {
    pools,
    poolLength,
    totalAllocPoint,
    rewardPerBlock,
    totalRewardRatePerSecond,
    startBlock,
    endBlock,
    totalStaked, 
    apr, 
    minStake, 
    maxStake, 
    tokenSymbol,
    tokenDecimals,
    userStake
  } = useStaking(refreshTrigger);

  // Function to refresh pool data
  const handleRefreshPools = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const amount = useStakeAmount();
  const { bestPoolId } = useBestPool(amount, tokenDecimals);

  // Filter pools to only show active ones (current time < end time)
  const activePools = pools.filter(pool => {
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
    return pool.endTimeTimestamp > currentTimestamp;
  });

  // Fetch ADMIN_ROLE constant
  const { data: adminRole } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'ADMIN_ROLE',
  });

  // Check if connected address has ADMIN_ROLE
  const { data: hasAdminRole } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'hasRole',
    args: adminRole && address ? [adminRole as `0x${string}`, address] : undefined,
  });

  const isAdmin = isConnected && hasAdminRole === true;

  const metrics = [
    { label: "Total Pools", value: poolLength.toString() },
    { label: "Total Staked", value: totalStaked },
    { label: "Reward Rate", value: `${totalRewardRatePerSecond}/sec` },
  ];

  return (
    <>
      <Card className="min-h-[700px]">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl">Pool / Protocol Information</CardTitle>
          <CardAction>
            <button 
              hidden={!isAdmin}
              disabled={!isAdmin}
              onClick={() => setIsAddPoolModalOpen(true)}
              className="font-semibold px-6 py-3 rounded-lg transition-all text-black text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, #ffd700, #ffb347)`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = `linear-gradient(135deg, #ffed4e, #ffa726)`;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = `linear-gradient(135deg, #ffd700, #ffb347)`;
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              Add Pool
            </button>
          </CardAction>
        </CardHeader>
      
      <CardContent className="space-y-10 px-2 py-4">
        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} label={metric.label} value={metric.value} />
          ))}
        </div>

        {/* Pool Table */}
        <div className="rounded-lg">
          <div>
            <table className="w-full">
              <thead style={{ backgroundColor: '#1a1a1a' }}>
                <tr>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '8%' }}
                  >
                    Pool
                  </th>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '8%' }}
                  >
                    APR
                  </th>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '18%' }}
                  >
                    Total Staked
                  </th>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '18%' }}
                  >
                    Reward Rate
                  </th>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '15%' }}
                  >
                    Min/Max
                  </th>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '20%' }}
                  >
                    End Date (UTC)
                  </th>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '15%' }}
                  >
                    End Time (UTC)
                  </th>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '12%' }}
                  >
                    Your Staked
                  </th>
                </tr>
              </thead>
              <tbody>
                {activePools.length > 0 ? (
                  activePools.map((pool, index) => (
                    <tr 
                      key={pool.pid} 
                      className="border-t"
                      style={{ borderColor: '#404040' }}
                    >
                      <td className="px-4 py-5 text-center">
                        <span className="text-base font-semibold" style={{ color: '#ffffff' }}>
                          Pool {pool.pid + 1}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-right">
                        <span className={`font-semibold ${pool.apr === Infinity ? 'text-2xl' : 'text-base'}`} style={{ color: pool.isActive ? '#00ff88' : '#ff6b6b' }}>
                          {pool.apr === Infinity ? '∞%' : `${pool.apr.toFixed(2)}%`}
                        </span>
                      </td>
                      <td 
                        className="px-4 py-5 text-base text-right"
                        style={{ color: '#ffffff' }}
                      >
                        {pool.tvl}
                      </td>
                      <td 
                        className="px-4 py-5 text-base text-right"
                        style={{ color: '#ffffff' }}
                      >
                        {formatUnits(pool.rewardPerSec, tokenDecimals || 18)}/sec
                      </td>
                      <td 
                        className="px-4 py-5 text-base text-right"
                        style={{ color: '#ffffff' }}
                      >
                        {pool.minMax}
                      </td>
                      <td 
                        className="px-4 py-5 text-base text-right"
                        style={{ color: '#ffffff' }}
                      >
                        {pool.endDate}
                      </td>
                      <td 
                        className="px-4 py-5 text-base text-right"
                        style={{ color: '#ffffff' }}
                      >
                        {pool.endTime}
                      </td>
                      <td 
                        className="px-4 py-5 text-base text-right"
                        style={{ color: '#ffffff' }}
                      >
                        {pool.userStaked}
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr className="border-t" style={{ borderColor: '#404040' }}>
                      <td 
                        colSpan={8}
                        className="px-6 py-8 text-center text-base"
                        style={{ color: '#888888' }}
                      >
                        No active pools available
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
    
    {/* Add Pool Modal */}
    <AddPoolModal 
      isOpen={isAddPoolModalOpen} 
      onClose={() => setIsAddPoolModalOpen(false)}
      onSuccess={handleRefreshPools}
    />
    </>
  );
}
