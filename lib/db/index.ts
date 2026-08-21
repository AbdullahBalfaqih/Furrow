/**
 * Furrow Chain Database Manager (`lib/db/index.ts`)
 * Unified Cloud Database interface supporting Supabase / PostgreSQL Cloud Database.
 */

import path from 'path';
import fs from 'fs';
import { supabase } from './cloud';

export interface UserRecord {
  walletAddress: string;
  role: 'merchant' | 'buyer';
  name?: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
  city?: string;
  createdAt: number;
}

export interface CropRecord {
  id: number;
  farmer: string;
  cropType: string;
  storageCID: string;
  metadataHash: string;
  harvestDate: number;
  createdAt: number;
  status: 'Registered' | 'Listed' | 'Sold' | 'Cancelled';
}

export interface AssessmentRecord {
  cropId: number;
  qualityScore: number;
  grade: string;
  estimatedValue: string;
  modelVersion: string;
  assessmentHash: string;
  timestamp: number;
  assessor: string;
}

export interface ListingRecord {
  listingId: number;
  cropId: number;
  farmer: string;
  minimumPrice: string;
  createdAt: number;
  expiresAt: number;
  active: boolean;
}

export interface OfferRecord {
  offerId: number;
  listingId: number;
  buyer: string;
  amount: string;
  createdAt: number;
  active: boolean;
}

export interface SecurityLogRecord {
  id: number;
  timestamp: number;
  ip: string;
  action: string;
  details: string;
  status: 'ALLOWED' | 'BLOCKED' | 'FLAGGED';
}

// Local Storage Fallback File
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'furrow-chain-database.json');

interface DatabaseStore {
  users: UserRecord[];
  crops: CropRecord[];
  assessments: AssessmentRecord[];
  listings: ListingRecord[];
  offers: OfferRecord[];
  securityLogs: SecurityLogRecord[];
}

function isCloudDbEnabled(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://example-supabase-project.supabase.co'
  );
}

function loadDatabase(): DatabaseStore {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        users: parsed.users || [],
        crops: parsed.crops || [],
        assessments: parsed.assessments || [],
        listings: parsed.listings || [],
        offers: parsed.offers || [],
        securityLogs: parsed.securityLogs || [],
      };
    }
  } catch (err) {
    console.error('Error loading database:', err);
  }

  const initialStore: DatabaseStore = {
    users: [
      {
        walletAddress: '0x0388865e1daf2427De6111cf8548ed1871656180',
        role: 'merchant',
        name: 'Al-Qassim Date & Crop Merchant',
        email: 'merchant@qassim.farm',
        phone: '+966500000000',
        shippingAddress: 'Al-Qassim Main Orchard Rd, Buraidah',
        city: 'Qassim',
        createdAt: Math.floor(Date.now() / 1000) - 86400 * 10,
      },
    ],
    crops: [
      {
        id: 1,
        farmer: '0x0388865e1daf2427De6111cf8548ed1871656180',
        cropType: 'Organic Premium Tomatoes',
        storageCID: '0g://bafybeic2h4x92c1tomatoes',
        metadataHash: '0x655a62af8d9c20be655a62af8d9c20be655a62af8d9c20be655a62af8d9c20be',
        harvestDate: Math.floor(Date.now() / 1000) - 86400 * 2,
        createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
        status: 'Listed',
      },
      {
        id: 2,
        farmer: '0x0388865e1daf2427De6111cf8548ed1871656180',
        cropType: 'Sukari Dates Premium',
        storageCID: '0g://bafybeic2h4x92c1dates',
        metadataHash: '0x777a62af8d9c20be655a62af8d9c20be655a62af8d9c20be655a62af8d9c20be',
        harvestDate: Math.floor(Date.now() / 1000) - 86400 * 5,
        createdAt: Math.floor(Date.now() / 1000) - 86400 * 5,
        status: 'Listed',
      },
    ],
    assessments: [
      {
        cropId: 1,
        qualityScore: 98,
        grade: 'Grade A+ (98.6%)',
        estimatedValue: '$1,200 / Ton',
        modelVersion: 'v1.4.2-vision',
        assessmentHash: '0x888a62af8d9c20be655a62af8d9c20be655a62af8d9c20be655a62af8d9c20be',
        timestamp: Math.floor(Date.now() / 1000) - 86400,
        assessor: '0x0388865e1daf2427De6111cf8548ed1871656180',
      },
    ],
    listings: [
      {
        listingId: 1,
        cropId: 1,
        farmer: '0x0388865e1daf2427De6111cf8548ed1871656180',
        minimumPrice: '1.0 0G',
        createdAt: Math.floor(Date.now() / 1000) - 86400,
        expiresAt: Math.floor(Date.now() / 1000) + 86400 * 7,
        active: true,
      },
    ],
    offers: [
      {
        offerId: 1,
        listingId: 1,
        buyer: '0x7186Bef44014186F28da770F387F2D7D55835682',
        amount: '1.58 0G',
        createdAt: Math.floor(Date.now() / 1000) - 3600,
        active: true,
      },
    ],
    securityLogs: [],
  };

  saveDatabase(initialStore);
  return initialStore;
}

function saveDatabase(store: DatabaseStore) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Global Database API Methods (Supports Supabase Cloud DB & Local Persistence)
export const db = {
  // User Profile & Role Management
  getUserProfile: (walletAddress: string): UserRecord | undefined => {
    if (!walletAddress) return undefined;
    const lower = walletAddress.toLowerCase();
    return loadDatabase().users.find((u) => u.walletAddress.toLowerCase() === lower);
  },

  saveUserProfile: (user: UserRecord): UserRecord => {
    const store = loadDatabase();
    const lower = user.walletAddress.toLowerCase();
    const existingIndex = store.users.findIndex((u) => u.walletAddress.toLowerCase() === lower);

    if (existingIndex >= 0) {
      store.users[existingIndex] = { ...store.users[existingIndex], ...user };
    } else {
      store.users.push(user);
    }

    if (isCloudDbEnabled()) {
      supabase
        .from('users')
        .upsert({
          wallet_address: user.walletAddress,
          role: user.role,
          name: user.name,
          email: user.email,
          phone: user.phone,
          shipping_address: user.shippingAddress,
          city: user.city,
          created_at: user.createdAt,
        })
        .then(({ error }) => {
          if (error) console.error('[SUPABASE ERROR - USER UPSERT]', error.message);
        });
    }

    saveDatabase(store);
    return user;
  },

  // Crop Management
  getCrops: (): CropRecord[] => loadDatabase().crops,

  getCropById: (id: number): CropRecord | undefined => {
    return loadDatabase().crops.find((c) => c.id === id);
  },

  addCrop: (crop: Omit<CropRecord, 'id' | 'createdAt'>): CropRecord => {
    const store = loadDatabase();
    const newId = store.crops.length > 0 ? Math.max(...store.crops.map((c) => c.id)) + 1 : 1;
    const newRecord: CropRecord = {
      ...crop,
      id: newId,
      createdAt: Math.floor(Date.now() / 1000),
    };

    if (isCloudDbEnabled()) {
      supabase.from('crops').insert([
        {
          farmer: crop.farmer,
          crop_type: crop.cropType,
          storage_cid: crop.storageCID,
          metadata_hash: crop.metadataHash,
          harvest_date: crop.harvestDate,
          created_at: newRecord.createdAt,
          status: crop.status,
        },
      ]).then(({ error }) => {
        if (error) console.error('[SUPABASE ERROR]', error.message);
      });
    }

    store.crops.push(newRecord);
    saveDatabase(store);
    return newRecord;
  },

  updateCropStatus: (id: number, status: CropRecord['status']): boolean => {
    const store = loadDatabase();
    const crop = store.crops.find((c) => c.id === id);
    if (!crop) return false;
    crop.status = status;

    if (isCloudDbEnabled()) {
      supabase.from('crops').update({ status }).eq('id', id).then(({ error }) => {
        if (error) console.error('[SUPABASE ERROR]', error.message);
      });
    }

    saveDatabase(store);
    return true;
  },

  // Assessments
  getAssessments: (cropId: number): AssessmentRecord[] => {
    return loadDatabase().assessments.filter((a) => a.cropId === cropId);
  },

  addAssessment: (assessment: AssessmentRecord): AssessmentRecord => {
    const store = loadDatabase();

    if (isCloudDbEnabled()) {
      supabase.from('assessments').insert([
        {
          crop_id: assessment.cropId,
          quality_score: assessment.qualityScore,
          grade: assessment.grade,
          estimated_value: assessment.estimatedValue,
          model_version: assessment.modelVersion,
          assessment_hash: assessment.assessmentHash,
          timestamp: assessment.timestamp,
          assessor: assessment.assessor,
        },
      ]).then(({ error }) => {
        if (error) console.error('[SUPABASE ERROR]', error.message);
      });
    }

    store.assessments.push(assessment);
    saveDatabase(store);
    return assessment;
  },

  // Listings & Marketplace
  getListings: (): ListingRecord[] => loadDatabase().listings,

  addListing: (listing: Omit<ListingRecord, 'listingId' | 'createdAt'>): ListingRecord => {
    const store = loadDatabase();
    const newId = store.listings.length > 0 ? Math.max(...store.listings.map((l) => l.listingId)) + 1 : 1;
    const newRecord: ListingRecord = {
      ...listing,
      listingId: newId,
      createdAt: Math.floor(Date.now() / 1000),
    };

    if (isCloudDbEnabled()) {
      supabase.from('listings').insert([
        {
          crop_id: listing.cropId,
          farmer: listing.farmer,
          minimum_price: listing.minimumPrice,
          created_at: newRecord.createdAt,
          expires_at: listing.expiresAt,
          active: listing.active,
        },
      ]).then(({ error }) => {
        if (error) console.error('[SUPABASE ERROR]', error.message);
      });
    }

    store.listings.push(newRecord);
    saveDatabase(store);
    return newRecord;
  },

  // Offers
  getOffers: (listingId: number): OfferRecord[] => {
    return loadDatabase().offers.filter((o) => o.listingId === listingId);
  },

  getOffersByBuyer: (buyerAddress: string): OfferRecord[] => {
    const lower = buyerAddress.toLowerCase();
    return loadDatabase().offers.filter((o) => o.buyer.toLowerCase() === lower);
  },

  addOffer: (offer: Omit<OfferRecord, 'offerId' | 'createdAt'>): OfferRecord => {
    const store = loadDatabase();
    const newId = store.offers.length > 0 ? Math.max(...store.offers.map((o) => o.offerId)) + 1 : 1;
    const newRecord: OfferRecord = {
      ...offer,
      offerId: newId,
      createdAt: Math.floor(Date.now() / 1000),
    };

    if (isCloudDbEnabled()) {
      supabase.from('offers').insert([
        {
          listing_id: offer.listingId,
          buyer: offer.buyer,
          amount: offer.amount,
          created_at: newRecord.createdAt,
          active: offer.active,
        },
      ]).then(({ error }) => {
        if (error) console.error('[SUPABASE ERROR]', error.message);
      });
    }

    store.offers.push(newRecord);
    saveDatabase(store);
    return newRecord;
  },

  // Security Logs
  logSecurityEvent: (ip: string, action: string, details: string, status: SecurityLogRecord['status']) => {
    const store = loadDatabase();
    const newId = store.securityLogs.length + 1;
    const log: SecurityLogRecord = {
      id: newId,
      timestamp: Date.now(),
      ip,
      action,
      details,
      status,
    };

    if (isCloudDbEnabled()) {
      supabase.from('security_logs').insert([
        {
          timestamp: log.timestamp,
          ip,
          action,
          details,
          status,
        },
      ]).then(({ error }) => {
        if (error) console.error('[SUPABASE ERROR]', error.message);
      });
    }

    store.securityLogs.push(log);
    saveDatabase(store);
    return log;
  },

  getSecurityLogs: (): SecurityLogRecord[] => loadDatabase().securityLogs,
};
