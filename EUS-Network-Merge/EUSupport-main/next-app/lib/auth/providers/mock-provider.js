/**
 * Mock authentication provider for local development.
 *
 * This provider returns a simulated authenticated user without any real
 * credential validation. It is only active when AUTH_PROVIDER=mock (the
 * default in development).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FUTURE: This provider will remain available for local dev/test even after
 * the real Cisco Duo provider is integrated. Switch providers via the
 * AUTH_PROVIDER environment variable.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getMockUser } from '../mock-user.js';

/**
 * Simulates resolving the current user from a request context.
 * In mock mode, always returns the mock development user.
 *
 * @param {Request|null} _request - Incoming request (unused in mock)
 * @returns {Promise<object|null>} Resolved user object or null
 */
export async function resolveUser(_request = null) {
  // Simulate async behavior matching what a real provider would do
  return getMockUser();
}

/**
 * Validates whether the mock provider is configured and ready.
 *
 * @returns {Promise<boolean>}
 */
export async function isProviderReady() {
  return true;
}

/**
 * Provider metadata for diagnostics.
 */
export const providerInfo = {
  name: 'mock',
  description: 'Mock provider for local development — no real auth',
  temporary: true,
};
