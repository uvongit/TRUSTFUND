# 🌟 TrustFund - Decentralized Crowdfunding Platform

A modern, transparent blockchain-based crowdfunding platform built with Next.js, Solidity, and IPFS. TrustFund enables direct peer-to-peer fundraising with complete transparency and zero platform fees.

![Next.js](https://img.shields.io/badge/Next.js-12.1.0-black)
![Solidity](https://img.shields.io/badge/Solidity-0.8.10-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🔗 Blockchain-Powered**: Built on Ethereum/Polygon for transparent, immutable transactions
- **💰 Zero Platform Fees**: Direct donations from supporters to campaign owners
- **📦 Decentralized Storage**: Campaign data stored on IPFS via Pinata Cloud
- **🎨 Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **🔐 Secure**: MetaMask integration for secure wallet connections
- **📊 Real-time Updates**: Live campaign progress tracking and donation history
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **⚡ Fast Loading**: Optimized performance with Next.js ISR (Incremental Static Regeneration)
- **🎯 Smart Categories**: Organized campaigns by Health, Education, and Animal welfare
- **🔄 Auto-refresh**: Campaign data updates every 10 seconds
- **🌙 Theme Support**: Beautiful dark and light mode with smooth transitions
- **♿ Accessible**: WCAG compliant with keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14.x
- MetaMask browser extension
- Hardhat (for smart contract development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TRUSTFUND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   - `NEXT_PUBLIC_RPC_URL`: Your blockchain RPC endpoint
   - `NEXT_PUBLIC_ADDRESS`: Deployed CampaignFactory contract address
   - `PINATA_API_KEY`: Your Pinata API key
   - `PINATA_SECRET_API_KEY`: Your Pinata secret key

4. **Start local blockchain** (for development)
   ```bash
   npx hardhat node
   ```

5. **Deploy smart contracts** (in a new terminal)
   ```bash
   npm run deploy:local
   ```
   
   Copy the deployed contract address to your `.env.local` file.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
TRUSTFUND/
├── contracts/              # Solidity smart contracts
│   └── Campaign.sol       # CampaignFactory & Campaign contracts
├── pages/                 # Next.js pages
│   ├── index.js          # Homepage with campaign listings
│   ├── [address].js      # Campaign detail page
│   ├── dashboard.js      # User's campaigns dashboard
│   ├── createcampaign.js # Create new campaign
│   └── api/              # API routes
│       └── upload.js     # IPFS upload endpoint
├── components/           # React components
│   ├── Form/            # Campaign creation form
│   └── layout/          # Layout components (Header, themes)
├── artifacts/           # Compiled smart contracts
├── scripts/             # Deployment scripts
└── style/              # Global styles
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 12 with React 17
- **Styling**: Styled Components + Material-UI
- **Web3**: Ethers.js v5.5.4
- **State Management**: React Context API
- **Notifications**: React Toastify
- **Loading States**: React Loader Spinner

### Backend
- **API**: Next.js API Routes
- **File Upload**: Formidable
- **Storage**: IPFS via Pinata Cloud

### Blockchain
- **Smart Contracts**: Solidity 0.8.10
- **Development**: Hardhat
- **Testing**: Waffle + Chai
- **Networks**: Ethereum, Polygon (configurable)

## 📝 Usage Guide

### For Campaign Creators

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Create Campaign**: Navigate to "Create Campaign"
3. **Fill Details**: 
   - Campaign title
   - Compelling story
   - Funding goal (in Matic)
   - Category (Health/Education/Animal)
   - Campaign image
4. **Upload to IPFS**: Click "Upload Files to IPFS"
5. **Deploy**: Click "Start Campaign" and confirm the transaction
6. **Share**: Share your unique campaign URL with supporters

### For Donors

1. **Browse Campaigns**: View all campaigns on the homepage
2. **Filter**: Use category filters to find campaigns
3. **View Details**: Click on a campaign to see full details
4. **Donate**: Enter amount and click "Contribute Now"
5. **Confirm**: Approve the transaction in MetaMask
6. **Track**: View your donation in the campaign's history

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run lint         # Run ESLint

# Production
npm run build        # Build for production
npm start           # Start production server

# Smart Contracts
npm run deploy:local    # Deploy to local Hardhat network
npm run deploy:sepolia  # Deploy to Sepolia testnet
npm run verify:sepolia  # Verify contract on Sepolia

# Testing
npx hardhat test     # Run smart contract tests
npx hardhat node     # Start local blockchain
```

## 🌐 Deployment

### Smart Contracts

1. **Configure Network**: Update `hardhat.config.js` with your network settings
2. **Deploy**: Run deployment script for your target network
3. **Verify**: Verify contract on block explorer (optional)

### Frontend

Deploy to Vercel (recommended):

```bash
vercel deploy
```

Or build and deploy to any hosting platform:

```bash
npm run build
npm start
```

**Important**: Set environment variables in your hosting platform's dashboard.

## 🔐 Security Considerations

- **Environment Variables**: Never commit `.env.local` file to version control
- **Private Keys**: Keep private keys secure, use hardware wallets for mainnet
- **Input Validation**: All user inputs are validated on both client and server
- **Error Handling**: Comprehensive error handling prevents information leakage
- **Testing**: Thoroughly test on testnet before mainnet deployment
- **Rate Limiting**: Implement rate limiting for API routes in production
- **Smart Contract Security**: Contracts use secure patterns and have been optimized
- **IPFS Security**: Files are content-addressed and stored on decentralized network

## 📸 Screenshots

### Homepage & Campaign Listings

<div align="center">

<img src="./screenshots/Screenshot 2025-11-09 200605.png" alt="Homepage" width="800"/>

*Main homepage showcasing active campaigns*

</div>

<div align="center">

<img src="./screenshots/Screenshot 2025-11-09 200614.png" alt="Campaign Grid" width="800"/>

*Campaign grid view with category filters*

</div>

### Campaign Details

<table>
  <tr>
    <td width="50%">
      <img src="./screenshots/Screenshot 2025-11-09 200622.png" alt="Campaign Details 1" width="100%"/>
      <p align="center"><em>Campaign detail page - Overview</em></p>
    </td>
    <td width="50%">
      <img src="./screenshots/Screenshot 2025-11-09 200634.png" alt="Campaign Details 2" width="100%"/>
      <p align="center"><em>Campaign progress and donation section</em></p>
    </td>
  </tr>
</table>

### Create Campaign

<div align="center">

<img src="./screenshots/Screenshot 2025-11-09 200754.png" alt="Create Campaign Form" width="800"/>

*Campaign creation form with IPFS upload*

</div>

<table>
  <tr>
    <td width="50%">
      <img src="./screenshots/Screenshot 2025-11-09 200804.png" alt="Form Details" width="100%"/>
      <p align="center"><em>Campaign form - Details section</em></p>
    </td>
    <td width="50%">
      <img src="./screenshots/Screenshot 2025-11-09 200816.png" alt="Form Upload" width="100%"/>
      <p align="center"><em>IPFS file upload interface</em></p>
    </td>
  </tr>
</table>

### Dashboard & User Interface

<div align="center">

<img src="./screenshots/Screenshot 2025-11-09 201323.png" alt="User Dashboard" width="800"/>

*User dashboard showing created campaigns*

</div>

<table>
  <tr>
    <td width="33.33%">
      <img src="./screenshots/Screenshot 2025-11-09 201336.png" alt="UI Component 1" width="100%"/>
      <p align="center"><em>Navigation and theme toggle</em></p>
    </td>
    <td width="33.33%">
      <img src="./screenshots/Screenshot 2025-11-09 201342.png" alt="UI Component 2" width="100%"/>
      <p align="center"><em>Wallet connection interface</em></p>
    </td>
    <td width="33.33%">
      <img src="./screenshots/Screenshot 2025-11-09 201350.png" alt="UI Component 3" width="100%"/>
      <p align="center"><em>Campaign category view</em></p>
    </td>
  </tr>
</table>

### Additional Features

<table>
  <tr>
    <td width="50%">
      <img src="./screenshots/Screenshot 2025-11-09 201408.png" alt="Feature 1" width="100%"/>
      <p align="center"><em>Dark mode interface</em></p>
    </td>
    <td width="50%">
      <img src="./screenshots/Screenshot 2025-11-09 201902.png" alt="Feature 2" width="100%"/>
      <p align="center"><em>Responsive mobile view</em></p>
    </td>
  </tr>
</table>

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Hardhat for smart contract development tools
- Pinata for IPFS infrastructure
- Material-UI for beautiful components
- The Ethereum and Polygon communities

## 📞 Support

- **Documentation**: Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- **Production**: Use [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md) before deployment
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Security**: Report security vulnerabilities privately via GitHub Security tab

## 🚀 Production Status

✅ **Ready for Production**
- All components tested and optimized
- Security best practices implemented
- Comprehensive error handling
- Production-ready documentation
- Clean, maintainable codebase

---

**Built with ❤️ using Web3 technologies**
