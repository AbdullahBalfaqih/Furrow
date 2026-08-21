const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=================================================");
  console.log("0G MAINNET CONTRACT DEPLOYMENT");
  console.log("Network Name:", network.name);
  console.log("Chain ID:", network.config.chainId || 16661);
  console.log("Deployer Wallet:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Current Wallet Balance:", ethers.formatEther(balance), "0G");
  console.log("=================================================");

  if (balance === 0n) {
    console.error("❌ ERROR: Deployer wallet balance is 0.0 0G. Mainnet deployment requires native 0G tokens for gas fees.");
    process.exit(1);
  }

  // 1. Deploy FurrowAccessControl
  console.log("1/4 Deploying FurrowAccessControl...");
  const FurrowAccessControlFactory = await ethers.getContractFactory("FurrowAccessControl");
  const accessControl = await FurrowAccessControlFactory.deploy(deployer.address);
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log("✔ FurrowAccessControl deployed to 0G Mainnet:", accessControlAddress);

  // 2. Deploy CropRegistry
  console.log("2/4 Deploying CropRegistry...");
  const CropRegistryFactory = await ethers.getContractFactory("CropRegistry");
  const cropRegistry = await CropRegistryFactory.deploy(accessControlAddress);
  await cropRegistry.waitForDeployment();
  const cropRegistryAddress = await cropRegistry.getAddress();
  console.log("✔ CropRegistry deployed to 0G Mainnet:", cropRegistryAddress);

  // 3. Deploy CropAssessment
  console.log("3/4 Deploying CropAssessment...");
  const CropAssessmentFactory = await ethers.getContractFactory("CropAssessment");
  const cropAssessment = await CropAssessmentFactory.deploy(accessControlAddress, cropRegistryAddress);
  await cropAssessment.waitForDeployment();
  const cropAssessmentAddress = await cropAssessment.getAddress();
  console.log("✔ CropAssessment deployed to 0G Mainnet:", cropAssessmentAddress);

  // 4. Deploy FurrowMarketplace
  console.log("4/4 Deploying FurrowMarketplace...");
  const FurrowMarketplaceFactory = await ethers.getContractFactory("FurrowMarketplace");
  const marketplace = await FurrowMarketplaceFactory.deploy(accessControlAddress, cropRegistryAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✔ FurrowMarketplace deployed to 0G Mainnet:", marketplaceAddress);

  // 5. Configure Roles
  console.log("Configuring AccessControl Roles on 0G Mainnet...");
  const ASSESSOR_ROLE = await accessControl.ASSESSOR_ROLE();
  const grantAssessorTx = await accessControl.grantRole(ASSESSOR_ROLE, deployer.address);
  await grantAssessorTx.wait();
  console.log(`✔ Granted ASSESSOR_ROLE to Oracle/Deployer (${deployer.address})`);

  const MARKETPLACE_ROLE = await accessControl.MARKETPLACE_ROLE();
  const grantMarketplaceTx = await accessControl.grantRole(MARKETPLACE_ROLE, marketplaceAddress);
  await grantMarketplaceTx.wait();
  console.log(`✔ Granted MARKETPLACE_ROLE to FurrowMarketplace (${marketplaceAddress})`);

  // 6. Output deployments/0g-mainnet.json manifest
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentData = {
    network: "0G Mainnet (Aristotle)",
    chainId: 16661,
    timestamp: new Date().toISOString(),
    explorerBaseUrl: "https://chainscan.0g.ai",
    contracts: {
      FurrowAccessControl: accessControlAddress,
      CropRegistry: cropRegistryAddress,
      CropAssessment: cropAssessmentAddress,
      FurrowMarketplace: marketplaceAddress,
    },
    explorerLinks: {
      FurrowAccessControl: `https://chainscan.0g.ai/address/${accessControlAddress}`,
      CropRegistry: `https://chainscan.0g.ai/address/${cropRegistryAddress}`,
      CropAssessment: `https://chainscan.0g.ai/address/${cropAssessmentAddress}`,
      FurrowMarketplace: `https://chainscan.0g.ai/address/${marketplaceAddress}`,
    },
  };

  const deploymentFilePath = path.join(deploymentsDir, "0g-mainnet.json");
  fs.writeFileSync(deploymentFilePath, JSON.stringify(deploymentData, null, 2));
  console.log("=================================================");
  console.log("0G MAINNET DEPLOYMENT COMPLETED SUCCESSFULLY!");
  console.log(`Manifest saved to: ${deploymentFilePath}`);
  console.log("=================================================");
}

main().catch((error) => {
  console.error("Mainnet deployment failed:", error);
  process.exitCode = 1;
});
