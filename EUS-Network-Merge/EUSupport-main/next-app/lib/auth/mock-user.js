/**
 * Mock user data for local development.
 *
 * This file provides a simulated authenticated user so that developers can
 * build and test protected routes without a real authentication backend.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FUTURE: When Cisco Duo MFA integration replaces the temporary custom auth,
 * this mock will only be used in local dev/test environments. The real user
 * will come from the active auth provider (see providers/).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * @typedef {Object} MockUser
 * @property {string} id - Unique user identifier
 * @property {string} username - Display username
 * @property {string} email - User email address
 * @property {string} role - User role (e.g., 'admin', 'technician', 'viewer')
 * @property {string[]} teams - Teams the user belongs to
 * @property {string[]} modules - Modules the user has access to
 */

/** Default mock user for development */
export const MOCK_USER = {
  id: 'dev-user-001',
  username: 'dev.user',
  email: 'dev.user@example.com',
  role: 'admin',
  teams: ['platform', 'support-ops'],
  modules: ['dashboard', 'inventory', 'rma', 'logistics', 'reports', 'admin'],
};

/**
 * Returns the mock user for development.
 * In the future this could be extended to support multiple mock personas
 * for testing different permission levels.
 *
 * @returns {MockUser}
 */
export function getMockUser() {
  return { ...MOCK_USER };
}
