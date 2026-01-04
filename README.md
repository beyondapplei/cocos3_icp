# cocos3_icp

这是一个在 Cocos Creator 中集成 ICP (Internet Computer Protocol) 的项目。

## 本地部署步骤

1. 启动 dfx：
   ```
   dfx start --clean --background
   ```

2. 部署账本：
   ```
   ./deploy-ledger.sh
   ```

3 导出第三方库  
```
node ./tools/build-icp-sdk.mjs  
node ./tools/build-oisy-wallet-signer.mjs
 ```

3 bash ./local-deploy-app.sh 



4 在 `cocos_frontend/assets/Script/mg/DefData.ts` 中替换：
  
     export const II_CANISTER_ID_LOCAL = "bw4dl-smaaa-aaaaa-qaacq-cai";
     export const BACKEND_CANISTER_ID_LOCAL_FALLBACK ="be2us-64aaa-aaaaa-qaabq-cai";
     

  5 bash ./local-deploy-app.sh 
 



eth::eth_address 内部取公钥时走的是：
* Schema::Eth.derivation_path(principal)也就是派生路径前两段固定是：[ [0x01], [caller_principal_bytes] ]

generic_caller_ecdsa_public_key 用的是 Generic schema 的派生路径
* Schema::Generic.derivation_path_ending_in(&ic_cdk::caller(), arg.derivation_path)
也就是说最终派生路径变成：[ [0xff], [caller_principal_bytes] ] + 你传入的 ending
你传空数组，就等于只用 [0xff, caller] 这条路径，和 [0x01, caller]（Eth schema）完全不同，因此公钥不同、地址不同




