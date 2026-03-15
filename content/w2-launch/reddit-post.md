# I built a skill marketplace for Claude Code with built-in security scanning — here's why

**Title option A:** I built a skill marketplace for Claude Code with security scanning and quality ratings — 6 curated skills included

**Title option B:** Most Claude Code skills have no quality control. I built Skill Hub to fix that.

---

## The problem

I've been deep in the Claude Code skill ecosystem for a while now, and here's what I found: the majority of publicly available skills are poorly structured, and a meaningful percentage have detectable security issues.

What kind of issues? Skills that ask you to pipe remote code (`curl | bash`), skills that instruct you to send API tokens to unknown endpoints, Base64-obfuscated code blocks that can't be audited, and even prompt injection attempts (DAN-style jailbreaks embedded in skill instructions).

The skill system itself is brilliant — it lets you extend your agent's capabilities through structured Markdown files. But there's no built-in quality gate or security check before installation. You're on your own.

## What Skill Hub does

Skill Hub is itself a skill. Once installed, it acts as a decentralized marketplace *inside* your Claude Code agent. When you need a capability your agent doesn't have, you just say "find me a skill for X" and it handles discovery, security verification, and installation.

### Security: 7 red-line rules

Before recommending any skill, Skill Hub runs an automated scan against 7 security rules. A single violation means instant rejection:

1. **No pipe execution** — `curl | bash`, `wget | sh`, or any remote code piping
2. **No credential exfiltration** — no sending API keys/tokens to external services
3. **No security bypasses** — no `--no-verify`, `--insecure`, `NODE_TLS_REJECT_UNAUTHORIZED=0`
4. **No obfuscated code** — no Base64 blobs, `eval()`, or unreadable code blocks
5. **No system file modification** — no touching `/etc/`, `~/.ssh/`, `~/.bashrc`
6. **No silent data collection** — no telemetry without explicit disclosure and opt-out
7. **No AI safety bypasses** — no jailbreak prompts, DAN instructions, or system prompt manipulation

Each rule has specific regex patterns and detection logic. It's not a vibes check.

### Quality: S/A/B/C ratings

Skills that pass security scanning get scored across 5 dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Description clarity | 25% | Are trigger keywords accurate and bilingual? |
| Instruction quality | 30% | Is the workflow structured, executable, with edge case handling? |
| Resource completeness | 20% | Does it include references/scripts as supplementary resources? |
| Trigger precision | 15% | Will it activate correctly and not fire on unrelated queries? |
| Maintenance status | 10% | Version number, update recency |

S-tier (90-100) gets top recommendation. Anything below B-tier (< 60) is not shown unless explicitly requested.

## What's included

Skill Hub ships with 6 skills out of the box:

- **skill-hub** — the meta skill: search, scan, rate, and install other skills
- **smart-brainstorm** — structured brainstorming with 6 frameworks (SCAMPER, Six Thinking Hats, First Principles, SWOT, How Might We, Reverse Brainstorming). Outputs prioritized action plans, not generic idea lists
- **ui-design-system** — generates production-ready design systems: complete design tokens (color scales, typography, spacing on a 4px grid), component patterns with accessibility specs (WCAG 2.1 AA), outputs in Tailwind CSS config / CSS custom properties / vanilla CSS, with dark mode built in
- **xhs-writer** — content creation assistant for Xiaohongshu (China's Instagram/Pinterest equivalent). Full workflow from topic planning to title formulas to body writing to hashtag strategy, with built-in prohibited word scanning to avoid platform penalties
- **video-script** — video script and storyboard generator for TikTok/YouTube/Bilibili. Outputs structured storyboard tables, SRT subtitle files, and shooting notes (camera setup, lighting, audio)
- **feishu-kit** — integration toolkit for Feishu/Lark (China's enterprise collaboration platform by ByteDance). Covers messaging, docs, bitable (spreadsheet database), webhook bots, and approval workflows via API

## Install

```bash
npx skills add secondme-team/skill-hub --all -g
```

That's it. One command installs all 6 skills globally. You can also install individually:

```bash
npx skills add secondme-team/skill-hub@smart-brainstorm -g
```

After installation, skills activate contextually based on your conversation, or you can trigger them explicitly.

## What it doesn't do

- Does NOT auto-install anything — every installation requires your confirmation
- Does NOT collect usage data or search history
- Does NOT phone home — the registry is a static JSON file fetched from GitHub
- Does NOT badmouth other skills or platforms

The entire project is open source. Every line of every skill is auditable.

GitHub: https://github.com/secondme-team/skill-hub

Happy to answer questions or take feedback.
