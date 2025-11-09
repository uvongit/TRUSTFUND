// import styled from "styled-components";
// import { ethers } from "ethers";
// import { useState } from "react";


// const networks = {
//   polygon: {
//     chainId: `0x${Number(80001).toString(16)}`,
//     chainName: "Polygon Testnet",
//     nativeCurrency: {
//       name: "MATIC",
//       symbol: "MATIC",
//       decimals: 18,
//     },
//     rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
//     blockExplorerUrls: ["https://amoy.polygonscan.com/"],
//   },
// };


// const Wallet = () => {
//   const [address, setAddress] = useState("");
//   const [balance, setBalance] = useState("");


//   const connectWallet = async () => {
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
//     if (provider.network !== "matic") {
//       await window.ethereum.request({
//         method: "wallet_addEthereumChain",
//         params: [
//           {
//             ...networks["polygon"],
//           },
//         ],
//       });
//     } 
//       const account = provider.getSigner();
//       const Address = await account.getAddress();
//       setAddress(Address);
//       const Balance = ethers.utils.formatEther(await account.getBalance());
//       setBalance(Balance);
    
//   };

//   return (
//     <ConnectWalletWrapper onClick={connectWallet}>
//       {balance == '' ? <Balance></Balance> : <Balance>{balance.slice(0,4)} Matic</Balance> }
//       {address == '' ? <Address>Connect Wallet</Address> : <Address>{address.slice(0,6)}...{address.slice(39)}</Address>}
//     </ConnectWalletWrapper>
//   );
// };

// const ConnectWalletWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   background-color: ${(props) => props.theme.bgDiv};
//   padding: 5px 9px;
//   height: 100%;
//   color: ${(props) => props.theme.color};
//   border-radius: 10px;
//   margin-right: 15px;
//   font-family: 'Roboto';
//   font-weight: bold;
//   font-size: small;
//   cursor: pointer;
// `;

// const Address = styled.h2`
//     background-color: ${(props) => props.theme.bgSubDiv};
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 0 5px 0 5px;
//     border-radius: 10px;
// `

// const Balance = styled.h2`
//     display: flex;
//     height: 100%;
//     align-items: center;
//     justify-content: center;
//     margin-right: 5px;
// `

// export default Wallet;

import styled from "styled-components";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

// Local Hardhat/Ganache network config
const LOCAL_NETWORK = {
  chainId: '0x7A69', // 31337 in hex (default Hardhat chain ID)
  chainName: 'Hardhat 1',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: [],
};

const AMOY_NETWORK = {
  chainId: '0x13882', // 80002 in hex
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
};

// Add Ethereum mainnet config if you want to support it
const ETHEREUM_MAINNET = {
  chainId: '0x1',
  chainName: 'Ethereum Mainnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.infura.io/v3/'],
  blockExplorerUrls: ['https://etherscan.io/'],
};

const Wallet = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('');

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkConnection();
    // Add a small delay to ensure MetaMask is fully loaded
    setTimeout(() => {
      checkConnection();
    }, 1000);
  }, []);

  // Listen for account/network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setAddress('');
      setBalance('');
      setCurrentNetwork('');
    } else {
      // Account changed
      setAddress(accounts[0]);
      updateBalance();
    }
  };

  const handleChainChanged = async (chainId) => {
    
    // Reset state first
    setBalance('');
    setCurrentNetwork('');
    
    // Update network info
    await updateNetworkInfo(chainId);
    
    // Reload balance when network changes
    setTimeout(async () => {
      await updateBalance();
    }, 500);
  };

  const updateNetworkInfo = async (chainId) => {
    
    // Convert chainId to number for comparison - handle both hex and decimal
    let chainIdNum;
    if (typeof chainId === 'string') {
      if (chainId.startsWith('0x')) {
        chainIdNum = parseInt(chainId, 16);
      } else {
        chainIdNum = parseInt(chainId, 10);
      }
    } else {
      chainIdNum = chainId;
    }
    
    
    // Check for Hardhat/Local networks (multiple possible IDs)
    if (chainIdNum === 31337 || chainIdNum === 1337 || chainId === '0x7A69' || chainId === '0x539') {
      setCurrentNetwork('Local Hardhat');
    } else if (chainIdNum === 80002 || chainId === '0x13882') {
      setCurrentNetwork('Polygon Amoy');
    } else if (chainIdNum === 1 || chainId === '0x1') {
      setCurrentNetwork('Ethereum');
    } else {
      setCurrentNetwork(`Unknown Network (${chainIdNum})`);
    }
  };

  const checkConnection = async () => {
    if (!window.ethereum) {
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        const currentAccount = accounts[0];
        setAddress(currentAccount);
        
        // Get network info first
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        await updateNetworkInfo(chainId);
        
        // Then update balance
        await updateBalance();
      } else {
      }
    } catch (error) {
      console.error('❌ Error checking connection:', error);
    }
  };

  const updateBalance = async () => {
    if (!window.ethereum) {
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length === 0) {
        return;
      }
      
      const currentAddress = accounts[0];
      
      // Add retry logic and better error handling for balance fetching
      try {
        const balance = await provider.getBalance(currentAddress, 'latest');
        const formattedBalance = ethers.utils.formatEther(balance);
        
        
        setAddress(currentAddress);
        setBalance(parseFloat(formattedBalance).toFixed(4));
      } catch (balanceError) {
        console.warn('Could not fetch balance (node may be restarting):', balanceError.message);
        setAddress(currentAddress);
        setBalance('-.----');
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      setBalance('0.0000');
    }
  };

  const switchToLocal = async () => {
    try {
      // First try to switch to local network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: LOCAL_NETWORK.chainId }],
      });
      return true;
    } catch (switchError) {
      // 4902: Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [LOCAL_NETWORK],
          });
          return true;
        } catch (addError) {
          console.error('Error adding local network:', addError);
          setError('Failed to add local network. Please add it manually in MetaMask.');
          return false;
        }
      } else if (switchError.code === 4001) {
        setError('Please connect to the local network to continue');
        return false;
      }
      console.error('Error switching to local network:', switchError);
      setError('Failed to switch network');
      return false;
    }
  };

  const switchToAmoy = async () => {
    try {
      // First try to switch to Amoy
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AMOY_NETWORK.chainId }],
      });
      return true;
    } catch (switchError) {
      // 4902: Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AMOY_NETWORK],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Amoy network:', addError);
          setError('Failed to add Amoy network. Please add it manually in MetaMask.');
          return false;
        }
      } else if (switchError.code === 4001) {
        setError('Please connect to the Amoy network to continue');
        return false;
      }
      console.error('Error switching to Amoy:', switchError);
      setError('Failed to switch network');
      return false;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install it first.');
      return;
    }

    try {
      setIsConnecting(true);
      setError('');

      // Request account access first
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        setError('No accounts found. Please create an account in MetaMask.');
        return;
      }

      // Auto-switch to local Hardhat network
      const switched = await switchToLocal();
      if (!switched) {
        setIsConnecting(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userAddress = accounts[0];
      
      try {
        const userBalance = await provider.getBalance(userAddress, 'latest');
        const formattedBalance = ethers.utils.formatEther(userBalance);
        
        
        setAddress(userAddress);
        setBalance(parseFloat(formattedBalance).toFixed(4));
      } catch (balanceError) {
        console.warn('Could not fetch balance on connect:', balanceError.message);
        setAddress(userAddress);
        setBalance('-.----');
      }
      
      // Get current network info
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      await updateNetworkInfo(chainId);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError(error.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    setBalance('');
    setCurrentNetwork('');
    setError('');
  };

  // Debug function to manually check network
  const debugNetworkInfo = async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      
      if (accounts.length > 0) {
        try {
          const balance = await provider.getBalance(accounts[0], 'latest');
        } catch (balanceError) {
        }
      }
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  // Call debug function on component mount (remove this later)
  useEffect(() => {
    setTimeout(debugNetworkInfo, 2000);
  }, []);

  const getCurrencySymbol = () => {
    if (currentNetwork === 'Local Hardhat' || currentNetwork === 'Ethereum') {
      return 'ETH';
    } else if (currentNetwork === 'Polygon Amoy') {
      return 'MATIC';
    }
    return 'ETH'; // Default to ETH
  };

  return (
    <>
      <ConnectWalletWrapper 
        onClick={address ? disconnectWallet : connectWallet} 
        disabled={isConnecting}
        title={isConnecting ? 'Connecting...' : address ? 'Disconnect Wallet' : 'Connect to MetaMask'}
      >
        {isConnecting ? (
          <Balance>Connecting...</Balance>
        ) : (
          <>
            {balance && (
              <Balance>{balance} {getCurrencySymbol()}</Balance>
            )}
            <Address>
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
            </Address>
          </>
        )}
      </ConnectWalletWrapper>
      {error && <ErrorText>{error}</ErrorText>}
      {currentNetwork && !error && (
        <NetworkInfo>Network: {currentNetwork}</NetworkInfo>
      )}
    </>
  );
};

const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 8px 12px;
  height: 40px;
  color: ${(props) => props.theme.color};
  border-radius: 10px;
  margin-right: 15px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: all 0.2s ease;
  border: 1px solid ${props => props.theme.borderColor || '#2c2f36'};
  
  &:hover {
    background-color: ${props => !props.disabled && (props.theme.bgDivHover || '#2c2f36')};
  }
`;

const Address = styled.h2`
  background-color: ${(props) => props.theme.bgSubDiv};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px 0 5px;
  border-radius: 10px;
`;

const Balance = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: ${props => props.theme.primaryColor || '#2172e5'};
  font-weight: 600;
`;

const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
  max-width: 200px;
  word-break: break-word;
`;

const NetworkInfo = styled.div`
  color: ${props => props.theme.textSecondary || '#8b8b8b'};
  font-size: 11px;
  text-align: center;
  margin-top: 3px;
`;

export default Wallet;