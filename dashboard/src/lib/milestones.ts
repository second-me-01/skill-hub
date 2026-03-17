/**
 * Milestone configuration derived from the SkillHub Strategy doc (Section 5).
 *
 * Each milestone maps a target install count to the week it should be hit,
 * the key event, and the primary growth driver at that stage.
 */

export interface Milestone {
  week: number;
  targetInstalls: number;
  event: string;
  growthDriver: string;
  phase: "seed" | "ramp" | "accelerate" | "scale";
}

export const milestones: Milestone[] = [
  {
    week: 1,
    targetInstalls: 0,
    event: "产品开发完成，全平台上架",
    growthDriver: "---",
    phase: "seed",
  },
  {
    week: 2,
    targetInstalls: 1_000,
    event: "集中投放，冲 Hot 榜",
    growthDriver: "直投",
    phase: "seed",
  },
  {
    week: 3,
    targetInstalls: 5_000,
    event: "种子期完成",
    growthDriver: "直投 + 社群",
    phase: "seed",
  },
  {
    week: 5,
    targetInstalls: 10_000,
    event: "卫星 Skill 开始交叉导流",
    growthDriver: "交叉导流",
    phase: "ramp",
  },
  {
    week: 8,
    targetInstalls: 30_000,
    event: "进入 Trending 榜",
    growthDriver: "交叉导流 + 内容",
    phase: "ramp",
  },
  {
    week: 12,
    targetInstalls: 60_000,
    event: "自然流量成为主引擎",
    growthDriver: "平台自然流量",
    phase: "accelerate",
  },
  {
    week: 16,
    targetInstalls: 100_000,
    event: "开放第三方入驻",
    growthDriver: "自然流量 + 生态",
    phase: "accelerate",
  },
  {
    week: 20,
    targetInstalls: 150_000,
    event: "企业批量安装启动",
    growthDriver: "生态 + 企业",
    phase: "scale",
  },
  {
    week: 24,
    targetInstalls: 200_000,
    event: "目标达成",
    growthDriver: "网络效应",
    phase: "scale",
  },
];

/** Return the current milestone based on total installs. */
export function getCurrentMilestone(totalInstalls: number): Milestone {
  let current = milestones[0];
  for (const m of milestones) {
    if (totalInstalls >= m.targetInstalls) {
      current = m;
    } else {
      break;
    }
  }
  return current;
}

/** Return the next milestone to reach. */
export function getNextMilestone(totalInstalls: number): Milestone | null {
  for (const m of milestones) {
    if (totalInstalls < m.targetInstalls) {
      return m;
    }
  }
  return null; // all milestones achieved
}

/** Calculate progress percentage toward the next milestone. */
export function getMilestoneProgress(totalInstalls: number): number {
  const current = getCurrentMilestone(totalInstalls);
  const next = getNextMilestone(totalInstalls);
  if (!next) return 100;

  const range = next.targetInstalls - current.targetInstalls;
  if (range <= 0) return 100;

  const progress = totalInstalls - current.targetInstalls;
  return Math.min(100, Math.round((progress / range) * 100));
}
