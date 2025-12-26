import { keccak_256 } from '@noble/hashes/sha3';
import { secp256k1 } from '@noble/curves/secp256k1';

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

/**
 * Computes an EVM address from a secp256k1 public key.
 * Accepts compressed (33B) or uncompressed (65B with 0x04 prefix) keys.
 */
export function computeEthAddressFromPublicKey(publicKey: Uint8Array): string {
	// Normalize to uncompressed 65 bytes (0x04 + X(32) + Y(32))
	const point = secp256k1.ProjectivePoint.fromHex(publicKey);
	const uncompressed = point.toRawBytes(false);
	// Drop 0x04
	const pubkeyXY = uncompressed.slice(1);
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
	const base = 10n ** 18n;
	const whole = wei / base;
	const fraction = wei % base;
	if (fractionDigits <= 0) return whole.toString();
	const fracStr = fraction.toString().padStart(18, '0').slice(0, fractionDigits);
	return `${whole.toString()}.${fracStr}`;
}
