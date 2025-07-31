import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";


const bscTestnet: NetworkUserConfig = {
  url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  chainId: 97,
  accounts: [process.env.KEY_TESTNET!],
};

const bscMainnet: NetworkUserConfig = {
  url: "https://bsc-dataseed.binance.org/",
  chainId: 56,
  accounts: [process.env.KEY_MAINNET!],
};


const config: HardhatUserConfig = {
  solidity: "0.8.28",
   defaultNetwork: "hardhat",
   networks: {
      hardhat: {},
   //  testnet: bscTestnet,
   //  mainnet: bscMainnet,
   },
};

export default config;