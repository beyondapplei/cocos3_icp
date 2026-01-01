var OisyWalletSigner = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x4) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x4, {
    get: (a4, b6) => (typeof require !== "undefined" ? require : a4)[b6]
  }) : x4)(function(x4) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x4 + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

  // tools/entries/oisy-wallet-signer-entry.js
  var oisy_wallet_signer_entry_exports = {};
  __export(oisy_wallet_signer_entry_exports, {
    IcpWallet: () => Kt
  });

  // node_modules/@icp-sdk/canisters/chunk-W4OHPIZF.js
  function G(e3) {
    return e3 instanceof Uint8Array || ArrayBuffer.isView(e3) && e3.constructor.name === "Uint8Array";
  }
  function w(e3, ...t) {
    if (!G(e3)) throw new Error("Uint8Array expected");
    if (t.length > 0 && !t.includes(e3.length)) throw new Error("Uint8Array expected of length " + t + ", got length=" + e3.length);
  }
  function E(e3, t = true) {
    if (e3.destroyed) throw new Error("Hash instance has been destroyed");
    if (t && e3.finished) throw new Error("Hash#digest() has already been called");
  }
  function D(e3, t) {
    w(e3);
    let n = t.outputLen;
    if (e3.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
  }
  function y(...e3) {
    for (let t = 0; t < e3.length; t++) e3[t].fill(0);
  }
  function H(e3) {
    return new DataView(e3.buffer, e3.byteOffset, e3.byteLength);
  }
  function a(e3, t) {
    return e3 << 32 - t | e3 >>> t;
  }
  function V(e3) {
    if (typeof e3 != "string") throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(e3));
  }
  function U(e3) {
    return typeof e3 == "string" && (e3 = V(e3)), w(e3), e3;
  }
  var A = class {
  };
  function S(e3) {
    let t = (s3) => e3().update(U(s3)).digest(), n = e3();
    return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e3(), t;
  }
  function T(e3, t, n, s3) {
    if (typeof e3.setBigUint64 == "function") return e3.setBigUint64(t, n, s3);
    let o3 = BigInt(32), f4 = BigInt(4294967295), r2 = Number(n >> o3 & f4), i = Number(n & f4), h2 = s3 ? 4 : 0, x4 = s3 ? 0 : 4;
    e3.setUint32(t + h2, r2, s3), e3.setUint32(t + x4, i, s3);
  }
  function F(e3, t, n) {
    return e3 & t ^ ~e3 & n;
  }
  function I(e3, t, n) {
    return e3 & t ^ e3 & n ^ t & n;
  }
  var B = class extends A {
    constructor(t, n, s3, o3) {
      super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = t, this.outputLen = n, this.padOffset = s3, this.isLE = o3, this.buffer = new Uint8Array(t), this.view = H(this.buffer);
    }
    update(t) {
      E(this), t = U(t), w(t);
      let { view: n, buffer: s3, blockLen: o3 } = this, f4 = t.length;
      for (let r2 = 0; r2 < f4; ) {
        let i = Math.min(o3 - this.pos, f4 - r2);
        if (i === o3) {
          let h2 = H(t);
          for (; o3 <= f4 - r2; r2 += o3) this.process(h2, r2);
          continue;
        }
        s3.set(t.subarray(r2, r2 + i), this.pos), this.pos += i, r2 += i, this.pos === o3 && (this.process(n, 0), this.pos = 0);
      }
      return this.length += t.length, this.roundClean(), this;
    }
    digestInto(t) {
      E(this), D(t, this), this.finished = true;
      let { buffer: n, view: s3, blockLen: o3, isLE: f4 } = this, { pos: r2 } = this;
      n[r2++] = 128, y(this.buffer.subarray(r2)), this.padOffset > o3 - r2 && (this.process(s3, 0), r2 = 0);
      for (let c2 = r2; c2 < o3; c2++) n[c2] = 0;
      T(s3, o3 - 8, BigInt(this.length * 8), f4), this.process(s3, 0);
      let i = H(t), h2 = this.outputLen;
      if (h2 % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      let x4 = h2 / 4, u4 = this.get();
      if (x4 > u4.length) throw new Error("_sha2: outputLen bigger than state");
      for (let c2 = 0; c2 < x4; c2++) i.setUint32(4 * c2, u4[c2], f4);
    }
    digest() {
      let { buffer: t, outputLen: n } = this;
      this.digestInto(t);
      let s3 = t.slice(0, n);
      return this.destroy(), s3;
    }
    _cloneInto(t) {
      t || (t = new this.constructor()), t.set(...this.get());
      let { blockLen: n, buffer: s3, length: o3, finished: f4, destroyed: r2, pos: i } = this;
      return t.destroyed = r2, t.finished = f4, t.length = o3, t.pos = i, o3 % n && t.buffer.set(s3), t;
    }
    clone() {
      return this._cloneInto();
    }
  };
  var d = Uint32Array.from([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]);
  var b = Uint32Array.from([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
  var k = Uint32Array.from([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
  var l = new Uint32Array(64);
  var m = class extends B {
    constructor(t = 32) {
      super(64, t, 8, false), this.A = d[0] | 0, this.B = d[1] | 0, this.C = d[2] | 0, this.D = d[3] | 0, this.E = d[4] | 0, this.F = d[5] | 0, this.G = d[6] | 0, this.H = d[7] | 0;
    }
    get() {
      let { A: t, B: n, C: s3, D: o3, E: f4, F: r2, G: i, H: h2 } = this;
      return [t, n, s3, o3, f4, r2, i, h2];
    }
    set(t, n, s3, o3, f4, r2, i, h2) {
      this.A = t | 0, this.B = n | 0, this.C = s3 | 0, this.D = o3 | 0, this.E = f4 | 0, this.F = r2 | 0, this.G = i | 0, this.H = h2 | 0;
    }
    process(t, n) {
      for (let c2 = 0; c2 < 16; c2++, n += 4) l[c2] = t.getUint32(n, false);
      for (let c2 = 16; c2 < 64; c2++) {
        let g5 = l[c2 - 15], p4 = l[c2 - 2], _5 = a(g5, 7) ^ a(g5, 18) ^ g5 >>> 3, L3 = a(p4, 17) ^ a(p4, 19) ^ p4 >>> 10;
        l[c2] = L3 + l[c2 - 7] + _5 + l[c2 - 16] | 0;
      }
      let { A: s3, B: o3, C: f4, D: r2, E: i, F: h2, G: x4, H: u4 } = this;
      for (let c2 = 0; c2 < 64; c2++) {
        let g5 = a(i, 6) ^ a(i, 11) ^ a(i, 25), p4 = u4 + g5 + F(i, h2, x4) + k[c2] + l[c2] | 0, L3 = (a(s3, 2) ^ a(s3, 13) ^ a(s3, 22)) + I(s3, o3, f4) | 0;
        u4 = x4, x4 = h2, h2 = i, i = r2 + p4 | 0, r2 = f4, f4 = o3, o3 = s3, s3 = p4 + L3 | 0;
      }
      s3 = s3 + this.A | 0, o3 = o3 + this.B | 0, f4 = f4 + this.C | 0, r2 = r2 + this.D | 0, i = i + this.E | 0, h2 = h2 + this.F | 0, x4 = x4 + this.G | 0, u4 = u4 + this.H | 0, this.set(s3, o3, f4, r2, i, h2, x4, u4);
    }
    roundClean() {
      y(l);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), y(this.buffer);
    }
  };
  var C = class extends m {
    constructor() {
      super(28), this.A = b[0] | 0, this.B = b[1] | 0, this.C = b[2] | 0, this.D = b[3] | 0, this.E = b[4] | 0, this.F = b[5] | 0, this.G = b[6] | 0, this.H = b[7] | 0;
    }
  };
  var J = S(() => new m());
  var X = S(() => new C());

  // node_modules/@icp-sdk/canisters/chunk-EIYPREIK.js
  var ln = ((t) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(t, { get: (e3, i) => (typeof __require < "u" ? __require : e3)[i] }) : t)(function(t) {
    if (typeof __require < "u") return __require.apply(this, arguments);
    throw Error('Dynamic require of "' + t + '" is not supported');
  });

  // node_modules/@icp-sdk/core/lib/esm/agent/agent/api.js
  var ReplicaRejectCode;
  (function(ReplicaRejectCode2) {
    ReplicaRejectCode2[ReplicaRejectCode2["SysFatal"] = 1] = "SysFatal";
    ReplicaRejectCode2[ReplicaRejectCode2["SysTransient"] = 2] = "SysTransient";
    ReplicaRejectCode2[ReplicaRejectCode2["DestinationInvalid"] = 3] = "DestinationInvalid";
    ReplicaRejectCode2[ReplicaRejectCode2["CanisterReject"] = 4] = "CanisterReject";
    ReplicaRejectCode2[ReplicaRejectCode2["CanisterError"] = 5] = "CanisterError";
  })(ReplicaRejectCode || (ReplicaRejectCode = {}));
  var QueryResponseStatus;
  (function(QueryResponseStatus2) {
    QueryResponseStatus2["Replied"] = "replied";
    QueryResponseStatus2["Rejected"] = "rejected";
  })(QueryResponseStatus || (QueryResponseStatus = {}));

  // node_modules/@icp-sdk/core/lib/esm/principal/utils/base32.js
  var alphabet = "abcdefghijklmnopqrstuvwxyz234567";
  var lookupTable = /* @__PURE__ */ Object.create(null);
  for (let i = 0; i < alphabet.length; i++) {
    lookupTable[alphabet[i]] = i;
  }
  lookupTable["0"] = lookupTable.o;
  lookupTable["1"] = lookupTable.i;
  function base32Encode(input) {
    let skip = 0;
    let bits = 0;
    let output = "";
    function encodeByte(byte) {
      if (skip < 0) {
        bits |= byte >> -skip;
      } else {
        bits = byte << skip & 248;
      }
      if (skip > 3) {
        skip -= 8;
        return 1;
      }
      if (skip < 4) {
        output += alphabet[bits >> 3];
        skip += 5;
      }
      return 0;
    }
    for (let i = 0; i < input.length; ) {
      i += encodeByte(input[i]);
    }
    return output + (skip < 0 ? alphabet[bits >> 3] : "");
  }
  function base32Decode(input) {
    let skip = 0;
    let byte = 0;
    const output = new Uint8Array(input.length * 4 / 3 | 0);
    let o3 = 0;
    function decodeChar(char) {
      let val = lookupTable[char.toLowerCase()];
      if (val === void 0) {
        throw new Error(`Invalid character: ${JSON.stringify(char)}`);
      }
      val <<= 3;
      byte |= val >>> skip;
      skip += 5;
      if (skip >= 8) {
        output[o3++] = byte;
        skip -= 8;
        if (skip > 0) {
          byte = val << 5 - skip & 255;
        } else {
          byte = 0;
        }
      }
    }
    for (const c2 of input) {
      decodeChar(c2);
    }
    return output.slice(0, o3);
  }

  // node_modules/@icp-sdk/core/lib/esm/principal/utils/getCrc.js
  var lookUpTable = new Uint32Array([
    0,
    1996959894,
    3993919788,
    2567524794,
    124634137,
    1886057615,
    3915621685,
    2657392035,
    249268274,
    2044508324,
    3772115230,
    2547177864,
    162941995,
    2125561021,
    3887607047,
    2428444049,
    498536548,
    1789927666,
    4089016648,
    2227061214,
    450548861,
    1843258603,
    4107580753,
    2211677639,
    325883990,
    1684777152,
    4251122042,
    2321926636,
    335633487,
    1661365465,
    4195302755,
    2366115317,
    997073096,
    1281953886,
    3579855332,
    2724688242,
    1006888145,
    1258607687,
    3524101629,
    2768942443,
    901097722,
    1119000684,
    3686517206,
    2898065728,
    853044451,
    1172266101,
    3705015759,
    2882616665,
    651767980,
    1373503546,
    3369554304,
    3218104598,
    565507253,
    1454621731,
    3485111705,
    3099436303,
    671266974,
    1594198024,
    3322730930,
    2970347812,
    795835527,
    1483230225,
    3244367275,
    3060149565,
    1994146192,
    31158534,
    2563907772,
    4023717930,
    1907459465,
    112637215,
    2680153253,
    3904427059,
    2013776290,
    251722036,
    2517215374,
    3775830040,
    2137656763,
    141376813,
    2439277719,
    3865271297,
    1802195444,
    476864866,
    2238001368,
    4066508878,
    1812370925,
    453092731,
    2181625025,
    4111451223,
    1706088902,
    314042704,
    2344532202,
    4240017532,
    1658658271,
    366619977,
    2362670323,
    4224994405,
    1303535960,
    984961486,
    2747007092,
    3569037538,
    1256170817,
    1037604311,
    2765210733,
    3554079995,
    1131014506,
    879679996,
    2909243462,
    3663771856,
    1141124467,
    855842277,
    2852801631,
    3708648649,
    1342533948,
    654459306,
    3188396048,
    3373015174,
    1466479909,
    544179635,
    3110523913,
    3462522015,
    1591671054,
    702138776,
    2966460450,
    3352799412,
    1504918807,
    783551873,
    3082640443,
    3233442989,
    3988292384,
    2596254646,
    62317068,
    1957810842,
    3939845945,
    2647816111,
    81470997,
    1943803523,
    3814918930,
    2489596804,
    225274430,
    2053790376,
    3826175755,
    2466906013,
    167816743,
    2097651377,
    4027552580,
    2265490386,
    503444072,
    1762050814,
    4150417245,
    2154129355,
    426522225,
    1852507879,
    4275313526,
    2312317920,
    282753626,
    1742555852,
    4189708143,
    2394877945,
    397917763,
    1622183637,
    3604390888,
    2714866558,
    953729732,
    1340076626,
    3518719985,
    2797360999,
    1068828381,
    1219638859,
    3624741850,
    2936675148,
    906185462,
    1090812512,
    3747672003,
    2825379669,
    829329135,
    1181335161,
    3412177804,
    3160834842,
    628085408,
    1382605366,
    3423369109,
    3138078467,
    570562233,
    1426400815,
    3317316542,
    2998733608,
    733239954,
    1555261956,
    3268935591,
    3050360625,
    752459403,
    1541320221,
    2607071920,
    3965973030,
    1969922972,
    40735498,
    2617837225,
    3943577151,
    1913087877,
    83908371,
    2512341634,
    3803740692,
    2075208622,
    213261112,
    2463272603,
    3855990285,
    2094854071,
    198958881,
    2262029012,
    4057260610,
    1759359992,
    534414190,
    2176718541,
    4139329115,
    1873836001,
    414664567,
    2282248934,
    4279200368,
    1711684554,
    285281116,
    2405801727,
    4167216745,
    1634467795,
    376229701,
    2685067896,
    3608007406,
    1308918612,
    956543938,
    2808555105,
    3495958263,
    1231636301,
    1047427035,
    2932959818,
    3654703836,
    1088359270,
    936918e3,
    2847714899,
    3736837829,
    1202900863,
    817233897,
    3183342108,
    3401237130,
    1404277552,
    615818150,
    3134207493,
    3453421203,
    1423857449,
    601450431,
    3009837614,
    3294710456,
    1567103746,
    711928724,
    3020668471,
    3272380065,
    1510334235,
    755167117
  ]);
  function getCrc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      const byte = buf[i];
      const t = (byte ^ crc) & 255;
      crc = lookUpTable[t] ^ crc >>> 8;
    }
    return (crc ^ -1) >>> 0;
  }

  // node_modules/@noble/hashes/esm/crypto.js
  var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

  // node_modules/@noble/hashes/esm/utils.js
  function isBytes(a4) {
    return a4 instanceof Uint8Array || ArrayBuffer.isView(a4) && a4.constructor.name === "Uint8Array";
  }
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function abytes(b6, ...lengths) {
    if (!isBytes(b6))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b6.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b6.length);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  var hasHexBuiltin = /* @__PURE__ */ (() => (
    // @ts-ignore
    typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
  ))();
  var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_5, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex(bytes) {
    abytes(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += hexes[bytes[i]];
    }
    return hex;
  }
  var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    if (hasHexBuiltin)
      return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array2 = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array2[ai] = n1 * 16 + n2;
    }
    return array2;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    abytes(data);
    return data;
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a4 = arrays[i];
      abytes(a4);
      sum += a4.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a4 = arrays[i];
      res.set(a4, pad);
      pad += a4.length;
    }
    return res;
  }
  var Hash = class {
  };
  function createHasher(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  function randomBytes(bytesLength = 32) {
    if (crypto2 && typeof crypto2.getRandomValues === "function") {
      return crypto2.getRandomValues(new Uint8Array(bytesLength));
    }
    if (crypto2 && typeof crypto2.randomBytes === "function") {
      return Uint8Array.from(crypto2.randomBytes(bytesLength));
    }
    throw new Error("crypto.getRandomValues must be defined");
  }

  // node_modules/@noble/hashes/esm/_md.js
  function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE);
    const _32n2 = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n2 & _u32_max);
    const wl = Number(value & _u32_max);
    const h2 = isLE ? 4 : 0;
    const l3 = isLE ? 0 : 4;
    view.setUint32(byteOffset + h2, wh, isLE);
    view.setUint32(byteOffset + l3, wl, isLE);
  }
  function Chi(a4, b6, c2) {
    return a4 & b6 ^ ~a4 & c2;
  }
  function Maj(a4, b6, c2) {
    return a4 & b6 ^ a4 & c2 ^ b6 & c2;
  }
  var HashMD = class extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
      super();
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      aexists(this);
      data = toBytes(data);
      abytes(data);
      const { view, buffer, blockLen } = this;
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      clean(this.buffer.subarray(pos));
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  };
  var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA224_IV = /* @__PURE__ */ Uint32Array.from([
    3238371032,
    914150663,
    812702999,
    4144912697,
    4290775857,
    1750603025,
    1694076839,
    3204075428
  ]);
  var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ]);

  // node_modules/@noble/hashes/esm/_u64.js
  var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  var _32n = /* @__PURE__ */ BigInt(32);
  function fromBig(n, le2 = false) {
    if (le2)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le2 = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
      const { h: h2, l: l3 } = fromBig(lst[i], le2);
      [Ah[i], Al[i]] = [h2, l3];
    }
    return [Ah, Al];
  }
  var shrSH = (h2, _l, s3) => h2 >>> s3;
  var shrSL = (h2, l3, s3) => h2 << 32 - s3 | l3 >>> s3;
  var rotrSH = (h2, l3, s3) => h2 >>> s3 | l3 << 32 - s3;
  var rotrSL = (h2, l3, s3) => h2 << 32 - s3 | l3 >>> s3;
  var rotrBH = (h2, l3, s3) => h2 << 64 - s3 | l3 >>> s3 - 32;
  var rotrBL = (h2, l3, s3) => h2 >>> s3 - 32 | l3 << 64 - s3;
  function add(Ah, Al, Bh, Bl) {
    const l3 = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l3 / 2 ** 32 | 0) | 0, l: l3 | 0 };
  }
  var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
  var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
  var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
  var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
  var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
  var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

  // node_modules/@noble/hashes/esm/sha2.js
  var SHA256_K = /* @__PURE__ */ Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA256 = class extends HashMD {
    constructor(outputLen = 32) {
      super(64, outputLen, 8, false);
      this.A = SHA256_IV[0] | 0;
      this.B = SHA256_IV[1] | 0;
      this.C = SHA256_IV[2] | 0;
      this.D = SHA256_IV[3] | 0;
      this.E = SHA256_IV[4] | 0;
      this.F = SHA256_IV[5] | 0;
      this.G = SHA256_IV[6] | 0;
      this.H = SHA256_IV[7] | 0;
    }
    get() {
      const { A: A5, B: B5, C: C5, D: D4, E: E4, F: F4, G: G4, H: H3 } = this;
      return [A5, B5, C5, D4, E4, F4, G4, H3];
    }
    // prettier-ignore
    set(A5, B5, C5, D4, E4, F4, G4, H3) {
      this.A = A5 | 0;
      this.B = B5 | 0;
      this.C = C5 | 0;
      this.D = D4 | 0;
      this.E = E4 | 0;
      this.F = F4 | 0;
      this.G = G4 | 0;
      this.H = H3 | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W22 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W22, 17) ^ rotr(W22, 19) ^ W22 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A: A5, B: B5, C: C5, D: D4, E: E4, F: F4, G: G4, H: H3 } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E4, 6) ^ rotr(E4, 11) ^ rotr(E4, 25);
        const T1 = H3 + sigma1 + Chi(E4, F4, G4) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A5, 2) ^ rotr(A5, 13) ^ rotr(A5, 22);
        const T22 = sigma0 + Maj(A5, B5, C5) | 0;
        H3 = G4;
        G4 = F4;
        F4 = E4;
        E4 = D4 + T1 | 0;
        D4 = C5;
        C5 = B5;
        B5 = A5;
        A5 = T1 + T22 | 0;
      }
      A5 = A5 + this.A | 0;
      B5 = B5 + this.B | 0;
      C5 = C5 + this.C | 0;
      D4 = D4 + this.D | 0;
      E4 = E4 + this.E | 0;
      F4 = F4 + this.F | 0;
      G4 = G4 + this.G | 0;
      H3 = H3 + this.H | 0;
      this.set(A5, B5, C5, D4, E4, F4, G4, H3);
    }
    roundClean() {
      clean(SHA256_W);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      clean(this.buffer);
    }
  };
  var SHA224 = class extends SHA256 {
    constructor() {
      super(28);
      this.A = SHA224_IV[0] | 0;
      this.B = SHA224_IV[1] | 0;
      this.C = SHA224_IV[2] | 0;
      this.D = SHA224_IV[3] | 0;
      this.E = SHA224_IV[4] | 0;
      this.F = SHA224_IV[5] | 0;
      this.G = SHA224_IV[6] | 0;
      this.H = SHA224_IV[7] | 0;
    }
  };
  var K512 = /* @__PURE__ */ (() => split([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((n) => BigInt(n))))();
  var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
  var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
  var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
  var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
  var SHA512 = class extends HashMD {
    constructor(outputLen = 64) {
      super(128, outputLen, 16, false);
      this.Ah = SHA512_IV[0] | 0;
      this.Al = SHA512_IV[1] | 0;
      this.Bh = SHA512_IV[2] | 0;
      this.Bl = SHA512_IV[3] | 0;
      this.Ch = SHA512_IV[4] | 0;
      this.Cl = SHA512_IV[5] | 0;
      this.Dh = SHA512_IV[6] | 0;
      this.Dl = SHA512_IV[7] | 0;
      this.Eh = SHA512_IV[8] | 0;
      this.El = SHA512_IV[9] | 0;
      this.Fh = SHA512_IV[10] | 0;
      this.Fl = SHA512_IV[11] | 0;
      this.Gh = SHA512_IV[12] | 0;
      this.Gl = SHA512_IV[13] | 0;
      this.Hh = SHA512_IV[14] | 0;
      this.Hl = SHA512_IV[15] | 0;
    }
    // prettier-ignore
    get() {
      const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
      this.Ah = Ah | 0;
      this.Al = Al | 0;
      this.Bh = Bh | 0;
      this.Bl = Bl | 0;
      this.Ch = Ch | 0;
      this.Cl = Cl | 0;
      this.Dh = Dh | 0;
      this.Dl = Dl | 0;
      this.Eh = Eh | 0;
      this.El = El | 0;
      this.Fh = Fh | 0;
      this.Fl = Fl | 0;
      this.Gh = Gh | 0;
      this.Gl = Gl | 0;
      this.Hh = Hh | 0;
      this.Hl = Hl | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4) {
        SHA512_W_H[i] = view.getUint32(offset);
        SHA512_W_L[i] = view.getUint32(offset += 4);
      }
      for (let i = 16; i < 80; i++) {
        const W15h = SHA512_W_H[i - 15] | 0;
        const W15l = SHA512_W_L[i - 15] | 0;
        const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
        const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
        const W2h = SHA512_W_H[i - 2] | 0;
        const W2l = SHA512_W_L[i - 2] | 0;
        const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
        const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
        const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
        const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
        SHA512_W_H[i] = SUMh | 0;
        SHA512_W_L[i] = SUMl | 0;
      }
      let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      for (let i = 0; i < 80; i++) {
        const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
        const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
        const CHIh = Eh & Fh ^ ~Eh & Gh;
        const CHIl = El & Fl ^ ~El & Gl;
        const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
        const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
        const T1l = T1ll | 0;
        const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
        const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
        const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
        const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
        Hh = Gh | 0;
        Hl = Gl | 0;
        Gh = Fh | 0;
        Gl = Fl | 0;
        Fh = Eh | 0;
        Fl = El | 0;
        ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
        Dh = Ch | 0;
        Dl = Cl | 0;
        Ch = Bh | 0;
        Cl = Bl | 0;
        Bh = Ah | 0;
        Bl = Al | 0;
        const All = add3L(T1l, sigma0l, MAJl);
        Ah = add3H(All, T1h, sigma0h, MAJh);
        Al = All | 0;
      }
      ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
      ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
      ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
      ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
      ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
      ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
      ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
      ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
      this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
      clean(SHA512_W_H, SHA512_W_L);
    }
    destroy() {
      clean(this.buffer);
      this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  };
  var sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
  var sha224 = /* @__PURE__ */ createHasher(() => new SHA224());
  var sha512 = /* @__PURE__ */ createHasher(() => new SHA512());

  // node_modules/@icp-sdk/core/lib/esm/principal/principal.js
  var JSON_KEY_PRINCIPAL = "__principal__";
  var SELF_AUTHENTICATING_SUFFIX = 2;
  var ANONYMOUS_SUFFIX = 4;
  var MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR = "aaaaa-aa";
  var Principal = class _Principal {
    static anonymous() {
      return new this(new Uint8Array([ANONYMOUS_SUFFIX]));
    }
    /**
     * Utility method, returning the principal representing the management canister, decoded from the hex string `'aaaaa-aa'`
     * @returns {Principal} principal of the management canister
     */
    static managementCanister() {
      return this.fromText(MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR);
    }
    static selfAuthenticating(publicKey) {
      const sha = sha224(publicKey);
      return new this(new Uint8Array([...sha, SELF_AUTHENTICATING_SUFFIX]));
    }
    static from(other) {
      if (typeof other === "string") {
        return _Principal.fromText(other);
      } else if (Object.getPrototypeOf(other) === Uint8Array.prototype) {
        return new _Principal(other);
      } else if (_Principal.isPrincipal(other)) {
        return new _Principal(other._arr);
      }
      throw new Error(`Impossible to convert ${JSON.stringify(other)} to Principal.`);
    }
    static fromHex(hex) {
      return new this(hexToBytes(hex));
    }
    static fromText(text) {
      let maybePrincipal = text;
      if (text.includes(JSON_KEY_PRINCIPAL)) {
        const obj = JSON.parse(text);
        if (JSON_KEY_PRINCIPAL in obj) {
          maybePrincipal = obj[JSON_KEY_PRINCIPAL];
        }
      }
      const canisterIdNoDash = maybePrincipal.toLowerCase().replace(/-/g, "");
      let arr = base32Decode(canisterIdNoDash);
      arr = arr.slice(4, arr.length);
      const principal = new this(arr);
      if (principal.toText() !== maybePrincipal) {
        throw new Error(`Principal "${principal.toText()}" does not have a valid checksum (original value "${maybePrincipal}" may not be a valid Principal ID).`);
      }
      return principal;
    }
    static fromUint8Array(arr) {
      return new this(arr);
    }
    static isPrincipal(other) {
      return other instanceof _Principal || typeof other === "object" && other !== null && "_isPrincipal" in other && other["_isPrincipal"] === true && "_arr" in other && other["_arr"] instanceof Uint8Array;
    }
    constructor(_arr) {
      this._arr = _arr;
      this._isPrincipal = true;
    }
    isAnonymous() {
      return this._arr.byteLength === 1 && this._arr[0] === ANONYMOUS_SUFFIX;
    }
    toUint8Array() {
      return this._arr;
    }
    toHex() {
      return bytesToHex(this._arr).toUpperCase();
    }
    toText() {
      const checksumArrayBuf = new ArrayBuffer(4);
      const view = new DataView(checksumArrayBuf);
      view.setUint32(0, getCrc32(this._arr));
      const checksum = new Uint8Array(checksumArrayBuf);
      const array2 = new Uint8Array([...checksum, ...this._arr]);
      const result = base32Encode(array2);
      const matches = result.match(/.{1,5}/g);
      if (!matches) {
        throw new Error();
      }
      return matches.join("-");
    }
    toString() {
      return this.toText();
    }
    /**
     * Serializes to JSON
     * @returns {JsonnablePrincipal} a JSON object with a single key, {@link JSON_KEY_PRINCIPAL}, whose value is the principal as a string
     */
    toJSON() {
      return { [JSON_KEY_PRINCIPAL]: this.toText() };
    }
    /**
     * Utility method taking a Principal to compare against. Used for determining canister ranges in certificate verification
     * @param {Principal} other - a {@link Principal} to compare
     * @returns {'lt' | 'eq' | 'gt'} `'lt' | 'eq' | 'gt'` a string, representing less than, equal to, or greater than
     */
    compareTo(other) {
      for (let i = 0; i < Math.min(this._arr.length, other._arr.length); i++) {
        if (this._arr[i] < other._arr[i])
          return "lt";
        else if (this._arr[i] > other._arr[i])
          return "gt";
      }
      if (this._arr.length < other._arr.length)
        return "lt";
      if (this._arr.length > other._arr.length)
        return "gt";
      return "eq";
    }
    /**
     * Utility method checking whether a provided Principal is less than or equal to the current one using the {@link Principal.compareTo} method
     * @param other a {@link Principal} to compare
     * @returns {boolean} boolean
     */
    ltEq(other) {
      const cmp = this.compareTo(other);
      return cmp == "lt" || cmp == "eq";
    }
    /**
     * Utility method checking whether a provided Principal is greater than or equal to the current one using the {@link Principal.compareTo} method
     * @param other a {@link Principal} to compare
     * @returns {boolean} boolean
     */
    gtEq(other) {
      const cmp = this.compareTo(other);
      return cmp == "gt" || cmp == "eq";
    }
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/errors.js
  var ErrorKindEnum;
  (function(ErrorKindEnum2) {
    ErrorKindEnum2["Trust"] = "Trust";
    ErrorKindEnum2["Protocol"] = "Protocol";
    ErrorKindEnum2["Reject"] = "Reject";
    ErrorKindEnum2["Transport"] = "Transport";
    ErrorKindEnum2["External"] = "External";
    ErrorKindEnum2["Limit"] = "Limit";
    ErrorKindEnum2["Input"] = "Input";
    ErrorKindEnum2["Unknown"] = "Unknown";
  })(ErrorKindEnum || (ErrorKindEnum = {}));
  var ErrorCode = class {
    constructor(isCertified = false) {
      this.isCertified = isCertified;
    }
    toString() {
      let errorMessage = this.toErrorMessage();
      if (this.requestContext) {
        errorMessage += `
Request context:
  Request ID (hex): ${this.requestContext.requestId ? bytesToHex(this.requestContext.requestId) : "undefined"}
  Sender pubkey (hex): ${bytesToHex(this.requestContext.senderPubKey)}
  Sender signature (hex): ${bytesToHex(this.requestContext.senderSignature)}
  Ingress expiry: ${this.requestContext.ingressExpiry.toString()}`;
      }
      if (this.callContext) {
        errorMessage += `
Call context:
  Canister ID: ${this.callContext.canisterId.toText()}
  Method name: ${this.callContext.methodName}
  HTTP details: ${JSON.stringify(this.callContext.httpDetails, null, 2)}`;
      }
      return errorMessage;
    }
  };
  var AgentError = class _AgentError extends Error {
    get code() {
      return this.cause.code;
    }
    set code(code) {
      this.cause.code = code;
    }
    get kind() {
      return this.cause.kind;
    }
    set kind(kind) {
      this.cause.kind = kind;
    }
    /**
     * Reads the `isCertified` property of the underlying error code.
     * @returns `true` if the error is certified, `false` otherwise.
     */
    get isCertified() {
      return this.code.isCertified;
    }
    constructor(code, kind) {
      super(code.toString());
      this.name = "AgentError";
      this.cause = { code, kind };
      Object.setPrototypeOf(this, _AgentError.prototype);
    }
    hasCode(code) {
      return this.code instanceof code;
    }
    toString() {
      return `${this.name} (${this.kind}): ${this.message}`;
    }
  };
  var ErrorKind = class extends AgentError {
    static fromCode(code) {
      return new this(code);
    }
  };
  var TrustError = class _TrustError extends ErrorKind {
    constructor(code) {
      super(code, ErrorKindEnum.Trust);
      this.name = "TrustError";
      Object.setPrototypeOf(this, _TrustError.prototype);
    }
  };
  var ProtocolError = class _ProtocolError extends ErrorKind {
    constructor(code) {
      super(code, ErrorKindEnum.Protocol);
      this.name = "ProtocolError";
      Object.setPrototypeOf(this, _ProtocolError.prototype);
    }
  };
  var TransportError = class _TransportError extends ErrorKind {
    constructor(code) {
      super(code, ErrorKindEnum.Transport);
      this.name = "TransportError";
      Object.setPrototypeOf(this, _TransportError.prototype);
    }
  };
  var ExternalError = class _ExternalError extends ErrorKind {
    constructor(code) {
      super(code, ErrorKindEnum.External);
      this.name = "ExternalError";
      Object.setPrototypeOf(this, _ExternalError.prototype);
    }
  };
  var InputError = class _InputError extends ErrorKind {
    constructor(code) {
      super(code, ErrorKindEnum.Input);
      this.name = "InputError";
      Object.setPrototypeOf(this, _InputError.prototype);
    }
  };
  var UnknownError = class _UnknownError extends ErrorKind {
    constructor(code) {
      super(code, ErrorKindEnum.Unknown);
      this.name = "UnknownError";
      Object.setPrototypeOf(this, _UnknownError.prototype);
    }
  };
  var CertificateVerificationErrorCode = class _CertificateVerificationErrorCode extends ErrorCode {
    constructor(reason, error) {
      super();
      this.reason = reason;
      this.error = error;
      this.name = "CertificateVerificationErrorCode";
      Object.setPrototypeOf(this, _CertificateVerificationErrorCode.prototype);
    }
    toErrorMessage() {
      let errorMessage = this.reason;
      if (this.error) {
        errorMessage += `: ${formatUnknownError(this.error)}`;
      }
      return `Certificate verification error: "${errorMessage}"`;
    }
  };
  var CertificateTimeErrorCode = class _CertificateTimeErrorCode extends ErrorCode {
    constructor(maxAgeInMinutes, certificateTime, currentTime, timeDiffMsecs, ageType) {
      super();
      this.maxAgeInMinutes = maxAgeInMinutes;
      this.certificateTime = certificateTime;
      this.currentTime = currentTime;
      this.timeDiffMsecs = timeDiffMsecs;
      this.ageType = ageType;
      this.name = "CertificateTimeErrorCode";
      Object.setPrototypeOf(this, _CertificateTimeErrorCode.prototype);
    }
    toErrorMessage() {
      return `Certificate is signed more than ${this.maxAgeInMinutes} minutes in the ${this.ageType}. Certificate time: ${this.certificateTime.toISOString()} Current time: ${this.currentTime.toISOString()} Clock drift: ${this.timeDiffMsecs}ms`;
    }
  };
  var CertificateHasTooManyDelegationsErrorCode = class _CertificateHasTooManyDelegationsErrorCode extends ErrorCode {
    constructor() {
      super();
      this.name = "CertificateHasTooManyDelegationsErrorCode";
      Object.setPrototypeOf(this, _CertificateHasTooManyDelegationsErrorCode.prototype);
    }
    toErrorMessage() {
      return "Certificate has too many delegations";
    }
  };
  var CertificateNotAuthorizedErrorCode = class _CertificateNotAuthorizedErrorCode extends ErrorCode {
    constructor(canisterId, subnetId) {
      super();
      this.canisterId = canisterId;
      this.subnetId = subnetId;
      this.name = "CertificateNotAuthorizedErrorCode";
      Object.setPrototypeOf(this, _CertificateNotAuthorizedErrorCode.prototype);
    }
    toErrorMessage() {
      return `The certificate contains a delegation that does not include the canister ${this.canisterId.toText()} in the canister_ranges field. Subnet ID: ${this.subnetId.toText()}`;
    }
  };
  var CertificateNotAuthorizedForSubnetErrorCode = class _CertificateNotAuthorizedForSubnetErrorCode extends ErrorCode {
    constructor(subnetId) {
      super();
      this.subnetId = subnetId;
      this.name = "CertificateNotAuthorizedForSubnetErrorCode";
      Object.setPrototypeOf(this, _CertificateNotAuthorizedForSubnetErrorCode.prototype);
    }
    toErrorMessage() {
      return `The certificate is not authorized for subnet ${this.subnetId.toText()}`;
    }
  };
  var LookupErrorCode = class _LookupErrorCode extends ErrorCode {
    constructor(message, lookupStatus) {
      super();
      this.message = message;
      this.lookupStatus = lookupStatus;
      this.name = "LookupErrorCode";
      Object.setPrototypeOf(this, _LookupErrorCode.prototype);
    }
    toErrorMessage() {
      return `${this.message}. Lookup status: ${this.lookupStatus}`;
    }
  };
  var MalformedLookupFoundValueErrorCode = class _MalformedLookupFoundValueErrorCode extends ErrorCode {
    constructor(message) {
      super();
      this.message = message;
      this.name = "MalformedLookupFoundValueErrorCode";
      Object.setPrototypeOf(this, _MalformedLookupFoundValueErrorCode.prototype);
    }
    toErrorMessage() {
      return this.message;
    }
  };
  var MissingLookupValueErrorCode = class _MissingLookupValueErrorCode extends ErrorCode {
    constructor(message) {
      super();
      this.message = message;
      this.name = "MissingLookupValueErrorCode";
      Object.setPrototypeOf(this, _MissingLookupValueErrorCode.prototype);
    }
    toErrorMessage() {
      return this.message;
    }
  };
  var DerKeyLengthMismatchErrorCode = class _DerKeyLengthMismatchErrorCode extends ErrorCode {
    constructor(expectedLength, actualLength) {
      super();
      this.expectedLength = expectedLength;
      this.actualLength = actualLength;
      this.name = "DerKeyLengthMismatchErrorCode";
      Object.setPrototypeOf(this, _DerKeyLengthMismatchErrorCode.prototype);
    }
    toErrorMessage() {
      return `BLS DER-encoded public key must be ${this.expectedLength} bytes long, but is ${this.actualLength} bytes long`;
    }
  };
  var DerPrefixMismatchErrorCode = class _DerPrefixMismatchErrorCode extends ErrorCode {
    constructor(expectedPrefix, actualPrefix) {
      super();
      this.expectedPrefix = expectedPrefix;
      this.actualPrefix = actualPrefix;
      this.name = "DerPrefixMismatchErrorCode";
      Object.setPrototypeOf(this, _DerPrefixMismatchErrorCode.prototype);
    }
    toErrorMessage() {
      return `BLS DER-encoded public key is invalid. Expected the following prefix: ${bytesToHex(this.expectedPrefix)}, but got ${bytesToHex(this.actualPrefix)}`;
    }
  };
  var DerDecodeLengthMismatchErrorCode = class _DerDecodeLengthMismatchErrorCode extends ErrorCode {
    constructor(expectedLength, actualLength) {
      super();
      this.expectedLength = expectedLength;
      this.actualLength = actualLength;
      this.name = "DerDecodeLengthMismatchErrorCode";
      Object.setPrototypeOf(this, _DerDecodeLengthMismatchErrorCode.prototype);
    }
    toErrorMessage() {
      return `DER payload mismatch: Expected length ${this.expectedLength}, actual length: ${this.actualLength}`;
    }
  };
  var DerDecodeErrorCode = class _DerDecodeErrorCode extends ErrorCode {
    constructor(error) {
      super();
      this.error = error;
      this.name = "DerDecodeErrorCode";
      Object.setPrototypeOf(this, _DerDecodeErrorCode.prototype);
    }
    toErrorMessage() {
      return `Failed to decode DER: ${this.error}`;
    }
  };
  var DerEncodeErrorCode = class _DerEncodeErrorCode extends ErrorCode {
    constructor(error) {
      super();
      this.error = error;
      this.name = "DerEncodeErrorCode";
      Object.setPrototypeOf(this, _DerEncodeErrorCode.prototype);
    }
    toErrorMessage() {
      return `Failed to encode DER: ${this.error}`;
    }
  };
  var CborDecodeErrorCode = class _CborDecodeErrorCode extends ErrorCode {
    constructor(error, input) {
      super();
      this.error = error;
      this.input = input;
      this.name = "CborDecodeErrorCode";
      Object.setPrototypeOf(this, _CborDecodeErrorCode.prototype);
    }
    toErrorMessage() {
      return `Failed to decode CBOR: ${formatUnknownError(this.error)}, input: ${bytesToHex(this.input)}`;
    }
  };
  var CborEncodeErrorCode = class _CborEncodeErrorCode extends ErrorCode {
    constructor(error, value) {
      super();
      this.error = error;
      this.value = value;
      this.name = "CborEncodeErrorCode";
      Object.setPrototypeOf(this, _CborEncodeErrorCode.prototype);
    }
    toErrorMessage() {
      return `Failed to encode CBOR: ${formatUnknownError(this.error)}, input: ${this.value}`;
    }
  };
  var TimeoutWaitingForResponseErrorCode = class _TimeoutWaitingForResponseErrorCode extends ErrorCode {
    constructor(message, requestId, status) {
      super();
      this.message = message;
      this.requestId = requestId;
      this.status = status;
      this.name = "TimeoutWaitingForResponseErrorCode";
      Object.setPrototypeOf(this, _TimeoutWaitingForResponseErrorCode.prototype);
    }
    toErrorMessage() {
      let errorMessage = `${this.message}
`;
      if (this.requestId) {
        errorMessage += `  Request ID: ${bytesToHex(this.requestId)}
`;
      }
      if (this.status) {
        errorMessage += `  Request status: ${this.status}
`;
      }
      return errorMessage;
    }
  };
  var CertificateOutdatedErrorCode = class _CertificateOutdatedErrorCode extends ErrorCode {
    constructor(maxIngressExpiryInMinutes, requestId, retryTimes) {
      super();
      this.maxIngressExpiryInMinutes = maxIngressExpiryInMinutes;
      this.requestId = requestId;
      this.retryTimes = retryTimes;
      this.name = "CertificateOutdatedErrorCode";
      Object.setPrototypeOf(this, _CertificateOutdatedErrorCode.prototype);
    }
    toErrorMessage() {
      let errorMessage = `Certificate is stale (over ${this.maxIngressExpiryInMinutes} minutes). Is the computer's clock synchronized?
  Request ID: ${bytesToHex(this.requestId)}
`;
      if (this.retryTimes !== void 0) {
        errorMessage += `  Retried ${this.retryTimes} times.`;
      }
      return errorMessage;
    }
  };
  var MissingRootKeyErrorCode = class _MissingRootKeyErrorCode extends ErrorCode {
    constructor(shouldFetchRootKey) {
      super();
      this.shouldFetchRootKey = shouldFetchRootKey;
      this.name = "MissingRootKeyErrorCode";
      Object.setPrototypeOf(this, _MissingRootKeyErrorCode.prototype);
    }
    toErrorMessage() {
      if (this.shouldFetchRootKey === void 0) {
        return "Agent is missing root key";
      }
      return `Agent is missing root key and the shouldFetchRootKey value is set to ${this.shouldFetchRootKey}. The root key should only be unknown if you are in local development. Otherwise you should avoid fetching and use the default IC Root Key or the known root key of your environment.`;
    }
  };
  var HashValueErrorCode = class _HashValueErrorCode extends ErrorCode {
    constructor(value) {
      super();
      this.value = value;
      this.name = "HashValueErrorCode";
      Object.setPrototypeOf(this, _HashValueErrorCode.prototype);
    }
    toErrorMessage() {
      return `Attempt to hash a value of unsupported type: ${this.value}`;
    }
  };
  var HttpDefaultFetchErrorCode = class _HttpDefaultFetchErrorCode extends ErrorCode {
    constructor(error) {
      super();
      this.error = error;
      this.name = "HttpDefaultFetchErrorCode";
      Object.setPrototypeOf(this, _HttpDefaultFetchErrorCode.prototype);
    }
    toErrorMessage() {
      return this.error;
    }
  };
  var IdentityInvalidErrorCode = class _IdentityInvalidErrorCode extends ErrorCode {
    constructor() {
      super();
      this.name = "IdentityInvalidErrorCode";
      Object.setPrototypeOf(this, _IdentityInvalidErrorCode.prototype);
    }
    toErrorMessage() {
      return "This identity has expired due this application's security policy. Please refresh your authentication.";
    }
  };
  var IngressExpiryInvalidErrorCode = class _IngressExpiryInvalidErrorCode extends ErrorCode {
    constructor(message, providedIngressExpiryInMinutes) {
      super();
      this.message = message;
      this.providedIngressExpiryInMinutes = providedIngressExpiryInMinutes;
      this.name = "IngressExpiryInvalidErrorCode";
      Object.setPrototypeOf(this, _IngressExpiryInvalidErrorCode.prototype);
    }
    toErrorMessage() {
      return `${this.message}. Provided ingress expiry time is ${this.providedIngressExpiryInMinutes} minutes.`;
    }
  };
  var CreateHttpAgentErrorCode = class _CreateHttpAgentErrorCode extends ErrorCode {
    constructor() {
      super();
      this.name = "CreateHttpAgentErrorCode";
      Object.setPrototypeOf(this, _CreateHttpAgentErrorCode.prototype);
    }
    toErrorMessage() {
      return "Failed to create agent from provided agent";
    }
  };
  var MalformedSignatureErrorCode = class _MalformedSignatureErrorCode extends ErrorCode {
    constructor(error) {
      super();
      this.error = error;
      this.name = "MalformedSignatureErrorCode";
      Object.setPrototypeOf(this, _MalformedSignatureErrorCode.prototype);
    }
    toErrorMessage() {
      return `Query response contained a malformed signature: ${this.error}`;
    }
  };
  var MissingSignatureErrorCode = class _MissingSignatureErrorCode extends ErrorCode {
    constructor() {
      super();
      this.name = "MissingSignatureErrorCode";
      Object.setPrototypeOf(this, _MissingSignatureErrorCode.prototype);
    }
    toErrorMessage() {
      return "Query response did not contain any node signatures";
    }
  };
  var MalformedPublicKeyErrorCode = class _MalformedPublicKeyErrorCode extends ErrorCode {
    constructor() {
      super();
      this.name = "MalformedPublicKeyErrorCode";
      Object.setPrototypeOf(this, _MalformedPublicKeyErrorCode.prototype);
    }
    toErrorMessage() {
      return "Read state response contained a malformed public key";
    }
  };
  var QuerySignatureVerificationFailedErrorCode = class _QuerySignatureVerificationFailedErrorCode extends ErrorCode {
    constructor(nodeId) {
      super();
      this.nodeId = nodeId;
      this.name = "QuerySignatureVerificationFailedErrorCode";
      Object.setPrototypeOf(this, _QuerySignatureVerificationFailedErrorCode.prototype);
    }
    toErrorMessage() {
      return `Query signature verification failed. Node ID: ${this.nodeId}`;
    }
  };
  var UnexpectedErrorCode = class _UnexpectedErrorCode extends ErrorCode {
    constructor(error) {
      super();
      this.error = error;
      this.name = "UnexpectedErrorCode";
      Object.setPrototypeOf(this, _UnexpectedErrorCode.prototype);
    }
    toErrorMessage() {
      return `Unexpected error: ${formatUnknownError(this.error)}`;
    }
  };
  var HashTreeDecodeErrorCode = class _HashTreeDecodeErrorCode extends ErrorCode {
    constructor(error) {
      super();
      this.error = error;
      this.name = "HashTreeDecodeErrorCode";
      Object.setPrototypeOf(this, _HashTreeDecodeErrorCode.prototype);
    }
    toErrorMessage() {
      return `Failed to decode certificate: ${this.error}`;
    }
  };
  var HttpErrorCode = class _HttpErrorCode extends ErrorCode {
    constructor(status, statusText, headers, bodyText) {
      super();
      this.status = status;
      this.statusText = statusText;
      this.headers = headers;
      this.bodyText = bodyText;
      this.name = "HttpErrorCode";
      Object.setPrototypeOf(this, _HttpErrorCode.prototype);
    }
    toErrorMessage() {
      let errorMessage = `HTTP request failed:
  Status: ${this.status} (${this.statusText})
  Headers: ${JSON.stringify(this.headers)}
`;
      if (this.bodyText) {
        errorMessage += `  Body: ${this.bodyText}
`;
      }
      return errorMessage;
    }
  };
  var HttpV4ApiNotSupportedErrorCode = class _HttpV4ApiNotSupportedErrorCode extends ErrorCode {
    constructor() {
      super();
      this.name = "HttpV4ApiNotSupportedErrorCode";
      Object.setPrototypeOf(this, _HttpV4ApiNotSupportedErrorCode.prototype);
    }
    toErrorMessage() {
      return "HTTP request failed: v4 API is not supported";
    }
  };
  var HttpFetchErrorCode = class _HttpFetchErrorCode extends ErrorCode {
    constructor(error) {
      super();
      this.error = error;
      this.name = "HttpFetchErrorCode";
      Object.setPrototypeOf(this, _HttpFetchErrorCode.prototype);
    }
    toErrorMessage() {
      return `Failed to fetch HTTP request: ${formatUnknownError(this.error)}`;
    }
  };
  var ExpiryJsonDeserializeErrorCode = class _ExpiryJsonDeserializeErrorCode extends ErrorCode {
    constructor(error) {
      super();
      this.error = error;
      this.name = "ExpiryJsonDeserializeErrorCode";
      Object.setPrototypeOf(this, _ExpiryJsonDeserializeErrorCode.prototype);
    }
    toErrorMessage() {
      return `Failed to deserialize expiry: ${this.error}`;
    }
  };
  function formatUnknownError(error) {
    if (error instanceof Error) {
      return error.stack ?? error.message;
    }
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }
  var UNREACHABLE_ERROR = new Error("unreachable");

  // node_modules/@icp-sdk/core/lib/esm/candid/idl.js
  var idl_exports = {};
  __export(idl_exports, {
    Bool: () => Bool,
    BoolClass: () => BoolClass,
    ConstructType: () => ConstructType,
    Empty: () => Empty,
    EmptyClass: () => EmptyClass,
    FixedIntClass: () => FixedIntClass,
    FixedNatClass: () => FixedNatClass,
    Float32: () => Float32,
    Float64: () => Float64,
    FloatClass: () => FloatClass,
    Func: () => Func,
    FuncClass: () => FuncClass,
    Int: () => Int,
    Int16: () => Int16,
    Int32: () => Int32,
    Int64: () => Int64,
    Int8: () => Int8,
    IntClass: () => IntClass,
    Nat: () => Nat,
    Nat16: () => Nat16,
    Nat32: () => Nat32,
    Nat64: () => Nat64,
    Nat8: () => Nat8,
    NatClass: () => NatClass,
    Null: () => Null,
    NullClass: () => NullClass,
    Opt: () => Opt,
    OptClass: () => OptClass,
    PrimitiveType: () => PrimitiveType,
    Principal: () => Principal2,
    PrincipalClass: () => PrincipalClass,
    Rec: () => Rec,
    RecClass: () => RecClass,
    Record: () => Record,
    RecordClass: () => RecordClass,
    Reserved: () => Reserved,
    ReservedClass: () => ReservedClass,
    Service: () => Service,
    ServiceClass: () => ServiceClass,
    Text: () => Text,
    TextClass: () => TextClass,
    Tuple: () => Tuple,
    TupleClass: () => TupleClass,
    Type: () => Type,
    Unknown: () => Unknown,
    UnknownClass: () => UnknownClass,
    Variant: () => Variant,
    VariantClass: () => VariantClass,
    Vec: () => Vec,
    VecClass: () => VecClass,
    Visitor: () => Visitor,
    decode: () => decode,
    encode: () => encode,
    resetSubtypeCache: () => resetSubtypeCache,
    subtype: () => subtype
  });

  // node_modules/@icp-sdk/core/lib/esm/candid/utils/buffer.js
  function concat(...uint8Arrays) {
    const result = new Uint8Array(uint8Arrays.reduce((acc, curr) => acc + curr.byteLength, 0));
    let index = 0;
    for (const b6 of uint8Arrays) {
      result.set(b6, index);
      index += b6.byteLength;
    }
    return result;
  }
  var PipeArrayBuffer = class {
    /**
     * Save a checkpoint of the reading view (for backtracking)
     */
    save() {
      return this._view;
    }
    /**
     * Restore a checkpoint of the reading view (for backtracking)
     * @param checkPoint a previously saved checkpoint
     */
    restore(checkPoint) {
      if (!(checkPoint instanceof Uint8Array)) {
        throw new Error("Checkpoint must be a Uint8Array");
      }
      this._view = checkPoint;
    }
    /**
     * Creates a new instance of a pipe
     * @param buffer an optional buffer to start with
     * @param length an optional amount of bytes to use for the length.
     */
    constructor(buffer, length = buffer?.byteLength || 0) {
      if (buffer && !(buffer instanceof Uint8Array)) {
        try {
          buffer = uint8FromBufLike(buffer);
        } catch {
          throw new Error("Buffer must be a Uint8Array");
        }
      }
      if (length < 0 || !Number.isInteger(length)) {
        throw new Error("Length must be a non-negative integer");
      }
      if (buffer && length > buffer.byteLength) {
        throw new Error("Length cannot exceed buffer length");
      }
      this._buffer = buffer || new Uint8Array(0);
      this._view = new Uint8Array(this._buffer.buffer, 0, length);
    }
    get buffer() {
      return this._view.slice();
    }
    get byteLength() {
      return this._view.byteLength;
    }
    /**
     * Read `num` number of bytes from the front of the pipe.
     * @param num The number of bytes to read.
     */
    read(num) {
      const result = this._view.subarray(0, num);
      this._view = this._view.subarray(num);
      return result.slice();
    }
    readUint8() {
      if (this._view.byteLength === 0) {
        return void 0;
      }
      const result = this._view[0];
      this._view = this._view.subarray(1);
      return result;
    }
    /**
     * Write a buffer to the end of the pipe.
     * @param buf The bytes to write.
     */
    write(buf) {
      if (!(buf instanceof Uint8Array)) {
        throw new Error("Buffer must be a Uint8Array");
      }
      const offset = this._view.byteLength;
      if (this._view.byteOffset + this._view.byteLength + buf.byteLength >= this._buffer.byteLength) {
        this.alloc(buf.byteLength);
      } else {
        this._view = new Uint8Array(this._buffer.buffer, this._view.byteOffset, this._view.byteLength + buf.byteLength);
      }
      this._view.set(buf, offset);
    }
    /**
     * Whether or not there is more data to read from the buffer
     */
    get end() {
      return this._view.byteLength === 0;
    }
    /**
     * Allocate a fixed amount of memory in the buffer. This does not affect the view.
     * @param amount A number of bytes to add to the buffer.
     */
    alloc(amount) {
      if (amount <= 0 || !Number.isInteger(amount)) {
        throw new Error("Amount must be a positive integer");
      }
      const b6 = new Uint8Array((this._buffer.byteLength + amount) * 1.2 | 0);
      const v3 = new Uint8Array(b6.buffer, 0, this._view.byteLength + amount);
      v3.set(this._view);
      this._buffer = b6;
      this._view = v3;
    }
  };
  function uint8FromBufLike(bufLike) {
    if (!bufLike) {
      throw new Error("Input cannot be null or undefined");
    }
    if (bufLike instanceof Uint8Array) {
      return bufLike;
    }
    if (bufLike instanceof ArrayBuffer) {
      return new Uint8Array(bufLike);
    }
    if (Array.isArray(bufLike)) {
      return new Uint8Array(bufLike);
    }
    if ("buffer" in bufLike) {
      return uint8FromBufLike(bufLike.buffer);
    }
    return new Uint8Array(bufLike);
  }
  function compare(u1, u22) {
    if (u1.byteLength !== u22.byteLength) {
      return u1.byteLength - u22.byteLength;
    }
    for (let i = 0; i < u1.length; i++) {
      if (u1[i] !== u22[i]) {
        return u1[i] - u22[i];
      }
    }
    return 0;
  }
  function uint8ToDataView(uint8) {
    if (!(uint8 instanceof Uint8Array)) {
      throw new Error("Input must be a Uint8Array");
    }
    return new DataView(uint8.buffer, uint8.byteOffset, uint8.byteLength);
  }

  // node_modules/@icp-sdk/core/lib/esm/candid/utils/hash.js
  function idlHash(s3) {
    const utf8encoder = new TextEncoder();
    const array2 = utf8encoder.encode(s3);
    let h2 = 0;
    for (const c2 of array2) {
      h2 = (h2 * 223 + c2) % 2 ** 32;
    }
    return h2;
  }
  function idlLabelToId(label) {
    if (/^_\d+_$/.test(label) || /^_0x[0-9a-fA-F]+_$/.test(label)) {
      const num = +label.slice(1, -1);
      if (Number.isSafeInteger(num) && num >= 0 && num < 2 ** 32) {
        return num;
      }
    }
    return idlHash(label);
  }

  // node_modules/@icp-sdk/core/lib/esm/candid/utils/bigint-math.js
  function ilog2(n) {
    const nBig = BigInt(n);
    if (n <= 0) {
      throw new RangeError("Input must be positive");
    }
    return nBig.toString(2).length - 1;
  }
  function iexp2(n) {
    const nBig = BigInt(n);
    if (n < 0) {
      throw new RangeError("Input must be non-negative");
    }
    return BigInt(1) << nBig;
  }

  // node_modules/@icp-sdk/core/lib/esm/candid/utils/leb128.js
  function eob() {
    throw new Error("unexpected end of buffer");
  }
  function safeRead(pipe2, num) {
    if (pipe2.byteLength < num) {
      eob();
    }
    return pipe2.read(num);
  }
  function safeReadUint8(pipe2) {
    const byte = pipe2.readUint8();
    if (byte === void 0) {
      eob();
    }
    return byte;
  }
  function lebEncode(value) {
    if (typeof value === "number") {
      value = BigInt(value);
    }
    if (value < BigInt(0)) {
      throw new Error("Cannot leb encode negative values.");
    }
    const byteLength = (value === BigInt(0) ? 0 : ilog2(value)) + 1;
    const pipe2 = new PipeArrayBuffer(new Uint8Array(byteLength), 0);
    while (true) {
      const i = Number(value & BigInt(127));
      value /= BigInt(128);
      if (value === BigInt(0)) {
        pipe2.write(new Uint8Array([i]));
        break;
      } else {
        pipe2.write(new Uint8Array([i | 128]));
      }
    }
    return pipe2.buffer;
  }
  function lebDecode(pipe2) {
    let weight = BigInt(1);
    let value = BigInt(0);
    let byte;
    do {
      byte = safeReadUint8(pipe2);
      value += BigInt(byte & 127).valueOf() * weight;
      weight *= BigInt(128);
    } while (byte >= 128);
    return value;
  }
  function slebEncode(value) {
    if (typeof value === "number") {
      value = BigInt(value);
    }
    const isNeg = value < BigInt(0);
    if (isNeg) {
      value = -value - BigInt(1);
    }
    const byteLength = (value === BigInt(0) ? 0 : ilog2(value)) + 1;
    const pipe2 = new PipeArrayBuffer(new Uint8Array(byteLength), 0);
    while (true) {
      const i = getLowerBytes(value);
      value /= BigInt(128);
      if (isNeg && value === BigInt(0) && (i & 64) !== 0 || !isNeg && value === BigInt(0) && (i & 64) === 0) {
        pipe2.write(new Uint8Array([i]));
        break;
      } else {
        pipe2.write(new Uint8Array([i | 128]));
      }
    }
    function getLowerBytes(num) {
      const bytes = num % BigInt(128);
      if (isNeg) {
        return Number(BigInt(128) - bytes - BigInt(1));
      } else {
        return Number(bytes);
      }
    }
    return pipe2.buffer;
  }
  function slebDecode(pipe2) {
    const pipeView = new Uint8Array(pipe2.buffer);
    let len = 0;
    for (; len < pipeView.byteLength; len++) {
      if (pipeView[len] < 128) {
        if ((pipeView[len] & 64) === 0) {
          return lebDecode(pipe2);
        }
        break;
      }
    }
    const bytes = new Uint8Array(safeRead(pipe2, len + 1));
    let value = BigInt(0);
    for (let i = bytes.byteLength - 1; i >= 0; i--) {
      value = value * BigInt(128) + BigInt(128 - (bytes[i] & 127) - 1);
    }
    return -value - BigInt(1);
  }
  function writeUIntLE(value, byteLength) {
    if (BigInt(value) < BigInt(0)) {
      throw new Error("Cannot write negative values.");
    }
    return writeIntLE(value, byteLength);
  }
  function writeIntLE(value, byteLength) {
    value = BigInt(value);
    const pipe2 = new PipeArrayBuffer(new Uint8Array(Math.min(1, byteLength)), 0);
    let i = 0;
    let mul = BigInt(256);
    let sub = BigInt(0);
    let byte = Number(value % mul);
    pipe2.write(new Uint8Array([byte]));
    while (++i < byteLength) {
      if (value < 0 && sub === BigInt(0) && byte !== 0) {
        sub = BigInt(1);
      }
      byte = Number((value / mul - sub) % BigInt(256));
      pipe2.write(new Uint8Array([byte]));
      mul *= BigInt(256);
    }
    return pipe2.buffer;
  }
  function readUIntLE(pipe2, byteLength) {
    if (byteLength <= 0 || !Number.isInteger(byteLength)) {
      throw new Error("Byte length must be a positive integer");
    }
    let val = BigInt(safeReadUint8(pipe2));
    let mul = BigInt(1);
    let i = 0;
    while (++i < byteLength) {
      mul *= BigInt(256);
      const byte = BigInt(safeReadUint8(pipe2));
      val = val + mul * byte;
    }
    return val;
  }
  function readIntLE(pipe2, byteLength) {
    if (byteLength <= 0 || !Number.isInteger(byteLength)) {
      throw new Error("Byte length must be a positive integer");
    }
    let val = readUIntLE(pipe2, byteLength);
    const mul = BigInt(2) ** (BigInt(8) * BigInt(byteLength - 1) + BigInt(7));
    if (val >= mul) {
      val -= mul * BigInt(2);
    }
    return val;
  }

  // node_modules/@icp-sdk/core/lib/esm/candid/idl.js
  var IDLTypeIds;
  (function(IDLTypeIds2) {
    IDLTypeIds2[IDLTypeIds2["Null"] = -1] = "Null";
    IDLTypeIds2[IDLTypeIds2["Bool"] = -2] = "Bool";
    IDLTypeIds2[IDLTypeIds2["Nat"] = -3] = "Nat";
    IDLTypeIds2[IDLTypeIds2["Int"] = -4] = "Int";
    IDLTypeIds2[IDLTypeIds2["Float32"] = -13] = "Float32";
    IDLTypeIds2[IDLTypeIds2["Float64"] = -14] = "Float64";
    IDLTypeIds2[IDLTypeIds2["Text"] = -15] = "Text";
    IDLTypeIds2[IDLTypeIds2["Reserved"] = -16] = "Reserved";
    IDLTypeIds2[IDLTypeIds2["Empty"] = -17] = "Empty";
    IDLTypeIds2[IDLTypeIds2["Opt"] = -18] = "Opt";
    IDLTypeIds2[IDLTypeIds2["Vector"] = -19] = "Vector";
    IDLTypeIds2[IDLTypeIds2["Record"] = -20] = "Record";
    IDLTypeIds2[IDLTypeIds2["Variant"] = -21] = "Variant";
    IDLTypeIds2[IDLTypeIds2["Func"] = -22] = "Func";
    IDLTypeIds2[IDLTypeIds2["Service"] = -23] = "Service";
    IDLTypeIds2[IDLTypeIds2["Principal"] = -24] = "Principal";
  })(IDLTypeIds || (IDLTypeIds = {}));
  var magicNumber = "DIDL";
  var magicNumberBytes = new TextEncoder().encode(magicNumber);
  var toReadableString_max = 400;
  function zipWith(xs, ys, f4) {
    return xs.map((x4, i) => f4(x4, ys[i]));
  }
  var TypeTable = class {
    constructor() {
      this._typs = [];
      this._idx = /* @__PURE__ */ new Map();
      this._idxRefCount = /* @__PURE__ */ new Map();
    }
    has(obj) {
      return this._idx.has(obj.name);
    }
    add(type, buf) {
      const idx = this._typs.length;
      this._idx.set(type.name, idx);
      this._idxRefCount.set(idx, 1);
      this._typs.push(buf);
    }
    merge(obj, knot) {
      const idx = this._idx.get(obj.name);
      const knotIdx = this._idx.get(knot);
      if (idx === void 0) {
        throw new Error("Missing type index for " + obj);
      }
      if (knotIdx === void 0) {
        throw new Error("Missing type index for " + knot);
      }
      this._typs[idx] = this._typs[knotIdx];
      const idxRefCount = this._getIdxRefCount(idx);
      const knotRefCount = this._getIdxRefCount(knotIdx);
      this._idxRefCount.set(idx, idxRefCount + knotRefCount);
      this._idx.set(knot, idx);
      this._idxRefCount.set(knotIdx, 0);
      this._compactFromEnd();
    }
    _getIdxRefCount(idx) {
      return this._idxRefCount.get(idx) || 0;
    }
    _compactFromEnd() {
      while (this._typs.length > 0) {
        const lastIndex = this._typs.length - 1;
        if (this._getIdxRefCount(lastIndex) > 0) {
          break;
        }
        this._typs.pop();
        this._idxRefCount.delete(lastIndex);
      }
    }
    encode() {
      const len = lebEncode(this._typs.length);
      const buf = concat(...this._typs);
      return concat(len, buf);
    }
    indexOf(typeName) {
      if (!this._idx.has(typeName)) {
        throw new Error("Missing type index for " + typeName);
      }
      return slebEncode(this._idx.get(typeName) || 0);
    }
  };
  var Visitor = class {
    visitType(_t2, _data) {
      throw new Error("Not implemented");
    }
    visitPrimitive(t, data) {
      return this.visitType(t, data);
    }
    visitEmpty(t, data) {
      return this.visitPrimitive(t, data);
    }
    visitBool(t, data) {
      return this.visitPrimitive(t, data);
    }
    visitNull(t, data) {
      return this.visitPrimitive(t, data);
    }
    visitReserved(t, data) {
      return this.visitPrimitive(t, data);
    }
    visitText(t, data) {
      return this.visitPrimitive(t, data);
    }
    visitNumber(t, data) {
      return this.visitPrimitive(t, data);
    }
    visitInt(t, data) {
      return this.visitNumber(t, data);
    }
    visitNat(t, data) {
      return this.visitNumber(t, data);
    }
    visitFloat(t, data) {
      return this.visitPrimitive(t, data);
    }
    visitFixedInt(t, data) {
      return this.visitNumber(t, data);
    }
    visitFixedNat(t, data) {
      return this.visitNumber(t, data);
    }
    visitPrincipal(t, data) {
      return this.visitPrimitive(t, data);
    }
    visitConstruct(t, data) {
      return this.visitType(t, data);
    }
    visitVec(t, _ty, data) {
      return this.visitConstruct(t, data);
    }
    visitOpt(t, _ty, data) {
      return this.visitConstruct(t, data);
    }
    visitRecord(t, _fields, data) {
      return this.visitConstruct(t, data);
    }
    visitTuple(t, components, data) {
      const fields = components.map((ty, i) => [`_${i}_`, ty]);
      return this.visitRecord(t, fields, data);
    }
    visitVariant(t, _fields, data) {
      return this.visitConstruct(t, data);
    }
    visitRec(_t2, ty, data) {
      return this.visitConstruct(ty, data);
    }
    visitFunc(t, data) {
      return this.visitConstruct(t, data);
    }
    visitService(t, data) {
      return this.visitConstruct(t, data);
    }
  };
  var IdlTypeName;
  (function(IdlTypeName2) {
    IdlTypeName2["EmptyClass"] = "__IDL_EmptyClass__";
    IdlTypeName2["UnknownClass"] = "__IDL_UnknownClass__";
    IdlTypeName2["BoolClass"] = "__IDL_BoolClass__";
    IdlTypeName2["NullClass"] = "__IDL_NullClass__";
    IdlTypeName2["ReservedClass"] = "__IDL_ReservedClass__";
    IdlTypeName2["TextClass"] = "__IDL_TextClass__";
    IdlTypeName2["IntClass"] = "__IDL_IntClass__";
    IdlTypeName2["NatClass"] = "__IDL_NatClass__";
    IdlTypeName2["FloatClass"] = "__IDL_FloatClass__";
    IdlTypeName2["FixedIntClass"] = "__IDL_FixedIntClass__";
    IdlTypeName2["FixedNatClass"] = "__IDL_FixedNatClass__";
    IdlTypeName2["VecClass"] = "__IDL_VecClass__";
    IdlTypeName2["OptClass"] = "__IDL_OptClass__";
    IdlTypeName2["RecordClass"] = "__IDL_RecordClass__";
    IdlTypeName2["TupleClass"] = "__IDL_TupleClass__";
    IdlTypeName2["VariantClass"] = "__IDL_VariantClass__";
    IdlTypeName2["RecClass"] = "__IDL_RecClass__";
    IdlTypeName2["PrincipalClass"] = "__IDL_PrincipalClass__";
    IdlTypeName2["FuncClass"] = "__IDL_FuncClass__";
    IdlTypeName2["ServiceClass"] = "__IDL_ServiceClass__";
  })(IdlTypeName || (IdlTypeName = {}));
  var Type = class {
    /* Display type name */
    display() {
      return this.name;
    }
    valueToString(x4) {
      return toReadableString(x4);
    }
    /* Implement `T` in the IDL spec, only needed for non-primitive types */
    buildTypeTable(typeTable) {
      if (!typeTable.has(this)) {
        this._buildTypeTableImpl(typeTable);
      }
    }
  };
  var PrimitiveType = class extends Type {
    checkType(t) {
      if (this.name !== t.name) {
        throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
      }
      return t;
    }
    _buildTypeTableImpl(_typeTable) {
      return;
    }
  };
  var ConstructType = class extends Type {
    checkType(t) {
      if (t instanceof RecClass) {
        const ty = t.getType();
        if (typeof ty === "undefined") {
          throw new Error("type mismatch with uninitialized type");
        }
        return ty;
      }
      throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
    }
    encodeType(typeTable) {
      return typeTable.indexOf(this.name);
    }
  };
  var EmptyClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.EmptyClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.EmptyClass;
    }
    accept(v3, d4) {
      return v3.visitEmpty(this, d4);
    }
    covariant(x4) {
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue() {
      throw new Error("Empty cannot appear as a function argument");
    }
    valueToString() {
      throw new Error("Empty cannot appear as a value");
    }
    encodeType() {
      return slebEncode(IDLTypeIds.Empty);
    }
    decodeValue() {
      throw new Error("Empty cannot appear as an output");
    }
    get name() {
      return "empty";
    }
  };
  var UnknownClass = class extends Type {
    get typeName() {
      return IdlTypeName.UnknownClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.UnknownClass;
    }
    checkType(_t2) {
      throw new Error("Method not implemented for unknown.");
    }
    accept(v3, d4) {
      throw v3.visitType(this, d4);
    }
    covariant(x4) {
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue() {
      throw new Error("Unknown cannot appear as a function argument");
    }
    valueToString() {
      throw new Error("Unknown cannot appear as a value");
    }
    encodeType() {
      throw new Error("Unknown cannot be serialized");
    }
    decodeValue(b6, t) {
      let decodedValue = t.decodeValue(b6, t);
      if (Object(decodedValue) !== decodedValue) {
        decodedValue = Object(decodedValue);
      }
      let typeFunc;
      if (t instanceof RecClass) {
        typeFunc = () => t.getType();
      } else {
        typeFunc = () => t;
      }
      Object.defineProperty(decodedValue, "type", {
        value: typeFunc,
        writable: true,
        enumerable: false,
        configurable: true
      });
      return decodedValue;
    }
    _buildTypeTableImpl() {
      throw new Error("Unknown cannot be serialized");
    }
    get name() {
      return "Unknown";
    }
  };
  var BoolClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.BoolClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.BoolClass;
    }
    accept(v3, d4) {
      return v3.visitBool(this, d4);
    }
    covariant(x4) {
      if (typeof x4 === "boolean")
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      return new Uint8Array([x4 ? 1 : 0]);
    }
    encodeType() {
      return slebEncode(IDLTypeIds.Bool);
    }
    decodeValue(b6, t) {
      this.checkType(t);
      switch (safeReadUint8(b6)) {
        case 0:
          return false;
        case 1:
          return true;
        default:
          throw new Error("Boolean value out of range");
      }
    }
    get name() {
      return "bool";
    }
  };
  var NullClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.NullClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.NullClass;
    }
    accept(v3, d4) {
      return v3.visitNull(this, d4);
    }
    covariant(x4) {
      if (x4 === null)
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue() {
      return new Uint8Array(0);
    }
    encodeType() {
      return slebEncode(IDLTypeIds.Null);
    }
    decodeValue(_b2, t) {
      this.checkType(t);
      return null;
    }
    get name() {
      return "null";
    }
  };
  var ReservedClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.ReservedClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.ReservedClass;
    }
    accept(v3, d4) {
      return v3.visitReserved(this, d4);
    }
    covariant(_x) {
      return true;
    }
    encodeValue() {
      return new Uint8Array(0);
    }
    encodeType() {
      return slebEncode(IDLTypeIds.Reserved);
    }
    decodeValue(b6, t) {
      if (t.name !== this.name) {
        t.decodeValue(b6, t);
      }
      return null;
    }
    get name() {
      return "reserved";
    }
  };
  var TextClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.TextClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.TextClass;
    }
    accept(v3, d4) {
      return v3.visitText(this, d4);
    }
    covariant(x4) {
      if (typeof x4 === "string")
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      const buf = new TextEncoder().encode(x4);
      const len = lebEncode(buf.byteLength);
      return concat(len, buf);
    }
    encodeType() {
      return slebEncode(IDLTypeIds.Text);
    }
    decodeValue(b6, t) {
      this.checkType(t);
      const len = lebDecode(b6);
      const buf = safeRead(b6, Number(len));
      const decoder = new TextDecoder("utf8", { fatal: true });
      return decoder.decode(buf);
    }
    get name() {
      return "text";
    }
    valueToString(x4) {
      return '"' + x4 + '"';
    }
  };
  var IntClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.IntClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.IntClass;
    }
    accept(v3, d4) {
      return v3.visitInt(this, d4);
    }
    covariant(x4) {
      if (typeof x4 === "bigint" || Number.isInteger(x4))
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      return slebEncode(x4);
    }
    encodeType() {
      return slebEncode(IDLTypeIds.Int);
    }
    decodeValue(b6, t) {
      this.checkType(t);
      return slebDecode(b6);
    }
    get name() {
      return "int";
    }
    valueToString(x4) {
      return x4.toString();
    }
  };
  var NatClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.NatClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.NatClass;
    }
    accept(v3, d4) {
      return v3.visitNat(this, d4);
    }
    covariant(x4) {
      if (typeof x4 === "bigint" && x4 >= BigInt(0) || Number.isInteger(x4) && x4 >= 0)
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      return lebEncode(x4);
    }
    encodeType() {
      return slebEncode(IDLTypeIds.Nat);
    }
    decodeValue(b6, t) {
      this.checkType(t);
      return lebDecode(b6);
    }
    get name() {
      return "nat";
    }
    valueToString(x4) {
      return x4.toString();
    }
  };
  var FloatClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.FloatClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.FloatClass;
    }
    constructor(_bits) {
      super();
      this._bits = _bits;
      if (_bits !== 32 && _bits !== 64) {
        throw new Error("not a valid float type");
      }
    }
    accept(v3, d4) {
      return v3.visitFloat(this, d4);
    }
    covariant(x4) {
      if (typeof x4 === "number" || x4 instanceof Number)
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      const buf = new ArrayBuffer(this._bits / 8);
      const view = new DataView(buf);
      if (this._bits === 32) {
        view.setFloat32(0, x4, true);
      } else {
        view.setFloat64(0, x4, true);
      }
      return new Uint8Array(buf);
    }
    encodeType() {
      const opcode = this._bits === 32 ? IDLTypeIds.Float32 : IDLTypeIds.Float64;
      return slebEncode(opcode);
    }
    decodeValue(b6, t) {
      this.checkType(t);
      const bytes = safeRead(b6, this._bits / 8);
      const view = uint8ToDataView(bytes);
      if (this._bits === 32) {
        return view.getFloat32(0, true);
      } else {
        return view.getFloat64(0, true);
      }
    }
    get name() {
      return "float" + this._bits;
    }
    valueToString(x4) {
      return x4.toString();
    }
  };
  var FixedIntClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.FixedIntClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.FixedIntClass;
    }
    constructor(_bits) {
      super();
      this._bits = _bits;
    }
    accept(v3, d4) {
      return v3.visitFixedInt(this, d4);
    }
    covariant(x4) {
      const min = iexp2(this._bits - 1) * BigInt(-1);
      const max = iexp2(this._bits - 1) - BigInt(1);
      let ok = false;
      if (typeof x4 === "bigint") {
        ok = x4 >= min && x4 <= max;
      } else if (Number.isInteger(x4)) {
        const v3 = BigInt(x4);
        ok = v3 >= min && v3 <= max;
      } else {
        ok = false;
      }
      if (ok)
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      return writeIntLE(x4, this._bits / 8);
    }
    encodeType() {
      const offset = Math.log2(this._bits) - 3;
      return slebEncode(-9 - offset);
    }
    decodeValue(b6, t) {
      this.checkType(t);
      const num = readIntLE(b6, this._bits / 8);
      if (this._bits <= 32) {
        return Number(num);
      } else {
        return num;
      }
    }
    get name() {
      return `int${this._bits}`;
    }
    valueToString(x4) {
      return x4.toString();
    }
  };
  var FixedNatClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.FixedNatClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.FixedNatClass;
    }
    constructor(_bits) {
      super();
      this._bits = _bits;
    }
    accept(v3, d4) {
      return v3.visitFixedNat(this, d4);
    }
    covariant(x4) {
      const max = iexp2(this._bits);
      let ok = false;
      if (typeof x4 === "bigint" && x4 >= BigInt(0)) {
        ok = x4 < max;
      } else if (Number.isInteger(x4) && x4 >= 0) {
        const v3 = BigInt(x4);
        ok = v3 < max;
      } else {
        ok = false;
      }
      if (ok)
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      return writeUIntLE(x4, this._bits / 8);
    }
    encodeType() {
      const offset = Math.log2(this._bits) - 3;
      return slebEncode(-5 - offset);
    }
    decodeValue(b6, t) {
      this.checkType(t);
      const num = readUIntLE(b6, this._bits / 8);
      if (this._bits <= 32) {
        return Number(num);
      } else {
        return num;
      }
    }
    get name() {
      return `nat${this._bits}`;
    }
    valueToString(x4) {
      return x4.toString();
    }
  };
  var VecClass = class _VecClass extends ConstructType {
    get typeName() {
      return IdlTypeName.VecClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.VecClass;
    }
    constructor(_type) {
      super();
      this._type = _type;
      this._blobOptimization = false;
      if (_type instanceof FixedNatClass && _type._bits === 8) {
        this._blobOptimization = true;
      }
    }
    accept(v3, d4) {
      return v3.visitVec(this, this._type, d4);
    }
    covariant(x4) {
      const bits = this._type instanceof FixedNatClass ? this._type._bits : this._type instanceof FixedIntClass ? this._type._bits : 0;
      if (ArrayBuffer.isView(x4) && bits == x4.BYTES_PER_ELEMENT * 8 || Array.isArray(x4) && x4.every((v3, idx) => {
        try {
          return this._type.covariant(v3);
        } catch (e3) {
          throw new Error(`Invalid ${this.display()} argument: 

index ${idx} -> ${e3.message}`);
        }
      }))
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      const len = lebEncode(x4.length);
      if (this._blobOptimization) {
        return concat(len, new Uint8Array(x4));
      }
      if (ArrayBuffer.isView(x4)) {
        if (x4 instanceof Int16Array || x4 instanceof Uint16Array) {
          const buffer = new DataView(new ArrayBuffer(x4.length * 2));
          for (let i = 0; i < x4.length; i++) {
            if (x4 instanceof Int16Array) {
              buffer.setInt16(i * 2, x4[i], true);
            } else {
              buffer.setUint16(i * 2, x4[i], true);
            }
          }
          return concat(len, new Uint8Array(buffer.buffer));
        } else if (x4 instanceof Int32Array || x4 instanceof Uint32Array) {
          const buffer = new DataView(new ArrayBuffer(x4.length * 4));
          for (let i = 0; i < x4.length; i++) {
            if (x4 instanceof Int32Array) {
              buffer.setInt32(i * 4, x4[i], true);
            } else {
              buffer.setUint32(i * 4, x4[i], true);
            }
          }
          return concat(len, new Uint8Array(buffer.buffer));
        } else if (x4 instanceof BigInt64Array || x4 instanceof BigUint64Array) {
          const buffer = new DataView(new ArrayBuffer(x4.length * 8));
          for (let i = 0; i < x4.length; i++) {
            if (x4 instanceof BigInt64Array) {
              buffer.setBigInt64(i * 8, x4[i], true);
            } else {
              buffer.setBigUint64(i * 8, x4[i], true);
            }
          }
          return concat(len, new Uint8Array(buffer.buffer));
        } else {
          return concat(len, new Uint8Array(x4.buffer, x4.byteOffset, x4.byteLength));
        }
      }
      const buf = new PipeArrayBuffer(new Uint8Array(len.byteLength + x4.length), 0);
      buf.write(len);
      for (const d4 of x4) {
        const encoded = this._type.encodeValue(d4);
        buf.write(new Uint8Array(encoded));
      }
      return buf.buffer;
    }
    _buildTypeTableImpl(typeTable) {
      this._type.buildTypeTable(typeTable);
      const opCode = slebEncode(IDLTypeIds.Vector);
      const buffer = this._type.encodeType(typeTable);
      typeTable.add(this, concat(opCode, buffer));
    }
    decodeValue(b6, t) {
      const vec = this.checkType(t);
      if (!(vec instanceof _VecClass)) {
        throw new Error("Not a vector type");
      }
      const len = Number(lebDecode(b6));
      if (this._type instanceof FixedNatClass) {
        if (this._type._bits == 8) {
          return new Uint8Array(b6.read(len));
        }
        if (this._type._bits == 16) {
          const bytes = b6.read(len * 2);
          const u16 = new Uint16Array(bytes.buffer, bytes.byteOffset, len);
          return u16;
        }
        if (this._type._bits == 32) {
          const bytes = b6.read(len * 4);
          const u32 = new Uint32Array(bytes.buffer, bytes.byteOffset, len);
          return u32;
        }
        if (this._type._bits == 64) {
          return new BigUint64Array(b6.read(len * 8).buffer);
        }
      }
      if (this._type instanceof FixedIntClass) {
        if (this._type._bits == 8) {
          return new Int8Array(b6.read(len));
        }
        if (this._type._bits == 16) {
          const bytes = b6.read(len * 2);
          const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          const result = new Int16Array(len);
          for (let i = 0; i < len; i++) {
            result[i] = view.getInt16(i * 2, true);
          }
          return result;
        }
        if (this._type._bits == 32) {
          const bytes = b6.read(len * 4);
          const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          const result = new Int32Array(len);
          for (let i = 0; i < len; i++) {
            result[i] = view.getInt32(i * 4, true);
          }
          return result;
        }
        if (this._type._bits == 64) {
          const bytes = b6.read(len * 8);
          const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          const result = new BigInt64Array(len);
          for (let i = 0; i < len; i++) {
            result[i] = view.getBigInt64(i * 8, true);
          }
          return result;
        }
      }
      const rets = [];
      for (let i = 0; i < len; i++) {
        rets.push(this._type.decodeValue(b6, vec._type));
      }
      return rets;
    }
    get name() {
      return `vec ${this._type.name}`;
    }
    display() {
      return `vec ${this._type.display()}`;
    }
    valueToString(x4) {
      const elements = x4.map((e3) => this._type.valueToString(e3));
      return "vec {" + elements.join("; ") + "}";
    }
  };
  var OptClass = class _OptClass extends ConstructType {
    get typeName() {
      return IdlTypeName.OptClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.OptClass;
    }
    constructor(_type) {
      super();
      this._type = _type;
    }
    accept(v3, d4) {
      return v3.visitOpt(this, this._type, d4);
    }
    covariant(x4) {
      try {
        if (Array.isArray(x4) && (x4.length === 0 || x4.length === 1 && this._type.covariant(x4[0])))
          return true;
      } catch (e3) {
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)} 

-> ${e3.message}`);
      }
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      if (x4.length === 0) {
        return new Uint8Array([0]);
      } else {
        return concat(new Uint8Array([1]), this._type.encodeValue(x4[0]));
      }
    }
    _buildTypeTableImpl(typeTable) {
      this._type.buildTypeTable(typeTable);
      const opCode = slebEncode(IDLTypeIds.Opt);
      const buffer = this._type.encodeType(typeTable);
      typeTable.add(this, concat(opCode, buffer));
    }
    decodeValue(b6, t) {
      if (t instanceof NullClass) {
        return [];
      }
      if (t instanceof ReservedClass) {
        return [];
      }
      let wireType = t;
      if (t instanceof RecClass) {
        const ty = t.getType();
        if (typeof ty === "undefined") {
          throw new Error("type mismatch with uninitialized type");
        } else
          wireType = ty;
      }
      if (wireType instanceof _OptClass) {
        switch (safeReadUint8(b6)) {
          case 0:
            return [];
          case 1: {
            const checkpoint = b6.save();
            try {
              const v3 = this._type.decodeValue(b6, wireType._type);
              return [v3];
            } catch (e3) {
              b6.restore(checkpoint);
              wireType._type.decodeValue(b6, wireType._type);
              return [];
            }
          }
          default:
            throw new Error("Not an option value");
        }
      } else if (
        // this check corresponds to `not (null <: <t>)` in the spec
        this._type instanceof NullClass || this._type instanceof _OptClass || this._type instanceof ReservedClass
      ) {
        wireType.decodeValue(b6, wireType);
        return [];
      } else {
        const checkpoint = b6.save();
        try {
          const v3 = this._type.decodeValue(b6, t);
          return [v3];
        } catch (e3) {
          b6.restore(checkpoint);
          wireType.decodeValue(b6, t);
          return [];
        }
      }
    }
    get name() {
      return `opt ${this._type.name}`;
    }
    display() {
      return `opt ${this._type.display()}`;
    }
    valueToString(x4) {
      if (x4.length === 0) {
        return "null";
      } else {
        return `opt ${this._type.valueToString(x4[0])}`;
      }
    }
  };
  var RecordClass = class _RecordClass extends ConstructType {
    get typeName() {
      return IdlTypeName.RecordClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.RecordClass || instance.typeName === IdlTypeName.TupleClass;
    }
    constructor(fields = {}) {
      super();
      this._fields = Object.entries(fields).sort((a4, b6) => idlLabelToId(a4[0]) - idlLabelToId(b6[0]));
    }
    accept(v3, d4) {
      return v3.visitRecord(this, this._fields, d4);
    }
    tryAsTuple() {
      const res = [];
      for (let i = 0; i < this._fields.length; i++) {
        const [key, type] = this._fields[i];
        if (key !== `_${i}_`) {
          return null;
        }
        res.push(type);
      }
      return res;
    }
    covariant(x4) {
      if (typeof x4 === "object" && this._fields.every(([k5, t]) => {
        if (!x4.hasOwnProperty(k5)) {
          throw new Error(`Record is missing key "${k5}".`);
        }
        try {
          return t.covariant(x4[k5]);
        } catch (e3) {
          throw new Error(`Invalid ${this.display()} argument: 

field ${k5} -> ${e3.message}`);
        }
      }))
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      const values = this._fields.map(([key]) => x4[key]);
      const bufs = zipWith(this._fields, values, ([, c2], d4) => c2.encodeValue(d4));
      return concat(...bufs);
    }
    _buildTypeTableImpl(T4) {
      this._fields.forEach(([_5, value]) => value.buildTypeTable(T4));
      const opCode = slebEncode(IDLTypeIds.Record);
      const len = lebEncode(this._fields.length);
      const fields = this._fields.map(([key, value]) => concat(lebEncode(idlLabelToId(key)), value.encodeType(T4)));
      T4.add(this, concat(opCode, len, concat(...fields)));
    }
    decodeValue(b6, t) {
      const record = this.checkType(t);
      if (!(record instanceof _RecordClass)) {
        throw new Error("Not a record type");
      }
      const x4 = {};
      let expectedRecordIdx = 0;
      let actualRecordIdx = 0;
      while (actualRecordIdx < record._fields.length) {
        const [hash, type] = record._fields[actualRecordIdx];
        if (expectedRecordIdx >= this._fields.length) {
          type.decodeValue(b6, type);
          actualRecordIdx++;
          continue;
        }
        const [expectKey, expectType] = this._fields[expectedRecordIdx];
        const expectedId = idlLabelToId(this._fields[expectedRecordIdx][0]);
        const actualId = idlLabelToId(hash);
        if (expectedId === actualId) {
          x4[expectKey] = expectType.decodeValue(b6, type);
          expectedRecordIdx++;
          actualRecordIdx++;
        } else if (actualId > expectedId) {
          if (expectType instanceof OptClass || expectType instanceof ReservedClass) {
            x4[expectKey] = [];
            expectedRecordIdx++;
          } else {
            throw new Error("Cannot find required field " + expectKey);
          }
        } else {
          type.decodeValue(b6, type);
          actualRecordIdx++;
        }
      }
      for (const [expectKey, expectType] of this._fields.slice(expectedRecordIdx)) {
        if (expectType instanceof OptClass || expectType instanceof ReservedClass) {
          x4[expectKey] = [];
        } else {
          throw new Error("Cannot find required field " + expectKey);
        }
      }
      return x4;
    }
    get fieldsAsObject() {
      const fields = {};
      for (const [name, ty] of this._fields) {
        fields[idlLabelToId(name)] = ty;
      }
      return fields;
    }
    get name() {
      const fields = this._fields.map(([key, value]) => key + ":" + value.name);
      return `record {${fields.join("; ")}}`;
    }
    display() {
      const fields = this._fields.map(([key, value]) => key + ":" + value.display());
      return `record {${fields.join("; ")}}`;
    }
    valueToString(x4) {
      const values = this._fields.map(([key]) => x4[key]);
      const fields = zipWith(this._fields, values, ([k5, c2], d4) => k5 + "=" + c2.valueToString(d4));
      return `record {${fields.join("; ")}}`;
    }
  };
  var TupleClass = class _TupleClass extends RecordClass {
    get typeName() {
      return IdlTypeName.TupleClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.TupleClass;
    }
    constructor(_components) {
      const x4 = {};
      _components.forEach((e3, i) => x4["_" + i + "_"] = e3);
      super(x4);
      this._components = _components;
    }
    accept(v3, d4) {
      return v3.visitTuple(this, this._components, d4);
    }
    covariant(x4) {
      if (Array.isArray(x4) && x4.length >= this._fields.length && this._components.every((t, i) => {
        try {
          return t.covariant(x4[i]);
        } catch (e3) {
          throw new Error(`Invalid ${this.display()} argument: 

index ${i} -> ${e3.message}`);
        }
      }))
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      const bufs = zipWith(this._components, x4, (c2, d4) => c2.encodeValue(d4));
      return concat(...bufs);
    }
    decodeValue(b6, t) {
      const tuple2 = this.checkType(t);
      if (!(tuple2 instanceof _TupleClass)) {
        throw new Error("not a tuple type");
      }
      if (tuple2._components.length < this._components.length) {
        throw new Error("tuple mismatch");
      }
      const res = [];
      for (const [i, wireType] of tuple2._components.entries()) {
        if (i >= this._components.length) {
          wireType.decodeValue(b6, wireType);
        } else {
          res.push(this._components[i].decodeValue(b6, wireType));
        }
      }
      return res;
    }
    display() {
      const fields = this._components.map((value) => value.display());
      return `record {${fields.join("; ")}}`;
    }
    valueToString(values) {
      const fields = zipWith(this._components, values, (c2, d4) => c2.valueToString(d4));
      return `record {${fields.join("; ")}}`;
    }
  };
  var VariantClass = class _VariantClass extends ConstructType {
    get typeName() {
      return IdlTypeName.VariantClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.VariantClass;
    }
    constructor(fields = {}) {
      super();
      this._fields = Object.entries(fields).sort((a4, b6) => idlLabelToId(a4[0]) - idlLabelToId(b6[0]));
    }
    accept(v3, d4) {
      return v3.visitVariant(this, this._fields, d4);
    }
    covariant(x4) {
      if (typeof x4 === "object" && Object.entries(x4).length === 1 && this._fields.every(([k5, v3]) => {
        try {
          return !x4.hasOwnProperty(k5) || v3.covariant(x4[k5]);
        } catch (e3) {
          throw new Error(`Invalid ${this.display()} argument: 

variant ${k5} -> ${e3.message}`);
        }
      }))
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      for (let i = 0; i < this._fields.length; i++) {
        const [name, type] = this._fields[i];
        if (x4.hasOwnProperty(name)) {
          const idx = lebEncode(i);
          const buf = type.encodeValue(x4[name]);
          return concat(idx, buf);
        }
      }
      throw Error("Variant has no data: " + x4);
    }
    _buildTypeTableImpl(typeTable) {
      this._fields.forEach(([, type]) => {
        type.buildTypeTable(typeTable);
      });
      const opCode = slebEncode(IDLTypeIds.Variant);
      const len = lebEncode(this._fields.length);
      const fields = this._fields.map(([key, value]) => concat(lebEncode(idlLabelToId(key)), value.encodeType(typeTable)));
      typeTable.add(this, concat(opCode, len, ...fields));
    }
    decodeValue(b6, t) {
      const variant = this.checkType(t);
      if (!(variant instanceof _VariantClass)) {
        throw new Error("Not a variant type");
      }
      const idx = Number(lebDecode(b6));
      if (idx >= variant._fields.length) {
        throw Error("Invalid variant index: " + idx);
      }
      const [wireHash, wireType] = variant._fields[idx];
      for (const [key, expectType] of this._fields) {
        if (idlLabelToId(wireHash) === idlLabelToId(key)) {
          const value = expectType.decodeValue(b6, wireType);
          return { [key]: value };
        }
      }
      throw new Error("Cannot find field hash " + wireHash);
    }
    get name() {
      const fields = this._fields.map(([key, type]) => key + ":" + type.name);
      return `variant {${fields.join("; ")}}`;
    }
    display() {
      const fields = this._fields.map(([key, type]) => key + (type.name === "null" ? "" : `:${type.display()}`));
      return `variant {${fields.join("; ")}}`;
    }
    valueToString(x4) {
      for (const [name, type] of this._fields) {
        if (x4.hasOwnProperty(name)) {
          const value = type.valueToString(x4[name]);
          if (value === "null") {
            return `variant {${name}}`;
          } else {
            return `variant {${name}=${value}}`;
          }
        }
      }
      throw new Error("Variant has no data: " + x4);
    }
    get alternativesAsObject() {
      const alternatives = {};
      for (const [name, ty] of this._fields) {
        alternatives[idlLabelToId(name)] = ty;
      }
      return alternatives;
    }
  };
  var RecClass = class _RecClass extends ConstructType {
    constructor() {
      super(...arguments);
      this._id = _RecClass._counter++;
    }
    get typeName() {
      return IdlTypeName.RecClass;
    }
    static {
      this._counter = 0;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.RecClass;
    }
    accept(v3, d4) {
      if (!this._type) {
        throw Error("Recursive type uninitialized.");
      }
      return v3.visitRec(this, this._type, d4);
    }
    fill(t) {
      this._type = t;
    }
    getType() {
      return this._type;
    }
    covariant(x4) {
      if (this._type ? this._type.covariant(x4) : false)
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      if (!this._type) {
        throw Error("Recursive type uninitialized.");
      }
      return this._type.encodeValue(x4);
    }
    _buildTypeTableImpl(typeTable) {
      if (!this._type) {
        throw Error("Recursive type uninitialized.");
      }
      typeTable.add(this, new Uint8Array([]));
      this._type.buildTypeTable(typeTable);
      typeTable.merge(this, this._type.name);
    }
    decodeValue(b6, t) {
      if (!this._type) {
        throw Error("Recursive type uninitialized.");
      }
      return this._type.decodeValue(b6, t);
    }
    get name() {
      return `rec_${this._id}`;
    }
    display() {
      if (!this._type) {
        throw Error("Recursive type uninitialized.");
      }
      return `μ${this.name}.${this._type.name}`;
    }
    valueToString(x4) {
      if (!this._type) {
        throw Error("Recursive type uninitialized.");
      }
      return this._type.valueToString(x4);
    }
  };
  function decodePrincipalId(b6) {
    const x4 = safeReadUint8(b6);
    if (x4 !== 1) {
      throw new Error("Cannot decode principal");
    }
    const len = Number(lebDecode(b6));
    return Principal.fromUint8Array(new Uint8Array(safeRead(b6, len)));
  }
  var PrincipalClass = class extends PrimitiveType {
    get typeName() {
      return IdlTypeName.PrincipalClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.PrincipalClass;
    }
    accept(v3, d4) {
      return v3.visitPrincipal(this, d4);
    }
    covariant(x4) {
      if (x4 && x4._isPrincipal)
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      const buf = x4.toUint8Array();
      const len = lebEncode(buf.byteLength);
      return concat(new Uint8Array([1]), len, buf);
    }
    encodeType() {
      return slebEncode(IDLTypeIds.Principal);
    }
    decodeValue(b6, t) {
      this.checkType(t);
      return decodePrincipalId(b6);
    }
    get name() {
      return "principal";
    }
    valueToString(x4) {
      return `${this.name} "${x4.toText()}"`;
    }
  };
  var FuncClass = class extends ConstructType {
    get typeName() {
      return IdlTypeName.FuncClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.FuncClass;
    }
    static argsToString(types, v3) {
      if (types.length !== v3.length) {
        throw new Error("arity mismatch");
      }
      return "(" + types.map((t, i) => t.valueToString(v3[i])).join(", ") + ")";
    }
    constructor(argTypes, retTypes, annotations = []) {
      super();
      this.argTypes = argTypes;
      this.retTypes = retTypes;
      this.annotations = annotations;
    }
    accept(v3, d4) {
      return v3.visitFunc(this, d4);
    }
    covariant(x4) {
      if (Array.isArray(x4) && x4.length === 2 && x4[0] && x4[0]._isPrincipal && typeof x4[1] === "string")
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue([principal, methodName]) {
      const buf = principal.toUint8Array();
      const len = lebEncode(buf.byteLength);
      const canister = concat(new Uint8Array([1]), len, buf);
      const method = new TextEncoder().encode(methodName);
      const methodLen = lebEncode(method.byteLength);
      return concat(new Uint8Array([1]), canister, methodLen, method);
    }
    _buildTypeTableImpl(T4) {
      this.argTypes.forEach((arg) => arg.buildTypeTable(T4));
      this.retTypes.forEach((arg) => arg.buildTypeTable(T4));
      const opCode = slebEncode(IDLTypeIds.Func);
      const argLen = lebEncode(this.argTypes.length);
      const args = concat(...this.argTypes.map((arg) => arg.encodeType(T4)));
      const retLen = lebEncode(this.retTypes.length);
      const rets = concat(...this.retTypes.map((arg) => arg.encodeType(T4)));
      const annLen = lebEncode(this.annotations.length);
      const anns = concat(...this.annotations.map((a4) => this.encodeAnnotation(a4)));
      T4.add(this, concat(opCode, argLen, args, retLen, rets, annLen, anns));
    }
    decodeValue(b6, t) {
      const tt3 = t instanceof RecClass ? t.getType() ?? t : t;
      if (!subtype(tt3, this)) {
        throw new Error(`Cannot decode function reference at type ${this.display()} from wire type ${tt3.display()}`);
      }
      const x4 = safeReadUint8(b6);
      if (x4 !== 1) {
        throw new Error("Cannot decode function reference");
      }
      const canister = decodePrincipalId(b6);
      const mLen = Number(lebDecode(b6));
      const buf = safeRead(b6, mLen);
      const decoder = new TextDecoder("utf8", { fatal: true });
      const method = decoder.decode(buf);
      return [canister, method];
    }
    get name() {
      const args = this.argTypes.map((arg) => arg.name).join(", ");
      const rets = this.retTypes.map((arg) => arg.name).join(", ");
      const annon = " " + this.annotations.join(" ");
      return `(${args}) -> (${rets})${annon}`;
    }
    valueToString([principal, str]) {
      return `func "${principal.toText()}".${str}`;
    }
    display() {
      const args = this.argTypes.map((arg) => arg.display()).join(", ");
      const rets = this.retTypes.map((arg) => arg.display()).join(", ");
      const annon = " " + this.annotations.join(" ");
      return `(${args}) → (${rets})${annon}`;
    }
    encodeAnnotation(ann) {
      if (ann === "query") {
        return new Uint8Array([1]);
      } else if (ann === "oneway") {
        return new Uint8Array([2]);
      } else if (ann === "composite_query") {
        return new Uint8Array([3]);
      } else {
        throw new Error("Illegal function annotation");
      }
    }
  };
  var ServiceClass = class extends ConstructType {
    get typeName() {
      return IdlTypeName.ServiceClass;
    }
    static [Symbol.hasInstance](instance) {
      return instance.typeName === IdlTypeName.ServiceClass;
    }
    constructor(fields) {
      super();
      this._fields = Object.entries(fields).sort((a4, b6) => {
        if (a4[0] < b6[0]) {
          return -1;
        }
        if (a4[0] > b6[0]) {
          return 1;
        }
        return 0;
      });
    }
    accept(v3, d4) {
      return v3.visitService(this, d4);
    }
    covariant(x4) {
      if (x4 && x4._isPrincipal)
        return true;
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x4)}`);
    }
    encodeValue(x4) {
      const buf = x4.toUint8Array();
      const len = lebEncode(buf.length);
      return concat(new Uint8Array([1]), len, buf);
    }
    _buildTypeTableImpl(T4) {
      this._fields.forEach(([_5, func]) => func.buildTypeTable(T4));
      const opCode = slebEncode(IDLTypeIds.Service);
      const len = lebEncode(this._fields.length);
      const meths = this._fields.map(([label, func]) => {
        const labelBuf = new TextEncoder().encode(label);
        const labelLen = lebEncode(labelBuf.length);
        return concat(labelLen, labelBuf, func.encodeType(T4));
      });
      T4.add(this, concat(opCode, len, ...meths));
    }
    decodeValue(b6, t) {
      const tt3 = t instanceof RecClass ? t.getType() ?? t : t;
      if (!subtype(tt3, this)) {
        throw new Error(`Cannot decode service reference at type ${this.display()} from wire type ${tt3.display()}`);
      }
      return decodePrincipalId(b6);
    }
    get name() {
      const fields = this._fields.map(([key, value]) => key + ":" + value.name);
      return `service {${fields.join("; ")}}`;
    }
    valueToString(x4) {
      return `service "${x4.toText()}"`;
    }
    fieldsAsObject() {
      const fields = {};
      for (const [name, ty] of this._fields) {
        fields[name] = ty;
      }
      return fields;
    }
  };
  function toReadableString(x4) {
    const str = JSON.stringify(x4, (_key, value) => typeof value === "bigint" ? `BigInt(${value})` : value);
    return str && str.length > toReadableString_max ? str.substring(0, toReadableString_max - 3) + "..." : str;
  }
  function encode(argTypes, args) {
    if (args.length < argTypes.length) {
      throw Error("Wrong number of message arguments");
    }
    const typeTable = new TypeTable();
    argTypes.forEach((t) => t.buildTypeTable(typeTable));
    const table = typeTable.encode();
    const len = lebEncode(args.length);
    const typs = concat(...argTypes.map((t) => t.encodeType(typeTable)));
    const vals = concat(...zipWith(argTypes, args, (t, x4) => {
      try {
        t.covariant(x4);
      } catch (e3) {
        const err = new Error(e3.message + "\n\n");
        throw err;
      }
      return t.encodeValue(x4);
    }));
    return concat(magicNumberBytes, table, len, typs, vals);
  }
  function decode(retTypes, bytes) {
    const b6 = new PipeArrayBuffer(bytes);
    if (bytes.byteLength < magicNumber.length) {
      throw new Error("Message length smaller than magic number");
    }
    const magicBuffer = safeRead(b6, magicNumber.length);
    const magic = new TextDecoder().decode(magicBuffer);
    if (magic !== magicNumber) {
      throw new Error("Wrong magic number: " + JSON.stringify(magic));
    }
    function readTypeTable(pipe2) {
      const typeTable = [];
      const len = Number(lebDecode(pipe2));
      for (let i = 0; i < len; i++) {
        const ty = Number(slebDecode(pipe2));
        switch (ty) {
          case IDLTypeIds.Opt:
          case IDLTypeIds.Vector: {
            const t = Number(slebDecode(pipe2));
            typeTable.push([ty, t]);
            break;
          }
          case IDLTypeIds.Record:
          case IDLTypeIds.Variant: {
            const fields = [];
            let objectLength = Number(lebDecode(pipe2));
            let prevHash;
            while (objectLength--) {
              const hash = Number(lebDecode(pipe2));
              if (hash >= Math.pow(2, 32)) {
                throw new Error("field id out of 32-bit range");
              }
              if (typeof prevHash === "number" && prevHash >= hash) {
                throw new Error("field id collision or not sorted");
              }
              prevHash = hash;
              const t = Number(slebDecode(pipe2));
              fields.push([hash, t]);
            }
            typeTable.push([ty, fields]);
            break;
          }
          case IDLTypeIds.Func: {
            const args = [];
            let argLength = Number(lebDecode(pipe2));
            while (argLength--) {
              args.push(Number(slebDecode(pipe2)));
            }
            const returnValues = [];
            let returnValuesLength = Number(lebDecode(pipe2));
            while (returnValuesLength--) {
              returnValues.push(Number(slebDecode(pipe2)));
            }
            const annotations = [];
            let annotationLength = Number(lebDecode(pipe2));
            while (annotationLength--) {
              const annotation = Number(lebDecode(pipe2));
              switch (annotation) {
                case 1: {
                  annotations.push("query");
                  break;
                }
                case 2: {
                  annotations.push("oneway");
                  break;
                }
                case 3: {
                  annotations.push("composite_query");
                  break;
                }
                default:
                  throw new Error("unknown annotation");
              }
            }
            typeTable.push([ty, [args, returnValues, annotations]]);
            break;
          }
          case IDLTypeIds.Service: {
            let servLength = Number(lebDecode(pipe2));
            const methods = [];
            while (servLength--) {
              const nameLength = Number(lebDecode(pipe2));
              const funcName = new TextDecoder().decode(safeRead(pipe2, nameLength));
              const funcType = slebDecode(pipe2);
              methods.push([funcName, funcType]);
            }
            typeTable.push([ty, methods]);
            break;
          }
          default:
            throw new Error("Illegal op_code: " + ty);
        }
      }
      const rawList = [];
      const length = Number(lebDecode(pipe2));
      for (let i = 0; i < length; i++) {
        rawList.push(Number(slebDecode(pipe2)));
      }
      return [typeTable, rawList];
    }
    const [rawTable, rawTypes] = readTypeTable(b6);
    if (rawTypes.length < retTypes.length) {
      throw new Error("Wrong number of return values");
    }
    const table = rawTable.map((_5) => Rec());
    function getType(t) {
      if (t < -24) {
        throw new Error("future value not supported");
      }
      if (t < 0) {
        switch (t) {
          case -1:
            return Null;
          case -2:
            return Bool;
          case -3:
            return Nat;
          case -4:
            return Int;
          case -5:
            return Nat8;
          case -6:
            return Nat16;
          case -7:
            return Nat32;
          case -8:
            return Nat64;
          case -9:
            return Int8;
          case -10:
            return Int16;
          case -11:
            return Int32;
          case -12:
            return Int64;
          case -13:
            return Float32;
          case -14:
            return Float64;
          case -15:
            return Text;
          case -16:
            return Reserved;
          case -17:
            return Empty;
          case -24:
            return Principal2;
          default:
            throw new Error("Illegal op_code: " + t);
        }
      }
      if (t >= rawTable.length) {
        throw new Error("type index out of range");
      }
      return table[t];
    }
    function buildType(entry) {
      switch (entry[0]) {
        case IDLTypeIds.Vector: {
          const ty = getType(entry[1]);
          return Vec(ty);
        }
        case IDLTypeIds.Opt: {
          const ty = getType(entry[1]);
          return Opt(ty);
        }
        case IDLTypeIds.Record: {
          const fields = {};
          for (const [hash, ty] of entry[1]) {
            const name = `_${hash}_`;
            fields[name] = getType(ty);
          }
          const record = Record(fields);
          const tuple2 = record.tryAsTuple();
          if (Array.isArray(tuple2)) {
            return Tuple(...tuple2);
          } else {
            return record;
          }
        }
        case IDLTypeIds.Variant: {
          const fields = {};
          for (const [hash, ty] of entry[1]) {
            const name = `_${hash}_`;
            fields[name] = getType(ty);
          }
          return Variant(fields);
        }
        case IDLTypeIds.Func: {
          const [args, returnValues, annotations] = entry[1];
          return Func(args.map((t) => getType(t)), returnValues.map((t) => getType(t)), annotations);
        }
        case IDLTypeIds.Service: {
          const rec = {};
          const methods = entry[1];
          for (const [name, typeRef] of methods) {
            let type = getType(typeRef);
            if (type instanceof RecClass) {
              type = type.getType();
            }
            if (!(type instanceof FuncClass)) {
              throw new Error("Illegal service definition: services can only contain functions");
            }
            rec[name] = type;
          }
          return Service(rec);
        }
        default:
          throw new Error("Illegal op_code: " + entry[0]);
      }
    }
    rawTable.forEach((entry, i) => {
      if (entry[0] === IDLTypeIds.Func) {
        const t = buildType(entry);
        table[i].fill(t);
      }
    });
    rawTable.forEach((entry, i) => {
      if (entry[0] !== IDLTypeIds.Func) {
        const t = buildType(entry);
        table[i].fill(t);
      }
    });
    resetSubtypeCache();
    const types = rawTypes.map((t) => getType(t));
    try {
      const output = retTypes.map((t, i) => {
        return t.decodeValue(b6, types[i]);
      });
      for (let ind = retTypes.length; ind < types.length; ind++) {
        types[ind].decodeValue(b6, types[ind]);
      }
      if (b6.byteLength > 0) {
        throw new Error("decode: Left-over bytes");
      }
      return output;
    } finally {
      resetSubtypeCache();
    }
  }
  var Empty = new EmptyClass();
  var Reserved = new ReservedClass();
  var Unknown = new UnknownClass();
  var Bool = new BoolClass();
  var Null = new NullClass();
  var Text = new TextClass();
  var Int = new IntClass();
  var Nat = new NatClass();
  var Float32 = new FloatClass(32);
  var Float64 = new FloatClass(64);
  var Int8 = new FixedIntClass(8);
  var Int16 = new FixedIntClass(16);
  var Int32 = new FixedIntClass(32);
  var Int64 = new FixedIntClass(64);
  var Nat8 = new FixedNatClass(8);
  var Nat16 = new FixedNatClass(16);
  var Nat32 = new FixedNatClass(32);
  var Nat64 = new FixedNatClass(64);
  var Principal2 = new PrincipalClass();
  function Tuple(...types) {
    return new TupleClass(types);
  }
  function Vec(t) {
    return new VecClass(t);
  }
  function Opt(t) {
    return new OptClass(t);
  }
  function Record(t) {
    return new RecordClass(t);
  }
  function Variant(fields) {
    return new VariantClass(fields);
  }
  function Rec() {
    return new RecClass();
  }
  function Func(args, ret, annotations = []) {
    return new FuncClass(args, ret, annotations);
  }
  function Service(t) {
    return new ServiceClass(t);
  }
  var Relations = class _Relations {
    constructor(relations = /* @__PURE__ */ new Map()) {
      this.rels = relations;
    }
    copy() {
      const copy = /* @__PURE__ */ new Map();
      for (const [key, value] of this.rels.entries()) {
        const valCopy = new Map(value);
        copy.set(key, valCopy);
      }
      return new _Relations(copy);
    }
    /// Returns whether we know for sure that a relation holds or doesn't (`true` or `false`), or
    /// if we don't know yet (`undefined`)
    known(t1, t2) {
      return this.rels.get(t1.name)?.get(t2.name);
    }
    addNegative(t1, t2) {
      this.addNames(t1.name, t2.name, false);
    }
    add(t1, t2) {
      this.addNames(t1.name, t2.name, true);
    }
    display() {
      let result = "";
      for (const [t1, v3] of this.rels) {
        for (const [t2, known] of v3) {
          const subty = known ? ":<" : "!<:";
          result += `${t1} ${subty} ${t2}
`;
        }
      }
      return result;
    }
    addNames(t1, t2, isSubtype) {
      const t1Map = this.rels.get(t1);
      if (t1Map == void 0) {
        const newMap = /* @__PURE__ */ new Map();
        newMap.set(t2, isSubtype);
        this.rels.set(t1, newMap);
      } else {
        t1Map.set(t2, isSubtype);
      }
    }
  };
  var subtypeCache = new Relations();
  function resetSubtypeCache() {
    subtypeCache = new Relations();
  }
  function eqFunctionAnnotations(t1, t2) {
    const t1Annotations = new Set(t1.annotations);
    const t2Annotations = new Set(t2.annotations);
    if (t1Annotations.size !== t2Annotations.size) {
      return false;
    }
    for (const a4 of t1Annotations) {
      if (!t2Annotations.has(a4))
        return false;
    }
    return true;
  }
  function canBeOmmitted(t) {
    return t instanceof OptClass || t instanceof NullClass || t instanceof ReservedClass;
  }
  function subtype(t1, t2) {
    const relations = subtypeCache.copy();
    const isSubtype = subtype_(relations, t1, t2);
    if (isSubtype) {
      subtypeCache.add(t1, t2);
    } else {
      subtypeCache.addNegative(t1, t2);
    }
    return isSubtype;
  }
  function subtype_(relations, t1, t2) {
    if (t1.name === t2.name)
      return true;
    const known = relations.known(t1, t2);
    if (known !== void 0)
      return known;
    relations.add(t1, t2);
    if (t2 instanceof ReservedClass)
      return true;
    if (t1 instanceof EmptyClass)
      return true;
    if (t1 instanceof NatClass && t2 instanceof IntClass)
      return true;
    if (t1 instanceof VecClass && t2 instanceof VecClass)
      return subtype_(relations, t1._type, t2._type);
    if (t2 instanceof OptClass)
      return true;
    if (t1 instanceof RecordClass && t2 instanceof RecordClass) {
      const t1Object = t1.fieldsAsObject;
      for (const [label, ty2] of t2._fields) {
        const ty1 = t1Object[idlLabelToId(label)];
        if (!ty1) {
          if (!canBeOmmitted(ty2))
            return false;
        } else {
          if (!subtype_(relations, ty1, ty2))
            return false;
        }
      }
      return true;
    }
    if (t1 instanceof FuncClass && t2 instanceof FuncClass) {
      if (!eqFunctionAnnotations(t1, t2))
        return false;
      for (let i = 0; i < t1.argTypes.length; i++) {
        const argTy1 = t1.argTypes[i];
        if (i < t2.argTypes.length) {
          if (!subtype_(relations, t2.argTypes[i], argTy1))
            return false;
        } else {
          if (!canBeOmmitted(argTy1))
            return false;
        }
      }
      for (let i = 0; i < t2.retTypes.length; i++) {
        const retTy2 = t2.retTypes[i];
        if (i < t1.retTypes.length) {
          if (!subtype_(relations, t1.retTypes[i], retTy2))
            return false;
        } else {
          if (!canBeOmmitted(retTy2))
            return false;
        }
      }
      return true;
    }
    if (t1 instanceof VariantClass && t2 instanceof VariantClass) {
      const t2Object = t2.alternativesAsObject;
      for (const [label, ty1] of t1._fields) {
        const ty2 = t2Object[idlLabelToId(label)];
        if (!ty2)
          return false;
        if (!subtype_(relations, ty1, ty2))
          return false;
      }
      return true;
    }
    if (t1 instanceof ServiceClass && t2 instanceof ServiceClass) {
      const t1Object = t1.fieldsAsObject();
      for (const [name, ty2] of t2._fields) {
        const ty1 = t1Object[name];
        if (!ty1)
          return false;
        if (!subtype_(relations, ty1, ty2))
          return false;
      }
      return true;
    }
    if (t1 instanceof RecClass) {
      return subtype_(relations, t1.getType(), t2);
    }
    if (t2 instanceof RecClass) {
      return subtype_(relations, t1, t2.getType());
    }
    return false;
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/utils/buffer.js
  function uint8FromBufLike2(bufLike) {
    if (!bufLike) {
      throw new Error("Input cannot be null or undefined");
    }
    if (bufLike instanceof Uint8Array) {
      return bufLike;
    }
    if (bufLike instanceof ArrayBuffer) {
      return new Uint8Array(bufLike);
    }
    if (Array.isArray(bufLike)) {
      return new Uint8Array(bufLike);
    }
    if ("buffer" in bufLike) {
      return uint8FromBufLike2(bufLike.buffer);
    }
    return new Uint8Array(bufLike);
  }
  function uint8Equals(a4, b6) {
    if (a4.length !== b6.length)
      return false;
    for (let i = 0; i < a4.length; i++) {
      if (a4[i] !== b6[i])
        return false;
    }
    return true;
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/request_id.js
  function hashValue(value) {
    if (typeof value === "string") {
      return hashString(value);
    } else if (typeof value === "number") {
      return sha256(lebEncode(value));
    } else if (value instanceof Uint8Array || ArrayBuffer.isView(value)) {
      return sha256(uint8FromBufLike2(value));
    } else if (Array.isArray(value)) {
      const vals = value.map(hashValue);
      return sha256(concatBytes(...vals));
    } else if (value && typeof value === "object" && value._isPrincipal) {
      return sha256(value.toUint8Array());
    } else if (typeof value === "object" && value !== null && typeof value.toHash === "function") {
      return hashValue(value.toHash());
    } else if (typeof value === "object") {
      return hashOfMap(value);
    } else if (typeof value === "bigint") {
      return sha256(lebEncode(value));
    }
    throw InputError.fromCode(new HashValueErrorCode(value));
  }
  var hashString = (value) => {
    const encoded = new TextEncoder().encode(value);
    return sha256(encoded);
  };
  function requestIdOf(request3) {
    return hashOfMap(request3);
  }
  function hashOfMap(map) {
    const hashed = Object.entries(map).filter(([, value]) => value !== void 0).map(([key, value]) => {
      const hashedKey = hashString(key);
      const hashedValue = hashValue(value);
      return [hashedKey, hashedValue];
    });
    const traversed = hashed;
    const sorted = traversed.sort(([k1], [k22]) => {
      return compare(k1, k22);
    });
    const concatenated = concatBytes(...sorted.map((x4) => concatBytes(...x4)));
    const result = sha256(concatenated);
    return result;
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/constants.js
  var DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS = 5 * 60 * 1e3;
  var IC_STATE_ROOT_DOMAIN_SEPARATOR = new TextEncoder().encode("\ric-state-root");
  var IC_REQUEST_DOMAIN_SEPARATOR = new TextEncoder().encode("\nic-request");
  var IC_RESPONSE_DOMAIN_SEPARATOR = new TextEncoder().encode("\vic-response");
  var IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR = new TextEncoder().encode("ic-request-auth-delegation");

  // node_modules/@icp-sdk/core/lib/esm/agent/auth.js
  var AnonymousIdentity = class {
    getPrincipal() {
      return Principal.anonymous();
    }
    async transformRequest(request3) {
      return {
        ...request3,
        body: { content: request3.body }
      };
    }
  };

  // node_modules/@dfinity/cbor/dist/cbor.mjs
  var w2 = class extends Error {
    constructor(n) {
      super(n), this.name = "DecodingError";
    }
  };
  var m2 = 55799;
  var L = Symbol("CBOR_STOP_CODE");
  var g = /* @__PURE__ */ ((t) => (t[t.False = 20] = "False", t[t.True = 21] = "True", t[t.Null = 22] = "Null", t[t.Undefined = 23] = "Undefined", t[t.Break = 31] = "Break", t))(g || {});
  var c = /* @__PURE__ */ ((t) => (t[t.UnsignedInteger = 0] = "UnsignedInteger", t[t.NegativeInteger = 1] = "NegativeInteger", t[t.ByteString = 2] = "ByteString", t[t.TextString = 3] = "TextString", t[t.Array = 4] = "Array", t[t.Map = 5] = "Map", t[t.Tag = 6] = "Tag", t[t.Simple = 7] = "Simple", t))(c || {});
  var z = 23;
  var Y = 255;
  var G2 = 65535;
  var P = 4294967295;
  var H2 = BigInt("0xffffffffffffffff");
  var d2 = /* @__PURE__ */ ((t) => (t[t.Value = 23] = "Value", t[t.OneByte = 24] = "OneByte", t[t.TwoBytes = 25] = "TwoBytes", t[t.FourBytes = 26] = "FourBytes", t[t.EightBytes = 27] = "EightBytes", t[t.Indefinite = 31] = "Indefinite", t))(d2 || {});
  var h = false;
  function W(t) {
    return t == null;
  }
  function R(t, n) {
    const e3 = new Uint8Array(n);
    return e3.set(t), e3;
  }
  var K = new TextDecoder();
  function Z(t) {
    return (t & 224) >> 5;
  }
  function q(t) {
    return t & 31;
  }
  var A2 = new Uint8Array();
  var y2;
  var a2 = 0;
  function ut(t, n) {
    A2 = t, a2 = 0;
    const e3 = B2(n);
    return (n == null ? void 0 : n(e3)) ?? e3;
  }
  function B2(t) {
    const [n, e3] = N();
    switch (n) {
      case c.UnsignedInteger:
        return E2(e3);
      case c.NegativeInteger:
        return j(e3);
      case c.ByteString:
        return $(e3);
      case c.TextString:
        return F2(e3);
      case c.Array:
        return J2(e3, t);
      case c.Map:
        return b2(e3, t);
      case c.Tag:
        return M(e3, t);
      case c.Simple:
        return Q(e3);
    }
    throw new w2(`Unsupported major type: ${n}`);
  }
  function N() {
    const t = A2.at(a2);
    if (W(t))
      throw new w2("Provided CBOR data is empty");
    const n = Z(t), e3 = q(t);
    return a2++, [n, e3];
  }
  function J2(t, n) {
    const e3 = E2(t);
    if (e3 === 1 / 0) {
      const u4 = [];
      let f4 = B2(n);
      for (; f4 !== L; )
        u4.push((n == null ? void 0 : n(f4)) ?? f4), f4 = B2(n);
      return u4;
    }
    const i = new Array(e3);
    for (let u4 = 0; u4 < e3; u4++) {
      const f4 = B2(n);
      i[u4] = (n == null ? void 0 : n(f4)) ?? f4;
    }
    return i;
  }
  function Q(t) {
    switch (t) {
      case g.False:
        return false;
      case g.True:
        return true;
      case g.Null:
        return null;
      case g.Undefined:
        return;
      case g.Break:
        return L;
    }
    throw new w2(`Unrecognized simple type: ${t.toString(2)}`);
  }
  function b2(t, n) {
    const e3 = E2(t), i = {};
    if (e3 === 1 / 0) {
      let [u4, f4] = N();
      for (; u4 !== c.Simple && f4 !== g.Break; ) {
        const l3 = F2(f4), U3 = B2(n);
        i[l3] = (n == null ? void 0 : n(U3, l3)) ?? U3, [u4, f4] = N();
      }
      return i;
    }
    for (let u4 = 0; u4 < e3; u4++) {
      const [f4, l3] = N();
      if (f4 !== c.TextString)
        throw new w2("Map keys must be text strings");
      const U3 = F2(l3), D4 = B2(n);
      i[U3] = (n == null ? void 0 : n(D4, U3)) ?? D4;
    }
    return i;
  }
  function E2(t) {
    if (t <= d2.Value)
      return t;
    switch (y2 = new DataView(A2.buffer, A2.byteOffset + a2), t) {
      case d2.OneByte:
        return a2++, y2.getUint8(0);
      case d2.TwoBytes:
        return a2 += 2, y2.getUint16(0, h);
      case d2.FourBytes:
        return a2 += 4, y2.getUint32(0, h);
      case d2.EightBytes:
        return a2 += 8, y2.getBigUint64(0, h);
      case d2.Indefinite:
        return 1 / 0;
      default:
        throw new w2(`Unsupported integer info: ${t.toString(2)}`);
    }
  }
  function j(t) {
    const n = E2(t);
    return typeof n == "number" ? -1 - n : -1n - n;
  }
  function $(t) {
    const n = E2(t);
    if (n > Number.MAX_SAFE_INTEGER)
      throw new w2("Byte length is too large");
    const e3 = Number(n);
    return a2 += e3, A2.slice(a2 - e3, a2);
  }
  function F2(t) {
    const n = $(t);
    return K.decode(n);
  }
  function M(t, n) {
    const e3 = E2(t);
    if (e3 === m2)
      return B2(n);
    throw new w2(`Unsupported tag: ${e3}.`);
  }
  var x = class extends Error {
    constructor(n) {
      super(n), this.name = "SerializationError";
    }
  };
  var p = 2 * 1024;
  var C2 = 100;
  var v = new TextEncoder();
  function S2(t) {
    return t << 5;
  }
  var o = new Uint8Array(p);
  var r = new DataView(o.buffer);
  var s = 0;
  var O = [];
  function dt(t, n) {
    s = 0;
    const e3 = (n == null ? void 0 : n(t)) ?? t;
    return it(m2, e3, n), o.slice(0, s);
  }
  function _(t, n) {
    if (s > o.length - C2 && (o = R(o, o.length * 2), r = new DataView(o.buffer)), t === false || t === true || t === null || t === void 0) {
      et(t);
      return;
    }
    if (typeof t == "number" || typeof t == "bigint") {
      ft(t);
      return;
    }
    if (typeof t == "string") {
      X2(t);
      return;
    }
    if (t instanceof Uint8Array) {
      V2(t);
      return;
    }
    if (t instanceof ArrayBuffer) {
      V2(new Uint8Array(t));
      return;
    }
    if (Array.isArray(t)) {
      tt(t, n);
      return;
    }
    if (typeof t == "object") {
      nt(t, n);
      return;
    }
    throw new x(`Unsupported type: ${typeof t}`);
  }
  function tt(t, n) {
    I2(c.Array, t.length), t.forEach((e3, i) => {
      _((n == null ? void 0 : n(e3, i.toString())) ?? e3, n);
    });
  }
  function nt(t, n) {
    O = Object.entries(t), I2(c.Map, O.length), O.forEach(([e3, i]) => {
      X2(e3), _((n == null ? void 0 : n(i, e3)) ?? i, n);
    });
  }
  function I2(t, n) {
    if (n <= z) {
      r.setUint8(
        s++,
        S2(t) | Number(n)
      );
      return;
    }
    if (n <= Y) {
      r.setUint8(
        s++,
        S2(t) | d2.OneByte
      ), r.setUint8(s, Number(n)), s += 1;
      return;
    }
    if (n <= G2) {
      r.setUint8(
        s++,
        S2(t) | d2.TwoBytes
      ), r.setUint16(s, Number(n), h), s += 2;
      return;
    }
    if (n <= P) {
      r.setUint8(
        s++,
        S2(t) | d2.FourBytes
      ), r.setUint32(s, Number(n), h), s += 4;
      return;
    }
    if (n <= H2) {
      r.setUint8(
        s++,
        S2(t) | d2.EightBytes
      ), r.setBigUint64(s, BigInt(n), h), s += 8;
      return;
    }
    throw new x(`Value too large to encode: ${n}`);
  }
  function et(t) {
    I2(c.Simple, st(t));
  }
  function st(t) {
    if (t === false)
      return g.False;
    if (t === true)
      return g.True;
    if (t === null)
      return g.Null;
    if (t === void 0)
      return g.Undefined;
    throw new x(`Unrecognized simple value: ${t.toString()}`);
  }
  function k2(t, n) {
    I2(t, n.length), s > o.length - n.length && (o = R(o, o.length + n.length), r = new DataView(o.buffer)), o.set(n, s), s += n.length;
  }
  function T2(t, n) {
    I2(t, n);
  }
  function ct(t) {
    T2(c.UnsignedInteger, t);
  }
  function ot(t) {
    T2(
      c.NegativeInteger,
      typeof t == "bigint" ? -1n - t : -1 - t
    );
  }
  function ft(t) {
    t >= 0 ? ct(t) : ot(t);
  }
  function X2(t) {
    k2(c.TextString, v.encode(t));
  }
  function V2(t) {
    k2(c.ByteString, t);
  }
  function it(t, n, e3) {
    I2(c.Tag, t), _(n, e3);
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/cbor.js
  function hasCborValueMethod(value) {
    return typeof value === "object" && value !== null && "toCborValue" in value;
  }
  function encode2(value) {
    try {
      return dt(value, (value2) => {
        if (Principal.isPrincipal(value2)) {
          return value2.toUint8Array();
        }
        if (Expiry.isExpiry(value2)) {
          return value2.toBigInt();
        }
        if (hasCborValueMethod(value2)) {
          return value2.toCborValue();
        }
        return value2;
      });
    } catch (error) {
      throw InputError.fromCode(new CborEncodeErrorCode(error, value));
    }
  }
  function decode2(input) {
    try {
      return ut(input);
    } catch (error) {
      throw InputError.fromCode(new CborDecodeErrorCode(error, input));
    }
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/utils/random.js
  var randomNumber = () => {
    if (typeof window !== "undefined" && !!window.crypto && !!window.crypto.getRandomValues) {
      const array2 = new Uint32Array(1);
      window.crypto.getRandomValues(array2);
      return array2[0];
    }
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array2 = new Uint32Array(1);
      crypto.getRandomValues(array2);
      return array2[0];
    }
    if (typeof crypto !== "undefined" && crypto.randomInt) {
      return crypto.randomInt(0, 4294967295);
    }
    return Math.floor(Math.random() * 4294967295);
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/agent/http/types.js
  var Endpoint;
  (function(Endpoint2) {
    Endpoint2["Query"] = "read";
    Endpoint2["ReadState"] = "read_state";
    Endpoint2["Call"] = "call";
  })(Endpoint || (Endpoint = {}));
  var SubmitRequestType;
  (function(SubmitRequestType2) {
    SubmitRequestType2["Call"] = "call";
  })(SubmitRequestType || (SubmitRequestType = {}));
  var ReadRequestType;
  (function(ReadRequestType2) {
    ReadRequestType2["Query"] = "query";
    ReadRequestType2["ReadState"] = "read_state";
  })(ReadRequestType || (ReadRequestType = {}));
  function makeNonce() {
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);
    const rand1 = randomNumber();
    const rand2 = randomNumber();
    const rand3 = randomNumber();
    const rand4 = randomNumber();
    view.setUint32(0, rand1);
    view.setUint32(4, rand2);
    view.setUint32(8, rand3);
    view.setUint32(12, rand4);
    return Object.assign(new Uint8Array(buffer), { __nonce__: void 0 });
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/agent/http/transforms.js
  var JSON_KEY_EXPIRY = "__expiry__";
  var SECONDS_TO_MILLISECONDS = BigInt(1e3);
  var MILLISECONDS_TO_NANOSECONDS = BigInt(1e6);
  var MINUTES_TO_SECONDS = BigInt(60);
  var MINUTES_TO_MILLISECONDS = MINUTES_TO_SECONDS * SECONDS_TO_MILLISECONDS;
  var EXPIRY_DELTA_THRESHOLD_MILLISECONDS = BigInt(1) * MINUTES_TO_MILLISECONDS;
  function roundToSecond(millis) {
    return millis / SECONDS_TO_MILLISECONDS * SECONDS_TO_MILLISECONDS;
  }
  function roundToMinute(millis) {
    return millis / MINUTES_TO_MILLISECONDS * MINUTES_TO_MILLISECONDS;
  }
  var Expiry = class _Expiry {
    constructor(__expiry__) {
      this.__expiry__ = __expiry__;
      this._isExpiry = true;
    }
    /**
     * Creates an Expiry object from a delta in milliseconds.
     * The expiry is calculated as: current_time + delta + clock_drift
     * The resulting expiry is then rounded:
     * - If rounding down to the nearest minute still provides at least 60 seconds in the future, use minute precision
     * - Otherwise, use second precision
     * @param deltaInMs The milliseconds to add to the current time.
     * @param clockDriftInMs The milliseconds to add to the current time, typically the clock drift between IC network clock and the client's clock. Defaults to `0` if not provided.
     * @returns {Expiry} The constructed Expiry object.
     */
    static fromDeltaInMilliseconds(deltaInMs, clockDriftInMs = 0) {
      const correctedNowMs = BigInt(Date.now()) + BigInt(clockDriftInMs);
      const expiryMs = correctedNowMs + BigInt(deltaInMs);
      const roundedToMinute = roundToMinute(expiryMs);
      let roundedExpiryMs;
      if (roundedToMinute >= correctedNowMs + EXPIRY_DELTA_THRESHOLD_MILLISECONDS) {
        roundedExpiryMs = roundedToMinute;
      } else {
        const roundedToSecond = roundToSecond(expiryMs);
        roundedExpiryMs = roundedToSecond;
      }
      return new _Expiry(roundedExpiryMs * MILLISECONDS_TO_NANOSECONDS);
    }
    toBigInt() {
      return this.__expiry__;
    }
    toHash() {
      return lebEncode(this.__expiry__);
    }
    toString() {
      return this.__expiry__.toString();
    }
    /**
     * Serializes to JSON
     * @returns {JsonnableExpiry} a JSON object with a single key, {@link JSON_KEY_EXPIRY}, whose value is the expiry as a string
     */
    toJSON() {
      return { [JSON_KEY_EXPIRY]: this.toString() };
    }
    /**
     * Deserializes a {@link JsonnableExpiry} object from a JSON string.
     * @param input The JSON string to deserialize.
     * @returns {Expiry} The deserialized Expiry object.
     */
    static fromJSON(input) {
      const obj = JSON.parse(input);
      if (obj[JSON_KEY_EXPIRY]) {
        try {
          const expiry = BigInt(obj[JSON_KEY_EXPIRY]);
          return new _Expiry(expiry);
        } catch (error) {
          throw new InputError(new ExpiryJsonDeserializeErrorCode(`Not a valid BigInt: ${error}`));
        }
      }
      throw new InputError(new ExpiryJsonDeserializeErrorCode(`The input does not contain the key ${JSON_KEY_EXPIRY}`));
    }
    static isExpiry(other) {
      return other instanceof _Expiry || typeof other === "object" && other !== null && "_isExpiry" in other && other["_isExpiry"] === true && "__expiry__" in other && typeof other["__expiry__"] === "bigint";
    }
  };
  function makeNonceTransform(nonceFn = makeNonce) {
    return async (request3) => {
      const headers = request3.request.headers;
      request3.request.headers = headers;
      if (request3.endpoint === Endpoint.Call) {
        request3.body.nonce = nonceFn();
      }
    };
  }
  function httpHeadersTransform(headers) {
    const headerFields = [];
    headers.forEach((value, key) => {
      headerFields.push([key, value]);
    });
    return headerFields;
  }

  // node_modules/@noble/curves/esm/utils.js
  var _0n = /* @__PURE__ */ BigInt(0);
  var _1n = /* @__PURE__ */ BigInt(1);
  function _abool2(value, title = "") {
    if (typeof value !== "boolean") {
      const prefix = title && `"${title}"`;
      throw new Error(prefix + "expected boolean, got type=" + typeof value);
    }
    return value;
  }
  function _abytes2(value, length, title = "") {
    const bytes = isBytes(value);
    const len = value?.length;
    const needsLen = length !== void 0;
    if (!bytes || needsLen && len !== length) {
      const prefix = title && `"${title}" `;
      const ofLen = needsLen ? ` of length ${length}` : "";
      const got = bytes ? `length=${len}` : `type=${typeof value}`;
      throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
    }
    return value;
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return hex === "" ? _0n : BigInt("0x" + hex);
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
  }
  function bytesToNumberLE(bytes) {
    abytes(bytes);
    return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
  }
  function numberToBytesBE(n, len) {
    return hexToBytes(n.toString(16).padStart(len * 2, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === "string") {
      try {
        res = hexToBytes(hex);
      } catch (e3) {
        throw new Error(title + " must be hex string or Uint8Array, cause: " + e3);
      }
    } else if (isBytes(hex)) {
      res = Uint8Array.from(hex);
    } else {
      throw new Error(title + " must be hex string or Uint8Array");
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(title + " of length " + expectedLength + " expected, got " + len);
    return res;
  }
  function equalBytes(a4, b6) {
    if (a4.length !== b6.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a4.length; i++)
      diff |= a4[i] ^ b6[i];
    return diff === 0;
  }
  function copyBytes(bytes) {
    return Uint8Array.from(bytes);
  }
  var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n; n >>= _1n, len += 1)
      ;
    return len;
  }
  function bitGet(n, pos) {
    return n >> BigInt(pos) & _1n;
  }
  var bitMask = (n) => (_1n << BigInt(n)) - _1n;
  function isHash(val) {
    return typeof val === "function" && Number.isSafeInteger(val.outputLen);
  }
  function _validateObject(object2, fields, optFields = {}) {
    if (!object2 || typeof object2 !== "object")
      throw new Error("expected valid options object");
    function checkField(fieldName, expectedType, isOpt) {
      const val = object2[fieldName];
      if (isOpt && val === void 0)
        return;
      const current = typeof val;
      if (current !== expectedType || val === null)
        throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
    }
    Object.entries(fields).forEach(([k5, v3]) => checkField(k5, v3, false));
    Object.entries(optFields).forEach(([k5, v3]) => checkField(k5, v3, true));
  }
  var notImplemented = () => {
    throw new Error("not implemented");
  };
  function memoized(fn) {
    const map = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map.set(arg, computed);
      return computed;
    };
  }

  // node_modules/@noble/curves/esm/abstract/modular.js
  var _0n2 = BigInt(0);
  var _1n2 = BigInt(1);
  var _2n = /* @__PURE__ */ BigInt(2);
  var _3n = /* @__PURE__ */ BigInt(3);
  var _4n = /* @__PURE__ */ BigInt(4);
  var _5n = /* @__PURE__ */ BigInt(5);
  var _7n = /* @__PURE__ */ BigInt(7);
  var _8n = /* @__PURE__ */ BigInt(8);
  var _9n = /* @__PURE__ */ BigInt(9);
  var _16n = /* @__PURE__ */ BigInt(16);
  function mod(a4, b6) {
    const result = a4 % b6;
    return result >= _0n2 ? result : b6 + result;
  }
  function pow2(x4, power, modulo) {
    let res = x4;
    while (power-- > _0n2) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number3, modulo) {
    if (number3 === _0n2)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n2)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a4 = mod(number3, modulo);
    let b6 = modulo;
    let x4 = _0n2, y4 = _1n2, u4 = _1n2, v3 = _0n2;
    while (a4 !== _0n2) {
      const q4 = b6 / a4;
      const r2 = b6 % a4;
      const m4 = x4 - u4 * q4;
      const n = y4 - v3 * q4;
      b6 = a4, a4 = r2, x4 = u4, y4 = v3, u4 = m4, v3 = n;
    }
    const gcd = b6;
    if (gcd !== _1n2)
      throw new Error("invert: does not exist");
    return mod(x4, modulo);
  }
  function assertIsSquare(Fp4, root, n) {
    if (!Fp4.eql(Fp4.sqr(root), n))
      throw new Error("Cannot find square root");
  }
  function sqrt3mod4(Fp4, n) {
    const p1div4 = (Fp4.ORDER + _1n2) / _4n;
    const root = Fp4.pow(n, p1div4);
    assertIsSquare(Fp4, root, n);
    return root;
  }
  function sqrt5mod8(Fp4, n) {
    const p5div8 = (Fp4.ORDER - _5n) / _8n;
    const n2 = Fp4.mul(n, _2n);
    const v3 = Fp4.pow(n2, p5div8);
    const nv = Fp4.mul(n, v3);
    const i = Fp4.mul(Fp4.mul(nv, _2n), v3);
    const root = Fp4.mul(nv, Fp4.sub(i, Fp4.ONE));
    assertIsSquare(Fp4, root, n);
    return root;
  }
  function sqrt9mod16(P4) {
    const Fp_ = Field(P4);
    const tn = tonelliShanks(P4);
    const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
    const c2 = tn(Fp_, c1);
    const c3 = tn(Fp_, Fp_.neg(c1));
    const c4 = (P4 + _7n) / _16n;
    return (Fp4, n) => {
      let tv1 = Fp4.pow(n, c4);
      let tv2 = Fp4.mul(tv1, c1);
      const tv3 = Fp4.mul(tv1, c2);
      const tv4 = Fp4.mul(tv1, c3);
      const e1 = Fp4.eql(Fp4.sqr(tv2), n);
      const e22 = Fp4.eql(Fp4.sqr(tv3), n);
      tv1 = Fp4.cmov(tv1, tv2, e1);
      tv2 = Fp4.cmov(tv4, tv3, e22);
      const e3 = Fp4.eql(Fp4.sqr(tv2), n);
      const root = Fp4.cmov(tv1, tv2, e3);
      assertIsSquare(Fp4, root, n);
      return root;
    };
  }
  function tonelliShanks(P4) {
    if (P4 < _3n)
      throw new Error("sqrt is not defined for small field");
    let Q3 = P4 - _1n2;
    let S4 = 0;
    while (Q3 % _2n === _0n2) {
      Q3 /= _2n;
      S4++;
    }
    let Z3 = _2n;
    const _Fp = Field(P4);
    while (FpLegendre(_Fp, Z3) === 1) {
      if (Z3++ > 1e3)
        throw new Error("Cannot find square root: probably non-prime P");
    }
    if (S4 === 1)
      return sqrt3mod4;
    let cc = _Fp.pow(Z3, Q3);
    const Q1div2 = (Q3 + _1n2) / _2n;
    return function tonelliSlow(Fp4, n) {
      if (Fp4.is0(n))
        return n;
      if (FpLegendre(Fp4, n) !== 1)
        throw new Error("Cannot find square root");
      let M3 = S4;
      let c2 = Fp4.mul(Fp4.ONE, cc);
      let t = Fp4.pow(n, Q3);
      let R3 = Fp4.pow(n, Q1div2);
      while (!Fp4.eql(t, Fp4.ONE)) {
        if (Fp4.is0(t))
          return Fp4.ZERO;
        let i = 1;
        let t_tmp = Fp4.sqr(t);
        while (!Fp4.eql(t_tmp, Fp4.ONE)) {
          i++;
          t_tmp = Fp4.sqr(t_tmp);
          if (i === M3)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n2 << BigInt(M3 - i - 1);
        const b6 = Fp4.pow(c2, exponent);
        M3 = i;
        c2 = Fp4.sqr(b6);
        t = Fp4.mul(t, c2);
        R3 = Fp4.mul(R3, b6);
      }
      return R3;
    };
  }
  function FpSqrt(P4) {
    if (P4 % _4n === _3n)
      return sqrt3mod4;
    if (P4 % _8n === _5n)
      return sqrt5mod8;
    if (P4 % _16n === _9n)
      return sqrt9mod16(P4);
    return tonelliShanks(P4);
  }
  var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n2) === _1n2;
  var FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "number",
      BITS: "number"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    _validateObject(field, opts);
    return field;
  }
  function FpPow(Fp4, num, power) {
    if (power < _0n2)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n2)
      return Fp4.ONE;
    if (power === _1n2)
      return num;
    let p4 = Fp4.ONE;
    let d4 = num;
    while (power > _0n2) {
      if (power & _1n2)
        p4 = Fp4.mul(p4, d4);
      d4 = Fp4.sqr(d4);
      power >>= _1n2;
    }
    return p4;
  }
  function FpInvertBatch(Fp4, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp4.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num, i) => {
      if (Fp4.is0(num))
        return acc;
      inverted[i] = acc;
      return Fp4.mul(acc, num);
    }, Fp4.ONE);
    const invertedAcc = Fp4.inv(multipliedAcc);
    nums.reduceRight((acc, num, i) => {
      if (Fp4.is0(num))
        return acc;
      inverted[i] = Fp4.mul(acc, inverted[i]);
      return Fp4.mul(acc, num);
    }, invertedAcc);
    return inverted;
  }
  function FpLegendre(Fp4, n) {
    const p1mod2 = (Fp4.ORDER - _1n2) / _2n;
    const powered = Fp4.pow(n, p1mod2);
    const yes = Fp4.eql(powered, Fp4.ONE);
    const zero = Fp4.eql(powered, Fp4.ZERO);
    const no = Fp4.eql(powered, Fp4.neg(Fp4.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function nLength(n, nBitLength) {
    if (nBitLength !== void 0)
      anumber(nBitLength);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, bitLenOrOpts, isLE = false, opts = {}) {
    if (ORDER <= _0n2)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    let _nbitLength = void 0;
    let _sqrt = void 0;
    let modFromBytes = false;
    let allowedLengths = void 0;
    if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
      if (opts.sqrt || isLE)
        throw new Error("cannot specify opts in two arguments");
      const _opts = bitLenOrOpts;
      if (_opts.BITS)
        _nbitLength = _opts.BITS;
      if (_opts.sqrt)
        _sqrt = _opts.sqrt;
      if (typeof _opts.isLE === "boolean")
        isLE = _opts.isLE;
      if (typeof _opts.modFromBytes === "boolean")
        modFromBytes = _opts.modFromBytes;
      allowedLengths = _opts.allowedLengths;
    } else {
      if (typeof bitLenOrOpts === "number")
        _nbitLength = bitLenOrOpts;
      if (opts.sqrt)
        _sqrt = opts.sqrt;
    }
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
    if (BYTES > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let sqrtP;
    const f4 = Object.freeze({
      ORDER,
      isLE,
      BITS,
      BYTES,
      MASK: bitMask(BITS),
      ZERO: _0n2,
      ONE: _1n2,
      allowedLengths,
      create: (num) => mod(num, ORDER),
      isValid: (num) => {
        if (typeof num !== "bigint")
          throw new Error("invalid field element: expected bigint, got " + typeof num);
        return _0n2 <= num && num < ORDER;
      },
      is0: (num) => num === _0n2,
      // is valid and invertible
      isValidNot0: (num) => !f4.is0(num) && f4.isValid(num),
      isOdd: (num) => (num & _1n2) === _1n2,
      neg: (num) => mod(-num, ORDER),
      eql: (lhs, rhs) => lhs === rhs,
      sqr: (num) => mod(num * num, ORDER),
      add: (lhs, rhs) => mod(lhs + rhs, ORDER),
      sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
      mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
      pow: (num, power) => FpPow(f4, num, power),
      div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
      // Same as above, but doesn't normalize
      sqrN: (num) => num * num,
      addN: (lhs, rhs) => lhs + rhs,
      subN: (lhs, rhs) => lhs - rhs,
      mulN: (lhs, rhs) => lhs * rhs,
      inv: (num) => invert(num, ORDER),
      sqrt: _sqrt || ((n) => {
        if (!sqrtP)
          sqrtP = FpSqrt(ORDER);
        return sqrtP(f4, n);
      }),
      toBytes: (num) => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
      fromBytes: (bytes, skipValidation = true) => {
        if (allowedLengths) {
          if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
            throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
          }
          const padded = new Uint8Array(BYTES);
          padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
          bytes = padded;
        }
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
        if (modFromBytes)
          scalar = mod(scalar, ORDER);
        if (!skipValidation) {
          if (!f4.isValid(scalar))
            throw new Error("invalid field element: outside of range 0..ORDER");
        }
        return scalar;
      },
      // TODO: we don't need it here, move out to separate fn
      invertBatch: (lst) => FpInvertBatch(f4, lst),
      // We can't move this out because Fp6, Fp12 implement it
      // and it's unclear what to return in there.
      cmov: (a4, b6, c2) => c2 ? b6 : a4
    });
    return Object.freeze(f4);
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
    const reduced = mod(num, fieldOrder - _1n2) + _1n2;
    return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }

  // node_modules/@noble/curves/esm/abstract/curve.js
  var _0n3 = BigInt(0);
  var _1n3 = BigInt(1);
  function negateCt(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  function normalizeZ(c2, points) {
    const invertedZs = FpInvertBatch(c2.Fp, points.map((p4) => p4.Z));
    return points.map((p4, i) => c2.fromAffine(p4.toAffine(invertedZs[i])));
  }
  function validateW(W4, bits) {
    if (!Number.isSafeInteger(W4) || W4 <= 0 || W4 > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W4);
  }
  function calcWOpts(W4, scalarBits) {
    validateW(W4, scalarBits);
    const windows = Math.ceil(scalarBits / W4) + 1;
    const windowSize = 2 ** (W4 - 1);
    const maxNumber = 2 ** W4;
    const mask = bitMask(W4);
    const shiftBy = BigInt(W4);
    return { windows, windowSize, mask, maxNumber, shiftBy };
  }
  function calcOffsets(n, window2, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n & mask);
    let nextN = n >> shiftBy;
    if (wbits > windowSize) {
      wbits -= maxNumber;
      nextN += _1n3;
    }
    const offsetStart = window2 * windowSize;
    const offset = offsetStart + Math.abs(wbits) - 1;
    const isZero = wbits === 0;
    const isNeg = wbits < 0;
    const isNegF = window2 % 2 !== 0;
    const offsetF = offsetStart;
    return { nextN, offset, isZero, isNeg, isNegF, offsetF };
  }
  function validateMSMPoints(points, c2) {
    if (!Array.isArray(points))
      throw new Error("array expected");
    points.forEach((p4, i) => {
      if (!(p4 instanceof c2))
        throw new Error("invalid point at index " + i);
    });
  }
  function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s3, i) => {
      if (!field.isValid(s3))
        throw new Error("invalid scalar at index " + i);
    });
  }
  var pointPrecomputes = /* @__PURE__ */ new WeakMap();
  var pointWindowSizes = /* @__PURE__ */ new WeakMap();
  function getW(P4) {
    return pointWindowSizes.get(P4) || 1;
  }
  function assert0(n) {
    if (n !== _0n3)
      throw new Error("invalid wNAF");
  }
  var wNAF = class {
    // Parametrized with a given Point class (not individual point)
    constructor(Point, bits) {
      this.BASE = Point.BASE;
      this.ZERO = Point.ZERO;
      this.Fn = Point.Fn;
      this.bits = bits;
    }
    // non-const time multiplication ladder
    _unsafeLadder(elm, n, p4 = this.ZERO) {
      let d4 = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p4 = p4.add(d4);
        d4 = d4.double();
        n >>= _1n3;
      }
      return p4;
    }
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param point Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(point, W4) {
      const { windows, windowSize } = calcWOpts(W4, this.bits);
      const points = [];
      let p4 = point;
      let base = p4;
      for (let window2 = 0; window2 < windows; window2++) {
        base = p4;
        points.push(base);
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p4);
          points.push(base);
        }
        p4 = base.double();
      }
      return points;
    }
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * More compact implementation:
     * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
     * @returns real and fake (for const-time) points
     */
    wNAF(W4, precomputes, n) {
      if (!this.Fn.isValid(n))
        throw new Error("invalid scalar");
      let p4 = this.ZERO;
      let f4 = this.BASE;
      const wo = calcWOpts(W4, this.bits);
      for (let window2 = 0; window2 < wo.windows; window2++) {
        const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
        n = nextN;
        if (isZero) {
          f4 = f4.add(negateCt(isNegF, precomputes[offsetF]));
        } else {
          p4 = p4.add(negateCt(isNeg, precomputes[offset]));
        }
      }
      assert0(n);
      return { p: p4, f: f4 };
    }
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W4, precomputes, n, acc = this.ZERO) {
      const wo = calcWOpts(W4, this.bits);
      for (let window2 = 0; window2 < wo.windows; window2++) {
        if (n === _0n3)
          break;
        const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
        n = nextN;
        if (isZero) {
          continue;
        } else {
          const item = precomputes[offset];
          acc = acc.add(isNeg ? item.negate() : item);
        }
      }
      assert0(n);
      return acc;
    }
    getPrecomputes(W4, point, transform2) {
      let comp = pointPrecomputes.get(point);
      if (!comp) {
        comp = this.precomputeWindow(point, W4);
        if (W4 !== 1) {
          if (typeof transform2 === "function")
            comp = transform2(comp);
          pointPrecomputes.set(point, comp);
        }
      }
      return comp;
    }
    cached(point, scalar, transform2) {
      const W4 = getW(point);
      return this.wNAF(W4, this.getPrecomputes(W4, point, transform2), scalar);
    }
    unsafe(point, scalar, transform2, prev) {
      const W4 = getW(point);
      if (W4 === 1)
        return this._unsafeLadder(point, scalar, prev);
      return this.wNAFUnsafe(W4, this.getPrecomputes(W4, point, transform2), scalar, prev);
    }
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    createCache(P4, W4) {
      validateW(W4, this.bits);
      pointWindowSizes.set(P4, W4);
      pointPrecomputes.delete(P4);
    }
    hasCache(elm) {
      return getW(elm) !== 1;
    }
  };
  function mulEndoUnsafe(Point, point, k1, k22) {
    let acc = point;
    let p1 = Point.ZERO;
    let p22 = Point.ZERO;
    while (k1 > _0n3 || k22 > _0n3) {
      if (k1 & _1n3)
        p1 = p1.add(acc);
      if (k22 & _1n3)
        p22 = p22.add(acc);
      acc = acc.double();
      k1 >>= _1n3;
      k22 >>= _1n3;
    }
    return { p1, p2: p22 };
  }
  function pippenger(c2, fieldN, points, scalars) {
    validateMSMPoints(points, c2);
    validateMSMScalars(scalars, fieldN);
    const plength = points.length;
    const slength = scalars.length;
    if (plength !== slength)
      throw new Error("arrays of points and scalars must have equal length");
    const zero = c2.ZERO;
    const wbits = bitLen(BigInt(plength));
    let windowSize = 1;
    if (wbits > 12)
      windowSize = wbits - 3;
    else if (wbits > 4)
      windowSize = wbits - 2;
    else if (wbits > 0)
      windowSize = 2;
    const MASK = bitMask(windowSize);
    const buckets = new Array(Number(MASK) + 1).fill(zero);
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(zero);
      for (let j5 = 0; j5 < slength; j5++) {
        const scalar = scalars[j5];
        const wbits2 = Number(scalar >> BigInt(i) & MASK);
        buckets[wbits2] = buckets[wbits2].add(points[j5]);
      }
      let resI = zero;
      for (let j5 = buckets.length - 1, sumI = zero; j5 > 0; j5--) {
        sumI = sumI.add(buckets[j5]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j5 = 0; j5 < windowSize; j5++)
          sum = sum.double();
    }
    return sum;
  }
  function createField(order, field, isLE) {
    if (field) {
      if (field.ORDER !== order)
        throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      validateField(field);
      return field;
    } else {
      return Field(order, { isLE });
    }
  }
  function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
    if (FpFnLE === void 0)
      FpFnLE = type === "edwards";
    if (!CURVE || typeof CURVE !== "object")
      throw new Error(`expected valid ${type} CURVE object`);
    for (const p4 of ["p", "n", "h"]) {
      const val = CURVE[p4];
      if (!(typeof val === "bigint" && val > _0n3))
        throw new Error(`CURVE.${p4} must be positive bigint`);
    }
    const Fp4 = createField(CURVE.p, curveOpts.Fp, FpFnLE);
    const Fn2 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
    const _b2 = type === "weierstrass" ? "b" : "d";
    const params = ["Gx", "Gy", "a", _b2];
    for (const p4 of params) {
      if (!Fp4.isValid(CURVE[p4]))
        throw new Error(`CURVE.${p4} must be valid field element of CURVE.Fp`);
    }
    CURVE = Object.freeze(Object.assign({}, CURVE));
    return { CURVE, Fp: Fp4, Fn: Fn2 };
  }

  // node_modules/@noble/curves/esm/abstract/hash-to-curve.js
  var os2ip = bytesToNumberBE;
  function i2osp(value, length) {
    anum(value);
    anum(length);
    if (value < 0 || value >= 1 << 8 * length)
      throw new Error("invalid I2OSP input: " + value);
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1; i >= 0; i--) {
      res[i] = value & 255;
      value >>>= 8;
    }
    return new Uint8Array(res);
  }
  function strxor(a4, b6) {
    const arr = new Uint8Array(a4.length);
    for (let i = 0; i < a4.length; i++) {
      arr[i] = a4[i] ^ b6[i];
    }
    return arr;
  }
  function anum(item) {
    if (!Number.isSafeInteger(item))
      throw new Error("number expected");
  }
  function normDST(DST) {
    if (!isBytes(DST) && typeof DST !== "string")
      throw new Error("DST must be Uint8Array or string");
    return typeof DST === "string" ? utf8ToBytes(DST) : DST;
  }
  function expand_message_xmd(msg, DST, lenInBytes, H3) {
    abytes(msg);
    anum(lenInBytes);
    DST = normDST(DST);
    if (DST.length > 255)
      DST = H3(concatBytes(utf8ToBytes("H2C-OVERSIZE-DST-"), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H3;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
      throw new Error("expand_message_xmd: invalid lenInBytes");
    const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2);
    const b6 = new Array(ell);
    const b_0 = H3(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b6[0] = H3(concatBytes(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i <= ell; i++) {
      const args = [strxor(b_0, b6[i - 1]), i2osp(i + 1, 1), DST_prime];
      b6[i] = H3(concatBytes(...args));
    }
    const pseudo_random_bytes = concatBytes(...b6);
    return pseudo_random_bytes.slice(0, lenInBytes);
  }
  function expand_message_xof(msg, DST, lenInBytes, k5, H3) {
    abytes(msg);
    anum(lenInBytes);
    DST = normDST(DST);
    if (DST.length > 255) {
      const dkLen = Math.ceil(2 * k5 / 8);
      DST = H3.create({ dkLen }).update(utf8ToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255)
      throw new Error("expand_message_xof: invalid lenInBytes");
    return H3.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
  }
  function hash_to_field(msg, count, options) {
    _validateObject(options, {
      p: "bigint",
      m: "number",
      k: "number",
      hash: "function"
    });
    const { p: p4, k: k5, m: m4, hash, expand, DST } = options;
    if (!isHash(options.hash))
      throw new Error("expected valid hash");
    abytes(msg);
    anum(count);
    const log2p = p4.toString(2).length;
    const L3 = Math.ceil((log2p + k5) / 8);
    const len_in_bytes = count * m4 * L3;
    let prb;
    if (expand === "xmd") {
      prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
    } else if (expand === "xof") {
      prb = expand_message_xof(msg, DST, len_in_bytes, k5, hash);
    } else if (expand === "_internal_pass") {
      prb = msg;
    } else {
      throw new Error('expand must be "xmd" or "xof"');
    }
    const u4 = new Array(count);
    for (let i = 0; i < count; i++) {
      const e3 = new Array(m4);
      for (let j5 = 0; j5 < m4; j5++) {
        const elm_offset = L3 * (j5 + i * m4);
        const tv = prb.subarray(elm_offset, elm_offset + L3);
        e3[j5] = mod(os2ip(tv), p4);
      }
      u4[i] = e3;
    }
    return u4;
  }
  function isogenyMap(field, map) {
    const coeff = map.map((i) => Array.from(i).reverse());
    return (x4, y4) => {
      const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x4), i)));
      const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
      x4 = field.mul(xn, xd_inv);
      y4 = field.mul(y4, field.mul(yn, yd_inv));
      return { x: x4, y: y4 };
    };
  }
  var _DST_scalar = utf8ToBytes("HashToScalar-");
  function createHasher2(Point, mapToCurve, defaults) {
    if (typeof mapToCurve !== "function")
      throw new Error("mapToCurve() must be defined");
    function map(num) {
      return Point.fromAffine(mapToCurve(num));
    }
    function clear(initial) {
      const P4 = initial.clearCofactor();
      if (P4.equals(Point.ZERO))
        return Point.ZERO;
      P4.assertValidity();
      return P4;
    }
    return {
      defaults,
      hashToCurve(msg, options) {
        const opts = Object.assign({}, defaults, options);
        const u4 = hash_to_field(msg, 2, opts);
        const u0 = map(u4[0]);
        const u1 = map(u4[1]);
        return clear(u0.add(u1));
      },
      encodeToCurve(msg, options) {
        const optsDst = defaults.encodeDST ? { DST: defaults.encodeDST } : {};
        const opts = Object.assign({}, defaults, optsDst, options);
        const u4 = hash_to_field(msg, 1, opts);
        const u0 = map(u4[0]);
        return clear(u0);
      },
      /** See {@link H2CHasher} */
      mapToCurve(scalars) {
        if (!Array.isArray(scalars))
          throw new Error("expected array of bigints");
        for (const i of scalars)
          if (typeof i !== "bigint")
            throw new Error("expected array of bigints");
        return clear(map(scalars));
      },
      // hash_to_scalar can produce 0: https://www.rfc-editor.org/errata/eid8393
      // RFC 9380, draft-irtf-cfrg-bbs-signatures-08
      hashToScalar(msg, options) {
        const N4 = Point.Fn.ORDER;
        const opts = Object.assign({}, defaults, { p: N4, m: 1, DST: _DST_scalar }, options);
        return hash_to_field(msg, 1, opts)[0][0];
      }
    };
  }

  // node_modules/@noble/curves/esm/abstract/weierstrass.js
  var divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n2) / den;
  function _splitEndoScalar(k5, basis, n) {
    const [[a1, b1], [a22, b22]] = basis;
    const c1 = divNearest(b22 * k5, n);
    const c2 = divNearest(-b1 * k5, n);
    let k1 = k5 - c1 * a1 - c2 * a22;
    let k22 = -c1 * b1 - c2 * b22;
    const k1neg = k1 < _0n4;
    const k2neg = k22 < _0n4;
    if (k1neg)
      k1 = -k1;
    if (k2neg)
      k22 = -k22;
    const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
    if (k1 < _0n4 || k1 >= MAX_NUM || k22 < _0n4 || k22 >= MAX_NUM) {
      throw new Error("splitScalar (endomorphism): failed, k=" + k5);
    }
    return { k1neg, k1, k2neg, k2: k22 };
  }
  var _0n4 = BigInt(0);
  var _1n4 = BigInt(1);
  var _2n2 = BigInt(2);
  var _3n2 = BigInt(3);
  var _4n2 = BigInt(4);
  function _normFnElement(Fn2, key) {
    const { BYTES: expected } = Fn2;
    let num;
    if (typeof key === "bigint") {
      num = key;
    } else {
      let bytes = ensureBytes("private key", key);
      try {
        num = Fn2.fromBytes(bytes);
      } catch (error) {
        throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
      }
    }
    if (!Fn2.isValidNot0(num))
      throw new Error("invalid private key: out of range [1..N-1]");
    return num;
  }
  function weierstrassN(params, extraOpts = {}) {
    const validated = _createCurveFields("weierstrass", params, extraOpts);
    const { Fp: Fp4, Fn: Fn2 } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor, n: CURVE_ORDER } = CURVE;
    _validateObject(extraOpts, {}, {
      allowInfinityPoint: "boolean",
      clearCofactor: "function",
      isTorsionFree: "function",
      fromBytes: "function",
      toBytes: "function",
      endo: "object",
      wrapPrivateKey: "boolean"
    });
    const { endo } = extraOpts;
    if (endo) {
      if (!Fp4.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
        throw new Error('invalid endo: expected "beta": bigint and "basises": array');
      }
    }
    const lengths = getWLengths(Fp4, Fn2);
    function assertCompressionIsSupported() {
      if (!Fp4.isOdd)
        throw new Error("compression is not supported: Field does not have .isOdd()");
    }
    function pointToBytes(_c, point, isCompressed) {
      const { x: x4, y: y4 } = point.toAffine();
      const bx = Fp4.toBytes(x4);
      _abool2(isCompressed, "isCompressed");
      if (isCompressed) {
        assertCompressionIsSupported();
        const hasEvenY = !Fp4.isOdd(y4);
        return concatBytes(pprefix(hasEvenY), bx);
      } else {
        return concatBytes(Uint8Array.of(4), bx, Fp4.toBytes(y4));
      }
    }
    function pointFromBytes(bytes) {
      _abytes2(bytes, void 0, "Point");
      const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
      const length = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (length === comp && (head === 2 || head === 3)) {
        const x4 = Fp4.fromBytes(tail);
        if (!Fp4.isValid(x4))
          throw new Error("bad point: is not on curve, wrong x");
        const y22 = weierstrassEquation(x4);
        let y4;
        try {
          y4 = Fp4.sqrt(y22);
        } catch (sqrtError) {
          const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("bad point: is not on curve, sqrt error" + err);
        }
        assertCompressionIsSupported();
        const isYOdd = Fp4.isOdd(y4);
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y4 = Fp4.neg(y4);
        return { x: x4, y: y4 };
      } else if (length === uncomp && head === 4) {
        const L3 = Fp4.BYTES;
        const x4 = Fp4.fromBytes(tail.subarray(0, L3));
        const y4 = Fp4.fromBytes(tail.subarray(L3, L3 * 2));
        if (!isValidXY(x4, y4))
          throw new Error("bad point: is not on curve");
        return { x: x4, y: y4 };
      } else {
        throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
      }
    }
    const encodePoint = extraOpts.toBytes || pointToBytes;
    const decodePoint = extraOpts.fromBytes || pointFromBytes;
    function weierstrassEquation(x4) {
      const x22 = Fp4.sqr(x4);
      const x32 = Fp4.mul(x22, x4);
      return Fp4.add(Fp4.add(x32, Fp4.mul(x4, CURVE.a)), CURVE.b);
    }
    function isValidXY(x4, y4) {
      const left = Fp4.sqr(y4);
      const right = weierstrassEquation(x4);
      return Fp4.eql(left, right);
    }
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const _4a3 = Fp4.mul(Fp4.pow(CURVE.a, _3n2), _4n2);
    const _27b2 = Fp4.mul(Fp4.sqr(CURVE.b), BigInt(27));
    if (Fp4.is0(Fp4.add(_4a3, _27b2)))
      throw new Error("bad curve params: a or b");
    function acoord(title, n, banZero = false) {
      if (!Fp4.isValid(n) || banZero && Fp4.is0(n))
        throw new Error(`bad point coordinate ${title}`);
      return n;
    }
    function aprjpoint(other) {
      if (!(other instanceof Point))
        throw new Error("ProjectivePoint expected");
    }
    function splitEndoScalarN(k5) {
      if (!endo || !endo.basises)
        throw new Error("no endo");
      return _splitEndoScalar(k5, endo.basises, Fn2.ORDER);
    }
    const toAffineMemo = memoized((p4, iz) => {
      const { X: X4, Y: Y3, Z: Z3 } = p4;
      if (Fp4.eql(Z3, Fp4.ONE))
        return { x: X4, y: Y3 };
      const is0 = p4.is0();
      if (iz == null)
        iz = is0 ? Fp4.ONE : Fp4.inv(Z3);
      const x4 = Fp4.mul(X4, iz);
      const y4 = Fp4.mul(Y3, iz);
      const zz = Fp4.mul(Z3, iz);
      if (is0)
        return { x: Fp4.ZERO, y: Fp4.ZERO };
      if (!Fp4.eql(zz, Fp4.ONE))
        throw new Error("invZ was invalid");
      return { x: x4, y: y4 };
    });
    const assertValidMemo = memoized((p4) => {
      if (p4.is0()) {
        if (extraOpts.allowInfinityPoint && !Fp4.is0(p4.Y))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x: x4, y: y4 } = p4.toAffine();
      if (!Fp4.isValid(x4) || !Fp4.isValid(y4))
        throw new Error("bad point: x or y not field elements");
      if (!isValidXY(x4, y4))
        throw new Error("bad point: equation left != right");
      if (!p4.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
      k2p = new Point(Fp4.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
      k1p = negateCt(k1neg, k1p);
      k2p = negateCt(k2neg, k2p);
      return k1p.add(k2p);
    }
    class Point {
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      constructor(X4, Y3, Z3) {
        this.X = acoord("x", X4);
        this.Y = acoord("y", Y3, true);
        this.Z = acoord("z", Z3);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      static fromAffine(p4) {
        const { x: x4, y: y4 } = p4 || {};
        if (!p4 || !Fp4.isValid(x4) || !Fp4.isValid(y4))
          throw new Error("invalid affine point");
        if (p4 instanceof Point)
          throw new Error("projective point not allowed");
        if (Fp4.is0(x4) && Fp4.is0(y4))
          return Point.ZERO;
        return new Point(x4, y4, Fp4.ONE);
      }
      static fromBytes(bytes) {
        const P4 = Point.fromAffine(decodePoint(_abytes2(bytes, void 0, "point")));
        P4.assertValidity();
        return P4;
      }
      static fromHex(hex) {
        return Point.fromBytes(ensureBytes("pointHex", hex));
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       *
       * @param windowSize
       * @param isLazy true will defer table computation until the first multiplication
       * @returns
       */
      precompute(windowSize = 8, isLazy = true) {
        wnaf.createCache(this, windowSize);
        if (!isLazy)
          this.multiply(_3n2);
        return this;
      }
      // TODO: return `this`
      /** A point on curve is valid if it conforms to equation. */
      assertValidity() {
        assertValidMemo(this);
      }
      hasEvenY() {
        const { y: y4 } = this.toAffine();
        if (!Fp4.isOdd)
          throw new Error("Field doesn't support isOdd");
        return !Fp4.isOdd(y4);
      }
      /** Compare one point to another. */
      equals(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X22, Y: Y22, Z: Z22 } = other;
        const U1 = Fp4.eql(Fp4.mul(X1, Z22), Fp4.mul(X22, Z1));
        const U22 = Fp4.eql(Fp4.mul(Y1, Z22), Fp4.mul(Y22, Z1));
        return U1 && U22;
      }
      /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
      negate() {
        return new Point(this.X, Fp4.neg(this.Y), this.Z);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a: a4, b: b6 } = CURVE;
        const b32 = Fp4.mul(b6, _3n2);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        let X32 = Fp4.ZERO, Y3 = Fp4.ZERO, Z3 = Fp4.ZERO;
        let t0 = Fp4.mul(X1, X1);
        let t1 = Fp4.mul(Y1, Y1);
        let t2 = Fp4.mul(Z1, Z1);
        let t3 = Fp4.mul(X1, Y1);
        t3 = Fp4.add(t3, t3);
        Z3 = Fp4.mul(X1, Z1);
        Z3 = Fp4.add(Z3, Z3);
        X32 = Fp4.mul(a4, Z3);
        Y3 = Fp4.mul(b32, t2);
        Y3 = Fp4.add(X32, Y3);
        X32 = Fp4.sub(t1, Y3);
        Y3 = Fp4.add(t1, Y3);
        Y3 = Fp4.mul(X32, Y3);
        X32 = Fp4.mul(t3, X32);
        Z3 = Fp4.mul(b32, Z3);
        t2 = Fp4.mul(a4, t2);
        t3 = Fp4.sub(t0, t2);
        t3 = Fp4.mul(a4, t3);
        t3 = Fp4.add(t3, Z3);
        Z3 = Fp4.add(t0, t0);
        t0 = Fp4.add(Z3, t0);
        t0 = Fp4.add(t0, t2);
        t0 = Fp4.mul(t0, t3);
        Y3 = Fp4.add(Y3, t0);
        t2 = Fp4.mul(Y1, Z1);
        t2 = Fp4.add(t2, t2);
        t0 = Fp4.mul(t2, t3);
        X32 = Fp4.sub(X32, t0);
        Z3 = Fp4.mul(t2, t1);
        Z3 = Fp4.add(Z3, Z3);
        Z3 = Fp4.add(Z3, Z3);
        return new Point(X32, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X22, Y: Y22, Z: Z22 } = other;
        let X32 = Fp4.ZERO, Y3 = Fp4.ZERO, Z3 = Fp4.ZERO;
        const a4 = CURVE.a;
        const b32 = Fp4.mul(CURVE.b, _3n2);
        let t0 = Fp4.mul(X1, X22);
        let t1 = Fp4.mul(Y1, Y22);
        let t2 = Fp4.mul(Z1, Z22);
        let t3 = Fp4.add(X1, Y1);
        let t4 = Fp4.add(X22, Y22);
        t3 = Fp4.mul(t3, t4);
        t4 = Fp4.add(t0, t1);
        t3 = Fp4.sub(t3, t4);
        t4 = Fp4.add(X1, Z1);
        let t5 = Fp4.add(X22, Z22);
        t4 = Fp4.mul(t4, t5);
        t5 = Fp4.add(t0, t2);
        t4 = Fp4.sub(t4, t5);
        t5 = Fp4.add(Y1, Z1);
        X32 = Fp4.add(Y22, Z22);
        t5 = Fp4.mul(t5, X32);
        X32 = Fp4.add(t1, t2);
        t5 = Fp4.sub(t5, X32);
        Z3 = Fp4.mul(a4, t4);
        X32 = Fp4.mul(b32, t2);
        Z3 = Fp4.add(X32, Z3);
        X32 = Fp4.sub(t1, Z3);
        Z3 = Fp4.add(t1, Z3);
        Y3 = Fp4.mul(X32, Z3);
        t1 = Fp4.add(t0, t0);
        t1 = Fp4.add(t1, t0);
        t2 = Fp4.mul(a4, t2);
        t4 = Fp4.mul(b32, t4);
        t1 = Fp4.add(t1, t2);
        t2 = Fp4.sub(t0, t2);
        t2 = Fp4.mul(a4, t2);
        t4 = Fp4.add(t4, t2);
        t0 = Fp4.mul(t1, t4);
        Y3 = Fp4.add(Y3, t0);
        t0 = Fp4.mul(t5, t4);
        X32 = Fp4.mul(t3, X32);
        X32 = Fp4.sub(X32, t0);
        t0 = Fp4.mul(t3, t1);
        Z3 = Fp4.mul(t5, Z3);
        Z3 = Fp4.add(Z3, t0);
        return new Point(X32, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        const { endo: endo2 } = extraOpts;
        if (!Fn2.isValidNot0(scalar))
          throw new Error("invalid scalar: out of range");
        let point, fake;
        const mul = (n) => wnaf.cached(this, n, (p4) => normalizeZ(Point, p4));
        if (endo2) {
          const { k1neg, k1, k2neg, k2: k22 } = splitEndoScalarN(scalar);
          const { p: k1p, f: k1f } = mul(k1);
          const { p: k2p, f: k2f } = mul(k22);
          fake = k1f.add(k2f);
          point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
        } else {
          const { p: p4, f: f4 } = mul(scalar);
          point = p4;
          fake = f4;
        }
        return normalizeZ(Point, [point, fake])[0];
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed secret key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(sc) {
        const { endo: endo2 } = extraOpts;
        const p4 = this;
        if (!Fn2.isValid(sc))
          throw new Error("invalid scalar: out of range");
        if (sc === _0n4 || p4.is0())
          return Point.ZERO;
        if (sc === _1n4)
          return p4;
        if (wnaf.hasCache(this))
          return this.multiply(sc);
        if (endo2) {
          const { k1neg, k1, k2neg, k2: k22 } = splitEndoScalarN(sc);
          const { p1, p2: p22 } = mulEndoUnsafe(Point, p4, k1, k22);
          return finishEndo(endo2.beta, p1, p22, k1neg, k2neg);
        } else {
          return wnaf.unsafe(p4, sc);
        }
      }
      multiplyAndAddUnsafe(Q3, a4, b6) {
        const sum = this.multiplyUnsafe(a4).add(Q3.multiplyUnsafe(b6));
        return sum.is0() ? void 0 : sum;
      }
      /**
       * Converts Projective point to affine (x, y) coordinates.
       * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
       */
      toAffine(invertedZ) {
        return toAffineMemo(this, invertedZ);
      }
      /**
       * Checks whether Point is free of torsion elements (is in prime subgroup).
       * Always torsion-free for cofactor=1 curves.
       */
      isTorsionFree() {
        const { isTorsionFree } = extraOpts;
        if (cofactor === _1n4)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point, this);
        return wnaf.unsafe(this, CURVE_ORDER).is0();
      }
      clearCofactor() {
        const { clearCofactor } = extraOpts;
        if (cofactor === _1n4)
          return this;
        if (clearCofactor)
          return clearCofactor(Point, this);
        return this.multiplyUnsafe(cofactor);
      }
      isSmallOrder() {
        return this.multiplyUnsafe(cofactor).is0();
      }
      toBytes(isCompressed = true) {
        _abool2(isCompressed, "isCompressed");
        this.assertValidity();
        return encodePoint(Point, this, isCompressed);
      }
      toHex(isCompressed = true) {
        return bytesToHex(this.toBytes(isCompressed));
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
      // TODO: remove
      get px() {
        return this.X;
      }
      get py() {
        return this.X;
      }
      get pz() {
        return this.Z;
      }
      toRawBytes(isCompressed = true) {
        return this.toBytes(isCompressed);
      }
      _setWindowSize(windowSize) {
        this.precompute(windowSize);
      }
      static normalizeZ(points) {
        return normalizeZ(Point, points);
      }
      static msm(points, scalars) {
        return pippenger(Point, Fn2, points, scalars);
      }
      static fromPrivateKey(privateKey) {
        return Point.BASE.multiply(_normFnElement(Fn2, privateKey));
      }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp4.ONE);
    Point.ZERO = new Point(Fp4.ZERO, Fp4.ONE, Fp4.ZERO);
    Point.Fp = Fp4;
    Point.Fn = Fn2;
    const bits = Fn2.BITS;
    const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
    Point.BASE.precompute(8);
    return Point;
  }
  function pprefix(hasEvenY) {
    return Uint8Array.of(hasEvenY ? 2 : 3);
  }
  function SWUFpSqrtRatio(Fp4, Z3) {
    const q4 = Fp4.ORDER;
    let l3 = _0n4;
    for (let o3 = q4 - _1n4; o3 % _2n2 === _0n4; o3 /= _2n2)
      l3 += _1n4;
    const c1 = l3;
    const _2n_pow_c1_1 = _2n2 << c1 - _1n4 - _1n4;
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n2;
    const c2 = (q4 - _1n4) / _2n_pow_c1;
    const c3 = (c2 - _1n4) / _2n2;
    const c4 = _2n_pow_c1 - _1n4;
    const c5 = _2n_pow_c1_1;
    const c6 = Fp4.pow(Z3, c2);
    const c7 = Fp4.pow(Z3, (c2 + _1n4) / _2n2);
    let sqrtRatio = (u4, v3) => {
      let tv1 = c6;
      let tv2 = Fp4.pow(v3, c4);
      let tv3 = Fp4.sqr(tv2);
      tv3 = Fp4.mul(tv3, v3);
      let tv5 = Fp4.mul(u4, tv3);
      tv5 = Fp4.pow(tv5, c3);
      tv5 = Fp4.mul(tv5, tv2);
      tv2 = Fp4.mul(tv5, v3);
      tv3 = Fp4.mul(tv5, u4);
      let tv4 = Fp4.mul(tv3, tv2);
      tv5 = Fp4.pow(tv4, c5);
      let isQR = Fp4.eql(tv5, Fp4.ONE);
      tv2 = Fp4.mul(tv3, c7);
      tv5 = Fp4.mul(tv4, tv1);
      tv3 = Fp4.cmov(tv2, tv3, isQR);
      tv4 = Fp4.cmov(tv5, tv4, isQR);
      for (let i = c1; i > _1n4; i--) {
        let tv52 = i - _2n2;
        tv52 = _2n2 << tv52 - _1n4;
        let tvv5 = Fp4.pow(tv4, tv52);
        const e1 = Fp4.eql(tvv5, Fp4.ONE);
        tv2 = Fp4.mul(tv3, tv1);
        tv1 = Fp4.mul(tv1, tv1);
        tvv5 = Fp4.mul(tv4, tv1);
        tv3 = Fp4.cmov(tv2, tv3, e1);
        tv4 = Fp4.cmov(tvv5, tv4, e1);
      }
      return { isValid: isQR, value: tv3 };
    };
    if (Fp4.ORDER % _4n2 === _3n2) {
      const c12 = (Fp4.ORDER - _3n2) / _4n2;
      const c22 = Fp4.sqrt(Fp4.neg(Z3));
      sqrtRatio = (u4, v3) => {
        let tv1 = Fp4.sqr(v3);
        const tv2 = Fp4.mul(u4, v3);
        tv1 = Fp4.mul(tv1, tv2);
        let y1 = Fp4.pow(tv1, c12);
        y1 = Fp4.mul(y1, tv2);
        const y22 = Fp4.mul(y1, c22);
        const tv3 = Fp4.mul(Fp4.sqr(y1), v3);
        const isQR = Fp4.eql(tv3, u4);
        let y4 = Fp4.cmov(y22, y1, isQR);
        return { isValid: isQR, value: y4 };
      };
    }
    return sqrtRatio;
  }
  function mapToCurveSimpleSWU(Fp4, opts) {
    validateField(Fp4);
    const { A: A5, B: B5, Z: Z3 } = opts;
    if (!Fp4.isValid(A5) || !Fp4.isValid(B5) || !Fp4.isValid(Z3))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const sqrtRatio = SWUFpSqrtRatio(Fp4, Z3);
    if (!Fp4.isOdd)
      throw new Error("Field does not have .isOdd()");
    return (u4) => {
      let tv1, tv2, tv3, tv4, tv5, tv6, x4, y4;
      tv1 = Fp4.sqr(u4);
      tv1 = Fp4.mul(tv1, Z3);
      tv2 = Fp4.sqr(tv1);
      tv2 = Fp4.add(tv2, tv1);
      tv3 = Fp4.add(tv2, Fp4.ONE);
      tv3 = Fp4.mul(tv3, B5);
      tv4 = Fp4.cmov(Z3, Fp4.neg(tv2), !Fp4.eql(tv2, Fp4.ZERO));
      tv4 = Fp4.mul(tv4, A5);
      tv2 = Fp4.sqr(tv3);
      tv6 = Fp4.sqr(tv4);
      tv5 = Fp4.mul(tv6, A5);
      tv2 = Fp4.add(tv2, tv5);
      tv2 = Fp4.mul(tv2, tv3);
      tv6 = Fp4.mul(tv6, tv4);
      tv5 = Fp4.mul(tv6, B5);
      tv2 = Fp4.add(tv2, tv5);
      x4 = Fp4.mul(tv1, tv3);
      const { isValid, value } = sqrtRatio(tv2, tv6);
      y4 = Fp4.mul(tv1, u4);
      y4 = Fp4.mul(y4, value);
      x4 = Fp4.cmov(x4, tv3, isValid);
      y4 = Fp4.cmov(y4, value, isValid);
      const e1 = Fp4.isOdd(u4) === Fp4.isOdd(y4);
      y4 = Fp4.cmov(Fp4.neg(y4), y4, e1);
      const tv4_inv = FpInvertBatch(Fp4, [tv4], true)[0];
      x4 = Fp4.mul(x4, tv4_inv);
      return { x: x4, y: y4 };
    };
  }
  function getWLengths(Fp4, Fn2) {
    return {
      secretKey: Fn2.BYTES,
      publicKey: 1 + Fp4.BYTES,
      publicKeyUncompressed: 1 + 2 * Fp4.BYTES,
      publicKeyHasPrefix: true,
      signature: 2 * Fn2.BYTES
    };
  }
  function weierstrassPoints(c2) {
    const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c2);
    const Point = weierstrassN(CURVE, curveOpts);
    return _weierstrass_new_output_to_legacy(c2, Point);
  }
  function _weierstrass_legacy_opts_to_new(c2) {
    const CURVE = {
      a: c2.a,
      b: c2.b,
      p: c2.Fp.ORDER,
      n: c2.n,
      h: c2.h,
      Gx: c2.Gx,
      Gy: c2.Gy
    };
    const Fp4 = c2.Fp;
    let allowedLengths = c2.allowedPrivateKeyLengths ? Array.from(new Set(c2.allowedPrivateKeyLengths.map((l3) => Math.ceil(l3 / 2)))) : void 0;
    const Fn2 = Field(CURVE.n, {
      BITS: c2.nBitLength,
      allowedLengths,
      modFromBytes: c2.wrapPrivateKey
    });
    const curveOpts = {
      Fp: Fp4,
      Fn: Fn2,
      allowInfinityPoint: c2.allowInfinityPoint,
      endo: c2.endo,
      isTorsionFree: c2.isTorsionFree,
      clearCofactor: c2.clearCofactor,
      fromBytes: c2.fromBytes,
      toBytes: c2.toBytes
    };
    return { CURVE, curveOpts };
  }
  function _legacyHelperEquat(Fp4, a4, b6) {
    function weierstrassEquation(x4) {
      const x22 = Fp4.sqr(x4);
      const x32 = Fp4.mul(x22, x4);
      return Fp4.add(Fp4.add(x32, Fp4.mul(x4, a4)), b6);
    }
    return weierstrassEquation;
  }
  function _weierstrass_new_output_to_legacy(c2, Point) {
    const { Fp: Fp4, Fn: Fn2 } = Point;
    function isWithinCurveOrder(num) {
      return inRange(num, _1n4, Fn2.ORDER);
    }
    const weierstrassEquation = _legacyHelperEquat(Fp4, c2.a, c2.b);
    return Object.assign({}, {
      CURVE: c2,
      Point,
      ProjectivePoint: Point,
      normPrivateKeyToScalar: (key) => _normFnElement(Fn2, key),
      weierstrassEquation,
      isWithinCurveOrder
    });
  }

  // node_modules/@noble/curves/esm/abstract/bls.js
  var _0n5 = BigInt(0);
  var _1n5 = BigInt(1);
  var _2n3 = BigInt(2);
  var _3n3 = BigInt(3);
  function NAfDecomposition(a4) {
    const res = [];
    for (; a4 > _1n5; a4 >>= _1n5) {
      if ((a4 & _1n5) === _0n5)
        res.unshift(0);
      else if ((a4 & _3n3) === _3n3) {
        res.unshift(-1);
        a4 += _1n5;
      } else
        res.unshift(1);
    }
    return res;
  }
  function aNonEmpty(arr) {
    if (!Array.isArray(arr) || arr.length === 0)
      throw new Error("expected non-empty array");
  }
  function createBlsPairing(fields, G1, G22, params) {
    const { Fp2: Fp22, Fp12: Fp122 } = fields;
    const { twistType, ateLoopSize, xNegative, postPrecompute } = params;
    let lineFunction;
    if (twistType === "multiplicative") {
      lineFunction = (c0, c1, c2, f4, Px, Py) => Fp122.mul014(f4, c0, Fp22.mul(c1, Px), Fp22.mul(c2, Py));
    } else if (twistType === "divisive") {
      lineFunction = (c0, c1, c2, f4, Px, Py) => Fp122.mul034(f4, Fp22.mul(c2, Py), Fp22.mul(c1, Px), c0);
    } else
      throw new Error("bls: unknown twist type");
    const Fp2div2 = Fp22.div(Fp22.ONE, Fp22.mul(Fp22.ONE, _2n3));
    function pointDouble(ell, Rx, Ry, Rz) {
      const t0 = Fp22.sqr(Ry);
      const t1 = Fp22.sqr(Rz);
      const t2 = Fp22.mulByB(Fp22.mul(t1, _3n3));
      const t3 = Fp22.mul(t2, _3n3);
      const t4 = Fp22.sub(Fp22.sub(Fp22.sqr(Fp22.add(Ry, Rz)), t1), t0);
      const c0 = Fp22.sub(t2, t0);
      const c1 = Fp22.mul(Fp22.sqr(Rx), _3n3);
      const c2 = Fp22.neg(t4);
      ell.push([c0, c1, c2]);
      Rx = Fp22.mul(Fp22.mul(Fp22.mul(Fp22.sub(t0, t3), Rx), Ry), Fp2div2);
      Ry = Fp22.sub(Fp22.sqr(Fp22.mul(Fp22.add(t0, t3), Fp2div2)), Fp22.mul(Fp22.sqr(t2), _3n3));
      Rz = Fp22.mul(t0, t4);
      return { Rx, Ry, Rz };
    }
    function pointAdd(ell, Rx, Ry, Rz, Qx, Qy) {
      const t0 = Fp22.sub(Ry, Fp22.mul(Qy, Rz));
      const t1 = Fp22.sub(Rx, Fp22.mul(Qx, Rz));
      const c0 = Fp22.sub(Fp22.mul(t0, Qx), Fp22.mul(t1, Qy));
      const c1 = Fp22.neg(t0);
      const c2 = t1;
      ell.push([c0, c1, c2]);
      const t2 = Fp22.sqr(t1);
      const t3 = Fp22.mul(t2, t1);
      const t4 = Fp22.mul(t2, Rx);
      const t5 = Fp22.add(Fp22.sub(t3, Fp22.mul(t4, _2n3)), Fp22.mul(Fp22.sqr(t0), Rz));
      Rx = Fp22.mul(t1, t5);
      Ry = Fp22.sub(Fp22.mul(Fp22.sub(t4, t5), t0), Fp22.mul(t3, Ry));
      Rz = Fp22.mul(Rz, t3);
      return { Rx, Ry, Rz };
    }
    const ATE_NAF = NAfDecomposition(ateLoopSize);
    const calcPairingPrecomputes = memoized((point) => {
      const p4 = point;
      const { x: x4, y: y4 } = p4.toAffine();
      const Qx = x4, Qy = y4, negQy = Fp22.neg(y4);
      let Rx = Qx, Ry = Qy, Rz = Fp22.ONE;
      const ell = [];
      for (const bit of ATE_NAF) {
        const cur = [];
        ({ Rx, Ry, Rz } = pointDouble(cur, Rx, Ry, Rz));
        if (bit)
          ({ Rx, Ry, Rz } = pointAdd(cur, Rx, Ry, Rz, Qx, bit === -1 ? negQy : Qy));
        ell.push(cur);
      }
      if (postPrecompute) {
        const last = ell[ell.length - 1];
        postPrecompute(Rx, Ry, Rz, Qx, Qy, pointAdd.bind(null, last));
      }
      return ell;
    });
    function millerLoopBatch(pairs, withFinalExponent = false) {
      let f12 = Fp122.ONE;
      if (pairs.length) {
        const ellLen = pairs[0][0].length;
        for (let i = 0; i < ellLen; i++) {
          f12 = Fp122.sqr(f12);
          for (const [ell, Px, Py] of pairs) {
            for (const [c0, c1, c2] of ell[i])
              f12 = lineFunction(c0, c1, c2, f12, Px, Py);
          }
        }
      }
      if (xNegative)
        f12 = Fp122.conjugate(f12);
      return withFinalExponent ? Fp122.finalExponentiate(f12) : f12;
    }
    function pairingBatch(pairs, withFinalExponent = true) {
      const res = [];
      normalizeZ(G1, pairs.map(({ g1 }) => g1));
      normalizeZ(G22, pairs.map(({ g2: g22 }) => g22));
      for (const { g1, g2: g22 } of pairs) {
        if (g1.is0() || g22.is0())
          throw new Error("pairing is not available for ZERO point");
        g1.assertValidity();
        g22.assertValidity();
        const Qa = g1.toAffine();
        res.push([calcPairingPrecomputes(g22), Qa.x, Qa.y]);
      }
      return millerLoopBatch(res, withFinalExponent);
    }
    function pairing(Q3, P4, withFinalExponent = true) {
      return pairingBatch([{ g1: Q3, g2: P4 }], withFinalExponent);
    }
    return {
      Fp12: Fp122,
      // NOTE: we re-export Fp12 here because pairing results are Fp12!
      millerLoopBatch,
      pairing,
      pairingBatch,
      calcPairingPrecomputes
    };
  }
  function createBlsSig(blsPairing, PubCurve, SigCurve, SignatureCoder, isSigG1) {
    const { Fp12: Fp122, pairingBatch } = blsPairing;
    function normPub(point) {
      return point instanceof PubCurve.Point ? point : PubCurve.Point.fromHex(point);
    }
    function normSig(point) {
      return point instanceof SigCurve.Point ? point : SigCurve.Point.fromHex(point);
    }
    function amsg(m4) {
      if (!(m4 instanceof SigCurve.Point))
        throw new Error(`expected valid message hashed to ${!isSigG1 ? "G2" : "G1"} curve`);
      return m4;
    }
    const pair = !isSigG1 ? (a4, b6) => ({ g1: a4, g2: b6 }) : (a4, b6) => ({ g1: b6, g2: a4 });
    return {
      // P = pk x G
      getPublicKey(secretKey) {
        const sec = _normFnElement(PubCurve.Point.Fn, secretKey);
        return PubCurve.Point.BASE.multiply(sec);
      },
      // S = pk x H(m)
      sign(message, secretKey, unusedArg) {
        if (unusedArg != null)
          throw new Error("sign() expects 2 arguments");
        const sec = _normFnElement(PubCurve.Point.Fn, secretKey);
        amsg(message).assertValidity();
        return message.multiply(sec);
      },
      // Checks if pairing of public key & hash is equal to pairing of generator & signature.
      // e(P, H(m)) == e(G, S)
      // e(S, G) == e(H(m), P)
      verify(signature, message, publicKey, unusedArg) {
        if (unusedArg != null)
          throw new Error("verify() expects 3 arguments");
        signature = normSig(signature);
        publicKey = normPub(publicKey);
        const P4 = publicKey.negate();
        const G4 = PubCurve.Point.BASE;
        const Hm = amsg(message);
        const S4 = signature;
        const exp = pairingBatch([pair(P4, Hm), pair(G4, S4)]);
        return Fp122.eql(exp, Fp122.ONE);
      },
      // https://ethresear.ch/t/fast-verification-of-multiple-bls-signatures/5407
      // e(G, S) = e(G, SUM(n)(Si)) = MUL(n)(e(G, Si))
      // TODO: maybe `{message: G2Hex, publicKey: G1Hex}[]` instead?
      verifyBatch(signature, messages, publicKeys) {
        aNonEmpty(messages);
        if (publicKeys.length !== messages.length)
          throw new Error("amount of public keys and messages should be equal");
        const sig = normSig(signature);
        const nMessages = messages;
        const nPublicKeys = publicKeys.map(normPub);
        const messagePubKeyMap = /* @__PURE__ */ new Map();
        for (let i = 0; i < nPublicKeys.length; i++) {
          const pub = nPublicKeys[i];
          const msg = nMessages[i];
          let keys = messagePubKeyMap.get(msg);
          if (keys === void 0) {
            keys = [];
            messagePubKeyMap.set(msg, keys);
          }
          keys.push(pub);
        }
        const paired = [];
        const G4 = PubCurve.Point.BASE;
        try {
          for (const [msg, keys] of messagePubKeyMap) {
            const groupPublicKey = keys.reduce((acc, msg2) => acc.add(msg2));
            paired.push(pair(groupPublicKey, msg));
          }
          paired.push(pair(G4.negate(), sig));
          return Fp122.eql(pairingBatch(paired), Fp122.ONE);
        } catch {
          return false;
        }
      },
      // Adds a bunch of public key points together.
      // pk1 + pk2 + pk3 = pkA
      aggregatePublicKeys(publicKeys) {
        aNonEmpty(publicKeys);
        publicKeys = publicKeys.map((pub) => normPub(pub));
        const agg = publicKeys.reduce((sum, p4) => sum.add(p4), PubCurve.Point.ZERO);
        agg.assertValidity();
        return agg;
      },
      // Adds a bunch of signature points together.
      // pk1 + pk2 + pk3 = pkA
      aggregateSignatures(signatures) {
        aNonEmpty(signatures);
        signatures = signatures.map((sig) => normSig(sig));
        const agg = signatures.reduce((sum, s3) => sum.add(s3), SigCurve.Point.ZERO);
        agg.assertValidity();
        return agg;
      },
      hash(messageBytes, DST) {
        abytes(messageBytes);
        const opts = DST ? { DST } : void 0;
        return SigCurve.hashToCurve(messageBytes, opts);
      },
      Signature: SignatureCoder
    };
  }
  function bls(CURVE) {
    const { Fp: Fp4, Fr: Fr2, Fp2: Fp22, Fp6: Fp62, Fp12: Fp122 } = CURVE.fields;
    const G1_ = weierstrassPoints(CURVE.G1);
    const G1 = Object.assign(G1_, createHasher2(G1_.Point, CURVE.G1.mapToCurve, {
      ...CURVE.htfDefaults,
      ...CURVE.G1.htfDefaults
    }));
    const G2_ = weierstrassPoints(CURVE.G2);
    const G22 = Object.assign(G2_, createHasher2(G2_.Point, CURVE.G2.mapToCurve, {
      ...CURVE.htfDefaults,
      ...CURVE.G2.htfDefaults
    }));
    const pairingRes = createBlsPairing(CURVE.fields, G1.Point, G22.Point, {
      ...CURVE.params,
      postPrecompute: CURVE.postPrecompute
    });
    const { millerLoopBatch, pairing, pairingBatch, calcPairingPrecomputes } = pairingRes;
    const longSignatures = createBlsSig(pairingRes, G1, G22, CURVE.G2.Signature, false);
    const shortSignatures = createBlsSig(pairingRes, G22, G1, CURVE.G1.ShortSignature, true);
    const rand = CURVE.randomBytes || randomBytes;
    const randomSecretKey = () => {
      const length = getMinHashLength(Fr2.ORDER);
      return mapHashToField(rand(length), Fr2.ORDER);
    };
    const utils = {
      randomSecretKey,
      randomPrivateKey: randomSecretKey,
      calcPairingPrecomputes
    };
    const { ShortSignature } = CURVE.G1;
    const { Signature } = CURVE.G2;
    function normP1Hash(point, htfOpts) {
      return point instanceof G1.Point ? point : shortSignatures.hash(ensureBytes("point", point), htfOpts?.DST);
    }
    function normP2Hash(point, htfOpts) {
      return point instanceof G22.Point ? point : longSignatures.hash(ensureBytes("point", point), htfOpts?.DST);
    }
    function getPublicKey(privateKey) {
      return longSignatures.getPublicKey(privateKey).toBytes(true);
    }
    function getPublicKeyForShortSignatures(privateKey) {
      return shortSignatures.getPublicKey(privateKey).toBytes(true);
    }
    function sign(message, privateKey, htfOpts) {
      const Hm = normP2Hash(message, htfOpts);
      const S4 = longSignatures.sign(Hm, privateKey);
      return message instanceof G22.Point ? S4 : Signature.toBytes(S4);
    }
    function signShortSignature(message, privateKey, htfOpts) {
      const Hm = normP1Hash(message, htfOpts);
      const S4 = shortSignatures.sign(Hm, privateKey);
      return message instanceof G1.Point ? S4 : ShortSignature.toBytes(S4);
    }
    function verify(signature, message, publicKey, htfOpts) {
      const Hm = normP2Hash(message, htfOpts);
      return longSignatures.verify(signature, Hm, publicKey);
    }
    function verifyShortSignature(signature, message, publicKey, htfOpts) {
      const Hm = normP1Hash(message, htfOpts);
      return shortSignatures.verify(signature, Hm, publicKey);
    }
    function aggregatePublicKeys(publicKeys) {
      const agg = longSignatures.aggregatePublicKeys(publicKeys);
      return publicKeys[0] instanceof G1.Point ? agg : agg.toBytes(true);
    }
    function aggregateSignatures(signatures) {
      const agg = longSignatures.aggregateSignatures(signatures);
      return signatures[0] instanceof G22.Point ? agg : Signature.toBytes(agg);
    }
    function aggregateShortSignatures(signatures) {
      const agg = shortSignatures.aggregateSignatures(signatures);
      return signatures[0] instanceof G1.Point ? agg : ShortSignature.toBytes(agg);
    }
    function verifyBatch(signature, messages, publicKeys, htfOpts) {
      const Hm = messages.map((m4) => normP2Hash(m4, htfOpts));
      return longSignatures.verifyBatch(signature, Hm, publicKeys);
    }
    G1.Point.BASE.precompute(4);
    return {
      longSignatures,
      shortSignatures,
      millerLoopBatch,
      pairing,
      pairingBatch,
      verifyBatch,
      fields: {
        Fr: Fr2,
        Fp: Fp4,
        Fp2: Fp22,
        Fp6: Fp62,
        Fp12: Fp122
      },
      params: {
        ateLoopSize: CURVE.params.ateLoopSize,
        twistType: CURVE.params.twistType,
        // deprecated
        r: CURVE.params.r,
        G1b: CURVE.G1.b,
        G2b: CURVE.G2.b
      },
      utils,
      // deprecated
      getPublicKey,
      getPublicKeyForShortSignatures,
      sign,
      signShortSignature,
      verify,
      verifyShortSignature,
      aggregatePublicKeys,
      aggregateSignatures,
      aggregateShortSignatures,
      G1,
      G2: G22,
      Signature,
      ShortSignature
    };
  }

  // node_modules/@noble/curves/esm/abstract/tower.js
  var _0n6 = BigInt(0);
  var _1n6 = BigInt(1);
  var _2n4 = BigInt(2);
  var _3n4 = BigInt(3);
  function calcFrobeniusCoefficients(Fp4, nonResidue, modulus, degree, num = 1, divisor) {
    const _divisor = BigInt(divisor === void 0 ? degree : divisor);
    const towerModulus = modulus ** BigInt(degree);
    const res = [];
    for (let i = 0; i < num; i++) {
      const a4 = BigInt(i + 1);
      const powers = [];
      for (let j5 = 0, qPower = _1n6; j5 < degree; j5++) {
        const power = (a4 * qPower - a4) / _divisor % towerModulus;
        powers.push(Fp4.pow(nonResidue, power));
        qPower *= modulus;
      }
      res.push(powers);
    }
    return res;
  }
  function psiFrobenius(Fp4, Fp22, base) {
    const PSI_X = Fp22.pow(base, (Fp4.ORDER - _1n6) / _3n4);
    const PSI_Y = Fp22.pow(base, (Fp4.ORDER - _1n6) / _2n4);
    function psi(x4, y4) {
      const x22 = Fp22.mul(Fp22.frobeniusMap(x4, 1), PSI_X);
      const y22 = Fp22.mul(Fp22.frobeniusMap(y4, 1), PSI_Y);
      return [x22, y22];
    }
    const PSI2_X = Fp22.pow(base, (Fp4.ORDER ** _2n4 - _1n6) / _3n4);
    const PSI2_Y = Fp22.pow(base, (Fp4.ORDER ** _2n4 - _1n6) / _2n4);
    if (!Fp22.eql(PSI2_Y, Fp22.neg(Fp22.ONE)))
      throw new Error("psiFrobenius: PSI2_Y!==-1");
    function psi2(x4, y4) {
      return [Fp22.mul(x4, PSI2_X), Fp22.neg(y4)];
    }
    const mapAffine = (fn) => (c2, P4) => {
      const affine = P4.toAffine();
      const p4 = fn(affine.x, affine.y);
      return c2.fromAffine({ x: p4[0], y: p4[1] });
    };
    const G2psi3 = mapAffine(psi);
    const G2psi22 = mapAffine(psi2);
    return { psi, psi2, G2psi: G2psi3, G2psi2: G2psi22, PSI_X, PSI_Y, PSI2_X, PSI2_Y };
  }
  var Fp2fromBigTuple = (Fp4, tuple2) => {
    if (tuple2.length !== 2)
      throw new Error("invalid tuple");
    const fps = tuple2.map((n) => Fp4.create(n));
    return { c0: fps[0], c1: fps[1] };
  };
  var _Field2 = class {
    constructor(Fp4, opts = {}) {
      this.MASK = _1n6;
      const ORDER = Fp4.ORDER;
      const FP2_ORDER = ORDER * ORDER;
      this.Fp = Fp4;
      this.ORDER = FP2_ORDER;
      this.BITS = bitLen(FP2_ORDER);
      this.BYTES = Math.ceil(bitLen(FP2_ORDER) / 8);
      this.isLE = Fp4.isLE;
      this.ZERO = { c0: Fp4.ZERO, c1: Fp4.ZERO };
      this.ONE = { c0: Fp4.ONE, c1: Fp4.ZERO };
      this.Fp_NONRESIDUE = Fp4.create(opts.NONRESIDUE || BigInt(-1));
      this.Fp_div2 = Fp4.div(Fp4.ONE, _2n4);
      this.NONRESIDUE = Fp2fromBigTuple(Fp4, opts.FP2_NONRESIDUE);
      this.FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp4, this.Fp_NONRESIDUE, Fp4.ORDER, 2)[0];
      this.mulByB = opts.Fp2mulByB;
      Object.seal(this);
    }
    fromBigTuple(tuple2) {
      return Fp2fromBigTuple(this.Fp, tuple2);
    }
    create(num) {
      return num;
    }
    isValid({ c0, c1 }) {
      function isValidC(num, ORDER) {
        return typeof num === "bigint" && _0n6 <= num && num < ORDER;
      }
      return isValidC(c0, this.ORDER) && isValidC(c1, this.ORDER);
    }
    is0({ c0, c1 }) {
      return this.Fp.is0(c0) && this.Fp.is0(c1);
    }
    isValidNot0(num) {
      return !this.is0(num) && this.isValid(num);
    }
    eql({ c0, c1 }, { c0: r0, c1: r1 }) {
      return this.Fp.eql(c0, r0) && this.Fp.eql(c1, r1);
    }
    neg({ c0, c1 }) {
      return { c0: this.Fp.neg(c0), c1: this.Fp.neg(c1) };
    }
    pow(num, power) {
      return FpPow(this, num, power);
    }
    invertBatch(nums) {
      return FpInvertBatch(this, nums);
    }
    // Normalized
    add(f1, f22) {
      const { c0, c1 } = f1;
      const { c0: r0, c1: r1 } = f22;
      return {
        c0: this.Fp.add(c0, r0),
        c1: this.Fp.add(c1, r1)
      };
    }
    sub({ c0, c1 }, { c0: r0, c1: r1 }) {
      return {
        c0: this.Fp.sub(c0, r0),
        c1: this.Fp.sub(c1, r1)
      };
    }
    mul({ c0, c1 }, rhs) {
      const { Fp: Fp4 } = this;
      if (typeof rhs === "bigint")
        return { c0: Fp4.mul(c0, rhs), c1: Fp4.mul(c1, rhs) };
      const { c0: r0, c1: r1 } = rhs;
      let t1 = Fp4.mul(c0, r0);
      let t2 = Fp4.mul(c1, r1);
      const o0 = Fp4.sub(t1, t2);
      const o1 = Fp4.sub(Fp4.mul(Fp4.add(c0, c1), Fp4.add(r0, r1)), Fp4.add(t1, t2));
      return { c0: o0, c1: o1 };
    }
    sqr({ c0, c1 }) {
      const { Fp: Fp4 } = this;
      const a4 = Fp4.add(c0, c1);
      const b6 = Fp4.sub(c0, c1);
      const c2 = Fp4.add(c0, c0);
      return { c0: Fp4.mul(a4, b6), c1: Fp4.mul(c2, c1) };
    }
    // NonNormalized stuff
    addN(a4, b6) {
      return this.add(a4, b6);
    }
    subN(a4, b6) {
      return this.sub(a4, b6);
    }
    mulN(a4, b6) {
      return this.mul(a4, b6);
    }
    sqrN(a4) {
      return this.sqr(a4);
    }
    // Why inversion for bigint inside Fp instead of Fp2? it is even used in that context?
    div(lhs, rhs) {
      const { Fp: Fp4 } = this;
      return this.mul(lhs, typeof rhs === "bigint" ? Fp4.inv(Fp4.create(rhs)) : this.inv(rhs));
    }
    inv({ c0: a4, c1: b6 }) {
      const { Fp: Fp4 } = this;
      const factor = Fp4.inv(Fp4.create(a4 * a4 + b6 * b6));
      return { c0: Fp4.mul(factor, Fp4.create(a4)), c1: Fp4.mul(factor, Fp4.create(-b6)) };
    }
    sqrt(num) {
      const { Fp: Fp4 } = this;
      const Fp22 = this;
      const { c0, c1 } = num;
      if (Fp4.is0(c1)) {
        if (FpLegendre(Fp4, c0) === 1)
          return Fp22.create({ c0: Fp4.sqrt(c0), c1: Fp4.ZERO });
        else
          return Fp22.create({ c0: Fp4.ZERO, c1: Fp4.sqrt(Fp4.div(c0, this.Fp_NONRESIDUE)) });
      }
      const a4 = Fp4.sqrt(Fp4.sub(Fp4.sqr(c0), Fp4.mul(Fp4.sqr(c1), this.Fp_NONRESIDUE)));
      let d4 = Fp4.mul(Fp4.add(a4, c0), this.Fp_div2);
      const legendre = FpLegendre(Fp4, d4);
      if (legendre === -1)
        d4 = Fp4.sub(d4, a4);
      const a0 = Fp4.sqrt(d4);
      const candidateSqrt = Fp22.create({ c0: a0, c1: Fp4.div(Fp4.mul(c1, this.Fp_div2), a0) });
      if (!Fp22.eql(Fp22.sqr(candidateSqrt), num))
        throw new Error("Cannot find square root");
      const x1 = candidateSqrt;
      const x22 = Fp22.neg(x1);
      const { re: re1, im: im1 } = Fp22.reim(x1);
      const { re: re2, im: im2 } = Fp22.reim(x22);
      if (im1 > im2 || im1 === im2 && re1 > re2)
        return x1;
      return x22;
    }
    // Same as sgn0_m_eq_2 in RFC 9380
    isOdd(x4) {
      const { re: x0, im: x1 } = this.reim(x4);
      const sign_0 = x0 % _2n4;
      const zero_0 = x0 === _0n6;
      const sign_1 = x1 % _2n4;
      return BigInt(sign_0 || zero_0 && sign_1) == _1n6;
    }
    // Bytes util
    fromBytes(b6) {
      const { Fp: Fp4 } = this;
      if (b6.length !== this.BYTES)
        throw new Error("fromBytes invalid length=" + b6.length);
      return { c0: Fp4.fromBytes(b6.subarray(0, Fp4.BYTES)), c1: Fp4.fromBytes(b6.subarray(Fp4.BYTES)) };
    }
    toBytes({ c0, c1 }) {
      return concatBytes(this.Fp.toBytes(c0), this.Fp.toBytes(c1));
    }
    cmov({ c0, c1 }, { c0: r0, c1: r1 }, c2) {
      return {
        c0: this.Fp.cmov(c0, r0, c2),
        c1: this.Fp.cmov(c1, r1, c2)
      };
    }
    reim({ c0, c1 }) {
      return { re: c0, im: c1 };
    }
    Fp4Square(a4, b6) {
      const Fp22 = this;
      const a22 = Fp22.sqr(a4);
      const b22 = Fp22.sqr(b6);
      return {
        first: Fp22.add(Fp22.mulByNonresidue(b22), a22),
        // b² * Nonresidue + a²
        second: Fp22.sub(Fp22.sub(Fp22.sqr(Fp22.add(a4, b6)), a22), b22)
        // (a + b)² - a² - b²
      };
    }
    // multiply by u + 1
    mulByNonresidue({ c0, c1 }) {
      return this.mul({ c0, c1 }, this.NONRESIDUE);
    }
    frobeniusMap({ c0, c1 }, power) {
      return {
        c0,
        c1: this.Fp.mul(c1, this.FROBENIUS_COEFFICIENTS[power % 2])
      };
    }
  };
  var _Field6 = class {
    constructor(Fp22) {
      this.MASK = _1n6;
      this.Fp2 = Fp22;
      this.ORDER = Fp22.ORDER;
      this.BITS = 3 * Fp22.BITS;
      this.BYTES = 3 * Fp22.BYTES;
      this.isLE = Fp22.isLE;
      this.ZERO = { c0: Fp22.ZERO, c1: Fp22.ZERO, c2: Fp22.ZERO };
      this.ONE = { c0: Fp22.ONE, c1: Fp22.ZERO, c2: Fp22.ZERO };
      const { Fp: Fp4 } = Fp22;
      const frob = calcFrobeniusCoefficients(Fp22, Fp22.NONRESIDUE, Fp4.ORDER, 6, 2, 3);
      this.FROBENIUS_COEFFICIENTS_1 = frob[0];
      this.FROBENIUS_COEFFICIENTS_2 = frob[1];
      Object.seal(this);
    }
    add({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
      const { Fp2: Fp22 } = this;
      return {
        c0: Fp22.add(c0, r0),
        c1: Fp22.add(c1, r1),
        c2: Fp22.add(c2, r2)
      };
    }
    sub({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
      const { Fp2: Fp22 } = this;
      return {
        c0: Fp22.sub(c0, r0),
        c1: Fp22.sub(c1, r1),
        c2: Fp22.sub(c2, r2)
      };
    }
    mul({ c0, c1, c2 }, rhs) {
      const { Fp2: Fp22 } = this;
      if (typeof rhs === "bigint") {
        return {
          c0: Fp22.mul(c0, rhs),
          c1: Fp22.mul(c1, rhs),
          c2: Fp22.mul(c2, rhs)
        };
      }
      const { c0: r0, c1: r1, c2: r2 } = rhs;
      const t0 = Fp22.mul(c0, r0);
      const t1 = Fp22.mul(c1, r1);
      const t2 = Fp22.mul(c2, r2);
      return {
        // t0 + (c1 + c2) * (r1 * r2) - (T1 + T2) * (u + 1)
        c0: Fp22.add(t0, Fp22.mulByNonresidue(Fp22.sub(Fp22.mul(Fp22.add(c1, c2), Fp22.add(r1, r2)), Fp22.add(t1, t2)))),
        // (c0 + c1) * (r0 + r1) - (T0 + T1) + T2 * (u + 1)
        c1: Fp22.add(Fp22.sub(Fp22.mul(Fp22.add(c0, c1), Fp22.add(r0, r1)), Fp22.add(t0, t1)), Fp22.mulByNonresidue(t2)),
        // T1 + (c0 + c2) * (r0 + r2) - T0 + T2
        c2: Fp22.sub(Fp22.add(t1, Fp22.mul(Fp22.add(c0, c2), Fp22.add(r0, r2))), Fp22.add(t0, t2))
      };
    }
    sqr({ c0, c1, c2 }) {
      const { Fp2: Fp22 } = this;
      let t0 = Fp22.sqr(c0);
      let t1 = Fp22.mul(Fp22.mul(c0, c1), _2n4);
      let t3 = Fp22.mul(Fp22.mul(c1, c2), _2n4);
      let t4 = Fp22.sqr(c2);
      return {
        c0: Fp22.add(Fp22.mulByNonresidue(t3), t0),
        // T3 * (u + 1) + T0
        c1: Fp22.add(Fp22.mulByNonresidue(t4), t1),
        // T4 * (u + 1) + T1
        // T1 + (c0 - c1 + c2)² + T3 - T0 - T4
        c2: Fp22.sub(Fp22.sub(Fp22.add(Fp22.add(t1, Fp22.sqr(Fp22.add(Fp22.sub(c0, c1), c2))), t3), t0), t4)
      };
    }
    addN(a4, b6) {
      return this.add(a4, b6);
    }
    subN(a4, b6) {
      return this.sub(a4, b6);
    }
    mulN(a4, b6) {
      return this.mul(a4, b6);
    }
    sqrN(a4) {
      return this.sqr(a4);
    }
    create(num) {
      return num;
    }
    isValid({ c0, c1, c2 }) {
      const { Fp2: Fp22 } = this;
      return Fp22.isValid(c0) && Fp22.isValid(c1) && Fp22.isValid(c2);
    }
    is0({ c0, c1, c2 }) {
      const { Fp2: Fp22 } = this;
      return Fp22.is0(c0) && Fp22.is0(c1) && Fp22.is0(c2);
    }
    isValidNot0(num) {
      return !this.is0(num) && this.isValid(num);
    }
    neg({ c0, c1, c2 }) {
      const { Fp2: Fp22 } = this;
      return { c0: Fp22.neg(c0), c1: Fp22.neg(c1), c2: Fp22.neg(c2) };
    }
    eql({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
      const { Fp2: Fp22 } = this;
      return Fp22.eql(c0, r0) && Fp22.eql(c1, r1) && Fp22.eql(c2, r2);
    }
    sqrt(_5) {
      return notImplemented();
    }
    // Do we need division by bigint at all? Should be done via order:
    div(lhs, rhs) {
      const { Fp2: Fp22 } = this;
      const { Fp: Fp4 } = Fp22;
      return this.mul(lhs, typeof rhs === "bigint" ? Fp4.inv(Fp4.create(rhs)) : this.inv(rhs));
    }
    pow(num, power) {
      return FpPow(this, num, power);
    }
    invertBatch(nums) {
      return FpInvertBatch(this, nums);
    }
    inv({ c0, c1, c2 }) {
      const { Fp2: Fp22 } = this;
      let t0 = Fp22.sub(Fp22.sqr(c0), Fp22.mulByNonresidue(Fp22.mul(c2, c1)));
      let t1 = Fp22.sub(Fp22.mulByNonresidue(Fp22.sqr(c2)), Fp22.mul(c0, c1));
      let t2 = Fp22.sub(Fp22.sqr(c1), Fp22.mul(c0, c2));
      let t4 = Fp22.inv(Fp22.add(Fp22.mulByNonresidue(Fp22.add(Fp22.mul(c2, t1), Fp22.mul(c1, t2))), Fp22.mul(c0, t0)));
      return { c0: Fp22.mul(t4, t0), c1: Fp22.mul(t4, t1), c2: Fp22.mul(t4, t2) };
    }
    // Bytes utils
    fromBytes(b6) {
      const { Fp2: Fp22 } = this;
      if (b6.length !== this.BYTES)
        throw new Error("fromBytes invalid length=" + b6.length);
      const B22 = Fp22.BYTES;
      return {
        c0: Fp22.fromBytes(b6.subarray(0, B22)),
        c1: Fp22.fromBytes(b6.subarray(B22, B22 * 2)),
        c2: Fp22.fromBytes(b6.subarray(2 * B22))
      };
    }
    toBytes({ c0, c1, c2 }) {
      const { Fp2: Fp22 } = this;
      return concatBytes(Fp22.toBytes(c0), Fp22.toBytes(c1), Fp22.toBytes(c2));
    }
    cmov({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }, c3) {
      const { Fp2: Fp22 } = this;
      return {
        c0: Fp22.cmov(c0, r0, c3),
        c1: Fp22.cmov(c1, r1, c3),
        c2: Fp22.cmov(c2, r2, c3)
      };
    }
    fromBigSix(t) {
      const { Fp2: Fp22 } = this;
      if (!Array.isArray(t) || t.length !== 6)
        throw new Error("invalid Fp6 usage");
      return {
        c0: Fp22.fromBigTuple(t.slice(0, 2)),
        c1: Fp22.fromBigTuple(t.slice(2, 4)),
        c2: Fp22.fromBigTuple(t.slice(4, 6))
      };
    }
    frobeniusMap({ c0, c1, c2 }, power) {
      const { Fp2: Fp22 } = this;
      return {
        c0: Fp22.frobeniusMap(c0, power),
        c1: Fp22.mul(Fp22.frobeniusMap(c1, power), this.FROBENIUS_COEFFICIENTS_1[power % 6]),
        c2: Fp22.mul(Fp22.frobeniusMap(c2, power), this.FROBENIUS_COEFFICIENTS_2[power % 6])
      };
    }
    mulByFp2({ c0, c1, c2 }, rhs) {
      const { Fp2: Fp22 } = this;
      return {
        c0: Fp22.mul(c0, rhs),
        c1: Fp22.mul(c1, rhs),
        c2: Fp22.mul(c2, rhs)
      };
    }
    mulByNonresidue({ c0, c1, c2 }) {
      const { Fp2: Fp22 } = this;
      return { c0: Fp22.mulByNonresidue(c2), c1: c0, c2: c1 };
    }
    // Sparse multiplication
    mul1({ c0, c1, c2 }, b1) {
      const { Fp2: Fp22 } = this;
      return {
        c0: Fp22.mulByNonresidue(Fp22.mul(c2, b1)),
        c1: Fp22.mul(c0, b1),
        c2: Fp22.mul(c1, b1)
      };
    }
    // Sparse multiplication
    mul01({ c0, c1, c2 }, b0, b1) {
      const { Fp2: Fp22 } = this;
      let t0 = Fp22.mul(c0, b0);
      let t1 = Fp22.mul(c1, b1);
      return {
        // ((c1 + c2) * b1 - T1) * (u + 1) + T0
        c0: Fp22.add(Fp22.mulByNonresidue(Fp22.sub(Fp22.mul(Fp22.add(c1, c2), b1), t1)), t0),
        // (b0 + b1) * (c0 + c1) - T0 - T1
        c1: Fp22.sub(Fp22.sub(Fp22.mul(Fp22.add(b0, b1), Fp22.add(c0, c1)), t0), t1),
        // (c0 + c2) * b0 - T0 + T1
        c2: Fp22.add(Fp22.sub(Fp22.mul(Fp22.add(c0, c2), b0), t0), t1)
      };
    }
  };
  var _Field12 = class {
    constructor(Fp62, opts) {
      this.MASK = _1n6;
      const { Fp2: Fp22 } = Fp62;
      const { Fp: Fp4 } = Fp22;
      this.Fp6 = Fp62;
      this.ORDER = Fp22.ORDER;
      this.BITS = 2 * Fp62.BITS;
      this.BYTES = 2 * Fp62.BYTES;
      this.isLE = Fp62.isLE;
      this.ZERO = { c0: Fp62.ZERO, c1: Fp62.ZERO };
      this.ONE = { c0: Fp62.ONE, c1: Fp62.ZERO };
      this.FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp22, Fp22.NONRESIDUE, Fp4.ORDER, 12, 1, 6)[0];
      this.X_LEN = opts.X_LEN;
      this.finalExponentiate = opts.Fp12finalExponentiate;
    }
    create(num) {
      return num;
    }
    isValid({ c0, c1 }) {
      const { Fp6: Fp62 } = this;
      return Fp62.isValid(c0) && Fp62.isValid(c1);
    }
    is0({ c0, c1 }) {
      const { Fp6: Fp62 } = this;
      return Fp62.is0(c0) && Fp62.is0(c1);
    }
    isValidNot0(num) {
      return !this.is0(num) && this.isValid(num);
    }
    neg({ c0, c1 }) {
      const { Fp6: Fp62 } = this;
      return { c0: Fp62.neg(c0), c1: Fp62.neg(c1) };
    }
    eql({ c0, c1 }, { c0: r0, c1: r1 }) {
      const { Fp6: Fp62 } = this;
      return Fp62.eql(c0, r0) && Fp62.eql(c1, r1);
    }
    sqrt(_5) {
      notImplemented();
    }
    inv({ c0, c1 }) {
      const { Fp6: Fp62 } = this;
      let t = Fp62.inv(Fp62.sub(Fp62.sqr(c0), Fp62.mulByNonresidue(Fp62.sqr(c1))));
      return { c0: Fp62.mul(c0, t), c1: Fp62.neg(Fp62.mul(c1, t)) };
    }
    div(lhs, rhs) {
      const { Fp6: Fp62 } = this;
      const { Fp2: Fp22 } = Fp62;
      const { Fp: Fp4 } = Fp22;
      return this.mul(lhs, typeof rhs === "bigint" ? Fp4.inv(Fp4.create(rhs)) : this.inv(rhs));
    }
    pow(num, power) {
      return FpPow(this, num, power);
    }
    invertBatch(nums) {
      return FpInvertBatch(this, nums);
    }
    // Normalized
    add({ c0, c1 }, { c0: r0, c1: r1 }) {
      const { Fp6: Fp62 } = this;
      return {
        c0: Fp62.add(c0, r0),
        c1: Fp62.add(c1, r1)
      };
    }
    sub({ c0, c1 }, { c0: r0, c1: r1 }) {
      const { Fp6: Fp62 } = this;
      return {
        c0: Fp62.sub(c0, r0),
        c1: Fp62.sub(c1, r1)
      };
    }
    mul({ c0, c1 }, rhs) {
      const { Fp6: Fp62 } = this;
      if (typeof rhs === "bigint")
        return { c0: Fp62.mul(c0, rhs), c1: Fp62.mul(c1, rhs) };
      let { c0: r0, c1: r1 } = rhs;
      let t1 = Fp62.mul(c0, r0);
      let t2 = Fp62.mul(c1, r1);
      return {
        c0: Fp62.add(t1, Fp62.mulByNonresidue(t2)),
        // T1 + T2 * v
        // (c0 + c1) * (r0 + r1) - (T1 + T2)
        c1: Fp62.sub(Fp62.mul(Fp62.add(c0, c1), Fp62.add(r0, r1)), Fp62.add(t1, t2))
      };
    }
    sqr({ c0, c1 }) {
      const { Fp6: Fp62 } = this;
      let ab = Fp62.mul(c0, c1);
      return {
        // (c1 * v + c0) * (c0 + c1) - AB - AB * v
        c0: Fp62.sub(Fp62.sub(Fp62.mul(Fp62.add(Fp62.mulByNonresidue(c1), c0), Fp62.add(c0, c1)), ab), Fp62.mulByNonresidue(ab)),
        c1: Fp62.add(ab, ab)
      };
    }
    // NonNormalized stuff
    addN(a4, b6) {
      return this.add(a4, b6);
    }
    subN(a4, b6) {
      return this.sub(a4, b6);
    }
    mulN(a4, b6) {
      return this.mul(a4, b6);
    }
    sqrN(a4) {
      return this.sqr(a4);
    }
    // Bytes utils
    fromBytes(b6) {
      const { Fp6: Fp62 } = this;
      if (b6.length !== this.BYTES)
        throw new Error("fromBytes invalid length=" + b6.length);
      return {
        c0: Fp62.fromBytes(b6.subarray(0, Fp62.BYTES)),
        c1: Fp62.fromBytes(b6.subarray(Fp62.BYTES))
      };
    }
    toBytes({ c0, c1 }) {
      const { Fp6: Fp62 } = this;
      return concatBytes(Fp62.toBytes(c0), Fp62.toBytes(c1));
    }
    cmov({ c0, c1 }, { c0: r0, c1: r1 }, c2) {
      const { Fp6: Fp62 } = this;
      return {
        c0: Fp62.cmov(c0, r0, c2),
        c1: Fp62.cmov(c1, r1, c2)
      };
    }
    // Utils
    // toString() {
    //   return '' + 'Fp12(' + this.c0 + this.c1 + '* w');
    // },
    // fromTuple(c: [Fp6, Fp6]) {
    //   return new Fp12(...c);
    // }
    fromBigTwelve(t) {
      const { Fp6: Fp62 } = this;
      return {
        c0: Fp62.fromBigSix(t.slice(0, 6)),
        c1: Fp62.fromBigSix(t.slice(6, 12))
      };
    }
    // Raises to q**i -th power
    frobeniusMap(lhs, power) {
      const { Fp6: Fp62 } = this;
      const { Fp2: Fp22 } = Fp62;
      const { c0, c1, c2 } = Fp62.frobeniusMap(lhs.c1, power);
      const coeff = this.FROBENIUS_COEFFICIENTS[power % 12];
      return {
        c0: Fp62.frobeniusMap(lhs.c0, power),
        c1: Fp62.create({
          c0: Fp22.mul(c0, coeff),
          c1: Fp22.mul(c1, coeff),
          c2: Fp22.mul(c2, coeff)
        })
      };
    }
    mulByFp2({ c0, c1 }, rhs) {
      const { Fp6: Fp62 } = this;
      return {
        c0: Fp62.mulByFp2(c0, rhs),
        c1: Fp62.mulByFp2(c1, rhs)
      };
    }
    conjugate({ c0, c1 }) {
      return { c0, c1: this.Fp6.neg(c1) };
    }
    // Sparse multiplication
    mul014({ c0, c1 }, o0, o1, o4) {
      const { Fp6: Fp62 } = this;
      const { Fp2: Fp22 } = Fp62;
      let t0 = Fp62.mul01(c0, o0, o1);
      let t1 = Fp62.mul1(c1, o4);
      return {
        c0: Fp62.add(Fp62.mulByNonresidue(t1), t0),
        // T1 * v + T0
        // (c1 + c0) * [o0, o1+o4] - T0 - T1
        c1: Fp62.sub(Fp62.sub(Fp62.mul01(Fp62.add(c1, c0), o0, Fp22.add(o1, o4)), t0), t1)
      };
    }
    mul034({ c0, c1 }, o0, o3, o4) {
      const { Fp6: Fp62 } = this;
      const { Fp2: Fp22 } = Fp62;
      const a4 = Fp62.create({
        c0: Fp22.mul(c0.c0, o0),
        c1: Fp22.mul(c0.c1, o0),
        c2: Fp22.mul(c0.c2, o0)
      });
      const b6 = Fp62.mul01(c1, o3, o4);
      const e3 = Fp62.mul01(Fp62.add(c0, c1), Fp22.add(o0, o3), o4);
      return {
        c0: Fp62.add(Fp62.mulByNonresidue(b6), a4),
        c1: Fp62.sub(e3, Fp62.add(a4, b6))
      };
    }
    // A cyclotomic group is a subgroup of Fp^n defined by
    //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
    // The result of any pairing is in a cyclotomic subgroup
    // https://eprint.iacr.org/2009/565.pdf
    // https://eprint.iacr.org/2010/354.pdf
    _cyclotomicSquare({ c0, c1 }) {
      const { Fp6: Fp62 } = this;
      const { Fp2: Fp22 } = Fp62;
      const { c0: c0c0, c1: c0c1, c2: c0c2 } = c0;
      const { c0: c1c0, c1: c1c1, c2: c1c2 } = c1;
      const { first: t3, second: t4 } = Fp22.Fp4Square(c0c0, c1c1);
      const { first: t5, second: t6 } = Fp22.Fp4Square(c1c0, c0c2);
      const { first: t7, second: t8 } = Fp22.Fp4Square(c0c1, c1c2);
      const t9 = Fp22.mulByNonresidue(t8);
      return {
        c0: Fp62.create({
          c0: Fp22.add(Fp22.mul(Fp22.sub(t3, c0c0), _2n4), t3),
          // 2 * (T3 - c0c0)  + T3
          c1: Fp22.add(Fp22.mul(Fp22.sub(t5, c0c1), _2n4), t5),
          // 2 * (T5 - c0c1)  + T5
          c2: Fp22.add(Fp22.mul(Fp22.sub(t7, c0c2), _2n4), t7)
        }),
        // 2 * (T7 - c0c2)  + T7
        c1: Fp62.create({
          c0: Fp22.add(Fp22.mul(Fp22.add(t9, c1c0), _2n4), t9),
          // 2 * (T9 + c1c0) + T9
          c1: Fp22.add(Fp22.mul(Fp22.add(t4, c1c1), _2n4), t4),
          // 2 * (T4 + c1c1) + T4
          c2: Fp22.add(Fp22.mul(Fp22.add(t6, c1c2), _2n4), t6)
        })
      };
    }
    // https://eprint.iacr.org/2009/565.pdf
    _cyclotomicExp(num, n) {
      let z4 = this.ONE;
      for (let i = this.X_LEN - 1; i >= 0; i--) {
        z4 = this._cyclotomicSquare(z4);
        if (bitGet(n, i))
          z4 = this.mul(z4, num);
      }
      return z4;
    }
  };
  function tower12(opts) {
    const Fp4 = Field(opts.ORDER);
    const Fp22 = new _Field2(Fp4, opts);
    const Fp62 = new _Field6(Fp22);
    const Fp122 = new _Field12(Fp62, opts);
    return { Fp: Fp4, Fp2: Fp22, Fp6: Fp62, Fp12: Fp122 };
  }

  // node_modules/@noble/curves/esm/bls12-381.js
  var _0n7 = BigInt(0);
  var _1n7 = BigInt(1);
  var _2n5 = BigInt(2);
  var _3n5 = BigInt(3);
  var _4n3 = BigInt(4);
  var BLS_X = BigInt("0xd201000000010000");
  var BLS_X_LEN = bitLen(BLS_X);
  var bls12_381_CURVE_G1 = {
    p: BigInt("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab"),
    n: BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001"),
    h: BigInt("0x396c8c005555e1568c00aaab0000aaab"),
    a: _0n7,
    b: _4n3,
    Gx: BigInt("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"),
    Gy: BigInt("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1")
  };
  var bls12_381_Fr = Field(bls12_381_CURVE_G1.n, {
    modFromBytes: true,
    isLE: true
  });
  var { Fp, Fp2, Fp6, Fp12 } = tower12({
    ORDER: bls12_381_CURVE_G1.p,
    X_LEN: BLS_X_LEN,
    // Finite extension field over irreducible polynominal.
    // Fp(u) / (u² - β) where β = -1
    FP2_NONRESIDUE: [_1n7, _1n7],
    Fp2mulByB: ({ c0, c1 }) => {
      const t0 = Fp.mul(c0, _4n3);
      const t1 = Fp.mul(c1, _4n3);
      return { c0: Fp.sub(t0, t1), c1: Fp.add(t0, t1) };
    },
    Fp12finalExponentiate: (num) => {
      const x4 = BLS_X;
      const t0 = Fp12.div(Fp12.frobeniusMap(num, 6), num);
      const t1 = Fp12.mul(Fp12.frobeniusMap(t0, 2), t0);
      const t2 = Fp12.conjugate(Fp12._cyclotomicExp(t1, x4));
      const t3 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicSquare(t1)), t2);
      const t4 = Fp12.conjugate(Fp12._cyclotomicExp(t3, x4));
      const t5 = Fp12.conjugate(Fp12._cyclotomicExp(t4, x4));
      const t6 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicExp(t5, x4)), Fp12._cyclotomicSquare(t2));
      const t7 = Fp12.conjugate(Fp12._cyclotomicExp(t6, x4));
      const t2_t5_pow_q2 = Fp12.frobeniusMap(Fp12.mul(t2, t5), 2);
      const t4_t1_pow_q3 = Fp12.frobeniusMap(Fp12.mul(t4, t1), 3);
      const t6_t1c_pow_q1 = Fp12.frobeniusMap(Fp12.mul(t6, Fp12.conjugate(t1)), 1);
      const t7_t3c_t1 = Fp12.mul(Fp12.mul(t7, Fp12.conjugate(t3)), t1);
      return Fp12.mul(Fp12.mul(Fp12.mul(t2_t5_pow_q2, t4_t1_pow_q3), t6_t1c_pow_q1), t7_t3c_t1);
    }
  });
  var { G2psi, G2psi2 } = psiFrobenius(Fp, Fp2, Fp2.div(Fp2.ONE, Fp2.NONRESIDUE));
  var htfDefaults = Object.freeze({
    DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
    encodeDST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
    p: Fp.ORDER,
    m: 2,
    k: 128,
    expand: "xmd",
    hash: sha256
  });
  var bls12_381_CURVE_G2 = {
    p: Fp2.ORDER,
    n: bls12_381_CURVE_G1.n,
    h: BigInt("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5"),
    a: Fp2.ZERO,
    b: Fp2.fromBigTuple([_4n3, _4n3]),
    Gx: Fp2.fromBigTuple([
      BigInt("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"),
      BigInt("0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e")
    ]),
    Gy: Fp2.fromBigTuple([
      BigInt("0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801"),
      BigInt("0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be")
    ])
  };
  var COMPZERO = setMask(Fp.toBytes(_0n7), { infinity: true, compressed: true });
  function parseMask(bytes) {
    bytes = bytes.slice();
    const mask = bytes[0] & 224;
    const compressed = !!(mask >> 7 & 1);
    const infinity = !!(mask >> 6 & 1);
    const sort = !!(mask >> 5 & 1);
    bytes[0] &= 31;
    return { compressed, infinity, sort, value: bytes };
  }
  function setMask(bytes, mask) {
    if (bytes[0] & 224)
      throw new Error("setMask: non-empty mask");
    if (mask.compressed)
      bytes[0] |= 128;
    if (mask.infinity)
      bytes[0] |= 64;
    if (mask.sort)
      bytes[0] |= 32;
    return bytes;
  }
  function pointG1ToBytes(_c, point, isComp) {
    const { BYTES: L3, ORDER: P4 } = Fp;
    const is0 = point.is0();
    const { x: x4, y: y4 } = point.toAffine();
    if (isComp) {
      if (is0)
        return COMPZERO.slice();
      const sort = Boolean(y4 * _2n5 / P4);
      return setMask(numberToBytesBE(x4, L3), { compressed: true, sort });
    } else {
      if (is0) {
        return concatBytes(Uint8Array.of(64), new Uint8Array(2 * L3 - 1));
      } else {
        return concatBytes(numberToBytesBE(x4, L3), numberToBytesBE(y4, L3));
      }
    }
  }
  function signatureG1ToBytes(point) {
    point.assertValidity();
    const { BYTES: L3, ORDER: P4 } = Fp;
    const { x: x4, y: y4 } = point.toAffine();
    if (point.is0())
      return COMPZERO.slice();
    const sort = Boolean(y4 * _2n5 / P4);
    return setMask(numberToBytesBE(x4, L3), { compressed: true, sort });
  }
  function pointG1FromBytes(bytes) {
    const { compressed, infinity, sort, value } = parseMask(bytes);
    const { BYTES: L3, ORDER: P4 } = Fp;
    if (value.length === 48 && compressed) {
      const compressedValue = bytesToNumberBE(value);
      const x4 = Fp.create(compressedValue & bitMask(Fp.BITS));
      if (infinity) {
        if (x4 !== _0n7)
          throw new Error("invalid G1 point: non-empty, at infinity, with compression");
        return { x: _0n7, y: _0n7 };
      }
      const right = Fp.add(Fp.pow(x4, _3n5), Fp.create(bls12_381_CURVE_G1.b));
      let y4 = Fp.sqrt(right);
      if (!y4)
        throw new Error("invalid G1 point: compressed point");
      if (y4 * _2n5 / P4 !== BigInt(sort))
        y4 = Fp.neg(y4);
      return { x: Fp.create(x4), y: Fp.create(y4) };
    } else if (value.length === 96 && !compressed) {
      const x4 = bytesToNumberBE(value.subarray(0, L3));
      const y4 = bytesToNumberBE(value.subarray(L3));
      if (infinity) {
        if (x4 !== _0n7 || y4 !== _0n7)
          throw new Error("G1: non-empty point at infinity");
        return bls12_381.G1.Point.ZERO.toAffine();
      }
      return { x: Fp.create(x4), y: Fp.create(y4) };
    } else {
      throw new Error("invalid G1 point: expected 48/96 bytes");
    }
  }
  function signatureG1FromBytes(hex) {
    const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex, 48));
    const P4 = Fp.ORDER;
    const Point = bls12_381.G1.Point;
    const compressedValue = bytesToNumberBE(value);
    if (infinity)
      return Point.ZERO;
    const x4 = Fp.create(compressedValue & bitMask(Fp.BITS));
    const right = Fp.add(Fp.pow(x4, _3n5), Fp.create(bls12_381_CURVE_G1.b));
    let y4 = Fp.sqrt(right);
    if (!y4)
      throw new Error("invalid G1 point: compressed");
    const aflag = BigInt(sort);
    if (y4 * _2n5 / P4 !== aflag)
      y4 = Fp.neg(y4);
    const point = Point.fromAffine({ x: x4, y: y4 });
    point.assertValidity();
    return point;
  }
  function pointG2ToBytes(_c, point, isComp) {
    const { BYTES: L3, ORDER: P4 } = Fp;
    const is0 = point.is0();
    const { x: x4, y: y4 } = point.toAffine();
    if (isComp) {
      if (is0)
        return concatBytes(COMPZERO, numberToBytesBE(_0n7, L3));
      const flag = Boolean(y4.c1 === _0n7 ? y4.c0 * _2n5 / P4 : y4.c1 * _2n5 / P4);
      return concatBytes(setMask(numberToBytesBE(x4.c1, L3), { compressed: true, sort: flag }), numberToBytesBE(x4.c0, L3));
    } else {
      if (is0)
        return concatBytes(Uint8Array.of(64), new Uint8Array(4 * L3 - 1));
      const { re: x0, im: x1 } = Fp2.reim(x4);
      const { re: y0, im: y1 } = Fp2.reim(y4);
      return concatBytes(numberToBytesBE(x1, L3), numberToBytesBE(x0, L3), numberToBytesBE(y1, L3), numberToBytesBE(y0, L3));
    }
  }
  function signatureG2ToBytes(point) {
    point.assertValidity();
    const { BYTES: L3 } = Fp;
    if (point.is0())
      return concatBytes(COMPZERO, numberToBytesBE(_0n7, L3));
    const { x: x4, y: y4 } = point.toAffine();
    const { re: x0, im: x1 } = Fp2.reim(x4);
    const { re: y0, im: y1 } = Fp2.reim(y4);
    const tmp = y1 > _0n7 ? y1 * _2n5 : y0 * _2n5;
    const sort = Boolean(tmp / Fp.ORDER & _1n7);
    const z22 = x0;
    return concatBytes(setMask(numberToBytesBE(x1, L3), { sort, compressed: true }), numberToBytesBE(z22, L3));
  }
  function pointG2FromBytes(bytes) {
    const { BYTES: L3, ORDER: P4 } = Fp;
    const { compressed, infinity, sort, value } = parseMask(bytes);
    if (!compressed && !infinity && sort || // 00100000
    !compressed && infinity && sort || // 01100000
    sort && infinity && compressed) {
      throw new Error("invalid encoding flag: " + (bytes[0] & 224));
    }
    const slc = (b6, from, to) => bytesToNumberBE(b6.slice(from, to));
    if (value.length === 96 && compressed) {
      if (infinity) {
        if (value.reduce((p4, c2) => p4 !== 0 ? c2 + 1 : c2, 0) > 0) {
          throw new Error("invalid G2 point: compressed");
        }
        return { x: Fp2.ZERO, y: Fp2.ZERO };
      }
      const x_1 = slc(value, 0, L3);
      const x_0 = slc(value, L3, 2 * L3);
      const x4 = Fp2.create({ c0: Fp.create(x_0), c1: Fp.create(x_1) });
      const right = Fp2.add(Fp2.pow(x4, _3n5), bls12_381_CURVE_G2.b);
      let y4 = Fp2.sqrt(right);
      const Y_bit = y4.c1 === _0n7 ? y4.c0 * _2n5 / P4 : y4.c1 * _2n5 / P4 ? _1n7 : _0n7;
      y4 = sort && Y_bit > 0 ? y4 : Fp2.neg(y4);
      return { x: x4, y: y4 };
    } else if (value.length === 192 && !compressed) {
      if (infinity) {
        if (value.reduce((p4, c2) => p4 !== 0 ? c2 + 1 : c2, 0) > 0) {
          throw new Error("invalid G2 point: uncompressed");
        }
        return { x: Fp2.ZERO, y: Fp2.ZERO };
      }
      const x1 = slc(value, 0 * L3, 1 * L3);
      const x0 = slc(value, 1 * L3, 2 * L3);
      const y1 = slc(value, 2 * L3, 3 * L3);
      const y0 = slc(value, 3 * L3, 4 * L3);
      return { x: Fp2.fromBigTuple([x0, x1]), y: Fp2.fromBigTuple([y0, y1]) };
    } else {
      throw new Error("invalid G2 point: expected 96/192 bytes");
    }
  }
  function signatureG2FromBytes(hex) {
    const { ORDER: P4 } = Fp;
    const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex));
    const Point = bls12_381.G2.Point;
    const half = value.length / 2;
    if (half !== 48 && half !== 96)
      throw new Error("invalid compressed signature length, expected 96/192 bytes");
    const z1 = bytesToNumberBE(value.slice(0, half));
    const z22 = bytesToNumberBE(value.slice(half));
    if (infinity)
      return Point.ZERO;
    const x1 = Fp.create(z1 & bitMask(Fp.BITS));
    const x22 = Fp.create(z22);
    const x4 = Fp2.create({ c0: x22, c1: x1 });
    const y22 = Fp2.add(Fp2.pow(x4, _3n5), bls12_381_CURVE_G2.b);
    let y4 = Fp2.sqrt(y22);
    if (!y4)
      throw new Error("Failed to find a square root");
    const { re: y0, im: y1 } = Fp2.reim(y4);
    const aflag1 = BigInt(sort);
    const isGreater = y1 > _0n7 && y1 * _2n5 / P4 !== aflag1;
    const is0 = y1 === _0n7 && y0 * _2n5 / P4 !== aflag1;
    if (isGreater || is0)
      y4 = Fp2.neg(y4);
    const point = Point.fromAffine({ x: x4, y: y4 });
    point.assertValidity();
    return point;
  }
  var bls12_381 = bls({
    // Fields
    fields: {
      Fp,
      Fp2,
      Fp6,
      Fp12,
      Fr: bls12_381_Fr
    },
    // G1: y² = x³ + 4
    G1: {
      ...bls12_381_CURVE_G1,
      Fp,
      htfDefaults: { ...htfDefaults, m: 1, DST: "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_" },
      wrapPrivateKey: true,
      allowInfinityPoint: true,
      // Checks is the point resides in prime-order subgroup.
      // point.isTorsionFree() should return true for valid points
      // It returns false for shitty points.
      // https://eprint.iacr.org/2021/1130.pdf
      isTorsionFree: (c2, point) => {
        const beta = BigInt("0x5f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffe");
        const phi = new c2(Fp.mul(point.X, beta), point.Y, point.Z);
        const xP = point.multiplyUnsafe(BLS_X).negate();
        const u2P = xP.multiplyUnsafe(BLS_X);
        return u2P.equals(phi);
      },
      // Clear cofactor of G1
      // https://eprint.iacr.org/2019/403
      clearCofactor: (_c, point) => {
        return point.multiplyUnsafe(BLS_X).add(point);
      },
      mapToCurve: mapToG1,
      fromBytes: pointG1FromBytes,
      toBytes: pointG1ToBytes,
      ShortSignature: {
        fromBytes(bytes) {
          abytes(bytes);
          return signatureG1FromBytes(bytes);
        },
        fromHex(hex) {
          return signatureG1FromBytes(hex);
        },
        toBytes(point) {
          return signatureG1ToBytes(point);
        },
        toRawBytes(point) {
          return signatureG1ToBytes(point);
        },
        toHex(point) {
          return bytesToHex(signatureG1ToBytes(point));
        }
      }
    },
    G2: {
      ...bls12_381_CURVE_G2,
      Fp: Fp2,
      // https://datatracker.ietf.org/doc/html/rfc9380#name-clearing-the-cofactor
      // https://datatracker.ietf.org/doc/html/rfc9380#name-cofactor-clearing-for-bls12
      hEff: BigInt("0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551"),
      htfDefaults: { ...htfDefaults },
      wrapPrivateKey: true,
      allowInfinityPoint: true,
      mapToCurve: mapToG2,
      // Checks is the point resides in prime-order subgroup.
      // point.isTorsionFree() should return true for valid points
      // It returns false for shitty points.
      // https://eprint.iacr.org/2021/1130.pdf
      // Older version: https://eprint.iacr.org/2019/814.pdf
      isTorsionFree: (c2, P4) => {
        return P4.multiplyUnsafe(BLS_X).negate().equals(G2psi(c2, P4));
      },
      // Maps the point into the prime-order subgroup G2.
      // clear_cofactor_bls12381_g2 from RFC 9380.
      // https://eprint.iacr.org/2017/419.pdf
      // prettier-ignore
      clearCofactor: (c2, P4) => {
        const x4 = BLS_X;
        let t1 = P4.multiplyUnsafe(x4).negate();
        let t2 = G2psi(c2, P4);
        let t3 = P4.double();
        t3 = G2psi2(c2, t3);
        t3 = t3.subtract(t2);
        t2 = t1.add(t2);
        t2 = t2.multiplyUnsafe(x4).negate();
        t3 = t3.add(t2);
        t3 = t3.subtract(t1);
        const Q3 = t3.subtract(P4);
        return Q3;
      },
      fromBytes: pointG2FromBytes,
      toBytes: pointG2ToBytes,
      Signature: {
        fromBytes(bytes) {
          abytes(bytes);
          return signatureG2FromBytes(bytes);
        },
        fromHex(hex) {
          return signatureG2FromBytes(hex);
        },
        toBytes(point) {
          return signatureG2ToBytes(point);
        },
        toRawBytes(point) {
          return signatureG2ToBytes(point);
        },
        toHex(point) {
          return bytesToHex(signatureG2ToBytes(point));
        }
      }
    },
    params: {
      ateLoopSize: BLS_X,
      // The BLS parameter x for BLS12-381
      r: bls12_381_CURVE_G1.n,
      // order; z⁴ − z² + 1; CURVE.n from other curves
      xNegative: true,
      twistType: "multiplicative"
    },
    htfDefaults,
    hash: sha256
  });
  var isogenyMapG2 = isogenyMap(Fp2, [
    // xNum
    [
      [
        "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6",
        "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6"
      ],
      [
        "0x0",
        "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71a"
      ],
      [
        "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71e",
        "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38d"
      ],
      [
        "0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1",
        "0x0"
      ]
    ],
    // xDen
    [
      [
        "0x0",
        "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63"
      ],
      [
        "0xc",
        "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9f"
      ],
      ["0x1", "0x0"]
      // LAST 1
    ],
    // yNum
    [
      [
        "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706",
        "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706"
      ],
      [
        "0x0",
        "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97be"
      ],
      [
        "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71c",
        "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38f"
      ],
      [
        "0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10",
        "0x0"
      ]
    ],
    // yDen
    [
      [
        "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb",
        "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb"
      ],
      [
        "0x0",
        "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3"
      ],
      [
        "0x12",
        "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99"
      ],
      ["0x1", "0x0"]
      // LAST 1
    ]
  ].map((i) => i.map((pair) => Fp2.fromBigTuple(pair.map(BigInt)))));
  var isogenyMapG1 = isogenyMap(Fp, [
    // xNum
    [
      "0x11a05f2b1e833340b809101dd99815856b303e88a2d7005ff2627b56cdb4e2c85610c2d5f2e62d6eaeac1662734649b7",
      "0x17294ed3e943ab2f0588bab22147a81c7c17e75b2f6a8417f565e33c70d1e86b4838f2a6f318c356e834eef1b3cb83bb",
      "0xd54005db97678ec1d1048c5d10a9a1bce032473295983e56878e501ec68e25c958c3e3d2a09729fe0179f9dac9edcb0",
      "0x1778e7166fcc6db74e0609d307e55412d7f5e4656a8dbf25f1b33289f1b330835336e25ce3107193c5b388641d9b6861",
      "0xe99726a3199f4436642b4b3e4118e5499db995a1257fb3f086eeb65982fac18985a286f301e77c451154ce9ac8895d9",
      "0x1630c3250d7313ff01d1201bf7a74ab5db3cb17dd952799b9ed3ab9097e68f90a0870d2dcae73d19cd13c1c66f652983",
      "0xd6ed6553fe44d296a3726c38ae652bfb11586264f0f8ce19008e218f9c86b2a8da25128c1052ecaddd7f225a139ed84",
      "0x17b81e7701abdbe2e8743884d1117e53356de5ab275b4db1a682c62ef0f2753339b7c8f8c8f475af9ccb5618e3f0c88e",
      "0x80d3cf1f9a78fc47b90b33563be990dc43b756ce79f5574a2c596c928c5d1de4fa295f296b74e956d71986a8497e317",
      "0x169b1f8e1bcfa7c42e0c37515d138f22dd2ecb803a0c5c99676314baf4bb1b7fa3190b2edc0327797f241067be390c9e",
      "0x10321da079ce07e272d8ec09d2565b0dfa7dccdde6787f96d50af36003b14866f69b771f8c285decca67df3f1605fb7b",
      "0x6e08c248e260e70bd1e962381edee3d31d79d7e22c837bc23c0bf1bc24c6b68c24b1b80b64d391fa9c8ba2e8ba2d229"
    ],
    // xDen
    [
      "0x8ca8d548cff19ae18b2e62f4bd3fa6f01d5ef4ba35b48ba9c9588617fc8ac62b558d681be343df8993cf9fa40d21b1c",
      "0x12561a5deb559c4348b4711298e536367041e8ca0cf0800c0126c2588c48bf5713daa8846cb026e9e5c8276ec82b3bff",
      "0xb2962fe57a3225e8137e629bff2991f6f89416f5a718cd1fca64e00b11aceacd6a3d0967c94fedcfcc239ba5cb83e19",
      "0x3425581a58ae2fec83aafef7c40eb545b08243f16b1655154cca8abc28d6fd04976d5243eecf5c4130de8938dc62cd8",
      "0x13a8e162022914a80a6f1d5f43e7a07dffdfc759a12062bb8d6b44e833b306da9bd29ba81f35781d539d395b3532a21e",
      "0xe7355f8e4e667b955390f7f0506c6e9395735e9ce9cad4d0a43bcef24b8982f7400d24bc4228f11c02df9a29f6304a5",
      "0x772caacf16936190f3e0c63e0596721570f5799af53a1894e2e073062aede9cea73b3538f0de06cec2574496ee84a3a",
      "0x14a7ac2a9d64a8b230b3f5b074cf01996e7f63c21bca68a81996e1cdf9822c580fa5b9489d11e2d311f7d99bbdcc5a5e",
      "0xa10ecf6ada54f825e920b3dafc7a3cce07f8d1d7161366b74100da67f39883503826692abba43704776ec3a79a1d641",
      "0x95fc13ab9e92ad4476d6e3eb3a56680f682b4ee96f7d03776df533978f31c1593174e4b4b7865002d6384d168ecdd0a",
      "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
      // LAST 1
    ],
    // yNum
    [
      "0x90d97c81ba24ee0259d1f094980dcfa11ad138e48a869522b52af6c956543d3cd0c7aee9b3ba3c2be9845719707bb33",
      "0x134996a104ee5811d51036d776fb46831223e96c254f383d0f906343eb67ad34d6c56711962fa8bfe097e75a2e41c696",
      "0xcc786baa966e66f4a384c86a3b49942552e2d658a31ce2c344be4b91400da7d26d521628b00523b8dfe240c72de1f6",
      "0x1f86376e8981c217898751ad8746757d42aa7b90eeb791c09e4a3ec03251cf9de405aba9ec61deca6355c77b0e5f4cb",
      "0x8cc03fdefe0ff135caf4fe2a21529c4195536fbe3ce50b879833fd221351adc2ee7f8dc099040a841b6daecf2e8fedb",
      "0x16603fca40634b6a2211e11db8f0a6a074a7d0d4afadb7bd76505c3d3ad5544e203f6326c95a807299b23ab13633a5f0",
      "0x4ab0b9bcfac1bbcb2c977d027796b3ce75bb8ca2be184cb5231413c4d634f3747a87ac2460f415ec961f8855fe9d6f2",
      "0x987c8d5333ab86fde9926bd2ca6c674170a05bfe3bdd81ffd038da6c26c842642f64550fedfe935a15e4ca31870fb29",
      "0x9fc4018bd96684be88c9e221e4da1bb8f3abd16679dc26c1e8b6e6a1f20cabe69d65201c78607a360370e577bdba587",
      "0xe1bba7a1186bdb5223abde7ada14a23c42a0ca7915af6fe06985e7ed1e4d43b9b3f7055dd4eba6f2bafaaebca731c30",
      "0x19713e47937cd1be0dfd0b8f1d43fb93cd2fcbcb6caf493fd1183e416389e61031bf3a5cce3fbafce813711ad011c132",
      "0x18b46a908f36f6deb918c143fed2edcc523559b8aaf0c2462e6bfe7f911f643249d9cdf41b44d606ce07c8a4d0074d8e",
      "0xb182cac101b9399d155096004f53f447aa7b12a3426b08ec02710e807b4633f06c851c1919211f20d4c04f00b971ef8",
      "0x245a394ad1eca9b72fc00ae7be315dc757b3b080d4c158013e6632d3c40659cc6cf90ad1c232a6442d9d3f5db980133",
      "0x5c129645e44cf1102a159f748c4a3fc5e673d81d7e86568d9ab0f5d396a7ce46ba1049b6579afb7866b1e715475224b",
      "0x15e6be4e990f03ce4ea50b3b42df2eb5cb181d8f84965a3957add4fa95af01b2b665027efec01c7704b456be69c8b604"
    ],
    // yDen
    [
      "0x16112c4c3a9c98b252181140fad0eae9601a6de578980be6eec3232b5be72e7a07f3688ef60c206d01479253b03663c1",
      "0x1962d75c2381201e1a0cbd6c43c348b885c84ff731c4d59ca4a10356f453e01f78a4260763529e3532f6102c2e49a03d",
      "0x58df3306640da276faaae7d6e8eb15778c4855551ae7f310c35a5dd279cd2eca6757cd636f96f891e2538b53dbf67f2",
      "0x16b7d288798e5395f20d23bf89edb4d1d115c5dbddbcd30e123da489e726af41727364f2c28297ada8d26d98445f5416",
      "0xbe0e079545f43e4b00cc912f8228ddcc6d19c9f0f69bbb0542eda0fc9dec916a20b15dc0fd2ededda39142311a5001d",
      "0x8d9e5297186db2d9fb266eaac783182b70152c65550d881c5ecd87b6f0f5a6449f38db9dfa9cce202c6477faaf9b7ac",
      "0x166007c08a99db2fc3ba8734ace9824b5eecfdfa8d0cf8ef5dd365bc400a0051d5fa9c01a58b1fb93d1a1399126a775c",
      "0x16a3ef08be3ea7ea03bcddfabba6ff6ee5a4375efa1f4fd7feb34fd206357132b920f5b00801dee460ee415a15812ed9",
      "0x1866c8ed336c61231a1be54fd1d74cc4f9fb0ce4c6af5920abc5750c4bf39b4852cfe2f7bb9248836b233d9d55535d4a",
      "0x167a55cda70a6e1cea820597d94a84903216f763e13d87bb5308592e7ea7d4fbc7385ea3d529b35e346ef48bb8913f55",
      "0x4d2f259eea405bd48f010a01ad2911d9c6dd039bb61a6290e591b36e636a5c871a5c29f4f83060400f8b49cba8f6aa8",
      "0xaccbb67481d033ff5852c1e48c50c477f94ff8aefce42d28c0f9a88cea7913516f968986f7ebbea9684b529e2561092",
      "0xad6b9514c767fe3c3613144b45f1496543346d98adf02267d5ceef9a00d9b8693000763e3b90ac11e99b138573345cc",
      "0x2660400eb2e4f3b628bdd0d53cd76f2bf565b94e72927c1cb748df27942480e420517bd8714cc80d1fadc1326ed06f7",
      "0xe0fa1d816ddc03e6b24255e0d7819c171c40f65e273b853324efcd6356caa205ca2f570f13497804415473a1d634b8f",
      "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
      // LAST 1
    ]
  ].map((i) => i.map((j5) => BigInt(j5))));
  var G1_SWU = mapToCurveSimpleSWU(Fp, {
    A: Fp.create(BigInt("0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d")),
    B: Fp.create(BigInt("0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0")),
    Z: Fp.create(BigInt(11))
  });
  var G2_SWU = mapToCurveSimpleSWU(Fp2, {
    A: Fp2.create({ c0: Fp.create(_0n7), c1: Fp.create(BigInt(240)) }),
    // A' = 240 * I
    B: Fp2.create({ c0: Fp.create(BigInt(1012)), c1: Fp.create(BigInt(1012)) }),
    // B' = 1012 * (1 + I)
    Z: Fp2.create({ c0: Fp.create(BigInt(-2)), c1: Fp.create(BigInt(-1)) })
    // Z: -(2 + I)
  });
  function mapToG1(scalars) {
    const { x: x4, y: y4 } = G1_SWU(Fp.create(scalars[0]));
    return isogenyMapG1(x4, y4);
  }
  function mapToG2(scalars) {
    const { x: x4, y: y4 } = G2_SWU(Fp2.fromBigTuple(scalars));
    return isogenyMapG2(x4, y4);
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/utils/bls.js
  function blsVerify(pk, sig, msg) {
    const primaryKey = typeof pk === "string" ? pk : bytesToHex(pk);
    const signature = typeof sig === "string" ? sig : bytesToHex(sig);
    const message = typeof msg === "string" ? msg : bytesToHex(msg);
    return bls12_381.verifyShortSignature(signature, message, primaryKey);
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/utils/leb.js
  var MILLISECOND_TO_NANOSECONDS = BigInt(1e6);
  var decodeLeb128 = (buf) => {
    return lebDecode(new PipeArrayBuffer(buf));
  };
  var decodeTime = (buf) => {
    const timestampNs = decodeLeb128(buf);
    const timestampMs = timestampNs / MILLISECOND_TO_NANOSECONDS;
    return new Date(Number(timestampMs));
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/certificate.js
  var MINUTES_TO_MSEC = 60 * 1e3;
  var HOURS_TO_MINUTES = 60;
  var DAYS_TO_HOURS = 24;
  var DAYS_TO_MINUTES = DAYS_TO_HOURS * HOURS_TO_MINUTES;
  var DEFAULT_CERTIFICATE_MAX_AGE_IN_MINUTES = 5;
  var DEFAULT_CERTIFICATE_MAX_MINUTES_IN_FUTURE = 5;
  var DEFAULT_CERTIFICATE_DELEGATION_MAX_AGE_IN_MINUTES = 30 * DAYS_TO_MINUTES;
  var NodeType;
  (function(NodeType2) {
    NodeType2[NodeType2["Empty"] = 0] = "Empty";
    NodeType2[NodeType2["Fork"] = 1] = "Fork";
    NodeType2[NodeType2["Labeled"] = 2] = "Labeled";
    NodeType2[NodeType2["Leaf"] = 3] = "Leaf";
    NodeType2[NodeType2["Pruned"] = 4] = "Pruned";
  })(NodeType || (NodeType = {}));
  function isBufferGreaterThan(a4, b6) {
    for (let i = 0; i < a4.length; i++) {
      if (a4[i] > b6[i]) {
        return true;
      }
    }
    return false;
  }
  var Certificate = class _Certificate {
    #disableTimeVerification = false;
    #agent = void 0;
    /**
     * Create a new instance of a certificate, automatically verifying it.
     * @param {CreateCertificateOptions} options {@link CreateCertificateOptions}
     * @throws if the verification of the certificate fails
     */
    static async create(options) {
      const cert = _Certificate.createUnverified(options);
      await cert.verify();
      return cert;
    }
    static createUnverified(options) {
      return new _Certificate(options.certificate, options.rootKey, options.principal, options.blsVerify ?? blsVerify, options.maxAgeInMinutes, options.disableTimeVerification, options.agent);
    }
    constructor(certificate, _rootKey, _principal, _blsVerify, _maxAgeInMinutes = DEFAULT_CERTIFICATE_MAX_AGE_IN_MINUTES, disableTimeVerification = false, agent) {
      this._rootKey = _rootKey;
      this._principal = _principal;
      this._blsVerify = _blsVerify;
      this._maxAgeInMinutes = _maxAgeInMinutes;
      this.#disableTimeVerification = disableTimeVerification;
      this.cert = decode2(certificate);
      if (agent && "getTimeDiffMsecs" in agent && "hasSyncedTime" in agent && "syncTime" in agent && "syncTimeWithSubnet" in agent) {
        this.#agent = agent;
      }
    }
    /**
     * Lookup a path in the certificate tree, using {@link lookup_path}.
     * @param path The path to lookup.
     * @returns The result of the lookup.
     */
    lookup_path(path) {
      return lookup_path(path, this.cert.tree);
    }
    /**
     * Lookup a subtree in the certificate tree, using {@link lookup_subtree}.
     * @param path The path to lookup.
     * @returns The result of the lookup.
     */
    lookup_subtree(path) {
      return lookup_subtree(path, this.cert.tree);
    }
    async verify() {
      const rootHash = await reconstruct(this.cert.tree);
      const derKey = await this._checkDelegationAndGetKey(this.cert.delegation);
      const sig = this.cert.signature;
      const key = extractDER(derKey);
      const msg = concatBytes(IC_STATE_ROOT_DOMAIN_SEPARATOR, rootHash);
      const lookupTime = lookupResultToBuffer(this.lookup_path(["time"]));
      if (!lookupTime) {
        throw ProtocolError.fromCode(new CertificateVerificationErrorCode("Certificate does not contain a time"));
      }
      if (!this.#disableTimeVerification) {
        const timeDiffMsecs = this.#agent?.getTimeDiffMsecs() ?? 0;
        const maxAgeInMsec = this._maxAgeInMinutes * MINUTES_TO_MSEC;
        const now = /* @__PURE__ */ new Date();
        const adjustedNow = now.getTime() + timeDiffMsecs;
        const earliestCertificateTime = adjustedNow - maxAgeInMsec;
        const latestCertificateTime = adjustedNow + DEFAULT_CERTIFICATE_MAX_MINUTES_IN_FUTURE * MINUTES_TO_MSEC;
        const certTime = decodeTime(lookupTime);
        const isCertificateTimePast = certTime.getTime() < earliestCertificateTime;
        const isCertificateTimeFuture = certTime.getTime() > latestCertificateTime;
        if ((isCertificateTimePast || isCertificateTimeFuture) && this.#agent && !this.#agent.hasSyncedTime()) {
          await this._syncTime();
          return await this.verify();
        }
        if (isCertificateTimePast) {
          throw TrustError.fromCode(new CertificateTimeErrorCode(this._maxAgeInMinutes, certTime, now, timeDiffMsecs, "past"));
        } else if (isCertificateTimeFuture) {
          if (this.#agent?.hasSyncedTime()) {
            throw UnknownError.fromCode(new UnexpectedErrorCode("System time has been synced with the IC network, but certificate is still too far in the future."));
          }
          throw TrustError.fromCode(new CertificateTimeErrorCode(5, certTime, now, timeDiffMsecs, "future"));
        }
      }
      try {
        const sigVer = await this._blsVerify(key, sig, msg);
        if (!sigVer) {
          throw TrustError.fromCode(new CertificateVerificationErrorCode("Invalid signature"));
        }
      } catch (err) {
        throw TrustError.fromCode(new CertificateVerificationErrorCode("Signature verification failed", err));
      }
    }
    async _checkDelegationAndGetKey(d4) {
      if (!d4) {
        return this._rootKey;
      }
      const cert = _Certificate.createUnverified({
        certificate: d4.certificate,
        rootKey: this._rootKey,
        principal: this._principal,
        blsVerify: this._blsVerify,
        disableTimeVerification: this.#disableTimeVerification,
        maxAgeInMinutes: DEFAULT_CERTIFICATE_DELEGATION_MAX_AGE_IN_MINUTES,
        agent: this.#agent
      });
      if (cert.cert.delegation) {
        throw ProtocolError.fromCode(new CertificateHasTooManyDelegationsErrorCode());
      }
      await cert.verify();
      let subnetId;
      if (isCanisterPrincipal(this._principal)) {
        const canisterId = this._principal.canisterId;
        subnetId = Principal.fromUint8Array(d4.subnet_id);
        const canisterInRange = check_canister_ranges({
          canisterId,
          subnetId,
          tree: cert.cert.tree
        });
        if (!canisterInRange) {
          throw TrustError.fromCode(new CertificateNotAuthorizedErrorCode(canisterId, subnetId));
        }
      } else if (isSubnetPrincipal(this._principal)) {
        subnetId = this._principal.subnetId;
      } else {
        throw UNREACHABLE_ERROR;
      }
      const publicKeyLookup = lookupResultToBuffer(cert.lookup_path(["subnet", subnetId.toUint8Array(), "public_key"]));
      if (!publicKeyLookup) {
        if (isSubnetPrincipal(this._principal)) {
          throw TrustError.fromCode(new CertificateNotAuthorizedForSubnetErrorCode(subnetId));
        } else {
          throw TrustError.fromCode(new MissingLookupValueErrorCode(`Could not find subnet key for subnet ID ${subnetId.toText()}`));
        }
      }
      return publicKeyLookup;
    }
    async _syncTime() {
      if (!this.#agent) {
        return;
      }
      if (isCanisterPrincipal(this._principal)) {
        await this.#agent.syncTime(this._principal.canisterId);
      } else {
        await this.#agent.syncTimeWithSubnet(this._principal.subnetId);
      }
    }
  };
  function isSubnetPrincipal(principal) {
    return "subnetId" in principal;
  }
  function isCanisterPrincipal(principal) {
    return "canisterId" in principal;
  }
  var DER_PREFIX = hexToBytes("308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100");
  var KEY_LENGTH = 96;
  function extractDER(buf) {
    const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
    if (buf.byteLength !== expectedLength) {
      throw ProtocolError.fromCode(new DerKeyLengthMismatchErrorCode(expectedLength, buf.byteLength));
    }
    const prefix = buf.slice(0, DER_PREFIX.byteLength);
    if (!uint8Equals(prefix, DER_PREFIX)) {
      throw ProtocolError.fromCode(new DerPrefixMismatchErrorCode(DER_PREFIX, prefix));
    }
    return buf.slice(DER_PREFIX.byteLength);
  }
  function lookupResultToBuffer(result) {
    if (result.status !== LookupPathStatus.Found) {
      return void 0;
    }
    if (result.value instanceof Uint8Array) {
      return result.value;
    }
    return void 0;
  }
  async function reconstruct(t) {
    switch (t[0]) {
      case NodeType.Empty:
        return sha256(domain_sep("ic-hashtree-empty"));
      case NodeType.Pruned:
        return t[1];
      case NodeType.Leaf:
        return sha256(concatBytes(domain_sep("ic-hashtree-leaf"), t[1]));
      case NodeType.Labeled:
        return sha256(concatBytes(domain_sep("ic-hashtree-labeled"), t[1], await reconstruct(t[2])));
      case NodeType.Fork:
        return sha256(concatBytes(domain_sep("ic-hashtree-fork"), await reconstruct(t[1]), await reconstruct(t[2])));
      default:
        throw UNREACHABLE_ERROR;
    }
  }
  function domain_sep(s3) {
    const len = new Uint8Array([s3.length]);
    const str = new TextEncoder().encode(s3);
    return concatBytes(len, str);
  }
  function pathToLabel(path) {
    return typeof path[0] === "string" ? utf8ToBytes(path[0]) : path[0];
  }
  var LookupPathStatus;
  (function(LookupPathStatus2) {
    LookupPathStatus2["Unknown"] = "Unknown";
    LookupPathStatus2["Absent"] = "Absent";
    LookupPathStatus2["Found"] = "Found";
    LookupPathStatus2["Error"] = "Error";
  })(LookupPathStatus || (LookupPathStatus = {}));
  var LookupSubtreeStatus;
  (function(LookupSubtreeStatus2) {
    LookupSubtreeStatus2["Absent"] = "Absent";
    LookupSubtreeStatus2["Unknown"] = "Unknown";
    LookupSubtreeStatus2["Found"] = "Found";
  })(LookupSubtreeStatus || (LookupSubtreeStatus = {}));
  var LookupLabelStatus;
  (function(LookupLabelStatus2) {
    LookupLabelStatus2["Absent"] = "Absent";
    LookupLabelStatus2["Unknown"] = "Unknown";
    LookupLabelStatus2["Found"] = "Found";
    LookupLabelStatus2["Less"] = "Less";
    LookupLabelStatus2["Greater"] = "Greater";
  })(LookupLabelStatus || (LookupLabelStatus = {}));
  function lookup_path(path, tree) {
    if (path.length === 0) {
      switch (tree[0]) {
        case NodeType.Empty: {
          return {
            status: LookupPathStatus.Absent
          };
        }
        case NodeType.Leaf: {
          if (!tree[1]) {
            throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid tree structure for leaf"));
          }
          if (tree[1] instanceof Uint8Array) {
            return {
              status: LookupPathStatus.Found,
              value: tree[1].slice(tree[1].byteOffset, tree[1].byteLength + tree[1].byteOffset)
            };
          }
          throw UNREACHABLE_ERROR;
        }
        case NodeType.Pruned: {
          return {
            status: LookupPathStatus.Unknown
          };
        }
        case NodeType.Labeled:
        case NodeType.Fork: {
          return {
            status: LookupPathStatus.Error
          };
        }
        default: {
          throw UNREACHABLE_ERROR;
        }
      }
    }
    const label = pathToLabel(path);
    const lookupResult = find_label(label, tree);
    switch (lookupResult.status) {
      case LookupLabelStatus.Found: {
        return lookup_path(path.slice(1), lookupResult.value);
      }
      case LookupLabelStatus.Absent:
      case LookupLabelStatus.Greater:
      case LookupLabelStatus.Less: {
        return {
          status: LookupPathStatus.Absent
        };
      }
      case LookupLabelStatus.Unknown: {
        return {
          status: LookupPathStatus.Unknown
        };
      }
      default: {
        throw UNREACHABLE_ERROR;
      }
    }
  }
  function lookup_subtree(path, tree) {
    if (path.length === 0) {
      return {
        status: LookupSubtreeStatus.Found,
        value: tree
      };
    }
    const label = pathToLabel(path);
    const lookupResult = find_label(label, tree);
    switch (lookupResult.status) {
      case LookupLabelStatus.Found: {
        return lookup_subtree(path.slice(1), lookupResult.value);
      }
      case LookupLabelStatus.Unknown: {
        return {
          status: LookupSubtreeStatus.Unknown
        };
      }
      case LookupLabelStatus.Absent:
      case LookupLabelStatus.Greater:
      case LookupLabelStatus.Less: {
        return {
          status: LookupSubtreeStatus.Absent
        };
      }
      default: {
        throw UNREACHABLE_ERROR;
      }
    }
  }
  function flatten_forks(t) {
    switch (t[0]) {
      case NodeType.Empty:
        return [];
      case NodeType.Fork:
        return flatten_forks(t[1]).concat(flatten_forks(t[2]));
      default:
        return [t];
    }
  }
  function find_label(label, tree) {
    switch (tree[0]) {
      // if we have a labelled node, compare the node's label to the one we are
      // looking for
      case NodeType.Labeled:
        if (isBufferGreaterThan(label, tree[1])) {
          return {
            status: LookupLabelStatus.Greater
          };
        }
        if (uint8Equals(label, tree[1])) {
          return {
            status: LookupLabelStatus.Found,
            value: tree[2]
          };
        }
        return {
          status: LookupLabelStatus.Less
        };
      // if we have a fork node, we need to search both sides, starting with the left
      case NodeType.Fork: {
        const leftLookupResult = find_label(label, tree[1]);
        switch (leftLookupResult.status) {
          // if the label we're searching for is greater than the left node lookup,
          // we need to search the right node
          case LookupLabelStatus.Greater: {
            const rightLookupResult = find_label(label, tree[2]);
            if (rightLookupResult.status === LookupLabelStatus.Less) {
              return {
                status: LookupLabelStatus.Absent
              };
            }
            return rightLookupResult;
          }
          // if the left node returns an uncertain result, we need to search the
          // right node
          case LookupLabelStatus.Unknown: {
            const rightLookupResult = find_label(label, tree[2]);
            if (rightLookupResult.status === LookupLabelStatus.Less) {
              return {
                status: LookupLabelStatus.Unknown
              };
            }
            return rightLookupResult;
          }
          // if the label we're searching for is not greater than the left node
          // lookup, or the result is not uncertain, we stop searching and return
          // whatever the result of the left node lookup was, which can be either
          // Found or Absent
          default: {
            return leftLookupResult;
          }
        }
      }
      // if we encounter a Pruned node, we can't know for certain if the label
      // we're searching for is present or not
      case NodeType.Pruned:
        return {
          status: LookupLabelStatus.Unknown
        };
      // if the current node is Empty, or a Leaf, we can stop searching because
      // we know for sure that the label we're searching for is not present
      default:
        return {
          status: LookupLabelStatus.Absent
        };
    }
  }
  function list_paths(path, tree) {
    switch (tree[0]) {
      case NodeType.Empty | NodeType.Pruned: {
        return [];
      }
      case NodeType.Leaf: {
        return [path];
      }
      case NodeType.Fork: {
        return list_paths(path, tree[1]).concat(list_paths(path, tree[2]));
      }
      case NodeType.Labeled: {
        const label = tree[1];
        const subtree = tree[2];
        const pathWithLabel = [...path, label];
        return list_paths(pathWithLabel, subtree);
      }
      default: {
        throw UNREACHABLE_ERROR;
      }
    }
  }
  function check_canister_ranges(params) {
    const rangesLookupValue = lookupCanisterRanges(params);
    const ranges = decodeCanisterRanges(rangesLookupValue);
    const { canisterId } = params;
    const canisterInRange = ranges.some((r2) => r2[0].ltEq(canisterId) && r2[1].gtEq(canisterId));
    return canisterInRange;
  }
  function lookupCanisterRanges(params) {
    const { subnetId, tree, canisterId } = params;
    const canisterRangeShardsLookup = lookup_subtree(["canister_ranges", subnetId.toUint8Array()], tree);
    if (canisterRangeShardsLookup.status !== LookupSubtreeStatus.Found) {
      return lookupCanisterRangesFallback(subnetId, tree);
    }
    const canisterRangeShards = canisterRangeShardsLookup.value;
    const shardPaths = getCanisterRangeShardPaths(canisterRangeShards);
    if (shardPaths.length === 0) {
      throw ProtocolError.fromCode(new CertificateNotAuthorizedErrorCode(canisterId, subnetId));
    }
    shardPaths.sort(compare);
    const shardDivision = getCanisterRangeShardPartitionPoint(shardPaths, canisterId);
    const maxPotentialShard = shardPaths[shardDivision];
    const canisterRange = getCanisterRangeFromShards(maxPotentialShard, canisterRangeShards);
    return canisterRange;
  }
  function lookupCanisterRangesFallback(subnetId, tree) {
    const lookupResult = lookup_path(["subnet", subnetId.toUint8Array(), "canister_ranges"], tree);
    if (lookupResult.status !== LookupPathStatus.Found) {
      throw ProtocolError.fromCode(new LookupErrorCode(`Could not find canister ranges for subnet ${subnetId.toText()}`, lookupResult.status));
    }
    return lookupResult.value;
  }
  function decodeCanisterRanges(lookupValue) {
    const ranges_arr = decode2(lookupValue);
    const ranges = ranges_arr.map((v3) => [
      Principal.fromUint8Array(v3[0]),
      Principal.fromUint8Array(v3[1])
    ]);
    return ranges;
  }
  function getCanisterRangeShardPaths(canisterRangeShards) {
    const shardPaths = [];
    for (const path of list_paths([], canisterRangeShards)) {
      const firstLabel = path[0];
      if (!firstLabel) {
        throw ProtocolError.fromCode(new CertificateVerificationErrorCode("Path is invalid"));
      }
      shardPaths.push(firstLabel);
    }
    return shardPaths;
  }
  function getCanisterRangeShardPartitionPoint(shardPaths, canisterId) {
    const canisterIdBytes = canisterId.toUint8Array();
    let left = 0;
    let right = shardPaths.length - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (compare(shardPaths[mid], canisterIdBytes) <= 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    return left;
  }
  function getCanisterRangeFromShards(maxShardPath, canisterRangeShards) {
    const canisterRange = lookup_path([maxShardPath], canisterRangeShards);
    if (canisterRange.status !== LookupPathStatus.Found) {
      throw ProtocolError.fromCode(new LookupErrorCode(`Could not find canister range for shard ${maxShardPath.toString()}`, canisterRange.status));
    }
    return canisterRange.value;
  }
  function getSubnetIdFromCertificate(certificate, rootKey) {
    if (certificate.delegation) {
      return Principal.fromUint8Array(certificate.delegation.subnet_id);
    }
    return Principal.selfAuthenticating(rootKey);
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/utils/readState.js
  var IC_ROOT_SUBNET_ID = Principal.fromText("tdb26-jop6k-aogll-7ltgs-eruif-6kk7m-qpktf-gdiqx-mxtrf-vb5e6-eqe");
  function decodeValue(data, strategy) {
    switch (strategy) {
      case "raw":
        return data;
      case "leb128":
        return decodeLeb128(data);
      case "cbor":
        return decode2(data);
      case "hex":
        return bytesToHex(data);
      case "utf-8":
        return new TextDecoder().decode(data);
    }
  }
  function decodeControllers(buf) {
    const controllersRaw = decode2(buf);
    return controllersRaw.map((buf2) => {
      return Principal.fromUint8Array(buf2);
    });
  }
  function encodeMetadataPath(metaPath, canisterUint8Array) {
    const encoded = typeof metaPath === "string" ? utf8ToBytes(metaPath) : metaPath;
    return [utf8ToBytes("canister"), canisterUint8Array, utf8ToBytes("metadata"), encoded];
  }
  function isCustomPath(path) {
    return typeof path === "object" && path !== null && "key" in path && "path" in path;
  }
  function lookupNodeKeysFromCertificate(certificate, subnetId) {
    const subnetLookupResult = lookup_subtree(["subnet", subnetId.toUint8Array(), "node"], certificate.tree);
    if (subnetLookupResult.status !== LookupSubtreeStatus.Found) {
      throw ProtocolError.fromCode(new LookupErrorCode("Node not found", subnetLookupResult.status));
    }
    if (subnetLookupResult.value instanceof Uint8Array) {
      throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid node tree"));
    }
    const nodeForks = flatten_forks(subnetLookupResult.value);
    const nodeKeys = /* @__PURE__ */ new Map();
    nodeForks.forEach((fork) => {
      const node_id = Principal.from(fork[1]).toText();
      const publicKeyLookupResult = lookup_path(["public_key"], fork[2]);
      if (publicKeyLookupResult.status !== LookupPathStatus.Found) {
        throw ProtocolError.fromCode(new LookupErrorCode("Public key not found", publicKeyLookupResult.status));
      }
      const derEncodedPublicKey = publicKeyLookupResult.value;
      if (derEncodedPublicKey.byteLength !== 44) {
        throw ProtocolError.fromCode(new DerKeyLengthMismatchErrorCode(44, derEncodedPublicKey.byteLength));
      } else {
        nodeKeys.set(node_id, derEncodedPublicKey);
      }
    });
    return nodeKeys;
  }

  // node_modules/@icp-sdk/core/lib/esm/agent/canisterStatus/index.js
  var request = async (options) => {
    const { agent, paths, disableCertificateTimeVerification = false } = options;
    const canisterId = Principal.from(options.canisterId);
    const uniquePaths = [...new Set(paths)];
    const status = /* @__PURE__ */ new Map();
    const promises = uniquePaths.map((path, index) => {
      const encodedPath = encodePath(path, canisterId);
      return (async () => {
        try {
          if (agent.rootKey === null) {
            throw ExternalError.fromCode(new MissingRootKeyErrorCode());
          }
          const rootKey = agent.rootKey;
          const response = await agent.readState(canisterId, {
            paths: [encodedPath]
          });
          const certificate = await Certificate.create({
            certificate: response.certificate,
            rootKey,
            principal: { canisterId },
            disableTimeVerification: disableCertificateTimeVerification,
            agent
          });
          const lookup = (cert, path3) => {
            if (path3 === "subnet") {
              const data2 = fetchNodeKeys(response.certificate, canisterId, rootKey);
              return {
                path: path3,
                data: data2
              };
            } else {
              return {
                path: path3,
                data: lookupResultToBuffer(cert.lookup_path(encodedPath))
              };
            }
          };
          const { path: path2, data } = lookup(certificate, uniquePaths[index]);
          if (!data) {
            if (typeof path2 === "string") {
              status.set(path2, null);
            } else {
              status.set(path2.key, null);
            }
          } else {
            switch (path2) {
              case "time": {
                status.set(path2, decodeTime(data));
                break;
              }
              case "controllers": {
                status.set(path2, decodeControllers(data));
                break;
              }
              case "module_hash": {
                status.set(path2, bytesToHex(data));
                break;
              }
              case "subnet": {
                status.set(path2, data);
                break;
              }
              case "candid": {
                status.set(path2, new TextDecoder().decode(data));
                break;
              }
              default: {
                if (isCustomPath(path2)) {
                  status.set(path2.key, decodeValue(data, path2.decodeStrategy));
                }
              }
            }
          }
        } catch (error) {
          if (error instanceof AgentError && (error.hasCode(CertificateVerificationErrorCode) || error.hasCode(CertificateTimeErrorCode))) {
            throw error;
          }
          if (isCustomPath(path)) {
            status.set(path.key, null);
          } else {
            status.set(path, null);
          }
        }
      })();
    });
    await Promise.all(promises);
    return status;
  };
  var fetchNodeKeys = (certificate, canisterId, root_key) => {
    if (!canisterId._isPrincipal) {
      throw InputError.fromCode(new UnexpectedErrorCode("Invalid canisterId"));
    }
    const cert = decode2(certificate);
    const { delegation } = cert;
    let subnetId;
    if (delegation && delegation.subnet_id) {
      subnetId = Principal.fromUint8Array(new Uint8Array(delegation.subnet_id));
    } else if (!delegation && typeof root_key !== "undefined") {
      subnetId = Principal.selfAuthenticating(new Uint8Array(root_key));
    } else {
      subnetId = IC_ROOT_SUBNET_ID;
    }
    const nodeKeys = lookupNodeKeysFromCertificate(cert, subnetId);
    return {
      subnetId: subnetId.toText(),
      nodeKeys
    };
  };
  var encodePath = (path, canisterId) => {
    const canisterUint8Array = canisterId.toUint8Array();
    switch (path) {
      case "time":
        return [utf8ToBytes("time")];
      case "controllers":
        return [utf8ToBytes("canister"), canisterUint8Array, utf8ToBytes("controllers")];
      case "module_hash":
        return [utf8ToBytes("canister"), canisterUint8Array, utf8ToBytes("module_hash")];
      case "subnet":
        return [utf8ToBytes("subnet")];
      case "candid":
        return [
          utf8ToBytes("canister"),
          canisterUint8Array,
          utf8ToBytes("metadata"),
          utf8ToBytes("candid:service")
        ];
      default: {
        if (isCustomPath(path)) {
          if (typeof path["path"] === "string" || path["path"] instanceof Uint8Array) {
            return encodeMetadataPath(path.path, canisterUint8Array);
          } else {
            return path["path"];
          }
        }
      }
    }
    throw UnknownError.fromCode(new UnexpectedErrorCode(`Error while encoding your path for canister status. Please ensure that your path ${path} was formatted correctly.`));
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/subnetStatus/index.js
  async function request2(options) {
    const { agent, paths, disableCertificateTimeVerification = false } = options;
    const subnetId = Principal.from(options.subnetId);
    const uniquePaths = [...new Set(paths)];
    const status = /* @__PURE__ */ new Map();
    const promises = uniquePaths.map((path, index) => {
      const encodedPath = encodePath2(path, subnetId);
      return (async () => {
        try {
          if (agent.rootKey === null) {
            throw ExternalError.fromCode(new MissingRootKeyErrorCode());
          }
          const rootKey = agent.rootKey;
          const response = await agent.readSubnetState(subnetId, {
            paths: [encodedPath]
          });
          const certificate = await Certificate.create({
            certificate: response.certificate,
            rootKey,
            principal: { subnetId },
            disableTimeVerification: disableCertificateTimeVerification,
            agent
          });
          const lookup = (cert, lookupPath) => {
            if (lookupPath === "nodeKeys") {
              const data2 = lookupNodeKeysFromCertificate(cert.cert, subnetId);
              return {
                path: lookupPath,
                data: data2
              };
            } else {
              return {
                path: lookupPath,
                data: lookupResultToBuffer(cert.lookup_path(encodedPath))
              };
            }
          };
          const { path: path2, data } = lookup(certificate, uniquePaths[index]);
          if (!data) {
            if (typeof path2 === "string") {
              status.set(path2, null);
            } else {
              status.set(path2.key, null);
            }
          } else {
            switch (path2) {
              case "time": {
                status.set(path2, decodeTime(data));
                break;
              }
              case "canisterRanges": {
                status.set(path2, decodeCanisterRanges(data));
                break;
              }
              case "publicKey": {
                status.set(path2, data);
                break;
              }
              case "nodeKeys": {
                status.set(path2, data);
                break;
              }
              default: {
                if (isCustomPath(path2)) {
                  status.set(path2.key, decodeValue(data, path2.decodeStrategy));
                }
              }
            }
          }
        } catch (error) {
          if (error instanceof AgentError && (error.hasCode(CertificateVerificationErrorCode) || error.hasCode(CertificateTimeErrorCode))) {
            throw error;
          }
          if (isCustomPath(path)) {
            status.set(path.key, null);
          } else {
            status.set(path, null);
          }
        }
      })();
    });
    await Promise.all(promises);
    return status;
  }
  function encodePath2(path, subnetId) {
    const subnetUint8Array = subnetId.toUint8Array();
    switch (path) {
      case "time":
        return [utf8ToBytes("time")];
      case "canisterRanges":
        return [utf8ToBytes("canister_ranges"), subnetUint8Array];
      case "publicKey":
        return [utf8ToBytes("subnet"), subnetUint8Array, utf8ToBytes("public_key")];
      case "nodeKeys":
        return [utf8ToBytes("subnet"), subnetUint8Array, utf8ToBytes("node")];
      default: {
        if (isCustomPath(path)) {
          if (typeof path["path"] === "string" || path["path"] instanceof Uint8Array) {
            const encoded = typeof path["path"] === "string" ? utf8ToBytes(path["path"]) : path["path"];
            return [utf8ToBytes("subnet"), subnetUint8Array, encoded];
          } else {
            return path["path"];
          }
        }
      }
    }
    throw UnknownError.fromCode(new UnexpectedErrorCode(`Error while encoding your path for subnet status. Please ensure that your path ${path} was formatted correctly.`));
  }

  // node_modules/@noble/curves/esm/abstract/edwards.js
  var _0n8 = BigInt(0);
  var _1n8 = BigInt(1);
  var _2n6 = BigInt(2);
  var _8n2 = BigInt(8);
  function isEdValidXY(Fp4, CURVE, x4, y4) {
    const x22 = Fp4.sqr(x4);
    const y22 = Fp4.sqr(y4);
    const left = Fp4.add(Fp4.mul(CURVE.a, x22), y22);
    const right = Fp4.add(Fp4.ONE, Fp4.mul(CURVE.d, Fp4.mul(x22, y22)));
    return Fp4.eql(left, right);
  }
  function edwards(params, extraOpts = {}) {
    const validated = _createCurveFields("edwards", params, extraOpts, extraOpts.FpFnLE);
    const { Fp: Fp4, Fn: Fn2 } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor } = CURVE;
    _validateObject(extraOpts, {}, { uvRatio: "function" });
    const MASK = _2n6 << BigInt(Fn2.BYTES * 8) - _1n8;
    const modP = (n) => Fp4.create(n);
    const uvRatio2 = extraOpts.uvRatio || ((u4, v3) => {
      try {
        return { isValid: true, value: Fp4.sqrt(Fp4.div(u4, v3)) };
      } catch (e3) {
        return { isValid: false, value: _0n8 };
      }
    });
    if (!isEdValidXY(Fp4, CURVE, CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    function acoord(title, n, banZero = false) {
      const min = banZero ? _1n8 : _0n8;
      aInRange("coordinate " + title, n, min, MASK);
      return n;
    }
    function aextpoint(other) {
      if (!(other instanceof Point))
        throw new Error("ExtendedPoint expected");
    }
    const toAffineMemo = memoized((p4, iz) => {
      const { X: X4, Y: Y3, Z: Z3 } = p4;
      const is0 = p4.is0();
      if (iz == null)
        iz = is0 ? _8n2 : Fp4.inv(Z3);
      const x4 = modP(X4 * iz);
      const y4 = modP(Y3 * iz);
      const zz = Fp4.mul(Z3, iz);
      if (is0)
        return { x: _0n8, y: _1n8 };
      if (zz !== _1n8)
        throw new Error("invZ was invalid");
      return { x: x4, y: y4 };
    });
    const assertValidMemo = memoized((p4) => {
      const { a: a4, d: d4 } = CURVE;
      if (p4.is0())
        throw new Error("bad point: ZERO");
      const { X: X4, Y: Y3, Z: Z3, T: T4 } = p4;
      const X22 = modP(X4 * X4);
      const Y22 = modP(Y3 * Y3);
      const Z22 = modP(Z3 * Z3);
      const Z4 = modP(Z22 * Z22);
      const aX2 = modP(X22 * a4);
      const left = modP(Z22 * modP(aX2 + Y22));
      const right = modP(Z4 + modP(d4 * modP(X22 * Y22)));
      if (left !== right)
        throw new Error("bad point: equation left != right (1)");
      const XY = modP(X4 * Y3);
      const ZT = modP(Z3 * T4);
      if (XY !== ZT)
        throw new Error("bad point: equation left != right (2)");
      return true;
    });
    class Point {
      constructor(X4, Y3, Z3, T4) {
        this.X = acoord("x", X4);
        this.Y = acoord("y", Y3);
        this.Z = acoord("z", Z3, true);
        this.T = acoord("t", T4);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      static fromAffine(p4) {
        if (p4 instanceof Point)
          throw new Error("extended point not allowed");
        const { x: x4, y: y4 } = p4 || {};
        acoord("x", x4);
        acoord("y", y4);
        return new Point(x4, y4, _1n8, modP(x4 * y4));
      }
      // Uses algo from RFC8032 5.1.3.
      static fromBytes(bytes, zip215 = false) {
        const len = Fp4.BYTES;
        const { a: a4, d: d4 } = CURVE;
        bytes = copyBytes(_abytes2(bytes, len, "point"));
        _abool2(zip215, "zip215");
        const normed = copyBytes(bytes);
        const lastByte = bytes[len - 1];
        normed[len - 1] = lastByte & ~128;
        const y4 = bytesToNumberLE(normed);
        const max = zip215 ? MASK : Fp4.ORDER;
        aInRange("point.y", y4, _0n8, max);
        const y22 = modP(y4 * y4);
        const u4 = modP(y22 - _1n8);
        const v3 = modP(d4 * y22 - a4);
        let { isValid, value: x4 } = uvRatio2(u4, v3);
        if (!isValid)
          throw new Error("bad point: invalid y coordinate");
        const isXOdd = (x4 & _1n8) === _1n8;
        const isLastByteOdd = (lastByte & 128) !== 0;
        if (!zip215 && x4 === _0n8 && isLastByteOdd)
          throw new Error("bad point: x=0 and x_0=1");
        if (isLastByteOdd !== isXOdd)
          x4 = modP(-x4);
        return Point.fromAffine({ x: x4, y: y4 });
      }
      static fromHex(bytes, zip215 = false) {
        return Point.fromBytes(ensureBytes("point", bytes), zip215);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      precompute(windowSize = 8, isLazy = true) {
        wnaf.createCache(this, windowSize);
        if (!isLazy)
          this.multiply(_2n6);
        return this;
      }
      // Useful in fromAffine() - not for fromBytes(), which always created valid points.
      assertValidity() {
        assertValidMemo(this);
      }
      // Compare one point to another.
      equals(other) {
        aextpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X22, Y: Y22, Z: Z22 } = other;
        const X1Z2 = modP(X1 * Z22);
        const X2Z1 = modP(X22 * Z1);
        const Y1Z2 = modP(Y1 * Z22);
        const Y2Z1 = modP(Y22 * Z1);
        return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      negate() {
        return new Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
      }
      // Fast algo for doubling Extended Point.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
      // Cost: 4M + 4S + 1*a + 6add + 1*2.
      double() {
        const { a: a4 } = CURVE;
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const A5 = modP(X1 * X1);
        const B5 = modP(Y1 * Y1);
        const C5 = modP(_2n6 * modP(Z1 * Z1));
        const D4 = modP(a4 * A5);
        const x1y1 = X1 + Y1;
        const E4 = modP(modP(x1y1 * x1y1) - A5 - B5);
        const G4 = D4 + B5;
        const F4 = G4 - C5;
        const H3 = D4 - B5;
        const X32 = modP(E4 * F4);
        const Y3 = modP(G4 * H3);
        const T32 = modP(E4 * H3);
        const Z3 = modP(F4 * G4);
        return new Point(X32, Y3, Z3, T32);
      }
      // Fast algo for adding 2 Extended Points.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
      // Cost: 9M + 1*a + 1*d + 7add.
      add(other) {
        aextpoint(other);
        const { a: a4, d: d4 } = CURVE;
        const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
        const { X: X22, Y: Y22, Z: Z22, T: T22 } = other;
        const A5 = modP(X1 * X22);
        const B5 = modP(Y1 * Y22);
        const C5 = modP(T1 * d4 * T22);
        const D4 = modP(Z1 * Z22);
        const E4 = modP((X1 + Y1) * (X22 + Y22) - A5 - B5);
        const F4 = D4 - C5;
        const G4 = D4 + C5;
        const H3 = modP(B5 - a4 * A5);
        const X32 = modP(E4 * F4);
        const Y3 = modP(G4 * H3);
        const T32 = modP(E4 * H3);
        const Z3 = modP(F4 * G4);
        return new Point(X32, Y3, Z3, T32);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      // Constant-time multiplication.
      multiply(scalar) {
        if (!Fn2.isValidNot0(scalar))
          throw new Error("invalid scalar: expected 1 <= sc < curve.n");
        const { p: p4, f: f4 } = wnaf.cached(this, scalar, (p5) => normalizeZ(Point, p5));
        return normalizeZ(Point, [p4, f4])[0];
      }
      // Non-constant-time multiplication. Uses double-and-add algorithm.
      // It's faster, but should only be used when you don't care about
      // an exposed private key e.g. sig verification.
      // Does NOT allow scalars higher than CURVE.n.
      // Accepts optional accumulator to merge with multiply (important for sparse scalars)
      multiplyUnsafe(scalar, acc = Point.ZERO) {
        if (!Fn2.isValid(scalar))
          throw new Error("invalid scalar: expected 0 <= sc < curve.n");
        if (scalar === _0n8)
          return Point.ZERO;
        if (this.is0() || scalar === _1n8)
          return this;
        return wnaf.unsafe(this, scalar, (p4) => normalizeZ(Point, p4), acc);
      }
      // Checks if point is of small order.
      // If you add something to small order point, you will have "dirty"
      // point with torsion component.
      // Multiplies point by cofactor and checks if the result is 0.
      isSmallOrder() {
        return this.multiplyUnsafe(cofactor).is0();
      }
      // Multiplies point by curve order and checks if the result is 0.
      // Returns `false` is the point is dirty.
      isTorsionFree() {
        return wnaf.unsafe(this, CURVE.n).is0();
      }
      // Converts Extended point to default (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      toAffine(invertedZ) {
        return toAffineMemo(this, invertedZ);
      }
      clearCofactor() {
        if (cofactor === _1n8)
          return this;
        return this.multiplyUnsafe(cofactor);
      }
      toBytes() {
        const { x: x4, y: y4 } = this.toAffine();
        const bytes = Fp4.toBytes(y4);
        bytes[bytes.length - 1] |= x4 & _1n8 ? 128 : 0;
        return bytes;
      }
      toHex() {
        return bytesToHex(this.toBytes());
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
      // TODO: remove
      get ex() {
        return this.X;
      }
      get ey() {
        return this.Y;
      }
      get ez() {
        return this.Z;
      }
      get et() {
        return this.T;
      }
      static normalizeZ(points) {
        return normalizeZ(Point, points);
      }
      static msm(points, scalars) {
        return pippenger(Point, Fn2, points, scalars);
      }
      _setWindowSize(windowSize) {
        this.precompute(windowSize);
      }
      toRawBytes() {
        return this.toBytes();
      }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n8, modP(CURVE.Gx * CURVE.Gy));
    Point.ZERO = new Point(_0n8, _1n8, _1n8, _0n8);
    Point.Fp = Fp4;
    Point.Fn = Fn2;
    const wnaf = new wNAF(Point, Fn2.BITS);
    Point.BASE.precompute(8);
    return Point;
  }
  var PrimeEdwardsPoint = class {
    constructor(ep) {
      this.ep = ep;
    }
    // Static methods that must be implemented by subclasses
    static fromBytes(_bytes) {
      notImplemented();
    }
    static fromHex(_hex) {
      notImplemented();
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    // Common implementations
    clearCofactor() {
      return this;
    }
    assertValidity() {
      this.ep.assertValidity();
    }
    toAffine(invertedZ) {
      return this.ep.toAffine(invertedZ);
    }
    toHex() {
      return bytesToHex(this.toBytes());
    }
    toString() {
      return this.toHex();
    }
    isTorsionFree() {
      return true;
    }
    isSmallOrder() {
      return false;
    }
    add(other) {
      this.assertSame(other);
      return this.init(this.ep.add(other.ep));
    }
    subtract(other) {
      this.assertSame(other);
      return this.init(this.ep.subtract(other.ep));
    }
    multiply(scalar) {
      return this.init(this.ep.multiply(scalar));
    }
    multiplyUnsafe(scalar) {
      return this.init(this.ep.multiplyUnsafe(scalar));
    }
    double() {
      return this.init(this.ep.double());
    }
    negate() {
      return this.init(this.ep.negate());
    }
    precompute(windowSize, isLazy) {
      return this.init(this.ep.precompute(windowSize, isLazy));
    }
    /** @deprecated use `toBytes` */
    toRawBytes() {
      return this.toBytes();
    }
  };
  function eddsa(Point, cHash, eddsaOpts = {}) {
    if (typeof cHash !== "function")
      throw new Error('"hash" function param is required');
    _validateObject(eddsaOpts, {}, {
      adjustScalarBytes: "function",
      randomBytes: "function",
      domain: "function",
      prehash: "function",
      mapToCurve: "function"
    });
    const { prehash } = eddsaOpts;
    const { BASE, Fp: Fp4, Fn: Fn2 } = Point;
    const randomBytes2 = eddsaOpts.randomBytes || randomBytes;
    const adjustScalarBytes2 = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
    const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
      _abool2(phflag, "phflag");
      if (ctx.length || phflag)
        throw new Error("Contexts/pre-hash are not supported");
      return data;
    });
    function modN_LE(hash) {
      return Fn2.create(bytesToNumberLE(hash));
    }
    function getPrivateScalar(key) {
      const len = lengths.secretKey;
      key = ensureBytes("private key", key, len);
      const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
      const head = adjustScalarBytes2(hashed.slice(0, len));
      const prefix = hashed.slice(len, 2 * len);
      const scalar = modN_LE(head);
      return { head, prefix, scalar };
    }
    function getExtendedPublicKey(secretKey) {
      const { head, prefix, scalar } = getPrivateScalar(secretKey);
      const point = BASE.multiply(scalar);
      const pointBytes = point.toBytes();
      return { head, prefix, scalar, point, pointBytes };
    }
    function getPublicKey(secretKey) {
      return getExtendedPublicKey(secretKey).pointBytes;
    }
    function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
      const msg = concatBytes(...msgs);
      return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
    }
    function sign(msg, secretKey, options = {}) {
      msg = ensureBytes("message", msg);
      if (prehash)
        msg = prehash(msg);
      const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
      const r2 = hashDomainToScalar(options.context, prefix, msg);
      const R3 = BASE.multiply(r2).toBytes();
      const k5 = hashDomainToScalar(options.context, R3, pointBytes, msg);
      const s3 = Fn2.create(r2 + k5 * scalar);
      if (!Fn2.isValid(s3))
        throw new Error("sign failed: invalid s");
      const rs = concatBytes(R3, Fn2.toBytes(s3));
      return _abytes2(rs, lengths.signature, "result");
    }
    const verifyOpts = { zip215: true };
    function verify(sig, msg, publicKey, options = verifyOpts) {
      const { context, zip215 } = options;
      const len = lengths.signature;
      sig = ensureBytes("signature", sig, len);
      msg = ensureBytes("message", msg);
      publicKey = ensureBytes("publicKey", publicKey, lengths.publicKey);
      if (zip215 !== void 0)
        _abool2(zip215, "zip215");
      if (prehash)
        msg = prehash(msg);
      const mid = len / 2;
      const r2 = sig.subarray(0, mid);
      const s3 = bytesToNumberLE(sig.subarray(mid, len));
      let A5, R3, SB;
      try {
        A5 = Point.fromBytes(publicKey, zip215);
        R3 = Point.fromBytes(r2, zip215);
        SB = BASE.multiplyUnsafe(s3);
      } catch (error) {
        return false;
      }
      if (!zip215 && A5.isSmallOrder())
        return false;
      const k5 = hashDomainToScalar(context, R3.toBytes(), A5.toBytes(), msg);
      const RkA = R3.add(A5.multiplyUnsafe(k5));
      return RkA.subtract(SB).clearCofactor().is0();
    }
    const _size2 = Fp4.BYTES;
    const lengths = {
      secretKey: _size2,
      publicKey: _size2,
      signature: 2 * _size2,
      seed: _size2
    };
    function randomSecretKey(seed = randomBytes2(lengths.seed)) {
      return _abytes2(seed, lengths.seed, "seed");
    }
    function keygen(seed) {
      const secretKey = utils.randomSecretKey(seed);
      return { secretKey, publicKey: getPublicKey(secretKey) };
    }
    function isValidSecretKey(key) {
      return isBytes(key) && key.length === Fn2.BYTES;
    }
    function isValidPublicKey(key, zip215) {
      try {
        return !!Point.fromBytes(key, zip215);
      } catch (error) {
        return false;
      }
    }
    const utils = {
      getExtendedPublicKey,
      randomSecretKey,
      isValidSecretKey,
      isValidPublicKey,
      /**
       * Converts ed public key to x public key. Uses formula:
       * - ed25519:
       *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
       *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
       * - ed448:
       *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
       *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
       */
      toMontgomery(publicKey) {
        const { y: y4 } = Point.fromBytes(publicKey);
        const size = lengths.publicKey;
        const is25519 = size === 32;
        if (!is25519 && size !== 57)
          throw new Error("only defined for 25519 and 448");
        const u4 = is25519 ? Fp4.div(_1n8 + y4, _1n8 - y4) : Fp4.div(y4 - _1n8, y4 + _1n8);
        return Fp4.toBytes(u4);
      },
      toMontgomerySecret(secretKey) {
        const size = lengths.secretKey;
        _abytes2(secretKey, size);
        const hashed = cHash(secretKey.subarray(0, size));
        return adjustScalarBytes2(hashed).subarray(0, size);
      },
      /** @deprecated */
      randomPrivateKey: randomSecretKey,
      /** @deprecated */
      precompute(windowSize = 8, point = Point.BASE) {
        return point.precompute(windowSize, false);
      }
    };
    return Object.freeze({
      keygen,
      getPublicKey,
      sign,
      verify,
      utils,
      Point,
      lengths
    });
  }
  function _eddsa_legacy_opts_to_new(c2) {
    const CURVE = {
      a: c2.a,
      d: c2.d,
      p: c2.Fp.ORDER,
      n: c2.n,
      h: c2.h,
      Gx: c2.Gx,
      Gy: c2.Gy
    };
    const Fp4 = c2.Fp;
    const Fn2 = Field(CURVE.n, c2.nBitLength, true);
    const curveOpts = { Fp: Fp4, Fn: Fn2, uvRatio: c2.uvRatio };
    const eddsaOpts = {
      randomBytes: c2.randomBytes,
      adjustScalarBytes: c2.adjustScalarBytes,
      domain: c2.domain,
      prehash: c2.prehash,
      mapToCurve: c2.mapToCurve
    };
    return { CURVE, curveOpts, hash: c2.hash, eddsaOpts };
  }
  function _eddsa_new_output_to_legacy(c2, eddsa2) {
    const Point = eddsa2.Point;
    const legacy = Object.assign({}, eddsa2, {
      ExtendedPoint: Point,
      CURVE: c2,
      nBitLength: Point.Fn.BITS,
      nByteLength: Point.Fn.BYTES
    });
    return legacy;
  }
  function twistedEdwards(c2) {
    const { CURVE, curveOpts, hash, eddsaOpts } = _eddsa_legacy_opts_to_new(c2);
    const Point = edwards(CURVE, curveOpts);
    const EDDSA = eddsa(Point, hash, eddsaOpts);
    return _eddsa_new_output_to_legacy(c2, EDDSA);
  }

  // node_modules/@noble/curves/esm/ed25519.js
  var _0n9 = /* @__PURE__ */ BigInt(0);
  var _1n9 = BigInt(1);
  var _2n7 = BigInt(2);
  var _3n6 = BigInt(3);
  var _5n2 = BigInt(5);
  var _8n3 = BigInt(8);
  var ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
  var ed25519_CURVE = /* @__PURE__ */ (() => ({
    p: ed25519_CURVE_p,
    n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
    h: _8n3,
    a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
    d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
    Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
    Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
  }))();
  function ed25519_pow_2_252_3(x4) {
    const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
    const P4 = ed25519_CURVE_p;
    const x22 = x4 * x4 % P4;
    const b22 = x22 * x4 % P4;
    const b42 = pow2(b22, _2n7, P4) * b22 % P4;
    const b52 = pow2(b42, _1n9, P4) * x4 % P4;
    const b10 = pow2(b52, _5n2, P4) * b52 % P4;
    const b20 = pow2(b10, _10n, P4) * b10 % P4;
    const b40 = pow2(b20, _20n, P4) * b20 % P4;
    const b80 = pow2(b40, _40n, P4) * b40 % P4;
    const b160 = pow2(b80, _80n, P4) * b80 % P4;
    const b240 = pow2(b160, _80n, P4) * b80 % P4;
    const b250 = pow2(b240, _10n, P4) * b10 % P4;
    const pow_p_5_8 = pow2(b250, _2n7, P4) * x4 % P4;
    return { pow_p_5_8, b2: b22 };
  }
  function adjustScalarBytes(bytes) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
  }
  var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
  function uvRatio(u4, v3) {
    const P4 = ed25519_CURVE_p;
    const v32 = mod(v3 * v3 * v3, P4);
    const v7 = mod(v32 * v32 * v3, P4);
    const pow = ed25519_pow_2_252_3(u4 * v7).pow_p_5_8;
    let x4 = mod(u4 * v32 * pow, P4);
    const vx2 = mod(v3 * x4 * x4, P4);
    const root1 = x4;
    const root2 = mod(x4 * ED25519_SQRT_M1, P4);
    const useRoot1 = vx2 === u4;
    const useRoot2 = vx2 === mod(-u4, P4);
    const noRoot = vx2 === mod(-u4 * ED25519_SQRT_M1, P4);
    if (useRoot1)
      x4 = root1;
    if (useRoot2 || noRoot)
      x4 = root2;
    if (isNegativeLE(x4, P4))
      x4 = mod(-x4, P4);
    return { isValid: useRoot1 || useRoot2, value: x4 };
  }
  var Fp3 = /* @__PURE__ */ (() => Field(ed25519_CURVE.p, { isLE: true }))();
  var Fn = /* @__PURE__ */ (() => Field(ed25519_CURVE.n, { isLE: true }))();
  var ed25519Defaults = /* @__PURE__ */ (() => ({
    ...ed25519_CURVE,
    Fp: Fp3,
    hash: sha512,
    adjustScalarBytes,
    // dom2
    // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
    // Constant-time, u/√v
    uvRatio
  }))();
  var ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();
  var SQRT_M1 = ED25519_SQRT_M1;
  var SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
  var INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
  var ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
  var D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
  var invertSqrt = (number3) => uvRatio(_1n9, number3);
  var MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  var bytes255ToNumberLE = (bytes) => ed25519.Point.Fp.create(bytesToNumberLE(bytes) & MAX_255B);
  function calcElligatorRistrettoMap(r0) {
    const { d: d4 } = ed25519_CURVE;
    const P4 = ed25519_CURVE_p;
    const mod2 = (n) => Fp3.create(n);
    const r2 = mod2(SQRT_M1 * r0 * r0);
    const Ns = mod2((r2 + _1n9) * ONE_MINUS_D_SQ);
    let c2 = BigInt(-1);
    const D4 = mod2((c2 - d4 * r2) * mod2(r2 + d4));
    let { isValid: Ns_D_is_sq, value: s3 } = uvRatio(Ns, D4);
    let s_ = mod2(s3 * r0);
    if (!isNegativeLE(s_, P4))
      s_ = mod2(-s_);
    if (!Ns_D_is_sq)
      s3 = s_;
    if (!Ns_D_is_sq)
      c2 = r2;
    const Nt = mod2(c2 * (r2 - _1n9) * D_MINUS_ONE_SQ - D4);
    const s22 = s3 * s3;
    const W0 = mod2((s3 + s3) * D4);
    const W1 = mod2(Nt * SQRT_AD_MINUS_ONE);
    const W22 = mod2(_1n9 - s22);
    const W32 = mod2(_1n9 + s22);
    return new ed25519.Point(mod2(W0 * W32), mod2(W22 * W1), mod2(W1 * W32), mod2(W0 * W22));
  }
  function ristretto255_map(bytes) {
    abytes(bytes, 64);
    const r1 = bytes255ToNumberLE(bytes.subarray(0, 32));
    const R1 = calcElligatorRistrettoMap(r1);
    const r2 = bytes255ToNumberLE(bytes.subarray(32, 64));
    const R22 = calcElligatorRistrettoMap(r2);
    return new _RistrettoPoint(R1.add(R22));
  }
  var _RistrettoPoint = class __RistrettoPoint extends PrimeEdwardsPoint {
    constructor(ep) {
      super(ep);
    }
    static fromAffine(ap) {
      return new __RistrettoPoint(ed25519.Point.fromAffine(ap));
    }
    assertSame(other) {
      if (!(other instanceof __RistrettoPoint))
        throw new Error("RistrettoPoint expected");
    }
    init(ep) {
      return new __RistrettoPoint(ep);
    }
    /** @deprecated use `import { ristretto255_hasher } from '@noble/curves/ed25519.js';` */
    static hashToCurve(hex) {
      return ristretto255_map(ensureBytes("ristrettoHash", hex, 64));
    }
    static fromBytes(bytes) {
      abytes(bytes, 32);
      const { a: a4, d: d4 } = ed25519_CURVE;
      const P4 = ed25519_CURVE_p;
      const mod2 = (n) => Fp3.create(n);
      const s3 = bytes255ToNumberLE(bytes);
      if (!equalBytes(Fp3.toBytes(s3), bytes) || isNegativeLE(s3, P4))
        throw new Error("invalid ristretto255 encoding 1");
      const s22 = mod2(s3 * s3);
      const u1 = mod2(_1n9 + a4 * s22);
      const u22 = mod2(_1n9 - a4 * s22);
      const u1_2 = mod2(u1 * u1);
      const u2_2 = mod2(u22 * u22);
      const v3 = mod2(a4 * d4 * u1_2 - u2_2);
      const { isValid, value: I5 } = invertSqrt(mod2(v3 * u2_2));
      const Dx = mod2(I5 * u22);
      const Dy = mod2(I5 * Dx * v3);
      let x4 = mod2((s3 + s3) * Dx);
      if (isNegativeLE(x4, P4))
        x4 = mod2(-x4);
      const y4 = mod2(u1 * Dy);
      const t = mod2(x4 * y4);
      if (!isValid || isNegativeLE(t, P4) || y4 === _0n9)
        throw new Error("invalid ristretto255 encoding 2");
      return new __RistrettoPoint(new ed25519.Point(x4, y4, _1n9, t));
    }
    /**
     * Converts ristretto-encoded string to ristretto point.
     * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
     * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
     */
    static fromHex(hex) {
      return __RistrettoPoint.fromBytes(ensureBytes("ristrettoHex", hex, 32));
    }
    static msm(points, scalars) {
      return pippenger(__RistrettoPoint, ed25519.Point.Fn, points, scalars);
    }
    /**
     * Encodes ristretto point to Uint8Array.
     * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
     */
    toBytes() {
      let { X: X4, Y: Y3, Z: Z3, T: T4 } = this.ep;
      const P4 = ed25519_CURVE_p;
      const mod2 = (n) => Fp3.create(n);
      const u1 = mod2(mod2(Z3 + Y3) * mod2(Z3 - Y3));
      const u22 = mod2(X4 * Y3);
      const u2sq = mod2(u22 * u22);
      const { value: invsqrt } = invertSqrt(mod2(u1 * u2sq));
      const D1 = mod2(invsqrt * u1);
      const D22 = mod2(invsqrt * u22);
      const zInv = mod2(D1 * D22 * T4);
      let D4;
      if (isNegativeLE(T4 * zInv, P4)) {
        let _x = mod2(Y3 * SQRT_M1);
        let _y = mod2(X4 * SQRT_M1);
        X4 = _x;
        Y3 = _y;
        D4 = mod2(D1 * INVSQRT_A_MINUS_D);
      } else {
        D4 = D22;
      }
      if (isNegativeLE(X4 * zInv, P4))
        Y3 = mod2(-Y3);
      let s3 = mod2((Z3 - Y3) * D4);
      if (isNegativeLE(s3, P4))
        s3 = mod2(-s3);
      return Fp3.toBytes(s3);
    }
    /**
     * Compares two Ristretto points.
     * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
     */
    equals(other) {
      this.assertSame(other);
      const { X: X1, Y: Y1 } = this.ep;
      const { X: X22, Y: Y22 } = other.ep;
      const mod2 = (n) => Fp3.create(n);
      const one = mod2(X1 * Y22) === mod2(Y1 * X22);
      const two = mod2(Y1 * Y22) === mod2(X1 * X22);
      return one || two;
    }
    is0() {
      return this.equals(__RistrettoPoint.ZERO);
    }
  };
  _RistrettoPoint.BASE = /* @__PURE__ */ (() => new _RistrettoPoint(ed25519.Point.BASE))();
  _RistrettoPoint.ZERO = /* @__PURE__ */ (() => new _RistrettoPoint(ed25519.Point.ZERO))();
  _RistrettoPoint.Fp = /* @__PURE__ */ (() => Fp3)();
  _RistrettoPoint.Fn = /* @__PURE__ */ (() => Fn)();

  // node_modules/@icp-sdk/core/lib/esm/agent/utils/expirableMap.js
  var _a;
  var _b;
  var ExpirableMap = class {
    static {
      _a = Symbol.iterator, _b = Symbol.toStringTag;
    }
    // Internals
    #inner;
    #expirationTime;
    /**
     * Create a new ExpirableMap.
     * @param {ExpirableMapOptions<any, any>} options - options for the map.
     * @param {Iterable<[any, any]>} options.source - an optional source of entries to initialize the map with.
     * @param {number} options.expirationTime - the time in milliseconds after which entries will expire.
     */
    constructor(options = {}) {
      this[_a] = this.entries.bind(this);
      this[_b] = "ExpirableMap";
      const { source = [], expirationTime = 10 * 60 * 1e3 } = options;
      const currentTime = Date.now();
      this.#inner = new Map([...source].map(([key, value]) => [key, { value, timestamp: currentTime }]));
      this.#expirationTime = expirationTime;
    }
    /**
     * Prune removes all expired entries.
     */
    prune() {
      const currentTime = Date.now();
      for (const [key, entry] of this.#inner.entries()) {
        if (currentTime - entry.timestamp > this.#expirationTime) {
          this.#inner.delete(key);
        }
      }
      return this;
    }
    // Implementing the Map interface
    /**
     * Set the value for the given key. Prunes expired entries.
     * @param key for the entry
     * @param value of the entry
     * @returns this
     */
    set(key, value) {
      this.prune();
      const entry = {
        value,
        timestamp: Date.now()
      };
      this.#inner.set(key, entry);
      return this;
    }
    /**
     * Get the value associated with the key, if it exists and has not expired.
     * @param key K
     * @returns the value associated with the key, or undefined if the key is not present or has expired.
     */
    get(key) {
      const entry = this.#inner.get(key);
      if (entry === void 0) {
        return void 0;
      }
      if (Date.now() - entry.timestamp > this.#expirationTime) {
        this.#inner.delete(key);
        return void 0;
      }
      return entry.value;
    }
    /**
     * Clear all entries.
     */
    clear() {
      this.#inner.clear();
    }
    /**
     * Entries returns the entries of the map, without the expiration time.
     * @returns an iterator over the entries of the map.
     */
    entries() {
      const iterator = this.#inner.entries();
      const generator = function* () {
        for (const [key, value] of iterator) {
          yield [key, value.value];
        }
        return void 0;
      };
      return generator();
    }
    /**
     * Values returns the values of the map, without the expiration time.
     * @returns an iterator over the values of the map.
     */
    values() {
      const iterator = this.#inner.values();
      const generator = function* () {
        for (const value of iterator) {
          yield value.value;
        }
        return void 0;
      };
      return generator();
    }
    /**
     * Keys returns the keys of the map
     * @returns an iterator over the keys of the map.
     */
    keys() {
      return this.#inner.keys();
    }
    /**
     * forEach calls the callbackfn on each entry of the map.
     * @param callbackfn to call on each entry
     * @param thisArg to use as this when calling the callbackfn
     */
    forEach(callbackfn, thisArg) {
      for (const [key, value] of this.#inner.entries()) {
        callbackfn.call(thisArg, value.value, key, this);
      }
    }
    /**
     * has returns true if the key exists and has not expired.
     * @param key K
     * @returns true if the key exists and has not expired.
     */
    has(key) {
      return this.#inner.has(key);
    }
    /**
     * delete the entry for the given key.
     * @param key K
     * @returns true if the key existed and has been deleted.
     */
    delete(key) {
      return this.#inner.delete(key);
    }
    /**
     * get size of the map.
     * @returns the size of the map.
     */
    get size() {
      return this.#inner.size;
    }
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/der.js
  var encodeLenBytes = (len) => {
    if (len <= 127) {
      return 1;
    } else if (len <= 255) {
      return 2;
    } else if (len <= 65535) {
      return 3;
    } else if (len <= 16777215) {
      return 4;
    } else {
      throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
    }
  };
  var encodeLen = (buf, offset, len) => {
    if (len <= 127) {
      buf[offset] = len;
      return 1;
    } else if (len <= 255) {
      buf[offset] = 129;
      buf[offset + 1] = len;
      return 2;
    } else if (len <= 65535) {
      buf[offset] = 130;
      buf[offset + 1] = len >> 8;
      buf[offset + 2] = len;
      return 3;
    } else if (len <= 16777215) {
      buf[offset] = 131;
      buf[offset + 1] = len >> 16;
      buf[offset + 2] = len >> 8;
      buf[offset + 3] = len;
      return 4;
    } else {
      throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
    }
  };
  var decodeLenBytes = (buf, offset) => {
    if (buf[offset] < 128)
      return 1;
    if (buf[offset] === 128)
      throw InputError.fromCode(new DerDecodeErrorCode("Invalid length 0"));
    if (buf[offset] === 129)
      return 2;
    if (buf[offset] === 130)
      return 3;
    if (buf[offset] === 131)
      return 4;
    throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
  };
  var decodeLen = (buf, offset) => {
    const lenBytes = decodeLenBytes(buf, offset);
    if (lenBytes === 1)
      return buf[offset];
    else if (lenBytes === 2)
      return buf[offset + 1];
    else if (lenBytes === 3)
      return (buf[offset + 1] << 8) + buf[offset + 2];
    else if (lenBytes === 4)
      return (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3];
    throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
  };
  var DER_COSE_OID = Uint8Array.from([
    ...[48, 12],
    // SEQUENCE
    ...[6, 10],
    // OID with 10 bytes
    ...[43, 6, 1, 4, 1, 131, 184, 67, 1, 1]
    // DER encoded COSE
  ]);
  var ED25519_OID = Uint8Array.from([
    ...[48, 5],
    // SEQUENCE
    ...[6, 3],
    // OID with 3 bytes
    ...[43, 101, 112]
    // id-Ed25519 OID
  ]);
  var SECP256K1_OID = Uint8Array.from([
    ...[48, 16],
    // SEQUENCE
    ...[6, 7],
    // OID with 7 bytes
    ...[42, 134, 72, 206, 61, 2, 1],
    // OID ECDSA
    ...[6, 5],
    // OID with 5 bytes
    ...[43, 129, 4, 0, 10]
    // OID secp256k1
  ]);
  var BLS12_381_G2_OID = Uint8Array.from([
    ...[48, 29],
    // SEQUENCE, length 29 bytes
    // Algorithm OID
    ...[6, 13],
    ...[43, 6, 1, 4, 1, 130, 220, 124, 5, 3, 1, 2, 1],
    // Curve OID
    ...[6, 12],
    ...[43, 6, 1, 4, 1, 130, 220, 124, 5, 3, 2, 1]
  ]);
  function wrapDER(payload, oid) {
    const bitStringHeaderLength = 2 + encodeLenBytes(payload.byteLength + 1);
    const len = oid.byteLength + bitStringHeaderLength + payload.byteLength;
    let offset = 0;
    const buf = new Uint8Array(1 + encodeLenBytes(len) + len);
    buf[offset++] = 48;
    offset += encodeLen(buf, offset, len);
    buf.set(oid, offset);
    offset += oid.byteLength;
    buf[offset++] = 3;
    offset += encodeLen(buf, offset, payload.byteLength + 1);
    buf[offset++] = 0;
    buf.set(new Uint8Array(payload), offset);
    return buf;
  }
  var unwrapDER = (derEncoded, oid) => {
    let offset = 0;
    const expect = (n, msg) => {
      if (buf[offset++] !== n) {
        throw InputError.fromCode(new DerDecodeErrorCode(`Expected ${msg} at offset ${offset}`));
      }
    };
    const buf = new Uint8Array(derEncoded);
    expect(48, "sequence");
    offset += decodeLenBytes(buf, offset);
    if (!uint8Equals(buf.slice(offset, offset + oid.byteLength), oid)) {
      throw InputError.fromCode(new DerDecodeErrorCode("Not the expected OID."));
    }
    offset += oid.byteLength;
    expect(3, "bit string");
    const payloadLen = decodeLen(buf, offset) - 1;
    offset += decodeLenBytes(buf, offset);
    expect(0, "0 padding");
    const result = buf.slice(offset);
    if (payloadLen !== result.length) {
      throw InputError.fromCode(new DerDecodeLengthMismatchErrorCode(payloadLen, result.length));
    }
    return result;
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/public_key.js
  var Ed25519PublicKey = class _Ed25519PublicKey {
    static from(key) {
      return this.fromDer(key.toDer());
    }
    static fromRaw(rawKey) {
      return new _Ed25519PublicKey(rawKey);
    }
    static fromDer(derKey) {
      return new _Ed25519PublicKey(this.derDecode(derKey));
    }
    static {
      this.RAW_KEY_LENGTH = 32;
    }
    static derEncode(publicKey) {
      return wrapDER(publicKey, ED25519_OID);
    }
    static derDecode(key) {
      const unwrapped = unwrapDER(key, ED25519_OID);
      if (unwrapped.length !== this.RAW_KEY_LENGTH) {
        throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
      }
      return unwrapped;
    }
    #rawKey;
    get rawKey() {
      return this.#rawKey;
    }
    #derKey;
    get derKey() {
      return this.#derKey;
    }
    // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
    constructor(key) {
      if (key.byteLength !== _Ed25519PublicKey.RAW_KEY_LENGTH) {
        throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
      }
      this.#rawKey = key;
      this.#derKey = _Ed25519PublicKey.derEncode(key);
    }
    toDer() {
      return this.derKey;
    }
    toRaw() {
      return this.rawKey;
    }
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/observable.js
  var Observable = class {
    constructor() {
      this.observers = [];
    }
    subscribe(func) {
      this.observers.push(func);
    }
    unsubscribe(func) {
      this.observers = this.observers.filter((observer) => observer !== func);
    }
    notify(data, ...rest) {
      this.observers.forEach((observer) => observer(data, ...rest));
    }
  };
  var ObservableLog = class extends Observable {
    constructor() {
      super();
    }
    print(message, ...rest) {
      this.notify({ message, level: "info" }, ...rest);
    }
    warn(message, ...rest) {
      this.notify({ message, level: "warn" }, ...rest);
    }
    error(message, error, ...rest) {
      this.notify({ message, level: "error", error }, ...rest);
    }
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/polling/backoff.js
  var RANDOMIZATION_FACTOR = 0.5;
  var MULTIPLIER = 1.5;
  var INITIAL_INTERVAL_MSEC = 500;
  var MAX_INTERVAL_MSEC = 6e4;
  var MAX_ELAPSED_TIME_MSEC = 9e5;
  var MAX_ITERATIONS = 10;
  var ExponentialBackoff = class _ExponentialBackoff {
    #currentInterval;
    #randomizationFactor;
    #multiplier;
    #maxInterval;
    #startTime;
    #maxElapsedTime;
    #maxIterations;
    #date;
    #count = 0;
    static {
      this.default = {
        initialInterval: INITIAL_INTERVAL_MSEC,
        randomizationFactor: RANDOMIZATION_FACTOR,
        multiplier: MULTIPLIER,
        maxInterval: MAX_INTERVAL_MSEC,
        // 1 minute
        maxElapsedTime: MAX_ELAPSED_TIME_MSEC,
        maxIterations: MAX_ITERATIONS,
        date: Date
      };
    }
    constructor(options = _ExponentialBackoff.default) {
      const { initialInterval = INITIAL_INTERVAL_MSEC, randomizationFactor = RANDOMIZATION_FACTOR, multiplier = MULTIPLIER, maxInterval = MAX_INTERVAL_MSEC, maxElapsedTime = MAX_ELAPSED_TIME_MSEC, maxIterations = MAX_ITERATIONS, date: date3 = Date } = options;
      this.#currentInterval = initialInterval;
      this.#randomizationFactor = randomizationFactor;
      this.#multiplier = multiplier;
      this.#maxInterval = maxInterval;
      this.#date = date3;
      this.#startTime = date3.now();
      this.#maxElapsedTime = maxElapsedTime;
      this.#maxIterations = maxIterations;
    }
    get ellapsedTimeInMsec() {
      return this.#date.now() - this.#startTime;
    }
    get currentInterval() {
      return this.#currentInterval;
    }
    get count() {
      return this.#count;
    }
    get randomValueFromInterval() {
      const delta = this.#randomizationFactor * this.#currentInterval;
      const min = this.#currentInterval - delta;
      const max = this.#currentInterval + delta;
      return Math.random() * (max - min) + min;
    }
    incrementCurrentInterval() {
      this.#currentInterval = Math.min(this.#currentInterval * this.#multiplier, this.#maxInterval);
      this.#count++;
      return this.#currentInterval;
    }
    next() {
      if (this.ellapsedTimeInMsec >= this.#maxElapsedTime || this.#count >= this.#maxIterations) {
        return null;
      } else {
        this.incrementCurrentInterval();
        return this.randomValueFromInterval;
      }
    }
  };

  // node_modules/@icp-sdk/core/lib/esm/agent/agent/http/index.js
  var RequestStatusResponseStatus;
  (function(RequestStatusResponseStatus2) {
    RequestStatusResponseStatus2["Received"] = "received";
    RequestStatusResponseStatus2["Processing"] = "processing";
    RequestStatusResponseStatus2["Replied"] = "replied";
    RequestStatusResponseStatus2["Rejected"] = "rejected";
    RequestStatusResponseStatus2["Unknown"] = "unknown";
    RequestStatusResponseStatus2["Done"] = "done";
  })(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
  var MINUTE_TO_MSECS = 60 * 1e3;
  var MSECS_TO_NANOSECONDS = 1e6;
  var DEFAULT_TIME_DIFF_MSECS = 0;
  var IC_ROOT_KEY = "308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100814c0e6ec71fab583b08bd81373c255c3c371b2e84863c98a4f1e08b74235d14fb5d9c0cd546d9685f913a0c0b2cc5341583bf4b4392e467db96d65b9bb4cb717112f8472e0d5a4d14505ffd7484b01291091c5f87b98883463f98091a0baaae";
  var IC0_DOMAIN = "ic0.app";
  var IC0_SUB_DOMAIN = ".ic0.app";
  var ICP0_DOMAIN = "icp0.io";
  var ICP0_SUB_DOMAIN = ".icp0.io";
  var ICP_API_DOMAIN = "icp-api.io";
  var ICP_API_SUB_DOMAIN = ".icp-api.io";
  var HTTP_STATUS_OK = 200;
  var HTTP_STATUS_ACCEPTED = 202;
  var HTTP_STATUS_NOT_FOUND = 404;
  function getDefaultFetch() {
    let defaultFetch;
    if (typeof window !== "undefined") {
      if (window.fetch) {
        defaultFetch = window.fetch.bind(window);
      } else {
        throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. You appear to be in a browser context, but window.fetch was not present."));
      }
    } else if (typeof global !== "undefined") {
      if (global.fetch) {
        defaultFetch = global.fetch.bind(global);
      } else {
        throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. You appear to be in a Node.js context, but global.fetch was not available."));
      }
    } else if (typeof self !== "undefined") {
      if (self.fetch) {
        defaultFetch = self.fetch.bind(self);
      }
    }
    if (defaultFetch) {
      return defaultFetch;
    }
    throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. Please provide fetch to the HttpAgent constructor, or ensure it is available in the window or global context."));
  }
  function determineHost(configuredHost) {
    let host;
    if (configuredHost !== void 0) {
      if (!configuredHost.match(/^[a-z]+:/) && typeof window !== "undefined") {
        host = new URL(window.location.protocol + "//" + configuredHost);
      } else {
        host = new URL(configuredHost);
      }
    } else {
      const knownHosts = ["ic0.app", "icp0.io", "127.0.0.1", "localhost"];
      const remoteHosts = [".github.dev", ".gitpod.io"];
      const location = typeof window !== "undefined" ? window.location : void 0;
      const hostname = location?.hostname;
      let knownHost;
      if (hostname && typeof hostname === "string") {
        if (remoteHosts.some((host2) => hostname.endsWith(host2))) {
          knownHost = hostname;
        } else {
          knownHost = knownHosts.find((host2) => hostname.endsWith(host2));
        }
      }
      if (location && knownHost) {
        host = new URL(`${location.protocol}//${knownHost}${location.port ? ":" + location.port : ""}`);
      } else {
        host = new URL("https://icp-api.io");
      }
    }
    return host.toString();
  }
  var HttpAgent = class _HttpAgent {
    #rootKeyPromise;
    #shouldFetchRootKey;
    #timeDiffMsecs;
    #hasSyncedTime;
    #syncTimePromise;
    #shouldSyncTime;
    #identity;
    #fetch;
    #fetchOptions;
    #callOptions;
    #credentials;
    #retryTimes;
    // Retry requests N times before erroring by default
    #backoffStrategy;
    #maxIngressExpiryInMinutes;
    get #maxIngressExpiryInMs() {
      return this.#maxIngressExpiryInMinutes * MINUTE_TO_MSECS;
    }
    #queryPipeline;
    #updatePipeline;
    #subnetKeys;
    #verifyQuerySignatures;
    /**
     * @param options - Options for the HttpAgent
     * @deprecated Use `HttpAgent.create` or `HttpAgent.createSync` instead
     */
    constructor(options = {}) {
      this.#rootKeyPromise = null;
      this.#shouldFetchRootKey = false;
      this.#timeDiffMsecs = DEFAULT_TIME_DIFF_MSECS;
      this.#hasSyncedTime = false;
      this.#syncTimePromise = null;
      this.#shouldSyncTime = false;
      this._isAgent = true;
      this.config = {};
      this.log = new ObservableLog();
      this.#queryPipeline = [];
      this.#updatePipeline = [];
      this.#subnetKeys = new ExpirableMap({
        expirationTime: 5 * MINUTE_TO_MSECS
      });
      this.#verifyQuerySignatures = true;
      this.#verifyQueryResponse = (queryResponse, subnetNodeKeys) => {
        if (this.#verifyQuerySignatures === false) {
          return queryResponse;
        }
        const { status, signatures = [], requestId } = queryResponse;
        for (const sig of signatures) {
          const { timestamp, identity } = sig;
          const nodeId = Principal.fromUint8Array(identity).toText();
          let hash;
          if (status === QueryResponseStatus.Replied) {
            const { reply } = queryResponse;
            hash = hashOfMap({
              status,
              reply,
              timestamp: BigInt(timestamp),
              request_id: requestId
            });
          } else if (status === QueryResponseStatus.Rejected) {
            const { reject_code, reject_message, error_code } = queryResponse;
            hash = hashOfMap({
              status,
              reject_code,
              reject_message,
              error_code,
              timestamp: BigInt(timestamp),
              request_id: requestId
            });
          } else {
            throw UnknownError.fromCode(new UnexpectedErrorCode(`Unknown status: ${status}`));
          }
          const separatorWithHash = concatBytes(IC_RESPONSE_DOMAIN_SEPARATOR, hash);
          const pubKey = subnetNodeKeys.get(nodeId);
          if (!pubKey) {
            throw ProtocolError.fromCode(new MalformedPublicKeyErrorCode());
          }
          const rawKey = Ed25519PublicKey.fromDer(pubKey).rawKey;
          const valid = ed25519.verify(sig.signature, separatorWithHash, rawKey);
          if (!valid) {
            throw TrustError.fromCode(new QuerySignatureVerificationFailedErrorCode(nodeId));
          }
        }
        return queryResponse;
      };
      this.config = options;
      this.#fetch = options.fetch || getDefaultFetch() || fetch.bind(global);
      this.#fetchOptions = options.fetchOptions;
      this.#callOptions = options.callOptions;
      this.#shouldFetchRootKey = options.shouldFetchRootKey ?? false;
      this.#shouldSyncTime = options.shouldSyncTime ?? false;
      if (options.rootKey) {
        this.rootKey = options.rootKey;
      } else if (this.#shouldFetchRootKey) {
        this.rootKey = null;
      } else {
        this.rootKey = hexToBytes(IC_ROOT_KEY);
      }
      const host = determineHost(options.host);
      this.host = new URL(host);
      if (options.verifyQuerySignatures !== void 0) {
        this.#verifyQuerySignatures = options.verifyQuerySignatures;
      }
      this.#retryTimes = options.retryTimes ?? 3;
      const defaultBackoffFactory = () => new ExponentialBackoff({
        maxIterations: this.#retryTimes
      });
      this.#backoffStrategy = options.backoffStrategy || defaultBackoffFactory;
      if (this.host.hostname.endsWith(IC0_SUB_DOMAIN)) {
        this.host.hostname = IC0_DOMAIN;
      } else if (this.host.hostname.endsWith(ICP0_SUB_DOMAIN)) {
        this.host.hostname = ICP0_DOMAIN;
      } else if (this.host.hostname.endsWith(ICP_API_SUB_DOMAIN)) {
        this.host.hostname = ICP_API_DOMAIN;
      }
      if (options.credentials) {
        const { name, password } = options.credentials;
        this.#credentials = `${name}${password ? ":" + password : ""}`;
      }
      this.#identity = Promise.resolve(options.identity || new AnonymousIdentity());
      if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes > 5) {
        throw InputError.fromCode(new IngressExpiryInvalidErrorCode("The maximum ingress expiry time is 5 minutes.", options.ingressExpiryInMinutes));
      }
      if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes <= 0) {
        throw InputError.fromCode(new IngressExpiryInvalidErrorCode("Ingress expiry time must be greater than 0.", options.ingressExpiryInMinutes));
      }
      this.#maxIngressExpiryInMinutes = options.ingressExpiryInMinutes || 5;
      this.addTransform("update", makeNonceTransform(makeNonce));
      if (options.useQueryNonces) {
        this.addTransform("query", makeNonceTransform(makeNonce));
      }
      if (options.logToConsole) {
        this.log.subscribe((log) => {
          if (log.level === "error") {
            console.error(log.message);
          } else if (log.level === "warn") {
            console.warn(log.message);
          } else {
            console.log(log.message);
          }
        });
      }
    }
    static createSync(options = {}) {
      return new this({ ...options });
    }
    static async create(options = {}) {
      const agent = _HttpAgent.createSync(options);
      await agent.#asyncGuard();
      return agent;
    }
    static async from(agent) {
      try {
        if ("config" in agent) {
          return await _HttpAgent.create(agent.config);
        }
        return await _HttpAgent.create({
          fetch: agent._fetch,
          fetchOptions: agent._fetchOptions,
          callOptions: agent._callOptions,
          host: agent._host.toString(),
          identity: agent._identity ?? void 0
        });
      } catch {
        throw InputError.fromCode(new CreateHttpAgentErrorCode());
      }
    }
    isLocal() {
      const hostname = this.host.hostname;
      return hostname === "127.0.0.1" || hostname.endsWith("127.0.0.1");
    }
    addTransform(type, fn, priority = fn.priority || 0) {
      if (type === "update") {
        const i = this.#updatePipeline.findIndex((x4) => (x4.priority || 0) < priority);
        this.#updatePipeline.splice(i >= 0 ? i : this.#updatePipeline.length, 0, Object.assign(fn, { priority }));
      } else if (type === "query") {
        const i = this.#queryPipeline.findIndex((x4) => (x4.priority || 0) < priority);
        this.#queryPipeline.splice(i >= 0 ? i : this.#queryPipeline.length, 0, Object.assign(fn, { priority }));
      }
    }
    async getPrincipal() {
      if (!this.#identity) {
        throw ExternalError.fromCode(new IdentityInvalidErrorCode());
      }
      return (await this.#identity).getPrincipal();
    }
    /**
     * Makes a call to a canister method.
     * @param canisterId - The ID of the canister to call. Can be a Principal or a string.
     * @param options - Options for the call.
     * @param options.methodName - The name of the method to call.
     * @param options.arg - The argument to pass to the method, as a Uint8Array.
     * @param options.effectiveCanisterId - (Optional) The effective canister ID, if different from the target canister ID.
     * @param options.callSync - (Optional) Whether to use synchronous call mode. Defaults to true.
     * @param options.nonce - (Optional) A unique nonce for the request. If provided, it will override any nonce set by transforms.
     * @param identity - (Optional) The identity to use for the call. If not provided, the agent's current identity will be used.
     * @returns A promise that resolves to the response of the call, including the request ID and response details.
     */
    async call(canisterId, options, identity) {
      const callSync = options.callSync ?? true;
      const id = await (identity ?? this.#identity);
      if (!id) {
        throw ExternalError.fromCode(new IdentityInvalidErrorCode());
      }
      const canister = Principal.from(canisterId);
      const ecid = options.effectiveCanisterId ? Principal.from(options.effectiveCanisterId) : canister;
      await this.#asyncGuard(ecid);
      const sender = id.getPrincipal();
      const ingress_expiry = calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs);
      const submit = {
        request_type: SubmitRequestType.Call,
        canister_id: canister,
        method_name: options.methodName,
        arg: options.arg,
        sender,
        ingress_expiry
      };
      let transformedRequest = await this._transform({
        request: {
          body: null,
          method: "POST",
          headers: {
            "Content-Type": "application/cbor",
            ...this.#credentials ? { Authorization: "Basic " + btoa(this.#credentials) } : {}
          }
        },
        endpoint: Endpoint.Call,
        body: submit
      });
      let nonce;
      if (options?.nonce) {
        nonce = toNonce(options.nonce);
      } else if (transformedRequest.body.nonce) {
        nonce = toNonce(transformedRequest.body.nonce);
      } else {
        nonce = void 0;
      }
      submit.nonce = nonce;
      function toNonce(buf) {
        return Object.assign(buf, { __nonce__: void 0 });
      }
      transformedRequest = await id.transformRequest(transformedRequest);
      const body = encode2(transformedRequest.body);
      const backoff = this.#backoffStrategy();
      const requestId = requestIdOf(submit);
      try {
        const requestSync = () => {
          const url2 = new URL(`/api/v4/canister/${ecid.toText()}/call`, this.host);
          this.log.print(`fetching "${url2.pathname}" with request:`, transformedRequest);
          return this.#fetch(url2, {
            ...this.#callOptions,
            ...transformedRequest.request,
            body
          });
        };
        const requestAsync = () => {
          const url2 = new URL(`/api/v2/canister/${ecid.toText()}/call`, this.host);
          this.log.print(`fetching "${url2.pathname}" with request:`, transformedRequest);
          return this.#fetch(url2, {
            ...this.#callOptions,
            ...transformedRequest.request,
            body
          });
        };
        const requestFn = callSync ? requestSync : requestAsync;
        const { responseBodyBytes, ...response } = await this.#requestAndRetry({
          requestFn,
          backoff,
          tries: 0
        });
        const responseBody = responseBodyBytes.byteLength > 0 ? decode2(responseBodyBytes) : null;
        return {
          requestId,
          response: {
            ...response,
            body: responseBody
          },
          requestDetails: submit
        };
      } catch (error) {
        let callError;
        if (error instanceof AgentError) {
          if (error.hasCode(HttpV4ApiNotSupportedErrorCode)) {
            this.log.warn("v4 api not supported. Fall back to v2");
            return this.call(canisterId, {
              ...options,
              // disable v4 api
              callSync: false
            }, identity);
          } else if (error.hasCode(IngressExpiryInvalidErrorCode) && !this.#hasSyncedTime) {
            await this.syncTime(canister);
            return this.call(canister, options, identity);
          } else {
            error.code.requestContext = {
              requestId,
              senderPubKey: transformedRequest.body.sender_pubkey,
              senderSignature: transformedRequest.body.sender_sig,
              ingressExpiry: transformedRequest.body.content.ingress_expiry
            };
            callError = error;
          }
        } else {
          callError = UnknownError.fromCode(new UnexpectedErrorCode(error));
        }
        this.log.error(`Error while making call: ${callError.message}`, callError);
        throw callError;
      }
    }
    async #requestAndRetryQuery(args) {
      const { ecid, transformedRequest, body, requestId, backoff, tries } = args;
      const delay = tries === 0 ? 0 : backoff.next();
      const url2 = new URL(`/api/v3/canister/${ecid.toString()}/query`, this.host);
      this.log.print(`fetching "${url2.pathname}" with tries:`, {
        tries,
        backoff,
        delay
      });
      if (delay === null) {
        throw UnknownError.fromCode(new TimeoutWaitingForResponseErrorCode(`Backoff strategy exhausted after ${tries} attempts.`, requestId));
      }
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      let fetchResponse;
      try {
        this.log.print(`fetching "${url2.pathname}" with request:`, transformedRequest);
        fetchResponse = await this.#fetch(url2, {
          ...this.#fetchOptions,
          ...transformedRequest.request,
          body
        });
      } catch (error) {
        if (tries < this.#retryTimes) {
          this.log.warn(`Caught exception while attempting to make query:
  ${error}
  Retrying query.`);
          return await this.#requestAndRetryQuery({ ...args, tries: tries + 1 });
        }
        throw TransportError.fromCode(new HttpFetchErrorCode(error));
      }
      const headers = httpHeadersTransform(fetchResponse.headers);
      if (fetchResponse.status !== HTTP_STATUS_OK) {
        const responseText = await fetchResponse.text();
        if (isIngressExpiryInvalidResponse(responseText)) {
          throw InputError.fromCode(new IngressExpiryInvalidErrorCode(responseText, this.#maxIngressExpiryInMinutes));
        }
        if (tries < this.#retryTimes) {
          return await this.#requestAndRetryQuery({ ...args, tries: tries + 1 });
        }
        throw ProtocolError.fromCode(new HttpErrorCode(fetchResponse.status, fetchResponse.statusText, headers, responseText));
      }
      const queryResponse = decode2(uint8FromBufLike2(await fetchResponse.arrayBuffer()));
      const response = {
        ...queryResponse,
        httpDetails: {
          ok: fetchResponse.ok,
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers
        },
        requestId
      };
      if (!this.#verifyQuerySignatures) {
        return response;
      }
      const signatureTimestampNs = response.signatures?.[0]?.timestamp;
      if (!signatureTimestampNs) {
        throw ProtocolError.fromCode(new MalformedSignatureErrorCode("Timestamp not found in query response. This suggests a malformed or malicious response."));
      }
      const signatureTimestampMs = Number(BigInt(signatureTimestampNs) / BigInt(MSECS_TO_NANOSECONDS));
      const currentTimestampInMs = Date.now() + this.#timeDiffMsecs;
      if (currentTimestampInMs - signatureTimestampMs > this.#maxIngressExpiryInMs) {
        if (tries < this.#retryTimes) {
          this.log.warn("Timestamp is older than the max ingress expiry. Retrying query.", {
            requestId,
            signatureTimestampMs
          });
          await this.syncTime(ecid);
          return await this.#requestAndRetryQuery({ ...args, tries: tries + 1 });
        }
        throw TrustError.fromCode(new CertificateOutdatedErrorCode(this.#maxIngressExpiryInMinutes, requestId, tries));
      }
      return response;
    }
    /**
     * Makes a request and retries if it fails.
     * @param args - The arguments for the request.
     * @param args.requestFn - A function that returns a Promise resolving to a Response.
     * @param args.backoff - The backoff strategy to use for retries.
     * @param args.tries - The number of retry attempts made so far.
     * @returns The response from the request, if the status is 200 or 202.
     * See the https://internetcomputer.org/docs/references/ic-interface-spec#http-interface for details on the response statuses.
     * @throws {ProtocolError} if the response status is not 200 or 202, and the retry limit has been reached.
     * @throws {TransportError} if the request fails, and the retry limit has been reached.
     */
    async #requestAndRetry(args) {
      const { requestFn, backoff, tries } = args;
      const delay = tries === 0 ? 0 : backoff.next();
      if (delay === null) {
        throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Retry strategy exhausted after ${tries} attempts.`));
      }
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      let response;
      let responseBodyBytes = new Uint8Array();
      try {
        response = await requestFn();
        if (response.status === HTTP_STATUS_OK) {
          responseBodyBytes = uint8FromBufLike2(await response.clone().arrayBuffer());
        }
      } catch (error) {
        if (tries < this.#retryTimes) {
          this.log.warn(`Caught exception while attempting to make request:
  ${error}
  Retrying request.`);
          return await this.#requestAndRetry({ requestFn, backoff, tries: tries + 1 });
        }
        throw TransportError.fromCode(new HttpFetchErrorCode(error));
      }
      const headers = httpHeadersTransform(response.headers);
      if (response.status === HTTP_STATUS_OK || response.status === HTTP_STATUS_ACCEPTED) {
        return {
          ok: response.ok,
          // should always be true
          status: response.status,
          statusText: response.statusText,
          responseBodyBytes,
          headers
        };
      }
      const responseText = await response.text();
      if (response.status === HTTP_STATUS_NOT_FOUND && response.url.includes("api/v4")) {
        throw ProtocolError.fromCode(new HttpV4ApiNotSupportedErrorCode());
      }
      if (isIngressExpiryInvalidResponse(responseText)) {
        throw InputError.fromCode(new IngressExpiryInvalidErrorCode(responseText, this.#maxIngressExpiryInMinutes));
      }
      if (tries < this.#retryTimes) {
        return await this.#requestAndRetry({ requestFn, backoff, tries: tries + 1 });
      }
      throw ProtocolError.fromCode(new HttpErrorCode(response.status, response.statusText, headers, responseText));
    }
    async query(canisterId, fields, identity) {
      const backoff = this.#backoffStrategy();
      const ecid = fields.effectiveCanisterId ? Principal.from(fields.effectiveCanisterId) : Principal.from(canisterId);
      await this.#asyncGuard(ecid);
      this.log.print(`ecid ${ecid.toString()}`);
      this.log.print(`canisterId ${canisterId.toString()}`);
      let transformedRequest;
      const id = await (identity ?? this.#identity);
      if (!id) {
        throw ExternalError.fromCode(new IdentityInvalidErrorCode());
      }
      const canister = Principal.from(canisterId);
      const sender = id.getPrincipal();
      const ingressExpiry = calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs);
      const request3 = {
        request_type: ReadRequestType.Query,
        canister_id: canister,
        method_name: fields.methodName,
        arg: fields.arg,
        sender,
        ingress_expiry: ingressExpiry
      };
      const requestId = requestIdOf(request3);
      transformedRequest = await this._transform({
        request: {
          method: "POST",
          headers: {
            "Content-Type": "application/cbor",
            ...this.#credentials ? { Authorization: "Basic " + btoa(this.#credentials) } : {}
          }
        },
        endpoint: Endpoint.Query,
        body: request3
      });
      transformedRequest = await id.transformRequest(transformedRequest);
      const body = encode2(transformedRequest.body);
      const args = {
        canister: canister.toText(),
        ecid,
        transformedRequest,
        body,
        requestId,
        backoff,
        tries: 0
      };
      const makeQuery = async () => {
        const query = await this.#requestAndRetryQuery(args);
        return {
          requestDetails: request3,
          ...query
        };
      };
      const getSubnetNodeKeys = async () => {
        const cachedSubnetNodeKeys = this.#subnetKeys.get(ecid.toString());
        if (cachedSubnetNodeKeys) {
          return cachedSubnetNodeKeys;
        }
        await this.fetchSubnetKeys(ecid.toString());
        const subnetNodeKeys = this.#subnetKeys.get(ecid.toString());
        if (!subnetNodeKeys) {
          throw TrustError.fromCode(new MissingSignatureErrorCode());
        }
        return subnetNodeKeys;
      };
      try {
        if (!this.#verifyQuerySignatures) {
          return await makeQuery();
        }
        const [queryWithDetails, subnetNodeKeys] = await Promise.all([
          makeQuery(),
          getSubnetNodeKeys()
        ]);
        try {
          return this.#verifyQueryResponse(queryWithDetails, subnetNodeKeys);
        } catch {
          this.log.warn("Query response verification failed. Retrying with fresh subnet keys.");
          this.#subnetKeys.delete(ecid.toString());
          const updatedSubnetNodeKeys = await getSubnetNodeKeys();
          return this.#verifyQueryResponse(queryWithDetails, updatedSubnetNodeKeys);
        }
      } catch (error) {
        let queryError;
        if (error instanceof AgentError) {
          if (error.hasCode(IngressExpiryInvalidErrorCode) && !this.#hasSyncedTime) {
            await this.syncTime(ecid);
            return this.query(canisterId, fields, identity);
          }
          error.code.requestContext = {
            requestId,
            senderPubKey: transformedRequest.body.sender_pubkey,
            senderSignature: transformedRequest.body.sender_sig,
            ingressExpiry: transformedRequest.body.content.ingress_expiry
          };
          queryError = error;
        } else {
          queryError = UnknownError.fromCode(new UnexpectedErrorCode(error));
        }
        this.log.error(`Error while making query: ${queryError.message}`, queryError);
        throw queryError;
      }
    }
    /**
     * See https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-query for details on validation
     * @param queryResponse - The response from the query
     * @param subnetNodeKeys - The subnet node keys
     * @returns ApiQueryResponse
     */
    #verifyQueryResponse;
    async createReadStateRequest(fields, identity) {
      await this.#asyncGuard();
      const id = await (identity ?? this.#identity);
      if (!id) {
        throw ExternalError.fromCode(new IdentityInvalidErrorCode());
      }
      const sender = id.getPrincipal();
      const transformedRequest = await this._transform({
        request: {
          method: "POST",
          headers: {
            "Content-Type": "application/cbor",
            ...this.#credentials ? { Authorization: "Basic " + btoa(this.#credentials) } : {}
          }
        },
        endpoint: Endpoint.ReadState,
        body: {
          request_type: ReadRequestType.ReadState,
          paths: fields.paths,
          sender,
          ingress_expiry: calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs)
        }
      });
      return id.transformRequest(transformedRequest);
    }
    async readState(canisterId, fields, _identity, request3) {
      await this.#rootKeyGuard();
      const canister = Principal.from(canisterId);
      function getRequestId(options) {
        for (const path of options.paths) {
          const [pathName, value] = path;
          const request_status = new TextEncoder().encode("request_status");
          if (uint8Equals(pathName, request_status)) {
            return value;
          }
        }
      }
      let transformedRequest;
      let requestId;
      if (request3) {
        transformedRequest = request3;
      } else {
        requestId = getRequestId(fields);
        const identity = await this.#identity;
        if (!identity) {
          throw ExternalError.fromCode(new IdentityInvalidErrorCode());
        }
        transformedRequest = await this.createReadStateRequest(fields, identity);
      }
      const url2 = new URL(`/api/v3/canister/${canister.toString()}/read_state`, this.host);
      return await this.#readStateInner(url2, { canisterId: canister }, transformedRequest, requestId);
    }
    /**
     * Reads the state of a subnet from the `/api/v3/subnet/{subnetId}/read_state` endpoint.
     * @param subnetId The ID of the subnet to read the state of. If you have a canister ID, you can use {@link HttpAgent.getSubnetIdFromCanister | getSubnetIdFromCanister} to get the subnet ID.
     * @param options The options for the read state request.
     * @returns The response from the read state request.
     */
    async readSubnetState(subnetId, options) {
      await this.#rootKeyGuard();
      const subnet = Principal.from(subnetId);
      const url2 = new URL(`/api/v3/subnet/${subnet.toString()}/read_state`, this.host);
      const transformedRequest = await this.createReadStateRequest(options, this.#identity ?? void 0);
      return await this.#readStateInner(url2, { subnetId: subnet }, transformedRequest);
    }
    async #readStateInner(url2, principal, transformedRequest, requestId) {
      const backoff = this.#backoffStrategy();
      try {
        const { responseBodyBytes } = await this.#requestAndRetry({
          requestFn: () => this.#fetch(url2, {
            ...this.#fetchOptions,
            ...transformedRequest.request,
            body: encode2(transformedRequest.body)
          }),
          backoff,
          tries: 0
        });
        const decodedResponse = decode2(responseBodyBytes);
        return decodedResponse;
      } catch (error) {
        let readStateError;
        if (error instanceof AgentError) {
          if (error.hasCode(IngressExpiryInvalidErrorCode) && !this.#hasSyncedTime) {
            if ("canisterId" in principal) {
              await this.syncTime(principal.canisterId);
            } else if ("subnetId" in principal) {
              await this.syncTimeWithSubnet(principal.subnetId);
            } else {
              throw UNREACHABLE_ERROR;
            }
            return await this.#readStateInner(url2, principal, transformedRequest, requestId);
          }
          error.code.requestContext = {
            requestId: requestId ?? requestIdOf(transformedRequest),
            senderPubKey: transformedRequest.body.sender_pubkey,
            senderSignature: transformedRequest.body.sender_sig,
            ingressExpiry: transformedRequest.body.content.ingress_expiry
          };
          readStateError = error;
        } else {
          readStateError = UnknownError.fromCode(new UnexpectedErrorCode(error));
        }
        this.log.error(`Error while making read state: ${readStateError.message}`, readStateError);
        throw readStateError;
      }
    }
    parseTimeFromResponse(response) {
      let tree;
      if (response.certificate) {
        const decoded = decode2(response.certificate);
        if (decoded && "tree" in decoded) {
          tree = decoded.tree;
        } else {
          throw ProtocolError.fromCode(new HashTreeDecodeErrorCode("Could not decode time from response"));
        }
        const timeLookup = lookup_path(["time"], tree);
        if (timeLookup.status !== LookupPathStatus.Found) {
          throw ProtocolError.fromCode(new LookupErrorCode("Time was not found in the response or was not in its expected format.", timeLookup.status));
        }
        if (!(timeLookup.value instanceof Uint8Array) && !ArrayBuffer.isView(timeLookup)) {
          throw ProtocolError.fromCode(new MalformedLookupFoundValueErrorCode("Time was not in its expected format."));
        }
        const date3 = decodeTime(timeLookup.value);
        this.log.print("Time from response:", date3);
        this.log.print("Time from response in milliseconds:", date3.getTime());
        return date3.getTime();
      } else {
        this.log.warn("No certificate found in response");
      }
      return 0;
    }
    /**
     * Allows agent to sync its time with the network. Can be called during initialization or mid-lifecycle if the device's clock has drifted away from the network time. This is necessary to set the Expiry for a request
     * @param {Principal} canisterIdOverride - Pass a canister ID if you need to sync the time with a particular subnet. Uses the ICP ledger canister by default.
     */
    async syncTime(canisterIdOverride) {
      this.#syncTimePromise = this.#syncTimePromise ?? (async () => {
        await this.#rootKeyGuard();
        const callTime = Date.now();
        try {
          if (!canisterIdOverride) {
            this.log.print("Syncing time with the IC. No canisterId provided, so falling back to ryjl3-tyaaa-aaaaa-aaaba-cai");
          }
          const canisterId = canisterIdOverride ?? Principal.from("ryjl3-tyaaa-aaaaa-aaaba-cai");
          const anonymousAgent = _HttpAgent.createSync({
            identity: new AnonymousIdentity(),
            host: this.host.toString(),
            fetch: this.#fetch,
            retryTimes: 0,
            rootKey: this.rootKey ?? void 0,
            shouldSyncTime: false
          });
          const replicaTimes = await Promise.all(Array(3).fill(null).map(async () => {
            const status = await request({
              canisterId,
              agent: anonymousAgent,
              paths: ["time"],
              disableCertificateTimeVerification: true
              // avoid recursive calls to syncTime
            });
            const date3 = status.get("time");
            if (date3 instanceof Date) {
              return date3.getTime();
            }
          }, []));
          this.#setTimeDiffMsecs(callTime, replicaTimes);
        } catch (error) {
          const syncTimeError = error instanceof AgentError ? error : UnknownError.fromCode(new UnexpectedErrorCode(error));
          this.log.error("Caught exception while attempting to sync time", syncTimeError);
          throw syncTimeError;
        }
      })();
      await this.#syncTimePromise.finally(() => {
        this.#syncTimePromise = null;
      });
    }
    /**
     * Allows agent to sync its time with the network.
     * @param {Principal} subnetId - Pass the subnet ID you need to sync the time with.
     */
    async syncTimeWithSubnet(subnetId) {
      await this.#rootKeyGuard();
      const callTime = Date.now();
      try {
        const anonymousAgent = _HttpAgent.createSync({
          identity: new AnonymousIdentity(),
          host: this.host.toString(),
          fetch: this.#fetch,
          retryTimes: 0,
          rootKey: this.rootKey ?? void 0,
          shouldSyncTime: false
        });
        const replicaTimes = await Promise.all(Array(3).fill(null).map(async () => {
          const status = await request2({
            subnetId,
            agent: anonymousAgent,
            paths: ["time"],
            disableCertificateTimeVerification: true
            // avoid recursive calls to syncTime
          });
          const date3 = status.get("time");
          if (date3 instanceof Date) {
            return date3.getTime();
          }
        }, []));
        this.#setTimeDiffMsecs(callTime, replicaTimes);
      } catch (error) {
        const syncTimeError = error instanceof AgentError ? error : UnknownError.fromCode(new UnexpectedErrorCode(error));
        this.log.error("Caught exception while attempting to sync time with subnet", syncTimeError);
        throw syncTimeError;
      }
    }
    #setTimeDiffMsecs(callTime, replicaTimes) {
      const maxReplicaTime = replicaTimes.reduce((max, current) => {
        return typeof current === "number" && current > max ? current : max;
      }, 0);
      if (maxReplicaTime > 0) {
        this.#timeDiffMsecs = maxReplicaTime - callTime;
        this.#hasSyncedTime = true;
        this.log.notify({
          message: `Syncing time: offset of ${this.#timeDiffMsecs}`,
          level: "info"
        });
      }
    }
    async status() {
      const headers = this.#credentials ? {
        Authorization: "Basic " + btoa(this.#credentials)
      } : {};
      const url2 = new URL(`/api/v2/status`, this.host);
      this.log.print(`fetching "${url2.pathname}"`);
      const backoff = this.#backoffStrategy();
      const { responseBodyBytes } = await this.#requestAndRetry({
        backoff,
        requestFn: () => this.#fetch(url2, { headers, ...this.#fetchOptions }),
        tries: 0
      });
      return decode2(responseBodyBytes);
    }
    async fetchRootKey() {
      this.#rootKeyPromise = this.#rootKeyPromise ?? (async () => {
        const value = await this.status();
        this.rootKey = value.root_key;
        return this.rootKey;
      })();
      return await this.#rootKeyPromise.finally(() => {
        this.#rootKeyPromise = null;
      });
    }
    async #asyncGuard(canisterIdOverride) {
      await Promise.all([this.#rootKeyGuard(), this.#syncTimeGuard(canisterIdOverride)]);
    }
    async #rootKeyGuard() {
      if (this.rootKey) {
        return;
      } else if (this.rootKey === null && this.host.toString() !== "https://icp-api.io" && this.#shouldFetchRootKey) {
        await this.fetchRootKey();
      } else {
        throw ExternalError.fromCode(new MissingRootKeyErrorCode(this.#shouldFetchRootKey));
      }
    }
    async #syncTimeGuard(canisterIdOverride) {
      if (this.#shouldSyncTime && !this.hasSyncedTime()) {
        await this.syncTime(canisterIdOverride);
      }
    }
    invalidateIdentity() {
      this.#identity = null;
    }
    replaceIdentity(identity) {
      this.#identity = Promise.resolve(identity);
    }
    async fetchSubnetKeys(canisterId) {
      const effectiveCanisterId = Principal.from(canisterId);
      await this.#asyncGuard(effectiveCanisterId);
      const rootKey = this.rootKey;
      const canisterReadState = await this.readState(effectiveCanisterId, {
        paths: [[utf8ToBytes("subnet")]]
      });
      const canisterCertificate = await Certificate.create({
        certificate: canisterReadState.certificate,
        rootKey,
        principal: { canisterId: effectiveCanisterId },
        agent: this
      });
      if (!canisterCertificate.cert.delegation) {
        const subnetId2 = Principal.selfAuthenticating(rootKey);
        const canisterInRange = check_canister_ranges({
          canisterId: effectiveCanisterId,
          subnetId: subnetId2,
          tree: canisterCertificate.cert.tree
        });
        if (!canisterInRange) {
          throw TrustError.fromCode(new CertificateNotAuthorizedErrorCode(effectiveCanisterId, subnetId2));
        }
      }
      const subnetId = getSubnetIdFromCertificate(canisterCertificate.cert, rootKey);
      const nodeKeys = lookupNodeKeysFromCertificate(canisterCertificate.cert, subnetId);
      this.#subnetKeys.set(effectiveCanisterId.toText(), nodeKeys);
      return nodeKeys;
    }
    /**
     * Returns the subnet ID for a given canister ID, by looking at the certificate delegation
     * returned by the canister's state obtained by requesting the `/time` path with {@link HttpAgent.readState | readState}.
     * @param canisterId The canister ID to get the subnet ID for.
     * @returns The subnet ID for the given canister ID.
     */
    async getSubnetIdFromCanister(canisterId) {
      const effectiveCanisterId = Principal.from(canisterId);
      await this.#asyncGuard(effectiveCanisterId);
      const canisterReadState = await this.readState(effectiveCanisterId, {
        paths: [[utf8ToBytes("time")]]
      });
      const canisterCertificate = await Certificate.create({
        certificate: canisterReadState.certificate,
        rootKey: this.rootKey,
        principal: { canisterId: effectiveCanisterId },
        agent: this
      });
      return getSubnetIdFromCertificate(canisterCertificate.cert, this.rootKey);
    }
    _transform(request3) {
      let p4 = Promise.resolve(request3);
      if (request3.endpoint === Endpoint.Call) {
        for (const fn of this.#updatePipeline) {
          p4 = p4.then((r2) => fn(r2).then((r22) => r22 || r2));
        }
      } else {
        for (const fn of this.#queryPipeline) {
          p4 = p4.then((r2) => fn(r2).then((r22) => r22 || r2));
        }
      }
      return p4;
    }
    /**
     * Returns the time difference in milliseconds between the IC network clock and the client's clock,
     * after the clock has been synced.
     *
     * If the time has not been synced, returns `0`.
     */
    getTimeDiffMsecs() {
      return this.#timeDiffMsecs;
    }
    /**
     * Returns `true` if the time has been synced at least once with the IC network, `false` otherwise.
     */
    hasSyncedTime() {
      return this.#hasSyncedTime;
    }
  };
  function calculateIngressExpiry(maxIngressExpiryInMinutes, timeDiffMsecs) {
    const ingressExpiryMs = maxIngressExpiryInMinutes * MINUTE_TO_MSECS;
    return Expiry.fromDeltaInMilliseconds(ingressExpiryMs, timeDiffMsecs);
  }
  function isIngressExpiryInvalidResponse(responseText) {
    return responseText.includes("Invalid request expiry: ");
  }

  // node_modules/@dfinity/utils/dist/index.js
  var U2 = ((n) => (n[n.FractionalMoreThan8Decimals = 0] = "FractionalMoreThan8Decimals", n[n.InvalidFormat = 1] = "InvalidFormat", n[n.FractionalTooManyDecimals = 2] = "FractionalTooManyDecimals", n))(U2 || {});
  var _2 = BigInt(1e8);
  var u = (e3) => e3 == null;
  var s2 = (e3) => !u(e3);
  var j2 = (e3) => s2(e3) && e3 !== "";
  var A3 = class extends Error {
  };
  var f = (e3, t) => {
    if (e3 == null) throw new A3(t);
  };
  var g2 = "abcdefghijklmnopqrstuvwxyz234567";
  var b3 = /* @__PURE__ */ Object.create(null);
  for (let e3 = 0; e3 < g2.length; e3++) b3[g2[e3]] = e3;
  b3[0] = b3.o;
  b3[1] = b3.i;
  var Mt = (e3) => btoa(String.fromCharCode(...new Uint8Array(e3)));
  var vt = (e3) => Uint8Array.from(atob(e3), (t) => t.charCodeAt(0));
  var $2 = new Uint32Array([0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117]);
  var ne = (e3) => s2(e3) ? [e3] : [];

  // node_modules/@icp-sdk/canisters/chunk-MEJ4NRNT.js
  var he = BigInt(1095062083);
  var Te = BigInt(1347768404);
  var y3 = BigInt(1e4);
  var Re = BigInt(1e8);
  var Q2 = ({ fromSubAccount: e3, to: n, amount: t, fee: r2, icrc1Memo: i, createdAt: c2 }) => ({ to: n, fee: ne(r2 ?? y3), amount: t, memo: ne(i), created_at_time: ne(c2), from_subaccount: ne(e3) });
  var X3 = ({ fee: e3, createdAt: n, icrc1Memo: t, fromSubAccount: r2, expected_allowance: i, expires_at: c2, amount: h2, ...T4 }) => ({ ...T4, fee: ne(e3 ?? y3), memo: ne(t), from_subaccount: ne(r2), created_at_time: ne(n), amount: h2, expected_allowance: ne(i), expires_at: ne(c2) });
  var u2 = class extends Error {
  };
  var a3 = class extends u2 {
  };
  var o2 = class extends u2 {
  };
  var l2 = class extends a3 {
    constructor(t) {
      super();
      this.balance = t;
    }
  };
  var x2 = class extends a3 {
    constructor(t) {
      super();
      this.allowed_window_secs = t;
    }
  };
  var g3 = class extends a3 {
  };
  var b4 = class extends a3 {
    constructor(t) {
      super();
      this.duplicateOf = t;
    }
  };
  var m3 = class extends u2 {
    constructor(t) {
      super();
      this.expectedFee = t;
    }
  };
  var _3 = class extends o2 {
    constructor(t, r2) {
      super();
      this.message = t;
      this.error_code = r2;
    }
  };
  var w3 = class extends o2 {
  };
  var N2 = class extends o2 {
    constructor(t) {
      super();
      this.duplicateOf = t;
    }
  };
  var C3 = class extends o2 {
    constructor(t) {
      super();
      this.currentAllowance = t;
    }
  };
  var D2 = class extends o2 {
  };
  var B3 = class extends o2 {
  };
  var S3 = class extends o2 {
    constructor(t) {
      super();
      this.ledgerTime = t;
    }
  };
  var W2 = (e3) => "Duplicate" in e3 ? new b4(e3.Duplicate.duplicate_of) : "InsufficientFunds" in e3 ? new l2(e3.InsufficientFunds.balance) : "CreatedInFuture" in e3 ? new g3() : "TooOld" in e3 ? new x2() : "BadFee" in e3 ? new m3(e3.BadFee.expected_fee) : new a3(`Unknown error type ${JSON.stringify(e3)}`);
  var Y2 = (e3) => "GenericError" in e3 ? new _3(e3.GenericError.message, e3.GenericError.error_code) : "TemporarilyUnavailable" in e3 ? new w3() : "Duplicate" in e3 ? new N2(e3.Duplicate.duplicate_of) : "BadFee" in e3 ? new m3(e3.BadFee.expected_fee) : "AllowanceChanged" in e3 ? new C3(e3.AllowanceChanged.current_allowance) : "CreatedInFuture" in e3 ? new D2() : "TooOld" in e3 ? new B3() : "Expired" in e3 ? new S3(e3.Expired.ledger_time) : "InsufficientFunds" in e3 ? new l2(e3.InsufficientFunds.balance) : new o2(`Unknown error type ${JSON.stringify(e3)}`);
  var ee = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
  var te = Principal.fromText("qhbym-qaaaa-aaaaa-aaafq-cai");

  // node_modules/zod/v4/core/core.js
  var NEVER = Object.freeze({
    status: "aborted"
  });
  // @__NO_SIDE_EFFECTS__
  function $constructor(name, initializer3, params) {
    function init(inst, def) {
      if (!inst._zod) {
        Object.defineProperty(inst, "_zod", {
          value: {
            def,
            constr: _5,
            traits: /* @__PURE__ */ new Set()
          },
          enumerable: false
        });
      }
      if (inst._zod.traits.has(name)) {
        return;
      }
      inst._zod.traits.add(name);
      initializer3(inst, def);
      const proto = _5.prototype;
      const keys = Object.keys(proto);
      for (let i = 0; i < keys.length; i++) {
        const k5 = keys[i];
        if (!(k5 in inst)) {
          inst[k5] = proto[k5].bind(inst);
        }
      }
    }
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {
    }
    Object.defineProperty(Definition, "name", { value: name });
    function _5(def) {
      var _a3;
      const inst = params?.Parent ? new Definition() : this;
      init(inst, def);
      (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
      for (const fn of inst._zod.deferred) {
        fn();
      }
      return inst;
    }
    Object.defineProperty(_5, "init", { value: init });
    Object.defineProperty(_5, Symbol.hasInstance, {
      value: (inst) => {
        if (params?.Parent && inst instanceof params.Parent)
          return true;
        return inst?._zod?.traits?.has(name);
      }
    });
    Object.defineProperty(_5, "name", { value: name });
    return _5;
  }
  var $brand = Symbol("zod_brand");
  var $ZodAsyncError = class extends Error {
    constructor() {
      super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
  };
  var $ZodEncodeError = class extends Error {
    constructor(name) {
      super(`Encountered unidirectional transform during encode: ${name}`);
      this.name = "ZodEncodeError";
    }
  };
  var globalConfig = {};
  function config(newConfig) {
    if (newConfig)
      Object.assign(globalConfig, newConfig);
    return globalConfig;
  }

  // node_modules/zod/v4/core/util.js
  var util_exports = {};
  __export(util_exports, {
    BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
    Class: () => Class,
    NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
    aborted: () => aborted,
    allowsEval: () => allowsEval,
    assert: () => assert,
    assertEqual: () => assertEqual,
    assertIs: () => assertIs,
    assertNever: () => assertNever,
    assertNotEqual: () => assertNotEqual,
    assignProp: () => assignProp,
    base64ToUint8Array: () => base64ToUint8Array,
    base64urlToUint8Array: () => base64urlToUint8Array,
    cached: () => cached,
    captureStackTrace: () => captureStackTrace,
    cleanEnum: () => cleanEnum,
    cleanRegex: () => cleanRegex,
    clone: () => clone,
    cloneDef: () => cloneDef,
    createTransparentProxy: () => createTransparentProxy,
    defineLazy: () => defineLazy,
    esc: () => esc,
    escapeRegex: () => escapeRegex,
    extend: () => extend,
    finalizeIssue: () => finalizeIssue,
    floatSafeRemainder: () => floatSafeRemainder,
    getElementAtPath: () => getElementAtPath,
    getEnumValues: () => getEnumValues,
    getLengthableOrigin: () => getLengthableOrigin,
    getParsedType: () => getParsedType,
    getSizableOrigin: () => getSizableOrigin,
    hexToUint8Array: () => hexToUint8Array,
    isObject: () => isObject,
    isPlainObject: () => isPlainObject,
    issue: () => issue,
    joinValues: () => joinValues,
    jsonStringifyReplacer: () => jsonStringifyReplacer,
    merge: () => merge,
    mergeDefs: () => mergeDefs,
    normalizeParams: () => normalizeParams,
    nullish: () => nullish,
    numKeys: () => numKeys,
    objectClone: () => objectClone,
    omit: () => omit,
    optionalKeys: () => optionalKeys,
    parsedType: () => parsedType,
    partial: () => partial,
    pick: () => pick,
    prefixIssues: () => prefixIssues,
    primitiveTypes: () => primitiveTypes,
    promiseAllObject: () => promiseAllObject,
    propertyKeyTypes: () => propertyKeyTypes,
    randomString: () => randomString,
    required: () => required,
    safeExtend: () => safeExtend,
    shallowClone: () => shallowClone,
    slugify: () => slugify,
    stringifyPrimitive: () => stringifyPrimitive,
    uint8ArrayToBase64: () => uint8ArrayToBase64,
    uint8ArrayToBase64url: () => uint8ArrayToBase64url,
    uint8ArrayToHex: () => uint8ArrayToHex,
    unwrapMessage: () => unwrapMessage
  });
  function assertEqual(val) {
    return val;
  }
  function assertNotEqual(val) {
    return val;
  }
  function assertIs(_arg) {
  }
  function assertNever(_x) {
    throw new Error("Unexpected value in exhaustive check");
  }
  function assert(_5) {
  }
  function getEnumValues(entries) {
    const numericValues = Object.values(entries).filter((v3) => typeof v3 === "number");
    const values = Object.entries(entries).filter(([k5, _5]) => numericValues.indexOf(+k5) === -1).map(([_5, v3]) => v3);
    return values;
  }
  function joinValues(array2, separator = "|") {
    return array2.map((val) => stringifyPrimitive(val)).join(separator);
  }
  function jsonStringifyReplacer(_5, value) {
    if (typeof value === "bigint")
      return value.toString();
    return value;
  }
  function cached(getter) {
    const set = false;
    return {
      get value() {
        if (!set) {
          const value = getter();
          Object.defineProperty(this, "value", { value });
          return value;
        }
        throw new Error("cached value already set");
      }
    };
  }
  function nullish(input) {
    return input === null || input === void 0;
  }
  function cleanRegex(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
  }
  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepString = step.toString();
    let stepDecCount = (stepString.split(".")[1] || "").length;
    if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
      const match = stepString.match(/\d?e-(\d?)/);
      if (match?.[1]) {
        stepDecCount = Number.parseInt(match[1]);
      }
    }
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
  }
  var EVALUATING = Symbol("evaluating");
  function defineLazy(object2, key, getter) {
    let value = void 0;
    Object.defineProperty(object2, key, {
      get() {
        if (value === EVALUATING) {
          return void 0;
        }
        if (value === void 0) {
          value = EVALUATING;
          value = getter();
        }
        return value;
      },
      set(v3) {
        Object.defineProperty(object2, key, {
          value: v3
          // configurable: true,
        });
      },
      configurable: true
    });
  }
  function objectClone(obj) {
    return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  }
  function assignProp(target, prop, value) {
    Object.defineProperty(target, prop, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  function mergeDefs(...defs) {
    const mergedDescriptors = {};
    for (const def of defs) {
      const descriptors = Object.getOwnPropertyDescriptors(def);
      Object.assign(mergedDescriptors, descriptors);
    }
    return Object.defineProperties({}, mergedDescriptors);
  }
  function cloneDef(schema) {
    return mergeDefs(schema._zod.def);
  }
  function getElementAtPath(obj, path) {
    if (!path)
      return obj;
    return path.reduce((acc, key) => acc?.[key], obj);
  }
  function promiseAllObject(promisesObj) {
    const keys = Object.keys(promisesObj);
    const promises = keys.map((key) => promisesObj[key]);
    return Promise.all(promises).then((results) => {
      const resolvedObj = {};
      for (let i = 0; i < keys.length; i++) {
        resolvedObj[keys[i]] = results[i];
      }
      return resolvedObj;
    });
  }
  function randomString(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }
  function esc(str) {
    return JSON.stringify(str);
  }
  function slugify(input) {
    return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
  };
  function isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
  }
  var allowsEval = cached(() => {
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
      return false;
    }
    try {
      const F4 = Function;
      new F4("");
      return true;
    } catch (_5) {
      return false;
    }
  });
  function isPlainObject(o3) {
    if (isObject(o3) === false)
      return false;
    const ctor = o3.constructor;
    if (ctor === void 0)
      return true;
    if (typeof ctor !== "function")
      return true;
    const prot = ctor.prototype;
    if (isObject(prot) === false)
      return false;
    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  function shallowClone(o3) {
    if (isPlainObject(o3))
      return { ...o3 };
    if (Array.isArray(o3))
      return [...o3];
    return o3;
  }
  function numKeys(data) {
    let keyCount = 0;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        keyCount++;
      }
    }
    return keyCount;
  }
  var getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
      case "undefined":
        return "undefined";
      case "string":
        return "string";
      case "number":
        return Number.isNaN(data) ? "nan" : "number";
      case "boolean":
        return "boolean";
      case "function":
        return "function";
      case "bigint":
        return "bigint";
      case "symbol":
        return "symbol";
      case "object":
        if (Array.isArray(data)) {
          return "array";
        }
        if (data === null) {
          return "null";
        }
        if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
          return "promise";
        }
        if (typeof Map !== "undefined" && data instanceof Map) {
          return "map";
        }
        if (typeof Set !== "undefined" && data instanceof Set) {
          return "set";
        }
        if (typeof Date !== "undefined" && data instanceof Date) {
          return "date";
        }
        if (typeof File !== "undefined" && data instanceof File) {
          return "file";
        }
        return "object";
      default:
        throw new Error(`Unknown data type: ${t}`);
    }
  };
  var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
  var primitiveTypes = /* @__PURE__ */ new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function clone(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent)
      cl._zod.parent = inst;
    return cl;
  }
  function normalizeParams(_params) {
    const params = _params;
    if (!params)
      return {};
    if (typeof params === "string")
      return { error: () => params };
    if (params?.message !== void 0) {
      if (params?.error !== void 0)
        throw new Error("Cannot specify both `message` and `error` params");
      params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string")
      return { ...params, error: () => params.error };
    return params;
  }
  function createTransparentProxy(getter) {
    let target;
    return new Proxy({}, {
      get(_5, prop, receiver) {
        target ?? (target = getter());
        return Reflect.get(target, prop, receiver);
      },
      set(_5, prop, value, receiver) {
        target ?? (target = getter());
        return Reflect.set(target, prop, value, receiver);
      },
      has(_5, prop) {
        target ?? (target = getter());
        return Reflect.has(target, prop);
      },
      deleteProperty(_5, prop) {
        target ?? (target = getter());
        return Reflect.deleteProperty(target, prop);
      },
      ownKeys(_5) {
        target ?? (target = getter());
        return Reflect.ownKeys(target);
      },
      getOwnPropertyDescriptor(_5, prop) {
        target ?? (target = getter());
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
      defineProperty(_5, prop, descriptor) {
        target ?? (target = getter());
        return Reflect.defineProperty(target, prop, descriptor);
      }
    });
  }
  function stringifyPrimitive(value) {
    if (typeof value === "bigint")
      return value.toString() + "n";
    if (typeof value === "string")
      return `"${value}"`;
    return `${value}`;
  }
  function optionalKeys(shape) {
    return Object.keys(shape).filter((k5) => {
      return shape[k5]._zod.optin === "optional" && shape[k5]._zod.optout === "optional";
    });
  }
  var NUMBER_FORMAT_RANGES = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-34028234663852886e22, 34028234663852886e22],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
  };
  var BIGINT_FORMAT_RANGES = {
    int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
    uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
  };
  function pick(schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
      throw new Error(".pick() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const newShape = {};
        for (const key in mask) {
          if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          newShape[key] = currDef.shape[key];
        }
        assignProp(this, "shape", newShape);
        return newShape;
      },
      checks: []
    });
    return clone(schema, def);
  }
  function omit(schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
      throw new Error(".omit() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const newShape = { ...schema._zod.def.shape };
        for (const key in mask) {
          if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          delete newShape[key];
        }
        assignProp(this, "shape", newShape);
        return newShape;
      },
      checks: []
    });
    return clone(schema, def);
  }
  function extend(schema, shape) {
    if (!isPlainObject(shape)) {
      throw new Error("Invalid input to extend: expected a plain object");
    }
    const checks = schema._zod.def.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
      const existingShape = schema._zod.def.shape;
      for (const key in shape) {
        if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
          throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
        }
      }
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const _shape = { ...schema._zod.def.shape, ...shape };
        assignProp(this, "shape", _shape);
        return _shape;
      }
    });
    return clone(schema, def);
  }
  function safeExtend(schema, shape) {
    if (!isPlainObject(shape)) {
      throw new Error("Invalid input to safeExtend: expected a plain object");
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const _shape = { ...schema._zod.def.shape, ...shape };
        assignProp(this, "shape", _shape);
        return _shape;
      }
    });
    return clone(schema, def);
  }
  function merge(a4, b6) {
    const def = mergeDefs(a4._zod.def, {
      get shape() {
        const _shape = { ...a4._zod.def.shape, ...b6._zod.def.shape };
        assignProp(this, "shape", _shape);
        return _shape;
      },
      get catchall() {
        return b6._zod.def.catchall;
      },
      checks: []
      // delete existing checks
    });
    return clone(a4, def);
  }
  function partial(Class2, schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
      throw new Error(".partial() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const oldShape = schema._zod.def.shape;
        const shape = { ...oldShape };
        if (mask) {
          for (const key in mask) {
            if (!(key in oldShape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
              continue;
            shape[key] = Class2 ? new Class2({
              type: "optional",
              innerType: oldShape[key]
            }) : oldShape[key];
          }
        } else {
          for (const key in oldShape) {
            shape[key] = Class2 ? new Class2({
              type: "optional",
              innerType: oldShape[key]
            }) : oldShape[key];
          }
        }
        assignProp(this, "shape", shape);
        return shape;
      },
      checks: []
    });
    return clone(schema, def);
  }
  function required(Class2, schema, mask) {
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const oldShape = schema._zod.def.shape;
        const shape = { ...oldShape };
        if (mask) {
          for (const key in mask) {
            if (!(key in shape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
              continue;
            shape[key] = new Class2({
              type: "nonoptional",
              innerType: oldShape[key]
            });
          }
        } else {
          for (const key in oldShape) {
            shape[key] = new Class2({
              type: "nonoptional",
              innerType: oldShape[key]
            });
          }
        }
        assignProp(this, "shape", shape);
        return shape;
      }
    });
    return clone(schema, def);
  }
  function aborted(x4, startIndex = 0) {
    if (x4.aborted === true)
      return true;
    for (let i = startIndex; i < x4.issues.length; i++) {
      if (x4.issues[i]?.continue !== true) {
        return true;
      }
    }
    return false;
  }
  function prefixIssues(path, issues) {
    return issues.map((iss) => {
      var _a3;
      (_a3 = iss).path ?? (_a3.path = []);
      iss.path.unshift(path);
      return iss;
    });
  }
  function unwrapMessage(message) {
    return typeof message === "string" ? message : message?.message;
  }
  function finalizeIssue(iss, ctx, config2) {
    const full = { ...iss, path: iss.path ?? [] };
    if (!iss.message) {
      const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
      full.message = message;
    }
    delete full.inst;
    delete full.continue;
    if (!ctx?.reportInput) {
      delete full.input;
    }
    return full;
  }
  function getSizableOrigin(input) {
    if (input instanceof Set)
      return "set";
    if (input instanceof Map)
      return "map";
    if (input instanceof File)
      return "file";
    return "unknown";
  }
  function getLengthableOrigin(input) {
    if (Array.isArray(input))
      return "array";
    if (typeof input === "string")
      return "string";
    return "unknown";
  }
  function parsedType(data) {
    const t = typeof data;
    switch (t) {
      case "number": {
        return Number.isNaN(data) ? "nan" : "number";
      }
      case "object": {
        if (data === null) {
          return "null";
        }
        if (Array.isArray(data)) {
          return "array";
        }
        const obj = data;
        if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
          return obj.constructor.name;
        }
      }
    }
    return t;
  }
  function issue(...args) {
    const [iss, input, inst] = args;
    if (typeof iss === "string") {
      return {
        message: iss,
        code: "custom",
        input,
        inst
      };
    }
    return { ...iss };
  }
  function cleanEnum(obj) {
    return Object.entries(obj).filter(([k5, _5]) => {
      return Number.isNaN(Number.parseInt(k5, 10));
    }).map((el) => el[1]);
  }
  function base64ToUint8Array(base642) {
    const binaryString = atob(base642);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  function uint8ArrayToBase64(bytes) {
    let binaryString = "";
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  }
  function base64urlToUint8Array(base64url2) {
    const base642 = base64url2.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - base642.length % 4) % 4);
    return base64ToUint8Array(base642 + padding);
  }
  function uint8ArrayToBase64url(bytes) {
    return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  function hexToUint8Array(hex) {
    const cleanHex = hex.replace(/^0x/, "");
    if (cleanHex.length % 2 !== 0) {
      throw new Error("Invalid hex string length");
    }
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
    }
    return bytes;
  }
  function uint8ArrayToHex(bytes) {
    return Array.from(bytes).map((b6) => b6.toString(16).padStart(2, "0")).join("");
  }
  var Class = class {
    constructor(..._args) {
    }
  };

  // node_modules/zod/v4/core/errors.js
  var initializer = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
      value: inst._zod,
      enumerable: false
    });
    Object.defineProperty(inst, "issues", {
      value: def,
      enumerable: false
    });
    inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
    Object.defineProperty(inst, "toString", {
      value: () => inst.message,
      enumerable: false
    });
  };
  var $ZodError = $constructor("$ZodError", initializer);
  var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
  function flattenError(error, mapper = (issue2) => issue2.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of error.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  function formatError(error, mapper = (issue2) => issue2.message) {
    const fieldErrors = { _errors: [] };
    const processError = (error2) => {
      for (const issue2 of error2.issues) {
        if (issue2.code === "invalid_union" && issue2.errors.length) {
          issue2.errors.map((issues) => processError({ issues }));
        } else if (issue2.code === "invalid_key") {
          processError({ issues: issue2.issues });
        } else if (issue2.code === "invalid_element") {
          processError({ issues: issue2.issues });
        } else if (issue2.path.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue2.path.length) {
            const el = issue2.path[i];
            const terminal = i === issue2.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(error);
    return fieldErrors;
  }

  // node_modules/zod/v4/core/parse.js
  var _parse = (_Err) => (schema, value, _ctx, _params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    if (result.issues.length) {
      const e3 = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e3, _params?.callee);
      throw e3;
    }
    return result.value;
  };
  var parse = /* @__PURE__ */ _parse($ZodRealError);
  var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      const e3 = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e3, params?.callee);
      throw e3;
    }
    return result.value;
  };
  var parseAsync = /* @__PURE__ */ _parseAsync($ZodRealError);
  var _safeParse = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    return result.issues.length ? {
      success: false,
      error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    } : { success: true, data: result.value };
  };
  var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
  var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    return result.issues.length ? {
      success: false,
      error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    } : { success: true, data: result.value };
  };
  var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
  var _encode = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
    return _parse(_Err)(schema, value, ctx);
  };
  var _decode = (_Err) => (schema, value, _ctx) => {
    return _parse(_Err)(schema, value, _ctx);
  };
  var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
    return _parseAsync(_Err)(schema, value, ctx);
  };
  var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
    return _parseAsync(_Err)(schema, value, _ctx);
  };
  var _safeEncode = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
    return _safeParse(_Err)(schema, value, ctx);
  };
  var _safeDecode = (_Err) => (schema, value, _ctx) => {
    return _safeParse(_Err)(schema, value, _ctx);
  };
  var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
    return _safeParseAsync(_Err)(schema, value, ctx);
  };
  var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
    return _safeParseAsync(_Err)(schema, value, _ctx);
  };

  // node_modules/zod/v4/core/regexes.js
  var cuid = /^[cC][^\s-]{8,}$/;
  var cuid2 = /^[0-9a-z]+$/;
  var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
  var xid = /^[0-9a-vA-V]{20}$/;
  var ksuid = /^[A-Za-z0-9]{27}$/;
  var nanoid = /^[a-zA-Z0-9_-]{21}$/;
  var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
  var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
  var uuid = (version2) => {
    if (!version2)
      return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
    return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
  };
  var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
  var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  function emoji() {
    return new RegExp(_emoji, "u");
  }
  var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
  var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
  var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
  var base64url = /^[A-Za-z0-9_-]*$/;
  var e164 = /^\+[1-9]\d{6,14}$/;
  var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
  var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
  function timeSource(args) {
    const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
    const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
    return regex;
  }
  function time(args) {
    return new RegExp(`^${timeSource(args)}$`);
  }
  function datetime(args) {
    const time3 = timeSource({ precision: args.precision });
    const opts = ["Z"];
    if (args.local)
      opts.push("");
    if (args.offset)
      opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
    const timeRegex = `${time3}(?:${opts.join("|")})`;
    return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
  }
  var string = (params) => {
    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
  };
  var integer = /^-?\d+$/;
  var number = /^-?\d+(?:\.\d+)?$/;
  var _null = /^null$/i;
  var lowercase = /^[^A-Z]*$/;
  var uppercase = /^[^a-z]*$/;

  // node_modules/zod/v4/core/checks.js
  var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
    var _a3;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a3 = inst._zod).onattach ?? (_a3.onattach = []);
  });
  var numericOriginMap = {
    number: "number",
    bigint: "bigint",
    object: "date"
  };
  var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
      if (def.value < curr) {
        if (def.inclusive)
          bag.maximum = def.value;
        else
          bag.exclusiveMaximum = def.value;
      }
    });
    inst._zod.check = (payload) => {
      if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
        return;
      }
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
        input: payload.value,
        inclusive: def.inclusive,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
      if (def.value > curr) {
        if (def.inclusive)
          bag.minimum = def.value;
        else
          bag.exclusiveMinimum = def.value;
      }
    });
    inst._zod.check = (payload) => {
      if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
        return;
      }
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
        input: payload.value,
        inclusive: def.inclusive,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst2) => {
      var _a3;
      (_a3 = inst2._zod.bag).multipleOf ?? (_a3.multipleOf = def.value);
    });
    inst._zod.check = (payload) => {
      if (typeof payload.value !== typeof def.value)
        throw new Error("Cannot mix number and bigint in multiple_of check.");
      const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
      if (isMultiple)
        return;
      payload.issues.push({
        origin: typeof payload.value,
        code: "not_multiple_of",
        divisor: def.value,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
    $ZodCheck.init(inst, def);
    def.format = def.format || "float64";
    const isInt = def.format?.includes("int");
    const origin = isInt ? "int" : "number";
    const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.format = def.format;
      bag.minimum = minimum;
      bag.maximum = maximum;
      if (isInt)
        bag.pattern = integer;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      if (isInt) {
        if (!Number.isInteger(input)) {
          payload.issues.push({
            expected: origin,
            format: def.format,
            code: "invalid_type",
            continue: false,
            input,
            inst
          });
          return;
        }
        if (!Number.isSafeInteger(input)) {
          if (input > 0) {
            payload.issues.push({
              input,
              code: "too_big",
              maximum: Number.MAX_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst,
              origin,
              inclusive: true,
              continue: !def.abort
            });
          } else {
            payload.issues.push({
              input,
              code: "too_small",
              minimum: Number.MIN_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst,
              origin,
              inclusive: true,
              continue: !def.abort
            });
          }
          return;
        }
      }
      if (input < minimum) {
        payload.issues.push({
          origin: "number",
          input,
          code: "too_small",
          minimum,
          inclusive: true,
          inst,
          continue: !def.abort
        });
      }
      if (input > maximum) {
        payload.issues.push({
          origin: "number",
          input,
          code: "too_big",
          maximum,
          inclusive: true,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== void 0;
    });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
      if (def.maximum < curr)
        inst2._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length <= def.maximum)
        return;
      const origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: def.maximum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== void 0;
    });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
      if (def.minimum > curr)
        inst2._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length >= def.minimum)
        return;
      const origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: def.minimum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== void 0;
    });
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.minimum = def.length;
      bag.maximum = def.length;
      bag.length = def.length;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length === def.length)
        return;
      const origin = getLengthableOrigin(input);
      const tooBig = length > def.length;
      payload.issues.push({
        origin,
        ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
        inclusive: true,
        exact: true,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
    var _a3, _b2;
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.format = def.format;
      if (def.pattern) {
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
        bag.patterns.add(def.pattern);
      }
    });
    if (def.pattern)
      (_a3 = inst._zod).check ?? (_a3.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: def.format,
          input: payload.value,
          ...def.pattern ? { pattern: def.pattern.toString() } : {},
          inst,
          continue: !def.abort
        });
      });
    else
      (_b2 = inst._zod).check ?? (_b2.check = () => {
      });
  });
  var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "regex",
        input: payload.value,
        pattern: def.pattern.toString(),
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
    def.pattern ?? (def.pattern = lowercase);
    $ZodCheckStringFormat.init(inst, def);
  });
  var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
    def.pattern ?? (def.pattern = uppercase);
    $ZodCheckStringFormat.init(inst, def);
  });
  var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
    $ZodCheck.init(inst, def);
    const escapedRegex = escapeRegex(def.includes);
    const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
    def.pattern = pattern;
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.includes(def.includes, def.position))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "includes",
        includes: def.includes,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.startsWith(def.prefix))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "starts_with",
        prefix: def.prefix,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.endsWith(def.suffix))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "ends_with",
        suffix: def.suffix,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
      payload.value = def.tx(payload.value);
    };
  });

  // node_modules/zod/v4/core/doc.js
  var Doc = class {
    constructor(args = []) {
      this.content = [];
      this.indent = 0;
      if (this)
        this.args = args;
    }
    indented(fn) {
      this.indent += 1;
      fn(this);
      this.indent -= 1;
    }
    write(arg) {
      if (typeof arg === "function") {
        arg(this, { execution: "sync" });
        arg(this, { execution: "async" });
        return;
      }
      const content = arg;
      const lines = content.split("\n").filter((x4) => x4);
      const minIndent = Math.min(...lines.map((x4) => x4.length - x4.trimStart().length));
      const dedented = lines.map((x4) => x4.slice(minIndent)).map((x4) => " ".repeat(this.indent * 2) + x4);
      for (const line of dedented) {
        this.content.push(line);
      }
    }
    compile() {
      const F4 = Function;
      const args = this?.args;
      const content = this?.content ?? [``];
      const lines = [...content.map((x4) => `  ${x4}`)];
      return new F4(...args, lines.join("\n"));
    }
  };

  // node_modules/zod/v4/core/versions.js
  var version = {
    major: 4,
    minor: 3,
    patch: 2
  };

  // node_modules/zod/v4/core/schemas.js
  var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
    var _a3;
    inst ?? (inst = {});
    inst._zod.def = def;
    inst._zod.bag = inst._zod.bag || {};
    inst._zod.version = version;
    const checks = [...inst._zod.def.checks ?? []];
    if (inst._zod.traits.has("$ZodCheck")) {
      checks.unshift(inst);
    }
    for (const ch of checks) {
      for (const fn of ch._zod.onattach) {
        fn(inst);
      }
    }
    if (checks.length === 0) {
      (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
      inst._zod.deferred?.push(() => {
        inst._zod.run = inst._zod.parse;
      });
    } else {
      const runChecks = (payload, checks2, ctx) => {
        let isAborted = aborted(payload);
        let asyncResult;
        for (const ch of checks2) {
          if (ch._zod.def.when) {
            const shouldRun = ch._zod.def.when(payload);
            if (!shouldRun)
              continue;
          } else if (isAborted) {
            continue;
          }
          const currLen = payload.issues.length;
          const _5 = ch._zod.check(payload);
          if (_5 instanceof Promise && ctx?.async === false) {
            throw new $ZodAsyncError();
          }
          if (asyncResult || _5 instanceof Promise) {
            asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
              await _5;
              const nextLen = payload.issues.length;
              if (nextLen === currLen)
                return;
              if (!isAborted)
                isAborted = aborted(payload, currLen);
            });
          } else {
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              continue;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          }
        }
        if (asyncResult) {
          return asyncResult.then(() => {
            return payload;
          });
        }
        return payload;
      };
      const handleCanaryResult = (canary, payload, ctx) => {
        if (aborted(canary)) {
          canary.aborted = true;
          return canary;
        }
        const checkResult = runChecks(payload, checks, ctx);
        if (checkResult instanceof Promise) {
          if (ctx.async === false)
            throw new $ZodAsyncError();
          return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
        }
        return inst._zod.parse(checkResult, ctx);
      };
      inst._zod.run = (payload, ctx) => {
        if (ctx.skipChecks) {
          return inst._zod.parse(payload, ctx);
        }
        if (ctx.direction === "backward") {
          const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
          if (canary instanceof Promise) {
            return canary.then((canary2) => {
              return handleCanaryResult(canary2, payload, ctx);
            });
          }
          return handleCanaryResult(canary, payload, ctx);
        }
        const result = inst._zod.parse(payload, ctx);
        if (result instanceof Promise) {
          if (ctx.async === false)
            throw new $ZodAsyncError();
          return result.then((result2) => runChecks(result2, checks, ctx));
        }
        return runChecks(result, checks, ctx);
      };
    }
    defineLazy(inst, "~standard", () => ({
      validate: (value) => {
        try {
          const r2 = safeParse(inst, value);
          return r2.success ? { value: r2.data } : { issues: r2.error?.issues };
        } catch (_5) {
          return safeParseAsync(inst, value).then((r2) => r2.success ? { value: r2.data } : { issues: r2.error?.issues });
        }
      },
      vendor: "zod",
      version: 1
    }));
  });
  var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag);
    inst._zod.parse = (payload, _5) => {
      if (def.coerce)
        try {
          payload.value = String(payload.value);
        } catch (_6) {
        }
      if (typeof payload.value === "string")
        return payload;
      payload.issues.push({
        expected: "string",
        code: "invalid_type",
        input: payload.value,
        inst
      });
      return payload;
    };
  });
  var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    $ZodString.init(inst, def);
  });
  var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
    def.pattern ?? (def.pattern = guid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
    if (def.version) {
      const versionMap = {
        v1: 1,
        v2: 2,
        v3: 3,
        v4: 4,
        v5: 5,
        v6: 6,
        v7: 7,
        v8: 8
      };
      const v3 = versionMap[def.version];
      if (v3 === void 0)
        throw new Error(`Invalid UUID version: "${def.version}"`);
      def.pattern ?? (def.pattern = uuid(v3));
    } else
      def.pattern ?? (def.pattern = uuid());
    $ZodStringFormat.init(inst, def);
  });
  var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
    def.pattern ?? (def.pattern = email);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      try {
        const trimmed = payload.value.trim();
        const url2 = new URL(trimmed);
        if (def.hostname) {
          def.hostname.lastIndex = 0;
          if (!def.hostname.test(url2.hostname)) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid hostname",
              pattern: def.hostname.source,
              input: payload.value,
              inst,
              continue: !def.abort
            });
          }
        }
        if (def.protocol) {
          def.protocol.lastIndex = 0;
          if (!def.protocol.test(url2.protocol.endsWith(":") ? url2.protocol.slice(0, -1) : url2.protocol)) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid protocol",
              pattern: def.protocol.source,
              input: payload.value,
              inst,
              continue: !def.abort
            });
          }
        }
        if (def.normalize) {
          payload.value = url2.href;
        } else {
          payload.value = trimmed;
        }
        return;
      } catch (_5) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
    def.pattern ?? (def.pattern = emoji());
    $ZodStringFormat.init(inst, def);
  });
  var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
    def.pattern ?? (def.pattern = nanoid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
    def.pattern ?? (def.pattern = cuid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
    def.pattern ?? (def.pattern = cuid2);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
    def.pattern ?? (def.pattern = ulid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
    def.pattern ?? (def.pattern = xid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
    def.pattern ?? (def.pattern = ksuid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
    def.pattern ?? (def.pattern = datetime(def));
    $ZodStringFormat.init(inst, def);
  });
  var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
    def.pattern ?? (def.pattern = date);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
    def.pattern ?? (def.pattern = time(def));
    $ZodStringFormat.init(inst, def);
  });
  var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
    def.pattern ?? (def.pattern = duration);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
    def.pattern ?? (def.pattern = ipv4);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `ipv4`;
  });
  var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
    def.pattern ?? (def.pattern = ipv6);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `ipv6`;
    inst._zod.check = (payload) => {
      try {
        new URL(`http://[${payload.value}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "ipv6",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv4);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv6);
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      const parts = payload.value.split("/");
      try {
        if (parts.length !== 2)
          throw new Error();
        const [address, prefix] = parts;
        if (!prefix)
          throw new Error();
        const prefixNum = Number(prefix);
        if (`${prefixNum}` !== prefix)
          throw new Error();
        if (prefixNum < 0 || prefixNum > 128)
          throw new Error();
        new URL(`http://[${address}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  function isValidBase64(data) {
    if (data === "")
      return true;
    if (data.length % 4 !== 0)
      return false;
    try {
      atob(data);
      return true;
    } catch {
      return false;
    }
  }
  var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
    def.pattern ?? (def.pattern = base64);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.contentEncoding = "base64";
    inst._zod.check = (payload) => {
      if (isValidBase64(payload.value))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "base64",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  function isValidBase64URL(data) {
    if (!base64url.test(data))
      return false;
    const base642 = data.replace(/[-_]/g, (c2) => c2 === "-" ? "+" : "/");
    const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
    return isValidBase64(padded);
  }
  var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
    def.pattern ?? (def.pattern = base64url);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.contentEncoding = "base64url";
    inst._zod.check = (payload) => {
      if (isValidBase64URL(payload.value))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "base64url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
    def.pattern ?? (def.pattern = e164);
    $ZodStringFormat.init(inst, def);
  });
  function isValidJWT(token, algorithm = null) {
    try {
      const tokensParts = token.split(".");
      if (tokensParts.length !== 3)
        return false;
      const [header] = tokensParts;
      if (!header)
        return false;
      const parsedHeader = JSON.parse(atob(header));
      if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
        return false;
      if (!parsedHeader.alg)
        return false;
      if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
        return false;
      return true;
    } catch {
      return false;
    }
  }
  var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      if (isValidJWT(payload.value, def.alg))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "jwt",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = inst._zod.bag.pattern ?? number;
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = Number(payload.value);
        } catch (_5) {
        }
      const input = payload.value;
      if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
        return payload;
      }
      const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
      payload.issues.push({
        expected: "number",
        code: "invalid_type",
        input,
        inst,
        ...received ? { received } : {}
      });
      return payload;
    };
  });
  var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
    $ZodCheckNumberFormat.init(inst, def);
    $ZodNumber.init(inst, def);
  });
  var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = _null;
    inst._zod.values = /* @__PURE__ */ new Set([null]);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (input === null)
        return payload;
      payload.issues.push({
        expected: "null",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  var $ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
  });
  var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
  });
  var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      payload.issues.push({
        expected: "never",
        code: "invalid_type",
        input: payload.value,
        inst
      });
      return payload;
    };
  });
  var $ZodVoid = /* @__PURE__ */ $constructor("$ZodVoid", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (typeof input === "undefined")
        return payload;
      payload.issues.push({
        expected: "void",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  function handleArrayResult(result, final, index) {
    if (result.issues.length) {
      final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
  }
  var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!Array.isArray(input)) {
        payload.issues.push({
          expected: "array",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      payload.value = Array(input.length);
      const proms = [];
      for (let i = 0; i < input.length; i++) {
        const item = input[i];
        const result = def.element._zod.run({
          value: item,
          issues: []
        }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
        } else {
          handleArrayResult(result, payload, i);
        }
      }
      if (proms.length) {
        return Promise.all(proms).then(() => payload);
      }
      return payload;
    };
  });
  function handlePropertyResult(result, final, key, input, isOptionalOut) {
    if (result.issues.length) {
      if (isOptionalOut && !(key in input)) {
        return;
      }
      final.issues.push(...prefixIssues(key, result.issues));
    }
    if (result.value === void 0) {
      if (key in input) {
        final.value[key] = void 0;
      }
    } else {
      final.value[key] = result.value;
    }
  }
  function normalizeDef(def) {
    const keys = Object.keys(def.shape);
    for (const k5 of keys) {
      if (!def.shape?.[k5]?._zod?.traits?.has("$ZodType")) {
        throw new Error(`Invalid element at key "${k5}": expected a Zod schema`);
      }
    }
    const okeys = optionalKeys(def.shape);
    return {
      ...def,
      keys,
      keySet: new Set(keys),
      numKeys: keys.length,
      optionalKeys: new Set(okeys)
    };
  }
  function handleCatchall(proms, input, payload, ctx, def, inst) {
    const unrecognized = [];
    const keySet = def.keySet;
    const _catchall = def.catchall._zod;
    const t = _catchall.def.type;
    const isOptionalOut = _catchall.optout === "optional";
    for (const key in input) {
      if (keySet.has(key))
        continue;
      if (t === "never") {
        unrecognized.push(key);
        continue;
      }
      const r2 = _catchall.run({ value: input[key], issues: [] }, ctx);
      if (r2 instanceof Promise) {
        proms.push(r2.then((r3) => handlePropertyResult(r3, payload, key, input, isOptionalOut)));
      } else {
        handlePropertyResult(r2, payload, key, input, isOptionalOut);
      }
    }
    if (unrecognized.length) {
      payload.issues.push({
        code: "unrecognized_keys",
        keys: unrecognized,
        input,
        inst
      });
    }
    if (!proms.length)
      return payload;
    return Promise.all(proms).then(() => {
      return payload;
    });
  }
  var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
    $ZodType.init(inst, def);
    const desc = Object.getOwnPropertyDescriptor(def, "shape");
    if (!desc?.get) {
      const sh = def.shape;
      Object.defineProperty(def, "shape", {
        get: () => {
          const newSh = { ...sh };
          Object.defineProperty(def, "shape", {
            value: newSh
          });
          return newSh;
        }
      });
    }
    const _normalized = cached(() => normalizeDef(def));
    defineLazy(inst._zod, "propValues", () => {
      const shape = def.shape;
      const propValues = {};
      for (const key in shape) {
        const field = shape[key]._zod;
        if (field.values) {
          propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
          for (const v3 of field.values)
            propValues[key].add(v3);
        }
      }
      return propValues;
    });
    const isObject2 = isObject;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
      value ?? (value = _normalized.value);
      const input = payload.value;
      if (!isObject2(input)) {
        payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      payload.value = {};
      const proms = [];
      const shape = value.shape;
      for (const key of value.keys) {
        const el = shape[key];
        const isOptionalOut = el._zod.optout === "optional";
        const r2 = el._zod.run({ value: input[key], issues: [] }, ctx);
        if (r2 instanceof Promise) {
          proms.push(r2.then((r3) => handlePropertyResult(r3, payload, key, input, isOptionalOut)));
        } else {
          handlePropertyResult(r2, payload, key, input, isOptionalOut);
        }
      }
      if (!catchall) {
        return proms.length ? Promise.all(proms).then(() => payload) : payload;
      }
      return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
    };
  });
  var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
    $ZodObject.init(inst, def);
    const superParse = inst._zod.parse;
    const _normalized = cached(() => normalizeDef(def));
    const generateFastpass = (shape) => {
      const doc = new Doc(["shape", "payload", "ctx"]);
      const normalized = _normalized.value;
      const parseStr = (key) => {
        const k5 = esc(key);
        return `shape[${k5}]._zod.run({ value: input[${k5}], issues: [] }, ctx)`;
      };
      doc.write(`const input = payload.value;`);
      const ids = /* @__PURE__ */ Object.create(null);
      let counter = 0;
      for (const key of normalized.keys) {
        ids[key] = `key_${counter++}`;
      }
      doc.write(`const newResult = {};`);
      for (const key of normalized.keys) {
        const id = ids[key];
        const k5 = esc(key);
        const schema = shape[key];
        const isOptionalOut = schema?._zod?.optout === "optional";
        doc.write(`const ${id} = ${parseStr(key)};`);
        if (isOptionalOut) {
          doc.write(`
        if (${id}.issues.length) {
          if (${k5} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k5}, ...iss.path] : [${k5}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k5} in input) {
            newResult[${k5}] = undefined;
          }
        } else {
          newResult[${k5}] = ${id}.value;
        }
        
      `);
        } else {
          doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k5}, ...iss.path] : [${k5}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k5} in input) {
            newResult[${k5}] = undefined;
          }
        } else {
          newResult[${k5}] = ${id}.value;
        }
        
      `);
        }
      }
      doc.write(`payload.value = newResult;`);
      doc.write(`return payload;`);
      const fn = doc.compile();
      return (payload, ctx) => fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject2 = isObject;
    const jit = !globalConfig.jitless;
    const allowsEval2 = allowsEval;
    const fastEnabled = jit && allowsEval2.value;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
      value ?? (value = _normalized.value);
      const input = payload.value;
      if (!isObject2(input)) {
        payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
        if (!fastpass)
          fastpass = generateFastpass(def.shape);
        payload = fastpass(payload, ctx);
        if (!catchall)
          return payload;
        return handleCatchall([], input, payload, ctx, value, inst);
      }
      return superParse(payload, ctx);
    };
  });
  function handleUnionResults(results, final, inst, ctx) {
    for (const result of results) {
      if (result.issues.length === 0) {
        final.value = result.value;
        return final;
      }
    }
    const nonaborted = results.filter((r2) => !aborted(r2));
    if (nonaborted.length === 1) {
      final.value = nonaborted[0].value;
      return nonaborted[0];
    }
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    });
    return final;
  }
  var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.options.some((o3) => o3._zod.optin === "optional") ? "optional" : void 0);
    defineLazy(inst._zod, "optout", () => def.options.some((o3) => o3._zod.optout === "optional") ? "optional" : void 0);
    defineLazy(inst._zod, "values", () => {
      if (def.options.every((o3) => o3._zod.values)) {
        return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
      }
      return void 0;
    });
    defineLazy(inst._zod, "pattern", () => {
      if (def.options.every((o3) => o3._zod.pattern)) {
        const patterns = def.options.map((o3) => o3._zod.pattern);
        return new RegExp(`^(${patterns.map((p4) => cleanRegex(p4.source)).join("|")})$`);
      }
      return void 0;
    });
    const single = def.options.length === 1;
    const first = def.options[0]._zod.run;
    inst._zod.parse = (payload, ctx) => {
      if (single) {
        return first(payload, ctx);
      }
      let async = false;
      const results = [];
      for (const option of def.options) {
        const result = option._zod.run({
          value: payload.value,
          issues: []
        }, ctx);
        if (result instanceof Promise) {
          results.push(result);
          async = true;
        } else {
          if (result.issues.length === 0)
            return result;
          results.push(result);
        }
      }
      if (!async)
        return handleUnionResults(results, payload, inst, ctx);
      return Promise.all(results).then((results2) => {
        return handleUnionResults(results2, payload, inst, ctx);
      });
    };
  });
  var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      const left = def.left._zod.run({ value: input, issues: [] }, ctx);
      const right = def.right._zod.run({ value: input, issues: [] }, ctx);
      const async = left instanceof Promise || right instanceof Promise;
      if (async) {
        return Promise.all([left, right]).then(([left2, right2]) => {
          return handleIntersectionResults(payload, left2, right2);
        });
      }
      return handleIntersectionResults(payload, left, right);
    };
  });
  function mergeValues(a4, b6) {
    if (a4 === b6) {
      return { valid: true, data: a4 };
    }
    if (a4 instanceof Date && b6 instanceof Date && +a4 === +b6) {
      return { valid: true, data: a4 };
    }
    if (isPlainObject(a4) && isPlainObject(b6)) {
      const bKeys = Object.keys(b6);
      const sharedKeys = Object.keys(a4).filter((key) => bKeys.indexOf(key) !== -1);
      const newObj = { ...a4, ...b6 };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a4[key], b6[key]);
        if (!sharedValue.valid) {
          return {
            valid: false,
            mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
          };
        }
        newObj[key] = sharedValue.data;
      }
      return { valid: true, data: newObj };
    }
    if (Array.isArray(a4) && Array.isArray(b6)) {
      if (a4.length !== b6.length) {
        return { valid: false, mergeErrorPath: [] };
      }
      const newArray = [];
      for (let index = 0; index < a4.length; index++) {
        const itemA = a4[index];
        const itemB = b6[index];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return {
            valid: false,
            mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
          };
        }
        newArray.push(sharedValue.data);
      }
      return { valid: true, data: newArray };
    }
    return { valid: false, mergeErrorPath: [] };
  }
  function handleIntersectionResults(result, left, right) {
    const unrecKeys = /* @__PURE__ */ new Map();
    let unrecIssue;
    for (const iss of left.issues) {
      if (iss.code === "unrecognized_keys") {
        unrecIssue ?? (unrecIssue = iss);
        for (const k5 of iss.keys) {
          if (!unrecKeys.has(k5))
            unrecKeys.set(k5, {});
          unrecKeys.get(k5).l = true;
        }
      } else {
        result.issues.push(iss);
      }
    }
    for (const iss of right.issues) {
      if (iss.code === "unrecognized_keys") {
        for (const k5 of iss.keys) {
          if (!unrecKeys.has(k5))
            unrecKeys.set(k5, {});
          unrecKeys.get(k5).r = true;
        }
      } else {
        result.issues.push(iss);
      }
    }
    const bothKeys = [...unrecKeys].filter(([, f4]) => f4.l && f4.r).map(([k5]) => k5);
    if (bothKeys.length && unrecIssue) {
      result.issues.push({ ...unrecIssue, keys: bothKeys });
    }
    if (aborted(result))
      return result;
    const merged = mergeValues(left.value, right.value);
    if (!merged.valid) {
      throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
    }
    result.value = merged.data;
    return result;
  }
  var $ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def) => {
    $ZodType.init(inst, def);
    const items = def.items;
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!Array.isArray(input)) {
        payload.issues.push({
          input,
          inst,
          expected: "tuple",
          code: "invalid_type"
        });
        return payload;
      }
      payload.value = [];
      const proms = [];
      const reversedIndex = [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
      const optStart = reversedIndex === -1 ? 0 : items.length - reversedIndex;
      if (!def.rest) {
        const tooBig = input.length > items.length;
        const tooSmall = input.length < optStart - 1;
        if (tooBig || tooSmall) {
          payload.issues.push({
            ...tooBig ? { code: "too_big", maximum: items.length, inclusive: true } : { code: "too_small", minimum: items.length },
            input,
            inst,
            origin: "array"
          });
          return payload;
        }
      }
      let i = -1;
      for (const item of items) {
        i++;
        if (i >= input.length) {
          if (i >= optStart)
            continue;
        }
        const result = item._zod.run({
          value: input[i],
          issues: []
        }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => handleTupleResult(result2, payload, i)));
        } else {
          handleTupleResult(result, payload, i);
        }
      }
      if (def.rest) {
        const rest = input.slice(items.length);
        for (const el of rest) {
          i++;
          const result = def.rest._zod.run({
            value: el,
            issues: []
          }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => handleTupleResult(result2, payload, i)));
          } else {
            handleTupleResult(result, payload, i);
          }
        }
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  function handleTupleResult(result, final, index) {
    if (result.issues.length) {
      final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
  }
  var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
    $ZodType.init(inst, def);
    const values = getEnumValues(def.entries);
    const valuesSet = new Set(values);
    inst._zod.values = valuesSet;
    inst._zod.pattern = new RegExp(`^(${values.filter((k5) => propertyKeyTypes.has(typeof k5)).map((o3) => typeof o3 === "string" ? escapeRegex(o3) : o3.toString()).join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (valuesSet.has(input)) {
        return payload;
      }
      payload.issues.push({
        code: "invalid_value",
        values,
        input,
        inst
      });
      return payload;
    };
  });
  var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    if (def.values.length === 0) {
      throw new Error("Cannot create literal schema with no valid values");
    }
    const values = new Set(def.values);
    inst._zod.values = values;
    inst._zod.pattern = new RegExp(`^(${def.values.map((o3) => typeof o3 === "string" ? escapeRegex(o3) : o3 ? escapeRegex(o3.toString()) : String(o3)).join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (values.has(input)) {
        return payload;
      }
      payload.issues.push({
        code: "invalid_value",
        values: def.values,
        input,
        inst
      });
      return payload;
    };
  });
  var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        throw new $ZodEncodeError(inst.constructor.name);
      }
      const _out = def.transform(payload.value, payload);
      if (ctx.async) {
        const output = _out instanceof Promise ? _out : Promise.resolve(_out);
        return output.then((output2) => {
          payload.value = output2;
          return payload;
        });
      }
      if (_out instanceof Promise) {
        throw new $ZodAsyncError();
      }
      payload.value = _out;
      return payload;
    };
  });
  function handleOptionalResult(result, input) {
    if (result.issues.length && input === void 0) {
      return { issues: [], value: void 0 };
    }
    return result;
  }
  var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
    });
    defineLazy(inst._zod, "pattern", () => {
      const pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
    });
    inst._zod.parse = (payload, ctx) => {
      if (def.innerType._zod.optin === "optional") {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise)
          return result.then((r2) => handleOptionalResult(r2, payload.value));
        return handleOptionalResult(result, payload.value);
      }
      if (payload.value === void 0) {
        return payload;
      }
      return def.innerType._zod.run(payload, ctx);
    };
  });
  var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
    inst._zod.parse = (payload, ctx) => {
      return def.innerType._zod.run(payload, ctx);
    };
  });
  var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "pattern", () => {
      const pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
    });
    defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
    });
    inst._zod.parse = (payload, ctx) => {
      if (payload.value === null)
        return payload;
      return def.innerType._zod.run(payload, ctx);
    };
  });
  var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      if (payload.value === void 0) {
        payload.value = def.defaultValue;
        return payload;
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => handleDefaultResult(result2, def));
      }
      return handleDefaultResult(result, def);
    };
  });
  function handleDefaultResult(payload, def) {
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
    }
    return payload;
  }
  var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      if (payload.value === void 0) {
        payload.value = def.defaultValue;
      }
      return def.innerType._zod.run(payload, ctx);
    };
  });
  var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => {
      const v3 = def.innerType._zod.values;
      return v3 ? new Set([...v3].filter((x4) => x4 !== void 0)) : void 0;
    });
    inst._zod.parse = (payload, ctx) => {
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => handleNonOptionalResult(result2, inst));
      }
      return handleNonOptionalResult(result, inst);
    };
  });
  function handleNonOptionalResult(payload, inst) {
    if (!payload.issues.length && payload.value === void 0) {
      payload.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: payload.value,
        inst
      });
    }
    return payload;
  }
  var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => {
          payload.value = result2.value;
          if (result2.issues.length) {
            payload.value = def.catchValue({
              ...payload,
              error: {
                issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
              },
              input: payload.value
            });
            payload.issues = [];
          }
          return payload;
        });
      }
      payload.value = result.value;
      if (result.issues.length) {
        payload.value = def.catchValue({
          ...payload,
          error: {
            issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
          },
          input: payload.value
        });
        payload.issues = [];
      }
      return payload;
    };
  });
  var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        const right = def.out._zod.run(payload, ctx);
        if (right instanceof Promise) {
          return right.then((right2) => handlePipeResult(right2, def.in, ctx));
        }
        return handlePipeResult(right, def.in, ctx);
      }
      const left = def.in._zod.run(payload, ctx);
      if (left instanceof Promise) {
        return left.then((left2) => handlePipeResult(left2, def.out, ctx));
      }
      return handlePipeResult(left, def.out, ctx);
    };
  });
  function handlePipeResult(left, next, ctx) {
    if (left.issues.length) {
      left.aborted = true;
      return left;
    }
    return next._zod.run({ value: left.value, issues: left.issues }, ctx);
  }
  var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
    defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then(handleReadonlyResult);
      }
      return handleReadonlyResult(result);
    };
  });
  function handleReadonlyResult(payload) {
    payload.value = Object.freeze(payload.value);
    return payload;
  }
  var $ZodFunction = /* @__PURE__ */ $constructor("$ZodFunction", (inst, def) => {
    $ZodType.init(inst, def);
    inst._def = def;
    inst._zod.def = def;
    inst.implement = (func) => {
      if (typeof func !== "function") {
        throw new Error("implement() must be called with a function");
      }
      return function(...args) {
        const parsedArgs = inst._def.input ? parse(inst._def.input, args) : args;
        const result = Reflect.apply(func, this, parsedArgs);
        if (inst._def.output) {
          return parse(inst._def.output, result);
        }
        return result;
      };
    };
    inst.implementAsync = (func) => {
      if (typeof func !== "function") {
        throw new Error("implementAsync() must be called with a function");
      }
      return async function(...args) {
        const parsedArgs = inst._def.input ? await parseAsync(inst._def.input, args) : args;
        const result = await Reflect.apply(func, this, parsedArgs);
        if (inst._def.output) {
          return await parseAsync(inst._def.output, result);
        }
        return result;
      };
    };
    inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "function") {
        payload.issues.push({
          code: "invalid_type",
          expected: "function",
          input: payload.value,
          inst
        });
        return payload;
      }
      const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
      if (hasPromiseOutput) {
        payload.value = inst.implementAsync(payload.value);
      } else {
        payload.value = inst.implement(payload.value);
      }
      return payload;
    };
    inst.input = (...args) => {
      const F4 = inst.constructor;
      if (Array.isArray(args[0])) {
        return new F4({
          type: "function",
          input: new $ZodTuple({
            type: "tuple",
            items: args[0],
            rest: args[1]
          }),
          output: inst._def.output
        });
      }
      return new F4({
        type: "function",
        input: args[0],
        output: inst._def.output
      });
    };
    inst.output = (output) => {
      const F4 = inst.constructor;
      return new F4({
        type: "function",
        input: inst._def.input,
        output
      });
    };
    return inst;
  });
  var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
    $ZodCheck.init(inst, def);
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _5) => {
      return payload;
    };
    inst._zod.check = (payload) => {
      const input = payload.value;
      const r2 = def.fn(input);
      if (r2 instanceof Promise) {
        return r2.then((r3) => handleRefineResult(r3, payload, input, inst));
      }
      handleRefineResult(r2, payload, input, inst);
      return;
    };
  });
  function handleRefineResult(result, payload, input, inst) {
    if (!result) {
      const _iss = {
        code: "custom",
        input,
        inst,
        // incorporates params.error into issue reporting
        path: [...inst._zod.def.path ?? []],
        // incorporates params.error into issue reporting
        continue: !inst._zod.def.abort
        // params: inst._zod.def.params,
      };
      if (inst._zod.def.params)
        _iss.params = inst._zod.def.params;
      payload.issues.push(issue(_iss));
    }
  }

  // node_modules/zod/v4/core/registries.js
  var _a2;
  var $output = Symbol("ZodOutput");
  var $input = Symbol("ZodInput");
  var $ZodRegistry = class {
    constructor() {
      this._map = /* @__PURE__ */ new WeakMap();
      this._idmap = /* @__PURE__ */ new Map();
    }
    add(schema, ..._meta) {
      const meta2 = _meta[0];
      this._map.set(schema, meta2);
      if (meta2 && typeof meta2 === "object" && "id" in meta2) {
        this._idmap.set(meta2.id, schema);
      }
      return this;
    }
    clear() {
      this._map = /* @__PURE__ */ new WeakMap();
      this._idmap = /* @__PURE__ */ new Map();
      return this;
    }
    remove(schema) {
      const meta2 = this._map.get(schema);
      if (meta2 && typeof meta2 === "object" && "id" in meta2) {
        this._idmap.delete(meta2.id);
      }
      this._map.delete(schema);
      return this;
    }
    get(schema) {
      const p4 = schema._zod.parent;
      if (p4) {
        const pm = { ...this.get(p4) ?? {} };
        delete pm.id;
        const f4 = { ...pm, ...this._map.get(schema) };
        return Object.keys(f4).length ? f4 : void 0;
      }
      return this._map.get(schema);
    }
    has(schema) {
      return this._map.has(schema);
    }
  };
  function registry() {
    return new $ZodRegistry();
  }
  (_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
  var globalRegistry = globalThis.__zod_globalRegistry;

  // node_modules/zod/v4/core/api.js
  // @__NO_SIDE_EFFECTS__
  function _string(Class2, params) {
    return new Class2({
      type: "string",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _email(Class2, params) {
    return new Class2({
      type: "string",
      format: "email",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _guid(Class2, params) {
    return new Class2({
      type: "string",
      format: "guid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uuid(Class2, params) {
    return new Class2({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uuidv4(Class2, params) {
    return new Class2({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v4",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uuidv6(Class2, params) {
    return new Class2({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v6",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uuidv7(Class2, params) {
    return new Class2({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v7",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _url(Class2, params) {
    return new Class2({
      type: "string",
      format: "url",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _emoji2(Class2, params) {
    return new Class2({
      type: "string",
      format: "emoji",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _nanoid(Class2, params) {
    return new Class2({
      type: "string",
      format: "nanoid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _cuid(Class2, params) {
    return new Class2({
      type: "string",
      format: "cuid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _cuid2(Class2, params) {
    return new Class2({
      type: "string",
      format: "cuid2",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _ulid(Class2, params) {
    return new Class2({
      type: "string",
      format: "ulid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _xid(Class2, params) {
    return new Class2({
      type: "string",
      format: "xid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _ksuid(Class2, params) {
    return new Class2({
      type: "string",
      format: "ksuid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _ipv4(Class2, params) {
    return new Class2({
      type: "string",
      format: "ipv4",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _ipv6(Class2, params) {
    return new Class2({
      type: "string",
      format: "ipv6",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _cidrv4(Class2, params) {
    return new Class2({
      type: "string",
      format: "cidrv4",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _cidrv6(Class2, params) {
    return new Class2({
      type: "string",
      format: "cidrv6",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _base64(Class2, params) {
    return new Class2({
      type: "string",
      format: "base64",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _base64url(Class2, params) {
    return new Class2({
      type: "string",
      format: "base64url",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _e164(Class2, params) {
    return new Class2({
      type: "string",
      format: "e164",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _jwt(Class2, params) {
    return new Class2({
      type: "string",
      format: "jwt",
      check: "string_format",
      abort: false,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _isoDateTime(Class2, params) {
    return new Class2({
      type: "string",
      format: "datetime",
      check: "string_format",
      offset: false,
      local: false,
      precision: null,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _isoDate(Class2, params) {
    return new Class2({
      type: "string",
      format: "date",
      check: "string_format",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _isoTime(Class2, params) {
    return new Class2({
      type: "string",
      format: "time",
      check: "string_format",
      precision: null,
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _isoDuration(Class2, params) {
    return new Class2({
      type: "string",
      format: "duration",
      check: "string_format",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _number(Class2, params) {
    return new Class2({
      type: "number",
      checks: [],
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _int(Class2, params) {
    return new Class2({
      type: "number",
      check: "number_format",
      abort: false,
      format: "safeint",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _null2(Class2, params) {
    return new Class2({
      type: "null",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _any(Class2) {
    return new Class2({
      type: "any"
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _unknown(Class2) {
    return new Class2({
      type: "unknown"
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _never(Class2, params) {
    return new Class2({
      type: "never",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _void(Class2, params) {
    return new Class2({
      type: "void",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _lt(value, params) {
    return new $ZodCheckLessThan({
      check: "less_than",
      ...normalizeParams(params),
      value,
      inclusive: false
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _lte(value, params) {
    return new $ZodCheckLessThan({
      check: "less_than",
      ...normalizeParams(params),
      value,
      inclusive: true
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _gt(value, params) {
    return new $ZodCheckGreaterThan({
      check: "greater_than",
      ...normalizeParams(params),
      value,
      inclusive: false
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _gte(value, params) {
    return new $ZodCheckGreaterThan({
      check: "greater_than",
      ...normalizeParams(params),
      value,
      inclusive: true
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _multipleOf(value, params) {
    return new $ZodCheckMultipleOf({
      check: "multiple_of",
      ...normalizeParams(params),
      value
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _maxLength(maximum, params) {
    const ch = new $ZodCheckMaxLength({
      check: "max_length",
      ...normalizeParams(params),
      maximum
    });
    return ch;
  }
  // @__NO_SIDE_EFFECTS__
  function _minLength(minimum, params) {
    return new $ZodCheckMinLength({
      check: "min_length",
      ...normalizeParams(params),
      minimum
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _length(length, params) {
    return new $ZodCheckLengthEquals({
      check: "length_equals",
      ...normalizeParams(params),
      length
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _regex(pattern, params) {
    return new $ZodCheckRegex({
      check: "string_format",
      format: "regex",
      ...normalizeParams(params),
      pattern
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _lowercase(params) {
    return new $ZodCheckLowerCase({
      check: "string_format",
      format: "lowercase",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uppercase(params) {
    return new $ZodCheckUpperCase({
      check: "string_format",
      format: "uppercase",
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _includes(includes, params) {
    return new $ZodCheckIncludes({
      check: "string_format",
      format: "includes",
      ...normalizeParams(params),
      includes
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _startsWith(prefix, params) {
    return new $ZodCheckStartsWith({
      check: "string_format",
      format: "starts_with",
      ...normalizeParams(params),
      prefix
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _endsWith(suffix, params) {
    return new $ZodCheckEndsWith({
      check: "string_format",
      format: "ends_with",
      ...normalizeParams(params),
      suffix
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _overwrite(tx) {
    return new $ZodCheckOverwrite({
      check: "overwrite",
      tx
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _normalize(form) {
    return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
  }
  // @__NO_SIDE_EFFECTS__
  function _trim() {
    return /* @__PURE__ */ _overwrite((input) => input.trim());
  }
  // @__NO_SIDE_EFFECTS__
  function _toLowerCase() {
    return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
  }
  // @__NO_SIDE_EFFECTS__
  function _toUpperCase() {
    return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
  }
  // @__NO_SIDE_EFFECTS__
  function _slugify() {
    return /* @__PURE__ */ _overwrite((input) => slugify(input));
  }
  // @__NO_SIDE_EFFECTS__
  function _array(Class2, element, params) {
    return new Class2({
      type: "array",
      element,
      // get element() {
      //   return element;
      // },
      ...normalizeParams(params)
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _refine(Class2, fn, _params) {
    const schema = new Class2({
      type: "custom",
      check: "custom",
      fn,
      ...normalizeParams(_params)
    });
    return schema;
  }
  // @__NO_SIDE_EFFECTS__
  function _superRefine(fn) {
    const ch = /* @__PURE__ */ _check((payload) => {
      payload.addIssue = (issue2) => {
        if (typeof issue2 === "string") {
          payload.issues.push(issue(issue2, payload.value, ch._zod.def));
        } else {
          const _issue = issue2;
          if (_issue.fatal)
            _issue.continue = false;
          _issue.code ?? (_issue.code = "custom");
          _issue.input ?? (_issue.input = payload.value);
          _issue.inst ?? (_issue.inst = ch);
          _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
          payload.issues.push(issue(_issue));
        }
      };
      return fn(payload.value, payload);
    });
    return ch;
  }
  // @__NO_SIDE_EFFECTS__
  function _check(fn, params) {
    const ch = new $ZodCheck({
      check: "custom",
      ...normalizeParams(params)
    });
    ch._zod.check = fn;
    return ch;
  }

  // node_modules/zod/v4/core/to-json-schema.js
  function initializeContext(params) {
    let target = params?.target ?? "draft-2020-12";
    if (target === "draft-4")
      target = "draft-04";
    if (target === "draft-7")
      target = "draft-07";
    return {
      processors: params.processors ?? {},
      metadataRegistry: params?.metadata ?? globalRegistry,
      target,
      unrepresentable: params?.unrepresentable ?? "throw",
      override: params?.override ?? (() => {
      }),
      io: params?.io ?? "output",
      counter: 0,
      seen: /* @__PURE__ */ new Map(),
      cycles: params?.cycles ?? "ref",
      reused: params?.reused ?? "inline",
      external: params?.external ?? void 0
    };
  }
  function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
    var _a3;
    const def = schema._zod.def;
    const seen = ctx.seen.get(schema);
    if (seen) {
      seen.count++;
      const isCycle = _params.schemaPath.includes(schema);
      if (isCycle) {
        seen.cycle = _params.path;
      }
      return seen.schema;
    }
    const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
    ctx.seen.set(schema, result);
    const overrideSchema = schema._zod.toJSONSchema?.();
    if (overrideSchema) {
      result.schema = overrideSchema;
    } else {
      const params = {
        ..._params,
        schemaPath: [..._params.schemaPath, schema],
        path: _params.path
      };
      if (schema._zod.processJSONSchema) {
        schema._zod.processJSONSchema(ctx, result.schema, params);
      } else {
        const _json = result.schema;
        const processor = ctx.processors[def.type];
        if (!processor) {
          throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
        }
        processor(schema, ctx, _json, params);
      }
      const parent = schema._zod.parent;
      if (parent) {
        if (!result.ref)
          result.ref = parent;
        process(parent, ctx, params);
        ctx.seen.get(parent).isParent = true;
      }
    }
    const meta2 = ctx.metadataRegistry.get(schema);
    if (meta2)
      Object.assign(result.schema, meta2);
    if (ctx.io === "input" && isTransforming(schema)) {
      delete result.schema.examples;
      delete result.schema.default;
    }
    if (ctx.io === "input" && result.schema._prefault)
      (_a3 = result.schema).default ?? (_a3.default = result.schema._prefault);
    delete result.schema._prefault;
    const _result = ctx.seen.get(schema);
    return _result.schema;
  }
  function extractDefs(ctx, schema) {
    const root = ctx.seen.get(schema);
    if (!root)
      throw new Error("Unprocessed schema. This is a bug in Zod.");
    const idToSchema = /* @__PURE__ */ new Map();
    for (const entry of ctx.seen.entries()) {
      const id = ctx.metadataRegistry.get(entry[0])?.id;
      if (id) {
        const existing = idToSchema.get(id);
        if (existing && existing !== entry[0]) {
          throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
        }
        idToSchema.set(id, entry[0]);
      }
    }
    const makeURI = (entry) => {
      const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
      if (ctx.external) {
        const externalId = ctx.external.registry.get(entry[0])?.id;
        const uriGenerator = ctx.external.uri ?? ((id2) => id2);
        if (externalId) {
          return { ref: uriGenerator(externalId) };
        }
        const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
        entry[1].defId = id;
        return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
      }
      if (entry[1] === root) {
        return { ref: "#" };
      }
      const uriPrefix = `#`;
      const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
      const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
      return { defId, ref: defUriPrefix + defId };
    };
    const extractToDef = (entry) => {
      if (entry[1].schema.$ref) {
        return;
      }
      const seen = entry[1];
      const { ref, defId } = makeURI(entry);
      seen.def = { ...seen.schema };
      if (defId)
        seen.defId = defId;
      const schema2 = seen.schema;
      for (const key in schema2) {
        delete schema2[key];
      }
      schema2.$ref = ref;
    };
    if (ctx.cycles === "throw") {
      for (const entry of ctx.seen.entries()) {
        const seen = entry[1];
        if (seen.cycle) {
          throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
        }
      }
    }
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (schema === entry[0]) {
        extractToDef(entry);
        continue;
      }
      if (ctx.external) {
        const ext = ctx.external.registry.get(entry[0])?.id;
        if (schema !== entry[0] && ext) {
          extractToDef(entry);
          continue;
        }
      }
      const id = ctx.metadataRegistry.get(entry[0])?.id;
      if (id) {
        extractToDef(entry);
        continue;
      }
      if (seen.cycle) {
        extractToDef(entry);
        continue;
      }
      if (seen.count > 1) {
        if (ctx.reused === "ref") {
          extractToDef(entry);
          continue;
        }
      }
    }
  }
  function finalize(ctx, schema) {
    const root = ctx.seen.get(schema);
    if (!root)
      throw new Error("Unprocessed schema. This is a bug in Zod.");
    const flattenRef = (zodSchema) => {
      const seen = ctx.seen.get(zodSchema);
      if (seen.ref === null)
        return;
      const schema2 = seen.def ?? seen.schema;
      const _cached = { ...schema2 };
      const ref = seen.ref;
      seen.ref = null;
      if (ref) {
        flattenRef(ref);
        const refSeen = ctx.seen.get(ref);
        const refSchema = refSeen.schema;
        if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
          schema2.allOf = schema2.allOf ?? [];
          schema2.allOf.push(refSchema);
        } else {
          Object.assign(schema2, refSchema);
        }
        Object.assign(schema2, _cached);
        const isParentRef = zodSchema._zod.parent === ref;
        if (isParentRef) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (!(key in _cached)) {
              delete schema2[key];
            }
          }
        }
        if (refSchema.$ref) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
      const parent = zodSchema._zod.parent;
      if (parent && parent !== ref) {
        flattenRef(parent);
        const parentSeen = ctx.seen.get(parent);
        if (parentSeen?.schema.$ref) {
          schema2.$ref = parentSeen.schema.$ref;
          if (parentSeen.def) {
            for (const key in schema2) {
              if (key === "$ref" || key === "allOf")
                continue;
              if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
                delete schema2[key];
              }
            }
          }
        }
      }
      ctx.override({
        zodSchema,
        jsonSchema: schema2,
        path: seen.path ?? []
      });
    };
    for (const entry of [...ctx.seen.entries()].reverse()) {
      flattenRef(entry[0]);
    }
    const result = {};
    if (ctx.target === "draft-2020-12") {
      result.$schema = "https://json-schema.org/draft/2020-12/schema";
    } else if (ctx.target === "draft-07") {
      result.$schema = "http://json-schema.org/draft-07/schema#";
    } else if (ctx.target === "draft-04") {
      result.$schema = "http://json-schema.org/draft-04/schema#";
    } else if (ctx.target === "openapi-3.0") {
    } else {
    }
    if (ctx.external?.uri) {
      const id = ctx.external.registry.get(schema)?.id;
      if (!id)
        throw new Error("Schema is missing an `id` property");
      result.$id = ctx.external.uri(id);
    }
    Object.assign(result, root.def ?? root.schema);
    const defs = ctx.external?.defs ?? {};
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        defs[seen.defId] = seen.def;
      }
    }
    if (ctx.external) {
    } else {
      if (Object.keys(defs).length > 0) {
        if (ctx.target === "draft-2020-12") {
          result.$defs = defs;
        } else {
          result.definitions = defs;
        }
      }
    }
    try {
      const finalized = JSON.parse(JSON.stringify(result));
      Object.defineProperty(finalized, "~standard", {
        value: {
          ...schema["~standard"],
          jsonSchema: {
            input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
            output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
          }
        },
        enumerable: false,
        writable: false
      });
      return finalized;
    } catch (_err) {
      throw new Error("Error converting schema to JSON.");
    }
  }
  function isTransforming(_schema, _ctx) {
    const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
    if (ctx.seen.has(_schema))
      return false;
    ctx.seen.add(_schema);
    const def = _schema._zod.def;
    if (def.type === "transform")
      return true;
    if (def.type === "array")
      return isTransforming(def.element, ctx);
    if (def.type === "set")
      return isTransforming(def.valueType, ctx);
    if (def.type === "lazy")
      return isTransforming(def.getter(), ctx);
    if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
      return isTransforming(def.innerType, ctx);
    }
    if (def.type === "intersection") {
      return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
    }
    if (def.type === "record" || def.type === "map") {
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    if (def.type === "pipe") {
      return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
    }
    if (def.type === "object") {
      for (const key in def.shape) {
        if (isTransforming(def.shape[key], ctx))
          return true;
      }
      return false;
    }
    if (def.type === "union") {
      for (const option of def.options) {
        if (isTransforming(option, ctx))
          return true;
      }
      return false;
    }
    if (def.type === "tuple") {
      for (const item of def.items) {
        if (isTransforming(item, ctx))
          return true;
      }
      if (def.rest && isTransforming(def.rest, ctx))
        return true;
      return false;
    }
    return false;
  }
  var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
    const ctx = initializeContext({ ...params, processors });
    process(schema, ctx);
    extractDefs(ctx, schema);
    return finalize(ctx, schema);
  };
  var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
    const { libraryOptions, target } = params ?? {};
    const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
    process(schema, ctx);
    extractDefs(ctx, schema);
    return finalize(ctx, schema);
  };

  // node_modules/zod/v4/core/json-schema-processors.js
  var formatMap = {
    guid: "uuid",
    url: "uri",
    datetime: "date-time",
    json_string: "json-string",
    regex: ""
    // do not set
  };
  var stringProcessor = (schema, ctx, _json, _params) => {
    const json = _json;
    json.type = "string";
    const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
    if (typeof minimum === "number")
      json.minLength = minimum;
    if (typeof maximum === "number")
      json.maxLength = maximum;
    if (format) {
      json.format = formatMap[format] ?? format;
      if (json.format === "")
        delete json.format;
      if (format === "time") {
        delete json.format;
      }
    }
    if (contentEncoding)
      json.contentEncoding = contentEncoding;
    if (patterns && patterns.size > 0) {
      const regexes = [...patterns];
      if (regexes.length === 1)
        json.pattern = regexes[0].source;
      else if (regexes.length > 1) {
        json.allOf = [
          ...regexes.map((regex) => ({
            ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
            pattern: regex.source
          }))
        ];
      }
    }
  };
  var numberProcessor = (schema, ctx, _json, _params) => {
    const json = _json;
    const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
    if (typeof format === "string" && format.includes("int"))
      json.type = "integer";
    else
      json.type = "number";
    if (typeof exclusiveMinimum === "number") {
      if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
        json.minimum = exclusiveMinimum;
        json.exclusiveMinimum = true;
      } else {
        json.exclusiveMinimum = exclusiveMinimum;
      }
    }
    if (typeof minimum === "number") {
      json.minimum = minimum;
      if (typeof exclusiveMinimum === "number" && ctx.target !== "draft-04") {
        if (exclusiveMinimum >= minimum)
          delete json.minimum;
        else
          delete json.exclusiveMinimum;
      }
    }
    if (typeof exclusiveMaximum === "number") {
      if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
        json.maximum = exclusiveMaximum;
        json.exclusiveMaximum = true;
      } else {
        json.exclusiveMaximum = exclusiveMaximum;
      }
    }
    if (typeof maximum === "number") {
      json.maximum = maximum;
      if (typeof exclusiveMaximum === "number" && ctx.target !== "draft-04") {
        if (exclusiveMaximum <= maximum)
          delete json.maximum;
        else
          delete json.exclusiveMaximum;
      }
    }
    if (typeof multipleOf === "number")
      json.multipleOf = multipleOf;
  };
  var nullProcessor = (_schema, ctx, json, _params) => {
    if (ctx.target === "openapi-3.0") {
      json.type = "string";
      json.nullable = true;
      json.enum = [null];
    } else {
      json.type = "null";
    }
  };
  var voidProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Void cannot be represented in JSON Schema");
    }
  };
  var neverProcessor = (_schema, _ctx, json, _params) => {
    json.not = {};
  };
  var anyProcessor = (_schema, _ctx, _json, _params) => {
  };
  var unknownProcessor = (_schema, _ctx, _json, _params) => {
  };
  var enumProcessor = (schema, _ctx, json, _params) => {
    const def = schema._zod.def;
    const values = getEnumValues(def.entries);
    if (values.every((v3) => typeof v3 === "number"))
      json.type = "number";
    if (values.every((v3) => typeof v3 === "string"))
      json.type = "string";
    json.enum = values;
  };
  var literalProcessor = (schema, ctx, json, _params) => {
    const def = schema._zod.def;
    const vals = [];
    for (const val of def.values) {
      if (val === void 0) {
        if (ctx.unrepresentable === "throw") {
          throw new Error("Literal `undefined` cannot be represented in JSON Schema");
        } else {
        }
      } else if (typeof val === "bigint") {
        if (ctx.unrepresentable === "throw") {
          throw new Error("BigInt literals cannot be represented in JSON Schema");
        } else {
          vals.push(Number(val));
        }
      } else {
        vals.push(val);
      }
    }
    if (vals.length === 0) {
    } else if (vals.length === 1) {
      const val = vals[0];
      json.type = val === null ? "null" : typeof val;
      if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
        json.enum = [val];
      } else {
        json.const = val;
      }
    } else {
      if (vals.every((v3) => typeof v3 === "number"))
        json.type = "number";
      if (vals.every((v3) => typeof v3 === "string"))
        json.type = "string";
      if (vals.every((v3) => typeof v3 === "boolean"))
        json.type = "boolean";
      if (vals.every((v3) => v3 === null))
        json.type = "null";
      json.enum = vals;
    }
  };
  var customProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Custom types cannot be represented in JSON Schema");
    }
  };
  var functionProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Function types cannot be represented in JSON Schema");
    }
  };
  var transformProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Transforms cannot be represented in JSON Schema");
    }
  };
  var arrayProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    const { minimum, maximum } = schema._zod.bag;
    if (typeof minimum === "number")
      json.minItems = minimum;
    if (typeof maximum === "number")
      json.maxItems = maximum;
    json.type = "array";
    json.items = process(def.element, ctx, { ...params, path: [...params.path, "items"] });
  };
  var objectProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    json.type = "object";
    json.properties = {};
    const shape = def.shape;
    for (const key in shape) {
      json.properties[key] = process(shape[key], ctx, {
        ...params,
        path: [...params.path, "properties", key]
      });
    }
    const allKeys = new Set(Object.keys(shape));
    const requiredKeys = new Set([...allKeys].filter((key) => {
      const v3 = def.shape[key]._zod;
      if (ctx.io === "input") {
        return v3.optin === void 0;
      } else {
        return v3.optout === void 0;
      }
    }));
    if (requiredKeys.size > 0) {
      json.required = Array.from(requiredKeys);
    }
    if (def.catchall?._zod.def.type === "never") {
      json.additionalProperties = false;
    } else if (!def.catchall) {
      if (ctx.io === "output")
        json.additionalProperties = false;
    } else if (def.catchall) {
      json.additionalProperties = process(def.catchall, ctx, {
        ...params,
        path: [...params.path, "additionalProperties"]
      });
    }
  };
  var unionProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    const isExclusive = def.inclusive === false;
    const options = def.options.map((x4, i) => process(x4, ctx, {
      ...params,
      path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
    }));
    if (isExclusive) {
      json.oneOf = options;
    } else {
      json.anyOf = options;
    }
  };
  var intersectionProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    const a4 = process(def.left, ctx, {
      ...params,
      path: [...params.path, "allOf", 0]
    });
    const b6 = process(def.right, ctx, {
      ...params,
      path: [...params.path, "allOf", 1]
    });
    const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
    const allOf = [
      ...isSimpleIntersection(a4) ? a4.allOf : [a4],
      ...isSimpleIntersection(b6) ? b6.allOf : [b6]
    ];
    json.allOf = allOf;
  };
  var tupleProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    json.type = "array";
    const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
    const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
    const prefixItems = def.items.map((x4, i) => process(x4, ctx, {
      ...params,
      path: [...params.path, prefixPath, i]
    }));
    const rest = def.rest ? process(def.rest, ctx, {
      ...params,
      path: [...params.path, restPath, ...ctx.target === "openapi-3.0" ? [def.items.length] : []]
    }) : null;
    if (ctx.target === "draft-2020-12") {
      json.prefixItems = prefixItems;
      if (rest) {
        json.items = rest;
      }
    } else if (ctx.target === "openapi-3.0") {
      json.items = {
        anyOf: prefixItems
      };
      if (rest) {
        json.items.anyOf.push(rest);
      }
      json.minItems = prefixItems.length;
      if (!rest) {
        json.maxItems = prefixItems.length;
      }
    } else {
      json.items = prefixItems;
      if (rest) {
        json.additionalItems = rest;
      }
    }
    const { minimum, maximum } = schema._zod.bag;
    if (typeof minimum === "number")
      json.minItems = minimum;
    if (typeof maximum === "number")
      json.maxItems = maximum;
  };
  var nullableProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    const inner = process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    if (ctx.target === "openapi-3.0") {
      seen.ref = def.innerType;
      json.nullable = true;
    } else {
      json.anyOf = [inner, { type: "null" }];
    }
  };
  var nonoptionalProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
  };
  var defaultProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    json.default = JSON.parse(JSON.stringify(def.defaultValue));
  };
  var prefaultProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    if (ctx.io === "input")
      json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
  };
  var catchProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    let catchValue;
    try {
      catchValue = def.catchValue(void 0);
    } catch {
      throw new Error("Dynamic catch values are not supported in JSON Schema");
    }
    json.default = catchValue;
  };
  var pipeProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    const innerType = ctx.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
    process(innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = innerType;
  };
  var readonlyProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    json.readOnly = true;
  };
  var optionalProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
  };

  // node_modules/zod/v4/classic/iso.js
  var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
    $ZodISODateTime.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function datetime2(params) {
    return _isoDateTime(ZodISODateTime, params);
  }
  var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
    $ZodISODate.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function date2(params) {
    return _isoDate(ZodISODate, params);
  }
  var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
    $ZodISOTime.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function time2(params) {
    return _isoTime(ZodISOTime, params);
  }
  var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
    $ZodISODuration.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function duration2(params) {
    return _isoDuration(ZodISODuration, params);
  }

  // node_modules/zod/v4/classic/errors.js
  var initializer2 = (inst, issues) => {
    $ZodError.init(inst, issues);
    inst.name = "ZodError";
    Object.defineProperties(inst, {
      format: {
        value: (mapper) => formatError(inst, mapper)
        // enumerable: false,
      },
      flatten: {
        value: (mapper) => flattenError(inst, mapper)
        // enumerable: false,
      },
      addIssue: {
        value: (issue2) => {
          inst.issues.push(issue2);
          inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
        }
        // enumerable: false,
      },
      addIssues: {
        value: (issues2) => {
          inst.issues.push(...issues2);
          inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
        }
        // enumerable: false,
      },
      isEmpty: {
        get() {
          return inst.issues.length === 0;
        }
        // enumerable: false,
      }
    });
  };
  var ZodError = $constructor("ZodError", initializer2);
  var ZodRealError = $constructor("ZodError", initializer2, {
    Parent: Error
  });

  // node_modules/zod/v4/classic/parse.js
  var parse2 = /* @__PURE__ */ _parse(ZodRealError);
  var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
  var safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
  var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
  var encode3 = /* @__PURE__ */ _encode(ZodRealError);
  var decode3 = /* @__PURE__ */ _decode(ZodRealError);
  var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
  var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
  var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
  var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
  var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
  var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

  // node_modules/zod/v4/classic/schemas.js
  var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
    $ZodType.init(inst, def);
    Object.assign(inst["~standard"], {
      jsonSchema: {
        input: createStandardJSONSchemaMethod(inst, "input"),
        output: createStandardJSONSchemaMethod(inst, "output")
      }
    });
    inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
    inst.def = def;
    inst.type = def.type;
    Object.defineProperty(inst, "_def", { value: def });
    inst.check = (...checks) => {
      return inst.clone(util_exports.mergeDefs(def, {
        checks: [
          ...def.checks ?? [],
          ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), {
        parent: true
      });
    };
    inst.with = inst.check;
    inst.clone = (def2, params) => clone(inst, def2, params);
    inst.brand = () => inst;
    inst.register = ((reg, meta2) => {
      reg.add(inst, meta2);
      return inst;
    });
    inst.parse = (data, params) => parse2(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => safeParse2(inst, data, params);
    inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
    inst.spa = inst.safeParseAsync;
    inst.encode = (data, params) => encode3(inst, data, params);
    inst.decode = (data, params) => decode3(inst, data, params);
    inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
    inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
    inst.safeEncode = (data, params) => safeEncode(inst, data, params);
    inst.safeDecode = (data, params) => safeDecode(inst, data, params);
    inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
    inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
    inst.refine = (check, params) => inst.check(refine(check, params));
    inst.superRefine = (refinement) => inst.check(superRefine(refinement));
    inst.overwrite = (fn) => inst.check(_overwrite(fn));
    inst.optional = () => optional(inst);
    inst.exactOptional = () => exactOptional(inst);
    inst.nullable = () => nullable(inst);
    inst.nullish = () => optional(nullable(inst));
    inst.nonoptional = (params) => nonoptional(inst, params);
    inst.array = () => array(inst);
    inst.or = (arg) => union([inst, arg]);
    inst.and = (arg) => intersection(inst, arg);
    inst.transform = (tx) => pipe(inst, transform(tx));
    inst.default = (def2) => _default(inst, def2);
    inst.prefault = (def2) => prefault(inst, def2);
    inst.catch = (params) => _catch(inst, params);
    inst.pipe = (target) => pipe(inst, target);
    inst.readonly = () => readonly(inst);
    inst.describe = (description) => {
      const cl = inst.clone();
      globalRegistry.add(cl, { description });
      return cl;
    };
    Object.defineProperty(inst, "description", {
      get() {
        return globalRegistry.get(inst)?.description;
      },
      configurable: true
    });
    inst.meta = (...args) => {
      if (args.length === 0) {
        return globalRegistry.get(inst);
      }
      const cl = inst.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    };
    inst.isOptional = () => inst.safeParse(void 0).success;
    inst.isNullable = () => inst.safeParse(null).success;
    inst.apply = (fn) => fn(inst);
    return inst;
  });
  var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
    const bag = inst._zod.bag;
    inst.format = bag.format ?? null;
    inst.minLength = bag.minimum ?? null;
    inst.maxLength = bag.maximum ?? null;
    inst.regex = (...args) => inst.check(_regex(...args));
    inst.includes = (...args) => inst.check(_includes(...args));
    inst.startsWith = (...args) => inst.check(_startsWith(...args));
    inst.endsWith = (...args) => inst.check(_endsWith(...args));
    inst.min = (...args) => inst.check(_minLength(...args));
    inst.max = (...args) => inst.check(_maxLength(...args));
    inst.length = (...args) => inst.check(_length(...args));
    inst.nonempty = (...args) => inst.check(_minLength(1, ...args));
    inst.lowercase = (params) => inst.check(_lowercase(params));
    inst.uppercase = (params) => inst.check(_uppercase(params));
    inst.trim = () => inst.check(_trim());
    inst.normalize = (...args) => inst.check(_normalize(...args));
    inst.toLowerCase = () => inst.check(_toLowerCase());
    inst.toUpperCase = () => inst.check(_toUpperCase());
    inst.slugify = () => inst.check(_slugify());
  });
  var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    _ZodString.init(inst, def);
    inst.email = (params) => inst.check(_email(ZodEmail, params));
    inst.url = (params) => inst.check(_url(ZodURL, params));
    inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
    inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
    inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
    inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
    inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
    inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
    inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
    inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
    inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
    inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
    inst.xid = (params) => inst.check(_xid(ZodXID, params));
    inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
    inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
    inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
    inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
    inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
    inst.e164 = (params) => inst.check(_e164(ZodE164, params));
    inst.datetime = (params) => inst.check(datetime2(params));
    inst.date = (params) => inst.check(date2(params));
    inst.time = (params) => inst.check(time2(params));
    inst.duration = (params) => inst.check(duration2(params));
  });
  function string2(params) {
    return _string(ZodString, params);
  }
  var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    _ZodString.init(inst, def);
  });
  var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
    $ZodEmail.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
    $ZodGUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
    $ZodUUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
    $ZodURL.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function url(params) {
    return _url(ZodURL, params);
  }
  var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
    $ZodEmoji.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
    $ZodNanoID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
    $ZodCUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
    $ZodCUID2.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
    $ZodULID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
    $ZodXID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
    $ZodKSUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
    $ZodIPv4.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
    $ZodIPv6.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
    $ZodCIDRv4.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
    $ZodCIDRv6.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
    $ZodBase64.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
    $ZodBase64URL.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
    $ZodE164.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
    $ZodJWT.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
    $ZodNumber.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
    inst.gt = (value, params) => inst.check(_gt(value, params));
    inst.gte = (value, params) => inst.check(_gte(value, params));
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.lt = (value, params) => inst.check(_lt(value, params));
    inst.lte = (value, params) => inst.check(_lte(value, params));
    inst.max = (value, params) => inst.check(_lte(value, params));
    inst.int = (params) => inst.check(int(params));
    inst.safe = (params) => inst.check(int(params));
    inst.positive = (params) => inst.check(_gt(0, params));
    inst.nonnegative = (params) => inst.check(_gte(0, params));
    inst.negative = (params) => inst.check(_lt(0, params));
    inst.nonpositive = (params) => inst.check(_lte(0, params));
    inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
    inst.step = (value, params) => inst.check(_multipleOf(value, params));
    inst.finite = () => inst;
    const bag = inst._zod.bag;
    inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
    inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
    inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
    inst.isFinite = true;
    inst.format = bag.format ?? null;
  });
  function number2(params) {
    return _number(ZodNumber, params);
  }
  var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
    $ZodNumberFormat.init(inst, def);
    ZodNumber.init(inst, def);
  });
  function int(params) {
    return _int(ZodNumberFormat, params);
  }
  var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
    $ZodNull.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
  });
  function _null3(params) {
    return _null2(ZodNull, params);
  }
  var ZodAny = /* @__PURE__ */ $constructor("ZodAny", (inst, def) => {
    $ZodAny.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => anyProcessor(inst, ctx, json, params);
  });
  function any() {
    return _any(ZodAny);
  }
  var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
    $ZodUnknown.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
  });
  function unknown() {
    return _unknown(ZodUnknown);
  }
  var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
    $ZodNever.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
  });
  function never(params) {
    return _never(ZodNever, params);
  }
  var ZodVoid = /* @__PURE__ */ $constructor("ZodVoid", (inst, def) => {
    $ZodVoid.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => voidProcessor(inst, ctx, json, params);
  });
  function _void2(params) {
    return _void(ZodVoid, params);
  }
  var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
    $ZodArray.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
    inst.element = def.element;
    inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
    inst.nonempty = (params) => inst.check(_minLength(1, params));
    inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
    inst.length = (len, params) => inst.check(_length(len, params));
    inst.unwrap = () => inst.element;
  });
  function array(element, params) {
    return _array(ZodArray, element, params);
  }
  var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
    $ZodObjectJIT.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
    util_exports.defineLazy(inst, "shape", () => {
      return def.shape;
    });
    inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
    inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall });
    inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
    inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
    inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() });
    inst.strip = () => inst.clone({ ...inst._zod.def, catchall: void 0 });
    inst.extend = (incoming) => {
      return util_exports.extend(inst, incoming);
    };
    inst.safeExtend = (incoming) => {
      return util_exports.safeExtend(inst, incoming);
    };
    inst.merge = (other) => util_exports.merge(inst, other);
    inst.pick = (mask) => util_exports.pick(inst, mask);
    inst.omit = (mask) => util_exports.omit(inst, mask);
    inst.partial = (...args) => util_exports.partial(ZodOptional, inst, args[0]);
    inst.required = (...args) => util_exports.required(ZodNonOptional, inst, args[0]);
  });
  function object(shape, params) {
    const def = {
      type: "object",
      shape: shape ?? {},
      ...util_exports.normalizeParams(params)
    };
    return new ZodObject(def);
  }
  var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
    inst.options = def.options;
  });
  function union(options, params) {
    return new ZodUnion({
      type: "union",
      options,
      ...util_exports.normalizeParams(params)
    });
  }
  var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
    $ZodIntersection.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
  });
  function intersection(left, right) {
    return new ZodIntersection({
      type: "intersection",
      left,
      right
    });
  }
  var ZodTuple = /* @__PURE__ */ $constructor("ZodTuple", (inst, def) => {
    $ZodTuple.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => tupleProcessor(inst, ctx, json, params);
    inst.rest = (rest) => inst.clone({
      ...inst._zod.def,
      rest
    });
  });
  function tuple(items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof $ZodType;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new ZodTuple({
      type: "tuple",
      items,
      rest,
      ...util_exports.normalizeParams(params)
    });
  }
  var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
    $ZodEnum.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
    inst.enum = def.entries;
    inst.options = Object.values(def.entries);
    const keys = new Set(Object.keys(def.entries));
    inst.extract = (values, params) => {
      const newEntries = {};
      for (const value of values) {
        if (keys.has(value)) {
          newEntries[value] = def.entries[value];
        } else
          throw new Error(`Key ${value} not found in enum`);
      }
      return new ZodEnum({
        ...def,
        checks: [],
        ...util_exports.normalizeParams(params),
        entries: newEntries
      });
    };
    inst.exclude = (values, params) => {
      const newEntries = { ...def.entries };
      for (const value of values) {
        if (keys.has(value)) {
          delete newEntries[value];
        } else
          throw new Error(`Key ${value} not found in enum`);
      }
      return new ZodEnum({
        ...def,
        checks: [],
        ...util_exports.normalizeParams(params),
        entries: newEntries
      });
    };
  });
  function _enum(values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v3) => [v3, v3])) : values;
    return new ZodEnum({
      type: "enum",
      entries,
      ...util_exports.normalizeParams(params)
    });
  }
  function nativeEnum(entries, params) {
    return new ZodEnum({
      type: "enum",
      entries,
      ...util_exports.normalizeParams(params)
    });
  }
  var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
    $ZodLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
    inst.values = new Set(def.values);
    Object.defineProperty(inst, "value", {
      get() {
        if (def.values.length > 1) {
          throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
        }
        return def.values[0];
      }
    });
  });
  function literal(value, params) {
    return new ZodLiteral({
      type: "literal",
      values: Array.isArray(value) ? value : [value],
      ...util_exports.normalizeParams(params)
    });
  }
  var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
    $ZodTransform.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
    inst._zod.parse = (payload, _ctx) => {
      if (_ctx.direction === "backward") {
        throw new $ZodEncodeError(inst.constructor.name);
      }
      payload.addIssue = (issue2) => {
        if (typeof issue2 === "string") {
          payload.issues.push(util_exports.issue(issue2, payload.value, def));
        } else {
          const _issue = issue2;
          if (_issue.fatal)
            _issue.continue = false;
          _issue.code ?? (_issue.code = "custom");
          _issue.input ?? (_issue.input = payload.value);
          _issue.inst ?? (_issue.inst = inst);
          payload.issues.push(util_exports.issue(_issue));
        }
      };
      const output = def.transform(payload.value, payload);
      if (output instanceof Promise) {
        return output.then((output2) => {
          payload.value = output2;
          return payload;
        });
      }
      payload.value = output;
      return payload;
    };
  });
  function transform(fn) {
    return new ZodTransform({
      type: "transform",
      transform: fn
    });
  }
  var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function optional(innerType) {
    return new ZodOptional({
      type: "optional",
      innerType
    });
  }
  var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
    $ZodExactOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function exactOptional(innerType) {
    return new ZodExactOptional({
      type: "optional",
      innerType
    });
  }
  var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
    $ZodNullable.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function nullable(innerType) {
    return new ZodNullable({
      type: "nullable",
      innerType
    });
  }
  var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
    $ZodDefault.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeDefault = inst.unwrap;
  });
  function _default(innerType, defaultValue) {
    return new ZodDefault({
      type: "default",
      innerType,
      get defaultValue() {
        return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
      }
    });
  }
  var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
    $ZodPrefault.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function prefault(innerType, defaultValue) {
    return new ZodPrefault({
      type: "prefault",
      innerType,
      get defaultValue() {
        return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
      }
    });
  }
  var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
    $ZodNonOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function nonoptional(innerType, params) {
    return new ZodNonOptional({
      type: "nonoptional",
      innerType,
      ...util_exports.normalizeParams(params)
    });
  }
  var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
    $ZodCatch.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeCatch = inst.unwrap;
  });
  function _catch(innerType, catchValue) {
    return new ZodCatch({
      type: "catch",
      innerType,
      catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
    });
  }
  var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
    $ZodPipe.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
    inst.in = def.in;
    inst.out = def.out;
  });
  function pipe(in_, out) {
    return new ZodPipe({
      type: "pipe",
      in: in_,
      out
      // ...util.normalizeParams(params),
    });
  }
  var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
    $ZodReadonly.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function readonly(innerType) {
    return new ZodReadonly({
      type: "readonly",
      innerType
    });
  }
  var ZodFunction = /* @__PURE__ */ $constructor("ZodFunction", (inst, def) => {
    $ZodFunction.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => functionProcessor(inst, ctx, json, params);
  });
  function _function(params) {
    return new ZodFunction({
      type: "function",
      input: Array.isArray(params?.input) ? tuple(params?.input) : params?.input ?? array(unknown()),
      output: params?.output ?? unknown()
    });
  }
  var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
    $ZodCustom.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
  });
  function refine(fn, _params = {}) {
    return _refine(ZodCustom, fn, _params);
  }
  function superRefine(fn) {
    return _superRefine(fn);
  }

  // node_modules/@dfinity/zod-schemas/dist/index.js
  var f3 = string2().refine((r2) => {
    try {
      return Principal.fromText(r2), true;
    } catch {
      return false;
    }
  }, { error: "Invalid textual representation of a Principal." });
  var p3 = ({ additionalProtocols: r2 = [], allowHttpLocally: o3 = true }) => url().refine((a4) => {
    try {
      let t = [.../* @__PURE__ */ new Set(["https:", ...r2])], { protocol: e3, hostname: c2 } = new URL(a4);
      return o3 && ["localhost", "127.0.0.1"].includes(c2) ? ["http:", ...t].includes(e3) : t.includes(e3);
    } catch {
      return false;
    }
  }, { error: "Invalid URL." });
  var u3 = p3({});

  // node_modules/@dfinity/oisy-wallet-signer/icp-wallet.js
  var Qt = Object.defineProperty;
  var Ae = (e3, t) => {
    for (var r2 in t) Qt(e3, r2, { get: t[r2], enumerable: true });
  };
  var P3 = {};
  Ae(P3, { Account: () => J4, Subaccount: () => de, Timestamp: () => le, TransferArgs: () => Pe, TransferError: () => qe, Value: () => we, idlFactory: () => Zt, idlInitArgs: () => Xt, idlService: () => Jt, init: () => Lt2 });
  var de = idl_exports.Vec(idl_exports.Nat8);
  var J4 = idl_exports.Record({ owner: idl_exports.Principal, subaccount: idl_exports.Opt(de) });
  var we = idl_exports.Variant({ Int: idl_exports.Int, Nat: idl_exports.Nat, Blob: idl_exports.Vec(idl_exports.Nat8), Text: idl_exports.Text });
  var le = idl_exports.Nat64;
  var Pe = idl_exports.Record({ to: J4, fee: idl_exports.Opt(idl_exports.Nat), memo: idl_exports.Opt(idl_exports.Vec(idl_exports.Nat8)), from_subaccount: idl_exports.Opt(de), created_at_time: idl_exports.Opt(le), amount: idl_exports.Nat });
  var qe = idl_exports.Variant({ GenericError: idl_exports.Record({ message: idl_exports.Text, error_code: idl_exports.Nat }), TemporarilyUnavailable: idl_exports.Null, BadBurn: idl_exports.Record({ min_burn_amount: idl_exports.Nat }), Duplicate: idl_exports.Record({ duplicate_of: idl_exports.Nat }), BadFee: idl_exports.Record({ expected_fee: idl_exports.Nat }), CreatedInFuture: idl_exports.Record({ ledger_time: le }), TooOld: idl_exports.Null, InsufficientFunds: idl_exports.Record({ balance: idl_exports.Nat }) });
  var Jt = idl_exports.Service({ icrc1_balance_of: idl_exports.Func([J4], [idl_exports.Nat], ["query"]), icrc1_decimals: idl_exports.Func([], [idl_exports.Nat8], ["query"]), icrc1_fee: idl_exports.Func([], [idl_exports.Nat], ["query"]), icrc1_metadata: idl_exports.Func([], [idl_exports.Vec(idl_exports.Tuple(idl_exports.Text, we))], ["query"]), icrc1_minting_account: idl_exports.Func([], [idl_exports.Opt(J4)], ["query"]), icrc1_name: idl_exports.Func([], [idl_exports.Text], ["query"]), icrc1_supported_standards: idl_exports.Func([], [idl_exports.Vec(idl_exports.Record({ url: idl_exports.Text, name: idl_exports.Text }))], ["query"]), icrc1_symbol: idl_exports.Func([], [idl_exports.Text], ["query"]), icrc1_total_supply: idl_exports.Func([], [idl_exports.Nat], ["query"]), icrc1_transfer: idl_exports.Func([Pe], [idl_exports.Variant({ Ok: idl_exports.Nat, Err: qe })], []) });
  var Xt = [];
  var Zt = ({ IDL: e3 }) => {
    let t = e3.Vec(e3.Nat8), r2 = e3.Record({ owner: e3.Principal, subaccount: e3.Opt(t) }), c2 = e3.Variant({ Int: e3.Int, Nat: e3.Nat, Blob: e3.Vec(e3.Nat8), Text: e3.Text }), n = e3.Nat64, s3 = e3.Record({ to: r2, fee: e3.Opt(e3.Nat), memo: e3.Opt(e3.Vec(e3.Nat8)), from_subaccount: e3.Opt(t), created_at_time: e3.Opt(n), amount: e3.Nat }), a4 = e3.Variant({ GenericError: e3.Record({ message: e3.Text, error_code: e3.Nat }), TemporarilyUnavailable: e3.Null, BadBurn: e3.Record({ min_burn_amount: e3.Nat }), Duplicate: e3.Record({ duplicate_of: e3.Nat }), BadFee: e3.Record({ expected_fee: e3.Nat }), CreatedInFuture: e3.Record({ ledger_time: n }), TooOld: e3.Null, InsufficientFunds: e3.Record({ balance: e3.Nat }) });
    return e3.Service({ icrc1_balance_of: e3.Func([r2], [e3.Nat], ["query"]), icrc1_decimals: e3.Func([], [e3.Nat8], ["query"]), icrc1_fee: e3.Func([], [e3.Nat], ["query"]), icrc1_metadata: e3.Func([], [e3.Vec(e3.Tuple(e3.Text, c2))], ["query"]), icrc1_minting_account: e3.Func([], [e3.Opt(r2)], ["query"]), icrc1_name: e3.Func([], [e3.Text], ["query"]), icrc1_supported_standards: e3.Func([], [e3.Vec(e3.Record({ url: e3.Text, name: e3.Text }))], ["query"]), icrc1_symbol: e3.Func([], [e3.Text], ["query"]), icrc1_total_supply: e3.Func([], [e3.Nat], ["query"]), icrc1_transfer: e3.Func([s3], [e3.Variant({ Ok: e3.Nat, Err: a4 })], []) });
  };
  var Lt2 = ({ IDL: e3 }) => [];
  var N3 = {};
  Ae(N3, { Account: () => q3, AllowanceArgs: () => be, ApproveArgs: () => Ue, ApproveError: () => ve, TransferFromArgs: () => Me, TransferFromError: () => ze, idlFactory: () => tr, idlInitArgs: () => er, idlService: () => Dt, init: () => rr });
  var q3 = idl_exports.Record({ owner: idl_exports.Principal, subaccount: idl_exports.Opt(idl_exports.Vec(idl_exports.Nat8)) });
  var be = idl_exports.Record({ account: q3, spender: q3 });
  var Ue = idl_exports.Record({ fee: idl_exports.Opt(idl_exports.Nat), memo: idl_exports.Opt(idl_exports.Vec(idl_exports.Nat8)), from_subaccount: idl_exports.Opt(idl_exports.Vec(idl_exports.Nat8)), created_at_time: idl_exports.Opt(idl_exports.Nat64), amount: idl_exports.Nat, expected_allowance: idl_exports.Opt(idl_exports.Nat), expires_at: idl_exports.Opt(idl_exports.Nat64), spender: q3 });
  var ve = idl_exports.Variant({ GenericError: idl_exports.Record({ message: idl_exports.Text, error_code: idl_exports.Nat }), TemporarilyUnavailable: idl_exports.Null, Duplicate: idl_exports.Record({ duplicate_of: idl_exports.Nat }), BadFee: idl_exports.Record({ expected_fee: idl_exports.Nat }), AllowanceChanged: idl_exports.Record({ current_allowance: idl_exports.Nat }), CreatedInFuture: idl_exports.Record({ ledger_time: idl_exports.Nat64 }), TooOld: idl_exports.Null, Expired: idl_exports.Record({ ledger_time: idl_exports.Nat64 }), InsufficientFunds: idl_exports.Record({ balance: idl_exports.Nat }) });
  var Me = idl_exports.Record({ to: q3, fee: idl_exports.Opt(idl_exports.Nat), spender_subaccount: idl_exports.Opt(idl_exports.Vec(idl_exports.Nat8)), from: q3, memo: idl_exports.Opt(idl_exports.Vec(idl_exports.Nat8)), created_at_time: idl_exports.Opt(idl_exports.Nat64), amount: idl_exports.Nat });
  var ze = idl_exports.Variant({ GenericError: idl_exports.Record({ message: idl_exports.Text, error_code: idl_exports.Nat }), TemporarilyUnavailable: idl_exports.Null, InsufficientAllowance: idl_exports.Record({ allowance: idl_exports.Nat }), BadBurn: idl_exports.Record({ min_burn_amount: idl_exports.Nat }), Duplicate: idl_exports.Record({ duplicate_of: idl_exports.Nat }), BadFee: idl_exports.Record({ expected_fee: idl_exports.Nat }), CreatedInFuture: idl_exports.Record({ ledger_time: idl_exports.Nat64 }), TooOld: idl_exports.Null, InsufficientFunds: idl_exports.Record({ balance: idl_exports.Nat }) });
  var Dt = idl_exports.Service({ icrc1_supported_standards: idl_exports.Func([], [idl_exports.Vec(idl_exports.Record({ url: idl_exports.Text, name: idl_exports.Text }))], ["query"]), icrc2_allowance: idl_exports.Func([be], [idl_exports.Record({ allowance: idl_exports.Nat, expires_at: idl_exports.Opt(idl_exports.Nat64) })], ["query"]), icrc2_approve: idl_exports.Func([Ue], [idl_exports.Variant({ Ok: idl_exports.Nat, Err: ve })], []), icrc2_transfer_from: idl_exports.Func([Me], [idl_exports.Variant({ Ok: idl_exports.Nat, Err: ze })], []) });
  var er = [];
  var tr = ({ IDL: e3 }) => {
    let t = e3.Record({ owner: e3.Principal, subaccount: e3.Opt(e3.Vec(e3.Nat8)) }), r2 = e3.Record({ account: t, spender: t }), c2 = e3.Record({ fee: e3.Opt(e3.Nat), memo: e3.Opt(e3.Vec(e3.Nat8)), from_subaccount: e3.Opt(e3.Vec(e3.Nat8)), created_at_time: e3.Opt(e3.Nat64), amount: e3.Nat, expected_allowance: e3.Opt(e3.Nat), expires_at: e3.Opt(e3.Nat64), spender: t }), n = e3.Variant({ GenericError: e3.Record({ message: e3.Text, error_code: e3.Nat }), TemporarilyUnavailable: e3.Null, Duplicate: e3.Record({ duplicate_of: e3.Nat }), BadFee: e3.Record({ expected_fee: e3.Nat }), AllowanceChanged: e3.Record({ current_allowance: e3.Nat }), CreatedInFuture: e3.Record({ ledger_time: e3.Nat64 }), TooOld: e3.Null, Expired: e3.Record({ ledger_time: e3.Nat64 }), InsufficientFunds: e3.Record({ balance: e3.Nat }) }), s3 = e3.Record({ to: t, fee: e3.Opt(e3.Nat), spender_subaccount: e3.Opt(e3.Vec(e3.Nat8)), from: t, memo: e3.Opt(e3.Vec(e3.Nat8)), created_at_time: e3.Opt(e3.Nat64), amount: e3.Nat }), a4 = e3.Variant({ GenericError: e3.Record({ message: e3.Text, error_code: e3.Nat }), TemporarilyUnavailable: e3.Null, InsufficientAllowance: e3.Record({ allowance: e3.Nat }), BadBurn: e3.Record({ min_burn_amount: e3.Nat }), Duplicate: e3.Record({ duplicate_of: e3.Nat }), BadFee: e3.Record({ expected_fee: e3.Nat }), CreatedInFuture: e3.Record({ ledger_time: e3.Nat64 }), TooOld: e3.Null, InsufficientFunds: e3.Record({ balance: e3.Nat }) });
    return e3.Service({ icrc1_supported_standards: e3.Func([], [e3.Vec(e3.Record({ url: e3.Text, name: e3.Text }))], ["query"]), icrc2_allowance: e3.Func([r2], [e3.Record({ allowance: e3.Nat, expires_at: e3.Opt(e3.Nat64) })], ["query"]), icrc2_approve: e3.Func([c2], [e3.Variant({ Ok: e3.Nat, Err: n })], []), icrc2_transfer_from: e3.Func([s3], [e3.Variant({ Ok: e3.Nat, Err: a4 })], []) });
  };
  var rr = ({ IDL: e3 }) => [];
  var We2 = idl_exports.Variant({ Ok: idl_exports.Nat, Err: P3.TransferError });
  var Be = idl_exports.Variant({ Ok: idl_exports.Nat, Err: N3.ApproveError });
  var lo = idl_exports.Variant({ Ok: idl_exports.Nat, Err: N3.TransferFromError });
  var Ve = "icrc21_call_consent_message";
  var Z2 = "icrc25_request_permissions";
  var L2 = "icrc25_permissions";
  var D3 = "icrc25_supported_standards";
  var M2 = "icrc27_accounts";
  var z3 = "icrc29_status";
  var F3 = "icrc49_call_canister";
  var ee2 = "granted";
  var Ge = "denied";
  var ke = "ask_on_use";
  var Ye = "ICRC-21";
  var je = "ICRC-25";
  var $e = "ICRC-27";
  var He = "ICRC-29";
  var Ke = "ICRC-49";
  var or = _enum([Ve, Z2, L2, D3, M2, z3, F3]);
  var re = or.extract([M2, F3]);
  var Qe = _enum([ee2, Ge, ke]);
  var me = _enum([Ye, je, $e, He, Ke]);
  var Je = 5e3;
  var oe = 120 * 1e3;
  var Re2 = 5e3;
  var Xe = oe;
  var Ze = Re2;
  var Le = oe;
  var De = Re2;
  var et2 = oe;
  var tt2 = oe;
  var rt = Re2;
  var ot2 = { scopes: Object.values(re.enum).map((e3) => ({ method: e3 })) };
  var W3 = "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no";
  var nt2 = { width: 576, height: 625 };
  var st2 = { ...nt2, position: "top-right", features: W3 };
  var go = { ...nt2, position: "center", features: W3 };
  var ct2 = "http://localhost:4943";
  var it2 = "https://icp-api.io";
  var I4 = "2.0";
  var nr = literal(I4);
  var B4 = union([string2(), number2(), _null3()]);
  var at = object({ jsonrpc: nr, id: optional(B4) });
  var sr = at.extend({ id: B4 }).merge(object({ method: string2(), params: optional(any()) })).strict();
  var To = sr.omit({ id: true }).strict();
  var pt = ((a4) => (a4[a4.PARSE_ERROR = -32700] = "PARSE_ERROR", a4[a4.INVALID_REQUEST = -32600] = "INVALID_REQUEST", a4[a4.METHOD_NOT_FOUND = -32601] = "METHOD_NOT_FOUND", a4[a4.INVALID_PARAMS = -32602] = "INVALID_PARAMS", a4[a4.INTERNAL_ERROR = -32603] = "INTERNAL_ERROR", a4[a4.SERVER_ERROR = -32e3] = "SERVER_ERROR", a4))(pt || {});
  var cr = union([number2(), nativeEnum(pt)]);
  var ut2 = object({ code: cr, message: string2(), data: optional(never()) });
  var ir = at.extend({ id: B4 });
  var ye = ir.extend({ error: ut2 }).strict();
  var C4 = (e3) => ye.omit({ error: true }).merge(object({ result: e3, error: ut2 }).partial()).strict().refine(({ result: t, error: r2 }) => t !== void 0 || r2 !== void 0, "Either result or error should be provided.");
  var fe = C4(any());
  var pr = async (e3) => {
    await new Promise((t) => {
      setTimeout(t, e3);
    });
  };
  var he2 = async ({ retries: e3, isReady: t, fn: r2, intervalInMilliseconds: c2 = 500 }) => {
    let n = t();
    if (n !== "pending") return n;
    let s3 = e3 - 1;
    return s3 === 0 ? "timeout" : (r2(), await pr(c2), await he2({ retries: s3, intervalInMilliseconds: c2, isReady: t, fn: r2 }));
  };
  var dt2 = async ({ popup: e3, id: t, isReady: r2, timeoutInMilliseconds: c2, intervalInMilliseconds: n }) => {
    let s3 = () => {
      V4({ popup: e3, msg: { jsonrpc: I4, id: t, method: z3 }, origin: "*" });
    };
    return await he2({ retries: c2 / (n ?? 500), intervalInMilliseconds: n, isReady: r2, fn: s3 });
  };
  var lt2 = ({ id: e3, ...t }) => {
    V4({ msg: { jsonrpc: I4, id: e3, method: z3 }, ...t });
  };
  var mt = ({ id: e3, ...t }) => {
    V4({ msg: { jsonrpc: I4, id: e3, method: D3 }, ...t });
  };
  var Rt = ({ id: e3, ...t }) => {
    V4({ msg: { jsonrpc: I4, id: e3, method: L2 }, ...t });
  };
  var yt = ({ id: e3, params: t, ...r2 }) => {
    Se({ msg: { jsonrpc: I4, id: e3, method: Z2, params: t }, ...r2 });
  };
  var ft2 = ({ id: e3, ...t }) => {
    Se({ msg: { jsonrpc: I4, id: e3, method: M2 }, ...t });
  };
  var ht = ({ id: e3, params: t, ...r2 }) => {
    Se({ msg: { jsonrpc: I4, id: e3, method: F3, params: t }, ...r2 });
  };
  var Se = ({ popup: e3, ...t }) => {
    e3.focus(), V4({ popup: e3, ...t });
  };
  var V4 = ({ popup: e3, msg: t, origin: r2 }) => {
    e3.postMessage(t, r2);
  };
  var G3 = string2().refine((e3) => {
    try {
      return btoa(atob(e3)) === e3;
    } catch {
      return false;
    }
  }, { message: "Invalid base64 string" });
  var lr = G3.refine((e3) => {
    try {
      return vt(e3).length === 32;
    } catch {
      return false;
    }
  }, { message: "Subaccount must be exactly 32 bytes long." });
  var mr = object({ owner: f3, subaccount: lr.optional() }).strict();
  var gt = array(mr).min(1);
  var yr = object({ method: re });
  var fr = object({ scope: yr, state: Qe }).strict();
  var hr = array(fr);
  var Sr = object({ scopes: hr }).strict();
  var _t = C4(Sr);
  var gr = /^https:\/\/github\.com\/dfinity\/ICRC\/blob\/main\/ICRCs\/ICRC-\d+\/ICRC-\d+\.md$/;
  var _r = url().regex(gr).refine((e3) => {
    try {
      u3.parse(e3);
    } catch {
      return false;
    }
    let t = /(ICRC-\d+)\.md/g.exec(e3);
    if (t === null) return false;
    let [r2, c2] = t;
    return Object.keys(me.enum).includes(c2);
  }, { message: "The URL does not match any of the IcrcStandard values." });
  var Ir = array(object({ name: me, url: _r }).strict()).min(1);
  var It = C4(object({ supportedStandards: Ir }));
  var ge2 = C4(literal("ready"));
  var Tt = C4(object({ accounts: gt }));
  var Tr = object({ contentMap: G3, certificate: G3 }).strict();
  var Et2 = C4(Tr.strict());
  var se = class extends Error {
    code;
    constructor({ message: t, code: r2 }) {
      super(t), this.code = r2;
    }
  };
  var k4 = class extends Error {
  };
  var Er = object({ pollingIntervalInMilliseconds: number2().positive().optional(), timeoutInMilliseconds: number2().positive().optional() });
  var Nr = object({ position: _enum(["top-right", "center"]), width: number2().positive(), height: number2().positive(), features: string2().optional() });
  var Cr = _function({ output: _void2() }).optional();
  var xr = u3.optional();
  var Ct = object({ url: u3, windowOptions: union([Nr, string2()]).optional(), connectionOptions: Er.optional(), onDisconnect: Cr, host: xr });
  var xt = object({ timeoutInMilliseconds: number2().positive() });
  var _e = object({ requestId: B4.optional() }).merge(xt.partial());
  var jo = _e.omit({ timeoutInMilliseconds: true }).merge(xt);
  var Ot = ({ hostname: e3 }) => ({ ...(["localhost", "127.0.0.1"].includes(e3) || e3.endsWith(".localhost")) && { shouldFetchRootKey: true } });
  var T3 = class extends Error {
    constructor(t) {
      super(t), this.name = "DecodingError";
    }
  };
  var Or = 55799;
  var At = Symbol("CBOR_STOP_CODE");
  var O3 = ((e3) => (e3[e3.False = 20] = "False", e3[e3.True = 21] = "True", e3[e3.Null = 22] = "Null", e3[e3.Undefined = 23] = "Undefined", e3[e3.Break = 31] = "Break", e3))(O3 || {});
  var g4 = ((e3) => (e3[e3.UnsignedInteger = 0] = "UnsignedInteger", e3[e3.NegativeInteger = 1] = "NegativeInteger", e3[e3.ByteString = 2] = "ByteString", e3[e3.TextString = 3] = "TextString", e3[e3.Array = 4] = "Array", e3[e3.Map = 5] = "Map", e3[e3.Tag = 6] = "Tag", e3[e3.Simple = 7] = "Simple", e3))(g4 || {});
  var Ko2 = BigInt("0xffffffffffffffff");
  var x3 = ((e3) => (e3[e3.Value = 23] = "Value", e3[e3.OneByte = 24] = "OneByte", e3[e3.TwoBytes = 25] = "TwoBytes", e3[e3.FourBytes = 26] = "FourBytes", e3[e3.EightBytes = 27] = "EightBytes", e3[e3.Indefinite = 31] = "Indefinite", e3))(x3 || {});
  var Ie = false;
  function Ar(e3) {
    return e3 == null;
  }
  var wr = new TextDecoder();
  function Pr(e3) {
    return (e3 & 224) >> 5;
  }
  function qr(e3) {
    return e3 & 31;
  }
  var $3 = new Uint8Array();
  var j4;
  var _4 = 0;
  function wt2(e3, t) {
    $3 = e3, _4 = 0;
    let r2 = A4(t);
    return t?.(r2) ?? r2;
  }
  function A4(e3) {
    let [t, r2] = ce();
    switch (t) {
      case g4.UnsignedInteger:
        return b5(r2);
      case g4.NegativeInteger:
        return Mr(r2);
      case g4.ByteString:
        return Pt(r2);
      case g4.TextString:
        return Te2(r2);
      case g4.Array:
        return br(r2, e3);
      case g4.Map:
        return vr(r2, e3);
      case g4.Tag:
        return zr(r2, e3);
      case g4.Simple:
        return Ur(r2);
    }
    throw new T3(`Unsupported major type: ${t}`);
  }
  function ce() {
    let e3 = $3.at(_4);
    if (Ar(e3)) throw new T3("Provided CBOR data is empty");
    let t = Pr(e3), r2 = qr(e3);
    return _4++, [t, r2];
  }
  function br(e3, t) {
    let r2 = b5(e3);
    if (r2 === 1 / 0) {
      let n = [], s3 = A4(t);
      for (; s3 !== At; ) n.push(t?.(s3) ?? s3), s3 = A4(t);
      return n;
    }
    let c2 = new Array(r2);
    for (let n = 0; n < r2; n++) {
      let s3 = A4(t);
      c2[n] = t?.(s3) ?? s3;
    }
    return c2;
  }
  function Ur(e3) {
    switch (e3) {
      case O3.False:
        return false;
      case O3.True:
        return true;
      case O3.Null:
        return null;
      case O3.Undefined:
        return;
      case O3.Break:
        return At;
    }
    throw new T3(`Unrecognized simple type: ${e3.toString(2)}`);
  }
  function vr(e3, t) {
    let r2 = b5(e3), c2 = {};
    if (r2 === 1 / 0) {
      let [n, s3] = ce();
      for (; n !== g4.Simple && s3 !== O3.Break; ) {
        let a4 = Te2(s3), p4 = A4(t);
        c2[a4] = t?.(p4, a4) ?? p4, [n, s3] = ce();
      }
      return c2;
    }
    for (let n = 0; n < r2; n++) {
      let [s3, a4] = ce();
      if (s3 !== g4.TextString) throw new T3("Map keys must be text strings");
      let p4 = Te2(a4), d4 = A4(t);
      c2[p4] = t?.(d4, p4) ?? d4;
    }
    return c2;
  }
  function b5(e3) {
    if (e3 <= x3.Value) return e3;
    switch (j4 = new DataView($3.buffer, $3.byteOffset + _4), e3) {
      case x3.OneByte:
        return _4++, j4.getUint8(0);
      case x3.TwoBytes:
        return _4 += 2, j4.getUint16(0, Ie);
      case x3.FourBytes:
        return _4 += 4, j4.getUint32(0, Ie);
      case x3.EightBytes:
        return _4 += 8, j4.getBigUint64(0, Ie);
      case x3.Indefinite:
        return 1 / 0;
      default:
        throw new T3(`Unsupported integer info: ${e3.toString(2)}`);
    }
  }
  function Mr(e3) {
    let t = b5(e3);
    return typeof t == "number" ? -1 - t : -1n - t;
  }
  function Pt(e3) {
    let t = b5(e3);
    if (t > Number.MAX_SAFE_INTEGER) throw new T3("Byte length is too large");
    let r2 = Number(t);
    return _4 += r2, $3.slice(_4 - r2, _4);
  }
  function Te2(e3) {
    let t = Pt(e3);
    return wr.decode(t);
  }
  function zr(e3, t) {
    let r2 = b5(e3);
    if (r2 === Or) return A4(t);
    throw new T3(`Unsupported tag: ${r2}.`);
  }
  var Fr = 2 * 1024;
  var Qo = new TextEncoder();
  var Wr = new Uint8Array(Fr);
  var Jo = new DataView(Wr.buffer);
  var qt = (e3) => {
    let t = JSON.stringify({ [JSON_KEY_EXPIRY]: e3.toString() });
    return Expiry.fromJSON(t);
  };
  var Ee = (e3) => {
    let { ingress_expiry: t, canister_id: r2, sender: c2, ...n } = wt2(vt(e3));
    return { ...n, canister_id: Principal.fromUint8Array(r2), sender: Principal.fromUint8Array(c2), ingress_expiry: qt(t) };
  };
  var vt2 = ({ requestMethod: e3, responseMethod: t }) => {
    if (t !== e3) throw new Error("The response method does not match the request method.");
  };
  var Mt2 = ({ responseArg: e3, requestArg: t }) => {
    let r2 = vt(t);
    if (!(({ first: s3, second: a4 }) => s3.length === a4.length && s3.every((p4, d4) => p4 === a4[d4]))({ first: r2, second: e3 })) throw new Error("The response does not contain the request arguments.");
  };
  var zt = ({ requestCanisterId: e3, responseCanisterId: t }) => {
    if (e3.toText() !== t.toText()) throw new Error("The response canister ID does not match the requested canister ID.");
  };
  var Ft = ({ requestSender: e3, responseSender: t }) => {
    if ((t instanceof Uint8Array ? Principal.fromUint8Array(t) : t).toText() !== Principal.fromText(e3).toText()) throw new Error("The response sender does not match the request sender.");
  };
  var Ne = ({ recordClass: e3, rawArgs: t }) => Mt(new Uint8Array(idl_exports.encode([e3], [t])));
  var Bt2 = ({ recordClass: e3, bytes: t }) => {
    let r2 = idl_exports.decode([e3], t);
    if (r2.length !== 1) throw new Error("More than one object returned. This is unexpected.");
    let [c2] = r2;
    return c2;
  };
  var kt = ({ params: { method: e3, arg: t, canisterId: r2, sender: c2 }, result: { contentMap: n } }) => {
    let s3 = Ee(n);
    zt({ requestCanisterId: Principal.fromText(r2), responseCanisterId: s3.canister_id }), vt2({ requestMethod: e3, responseMethod: s3.method_name }), Mt2({ requestArg: t, responseArg: s3.arg }), Ft({ requestSender: c2, responseSender: s3.sender });
  };
  var Ce = async ({ params: { canisterId: e3 }, result: { certificate: t, contentMap: r2 }, resultRecordClass: c2, host: n }) => {
    let s3 = Ee(r2), { location: { hostname: a4 } } = window, p4 = Ot({ hostname: a4 }), d4 = await HttpAgent.create({ identity: new AnonymousIdentity(), host: p4?.shouldFetchRootKey === true ? n ?? ct2 : it2, ...p4 });
    f(d4.rootKey, "Missing agent root key, which is required to certify the response.");
    let l3 = await Certificate.create({ certificate: vt(t), rootKey: d4.rootKey, principal: { canisterId: Principal.fromText(e3) } }), h2 = requestIdOf(s3), R3 = [new TextEncoder().encode("request_status"), h2], y4 = lookupResultToBuffer(l3.lookup_path([...R3, "reply"]));
    return f(y4, "A reply cannot be resolved within the provided certificate. This is unexpected; it should have been known at this point."), Bt2({ recordClass: c2, bytes: y4 });
  };
  var xe = () => typeof window < "u";
  var Yt = ({ position: e3, ...t }) => (e3 === "center" ? Xr : Zr)(t);
  var Xr = ({ width: e3, height: t, features: r2 = W3 }) => {
    if (!xe() || u(window) || u(window.top)) return;
    let { top: { innerWidth: c2, innerHeight: n } } = window, s3 = n / 2 + screenY - t / 2, a4 = c2 / 2 + screenX - e3 / 2;
    return `${r2}, width=${e3}, height=${t}, top=${s3}, left=${a4}`;
  };
  var Zr = ({ width: e3, height: t, features: r2 = W3 }) => {
    if (!xe() || u(window) || u(window.top)) return;
    let { top: { innerWidth: c2, innerHeight: n } } = window, s3 = outerHeight - n, a4 = c2 - e3;
    return `${r2}, width=${e3}, height=${t}, top=${s3}, left=${a4}`;
  };
  var ae = class e {
    #t;
    #e;
    #o;
    host;
    #r = "connected";
    #n;
    constructor({ origin: t, popup: r2, onDisconnect: c2, host: n }) {
      this.#t = t, this.#e = r2, this.#o = c2, this.host = n, this.#r = "connected", this.#n = setInterval(this.checkWalletStatusCallback, Je);
    }
    static async connect({ onDisconnect: t, ...r2 }) {
      return await this.connectSigner({ options: r2, init: (c2) => new e({ ...c2, onDisconnect: t }) });
    }
    static async connectSigner({ options: t, init: r2 }) {
      let { success: c2, error: n } = Ct.safeParse(t);
      if (!c2) throw new Error(`Options cannot be parsed: ${n?.message ?? ""}`);
      let { url: s3, windowOptions: a4, connectionOptions: p4 } = t, d4 = typeof a4 == "string" ? a4 : Yt(a4 ?? st2), l3 = window.open(s3, "relyingPartyWindow", d4);
      f(l3, "Unable to open the signer window.");
      let h2 = () => {
        l3.close();
      };
      class R3 extends Error {
      }
      let y4, H3 = ({ origin: S4, data: w4 }) => {
        let { success: pe } = fe.safeParse(w4);
        if (!pe) return;
        let Q3;
        try {
          let { origin: v3 } = new URL(s3);
          Q3 = v3;
        } catch {
          y4 = new R3(`The origin ${S4} of the signer URL ${s3} cannot be parsed.`);
          return;
        }
        if (j2(S4) && S4 !== Q3) {
          y4 = new R3(`The response origin ${S4} does not match the requested signer URL ${s3}.`);
          return;
        }
        let { success: ue } = ge2.safeParse(w4);
        ue && (y4 = r2({ origin: S4, popup: l3 }));
      };
      window.addEventListener("message", H3);
      let K3 = () => {
        window.removeEventListener("message", H3);
      }, E4 = async () => {
        if (await dt2({ popup: l3, isReady: () => s2(y4) ? y4 instanceof e ? "ready" : "error" : "pending", id: crypto.randomUUID(), timeoutInMilliseconds: p4?.timeoutInMilliseconds ?? Xe, intervalInMilliseconds: p4?.pollingIntervalInMilliseconds }) === "timeout") throw new Error("Connection timeout. Unable to connect to the signer.");
        if (f(y4, "Unexpected error. The request status succeeded, but the signer response is not defined."), y4 instanceof R3) throw y4;
        return y4;
      };
      try {
        return await E4();
      } catch (S4) {
        throw h2(), S4;
      } finally {
        K3();
      }
    }
    disconnect = async () => {
      clearInterval(this.#n), this.#e.close(), this.#o?.();
    };
    checkWalletStatusCallback = () => {
      this.checkWalletStatus();
    };
    async checkWalletStatus() {
      let t = ({ data: n, id: s3 }) => {
        let { success: a4, data: p4 } = ge2.safeParse(n);
        return a4 && s3 === p4?.id ? { handled: true, result: "connected" } : { handled: true, result: "disconnected" };
      }, r2 = (n) => {
        lt2({ popup: this.#e, origin: this.#t, id: n });
      }, c2 = async () => {
        try {
          return await this.request({ options: { timeoutInMilliseconds: rt }, postRequest: r2, handleMessage: t });
        } catch {
          return "disconnected";
        }
      };
      this.#r = await c2(), this.#r !== "connected" && await this.disconnect();
    }
    request = async ({ options: t, postRequest: r2, handleMessage: c2 }) => await new Promise((n, s3) => {
      let { connected: a4, err: p4 } = this.assertWalletConnected();
      if (!a4) {
        s3(p4 ?? new Error("Unexpected reason for disconnection."));
        return;
      }
      let { success: d4, error: l3 } = _e.safeParse(t);
      if (!d4) throw new Error(`Wallet request options cannot be parsed: ${l3?.message ?? ""}`);
      let { requestId: h2, timeoutInMilliseconds: R3 } = t, y4 = h2 ?? crypto.randomUUID(), H3 = setTimeout(() => {
        s3(new Error(`Request to signer timed out after ${R3} milliseconds.`)), E4();
      }, R3), K3 = ({ origin: S4, data: w4, source: pe }) => {
        let { success: Q3 } = fe.safeParse(w4);
        if (!Q3) return;
        if (pe !== this.#e) {
          s3(new Error("The response is not originating from the window that was opened.")), E4();
          return;
        }
        if (j2(S4) && S4 !== this.#t) {
          s3(new Error(`The response origin ${S4} does not match the signer origin ${this.#t}.`)), E4();
          return;
        }
        let { handled: ue, result: v3 } = c2({ data: w4, id: y4 });
        if (ue && s2(v3)) {
          n(v3), E4();
          return;
        }
        let Oe = this.handleErrorMessage({ data: w4, id: y4 });
        Oe.valid || (s3(Oe.error), E4());
      };
      window.addEventListener("message", K3);
      let E4 = () => {
        clearTimeout(H3), window.removeEventListener("message", K3);
      };
      r2(y4);
    });
    assertWalletConnected() {
      return this.#r === "disconnected" ? { connected: false, err: new k4("The signer has been disconnected. Your request cannot be processed.") } : this.#e.closed ? { connected: false, err: new k4("The signer has been closed. Your request cannot be processed.") } : { connected: true };
    }
    supportedStandards = async ({ options: { timeoutInMilliseconds: t, ...r2 } = {} } = {}) => {
      let c2 = ({ data: s3, id: a4 }) => {
        let { success: p4, data: d4 } = It.safeParse(s3);
        if (p4 && a4 === d4?.id && s2(d4?.result)) {
          let { result: { supportedStandards: l3 } } = d4;
          return { handled: true, result: l3 };
        }
        return { handled: false };
      }, n = (s3) => {
        mt({ popup: this.#e, origin: this.#t, id: s3 });
      };
      return await this.request({ options: { timeoutInMilliseconds: t ?? Ze, ...r2 }, postRequest: n, handleMessage: c2 });
    };
    permissions = async ({ options: { timeoutInMilliseconds: t, ...r2 } = {} } = {}) => {
      let c2 = (n) => {
        Rt({ popup: this.#e, origin: this.#t, id: n });
      };
      return await this.requestPermissionsScopes({ options: { timeoutInMilliseconds: t ?? De, ...r2 }, postRequest: c2 });
    };
    requestPermissions = async ({ options: { timeoutInMilliseconds: t, ...r2 } = {}, params: c2 } = {}) => {
      let n = (s3) => {
        yt({ popup: this.#e, origin: this.#t, id: s3, params: c2 ?? ot2 });
      };
      return await this.requestPermissionsScopes({ options: { timeoutInMilliseconds: t ?? Le, ...r2 }, postRequest: n });
    };
    requestPermissionsScopes = async ({ options: t, postRequest: r2 }) => {
      let c2 = ({ data: n, id: s3 }) => {
        let { success: a4, data: p4 } = _t.safeParse(n);
        if (a4 && s3 === p4?.id && s2(p4?.result)) {
          let { result: { scopes: d4 } } = p4;
          return { handled: true, result: d4 };
        }
        return { handled: false };
      };
      return await this.request({ options: t, postRequest: r2, handleMessage: c2 });
    };
    accounts = async ({ options: { timeoutInMilliseconds: t, ...r2 } = {} } = {}) => {
      let c2 = ({ data: s3, id: a4 }) => {
        let { success: p4, data: d4 } = Tt.safeParse(s3);
        if (p4 && a4 === d4?.id && s2(d4?.result)) {
          let { result: { accounts: l3 } } = d4;
          return { handled: true, result: l3 };
        }
        return { handled: false };
      }, n = (s3) => {
        ft2({ popup: this.#e, origin: this.#t, id: s3 });
      };
      return await this.request({ options: { timeoutInMilliseconds: t ?? et2, ...r2 }, postRequest: n, handleMessage: c2 });
    };
    call = async ({ options: { timeoutInMilliseconds: t, ...r2 } = {}, params: c2 }) => {
      let n = ({ data: p4, id: d4 }) => {
        let { success: l3, data: h2 } = Et2.safeParse(p4);
        if (l3 && d4 === h2?.id && s2(h2?.result)) {
          let { result: R3 } = h2;
          return { handled: true, result: R3 };
        }
        return { handled: false };
      }, s3 = (p4) => {
        ht({ popup: this.#e, origin: this.#t, id: p4, params: c2 });
      }, a4 = await this.request({ options: { timeoutInMilliseconds: t ?? tt2, ...r2 }, postRequest: s3, handleMessage: n });
      return kt({ params: c2, result: a4 }), a4;
    };
    handleErrorMessage = ({ data: t, id: r2 }) => {
      let { success: c2, data: n } = ye.safeParse(t);
      return !c2 || r2 !== n?.id ? { valid: true } : { valid: false, error: new se(n.error) };
    };
    requestPermissionsNotGranted = async ({ options: t } = {}) => {
      let r2 = (p4) => p4.filter(({ state: d4 }) => d4 !== ee2).map(({ scope: d4 }) => d4), c2 = await this.permissions({ options: t });
      if (c2.length === 0) throw new Error("The signer did not provide any data about the current set of permissions.");
      let n = r2(c2);
      if (n.length === 0) return { allPermissionsGranted: true };
      let s3 = await this.requestPermissions({ options: t, params: { scopes: n } });
      if (s3.length === 0) throw new Error("The signer did not provide any data about the current set of permissions following the request.");
      return { allPermissionsGranted: r2(s3).length === 0 };
    };
  };
  var Ht = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  var Kt = class e2 extends ae {
    static async connect({ onDisconnect: t, host: r2, ...c2 }) {
      return await this.connectSigner({ options: c2, init: (n) => new e2({ ...n, onDisconnect: t, host: r2 }) });
    }
    icrc1Transfer = async ({ request: t, owner: r2, ledgerCanisterId: c2, options: n }) => {
      let s3 = Q2(t), a4 = Ne({ recordClass: P3.TransferArgs, rawArgs: s3 }), l3 = { sender: r2, method: "icrc1_transfer", canisterId: c2 ?? Ht, arg: a4 }, h2 = await this.call({ params: l3, options: n }), R3 = await Ce({ params: l3, result: h2, resultRecordClass: We2, host: this.host });
      if ("Err" in R3) throw W2(R3.Err);
      return R3.Ok;
    };
    icrc2Approve = async ({ request: t, owner: r2, ledgerCanisterId: c2, options: n }) => {
      let s3 = X3(t), a4 = Ne({ recordClass: N3.ApproveArgs, rawArgs: s3 }), l3 = { sender: r2, method: "icrc2_approve", canisterId: c2 ?? Ht, arg: a4 }, h2 = await this.call({ params: l3, options: n }), R3 = await Ce({ params: l3, result: h2, resultRecordClass: Be, host: this.host });
      if ("Err" in R3) throw Y2(R3.Err);
      return R3.Ok;
    };
  };
  return __toCommonJS(oisy_wallet_signer_entry_exports);
})();
/*! Bundled license information:

@icp-sdk/canisters/chunk-W4OHPIZF.js:
  (*! Bundled license information:
  
  @noble/hashes/esm/utils.js:
    (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
  *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/weierstrass.js:
@noble/curves/esm/abstract/bls.js:
@noble/curves/esm/abstract/tower.js:
@noble/curves/esm/bls12-381.js:
@noble/curves/esm/abstract/edwards.js:
@noble/curves/esm/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/


// Ensure global availability when loaded via ESM/CommonJS bundlers.
;globalThis.OisyWalletSigner = OisyWalletSigner;

//# sourceMappingURL=oisy-wallet-signer.js.map
