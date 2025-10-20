import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonAmoy } from 'wagmi/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'Barin Staking Dashboard',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
  },
});

// Contract addresses
export const CONTRACTS = {
  STAKING: '0x611B40350e89063B3d0eb5D8349f57337F62E2b8' as const,
  BARIN_TOKEN: '0x38FE57B61780B6B4E60aF0BFd7Fd791229D63a34' as const,
} as const;

