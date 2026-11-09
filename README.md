# MornDream-Tools

中文优先的个人数据工具站：常用工具、CyberChef 原生配方和 HTTP 调试台使用统一的发现与操作界面。网页为纯静态应用，数据处理在本机完成，可部署至 GitHub Pages。

## 功能

- 20 项常用工具：JSON / CSV、Base64、URL、Hex、Unicode、哈希、HMAC、UUID、JWT、时间戳、正则、大小写、去重、排序、统计、文本对比、URL 解析。
- 506 项 CyberChef 原生操作：中英文搜索、参数配置、步骤排序、启用和禁用、断点、单步、取消、原生配方导入导出，以及个人配方保存。常用操作使用简洁控件，其余操作支持原生 JSON 参数数组。
- HTTP 调试台：请求集合、多标签、查询参数、请求头、JSON / 文本 / URL 编码 / 文件表单、Bearer / Basic Auth、环境变量、cURL 导入导出、历史、超时和取消。
- 请求响应可送入工具或配方，处理结果可回填请求 Body，JSON 字段可提取为环境变量。
- 全站快捷搜索、收藏、最近使用、浅色 / 深色、自动换行、Windows 和手机响应式布局。
- IndexedDB 保存本地配置，版本化工作区备份支持跨设备导入恢复。私密环境值仅保留当前会话，导出时清除认证凭据；配方参数和请求正文按用户保存的内容导出。
- 同一套接口提供 TypeScript / JavaScript SDK、JSON CLI、本地 MCP stdio Server。网页不提供公网 HTTP 执行服务。

保留的 CyberChef 完整界面位于 `cyberchef/`，适合查看图像等专门输出。统一操作区以文本和数据转换为主。

## 本地运行

安装 Node.js 24 LTS，Windows、Linux、macOS 使用相同命令：

```sh
npm ci
npm run build
npm run dev
```

首次构建会安装并编译仓库内固定版本的 CyberChef，需要联网下载 npm 依赖。以后构建复用该版本的生成产物。按终端地址访问网页，不能直接用 `file://` 打开。

```sh
npm run typecheck
npm test
```

修改网页后重新执行 `npm run build` 并刷新。

## GitHub Pages

仓库提供 `.github/workflows/pages.yml`：推送 `main` 后自动构建、类型检查、测试并部署；Pull Request 只执行验证。

1. 建立名为 `MornDream-Tools` 的 GitHub 仓库，上传本仓库源代码。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 查看 **Actions → Verify and deploy Pages**，成功后在部署任务中打开网址。

构建产物为 `dist/`，全部资源使用相对路径，兼容项目站点的 `/MornDream-Tools/` 路径。纯静态托管不需要服务器或数据库。浏览器请求仍受目标接口的 CORS、HTTPS 和 Cookie 策略限制；本地 Node CLI / MCP 可用于浏览器无法直连的接口。

## Agent 调用

构建后可直接导入仓库中的 SDK：

```js
import {tools, recipes, http, blankRequest} from './packages/sdk/dist/index.js';

const descriptor = tools.describe('json.format');
const result = await tools.run({
  toolId: descriptor.id,
  input: {type: 'text', value: '{b:2,a:1}'},
  params: {sort: true, indent: 2}
});
console.log(result);

const decoded = await recipes.run({
  input: {type: 'text', value: 'SGVsbG8='},
  recipe: [{op: 'From Base64', args: recipes.defaults('From Base64')}]
});

const request = {...blankRequest('example'), url: 'https://example.com'};
const preview = http.prepare(request); // 不发送
// 显式允许网络后才真正发送：
// const response = await http.send(request, {}, {allowNetwork: true});
```

SDK 随本源码仓库使用，依赖仓库内的适配器和 CyberChef；不要单独复制 `packages/sdk/dist` 作为独立安装包。接口定义与更多示例见 [docs/AGENT_API.md](docs/AGENT_API.md)。

CLI 支持 stdin 或 `--input` 文件，标准输出只有 JSON：

```sh
node packages/cli/index.mjs tools.search --input examples/search.json
node packages/cli/index.mjs tools.run --input examples/json-format.json
node packages/cli/index.mjs recipes.run --input examples/base64-recipe.json
```

MCP 客户端配置，把脚本路径改成实际仓库目录：

```json
{
  "mcpServers": {
    "morndream-tools": {
      "command": "node",
      "args": ["C:/Projects/MornDream-Tools/packages/mcp/index.mjs"]
    }
  }
}
```

MCP 默认不允许网络。确需请求远端接口时，在 `args` 中添加 `--allow-network`。服务不读取网页私密会话或浏览器数据库。

## 上游与许可证

主项目使用 [GPL-3.0](LICENSE)。工具组织参考 [IT-Tools](https://github.com/CorentinTh/it-tools)，原生配方功能固定使用指定的 [CyberChef-Chinese](https://github.com/shadowhunter1024/CyberChef-Chinese)，后者保留 Apache-2.0 许可证与源码署名。具体来源和版本见 [NOTICE](NOTICE) 与 [upstream-sources.json](upstream-sources.json)。

当前工具箱实现已确认原型中的 20 项常用工具；IT-Tools 的其余工具尚未全部迁移。506 项操作已接入原生引擎与参数目录，自动化测试覆盖代表性配方及全部默认参数，未逐项验证每种操作的所有输入。上游更新流程见 [docs/MAINTENANCE.md](docs/MAINTENANCE.md)。

安全工具区现提供响应头、CSP、JWT 签名与验签、PEM 证书链、口令强度及 Gitleaks / Nuclei / SARIF 报告分析。支持 API 响应转入、结果筛选导出、JSON 工具及配方联动。SDK `security.run`、CLI `security.run` 和 MCP `security_run` 共用实现。详见 [安全工具设计与调用](docs/SECURITY_WORKSPACE.md)。
