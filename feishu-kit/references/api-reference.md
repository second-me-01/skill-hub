# 飞书开放平台 API 参考文档

## 认证流程

飞书开放平台使用 OAuth 2.0 机制，应用通过 `app_id` 和 `app_secret` 获取访问令牌。

### 获取 tenant_access_token

适用于企业自建应用，以应用身份调用 API。

```bash
curl -s -X POST 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal' \
  -H 'Content-Type: application/json' \
  -d '{
    "app_id": "cli_xxxxxxxxxxxx",
    "app_secret": "xxxxxxxxxxxxxxxxxxxxxxxx"
  }'
```

**成功响应：**
```json
{
  "code": 0,
  "msg": "ok",
  "tenant_access_token": "t-g1xxxxxxxxxxxxxxxxxxxxx",
  "expire": 7200
}
```

- `expire` 单位为秒，默认 7200 秒（2 小时）
- 建议在过期前 5 分钟刷新 token
- 重复获取会返回相同的 token（直到过期）

### 获取 app_access_token

适用于应用商店应用或需要区分租户的场景：

```bash
curl -s -X POST 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal' \
  -H 'Content-Type: application/json' \
  -d '{
    "app_id": "cli_xxxxxxxxxxxx",
    "app_secret": "xxxxxxxxxxxxxxxxxxxxxxxx"
  }'
```

### 获取 user_access_token

需要用户授权的场景（如操作用户个人文档）：

1. 引导用户访问授权页面获取 `code`
2. 用 `code` 换取 `user_access_token`

```bash
curl -s -X POST 'https://open.feishu.cn/open-apis/authen/v1/oidc/access_token' \
  -H "Authorization: Bearer $APP_ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "grant_type": "authorization_code",
    "code": "USER_AUTH_CODE"
  }'
```

---

## 消息 API

### 基础 URL

```
POST https://open.feishu.cn/open-apis/im/v1/messages
```

### 查询参数

| 参数 | 必填 | 说明 |
|------|------|------|
| receive_id_type | 是 | 接收者 ID 类型：open_id / user_id / email / chat_id |

### 请求体

```json
{
  "receive_id": "oc_xxxxxxxxxx",
  "msg_type": "text",
  "content": "{\"text\":\"你好世界\"}"
}
```

> **注意**：`content` 字段的值是 JSON **字符串**，不是 JSON 对象。需要对内部 JSON 进行转义。

### 支持的消息类型

| msg_type | 说明 | content 格式 |
|----------|------|-------------|
| text | 纯文本 | `{"text":"内容"}` |
| post | 富文本 | `{"zh_cn":{"title":"标题","content":[[...]]}}` |
| image | 图片 | `{"image_key":"img_xxxxx"}` |
| interactive | 卡片消息 | 卡片 JSON 结构 |
| share_chat | 分享群名片 | `{"chat_id":"oc_xxxxx"}` |
| file | 文件 | `{"file_key":"file_xxxxx"}` |

### 富文本 content 结构

```json
{
  "zh_cn": {
    "title": "通知标题",
    "content": [
      [
        {"tag": "text", "text": "普通文本"},
        {"tag": "a", "text": "链接文字", "href": "https://example.com"},
        {"tag": "at", "user_id": "ou_xxxxx", "user_name": "张三"}
      ],
      [
        {"tag": "text", "text": "第二段落"}
      ]
    ]
  }
}
```

### 卡片消息结构

```json
{
  "header": {
    "title": {"tag": "plain_text", "content": "卡片标题"},
    "template": "blue"
  },
  "elements": [
    {"tag": "markdown", "content": "**粗体** 和 `代码`"},
    {"tag": "hr"},
    {"tag": "action", "actions": [
      {
        "tag": "button",
        "text": {"tag": "plain_text", "content": "点击按钮"},
        "type": "primary",
        "url": "https://example.com"
      }
    ]}
  ]
}
```

卡片 header template 可选颜色：`blue`、`wathet`、`turquoise`、`green`、`yellow`、`orange`、`red`、`carmine`、`violet`、`purple`、`indigo`、`grey`。

### 回复消息

```bash
curl -s -X POST "https://open.feishu.cn/open-apis/im/v1/messages/$MESSAGE_ID/reply" \
  -H "Authorization: Bearer $TENANT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "msg_type": "text",
    "content": "{\"text\":\"收到，已处理\"}"
  }'
```

---

## 文档 API

### 创建文档

```bash
curl -s -X POST 'https://open.feishu.cn/open-apis/docx/v1/documents' \
  -H "Authorization: Bearer $TENANT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "新文档标题",
    "folder_token": "fldcnxxxxxxxx"
  }'
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "document": {
      "document_id": "doxcnxxxxxxxx",
      "revision_id": 1,
      "title": "新文档标题"
    }
  }
}
```

### 获取文档纯文本内容

```bash
curl -s -X GET "https://open.feishu.cn/open-apis/docx/v1/documents/$DOCUMENT_ID/raw_content" \
  -H "Authorization: Bearer $TENANT_TOKEN"
```

### 获取文档块列表

```bash
curl -s -X GET "https://open.feishu.cn/open-apis/docx/v1/documents/$DOCUMENT_ID/blocks?page_size=50" \
  -H "Authorization: Bearer $TENANT_TOKEN"
```

### 电子表格 — 读取数据

```bash
# RANGE 格式: SheetName!A1:C10 或 sheet_id!A1:C10
curl -s -X GET "https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/$SPREADSHEET_TOKEN/values/$RANGE" \
  -H "Authorization: Bearer $TENANT_TOKEN"
```

### 电子表格 — 写入数据

```bash
curl -s -X PUT "https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/$SPREADSHEET_TOKEN/values" \
  -H "Authorization: Bearer $TENANT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "valueRange": {
      "range": "Sheet1!A1:C2",
      "values": [
        ["姓名", "部门", "工号"],
        ["张三", "技术部", "1001"]
      ]
    }
  }'
```

---

## 多维表格 API (Bitable)

### Token 获取方式

从多维表格 URL 提取：
- URL 格式：`https://xxx.feishu.cn/base/BASExxxxxxxx?table=tblxxxxxxxx`
- `app_token` = `BASExxxxxxxx`
- `table_id` = `tblxxxxxxxx`

### 列出数据表

```bash
curl -s -X GET "https://open.feishu.cn/open-apis/bitable/v1/apps/$APP_TOKEN/tables" \
  -H "Authorization: Bearer $TENANT_TOKEN"
```

### 查询记录（支持筛选和排序）

```bash
curl -s -X POST "https://open.feishu.cn/open-apis/bitable/v1/apps/$APP_TOKEN/tables/$TABLE_ID/records/search" \
  -H "Authorization: Bearer $TENANT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "page_size": 20,
    "filter": {
      "conjunction": "and",
      "conditions": [
        {
          "field_name": "状态",
          "operator": "is",
          "value": ["进行中"]
        }
      ]
    },
    "sort": [
      {"field_name": "创建时间", "desc": true}
    ]
  }'
```

### 筛选条件操作符

| 操作符 | 说明 | 适用字段类型 |
|--------|------|-------------|
| is | 等于 | 文本、单选、数字 |
| isNot | 不等于 | 文本、单选、数字 |
| contains | 包含 | 文本 |
| doesNotContain | 不包含 | 文本 |
| isEmpty | 为空 | 所有类型 |
| isNotEmpty | 不为空 | 所有类型 |
| isGreater | 大于 | 数字、日期 |
| isLess | 小于 | 数字、日期 |

### 创建记录

```bash
curl -s -X POST "https://open.feishu.cn/open-apis/bitable/v1/apps/$APP_TOKEN/tables/$TABLE_ID/records" \
  -H "Authorization: Bearer $TENANT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "fields": {
      "任务名称": "完成 API 对接",
      "优先级": "高",
      "截止日期": 1700000000000,
      "负责人": [{"id": "ou_xxxxx"}]
    }
  }'
```

### 字段类型与值格式

| 字段类型 | 值格式 | 示例 |
|----------|--------|------|
| 文本 | 字符串 | `"hello"` |
| 数字 | 数字 | `42` |
| 单选 | 字符串 | `"选项A"` |
| 多选 | 字符串数组 | `["选项A", "选项B"]` |
| 日期 | 毫秒时间戳 | `1700000000000` |
| 复选框 | 布尔值 | `true` |
| 人员 | 对象数组 | `[{"id": "ou_xxxxx"}]` |
| 超链接 | 对象 | `{"text": "显示文字", "link": "https://..."}` |

### 批量更新记录

```bash
curl -s -X POST "https://open.feishu.cn/open-apis/bitable/v1/apps/$APP_TOKEN/tables/$TABLE_ID/records/batch_update" \
  -H "Authorization: Bearer $TENANT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "records": [
      {"record_id": "recXXXXX1", "fields": {"状态": "已完成"}},
      {"record_id": "recXXXXX2", "fields": {"状态": "已完成"}}
    ]
  }'
```

---

## Webhook 机器人 API

### 基础 URL

```
POST https://open.feishu.cn/open-apis/bot/v2/hook/{webhook_token}
```

### 签名校验

如果 Webhook 开启了签名校验，需要计算签名：

```bash
# 签名算法：
# 1. 将 timestamp + "\n" + secret 拼接
# 2. 使用 HmacSHA256 计算签名
# 3. Base64 编码

TIMESTAMP=$(date +%s)
SECRET="your_webhook_secret"

# 使用 openssl 计算签名
STRING_TO_SIGN="${TIMESTAMP}\n${SECRET}"
SIGN=$(printf '%s' "$STRING_TO_SIGN" | openssl dgst -sha256 -hmac "" -binary | base64)

curl -s -X POST "$FEISHU_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"timestamp\": \"$TIMESTAMP\",
    \"sign\": \"$SIGN\",
    \"msg_type\": \"text\",
    \"content\": {\"text\": \"带签名的消息\"}
  }"
```

> **注意**：签名的 timestamp 与服务器时间差不能超过 1 小时，否则校验失败。

---

## 审批 API

### 获取审批定义列表

```bash
curl -s -X GET "https://open.feishu.cn/open-apis/approval/v4/approvals?page_size=20" \
  -H "Authorization: Bearer $TENANT_TOKEN"
```

### 查询审批实例

```bash
curl -s -X GET "https://open.feishu.cn/open-apis/approval/v4/instances/$INSTANCE_ID" \
  -H "Authorization: Bearer $TENANT_TOKEN"
```

**响应示例：**
```json
{
  "code": 0,
  "data": {
    "approval_code": "approval_xxxxx",
    "approval_name": "请假审批",
    "status": "APPROVED",
    "user_id": "ou_xxxxx",
    "start_time": "1700000000000",
    "end_time": "1700003600000",
    "timeline": [
      {
        "type": "APPLY",
        "user_id": "ou_xxxxx",
        "comment": "申请3天年假"
      },
      {
        "type": "APPROVE",
        "user_id": "ou_yyyyy",
        "comment": "同意"
      }
    ]
  }
}
```

---

## 频率限制

飞书开放平台对 API 调用有频率限制：

| API 类别 | 限制 | 说明 |
|----------|------|------|
| 消息发送 | 50 次/秒（应用维度） | 包括所有类型消息 |
| 文档读取 | 100 次/秒 | 单个应用 |
| 文档写入 | 30 次/秒 | 单个应用 |
| 多维表格读取 | 100 次/秒 | 单个应用 |
| 多维表格写入 | 50 次/秒 | 单个应用 |
| Webhook | 100 次/分钟 | 单个 Webhook |
| 审批查询 | 20 次/秒 | 单个应用 |

### 最佳实践

1. **批量操作**：尽量使用批量 API（如 `batch_create`、`batch_update`），减少请求次数
2. **Token 缓存**：tenant_access_token 缓存后复用，避免每次请求都获取新 token
3. **分页处理**：列表类 API 注意处理 `page_token`，循环获取全部数据
4. **错误重试**：遇到 429 或频率限制错误时，使用指数退避策略重试
5. **异步处理**：大批量数据操作建议拆分为小批次，每批之间间隔 200ms
6. **权限最小化**：只申请实际需要的 API 权限，遵循最小权限原则
7. **日志记录**：记录每次 API 调用的响应码和耗时，方便排查问题

---

## 官方文档链接

- 开放平台首页：https://open.feishu.cn
- API 文档：https://open.feishu.cn/document
- 应用管理后台：https://open.feishu.cn/app
- API 调试台：https://open.feishu.cn/api-explorer
