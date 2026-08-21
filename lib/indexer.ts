/**
 * Furrow Chain Real-Time Blockchain Event Indexer (`lib/indexer.ts`)
 * Watches live 0G Chain Galileo Testnet smart contract events and synchronizes local database state in real-time.
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CROP_REGISTRY_ABI, FURROW_MARKETPLACE_ABI } from '@/lib/web3';
import { db } from '@/lib/db';

const OG_RPC_URL = process.env.OG_RPC_URL || 'https://evmrpc-testnet.0g.ai';

let isIndexing = false;

export function startBlockchainIndexer() {
  if (isIndexing) return;
  isIndexing = true;

  console.log('=================================================');
  console.log('Starting Furrow Chain Real-Time Event Indexer...');
  console.log('Target Network: 0G Galileo Testnet (Chain ID 16602)');
  console.log('RPC Endpoint:', OG_RPC_URL);
  console.log('=================================================');

  try {
    const provider = new ethers.JsonRpcProvider(OG_RPC_URL);

    const cropRegistryContract = new ethers.Contract(
      CONTRACT_ADDRESSES.CropRegistry,
      CROP_REGISTRY_ABI,
      provider
    );

    const marketplaceContract = new ethers.Contract(
      CONTRACT_ADDRESSES.FurrowMarketplace,
      FURROW_MARKETPLACE_ABI,
      provider
    );

    // 1. Listen for CropRegistered events
    cropRegistryContract.on(
      'CropRegistered',
      (cropId, farmer, cropType, storageCID, metadataHash, harvestDate) => {
        console.log(`[EVENT INDEXER] CropRegistered: #${cropId} by ${farmer}`);
        db.addCrop({
          farmer,
          cropType,
          storageCID,
          metadataHash,
          harvestDate: Number(harvestDate),
          status: 'Registered',
        });
        db.logSecurityEvent('0G_CHAIN', 'EVENT_CROP_REGISTERED', `Crop #${cropId} indexed onchain`, 'ALLOWED');
      }
    );

    // 2. Listen for ListingCreated events
    marketplaceContract.on('ListingCreated', (listingId, cropId, farmer, minimumPrice, expiresAt) => {
      console.log(`[EVENT INDEXER] ListingCreated: #${listingId} for Crop #${cropId}`);
      db.addListing({
        cropId: Number(cropId),
        farmer,
        minimumPrice: ethers.formatEther(minimumPrice) + ' 0G',
        expiresAt: Number(expiresAt),
        active: true,
      });
      db.updateCropStatus(Number(cropId), 'Listed');
      db.logSecurityEvent('0G_CHAIN', 'EVENT_LISTING_CREATED', `Listing #${listingId} indexed onchain`, 'ALLOWED');
    });

    // 3. Listen for OfferCreated events
    marketplaceContract.on('OfferCreated', (offerId, listingId, buyer, amount) => {
      console.log(`[EVENT INDEXER] OfferCreated: #${offerId} on Listing #${listingId}`);
      db.addOffer({
        listingId: Number(listingId),
        buyer,
        amount: ethers.formatEther(amount) + ' 0G',
        active: true,
      });
      db.logSecurityEvent('0G_CHAIN', 'EVENT_OFFER_CREATED', `Offer #${offerId} indexed onchain`, 'ALLOWED');
    });

    // 4. Listen for OfferAccepted events
    marketplaceContract.on('OfferAccepted', (listingId, offerId, buyer, amount) => {
      console.log(`[EVENT INDEXER] OfferAccepted: Listing #${listingId}, Offer #${offerId}`);
      db.logSecurityEvent('0G_CHAIN', 'EVENT_OFFER_ACCEPTED', `Listing #${listingId} settled onchain`, 'ALLOWED');
    });
  } catch (err: any) {
    console.error('[EVENT INDEXER ERROR]', err.message);
  }
}
