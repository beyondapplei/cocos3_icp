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

## 项目说明

这是一个非常典型的在旧引擎（Cocos Creator 2.4）中集成现代 Web3 SDK（ICP SDK）的案例。

### 核心问题：CBOR 序列化错误
- **现象**：调用 GetBalance 时报错 `invalid type: byte array, expected u64`。
- **原因**：ICP SDK 依赖 BigInt 来处理时间戳（ingress_expiry）和金额。Cocos Creator 2.4 默认的编译流程（Babel）会将代码转译为 ES5，导致 BigInt 被降级或处理不当，最终生成的 CBOR 数据格式错误，后端无法识别。

### 环境冲突：现代语法 vs 旧版编译器
- **现象**：
  - 尝试直接使用 SDK 时，报 `Cannot find module 'node:crypto'`（缺少 Node.js 垫片）。
  - 尝试保留 BigInt 不转译时，报 `Symbol.hasInstance` 错误（Cocos 无法识别某些 ES6+ 语法）。
  - 尝试使用 es2020 构建时，报 `Unexpected token: operator (?)`（Cocos 的压缩工具 UglifyJS 不支持可选链 ?.）。

- **原因**：Cocos Creator 2.4 的构建管线较老，对现代 JavaScript 标准（ES2020+）和 Node.js 模块的支持有限。

### 最终解决方案
我们采用了一套组合拳来解决这些兼容性问题：

#### A. 独立打包 (Bundling with esbuild)
- 我们放弃了让 Cocos 直接编译 node_modules，而是使用 esbuild 将 SDK 及其依赖打包成独立的单文件。
- **工具**：esbuild
- **目标 (Target)**：es2019。这是关键点。

es2019 支持 BigInt（解决了 CBOR 报错）。
es2019 不包含 可选链 ?.（解决了 Cocos 构建报错）。
格式：iife (立即执行函数)，将 SDK 挂载为全局变量 window.DfinityAgent 和 window.DfinityAuthClient。


插件脚本 (Plugin Scripts)
我们将打包好的 dfinity-agent.js 和 dfinity-auth-client.js 设置为 插件脚本 (isPlugin: true)。
作用：告诉 Cocos 编译器 “不要动这些文件”。Cocos 会直接原样拷贝它们，跳过 Babel 转译。这确保了 BigInt 等语法特性被完整保留。
配置：勾选了 允许编辑器加载，确保在编辑器预览时也能正常运行。


C. API 版本修正
问题：@icp-sdk/core 默认使用 /api/v3，但本地环境 (dfx) 只支持 /api/v2。
解决：直接修改打包后的文件，将 API 路径替换为 v2。
D. 清理中间文件
问题：bundle_entry.js 等中间文件如果留在 assets 目录下，Cocos 会尝试编译它们并报错 Cannot find module。
解决：打包完成后，彻底删除了这些临时入口文件。


维护建议
如果未来您需要更新 SDK 版本，请按照以下步骤操作：
创建入口文件：
在 Lib 下新建 bundle_entry.js，写入：

import { Actor, HttpAgent, Cbor, AnonymousIdentity } from "@icp-sdk/core/agent";
import { IDL } from "@icp-sdk/core/candid";
import { Principal } from "@icp-sdk/core/principal";
export { Actor, HttpAgent, Cbor, AnonymousIdentity, IDL, Principal };

执行打包命令：

# 打包 Agent
npx esbuild assets/Script/Lib/bundle_entry.js --bundle --outfile=assets/Script/Lib/dfinity-agent.js --format=iife --global-name=DfinityAgent --target=es2019 --platform=browser

# 如果是本地环境，记得打补丁
sed -i '' 's|/api/v3/|/api/v2/|g' assets/Script/Lib/dfinity-agent.js


清理文件：删除 bundle_entry.js。






=======
# cocos3_icp
>>>>>>> e9cacfd2d650dfded5b901efa137a55b73cc046b
