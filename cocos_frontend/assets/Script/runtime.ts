// Single runtime entry for Cocos editor preview & builds.
// Keep all global/polyfill patches in ONE place to avoid import-order issues.

import './runtime-global';
import './runtime-polyfills';

// Ensure lib3 bundles execute early in both editor preview and builds.
// These are IIFE/UMD bundles that attach themselves onto globalThis.
import './lib3/ethers.umd.min.js';
import './lib3/icp-sdk-agent.js';
import './lib3/icp-sdk-auth-client.js';
