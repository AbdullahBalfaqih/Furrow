const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=================================================");
  console.log("EXECUTING REAL 0G CHAIN ON-CHAIN ACTIVITY");
  console.log("Target Network:", network.name);
  console.log("Deployer Address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "0G");
  console.log("=================================================\n");

  const contractAddresses = {
    FurrowAccessControl: "0x7186Bef44014186F28da770F387F2D7D55835682",
    CropRegistry: "0x64Dc9caF5Cb9EAc069Ae8f5aaC6e980E3FD7917b",
    CropAssessment: "0x248d4E9fbC4Ea0b184A090da8a627027D5bF6a85",
    FurrowMarketplace: "0xb94Dc90f3f11d89b8D174B4b676B88255CE6e8B2",
  };

  const cropRegistry = await ethers.getContractAt("CropRegistry", contractAddresses.CropRegistry, deployer);
  const cropAssessment = await ethers.getContractAt("CropAssessment", contractAddresses.CropAssessment, deployer);
  const marketplace = await ethers.getContractAt("FurrowMarketplace", contractAddresses.FurrowMarketplace, deployer);

  const timestamp = Math.floor(Date.now() / 1000);
  const storageCID = `0g://bafybeic2h4x92c1${timestamp}tomatoes`;
  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(`crop-${timestamp}-metadata`));
  const assessmentHash = ethers.keccak256(ethers.toUtf8Bytes(`ai-assessment-${timestamp}`));

  // 1. Execute registerCrop()
  console.log("1/3 Executing CropRegistry.registerCrop()...");
  const regTx = await cropRegistry.registerCrop(
    "Organic Premium Tomatoes (Batch #2026)",
    storageCID,
    metadataHash,
    timestamp - 86400
  );
  console.log("   Waiting for confirmation... Tx Hash:", regTx.hash);
  const regReceipt = await regTx.wait();
  console.log("   ✔ Transaction Confirmed! Block Number:", regReceipt.blockNumber);

  const cropCount = await cropRegistry.getTotalCrops();
  const cropId = cropCount;
  console.log(`   ✔ Registered Crop ID: #${cropId}`);

  // 2. Execute submitAssessment()
  console.log("\n2/3 Executing CropAssessment.submitAssessment()...");
  const estimatedValWei = ethers.parseEther("1.2"); // 1.2 0G
  const assessTx = await cropAssessment.submitAssessment(
    cropId,
    98, // 98% AI Quality Score
    "Grade A+ (98.6% Premium)",
    estimatedValWei,
    "v1.4.2-vision",
    assessmentHash
  );
  console.log("   Waiting for confirmation... Tx Hash:", assessTx.hash);
  const assessReceipt = await assessTx.wait();
  console.log("   ✔ Transaction Confirmed! Block Number:", assessReceipt.blockNumber);

  // 3. Execute createListing()
  console.log("\n3/3 Executing FurrowMarketplace.createListing()...");
  const listingPrice = ethers.parseEther("0.01"); // 0.01 0G
  const expiresAt = timestamp + 7 * 86400; // Expires in 7 days (Unix Timestamp)
  const listTx = await marketplace.createListing(cropId, listingPrice, expiresAt);
  console.log("   Waiting for confirmation... Tx Hash:", listTx.hash);
  const listReceipt = await listTx.wait();
  console.log("   ✔ Transaction Confirmed! Block Number:", listReceipt.blockNumber);

  const listingCount = await marketplace.getTotalListings();
  const listingId = listingCount;
  console.log(`   ✔ Created Listing ID: #${listingId}`);

  // 4. Save Execution Activity Manifest & Proof
  const explorerBase = "https://chainscan-galileo.0g.ai";
  const activityData = {
    network: "0G Chain (Galileo)",
    chainId: network.config.chainId || 16602,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    storageIntegration: {
      provider: "0G Storage Network",
      storageCID: storageCID,
      metadataHash: metadataHash,
      assessmentHash: assessmentHash,
    },
    contracts: contractAddresses,
    transactions: {
      registerCrop: {
        txHash: regTx.hash,
        blockNumber: regReceipt.blockNumber,
        explorerUrl: `${explorerBase}/tx/${regTx.hash}`,
      },
      submitAssessment: {
        txHash: assessTx.hash,
        blockNumber: assessReceipt.blockNumber,
        explorerUrl: `${explorerBase}/tx/${assessTx.hash}`,
      },
      createListing: {
        txHash: listTx.hash,
        blockNumber: listReceipt.blockNumber,
        explorerUrl: `${explorerBase}/tx/${listTx.hash}`,
      },
    },
  };

  const activityFilePath = path.join(__dirname, "../deployments/0g-onchain-activity.json");
  fs.writeFileSync(activityFilePath, JSON.stringify(activityData, null, 2));

  console.log("\n=================================================");
  console.log("0G CHAIN ON-CHAIN ACTIVITY COMPLETED SUCCESSFULLY!");
  console.log("Saved Activity Proof Manifest to:", activityFilePath);
  console.log("=================================================");
}

main().catch((error) => {
  console.error("0G Activity execution failed:", error);
  process.exitCode = 1;
});
