#!/usr/bin/env bash
#
# feishu-api.sh — 飞书开放平台 API 辅助脚本
#
# 使用方法:
#   source feishu-api.sh
#
# 环境变量（使用前需设置）:
#   FEISHU_APP_ID       - 飞书应用 App ID
#   FEISHU_APP_SECRET   - 飞书应用 App Secret
#   FEISHU_WEBHOOK_URL  - Webhook 机器人地址（仅 Webhook 功能需要）
#
# 示例:
#   # 设置环境变量
#   export FEISHU_APP_ID="cli_xxxxxxxxxxxx"
#   export FEISHU_APP_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
#   export FEISHU_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
#
#   # 加载脚本
#   source feishu-api.sh
#
#   # 获取访问令牌
#   get_tenant_token
#   echo "Token: $FEISHU_TENANT_TOKEN"
#
#   # 通过 Webhook 发送消息
#   send_webhook_message "部署完成"
#
#   # 通过 Bot API 发送消息到群组
#   send_bot_message "oc_xxxxxxxx" "构建成功"
#
#   # 发送富文本 Webhook 消息
#   send_webhook_post "通知标题" "通知内容正文"
#
#   # 发送卡片 Webhook 消息
#   send_webhook_card "卡片标题" "**Markdown** 内容" "blue"
#

set -euo pipefail

# 飞书 API 基础地址
FEISHU_BASE_URL="https://open.feishu.cn/open-apis"

# 缓存的 tenant_access_token
FEISHU_TENANT_TOKEN=""
FEISHU_TOKEN_EXPIRE_AT=0

# ============================================================================
# get_tenant_token — 获取 tenant_access_token
#
# 使用 FEISHU_APP_ID 和 FEISHU_APP_SECRET 获取访问令牌。
# 令牌缓存在 FEISHU_TENANT_TOKEN 变量中，过期前 5 分钟自动刷新。
#
# 示例:
#   get_tenant_token
#   echo "$FEISHU_TENANT_TOKEN"
# ============================================================================
get_tenant_token() {
    # 检查环境变量
    if [ -z "${FEISHU_APP_ID:-}" ] || [ -z "${FEISHU_APP_SECRET:-}" ]; then
        echo "[错误] 请设置 FEISHU_APP_ID 和 FEISHU_APP_SECRET 环境变量" >&2
        return 1
    fi

    # 检查缓存是否有效（提前 300 秒刷新）
    local now
    now=$(date +%s)
    if [ -n "$FEISHU_TENANT_TOKEN" ] && [ "$now" -lt "$((FEISHU_TOKEN_EXPIRE_AT - 300))" ]; then
        return 0
    fi

    # 请求新 token
    local response
    response=$(curl -s -X POST "${FEISHU_BASE_URL}/auth/v3/tenant_access_token/internal" \
        -H 'Content-Type: application/json' \
        -d "{
            \"app_id\": \"${FEISHU_APP_ID}\",
            \"app_secret\": \"${FEISHU_APP_SECRET}\"
        }")

    # 解析响应
    local code
    code=$(echo "$response" | grep -o '"code":[0-9]*' | head -1 | cut -d: -f2)

    if [ "$code" != "0" ]; then
        local msg
        msg=$(echo "$response" | grep -o '"msg":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "[错误] 获取 token 失败: $msg" >&2
        return 1
    fi

    FEISHU_TENANT_TOKEN=$(echo "$response" | grep -o '"tenant_access_token":"[^"]*"' | cut -d'"' -f4)
    local expire
    expire=$(echo "$response" | grep -o '"expire":[0-9]*' | cut -d: -f2)
    FEISHU_TOKEN_EXPIRE_AT=$((now + expire))

    echo "[成功] 已获取 tenant_access_token（${expire}秒后过期）"
}

# ============================================================================
# send_webhook_message — 通过 Webhook 发送纯文本消息
#
# 参数:
#   $1 — 消息文本内容
#
# 示例:
#   send_webhook_message "服务器重启完成"
# ============================================================================
send_webhook_message() {
    local text="${1:?[错误] 请提供消息内容}"

    if [ -z "${FEISHU_WEBHOOK_URL:-}" ]; then
        echo "[错误] 请设置 FEISHU_WEBHOOK_URL 环境变量" >&2
        return 1
    fi

    local response
    response=$(curl -s -X POST "$FEISHU_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{
            \"msg_type\": \"text\",
            \"content\": {
                \"text\": \"${text}\"
            }
        }")

    local code
    code=$(echo "$response" | grep -o '"code":[0-9]*' | head -1 | cut -d: -f2)

    if [ "$code" = "0" ]; then
        echo "[成功] Webhook 消息已发送"
    else
        echo "[错误] Webhook 消息发送失败: $response" >&2
        return 1
    fi
}

# ============================================================================
# send_webhook_post — 通过 Webhook 发送富文本消息
#
# 参数:
#   $1 — 消息标题
#   $2 — 消息正文
#
# 示例:
#   send_webhook_post "部署通知" "版本 v1.2.3 已上线"
# ============================================================================
send_webhook_post() {
    local title="${1:?[错误] 请提供消息标题}"
    local content="${2:?[错误] 请提供消息内容}"

    if [ -z "${FEISHU_WEBHOOK_URL:-}" ]; then
        echo "[错误] 请设置 FEISHU_WEBHOOK_URL 环境变量" >&2
        return 1
    fi

    local response
    response=$(curl -s -X POST "$FEISHU_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{
            \"msg_type\": \"post\",
            \"content\": {
                \"post\": {
                    \"zh_cn\": {
                        \"title\": \"${title}\",
                        \"content\": [[{\"tag\": \"text\", \"text\": \"${content}\"}]]
                    }
                }
            }
        }")

    local code
    code=$(echo "$response" | grep -o '"code":[0-9]*' | head -1 | cut -d: -f2)

    if [ "$code" = "0" ]; then
        echo "[成功] Webhook 富文本消息已发送"
    else
        echo "[错误] Webhook 富文本消息发送失败: $response" >&2
        return 1
    fi
}

# ============================================================================
# send_webhook_card — 通过 Webhook 发送卡片消息
#
# 参数:
#   $1 — 卡片标题
#   $2 — 卡片内容（支持 Markdown）
#   $3 — 标题颜色（可选，默认 blue）
#
# 示例:
#   send_webhook_card "构建报告" "**状态**: 成功\n**耗时**: 2分30秒" "green"
# ============================================================================
send_webhook_card() {
    local title="${1:?[错误] 请提供卡片标题}"
    local content="${2:?[错误] 请提供卡片内容}"
    local template="${3:-blue}"

    if [ -z "${FEISHU_WEBHOOK_URL:-}" ]; then
        echo "[错误] 请设置 FEISHU_WEBHOOK_URL 环境变量" >&2
        return 1
    fi

    local response
    response=$(curl -s -X POST "$FEISHU_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{
            \"msg_type\": \"interactive\",
            \"card\": {
                \"header\": {
                    \"title\": {\"tag\": \"plain_text\", \"content\": \"${title}\"},
                    \"template\": \"${template}\"
                },
                \"elements\": [
                    {\"tag\": \"markdown\", \"content\": \"${content}\"}
                ]
            }
        }")

    local code
    code=$(echo "$response" | grep -o '"code":[0-9]*' | head -1 | cut -d: -f2)

    if [ "$code" = "0" ]; then
        echo "[成功] Webhook 卡片消息已发送"
    else
        echo "[错误] Webhook 卡片消息发送失败: $response" >&2
        return 1
    fi
}

# ============================================================================
# send_bot_message — 通过 Bot API 发送文本消息到群组
#
# 需要先调用 get_tenant_token 获取令牌。
#
# 参数:
#   $1 — 接收者 ID（群组 chat_id 或用户 open_id）
#   $2 — 消息文本内容
#   $3 — 接收者 ID 类型（可选，默认 chat_id）
#
# 示例:
#   get_tenant_token
#   send_bot_message "oc_xxxxxxxx" "Hello from bot"
#   send_bot_message "ou_xxxxxxxx" "私聊消息" "open_id"
# ============================================================================
send_bot_message() {
    local receive_id="${1:?[错误] 请提供接收者 ID}"
    local text="${2:?[错误] 请提供消息内容}"
    local id_type="${3:-chat_id}"

    # 确保 token 有效
    if [ -z "$FEISHU_TENANT_TOKEN" ]; then
        echo "[提示] 正在自动获取 tenant_access_token..." >&2
        get_tenant_token || return 1
    fi

    local response
    response=$(curl -s -X POST "${FEISHU_BASE_URL}/im/v1/messages?receive_id_type=${id_type}" \
        -H "Authorization: Bearer ${FEISHU_TENANT_TOKEN}" \
        -H 'Content-Type: application/json' \
        -d "{
            \"receive_id\": \"${receive_id}\",
            \"msg_type\": \"text\",
            \"content\": \"{\\\"text\\\":\\\"${text}\\\"}\"
        }")

    local code
    code=$(echo "$response" | grep -o '"code":[0-9]*' | head -1 | cut -d: -f2)

    if [ "$code" = "0" ]; then
        echo "[成功] Bot 消息已发送"
    else
        # 如果是 token 过期，尝试刷新后重试
        if echo "$response" | grep -q "99991663"; then
            echo "[提示] Token 已过期，正在刷新..." >&2
            FEISHU_TENANT_TOKEN=""
            FEISHU_TOKEN_EXPIRE_AT=0
            get_tenant_token || return 1

            response=$(curl -s -X POST "${FEISHU_BASE_URL}/im/v1/messages?receive_id_type=${id_type}" \
                -H "Authorization: Bearer ${FEISHU_TENANT_TOKEN}" \
                -H 'Content-Type: application/json' \
                -d "{
                    \"receive_id\": \"${receive_id}\",
                    \"msg_type\": \"text\",
                    \"content\": \"{\\\"text\\\":\\\"${text}\\\"}\"
                }")

            code=$(echo "$response" | grep -o '"code":[0-9]*' | head -1 | cut -d: -f2)
            if [ "$code" = "0" ]; then
                echo "[成功] Bot 消息已发送（token 已刷新）"
                return 0
            fi
        fi

        echo "[错误] Bot 消息发送失败: $response" >&2
        return 1
    fi
}
