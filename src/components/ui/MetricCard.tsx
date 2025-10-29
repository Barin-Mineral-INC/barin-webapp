import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  className?: string;
}

export default function MetricCard({ label, value, className = "" }: MetricCardProps) {
  return (
    <div 
      className={`p-4 lg:p-6 rounded-lg transition-colors ${className}`}
      style={{ backgroundColor: '#1f1f1f' }}
    >
      <div 
        className="text-xs lg:text-base mb-1 lg:mb-2"
        style={{ color: '#cccccc' }}
      >
        {label}
      </div>
      <div 
        className="text-lg lg:text-2xl font-bold"
        style={{ color: '#ffffff' }}
      >
        {value}
      </div>
    </div>
  );
}
