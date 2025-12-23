#!/bin/bash

# 1. 获取当前身份的 Principal ID 和 Account ID
export MINTER=$(dfx identity get-principal)
export ACC_ID=$(dfx ledger account-id)

echo "Deploying Ledger with Minter Principal: $MINTER"
echo "Deploying Ledger with Account ID: $ACC_ID"

# 2. 部署 Ledger Canister
# minting_account: 必须是 Account ID (text)
# initial_values: 必须是 Account ID (text)
# archive_options.controller_id: 必须是 Principal
dfx deploy ledger --argument "(variant {Init = record {
  minting_account = \"$ACC_ID\";
  initial_values = vec { record { \"$ACC_ID\"; record { e8s=100000000000 } }; };
  send_whitelist = vec {};
  transfer_fee = opt record { e8s=10000 };
  token_symbol = opt \"LICP\";
  token_name = opt \"Local ICP\";
  archive_options = opt record {
    num_blocks_to_archive = 1000;
    trigger_threshold = 2000;
    controller_id = principal \"$MINTER\";
  };
}})"
