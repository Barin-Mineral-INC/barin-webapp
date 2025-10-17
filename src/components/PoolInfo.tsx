"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Card, { CardHeader, CardTitle, CardAction, CardContent } from "./ui/Card";
import MetricCard from "./ui/MetricCard";

export default function PoolInfo() {
  const { colors, theme } = useTheme();
  
  const metrics = [
    { label: "Total Staked", value: "$1.5B" },
    { label: "Circulating vs Staked Supply", value: "70% Staked" },
    { label: "Overall Participation", value: "25,000 Users" },
    { label: "Next Distribution", value: "2d 15h" },
  ];

  const pools = [
    {
      type: "Flexible",
      apr: "15%",
      tvl: "$500M",
      minMax: "10/100,000",
      emission: "10/day",
      health: "95% Utilized",
      healthColor: "#00ff88",
    },
    {
      type: "Locked (90 days)",
      apr: "30%",
      tvl: "$300M",
      minMax: "100/1,000,000",
      emission: "20/day",
      health: "80% Utilized",
      healthColor: "#ff8800",
    },
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
                    Pool Type
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
                    Emission Rate
                  </th>
                  <th 
                    className="px-4 py-5 text-right text-base font-medium"
                    style={{ color: '#ffffff', width: '15%' }}
                  >
                    Pool Health
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
                {pools.map((pool, index) => (
                  <tr 
                    key={index} 
                    className="border-t"
                    style={{ borderColor: '#404040' }}
                  >
                    <td 
                      className="px-6 py-5 text-base"
                      style={{ color: '#ffffff' }}
                    >
                      {pool.type}
                    </td>
                    <td className="px-4 py-5 text-right">
                      <span className="text-base font-semibold" style={{ color: pool.type === "Flexible" ? '#00ff88' : '#00aaff' }}>
                        {pool.apr}
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
                      {pool.minMax}
                    </td>
                    <td 
                      className="px-4 py-5 text-base text-right"
                      style={{ color: '#ffffff' }}
                    >
                      {pool.emission}
                    </td>
                    <td className="px-4 py-5 text-right">
                      <span className="text-base font-semibold" style={{ color: pool.healthColor }}>
                        {pool.health}
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
