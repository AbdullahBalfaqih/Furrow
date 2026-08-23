require("ts-node/register");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

const rawKey = (process.env.PRIVATE_KEY || "").trim();
const formattedKey = rawKey
  ? (rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`)
  : "0x0000000000000000000000000000000000000000000000000000000000000001";

const OG_RPC_URL = process.env.OG_RPC_URL || "https://evmrpc-testnet.0g.ai";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    "0g-galileo": {
      url: OG_RPC_URL,
      chainId: 16661,
      accounts: [formattedKey],
    },
    "0gMainnet": {
      url: process.env.OG_MAINNET_RPC_URL || "https://evmrpc.0g.ai",
      chainId: 16661,
      accounts: [formattedKey],
    },
  },
  mocha: {
    extension: ["ts", "js"],
    timeout: 40000,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
