import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const outDir = path.join(projectRoot, 'assets/Script/lib3');

const entriesDir = path.join(__dirname, 'entries');

async function bundle({ entryFile, outFile, globalName }) {
	await build({
		entryPoints: [path.join(entriesDir, entryFile)],
		outfile: path.join(outDir, outFile),
		bundle: true,
		platform: 'browser',
		format: 'iife',
		globalName,
		target: ['es2022'],
		sourcemap: true,
		minify: false,
		charset: 'utf8',
		logLevel: 'info',
		// Prefer browser-friendly conditions where packages provide them.
		conditions: ['browser', 'module', 'import', 'default'],
		mainFields: ['browser', 'module', 'main'],
		footer: {
			js: `\n\n// Ensure global availability when loaded via ESM/CommonJS bundlers.\n` +
				`;globalThis.${globalName} = ${globalName};\n`,
		},
	});
}

await bundle({
	entryFile: 'oisy-wallet-signer-entry.js',
	outFile: 'oisy-wallet-signer.js',
	globalName: 'OisyWalletSigner',
});

console.log('[build-oisy-wallet-signer] Done.');
