// Export all stores
export * from './appStore';
export * from './stakingStore';
export * from './themeStore';

// Re-export commonly used hooks for convenience
export { 
  useAppStore, 
  useNotifications, 
  useModals, 
  useLoading, 
  useError,
  useAddNotification,
  useRemoveNotification,
  useAddModal,
  useRemoveModal,
  useSetLoading,
  useSetError,
  useClearError
} from './appStore';
export { 
  useStakingStore, 
  useTransactions, 
  useStakingPreferences, 
  useStakeAmount, 
  useSetStakeAmount,
  useClearStakeAmount,
  useBestPoolId,
  useSetBestPoolId,
  useAddTransaction,
  useUpdateTransaction,
  useRemoveTransaction,
  useRecentActivity, 
  useStakingStats, 
  useQuickStakeAmounts 
} from './stakingStore';
export { 
  useThemeStore, 
  useTheme, 
  useChain, 
  useColors, 
  useIsDark, 
  useIsLight, 
  useMounted,
  useSetTheme,
  useToggleTheme,
  useSetChain
} from './themeStore';
