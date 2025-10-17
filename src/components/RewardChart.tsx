"use client";

import Card, { CardTitle, CardContent } from "./ui/Card";

export default function RewardChart() {
  return (
    <Card>
      <CardTitle>Reward Distribution Chart</CardTitle>
      
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Donut Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#333333"
                strokeWidth="8"
              />
              
              {/* Flexible Pool segment (small black) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#000000"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * 0.15} ${2 * Math.PI * 40}`}
                strokeDashoffset="0"
              />
              
              {/* Locked Pool segment (brown/bronze) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#cd7f32"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * 0.25} ${2 * Math.PI * 40}`}
                strokeDashoffset={`-${2 * Math.PI * 40 * 0.15}`}
              />
              
              {/* Unclaimed segment (gold) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ffd700"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * 0.6} ${2 * Math.PI * 40}`}
                strokeDashoffset={`-${2 * Math.PI * 40 * 0.4}`}
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white">+148</div>
              <div className="text-sm text-gray-400">Tokens</div>
              <div className="text-xs text-gray-500 mt-1">Total Rewards</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="ml-8 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-black rounded"></div>
              <span className="text-white">Flexible Pool</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#cd7f32] rounded"></div>
              <span className="text-white">Locked Pool</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#ffd700] rounded"></div>
              <span className="text-white">Unclaimed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
