require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: './.env.local' });

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
})

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY

module.exports = {
  solidity: "0.8.10",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // polygon: {
    //   url: process.env.NEXT_PUBLIC_RPC_URL,
    //   accounts: [privateKey],
    //   gasPrice: 30000000000, // 30 Gwei
    //   gas: 5000000
    // },
    // mumbai: {
    //   url: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
    //   accounts: [privateKey],
    //   gasPrice: 3000000000, // 3 Gwei for testnet
    //   gas: 5000000
    // }
  }
};

