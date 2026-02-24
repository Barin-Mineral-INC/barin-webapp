import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon } from 'wagmi/chains';
import { http, fallback } from 'viem';

export const config = getDefaultConfig({
  appName: 'Barin Staking Dashboard',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [polygon],
  transports: {
    [polygon.id]: fallback([
      http('https://polygon.drpc.org'),
      http('https://polygon.lava.build'),
      http('https://polygon.gateway.tenderly.co'),
    ]),
  },
});

// Contract addresses
export const CONTRACTS = {
  STAKING: '0xc67b18ce4368b31f5d0c65edd941244a44e58c1a' as const,
  BARIN_TOKEN: '0x559f11777626381e1566fedcf59f454e005316d1' as const,
} as const;

