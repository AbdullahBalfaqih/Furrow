const path = require('path');
const fs = require('fs');

const dbFile = path.join(__dirname, '../data/furrow-chain-database.json');

console.log('=================================================');
console.log('FURROW CHAIN DATABASE FILE STATUS & VERIFICATION:');
console.log('=================================================');
console.log('Database File Path:', dbFile);
console.log('File Exists:', fs.existsSync(dbFile));

if (fs.existsSync(dbFile)) {
  const content = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  console.log('✔ Registered Crops:', content.crops.length);
  console.log('✔ AI Assessments:', content.assessments.length);
  console.log('✔ Active Listings:', content.listings.length);
  console.log('✔ Active Offers:', content.offers.length);
  console.log('✔ Security Audit Logs:', content.securityLogs.length);
} else {
  console.log('Database file will be initialized on first server API request.');
}
console.log('=================================================');
