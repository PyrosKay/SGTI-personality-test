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

// 计算每个维度的最大可能加成
const allQDims = new Set<string>();
for (const q of questions) {
  for (const opt of q.options) {
    for (const d of Object.keys(opt.effects)) allQDims.add(d);
  }
}

const maxBoost: Record<string, number> = {};
for (const d of allQDims) maxBoost[d] = 0;
for (const q of questions) {
  const qMax: Record<string, number> = {};
  for (const opt of q.options) {
    for (const [dim, inc] of Object.entries(opt.effects)) {
      qMax[dim] = Math.max(qMax[dim] || 0, inc);
    }
  }
  for (const [dim, inc] of Object.entries(qMax)) {
    maxBoost[dim] += inc;
  }
}

// 蒙特卡洛：归一化匹配
const results: Record<string, number> = {};
for (const p of personalityTypes) results[p.name] = 0;

const NUM_SIM = 20000;
let rng = 42;
function rand() {
  rng = (rng * 16807) % 2147483647;
  return rng / 2147483647;
}

for (let i = 0; i < NUM_SIM; i++) {
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
    let count = 0;
    for (const t of p.traits) {
      if (dimScores[t] !== undefined && maxBoost[t] > 0) {
        // 归一化：看用户选择了该维度多大比例的可能加成
        const norm = (dimScores[t] - 50) / maxBoost[t];
        totalNorm += norm;
        count++;
      }
    }
    if (count > 0) {
      const avgNorm = totalNorm / count;
      if (avgNorm > bestScore) {
        bestScore = avgNorm;
        best = p.name;
      }
    }
  }
  if (best) results[best]++;
}

console.log(`=== 归一化匹配（${NUM_SIM}次，(score-50)/max_boost）===`);
const total = Object.values(results).reduce((a, b) => a + b, 0);
const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
for (const [name, count] of sorted) {
  const pct = (count / total) * 100;
  const bar = "█".repeat(Math.floor(pct / 1.5));
  console.log(`  ${name.padEnd(6)}: ${String(count).padStart(5)} (${pct.toFixed(1).padStart(5)}%) ${bar}`);
}

const idealPct = 100 / personalityTypes.length;
const maxPct = Math.max(...Object.values(results)) / total * 100;
const minPct = Math.min(...Object.values(results).filter(v => v > 0)) / total * 100;
const zeroCount = Object.values(results).filter(v => v === 0).length;

console.log(`\n  理想均匀: ${idealPct.toFixed(1)}%`);
console.log(`  最大偏差: ${maxPct.toFixed(1)}% (偏高 +${(maxPct - idealPct).toFixed(1)}%)`);
console.log(`  最小偏差: ${minPct.toFixed(1)}% (偏低 -${(idealPct - minPct).toFixed(1)}%)`);
console.log(`  零命中: ${zeroCount}`);

// 方法2: z-score within user profile
const results2: Record<string, number> = {};
for (const p of personalityTypes) results2[p.name] = 0;

rng = 42;
for (let i = 0; i < NUM_SIM; i++) {
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

  // z-score within user
  const values = Object.values(dimScores);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance) || 1;

  let best: string | null = null;
  let bestScore = -999;
  for (const p of personalityTypes) {
    let zSum = 0;
    let count = 0;
    for (const t of p.traits) {
      if (dimScores[t] !== undefined) {
        zSum += (dimScores[t] - mean) / std;
        count++;
      }
    }
    if (count > 0) {
      const avgZ = zSum / count;
      if (avgZ > bestScore) {
        bestScore = avgZ;
        best = p.name;
      }
    }
  }
  if (best) results2[best]++;
}

console.log(`\n=== z-score匹配（${NUM_SIM}次）===`);
const total2 = Object.values(results2).reduce((a, b) => a + b, 0);
const sorted2 = Object.entries(results2).sort((a, b) => b[1] - a[1]);
for (const [name, count] of sorted2) {
  const pct = (count / total2) * 100;
  const bar = "█".repeat(Math.floor(pct / 1.5));
  console.log(`  ${name.padEnd(6)}: ${String(count).padStart(5)} (${pct.toFixed(1).padStart(5)}%) ${bar}`);
}

const maxPct2 = Math.max(...Object.values(results2)) / total2 * 100;
const minPct2 = Math.min(...Object.values(results2).filter(v => v > 0)) / total2 * 100;
console.log(`\n  最大偏差: ${maxPct2.toFixed(1)}%, 最小偏差: ${minPct2.toFixed(1)}%`);
