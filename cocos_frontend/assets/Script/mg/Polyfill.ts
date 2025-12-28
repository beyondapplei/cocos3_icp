// Keep third-party lib3 bundles loaded early (editor preview + build).
// This replaces the old `assets/Script/runtime.ts` entry.

// Minimal environment shims required by some libs (notably ethers).
const g: any = (typeof globalThis !== 'undefined') ? globalThis : (Function('return this')() as any);
if (typeof g.global === 'undefined') g.global = g;
if (typeof g.window === 'undefined') g.window = g;
if (typeof g.self === 'undefined') g.self = g;

// In some JS engines/bundled runtimes, `[].concat(Uint8Array)` does NOT flatten bytes
// (per spec it treats TypedArray as a single element). Some third-party SDKs
// historically relied on flattening behavior for byte concatenation, which can
// lead to corrupted Principal checksum logic in build output.
// Patch concat to expand ArrayBufferViews into number arrays.
if (!g.__concatTypedArrayPolyfillApplied) {
	g.__concatTypedArrayPolyfillApplied = true;
	const origConcat = Array.prototype.concat;
	Array.prototype.concat = function (...args: any[]) {
		if (!args || args.length === 0) return origConcat.apply(this, args as any);

		let needPatch = false;
		for (let i = 0; i < args.length; i++) {
			const a = args[i];
			if (!a) continue;
			if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && ArrayBuffer.isView(a)) {
				needPatch = true;
				break;
			}
		}
		if (!needPatch) return origConcat.apply(this, args as any);

		const expanded: any[] = new Array(args.length);
		for (let i = 0; i < args.length; i++) {
			const a = args[i];
			if (a && typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && ArrayBuffer.isView(a)) {
				// DataView doesn't have numeric iteration in some runtimes; normalize to Uint8Array.
				if (typeof DataView !== 'undefined' && a instanceof DataView) {
					expanded[i] = Array.from(new Uint8Array(a.buffer, a.byteOffset, a.byteLength));
				} else {
					// TypedArray (Uint8Array/Int8Array/...) is iterable -> Array.from yields numbers.
					expanded[i] = Array.from(a as any);
				}
			} else {
				expanded[i] = a;
			}
		}
		return origConcat.apply(this, expanded as any);
	} as any;
}

// Provide a (best-effort) crypto.getRandomValues for libs like ethers.
if (!g.crypto) g.crypto = {};
if (typeof g.crypto.getRandomValues !== 'function') {
	g.crypto.getRandomValues = (arr: Uint8Array) => {
		for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() * 256) | 0;
		return arr;
	};
}

if (typeof g.process === 'undefined') {
	g.process = { env: {}, browser: true, nextTick: (cb: Function) => setTimeout(cb, 0) };
} else {
	if (typeof g.process.env === 'undefined') g.process.env = {};
	if (typeof g.process.browser === 'undefined') g.process.browser = true;
}

// Minimal Buffer polyfill for browser runtimes (ethers expects global Buffer.from).
if (typeof g.Buffer === 'undefined') {
	class BufferShim extends Uint8Array {
		constructor(arg: any) {
			super(arg);
		}

		toString(encoding?: string) {
			if (!encoding || encoding === 'utf8' || encoding === 'utf-8') return new TextDecoder().decode(this);
			if (encoding === 'base64') {
				let s = '';
				for (let i = 0; i < this.length; i++) s += String.fromCharCode(this[i]);
				return btoa(s);
			}
			if (encoding === 'hex') return Array.from(this).map(b => b.toString(16).padStart(2, '0')).join('');
			return new TextDecoder().decode(this);
		}
	}

	const BufferShimAny: any = BufferShim as any;
	BufferShimAny.from = (input: any, encodingOrOffset?: string | number, length?: number) => {
		if (typeof input === 'string') {
			const encoding = typeof encodingOrOffset === 'string' ? encodingOrOffset : 'utf8';
			if (!encoding || encoding === 'utf8' || encoding === 'utf-8') {
				return new BufferShim(new TextEncoder().encode(input));
			}
			if (encoding === 'base64') {
				const bin = atob(input);
				const arr = new Uint8Array(bin.length);
				for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
				return new BufferShim(arr);
			}
			if (encoding === 'hex') {
				const len2 = Math.floor(input.length / 2);
				const arr2 = new Uint8Array(len2);
				for (let i = 0; i < len2; i++) arr2[i] = parseInt(input.substr(i * 2, 2), 16);
				return new BufferShim(arr2);
			}
		}
		if (input instanceof ArrayBuffer) {
			const offset = typeof encodingOrOffset === 'number' ? encodingOrOffset : 0;
			const len3 = length !== undefined ? length : (input.byteLength - offset);
			return new BufferShim(new Uint8Array(input, offset, len3));
		}
		if (Array.isArray(input) || input instanceof Uint8Array) return new BufferShim(input as any);
		throw new Error('Buffer.from: unsupported input');
	};
	BufferShimAny.isBuffer = (obj: any) => obj instanceof Uint8Array;
	BufferShimAny.alloc = (size: number) => new BufferShim(size);
	BufferShimAny.concat = (list: Uint8Array[], totalLength?: number) => {
		let len = totalLength;
		if (!len) len = list.reduce((acc, val) => acc + val.length, 0);
		const result = new BufferShim(len);
		let offset = 0;
		for (const item of list) {
			result.set(item, offset);
			offset += item.length;
		}
		return result;
	};

	g.Buffer = BufferShimAny;
}

export {};
