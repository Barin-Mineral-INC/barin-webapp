"use client";

import Card, { CardTitle, CardContent } from "./ui/Card";
import MetricCard from "./ui/MetricCard";

export default function UserInfo() {
  return (
    <Card>
      <CardTitle>User-Specific Information</CardTitle>
      
      <CardContent className="space-y-6">
        {/* Wallet Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Wallet Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard label="Total Staked Amount" value="$12,345.67" />
            <MetricCard label="Available Balance" value="$987.65" />
          </div>
          <MetricCard label="Rewards Pending" value="$56.78" />
        </div>

        {/* Per-pool Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Per-pool Details</h3>
          
          {/* Flexible Pool */}
          <div style={{ backgroundColor: 'var(--color-card)' }} className="p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Flexible Pool</h4>
              <span className="font-semibold" style={{ color: '#00ff88' }}>APR: 15%</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--color-muted)' }}>Staked:</span>
                <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>1,000 Tokens</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)' }}>Rewards:</span>
                <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>12.34 Tokens</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)' }}>Lock Time:</span>
                <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>N/A</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)' }}>Unlock Time:</span>
                <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>N/A</span>
              </div>
            </div>
          </div>

          {/* Locked Pool */}
          <div style={{ backgroundColor: 'var(--color-card)' }} className="p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Locked Pool</h4>
              <span className="font-semibold" style={{ color: '#00aaff' }}>APY: 25%</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--color-muted)' }}>Staked:</span>
                <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>5,000 TOKEN</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)' }}>Rewards:</span>
                <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>78.90 TOKEN</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)' }}>Lock Time:</span>
                <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>30 days</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted)' }}>Unlock Time:</span>
                <span className="ml-2" style={{ color: 'var(--color-foreground)' }}>25d 10h</span>
              </div>
            </div>
            <div className="mt-3 text-sm" style={{ color: '#ff4444' }}>
              Penalty: -10% if unstaked early
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
