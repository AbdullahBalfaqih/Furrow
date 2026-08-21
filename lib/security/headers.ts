/**
 * Furrow Chain Cybersecurity Layer - HTTP Security Headers
 * Enforces Helmet-style headers to block XSS, clickjacking, MIME sniffing, and man-in-the-middle attacks.
 */

export const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://images.unsplash.com https://chainscan-galileo.0g.ai",
    "connect-src 'self' https://evmrpc-testnet.0g.ai https://faucet.0g.ai",
    "frame-ancestors 'none'",
  ].join('; '),

  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Prevent Clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME Type Sniffing
  'X-Content-Type-Options': 'nosniff',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Cross Domain Policies
  'X-Permitted-Cross-Domain-Policies': 'none',

  // XSS Filter Protection
  'X-XSS-Protection': '1; mode=block',

  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self)',
};

/**
 * Applies HTTP security headers to a Response object.
 */
export function applySecurityHeaders(response: Response): Response {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }
  return response;
}
