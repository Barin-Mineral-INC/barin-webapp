"use client";

interface BarinLogoProps {
  size?: number;
  className?: string;
}

export default function BarinLogo({ size = 32, className = "" }: BarinLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer diamond */}
      <path
        d="M16 2L30 16L16 30L2 16L16 2Z"
        fill="url(#outerGradient)"
        stroke="url(#outerStroke)"
        strokeWidth="0.5"
      />
      
      {/* Inner diamond */}
      <path
        d="M16 6L26 16L16 26L6 16L16 6Z"
        fill="url(#innerGradient)"
      />
      
      {/* Center "B" letter */}
      <path
        d="M12 8H16C18.2 8 20 9.8 20 12C20 13.1 19.6 14.1 19 14.8C19.6 15.5 20 16.5 20 17.6C20 19.8 18.2 21.6 16 21.6H12V8ZM14 10V13H16C16.6 13 17 12.6 17 12C17 11.4 16.6 11 16 11H14ZM14 15V18.6H16C16.6 18.6 17 18.2 17 17.6C17 17 16.6 16.6 16 16.6H14Z"
        fill="url(#letterGradient)"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#ffb347" />
          <stop offset="100%" stopColor="#ff8c00" />
        </linearGradient>
        
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        
        <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#ffb347" />
        </linearGradient>
        
        <linearGradient id="outerStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffed4e" />
          <stop offset="100%" stopColor="#ffa726" />
        </linearGradient>
      </defs>
    </svg>
  );
}

