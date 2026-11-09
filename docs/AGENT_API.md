# Agent API

调用 SDK 前运行根目录 `npm ci && npm run build`。本地 Node 运行器随源码仓库提供，无需启动 HTTP 服务。网页内可通过 `window.MornDreamTools` 使用已注册的浏览器运行器。

## 数据与结果

文本输入：

```json
{"type":"text","value":"hello"}
```

二进制输入或输出使用标准 Base64：

```json
{"type":"bytes","encoding":"base64","value":"SGVsbG8="}
```

常用工具接收文本。配方接受文本或二进制；二进制结果应保留 Base64 传输，只有需要展示文本时才做 UTF-8 解码。

计算成功返回 `{"ok":true,"data":DataValue,"meta":{...}}`，失败返回 `{"ok":false,"error":{"code":"...","message":"..."}}`。配方错误可包含 `stepIndex`，索引从 0 开始。

常见错误码：`TOOL_NOT_FOUND`、`INVALID_INPUT`、`UNKNOWN_OPERATION`、`INVALID_ARGUMENTS`、`NETWORK_NOT_ALLOWED`、`RECIPE_ERROR`、`TIMEOUT`、`CANCELLED`、`NETWORK_ERROR`。

## 接口

| SDK | 用途 |
| --- | --- |
| `tools.search({query,limit})` | 搜索常用工具 |
| `tools.describe(toolId)` | 查看稳定 ID、参数 JSON Schema、输出类型与运行环境 |
| `tools.run({toolId,input,params},options)` | 执行单个工具 |
| `recipes.operations({query,limit})` | 搜索原生操作及参数说明 |
| `recipes.defaults(op)` | 获取参数默认数组 |
| `recipes.validate({input,recipe},options)` | 检查操作、参数数量、基础类型和网络权限 |
| `recipes.run({input,recipe},options)` | 使用原生 Chef 执行完整配方 |
| `http.prepare(request,environment)` | 变量替换及请求检查，不发送 |
| `http.send(request,environment,options)` | 真实 HTTP 请求 |
| `workspace.create()` | 空工作区 |
| `workspace.import(value)` | 验证、迁移工作区，返回结构化对象 |
| `workspace.export(value)` | 导出版本化 JSON 并清理指定凭据字段 |

`RuntimeOptions` 接受 `signal`、`timeoutMs`、`allowNetwork`。配方和 Node 工具在 Worker 中执行，可终止超时任务。浏览器适配器对单工具默认限制为 10 秒，配方与 Node 运行器默认限制为 30 秒。需要长任务时显式指定 `timeoutMs`。

网络默认关闭。`HTTP request` 和 `DNS over HTTPS` 配方操作以及 `http.send` 需要 `allowNetwork:true`。`http.send` 可能改变远端数据；工具不会自动执行请求中的脚本或自动发送回填的请求。

原生操作名保留英文，例如：

```js
const recipe = [
  {op: 'URL Decode', args: recipes.defaults('URL Decode')},
  {op: 'From Base64', args: recipes.defaults('From Base64')},
  {op: 'JSON Beautify', args: ['  ', true, false]}
];
const result = await recipes.run({
  input: {type: 'text', value: 'eyJhIjoxfQ%3D%3D'},
  recipe
});
```

`disabled` 跳过步骤；`breakpoint` 是原生引擎暂停标记。网页单步模式从原始输入重新执行前缀，以保留二进制和多步骤处理语义。复杂 Fork / Jump 流程建议执行完整配方。

## HTTP

通过 `blankRequest(id)` 创建完整请求对象，再填写 URL、方法和所需参数。`{{name}}` 由请求变量覆盖环境变量。支持的方法为 GET、POST、PUT、PATCH、DELETE、HEAD、OPTIONS。

`http.prepare` 返回解析后的 URL、方法、请求头、文本 Body 和超时。Form Data 及 URLSearchParams 使用实际请求结构发送；prepare 的 `body` 对非字符串结构返回 `null`。网页和 Node 使用同样的受限请求头规则，Cookie、Host、Content-Length 等不接受手工填写。

响应返回 `status`、`statusText`、`headers`、`body`、`url`、`size`、`duration`。HTTP 4xx / 5xx 仍属于已收到的响应，网络失败才返回错误。响应体按文本读取，`size` 为解码后的 UTF-8 字节数。

`parseCurl` 和 `requestToCurl` 支持单条 POSIX cURL 的常用方法、请求头、文本或 JSON Body、Basic Auth。文件上传使用网页 Form Data；不执行命令、管道或 Shell 脚本。

## 工作区

```json
{
  "format": "morndream-workspace",
  "schemaVersion": 2,
  "favorites": ["json"],
  "recipes": [
    {"id":"example","name":"Base64 解码","input":"", "recipe":[{"op":"From Base64","args":["A-Za-z0-9+/=",true,false]}]}
  ],
  "requests": [],
  "environments": [],
  "settings": {"dark":false,"auto":true,"wrap":false}
}
```

导入支持旧版工具备份 `version:1` 和 API 备份 `format:morn-api-workspace`。网页通过设置中的备份入口导出整个工作区，换设备后导入恢复。输入和输出默认不保存；个人配方可以显式包含示例输入。API 未保存的标签和响应体不随工作区导出。

导出清除 Auth token / password、已识别的敏感请求头和变量、私密环境值。请求正文和配方参数按原内容导出，应由调用者决定是否包含业务数据。MCP 不直接访问浏览器数据库；需要使用导出的工作区文件。

## CLI 与 MCP

CLI 命令与 SDK 名称一致，包括 `recipes.operations`。stdin 或 `--input` 传入 JSON；搜索和 describe 也可直接传位置参数。正常调用结果输出一行 JSON，业务错误返回 `ok:false` 且退出码为 1；命令解析错误写入 stderr。

```sh
node packages/cli/index.mjs tools.describe json.format
node packages/cli/index.mjs recipes.operations --input examples/search.json
```

MCP 提供 `tools_search`、`tools_describe`、`tools_run`、`recipes_operations`、`recipes_validate`、`recipes_run`、`http_prepare`、`http_send`、`workspace_import`、`workspace_export`。所有调用返回结构化结果。开启网络需要服务启动参数 `--allow-network`。

静态目录提供 `api/v1/catalog.json`，用于读取工具和操作目录。该路径是静态元数据文件，不是远程执行接口。

## 安全分析

调用 `tools.search({query:'security.'})` 获取六项安全工具，使用 `tools.describe(toolId)` 获取参数。`security.run` 接收与 `tools.run` 相同的请求，返回结构化 JSON 对象；CLI 命令 `security.run`，MCP 工具 `security_run`。详细契约和数据处理方式见 [安全工具工作区](SECURITY_WORKSPACE.md)。
