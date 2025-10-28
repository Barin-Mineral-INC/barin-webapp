"use client";

import { useState } from 'react';
import Modal, { ModalFooter } from './ui/Modal';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { STAKING_ABI } from '@/lib/contracts';
import { CONTRACTS } from '@/lib/wagmi';
import { parseUnits } from 'ethers';
import { useAppStore } from '@/stores';

interface AddPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPoolModal({ isOpen, onClose, onSuccess }: AddPoolModalProps) {
  const { isConnected, chain } = useAccount();
  const { addNotification } = useAppStore();
  
  // Form state
  const [formData, setFormData] = useState({
    rewardPerSec: '',
    minStake: '',
    endTime: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contract write hook
  const { 
    writeContract, 
    data: hash,
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Calculate minimum end time (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.rewardPerSec || parseFloat(formData.rewardPerSec) <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'Reward per second must be greater than 0',
      });
      return false;
    }

    if (!formData.minStake || parseFloat(formData.minStake) <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'Minimum stake must be greater than 0',
      });
      return false;
    }

    if (!formData.endTime) {
      addNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'End time is required',
      });
      return false;
    }

    const endTimeTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    if (endTimeTimestamp <= currentTimestamp) {
      addNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'End time must be in the future',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      addNotification({
        type: 'error',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet first',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert values to proper format
      // Assuming 18 decimals for the token
      const rewardPerSecWei = parseUnits(formData.rewardPerSec, 18);
      const minStakeWei = parseUnits(formData.minStake, 18);
      const endTimeTimestamp = BigInt(Math.floor(new Date(formData.endTime).getTime() / 1000));
      const accRewardPerShareWei = BigInt('0'); // Always start at 0

      // Call the contract
      writeContract({
        address: CONTRACTS.STAKING as `0x${string}`,
        abi: STAKING_ABI,
        functionName: 'addPool',
        args: [
          BigInt(rewardPerSecWei.toString()),
          BigInt(minStakeWei.toString()),
          endTimeTimestamp,
          accRewardPerShareWei,
        ],
      });

      addNotification({
        type: 'info',
        title: 'Transaction Submitted',
        message: 'Adding new pool... Please wait for confirmation.',
      });

    } catch (error) {
      console.error('Error adding pool:', error);
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: error instanceof Error ? error.message : 'Failed to add pool',
      });
      setIsSubmitting(false);
    }
  };

  // Handle transaction success
  if (isConfirmed && isSubmitting) {
    addNotification({
      type: 'success',
      title: 'Pool Added Successfully',
      message: 'The new staking pool has been created',
    });
    setIsSubmitting(false);
    setFormData({
      rewardPerSec: '',
      minStake: '',
      endTime: '',
    });
    
    // Call the success callback to refresh pool data
    if (onSuccess) {
      onSuccess();
    }
    
    onClose();
  }

  // Handle transaction error
  if (writeError && isSubmitting) {
    addNotification({
      type: 'error',
      title: 'Transaction Failed',
      message: writeError.message,
    });
    setIsSubmitting(false);
  }

  const isLoading = isWritePending || isConfirming || isSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Pool" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Reward Per Second */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Reward Per Second
              <span className="ml-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                (tokens distributed per second)
              </span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="e.g., 0.001"
              value={formData.rewardPerSec}
              onChange={(e) => handleInputChange('rewardPerSec', e.target.value)}
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{
                backgroundColor: '#333333',
                border: '1px solid #404040',
                color: 'var(--color-foreground)',
              }}
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-muted)' }}>
              Amount of reward tokens distributed to stakers per second
            </p>
          </div>

          {/* Minimum Stake */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Minimum Stake Amount
              <span className="ml-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                (minimum tokens required to stake)
              </span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="e.g., 100"
              value={formData.minStake}
              onChange={(e) => handleInputChange('minStake', e.target.value)}
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{
                backgroundColor: '#333333',
                border: '1px solid #404040',
                color: 'var(--color-foreground)',
              }}
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-muted)' }}>
              Minimum amount of tokens users must stake to participate
            </p>
          </div>

          {/* End Time */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Pool End Time
              <span className="ml-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                (when rewards stop)
              </span>
            </label>
            <input
              type="datetime-local"
              min={getMinDateTime()}
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{
                backgroundColor: '#333333',
                border: '1px solid #404040',
                color: 'var(--color-foreground)',
              }}
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-muted)' }}>
              Timestamp when the pool stops distributing rewards
            </p>
          </div>

          {/* Info Box */}
          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 flex-shrink-0 mt-0.5" 
                style={{ color: 'var(--color-secondary)' }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  Important Information
                </p>
                <ul className="mt-2 text-xs space-y-1" style={{ color: 'var(--color-muted)' }}>
                  <li>• Ensure you have sufficient admin privileges to add pools</li>
                  <li>• The contract must have enough reward tokens to distribute</li>
                  <li>• Pool parameters cannot be easily changed after creation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-cardHover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #ffd700, #ffb347)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffed4e, #ffa726)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ffd700, #ffb347)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }
            }}
            disabled={isLoading || !isConnected}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isConfirming ? 'Confirming...' : 'Submitting...'}
              </span>
            ) : (
              'Add Pool'
            )}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

