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

## 排障 / 踩坑记录（重要）

### 1) `local-deploy-app.sh` 构建完成但脚本退出（exit code 36）

现象：Cocos Creator 构建日志显示 Finished，但 `./local-deploy-app.sh` 仍然退出，导致后续 `dfx deploy` 没有执行。

结论：Cocos Creator CLI 有时会用 **36** 表示“构建结束但存在告警/非致命问题”。

处理：脚本已做兼容——遇到 `36` 继续执行；遇到其它非 0 才失败退出。

### 2) 本地 replica API 版本差异（v2 vs v3/v4）

现象：前端 SDK（例如 `@icp-sdk/core`）可能会请求 `/api/v3/*` 或 `/api/v4/*`，但某些本地环境只支持 `/api/v2/*`，导致 404/400。

处理：在前端的 fetch 适配层做了路径重写（v3/v4 → v2），并在本地禁用 query 签名校验/拉取 root key（开发态）。

### 3) 运行期 400：`user id` 与 `public key` 不匹配

现象：访问本地 replica 时，`/api/v2/canister/.../query` 或 `/call` 返回 400，报错形如：

`The user id '<principal>' does not match the public key '<...>'`

原因（本项目实际根因）：Cocos/Rollup/转译环境下，TypedArray（如 `Uint8Array`）在某些 `concat/spread` 场景会被“当成单个元素”而不是展开，导致 **字节序列化被悄悄破坏**；最终表现为 sender/principal/pubkey 在 replica 校验时对不上。

处理：
- `Polyfill.ts`：对 TypedArray 相关的 `concat`/拼接行为做了兼容补丁，并修正 `Principal.toText` 的字节拼接逻辑。
- `LoginManager.ts`：增加一次性清理旧 identity/delegation 缓存的逻辑，避免历史损坏数据继续触发 mismatch。

验证：
- 重新执行 `bash ./local-deploy-app.sh`
- 用推荐地址访问（示例）：`http://<frontend-canister>.localhost:4943/`
- 如仍异常，优先用无痕窗口或强制刷新，确保加载到最新前端产物。

### 4) Node.js vs 浏览器/Cocos 运行时差异（Buffer/process/crypto）

下面这些说明用于理解为什么需要 shim/polyfill（保留作为背景）：



Node.js vs 浏览器：您使用的库（@icp-sdk、ethers、elliptic）是为 Node.js 环境设计的，它们依赖 Node.js 特有的全局变量（如 Buffer、process）和内置模块（如 crypto、http）。
Cocos Creator 环境：Cocos 打包发布到 Web 或手机时，运行在 浏览器/原生 JS 引擎 中，这些环境 没有 Buffer 和 node:http 等模块。
加载顺序问题：虽然我们写了 buffer-shim.ts，但在 ES6 模块系统中，import 语句会被提升（Hoisting）。这意味着第三方库（如 ethers）可能在我们的 shim 执行 之前 就已经被加载并执行了，导致报错。

Cocos Creator 预览环境不是 Node：没有 require、没有 Node 内置模块，ESM/CJS 形态也很敏感，所以像 ethers 这种包必须选对构建产物（UMD/ESM）并保证加载方式稳定。
你本地 dfx replica 的 HTTP 接口版本和 @icp-sdk/core@5 默认用的版本不一致：SDK 会打 /api/v3/*（query/read_state）和默认 /api/v4/*（sync call），而你的本地只认 v2，所以才会 404/400

ethers：用 UMD 产物，避免 ESM/CJS 冲突；并且兼容“UMD 在 Cocos 里走 CommonJS 分支不挂全局”的情况，让 ethers.utils 一定能取到。
ICP：业务侧不改三方库，通过两层“适配”让本地强制走 v2：
update call：callSync: false（走 /api/v2/.../call）
query/read_state：把 /api/v3/*（以及兜底 /api/v4/*）重写为 /api/v2/*