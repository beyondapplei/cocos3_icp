
// 1. Polyfill globals FIRST (Cocos editor/preview may not have window/self)
const g: any = (typeof globalThis !== 'undefined') ? globalThis : (Function('return this')() as any);
if (typeof g.global === 'undefined') g.global = g;
if (typeof g.window === 'undefined') g.window = g;
if (typeof g.self === 'undefined') g.self = g;

// Provide a (best-effort) crypto.getRandomValues for libs like ethers
if (!g.crypto) g.crypto = {};
if (typeof g.crypto.getRandomValues !== 'function') {
  g.crypto.getRandomValues = (arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() * 256) | 0;
    return arr;
  };
}

// 2. Lightweight Buffer shim (Self-contained, no external imports)
// NOTE: Do NOT override `Uint8Array.from` with a different signature; it breaks TS static-side typing.
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
    // Default to utf8 if unknown or undefined
    return new TextDecoder().decode(this);
  }
}

// Attach Buffer-like static helpers via `any` to avoid TS static-side conflicts.
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
  throw new Error('BufferShim.from: unsupported input');
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

// 3. Expose Buffer and process
if (typeof g.Buffer === 'undefined') {
  g.Buffer = BufferShim;
}

if (typeof g.process === 'undefined') {
  g.process = {
    env: {},
    version: '',
    browser: true,
    nextTick: (cb: Function) => setTimeout(cb, 0)
  };
} else {
  if (typeof g.process.env === 'undefined') g.process.env = {};
  if (typeof g.process.browser === 'undefined') g.process.browser = true;
}

export {};
