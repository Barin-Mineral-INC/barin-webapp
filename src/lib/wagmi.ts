import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon } from 'wagmi/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'Barin Staking Dashboard',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [polygon],
  transports: {
    [polygon.id]: http('https://polygon-rpc.com'),
  },
});

// Contract addresses
export const CONTRACTS = {
  STAKING: '0x6f66cb1d37ae6f200345396dc6c564567e396f01' as const,
  BARIN_TOKEN: '0x850e479ea10a725f564cb6d0fc00cb1e86bd1832' as const,
} as const;

