#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listFilesRecursive(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...await listFilesRecursive(full));
    } else if (ent.isFile()) {
      out.push(full);
    }
  }
  return out;
}

async function copyFilePreserveTree(srcFile, srcRoot, dstRoot) {
  const rel = path.relative(srcRoot, srcFile);
  const dstFile = path.join(dstRoot, rel);
  await ensureDir(path.dirname(dstFile));
  await fs.copyFile(srcFile, dstFile);
  return { rel, dstFile };
}

async function main() {
  const projectRoot = process.cwd();

  const srcRoot = path.join(projectRoot, 'assets', 'Script', 'lib3');
  const dstRoot = path.join(projectRoot, 'build', 'web-mobile', 'lib3');

  if (!(await exists(srcRoot))) {
    console.error(`[sync-lib3] Source folder not found: ${srcRoot}`);
    process.exit(1);
  }

  await ensureDir(dstRoot);

  const all = await listFilesRecursive(srcRoot);

  // Copy only runtime-relevant assets (skip .meta).
  const toCopy = all.filter((p) => {
    const name = path.basename(p);
    if (name.endsWith('.meta')) return false;
    // keep js + maps + wasm + json just in case
    return /\.(js|mjs|cjs|map|wasm|json|txt)$/i.test(name);
  });

  // If you want a clean output each time, run with: --clean
  const clean = process.argv.includes('--clean');
  if (clean) {
    const existing = await listFilesRecursive(dstRoot).catch(() => []);
    await Promise.all(existing.map((f) => fs.unlink(f).catch(() => {})));
  }

  const copied = [];
  for (const file of toCopy) {
    const res = await copyFilePreserveTree(file, srcRoot, dstRoot);
    copied.push(res.rel);
  }

  copied.sort();
  console.log(`[sync-lib3] Copied ${copied.length} files -> build/web-mobile/lib3`);
  for (const rel of copied) {
    console.log(`- ${rel}`);
  }
}

main().catch((err) => {
  console.error('[sync-lib3] Failed:', err);
  process.exit(1);
});
