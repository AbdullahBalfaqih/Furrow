/**
 * Furrow Chain Cybersecurity Hardening - Advanced Input Sanitization & Attack Detection
 * Protects against SQL Injection (SQLi), Cross-Site Scripting (XSS), Prototype Pollution, and Malformed Payloads.
 */

import { z } from 'zod';

/**
 * SQL Injection Attack Patterns Scanner (Regex Inspection)
 * Intercepts common SQL control sequences, stacked queries, boolean-based, time-based, and UNION-based SQLi payloads.
 */
const SQLI_REGEX_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|GRANT|REVOKE)\b)/i,
  /('|"|;|--|\/\*|\*\/)/,
  /(\bOR\b|\bAND\b)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
  /\bBENCHMARK\s*\(/i,
  /\bPG_SLEEP\s*\(/i,
  /\bWAITFOR\s+DELAY\b/i,
  /0x[0-9a-f]+/i,
];

/**
 * XSS & Malicious URI Scanner
 * Detects HTML script tags, event handlers, javascript URIs, and encoded XSS vectors.
 */
const XSS_REGEX_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /on\w+\s*=/gi, // onerror=, onload=, onclick=
  /javascript\s*:/gi,
  /vbscript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /<iframe\b/gi,
  /<object\b/gi,
  /<embed\b/gi,
];

/**
 * Prototype Pollution Signature Scanner
 * Blocks attempts to pollute JavaScript Object.prototype.
 */
export function isPrototypePolluted(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;
  const keys = Object.keys(obj);
  return keys.some(
    (key) =>
      key === '__proto__' ||
      key === 'constructor' ||
      key === 'prototype' ||
      key.includes('__proto__')
  );
}

/**
 * Checks if input string contains SQL Injection attack signatures.
 */
export function containsSqlInjectionPayload(input: string): boolean {
  if (typeof input !== 'string') return false;
  return SQLI_REGEX_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Checks if input string contains XSS attack signatures.
 */
export function containsXSSPayload(input: string): boolean {
  if (typeof input !== 'string') return false;
  return XSS_REGEX_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Escapes HTML characters to sanitize user input against Reflected XSS.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes input string to neutralize raw SQL parameters.
 */
export function sanitizeSql(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/['";\/\*]/g, '');
}

/**
 * Strict EVM Wallet Address Validation Schema
 */
export const walletAddressSchema = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid EVM wallet address format' });

/**
 * Strict Register Crop Payload Schema
 */
export const registerCropSchema = z
  .object({
    cropType: z.string().min(2).max(100).transform(sanitizeString),
    storageCID: z.string().min(5).max(256).transform(sanitizeString),
    metadataHash: z
      .string()
      .regex(/^0x[a-fA-F0-9]{64}$/, { message: 'Metadata hash must be a valid 32-byte hex string' }),
    harvestDate: z.number().int().positive(),
    farmerAddress: walletAddressSchema,
  })
  .strict();

/**
 * Strict AI Assessment Request Payload Schema
 */
export const aiAssessmentSchema = z
  .object({
    cropId: z.number().int().positive(),
    qualityScore: z.number().int().min(0).max(100),
    grade: z.string().min(1).max(50).transform(sanitizeString),
    estimatedValue: z.string().min(1).max(50).transform(sanitizeString),
    modelVersion: z.string().min(1).max(50).transform(sanitizeString),
    rawPayload: z.record(z.string(), z.any()),
  })
  .strict();

/**
 * Strict Create Listing Payload Schema
 */
export const createListingSchema = z
  .object({
    cropId: z.number().int().positive(),
    minimumPrice: z.string().min(1).max(50).transform(sanitizeString),
    durationDays: z.number().int().min(1).max(30).default(7),
    farmerAddress: walletAddressSchema,
  })
  .strict();

/**
 * Strict Make Offer Payload Schema
 */
export const makeOfferSchema = z
  .object({
    listingId: z.number().int().positive(),
    offerAmount: z.string().min(1).max(50).transform(sanitizeString),
    buyerAddress: walletAddressSchema,
  })
  .strict();
