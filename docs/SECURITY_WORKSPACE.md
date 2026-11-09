# 安全工具工作区

六项工具在浏览器本地执行，复用主站 Worker 和超时、取消机制。输入、口令、密钥和分析结果只保留在内存中，不写入收藏、历史或备份。点击运行后才开始分析。

| 工具 ID | 功能 | 复用组件 |
| --- | --- | --- |
| security.headers | 响应头与 Cookie 属性检查，区分完整数据和浏览器可见数据 | CSP Evaluator |
| security.csp | CSP 指令与风险分析 | Google CSP Evaluator |
| security.jwt | 解析、签名、验签，Issuer、Audience、有效期约束 | jose |
| security.certificate | PEM 链解析、SHA-256 指纹、有效期、相邻证书签名 | PKIjs、ASN1js |
| security.password | 本地口令猜测难度估计 | zxcvbn-ts |
| security.report | Gitleaks JSON、Nuclei JSON/JSONL、SARIF 统一展示 | 项目原生适配器 |

JWT 验签固定允许算法，支持 HMAC、RSA、PSS、ES256、EdDSA；密钥支持 PEM、JWK、本地 JWKS。解析结果始终标记 verified=false。验签不自动下载远程密钥。证书检查不会推断系统信任、域名匹配或吊销状态。浏览器使用 Web Crypto，JWT 和证书需要 HTTPS 或 localhost。

报告默认隐藏密钥、片段、URL 凭据、参数和片段标识。未提供严重等级时显示未评级。每次最多展示 5000 条发现，结果中明确记录截断状态。界面支持等级与文本筛选，复制、导出和发送至工具的结果采用当前筛选条件。

API 调试台响应可以转入响应头、JWT 或报告分析。浏览器可见响应头的缺项标记为不可见，不判定服务端缺失。分析结果可进入 JSON 工具或配方工作台。

## 程序调用

使用 tools.search、tools.describe 查询工具和参数。security.run 返回对象；tools.run 保留文本 DataValue 契约，value 为 JSON 字符串。

```js
import {security} from './packages/sdk/dist/index.js';
const result = await security.run({
  toolId: 'security.headers',
  input: {type: 'text', value: 'X-Content-Type-Options: nosniff'},
  params: {context: 'complete'}
});
```

CLI 命令为 `node packages/cli/index.mjs security.run`，通过 stdin 接收相同请求，通过 stdout 返回单个 JSON 结果。MCP 工具为 `security_run`，无需网络权限。静态目录 `api/v1/catalog.json` 提供参数发现；GitHub Pages 不提供服务端 HTTP 执行接口。

许可证原文位于 `licenses/security/`，随静态构建一同发布。
