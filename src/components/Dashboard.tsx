"use client";

import Header from "./Header";
import PoolInfo from "./PoolInfo";
import RewardChart from "./RewardChart";
import StakeSection from "./StakeSection";
import UserInfo from "./UserInfo";
import VotingPower from "./VotingPower";
import NotificationContainer from "./NotificationContainer";

export default function Dashboard() {
  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <Header />
      
      {/* Mobile Layout */}
      <div className="lg:hidden px-4 py-6 space-y-4">
        <PoolInfo />
        <RewardChart />
        <UserInfo />
        <StakeSection />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block container mx-auto px-2 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Left Column - 70% */}
          <div className="lg:col-span-7 space-y-8">
            <PoolInfo />
            <RewardChart />
          </div>
          
          {/* Right Column - 30% */}
          <div className="lg:col-span-3 space-y-8">
            <StakeSection />
            <UserInfo />
            <VotingPower />
          </div>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
}
