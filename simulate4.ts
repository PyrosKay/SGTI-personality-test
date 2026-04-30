import { questions } from "./src/data/questions";

const personalityTypes = [
  { name: "神曹操",  traits: ["leadership", "cunning", "decisive"] },
  { name: "鲁肃",    traits: ["collaborative", "empathetic", "peaceful"] },
  { name: "祢衡",    traits: ["rebellious", "witty", "playful"] },
  { name: "刘焉",    traits: ["ambitious", "passionate", "dramatic"] },
  { name: "司马懿",  traits: ["patient", "pragmatic", "cunning"] },
  { name: "郭嘉",    traits: ["emotional", "sensitive", "tragic"] },
  { name: "诸葛亮",  traits: ["caring", "protective", "rational"] },
  { name: "华佗",    traits: ["selfless", "defensive", "cautious"] },
  { name: "左慈",    traits: ["spontaneous", "mischievous", "adventurous"] },
  { name: "孙尚香",  traits: ["impulsive", "competitive", "decisive"] },
  { name: "SP赵云",  traits: ["brave", "independent", "heroic"] },
  { name: "费祎",    traits: ["balanced", "patient", "deliberate"] },
  { name: "刘禅",    traits: ["optimistic", "carefree", "accepting"] },
  { name: "界徐盛",  traits: ["aggressive", "competitive", "determined"] },
  { name: "魔张飞",  traits: ["aggressive", "impulsive", "brave"] },
];

const allQDims = new Set<string>();
for (const q of questions) {
  for (const opt of q.options) {
    for (const d of Object.keys(opt.effects)) allQDims.add(d);
  }
}

const maxBoost: Record<string, number> = {};
const qCount: Record<string, number> = {};
for (const d of allQDims) { maxBoost[d] = 0; qCount[d] = 0; }
for (const q of questions) {
  const qMax: Record<string, number> = {};
  for (const opt of q.options) {
    for (const [dim, inc] of Object.entries(opt.effects)) {
      qMax[dim] = Math.max(qMax[dim] || 0, inc);
    }
  }
  for (const [dim, inc] of Object.entries(qMax)) {
    maxBoost[dim] += inc;
    qCount[dim]++;
  }
}

// 计算每个维度的random期望加成 (假设每个选项等概率)
const expectedBoost: Record<string, number> = {};
for (const d of allQDims) expectedBoost[d] = 0;
for (const q of questions) {
  for (const [dim] of Object.entries(qCount)) {
    // 该维度在本题中的平均加成
    let sum = 0;
    for (const opt of q.options) {
      sum += opt.effects[dim] || 0;
    }
    expectedBoost[dim] += sum / q.options.length;
  }
}

function testSmooth(smooth: number, weightByFreq: boolean) {
  const results: Record<string, number> = {};
  for (const p of personalityTypes) results[p.name] = 0;

  let rng = 42;
  function rand() {
    rng = (rng * 16807) % 2147483647;
    return rng / 2147483647;
  }

  for (let i = 0; i < 20000; i++) {
    const dimScores: Record<string, number> = {};
    for (const d of allQDims) dimScores[d] = 50;

    for (const q of questions) {
      const optIdx = Math.floor(rand() * q.options.length);
      const effects = q.options[optIdx].effects;
      for (const [dim, inc] of Object.entries(effects)) {
        if (dimScores[dim] !== undefined) {
          dimScores[dim] = Math.min(100, Math.max(0, dimScores[dim] + inc));
        }
      }
    }

    let best: string | null = null;
    let bestScore = -1;
    for (const p of personalityTypes) {
      let totalNorm = 0;
      let totalWeight = 0;
      for (const t of p.traits) {
        if (dimScores[t] !== undefined && maxBoost[t] > 0) {
          const norm = (dimScores[t] - 50 + smooth) / (maxBoost[t] + smooth);
          const w = weightByFreq ? qCount[t] : 1;
          totalNorm += norm * w;
          totalWeight += w;
        }
      }
      if (totalWeight > 0) {
        const avgNorm = totalNorm / totalWeight;
        if (avgNorm > bestScore) {
          bestScore = avgNorm;
          best = p.name;
        }
      }
    }
    if (best) results[best]++;
  }

  const total = Object.values(results).reduce((a, b) => a + b, 0);
  const values = Object.values(results).filter(v => v > 0);
  const maxPct = Math.max(...values) / total * 100;
  const minPct = Math.min(...values) / total * 100;
  const zeroCount = Object.values(results).filter(v => v === 0).length;
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const range = maxPct - minPct;
  return { smooth, weightByFreq, maxPct, minPct, zeroCount, range, results, sorted };
}

console.log("测试不同参数组合：");
const configs = [
  { smooth: 0, weightByFreq: false },
  { smooth: 5, weightByFreq: false },
  { smooth: 10, weightByFreq: false },
  { smooth: 15, weightByFreq: false },
  { smooth: 20, weightByFreq: false },
  { smooth: 0, weightByFreq: true },
  { smooth: 5, weightByFreq: true },
  { smooth: 10, weightByFreq: true },
];

for (const c of configs) {
  const r = testSmooth(c.smooth, c.weightByFreq);
  const label = r.weightByFreq ? "freq加权" : "无加权";
  console.log(`  smooth=${String(r.smooth).padStart(2)} ${label}: 最大=${r.maxPct.toFixed(1)}% 最小=${r.minPct.toFixed(1)}% 极差=${r.range.toFixed(1)}% 零=${r.zeroCount}`);
}

// 选最优参数展示详细分布
console.log("\n=== 最优方案：smooth=10, 无加权 ===");
const best = testSmooth(10, false);
for (const [name, count] of best.sorted) {
  const pct = (count / 20000) * 100;
  const bar = "█".repeat(Math.floor(pct / 1.2));
  console.log(`  ${name.padEnd(6)}: ${String(count).padStart(5)} (${pct.toFixed(1).padStart(5)}%) ${bar}`);
}
console.log(`  理想均匀: ${(100/15).toFixed(1)}%, 极差: ${best.range.toFixed(1)}%`);
