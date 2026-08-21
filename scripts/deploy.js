const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=================================================");
  console.log("Deploying Furrow Chain Smart Contracts");
  console.log("Network:", network.name);
  console.log("Deployer Address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "0G / ETH");
  console.log("=================================================");

  // 1. Deploy FurrowAccessControl
  console.log("Deploying FurrowAccessControl...");
  const FurrowAccessControlFactory = await ethers.getContractFactory("FurrowAccessControl");
  const accessControl = await FurrowAccessControlFactory.deploy(deployer.address);
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log("✔ FurrowAccessControl deployed to:", accessControlAddress);

  // 2. Deploy CropRegistry
  console.log("Deploying CropRegistry...");
  const CropRegistryFactory = await ethers.getContractFactory("CropRegistry");
  const cropRegistry = await CropRegistryFactory.deploy(accessControlAddress);
  await cropRegistry.waitForDeployment();
  const cropRegistryAddress = await cropRegistry.getAddress();
  console.log("✔ CropRegistry deployed to:", cropRegistryAddress);

  // 3. Deploy CropAssessment
  console.log("Deploying CropAssessment...");
  const CropAssessmentFactory = await ethers.getContractFactory("CropAssessment");
  const cropAssessment = await CropAssessmentFactory.deploy(accessControlAddress, cropRegistryAddress);
  await cropAssessment.waitForDeployment();
  const cropAssessmentAddress = await cropAssessment.getAddress();
  console.log("✔ CropAssessment deployed to:", cropAssessmentAddress);

  // 4. Deploy FurrowMarketplace
  console.log("Deploying FurrowMarketplace...");
  const FurrowMarketplaceFactory = await ethers.getContractFactory("FurrowMarketplace");
  const marketplace = await FurrowMarketplaceFactory.deploy(accessControlAddress, cropRegistryAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✔ FurrowMarketplace deployed to:", marketplaceAddress);

  // 5. Configure Roles
  console.log("Configuring AccessControl Roles...");

  // Grant ASSESSOR_ROLE to deployer (default Oracle / AI service)
  const ASSESSOR_ROLE = await accessControl.ASSESSOR_ROLE();
  const grantAssessorTx = await accessControl.grantRole(ASSESSOR_ROLE, deployer.address);
  await grantAssessorTx.wait();
  console.log(`✔ Granted ASSESSOR_ROLE to Oracle/Deployer (${deployer.address})`);

  // Grant MARKETPLACE_ROLE to FurrowMarketplace contract
  const MARKETPLACE_ROLE = await accessControl.MARKETPLACE_ROLE();
  const grantMarketplaceTx = await accessControl.grantRole(MARKETPLACE_ROLE, marketplaceAddress);
  await grantMarketplaceTx.wait();
  console.log(`✔ Granted MARKETPLACE_ROLE to FurrowMarketplace (${marketplaceAddress})`);

  console.log("=================================================");
  console.log("ALL CONTRACTS SUCCESSFULLY DEPLOYED & CONFIGURED!");
  console.log("=================================================");

  // 6. Output deployments JSON file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentData = {
    network: network.name,
    chainId: network.config.chainId || 16602,
    timestamp: new Date().toISOString(),
    contracts: {
      FurrowAccessControl: accessControlAddress,
      CropRegistry: cropRegistryAddress,
      CropAssessment: cropAssessmentAddress,
      FurrowMarketplace: marketplaceAddress,
    },
  };

  const deploymentFilePath = path.join(deploymentsDir, "0g-testnet.json");
  fs.writeFileSync(deploymentFilePath, JSON.stringify(deploymentData, null, 2));
  console.log(`Saved deployment manifest to: ${deploymentFilePath}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
