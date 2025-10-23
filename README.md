# Barin Staking Dashboard

A modern DeFi staking dashboard built with Next.js, wagmi, and RainbowKit for the Polygon Amoy testnet.

## Features

- 🔗 **Wallet Connection**: Connect with MetaMask, WalletConnect, and other popular wallets
- 📊 **Real-time Data**: Live staking data from smart contracts
- 💰 **Stake/Unstake**: Easy token staking and unstaking functionality
- 🎁 **Claim Rewards**: Claim your staking rewards
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🌙 **Dark Theme**: Modern dark theme with smooth transitions

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn or npm
- A WalletConnect Project ID (get one from [WalletConnect Cloud](https://cloud.walletconnect.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd barin-webapp
```

2. Install dependencies:
```bash
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your WalletConnect Project ID to `.env.local`:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id-here
```

5. Run the development server:
```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button in the header
2. **View Data**: See your token balance, staking info, and rewards
3. **Stake Tokens**: Enter an amount and click "Stake" to stake your Barin tokens
4. **Claim Rewards**: Click "Claim Rewards" to claim your earned rewards
5. **Unstake**: Enter an amount and click "Unstake" to withdraw your tokens

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Web3**: wagmi v2, viem
- **Wallet**: RainbowKit
- **State Management**: Zustand
- **TypeScript**: Full TypeScript support

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

### Adding New Features

1. Create components in `src/components/`
2. Add custom hooks in `src/hooks/`
3. Update contract ABIs in `src/lib/contracts.ts`
4. Add new pages in `src/app/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
