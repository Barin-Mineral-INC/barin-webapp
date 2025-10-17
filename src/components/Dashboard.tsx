"use client";

import Header from "./Header";
import PoolInfo from "./PoolInfo";
import RewardChart from "./RewardChart";
import StakeSection from "./StakeSection";
import UserInfo from "./UserInfo";
import VotingPower from "./VotingPower";

export default function Dashboard() {
  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <PoolInfo />
            <RewardChart />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <StakeSection />
            <UserInfo />
            <VotingPower />
          </div>
        </div>
      </div>
    </div>
  );
}
