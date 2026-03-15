# Skill Hub

> 装 Skill 之前，先装 Skill Hub。

Agent 时代的去中心化 Skill 应用市场。把分发渠道安装到每个用户的 Agent 里。

## 安装

```bash
npx skills add secondme-team/skill-hub --all -g
```

## 包含的 Skills

| Skill | 功能 | 状态 |
|-------|------|------|
| **skill-hub** | Meta Skill：发现 / 安全检查 / 安装 | ✅ |
| **smart-brainstorm** | 结构化头脑风暴（6+ 框架） | ✅ |
| **ui-design-system** | 设计系统最佳实践 | ✅ |
| **xhs-writer** | 小红书内容创作 | ✅ |
| **video-script** | 短视频脚本 / 分镜 / 字幕 | ✅ |
| **feishu-kit** | 飞书集成 | ✅ |

## 单独安装

```bash
# 只装核心
npx skills add secondme-team/skill-hub@skill-hub -g

# 只装某个卫星 Skill
npx skills add secondme-team/skill-hub@smart-brainstorm -g
```

## 安全机制

Skill Hub 在安装任何第三方 Skill 前，自动执行 **7 条安全红线** 扫描：

1. 禁止 `curl | bash` 管道执行
2. 禁止凭证/Token 外泄指令
3. 禁止关闭安全功能的指令
4. 禁止混淆代码
5. 禁止修改系统文件的指令
6. 禁止未经同意的数据收集
7. 禁止违反 AI 安全准则的指令

## 质量评级

每个推荐的 Skill 都经过 S/A/B/C 四级质量评分：

- **S 级**: 顶级质量，强烈推荐
- **A 级**: 优秀，推荐使用
- **B 级**: 合格，可以使用
- **C 级**: 基础可用，建议谨慎

---

Made with ❤️ by [SecondMe Team](https://github.com/secondme-team)
