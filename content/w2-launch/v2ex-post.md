# Skill Hub - Claude Code 的 Skill 应用市场，内置安全扫描和质量评级

## 背景

Claude Code 的 Skill 系统很强大，但生态质量参差不齐。我们扫描了大量公开 Skill 后发现两个问题：

1. 多数 Skill 缺乏结构化指令，Agent 执行效果不稳定
2. 部分 Skill 存在安全风险：`curl | bash` 管道执行、要求发送凭证到外部服务、Base64 混淆代码、甚至 AI 越狱 prompt

## Skill Hub 做了什么

一个安装在 Agent 里的去中心化 Skill 市场。核心机制：

**安全扫描（7 条红线）**
- 禁止管道执行（curl | bash, wget | sh）
- 禁止凭证外泄到外部服务
- 禁止关闭安全功能（--no-verify, --insecure, chmod 777）
- 禁止混淆代码（Base64, eval, obfuscation）
- 禁止修改系统文件（/etc/, ~/.ssh/, ~/.bashrc）
- 禁止未告知的数据收集
- 禁止 AI 安全绕过指令

任何一条触发即拒绝推荐。

**质量评级（S/A/B/C 四级）**
- 5 个维度加权打分：描述清晰度(25%) + 指令质量(30%) + 资源完整度(20%) + 触发精度(15%) + 维护状态(10%)
- 低于 B 级（60 分）不主动推荐

## 自带 6 个 Skill

| Skill | 功能 | 评级 |
|-------|------|------|
| skill-hub | Meta Skill：搜索/安全扫描/安装第三方 Skill | - |
| smart-brainstorm | 结构化头脑风暴，6 种框架（SCAMPER/六顶帽/第一性原理/SWOT/HMW/逆向） | S |
| ui-design-system | 设计系统生成器：Design Tokens + 组件模式，输出 Tailwind/CSS Variables/Vanilla CSS | S |
| xhs-writer | 小红书内容创作：选题/标题/正文/标签/封面，自动违禁词检查 | S |
| video-script | 视频脚本：分镜表格 + SRT 字幕 + 拍摄提示，支持抖音/B站/YouTube/TikTok | S |
| feishu-kit | 飞书 API 集成：消息/文档/多维表格/Webhook 机器人/审批 | A |

## 安装

```bash
# 全部安装
npx skills add secondme-team/skill-hub --all -g

# 只装核心
npx skills add secondme-team/skill-hub@skill-hub -g

# 单独安装某个
npx skills add secondme-team/skill-hub@smart-brainstorm -g
```

## 技术细节

- Skill 本质是结构化 SKILL.md + references/ 辅助资源 + scripts/ 脚本
- 安全扫描基于正则模式匹配，对 Skill 全部文件执行
- 精选推荐库是一个 JSON registry，通过 WebFetch 获取
- 不收集用户数据，不自动安装，必须用户确认

GitHub: https://github.com/secondme-team/skill-hub

欢迎反馈和 PR。
