#!/bin/bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cocos_dir="$repo_root/cocos_frontend"
lib3_dir="$cocos_dir/assets/Script/lib3"

die() {
	printf "[lib_to_lib3] %s\n" "$1" >&2
	exit 1
}

info() {
	printf "[lib_to_lib3] %s\n" "$1"
}

[[ -d "$cocos_dir" ]] || die "missing $cocos_dir"
mkdir -p "$lib3_dir"

# 1) 拷贝 ethers.js (UMD)
ethers_src_min="$cocos_dir/node_modules/ethers/dist/ethers.umd.min.js"
ethers_src="$cocos_dir/node_modules/ethers/dist/ethers.umd.js"

if [[ -f "$ethers_src_min" ]]; then
	info "copy ethers: $ethers_src_min -> $lib3_dir/"
	cp -f "$ethers_src_min" "$lib3_dir/"
	[[ -f "$ethers_src_min.map" ]] && cp -f "$ethers_src_min.map" "$lib3_dir/" || true
elif [[ -f "$ethers_src" ]]; then
	info "copy ethers: $ethers_src -> $lib3_dir/"
	cp -f "$ethers_src" "$lib3_dir/"
	[[ -f "$ethers_src.map" ]] && cp -f "$ethers_src.map" "$lib3_dir/" || true
else
	die "ethers UMD not found. Expected $ethers_src_min or $ethers_src. Run: (cd $cocos_dir && npm i)"
fi

# 2) icp-sdk-agent.js / icp-sdk-auth-client.js
# 这两份文件按用户指定版本使用，已放在 $lib3_dir 下；此脚本不再生成/覆盖它们。
info "skip bundling icp-sdk-agent/auth-client (use existing files in $lib3_dir)"
info "done"