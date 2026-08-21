/**
 * Furrow Chain - Web3 & 0G Storage Integration Helpers (Viem / Ethers.js)
 * 
 * Network: 0G Galileo Testnet
 * Chain ID: 16602
 * RPC URL: https://evmrpc-testnet.0g.ai
 * Explorer: https://chainscan-galileo.0g.ai
 */

import { parseEther, keccak256, toUtf8Bytes } from "ethers";

// Deployed Smart Contract Addresses on 0G Galileo Testnet
export const CONTRACT_ADDRESSES = {
  FurrowAccessControl: "0x7186Bef44014186F28da770F387F2D7D55835682",
  CropRegistry: "0x64Dc9caF5Cb9EAc069Ae8f5aaC6e980E3FD7917b",
  CropAssessment: "0x248d4E9fbC4Ea0b184A090da8a627027D5bF6a85",
  FurrowMarketplace: "0xb94Dc90f3f11d89b8D174B4b676B88255CE6e8B2",
};

// 0G Mainnet (Aristotle) Parameters
export const OG_MAINNET_CHAIN = {
  id: 16661,
  name: "0G Mainnet",
  nativeCurrency: {
    name: "0G",
    symbol: "0G",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://evmrpc.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "0G ChainScan", url: "https://chainscan.0g.ai" },
  },
};

// 0G Chain Galileo Testnet Parameters
export const OG_GALILEO_CHAIN = {
  id: 16602,
  name: "0G Galileo Testnet",
  nativeCurrency: {
    name: "0G",
    symbol: "0G",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "0G ChainScan", url: "https://chainscan-galileo.0g.ai" },
  },
};

/**
 * Simplified ABIs for Frontend Client Integration
 */
export const CROP_REGISTRY_ABI = [
  "function registerCrop(string cropType, string storageCID, bytes32 metadataHash, uint256 harvestDate) external returns (uint256)",
  "function getCrop(uint256 cropId) external view returns (tuple(uint256 id, address farmer, string cropType, string storageCID, bytes32 metadataHash, uint256 harvestDate, uint256 createdAt, uint8 status))",
  "function updateCropMetadata(uint256 cropId, string storageCID, bytes32 metadataHash) external",
  "event CropRegistered(uint256 indexed cropId, address indexed farmer, string cropType, string storageCID, bytes32 metadataHash, uint256 harvestDate)",
];

export const CROP_ASSESSMENT_ABI = [
  "function submitAssessment(uint256 cropId, uint256 qualityScore, string grade, uint256 estimatedValue, string modelVersion, bytes32 assessmentHash) external",
  "function getLatestAssessment(uint256 cropId) external view returns (tuple(uint256 cropId, uint256 qualityScore, string grade, uint256 estimatedValue, string modelVersion, bytes32 assessmentHash, uint256 timestamp, address assessor))",
  "event AssessmentSubmitted(uint256 indexed cropId, uint256 qualityScore, string grade, uint256 estimatedValue, address indexed assessor, bytes32 assessmentHash)",
];

export const FURROW_MARKETPLACE_ABI = [
  "function createListing(uint256 cropId, uint256 minimumPrice, uint256 expiresAt) external returns (uint256)",
  "function makeOffer(uint256 listingId) external payable returns (uint256)",
  "function acceptOffer(uint256 listingId, uint256 offerId) external",
  "function withdrawOffer(uint256 offerId) external",
  "function getListing(uint256 listingId) external view returns (tuple(uint256 listingId, uint256 cropId, address farmer, uint256 minimumPrice, uint256 createdAt, uint256 expiresAt, bool active))",
  "function getListingOffers(uint256 listingId) external view returns (tuple(uint256 offerId, uint256 listingId, address buyer, uint256 amount, uint256 createdAt, bool active)[])",
  "event ListingCreated(uint256 indexed listingId, uint256 indexed cropId, address indexed farmer, uint256 minimumPrice, uint256 expiresAt)",
  "event OfferCreated(uint256 indexed offerId, uint256 indexed listingId, address indexed buyer, uint256 amount)",
  "event OfferAccepted(uint256 indexed listingId, uint256 indexed offerId, address indexed buyer, uint256 amount)",
];

/**
 * 0G Storage & Hash Helper
 * Generates sha256/keccak256 metadata hash from offchain JSON payload before submitting to 0G Chain.
 */
export function generateMetadataHash(metadataObject: object): string {
  const jsonString = JSON.stringify(metadataObject);
  return keccak256(toUtf8Bytes(jsonString));
}

/**
 * Example 1: Register Crop on 0G Chain (Ethers.js / Viem Client Side)
 */
export async function registerCropOnChain(
  signer: any,
  cropType: string,
  storageCID: string,
  metadataObj: object,
  harvestDateTimestamp: number
) {
  const { ethers } = await import("ethers");
  const registryContract = new ethers.Contract(
    CONTRACT_ADDRESSES.CropRegistry,
    CROP_REGISTRY_ABI,
    signer
  );

  const metadataHash = generateMetadataHash(metadataObj);
  const tx = await registryContract.registerCrop(
    cropType,
    storageCID,
    metadataHash,
    harvestDateTimestamp
  );
  const receipt = await tx.wait();
  return receipt;
}

/**
 * Example 2: Submit AI Assessment on 0G Chain (Oracle / Assessor Service)
 */
export async function submitAiAssessmentOnChain(
  assessorSigner: any,
  cropId: number,
  qualityScore: number,
  grade: string,
  estimatedValueEth: string,
  modelVersion: string,
  rawAiPayloadObj: object
) {
  const { ethers } = await import("ethers");
  const assessmentContract = new ethers.Contract(
    CONTRACT_ADDRESSES.CropAssessment,
    CROP_ASSESSMENT_ABI,
    assessorSigner
  );

  const estimatedValueWei = parseEther(estimatedValueEth);
  const assessmentHash = generateMetadataHash(rawAiPayloadObj);

  const tx = await assessmentContract.submitAssessment(
    cropId,
    qualityScore,
    grade,
    estimatedValueWei,
    modelVersion,
    assessmentHash
  );
  return await tx.wait();
}

/**
 * Example 3: Create Marketplace Listing (Farmer)
 */
export async function createListingOnChain(
  farmerSigner: any,
  cropId: number,
  minimumPriceEth: string,
  durationDays: number = 7
) {
  const { ethers } = await import("ethers");
  const marketplaceContract = new ethers.Contract(
    CONTRACT_ADDRESSES.FurrowMarketplace,
    FURROW_MARKETPLACE_ABI,
    farmerSigner
  );

  const minimumPriceWei = parseEther(minimumPriceEth);
  const expiresAt = Math.floor(Date.now() / 1000) + durationDays * 86400;

  const tx = await marketplaceContract.createListing(cropId, minimumPriceWei, expiresAt);
  return await tx.wait();
}

/**
 * Example 4: Make Buyer Offer (Buyer)
 */
export async function makeBuyerOfferOnChain(
  buyerSigner: any,
  listingId: number,
  offerAmountEth: string
) {
  const { ethers } = await import("ethers");
  const marketplaceContract = new ethers.Contract(
    CONTRACT_ADDRESSES.FurrowMarketplace,
    FURROW_MARKETPLACE_ABI,
    buyerSigner
  );

  const offerAmountWei = parseEther(offerAmountEth);
  const tx = await marketplaceContract.makeOffer(listingId, { value: offerAmountWei });
  return await tx.wait();
}

/**
 * Example 5: Accept Winning Offer (Farmer)
 */
export async function acceptOfferOnChain(
  farmerSigner: any,
  listingId: number,
  offerId: number
) {
  const { ethers } = await import("ethers");
  const marketplaceContract = new ethers.Contract(
    CONTRACT_ADDRESSES.FurrowMarketplace,
    FURROW_MARKETPLACE_ABI,
    farmerSigner
  );

  const tx = await marketplaceContract.acceptOffer(listingId, offerId);
  return await tx.wait();
}
