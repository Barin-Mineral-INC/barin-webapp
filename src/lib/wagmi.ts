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
  STAKING: '0xDdB4b07b19c409B4634Ffff8Be83C49Ef27b6355' as const,
  BARIN_TOKEN: '0x9504EC959a6675139863FfBBD826FCe7BAEF9Ad2' as const,
} as const;

