import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export default function Card({ children, className = "", title, action }: CardProps) {
  return (
    <div 
      className={`rounded-lg transition-colors ${className}`}
      style={{ backgroundColor: 'var(--color-card)' }}
    >
      {(title || action) && (
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {title && (
            <h2 
              className="text-2xl font-bold"
              style={{ color: 'var(--color-foreground)' }}
            >
              {title}
            </h2>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h2 
      className={`text-2xl font-bold ${className}`}
      style={{ color: 'var(--color-foreground)' }}
    >
      {children}
    </h2>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

interface CardActionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardAction({ children, className = "" }: CardActionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
