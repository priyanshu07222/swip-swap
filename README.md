# 🏊‍♂️ SwimSwap - Dive into DeFi

A fun, overengineered DeFi dApp on Monad testnet that replaces traditional swap buttons with an interactive swimming pool mechanic!

## 🎯 Features

### Core Functionality
- **Drag & Drop Swimming Pool**: Users drag a potato avatar into a virtual pool to trigger swaps
- **Dive-Based Fee System**: Higher dive scores result in lower swap fees
- **Real-time Fee Calculation**: Dynamic fee calculation based on dive performance
- **0x API Integration**: Uses 0x Protocol for reliable token swaps
- **Monad Testnet Support**: Fully integrated with Monad testnet

### Dive Mechanics
- **Power Meter**: Adjustable dive height slider (0-100%)
- **Accuracy Scoring**: Drop accuracy affects final score
- **Tier System**:
  - 🥇 **Perfect Dive** (80-100): 0.1% fee
  - 🥈 **Great Dive** (60-79): 0.5% fee
  - 🥉 **Good Dive** (40-59): 1.0% fee
  - 💦 **Splash Dive** (20-39): 2.0% fee
  - 🤕 **Belly Flop** (0-19): 5.0% fee (penalty!)

### UI/UX Features
- **Splash Effects**: Animated splash effects based on dive quality
- **Leaderboard**: Track the best divers of the day
- **Glass Morphism Design**: Modern, beautiful UI with backdrop blur effects
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Powered by Framer Motion

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion
- **Web3**: Wagmi, Viem, RainbowKit
- **Swap Protocol**: 0x API
- **Blockchain**: Monad Testnet

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Monad testnet wallet (MetaMask, etc.)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd swim-swap
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

1. **WalletConnect Project ID**: Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/) and update it in `src/app/providers.tsx`

2. **Monad Testnet**: The app is configured for Monad testnet. Make sure your wallet is connected to the correct network.

## 🎮 How to Use

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your Monad testnet wallet

2. **Set Dive Power**: Use the power meter slider to set your dive height (higher = better score potential)

3. **Drag & Drop**: Drag the potato avatar 🥔 into the swimming pool

4. **Watch the Magic**: See your dive score, tier, and calculated fee

5. **Swap Tokens**: Use the swap interface to exchange tokens with your calculated fee

6. **Check Leaderboard**: View your ranking among other divers!

## 🏗️ Architecture

### Components
- `SwimmingPool.tsx`: Main pool component with drag-and-drop logic
- `SplashEffect.tsx`: Animated splash effects based on dive quality
- `DiveScore.tsx`: Power meter and dive result display
- `SwapInterface.tsx`: Token swap interface with 0x integration
- `Leaderboard.tsx`: Daily leaderboard for best divers

### Key Features
- **Dive Score Calculation**: Combines power (60%) and accuracy (40%)
- **Fee Modification**: Applies dive-based fee reduction to swaps
- **Local Storage**: Persists leaderboard data locally
- **Responsive Design**: Mobile-first approach with desktop enhancements

## 🎨 Design Philosophy

SwimSwap embraces the "overengineered" approach by:
- Making simple swaps feel like a game
- Adding personality with potato avatars and splash effects
- Creating memorable user experiences through gamification
- Balancing fun with functional DeFi mechanics

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server

### Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page
│   ├── providers.tsx       # Web3 providers setup
│   └── globals.css         # Global styles
└── components/
    ├── SwimmingPool.tsx    # Main pool component
    ├── SplashEffect.tsx    # Splash animations
    ├── DiveScore.tsx       # Power meter & results
    ├── SwapInterface.tsx   # Token swap UI
    └── Leaderboard.tsx     # Daily leaderboard
```

## 🌊 Future Enhancements

- **Multiplayer Mode**: See other users' avatars diving in real-time
- **Lifeguard Events**: Random events that override dive scores
- **NFT Rewards**: Mint NFTs for perfect dives
- **Tournament Mode**: Competitive diving tournaments
- **Sound Effects**: Audio feedback for dives and splashes

## 📝 License

MIT License - feel free to dive into the code and make it your own!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Diving! 🏊‍♂️💦**

*Remember: The best divers get the lowest fees!*