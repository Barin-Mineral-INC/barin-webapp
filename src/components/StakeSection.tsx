"use client";

import { useState } from "react";
import Card, { CardTitle, CardContent } from "./ui/Card";

export default function StakeSection() {
  const [amount, setAmount] = useState("");

  return (
    <Card>
      <CardTitle>Stake Tokens</CardTitle>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter amount to stake"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{
                backgroundColor: '#333333',
                border: '1px solid #404040',
                color: 'var(--color-foreground)',
              }}
            />
          </div>
          
          <button 
            className="w-full font-bold py-3 rounded-lg text-black transition-all"
            style={{
              background: `linear-gradient(135deg, #ffd700, #ffb347)`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, #ffed4e, #ffa726)`;
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, #ffd700, #ffb347)`;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            Stake
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
