const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const accessControlAddress = "0x7186Bef44014186F28da770F387F2D7D55835682";
  const marketplaceAddress = "0xb94Dc90f3f11d89b8D174B4b676B88255CE6e8B2";

  const accessControl = await ethers.getContractAt("FurrowAccessControl", accessControlAddress, deployer);
  const MARKETPLACE_ROLE = await accessControl.MARKETPLACE_ROLE();

  console.log("Granting MARKETPLACE_ROLE to FurrowMarketplace...");
  const tx = await accessControl.grantRole(MARKETPLACE_ROLE, marketplaceAddress);
  console.log("Tx Hash:", tx.hash);
  await tx.wait();
  console.log("✔ MARKETPLACE_ROLE granted successfully!");
}

main().catch((err) => {
  console.error("Error granting role:", err);
});
