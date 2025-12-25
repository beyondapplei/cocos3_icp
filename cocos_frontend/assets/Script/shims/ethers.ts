// Placeholder shim.
//
// This project previously loaded `ethers/dist/ethers.umd.js` here, but Cocos Creator's
// build pipeline may treat Babel's ">500KB" deopt note as an error, and some dependency
// resolution paths (e.g. elliptic) can break Rollup.
//
// Keep this file to avoid breaking asset UUID references, but do not import ethers.

export const ethers: any = undefined;
export default ethers;
