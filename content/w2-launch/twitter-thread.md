# Twitter/X Thread - Skill Hub Launch

---

## English Version (7 tweets)

### Tweet 1 (Hook)
Most Claude Code skills are unvetted. No security checks. No quality scoring. You install them on faith.

I built Skill Hub — a marketplace that lives inside your agent. It scans every skill against 7 security rules before recommending it.

One command, 6 curated skills:
```
npx skills add secondme-team/skill-hub --all -g
```

### Tweet 2 (Security angle)
What the 7 security red lines catch:

- curl | bash pipe execution
- Credential exfiltration
- SSL/security bypass instructions
- Base64 obfuscated code
- System file modification
- Silent telemetry
- AI jailbreak prompts

One violation = instant rejection. Not a vibes check — pattern-matched detection.

### Tweet 3 (Quality system)
Every skill also gets an S/A/B/C quality rating across 5 dimensions:

- Description clarity (25%)
- Instruction quality (30%)
- Resource completeness (20%)
- Trigger precision (15%)
- Maintenance status (10%)

Below B-tier? You won't even see it.

### Tweet 4 (Skill showcase - Brainstorm)
smart-brainstorm is my favorite.

6 proven frameworks: SCAMPER, Six Thinking Hats, First Principles, SWOT, How Might We, Reverse Brainstorming.

Full pipeline: problem framing → framework selection → divergent thinking → 5-dimension evaluation → action plan with milestones.

Hard rule: no generic fluff allowed in output.

### Tweet 5 (Skill showcase - Design System)
ui-design-system generates production-ready design systems from a single brand color:

- 11-step color scales with contrast ratios
- Typography on a modular scale
- 4px spacing grid
- Component patterns (Button, Modal, Form, Table...)
- Tailwind config + CSS variables output
- Dark mode + WCAG 2.1 AA accessibility

### Tweet 6 (Skill showcase - Content Creation)
For the Chinese market, two content skills:

xhs-writer: Full Xiaohongshu (RED) workflow — topic → titles (5 formulas) → body → hashtag 3+3+3 strategy → auto prohibited-word scan

video-script: Storyboard tables + SRT subtitles + shooting notes for Douyin/Bilibili/YouTube/TikTok

[Visual description: side-by-side screenshot of xhs-writer output with formatted post and quality checklist]

### Tweet 7 (CTA)
```
npx skills add secondme-team/skill-hub --all -g
```

6 skills. Security scanning. Quality ratings. Open source.

GitHub: github.com/secondme-team/skill-hub

---

## Chinese Version / 中文版 (7 条)

### Tweet 1 (Hook)
Claude Code 的 Skill 生态有个没人说的问题：大量 Skill 没有安全审查，没有质量门槛。

我们做了 Skill Hub——装在 Agent 里的应用市场。每个 Skill 安装前必须通过 7 条安全红线扫描 + S/A/B/C 质量评级。

一行命令装 6 个精选 Skill：
```
npx skills add secondme-team/skill-hub --all -g
```

### Tweet 2 (安全机制)
7 条安全红线，任何一条触发直接拒绝：

1. 禁止 curl | bash 管道执行
2. 禁止凭证外泄
3. 禁止关闭安全功能
4. 禁止混淆代码
5. 禁止修改系统文件
6. 禁止暗中收集数据
7. 禁止 AI 越狱 prompt

不是人工审核，是自动化模式匹配扫描。

### Tweet 3 (质量评级)
质量评分 5 个维度：

描述清晰度 25% | 指令质量 30% | 资源完整度 20% | 触发精度 15% | 维护状态 10%

S 级强烈推荐，C 级（< 60 分）不展示。
目前自带的 5 个卫星 Skill：4 个 S 级 + 1 个 A 级。

### Tweet 4 (头脑风暴)
smart-brainstorm 不是"帮我想 10 个点子"那种。

6 种框架：SCAMPER、六顶思考帽、第一性原理、SWOT、How Might We、逆向头脑风暴。

全流程：问题定义 → 框架选择 → 发散（每维度至少 3 个具体创意）→ 5 维筛选 → 行动计划 + 风险预案。

硬性规则：禁止空话套话，每个创意必须能回答"第一步做什么"。

### Tweet 5 (内容创作)
两个内容 Skill 值得单独说：

xhs-writer：小红书全流程——选题策划 → 5 个爆款标题（标注公式）→ 正文（自动控节奏和字数）→ 标签 3+3+3 → 违禁词扫描 → 质检报告。输出可直接复制发布。

video-script：分镜表格 + SRT 字幕 + 拍摄提示。支持抖音/B站/YouTube/TikTok，5 种视频类型。

[视觉描述: xhs-writer 输出截图，展示标题方案 + 正文排版 + 质检报告]

### Tweet 6 (设计 + 飞书)
ui-design-system：给一个品牌色，生成完整设计系统。11 级色阶 + 排版 + 4px 间距网格 + 组件模式 + WCAG AA 无障碍。直出 Tailwind config 和 CSS Variables。

feishu-kit：飞书 5 大场景 API 集成——消息/文档/多维表格/Webhook 机器人/审批。附带 shell 辅助脚本，一行命令发消息。

### Tweet 7 (CTA)
```
npx skills add secondme-team/skill-hub --all -g
```

6 个 Skill，覆盖创意/设计/内容/开发/协作。
安全扫描 + 质量评级 + 开源可审查。

GitHub: github.com/secondme-team/skill-hub

---

## Visual/GIF Descriptions (for design team)

1. **Hero image**: Terminal screenshot showing the install command and successful installation output of all 6 skills. Clean dark theme terminal.

2. **Security scan visual**: Infographic showing the 7 red-line rules as a checklist with red X marks, with a green checkmark at the bottom saying "Passed". Shield icon.

3. **Quality rating card**: A mock-up of the skill recommendation display showing skill name, S-tier badge, one-line description, security scan passed, and install command. Similar to an app store listing.

4. **xhs-writer demo**: Screen recording (GIF) of Claude Code conversation: user says "帮我写一篇小红书笔记关于居家办公好物", agent generates complete post with title options, body, hashtags, and quality checklist. ~15 seconds.

5. **smart-brainstorm demo**: Screen recording (GIF) of a brainstorming session showing framework selection (SCAMPER recommended), structured divergent output with [highlight] markers, and final prioritized action plan. ~20 seconds.

6. **Before/after split**: Left side "Before Skill Hub" showing raw `npx skills find` results with unknown quality. Right side "After Skill Hub" showing curated results with security badges and quality ratings.
