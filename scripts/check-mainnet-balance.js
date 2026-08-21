const { ethers } = require('ethers');

async function main() {
  const mainnetRpcUrl = 'https://evmrpc.0g.ai';
  const provider = new ethers.JsonRpcProvider(mainnetRpcUrl);

  const wallet = new ethers.Wallet('6c6e067b8aeeae5282f205e9f6b95e3e368a5b273b7d7bf611e2ef9c8c16b4b2', provider);

  console.log('=================================================');
  console.log('0G MAINNET WALLET CHECK');
  console.log('=================================================');
  console.log('Deployer Address:', wallet.address);

  try {
    const network = await provider.getNetwork();
    console.log('Chain ID:', network.chainId.toString());

    const balance = await provider.getBalance(wallet.address);
    console.log('0G Mainnet Balance:', ethers.formatEther(balance), '0G');
  } catch (err) {
    console.error('Error querying 0G Mainnet:', err.message);
  }
  console.log('=================================================');
}

main();
