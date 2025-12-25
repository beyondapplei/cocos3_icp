// Runtime: Cocos editor preview runs modules as ESM (no `require`).
// Load the UMD bundle as a side-effect; it will attach `ethers` onto globalThis.
// This avoids:
// - ESM builds throwing "Unexpected export statement" under CJS loaders
// - Node-style JSON/specifier resolution inside dependencies (e.g. elliptic)

import type { ethers as EthersNS } from 'ethers';
// In Cocos preview, UMD bundles often take the CommonJS branch and do NOT attach to global.
// Importing it as a module lets us access the exported object reliably.
import ethersUmd from 'ethers/dist/ethers.umd.js';

const g: any = (typeof globalThis !== 'undefined')
	? globalThis
	: (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {}));

// Resolve ethers from either global (UMD global path) or the module export (UMD CJS path).
const resolved: any = (g.ethers as any) ?? (ethersUmd as any)?.ethers ?? (ethersUmd as any);
if (!g.ethers && resolved) {
	g.ethers = resolved;
}

export const ethers: typeof EthersNS = resolved as any;
export default ethers;
