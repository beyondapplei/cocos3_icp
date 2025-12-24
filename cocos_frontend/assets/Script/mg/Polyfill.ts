import { Principal, base32Encode, getCrc32 } from '@icp-sdk/core/principal';

// 修复某些打包/转译把 `[...u8a]` 变成 `[].concat(u8a)` 的问题。
// 对 TypedArray 来说，Array#concat 不会展开其元素，会把整个对象当成一个元素，
// 进而导致 `new Uint8Array([].concat(u8a1, u8a2))` 得到全 0，触发 Principal checksum 校验失败。
(() => {
    const g: any = (typeof globalThis !== 'undefined')
        ? globalThis
        : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {}));

    if (!g || g.__patchedPrincipalToText) return;
    g.__patchedPrincipalToText = true;

    const proto: any = (Principal as any)?.prototype;
    if (!proto || typeof proto.toText !== 'function') return;

    const originalToText = proto.toText;
    proto.toText = function () {
        try {
            const checksumArrayBuf = new ArrayBuffer(4);
            const view = new DataView(checksumArrayBuf);
            view.setUint32(0, getCrc32(this._arr));
            const checksum = new Uint8Array(checksumArrayBuf);

            const array = new Uint8Array(checksum.length + this._arr.length);
            array.set(checksum, 0);
            array.set(this._arr, checksum.length);

            const result = base32Encode(array);
            const matches = result.match(/.{1,5}/g);
            if (!matches) throw new Error('Invalid principal encoding');
            return matches.join('-');
        } catch {
            // 兜底：如果内部结构变化，回退到原实现
            return originalToText.call(this);
        }
    };
})();

if (typeof BigInt !== 'undefined') {
    const globalMath = Math as any;
    if (!globalMath.__originalPow) {
        globalMath.__originalPow = Math.pow;
        Math.pow = function (base: any, exponent: any) {
            if (typeof base === 'bigint' || typeof exponent === 'bigint') {
                try {
                    const b = BigInt(base);
                    const e = BigInt(exponent);
                    if (e < 0n) {
                        throw new RangeError("BigInt negative exponent");
                    }
                    let res = 1n;
                    let currBase = b;
                    let currExp = e;
                    while (currExp > 0n) {
                        if (currExp % 2n === 1n) res *= currBase;
                        currBase *= currBase;
                        currExp /= 2n;
                    }
                    return res;
                } catch (e) {
                    console.error(`Polyfill error for ${base} ** ${exponent}:`, e);
                    throw e;
                }
            }
            return globalMath.__originalPow(base, exponent);
        };
        // console.log("Math.pow patched for BigInt support");
    }
}
