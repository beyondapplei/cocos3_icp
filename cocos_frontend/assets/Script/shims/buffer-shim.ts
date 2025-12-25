
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
class BufferShim extends Uint8Array {
  constructor(arg: any) {
      super(arg);
  }

  static from(input: any, encoding?: string) {
    if (typeof input === 'string') {
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
        const len = Math.floor(input.length / 2);
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) arr[i] = parseInt(input.substr(i * 2, 2), 16);
        return new BufferShim(arr);
      }
    }
    if (input instanceof ArrayBuffer) return new BufferShim(new Uint8Array(input));
    if (Array.isArray(input) || input instanceof Uint8Array) return new BufferShim(input as any);
    throw new Error('BufferShim.from: unsupported input');
  }

  static isBuffer(obj: any) {
      return obj instanceof Uint8Array;
  }

  static alloc(size: number) {
      return new BufferShim(size);
  }

  static concat(list: Uint8Array[], totalLength?: number) {
      if (!totalLength) {
          totalLength = list.reduce((acc, val) => acc + val.length, 0);
      }
      const result = new BufferShim(totalLength);
      let offset = 0;
      for (const item of list) {
          result.set(item, offset);
          offset += item.length;
      }
      return result;
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
