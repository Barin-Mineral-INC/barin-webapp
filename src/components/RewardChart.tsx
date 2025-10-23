"use client";

import { useMemo } from "react";
import Card, { CardTitle, CardContent } from "./ui/Card";
import { useStaking } from "@/hooks/useStaking";

// Color palette matching the design - cycles through these colors for pools
const POOL_COLORS = [
  '#000000',  // Black
  '#cd7f32',  // Bronze/Brown
  '#ffd700',  // Gold
  '#ff8c00',  // Dark Orange
  '#4169e1',  // Royal Blue
  '#32cd32',  // Lime Green
  '#ff1493',  // Deep Pink
  '#00ced1',  // Dark Turquoise
  '#ff6347',  // Tomato
  '#9370db',  // Medium Purple
];

interface PoolSegment {
  poolId: number;
  poolName: string;
  totalStaked: string;
  percentage: number;
  color: string;
}

export default function RewardChart() {
  const { pools, tokenDecimals } = useStaking();

  const chartData = useMemo(() => {
    if (!pools || pools.length === 0) {
      return {
        segments: [],
        totalStaked: '0.00',
      };
    }

    // Calculate total staked across all pools
    const totalStakedBigInt = pools.reduce((sum, pool) => sum + pool.totalStaked, BigInt(0));
    const totalStakedNum = Number(totalStakedBigInt) / Math.pow(10, tokenDecimals || 18);

    // Create segments for each pool (including pools with 0 stake)
    const segments: PoolSegment[] = pools.map((pool, index) => {
      const stakedNum = Number(pool.totalStaked) / Math.pow(10, tokenDecimals || 18);
      const percentage = totalStakedNum > 0 ? (stakedNum / totalStakedNum) * 100 : 0;
      
      return {
        poolId: pool.pid,
        poolName: `Pool ${pool.pid + 1}`,
        totalStaked: stakedNum.toFixed(2),
        percentage,
        color: POOL_COLORS[pool.pid % POOL_COLORS.length],
      };
    });

    return {
      segments,
      totalStaked: totalStakedNum.toFixed(2),
    };
  }, [pools, tokenDecimals]);

  // Calculate stroke dasharray and dashoffset for each segment
  const renderSegments = () => {
    const radius = 35; // Thicker donut
    const circumference = 2 * Math.PI * radius;
    let cumulativeOffset = 0;

    return chartData.segments.map((segment, index) => {
      const segmentLength = (segment.percentage / 100) * circumference;
      const dasharray = `${segmentLength} ${circumference}`;
      const dashoffset = -cumulativeOffset;
      
      cumulativeOffset += segmentLength;

      return (
        <circle
          key={segment.poolId}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={segment.color}
          strokeWidth="20" // Thicker stroke matching design
          strokeDasharray={dasharray}
          strokeDashoffset={dashoffset}
          strokeLinecap="butt"
        />
      );
    });
  };

  return (
    <Card>
      <CardTitle>Total Staked Distribution Chart</CardTitle>
      
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-80 h-80">
            {/* Donut Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="20"
              />
              
              {/* Dynamic pool segments */}
              {renderSegments()}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-white">{chartData.totalStaked}</div>
              <div className="text-sm text-gray-400 mt-1">Tokens</div>
              <div className="text-xs text-gray-500 mt-1">Total Staked</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="ml-12 space-y-3">
            {chartData.segments.length > 0 ? (
              chartData.segments.map((segment) => (
                <div key={segment.poolId} className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded" 
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{segment.poolName}</span>
                    <span className="text-gray-400 text-sm">
                      {segment.totalStaked} ({segment.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No staked pools yet</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
