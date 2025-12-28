import { keccak_256 } from '@noble/hashes/sha3';

const SECP256K1_P = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');
const SECP256K1_B = 7n;

export function isHexString(value: string): boolean {
	return /^0x[0-9a-fA-F]*$/.test(value) && value.length % 2 === 0;
}

export function hexToBytes(hex: string): Uint8Array {
	if (!isHexString(hex)) {
		throw new Error(`Invalid hex string: ${hex}`);
	}
	const normalized = hex.startsWith('0x') ? hex.slice(2) : hex;
	const out = new Uint8Array(normalized.length / 2);
	for (let i = 0; i < out.length; i++) {
		out[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
	}
	return out;
}

export function bytesToHex(bytes: Uint8Array): string {
	let hex = '';
	for (let i = 0; i < bytes.length; i++) {
		hex += bytes[i].toString(16).padStart(2, '0');
	}
	return hex;
}

function mod(a: bigint, m: bigint): bigint {
	const res = a % m;
	return res >= 0n ? res : (res + m);
}

function bytesToBigIntBE(bytes: Uint8Array): bigint {
	let out = 0n;
	for (let i = 0; i < bytes.length; i++) {
		out = (out << 8n) + BigInt(bytes[i]);
	}
	return out;
}

function bigIntToBytesBE(value: bigint, length: number): Uint8Array {
	let v = value;
	const out = new Uint8Array(length);
	for (let i = length - 1; i >= 0; i--) {
		out[i] = Number(v & 0xffn);
		v >>= 8n;
	}
	return out;
}

function powMod(base: bigint, exp: bigint, m: bigint): bigint {
	let result = 1n;
	let b = mod(base, m);
	let e = exp;
	while (e > 0n) {
		if (e & 1n) result = mod(result * b, m);
		b = mod(b * b, m);
		e >>= 1n;
	}
	return result;
}

function sqrtModP_3mod4(a: bigint): bigint {
	// secp256k1 prime p ≡ 3 (mod 4), so sqrt can be computed as a^((p+1)/4) mod p.
	return powMod(a, (SECP256K1_P + 1n) / 4n, SECP256K1_P);
}

function decompressSecp256k1PublicKey(compressed: Uint8Array): Uint8Array {
	if (compressed.length !== 33) throw new Error(`Invalid compressed secp256k1 public key length: ${compressed.length}`);
	const prefix = compressed[0];
	if (prefix !== 0x02 && prefix !== 0x03) throw new Error(`Invalid compressed secp256k1 prefix: 0x${prefix.toString(16)}`);

	const x = bytesToBigIntBE(compressed.slice(1));
	if (x >= SECP256K1_P) throw new Error('Invalid secp256k1 public key (x out of range)');

	// y^2 = x^3 + 7 mod p
	const y2 = mod(mod(x * x, SECP256K1_P) * x + SECP256K1_B, SECP256K1_P);
	let y = sqrtModP_3mod4(y2);
	// Choose the root with correct parity.
	const isOdd = (y & 1n) === 1n;
	const needOdd = (prefix & 1) === 1;
	if (isOdd !== needOdd) y = SECP256K1_P - y;

	const out = new Uint8Array(65);
	out[0] = 0x04;
	out.set(bigIntToBytesBE(x, 32), 1);
	out.set(bigIntToBytesBE(y, 32), 33);
	return out;
}

/**
 * Computes an EVM address from a secp256k1 public key.
 * Accepts compressed (33B) or uncompressed (65B with 0x04 prefix) keys.
 */
export function computeEthAddressFromPublicKey(publicKey: Uint8Array): string {
	// Accept compressed (33B) or uncompressed (65B with 0x04 prefix) keys.
	let pubkeyXY: Uint8Array;
	if (publicKey.length === 33) {
		const uncompressed = decompressSecp256k1PublicKey(publicKey);
		pubkeyXY = uncompressed.slice(1);
	} else if (publicKey.length === 65 && publicKey[0] === 0x04) {
		pubkeyXY = publicKey.slice(1);
	} else if (publicKey.length === 64) {
		pubkeyXY = publicKey;
	} else {
		throw new Error(`Unsupported public key format/length: ${publicKey.length}`);
	}

	if (pubkeyXY.length !== 64) throw new Error(`Invalid uncompressed public key length: ${pubkeyXY.length}`);
	const hash = keccak_256(pubkeyXY);
	const address = hash.slice(-20);
	return `0x${bytesToHex(address)}`;
}

export async function jsonRpc<T>(url: string, method: string, params: any[]): Promise<T> {
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method,
			params,
		}),
	});
	if (!res.ok) {
		throw new Error(`JSON-RPC HTTP ${res.status}: ${await res.text()}`);
	}
	const data = await res.json();
	if (data && data.error) {
		throw new Error(data.error.message || JSON.stringify(data.error));
	}
	return data.result as T;
}

export function formatEtherFromWei(wei: bigint, fractionDigits = 6): string {
	// Avoid BigInt exponentiation (10n ** 18n). Some build pipelines downlevel it
	// into Math.pow(10n, 18n), which throws at runtime.
	const base = 1000000000000000000n;
	const whole = wei / base;
	const fraction = wei % base;
	if (fractionDigits <= 0) return whole.toString();
	const fracStr = fraction.toString().padStart(18, '0').slice(0, fractionDigits);
	return `${whole.toString()}.${fracStr}`;
}
