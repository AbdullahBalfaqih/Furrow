const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../data');
const dbFile = path.join(dbDir, 'furrow-chain-database.json');

const initialStore = {
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
  securityLogs: [
    {
      id: 1,
      timestamp: Date.now(),
      ip: '127.0.0.1',
      action: 'SYSTEM_INIT',
      details: 'Database & Security Engine Initialized',
      status: 'ALLOWED',
    },
  ],
};

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
fs.writeFileSync(dbFile, JSON.stringify(initialStore, null, 2));
console.log('✔ Database initialized at:', dbFile);
