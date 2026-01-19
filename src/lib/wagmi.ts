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
  STAKING: '0xC67B18cE4368B31f5D0c65eDD941244A44e58C1A' as const,
  BARIN_TOKEN: '0x559f11777626381e1566fedcf59f454e005316d1' as const,
} as const;

