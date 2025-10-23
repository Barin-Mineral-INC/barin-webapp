import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Transaction {
  hash: string;
  type: 'stake' | 'unstake' | 'claim';
  amount: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  blockNumber?: number;
}

export interface StakingPreferences {
  autoApprove: boolean;
  slippageTolerance: number;
  gasPrice: 'slow' | 'standard' | 'fast';
  notifications: {
    onStake: boolean;
    onUnstake: boolean;
    onClaim: boolean;
    onError: boolean;
  };
}

interface StakingState {
  // Transaction history
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'timestamp'>) => void;
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void;
  removeTransaction: (hash: string) => void;
  clearTransactions: () => void;

  // User preferences
  preferences: StakingPreferences;
  updatePreferences: (preferences: Partial<StakingPreferences>) => void;
  resetPreferences: () => void;

  // Staking form state
  stakeAmount: string;
  setStakeAmount: (amount: string) => void;
  clearStakeAmount: () => void;

  // Best pool recommendation
  bestPoolId: number | null;
  setBestPoolId: (poolId: number | null) => void;

  // Recent activity
  recentActivity: {
    lastStake?: Transaction;
    lastUnstake?: Transaction;
    lastClaim?: Transaction;
  };
  updateRecentActivity: (transaction: Transaction) => void;

  // Statistics
  stats: {
    totalStaked: number;
    totalRewards: number;
    totalTransactions: number;
    averageStakeAmount: number;
  };
  updateStats: (stats: Partial<StakingState['stats']>) => void;

  // Quick actions
  quickStakeAmounts: number[];
  setQuickStakeAmounts: (amounts: number[]) => void;
  addQuickStakeAmount: (amount: number) => void;
  removeQuickStakeAmount: (amount: number) => void;
}

const defaultPreferences: StakingPreferences = {
  autoApprove: false,
  slippageTolerance: 0.5, // 0.5%
  gasPrice: 'standard',
  notifications: {
    onStake: true,
    onUnstake: true,
    onClaim: true,
    onError: true,
  },
};

export const useStakingStore = create<StakingState>()(
  devtools(
    persist(
      (set, get) => ({
        // Transaction history
        transactions: [],
        addTransaction: (transaction) => {
          const newTransaction: Transaction = {
            ...transaction,
            timestamp: Date.now(),
          };
          set((state) => ({
            transactions: [newTransaction, ...state.transactions].slice(0, 100), // Keep last 100
          }));
          get().updateRecentActivity(newTransaction);
        },
        updateTransaction: (hash, updates) => {
          set((state) => ({
            transactions: state.transactions.map((tx) =>
              tx.hash === hash ? { ...tx, ...updates } : tx
            ),
          }));
        },
        removeTransaction: (hash) => {
          set((state) => ({
            transactions: state.transactions.filter((tx) => tx.hash !== hash),
          }));
        },
        clearTransactions: () => {
          set({ transactions: [] });
        },

        // User preferences
        preferences: defaultPreferences,
        updatePreferences: (preferences) => {
          set((state) => ({
            preferences: { ...state.preferences, ...preferences },
          }));
        },
        resetPreferences: () => {
          set({ preferences: defaultPreferences });
        },

        // Staking form state
        stakeAmount: '',
        setStakeAmount: (amount) => {
          set({ stakeAmount: amount });
        },
        clearStakeAmount: () => {
          set({ stakeAmount: '' });
        },

        // Best pool recommendation
        bestPoolId: null,
        setBestPoolId: (poolId) => {
          set({ bestPoolId: poolId });
        },

        // Recent activity
        recentActivity: {},
        updateRecentActivity: (transaction) => {
          set((state) => ({
            recentActivity: {
              ...state.recentActivity,
              [`last${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`]: transaction,
            },
          }));
        },

        // Statistics
        stats: {
          totalStaked: 0,
          totalRewards: 0,
          totalTransactions: 0,
          averageStakeAmount: 0,
        },
        updateStats: (stats) => {
          set((state) => ({
            stats: { ...state.stats, ...stats },
          }));
        },

        // Quick actions
        quickStakeAmounts: [100, 500, 1000, 5000],
        setQuickStakeAmounts: (amounts) => {
          set({ quickStakeAmounts: amounts });
        },
        addQuickStakeAmount: (amount) => {
          set((state) => ({
            quickStakeAmounts: [...state.quickStakeAmounts, amount].sort((a, b) => a - b),
          }));
        },
        removeQuickStakeAmount: (amount) => {
          set((state) => ({
            quickStakeAmounts: state.quickStakeAmounts.filter((a) => a !== amount),
          }));
        },
      }),
      {
        name: 'staking-store',
        partialize: (state) => ({
          preferences: state.preferences,
          quickStakeAmounts: state.quickStakeAmounts,
          transactions: state.transactions.slice(0, 20), // Persist only last 20 transactions
        }),
      }
    ),
    {
      name: 'staking-store',
    }
  )
);

// Selectors for better performance
export const useTransactions = () => useStakingStore((state) => state.transactions);
export const useStakingPreferences = () => useStakingStore((state) => state.preferences);
export const useStakeAmount = () => useStakingStore((state) => state.stakeAmount);
export const useBestPoolId = () => useStakingStore((state) => state.bestPoolId);
export const useRecentActivity = () => useStakingStore((state) => state.recentActivity);
export const useStakingStats = () => useStakingStore((state) => state.stats);
export const useQuickStakeAmounts = () => useStakingStore((state) => state.quickStakeAmounts);

// Action selectors
export const useSetStakeAmount = () => useStakingStore((state) => state.setStakeAmount);
export const useClearStakeAmount = () => useStakingStore((state) => state.clearStakeAmount);
export const useSetBestPoolId = () => useStakingStore((state) => state.setBestPoolId);
export const useAddTransaction = () => useStakingStore((state) => state.addTransaction);
export const useUpdateTransaction = () => useStakingStore((state) => state.updateTransaction);
export const useRemoveTransaction = () => useStakingStore((state) => state.removeTransaction);
