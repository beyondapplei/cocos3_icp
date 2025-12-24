
// 修复某些打包/转译把 `[...u8a]` 变成 `[].concat(u8a)` 的问题。
// 对 TypedArray 来说，Array#concat 不会展开其元素，会把整个对象当成一个元素，
// 进而导致 `new Uint8Array([].concat(u8a1, u8a2))` 得到全 0，触发 Principal checksum 校验失败。
(() => {
    const g: any = (typeof globalThis !== 'undefined')
        ? globalThis
        : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {}));

    if (!g || g.__patchedTypedArrayConcat) return;
    g.__patchedTypedArrayConcat = true;

    const originalConcat = Array.prototype.concat;

    function isTypedArray(v: any): boolean {
        return !!v && typeof v === 'object' && ArrayBuffer.isView(v) && !(v instanceof DataView);
    }

    // 只针对 `[].concat(typedArray, ...)` 这种模式做最小修复，避免影响其它 concat 用法。
    Array.prototype.concat = function (...args: any[]) {
        try {
            if (Array.isArray(this) && this.length === 0 && args.some(isTypedArray)) {
                const mapped = args.map((a) => (isTypedArray(a) ? Array.from(a as any) : a));
                return originalConcat.apply(this, mapped as any);
            }
        } catch {
            // ignore
        }
        return originalConcat.apply(this, args as any);
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
        console.log("Math.pow patched for BigInt support");
    }
}
