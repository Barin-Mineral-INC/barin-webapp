"use client";

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 transition-opacity"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal Content */}
      <div 
        className={`relative w-full ${sizeClasses[size]} rounded-lg shadow-2xl transition-all`}
        style={{ 
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 
            className="text-2xl font-bold"
            style={{ color: 'var(--color-foreground)' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-cardHover)';
              e.currentTarget.style.color = 'var(--color-foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-muted)';
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div 
      className={`flex items-center justify-end gap-3 pt-6 mt-6 border-t ${className}`}
      style={{ borderColor: 'var(--color-border)' }}
    >
      {children}
    </div>
  );
}

