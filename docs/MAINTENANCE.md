# 维护与更新

## 项目结构

| 路径 | 职责 |
| --- | --- |
| `apps/web` | Vue 入口、统一工作台、API 界面、浏览器 Worker 与存储 |
| `packages/core` | 工具目录、Schema、常用计算、配方、工作区格式 |
| `packages/adapters` | Node Worker、原生 Chef 适配、共享 HTTP 构造 |
| `packages/sdk` | SDK 导出与 TypeScript 声明 |
| `packages/cli` | JSON CLI |
| `packages/mcp` | 本地 MCP stdio Server |
| `vendor/cyberchef` | 指定中文仓库固定版本源码 |
| `scripts` | 可复现构建 |
| `tests` | 计算、HTTP、迁移、CLI 与 MCP 集成验证 |

网页和 Agent 入口均调用共享 SDK。常用工具在 `quick.js` 中实现；配方直接调用原生 Chef，不把多步骤流程替换成独立算法模拟。界面以统一工作区提供常用功能，原生 CyberChef 页面作为高级功能补充。

## 日常迭代

1. 修改源码及必要的接口类型。
2. 执行 `npm run build`、`npm run typecheck`、`npm test`。
3. 在浏览器检查改动涉及的工具、配方或请求流转。
4. 提交到 `main`，Pages 工作流自动验证并部署。部署失败时先查看对应 Actions 日志。

根目录和 CyberChef 各自保留 `package-lock.json`，用 `npm ci` 安装确定版本。构建脚本复用已生成的 CyberChef，修改上游源码或构建设置后需先删除 `vendor/cyberchef/build` 再重新构建。

## 更新上游

CyberChef 的更新以一个经过验证的 commit 为单位：

1. 从 `upstream-sources.json` 记录的指定仓库选择新 commit。
2. 用该 commit 的完整源码替换 `vendor/cyberchef`，保持 MornDream 适配文件位于 vendor 外部。
3. 更新来源记录，重新安装 vendor 依赖并生成 OperationConfig、模块和原生网页。
4. 检查参数默认值、操作 ID、翻译、原生配方导入、压缩二进制、多步骤及 Worker 取消。
5. 回归 SDK、CLI、MCP 和网页，再提交更新。

升级主版本或变更工作区结构时增加明确迁移，保留既有格式读取能力。不要根据数组序号或中文显示名保存配方；持久格式使用英文原生操作 ID 和完整参数数组。

IT-Tools 后续工具按实际需求接入核心和统一 UI。每项新增工具需添加稳定 ID、参数 Schema、运行环境、输出定义及代表性验证。

## 发布与数据

`dist` 是可复制到任意静态服务器的网页产物。SDK 和 MCP 的 Node 运行器依赖完整源码仓库及其 npm 依赖，不单独发布裁剪后的 SDK 目录。

浏览器数据按站点来源隔离。更换域名、浏览器或设备前，导出工作区备份，迁移后重新填写会话密钥。发布源码和 Pages 产物不包含个人工作区数据。

上游许可证、源码版权头和依赖许可证应随源码及网页保留。根目录 `NOTICE` 和 `upstream-sources.json` 记录集成来源。
