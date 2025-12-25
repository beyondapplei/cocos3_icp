// Runtime: Cocos editor preview runs modules as ESM (no `require`).
// Load the UMD bundle as a side-effect; it will attach `ethers` onto globalThis.
// This avoids:
// - ESM builds throwing "Unexpected export statement" under CJS loaders
// - Node-style JSON/specifier resolution inside dependencies (e.g. elliptic)

import type { ethers as EthersNS } from 'ethers';
import 'ethers/dist/ethers.umd.js';

const g: any = (typeof globalThis !== 'undefined')
	? globalThis
	: (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {}));

export const ethers: typeof EthersNS = g.ethers as any;
