# cocos_icp

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

3. 部署应用：
   ```
   ./local-deploy-app.sh
   ```

4. 更新配置：
   - 在 `cocos_frontend/assets/Script/mg/DefData.ts` 中替换：
     ```typescript
     export const II_CANISTER_ID_LOCAL = "bw4dl-smaaa-aaaaa-qaacq-cai";
     export const BACKEND_CANISTER_ID_LOCAL_FALLBACK = "be2us-64aaa-aaaaa-qaabq-cai";
     ```

5. 在 Cocos Creator 中运行调试。


