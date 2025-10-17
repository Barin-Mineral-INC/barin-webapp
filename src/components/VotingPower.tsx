"use client";

import Card, { CardTitle, CardContent } from "./ui/Card";

export default function VotingPower() {
  return (
    <Card>
      <CardTitle>Voting Power</CardTitle>
      
      <CardContent>
        <div className="text-center">
          <div className="text-sm mb-2" style={{ color: 'var(--color-muted)' }}>Total Voting Power</div>
          <div className="text-4xl font-bold" style={{ color: 'var(--color-foreground)' }}>1,500 VP</div>
        </div>
      </CardContent>
    </Card>
  );
}
