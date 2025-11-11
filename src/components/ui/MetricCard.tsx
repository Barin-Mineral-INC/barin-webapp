import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  className?: string;
}

export default function MetricCard({ label, value, className = "" }: MetricCardProps) {
  return (
    <div 
      className={`p-4 lg:p-6 rounded-lg transition-colors border ${className}`}
      style={{ 
        backgroundColor: 'var(--color-cardHover)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div 
        className="text-xs lg:text-base mb-1 lg:mb-2"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </div>
      <div 
        className="text-lg lg:text-2xl font-bold"
        style={{ color: 'var(--color-foreground)' }}
      >
        {value}
      </div>
    </div>
  );
}
