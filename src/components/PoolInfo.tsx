"use client";

import Card, { CardHeader, CardTitle, CardAction, CardContent } from "./ui/Card";
import MetricCard from "./ui/MetricCard";
import { useStaking } from "@/hooks/useStaking";

export default function PoolInfo() {
  const { 
    pools,
    poolLength,
    totalAllocPoint,
    rewardPerBlock,
    startBlock,
    endBlock,
    totalStaked, 
    apr, 
    minStake, 
    maxStake, 
    tokenSymbol,
    userStake
  } = useStaking();
  
  const metrics = [
    { label: "Total Pools", value: poolLength.toString() },
    { label: "Total Staked", value: `${totalStaked} ${tokenSymbol}` },
    { label: "Reward Rate", value: `${rewardPerBlock} ${tokenSymbol}/block` },
    { label: "Your Staked", value: "0" }, // Not available in official ABI
  ];

  return (
    <Card className="min-h-[700px]">
      <CardHeader className="pb-8">
        <CardTitle className="text-3xl">Pool / Protocol Information</CardTitle>
        <CardAction>
          <button 
            className="font-semibold px-6 py-3 rounded-lg transition-all text-black text-lg"
            style={{
              background: `linear-gradient(135deg, #ffd700, #ffb347)`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, #ffed4e, #ffa726)`;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, #ffd700, #ffb347)`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Add Pool
          </button>
        </CardAction>
      </CardHeader>
      
      <CardContent className="space-y-10 px-10">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 gap-6">
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
                    className="px-6 py-5 text-left text-base font-medium"
                    style={{ color: '#ffffff', width: '20%' }}
                  >
                    Pool Number
                  </th>
                  <th 
                    className="px-4 py-5 text-right text-base font-medium"
                    style={{ color: '#ffffff', width: '12%' }}
                  >
                    APR
                  </th>
                  <th 
                    className="px-4 py-5 text-right text-base font-medium"
                    style={{ color: '#ffffff', width: '12%' }}
                  >
                    TVL
                  </th>
                  <th 
                    className="px-4 py-5 text-right text-base font-medium"
                    style={{ color: '#ffffff', width: '15%' }}
                  >
                    Min/Max
                  </th>
                  <th 
                    className="px-4 py-5 text-right text-base font-medium"
                    style={{ color: '#ffffff', width: '15%' }}
                  >
                    End Date (UTC)
                  </th>
                  <th 
                    className="px-4 py-5 text-right text-base font-medium"
                    style={{ color: '#ffffff', width: '15%' }}
                  >
                    End Time (UTC)
                  </th>
                  <th 
                    className="px-4 py-5 text-center text-base font-medium"
                    style={{ color: '#ffffff', width: '11%' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pools.length > 0 ? (
                  pools.map((pool, index) => (
                    <tr 
                      key={pool.pid} 
                      className="border-t"
                      style={{ borderColor: '#404040' }}
                    >
                      <td 
                        className="px-6 py-5 text-base"
                        style={{ color: '#ffffff' }}
                      >
                        {pool.pid}
                      </td>
                      <td className="px-4 py-5 text-right">
                        <span className="text-base font-semibold" style={{ color: pool.isActive ? '#00ff88' : '#ff6b6b' }}>
                          {pool.apr.toFixed(2)}%
                        </span>
                      </td>
                      <td 
                        className="px-4 py-5 text-base text-right"
                        style={{ color: '#ffffff' }}
                      >
                        {pool.tvl} {tokenSymbol}
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
                      <td className="px-4 py-5 text-center">
                        <button 
                          className="font-semibold px-4 py-2 rounded text-black transition-all text-sm"
                          style={{
                            background: `linear-gradient(135deg, #ffd700, #ffb347)`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, #ffed4e, #ffa726)`;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, #ffd700, #ffb347)`;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Stake
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t" style={{ borderColor: '#404040' }}>
                    <td 
                      colSpan={7}
                      className="px-6 py-8 text-center text-base"
                      style={{ color: '#888888' }}
                    >
                      No pools available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
