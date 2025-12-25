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



Node.js vs 浏览器：您使用的库（@icp-sdk、ethers、elliptic）是为 Node.js 环境设计的，它们依赖 Node.js 特有的全局变量（如 Buffer、process）和内置模块（如 crypto、http）。
Cocos Creator 环境：Cocos 打包发布到 Web 或手机时，运行在 浏览器/原生 JS 引擎 中，这些环境 没有 Buffer 和 node:http 等模块。
加载顺序问题：虽然我们写了 buffer-shim.ts，但在 ES6 模块系统中，import 语句会被提升（Hoisting）。这意味着第三方库（如 ethers）可能在我们的 shim 执行 之前 就已经被加载并执行了，导致报错。

Cocos Creator 预览环境不是 Node：没有 require、没有 Node 内置模块，ESM/CJS 形态也很敏感，所以像 ethers 这种包必须选对构建产物（UMD/ESM）并保证加载方式稳定。
你本地 dfx replica 的 HTTP 接口版本和 @icp-sdk/core@5 默认用的版本不一致：SDK 会打 /api/v3/*（query/read_state）和默认 /api/v4/*（sync call），而你的本地只认 v2，所以才会 404/400

ethers：用 UMD 产物，避免 ESM/CJS 冲突；并且兼容“UMD 在 Cocos 里走 CommonJS 分支不挂全局”的情况，让 ethers.utils 一定能取到。
ICP：业务侧不改三方库，通过两层“适配”让本地强制走 v2：
update call：callSync: false（走 /api/v2/.../call）
query/read_state：把 /api/v3/*（以及兜底 /api/v4/*）重写为 /api/v2/*