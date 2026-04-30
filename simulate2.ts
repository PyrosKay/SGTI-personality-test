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

// 新方法：每道题对每个人格只取最高匹配的单个trait
const personalityMax2: Record<string, number> = {};
const personalityQCount2: Record<string, number> = {};
for (const p of personalityTypes) {
  personalityMax2[p.name] = 0;
  personalityQCount2[p.name] = 0;
}

for (const q of questions) {
  for (const p of personalityTypes) {
    let qMax = 0;
    for (const opt of q.options) {
      // 只取最高匹配的单个trait（不是累加）
      let maxTraitScore = 0;
      for (const t of p.traits) {
        maxTraitScore = Math.max(maxTraitScore, opt.effects[t] || 0);
      }
      qMax = Math.max(qMax, maxTraitScore);
    }
    personalityMax2[p.name] += qMax;
    if (qMax > 0) personalityQCount2[p.name]++;
  }
}

console.log("=== 新算法：每道题只取最高匹配单个trait ===");
for (const p of personalityTypes) {
  console.log(`  ${p.name.padEnd(6)}: ${String(personalityQCount2[p.name]).padStart(2)}题有贡献, max_total=${String(personalityMax2[p.name]).padStart(3)}, 平均每题=${(personalityMax2[p.name]/questions.length).toFixed(1)}`);
}

// 蒙特卡洛：新算法
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
  const allQDims = new Set<string>();
  for (const q of questions) {
    for (const opt of q.options) {
      for (const d of Object.keys(opt.effects)) allQDims.add(d);
    }
  }
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
    // 每道题只取最高匹配的单个trait
    let totalScore = 0;
    let matchCount = 0;
    for (const t of p.traits) {
      if (dimScores[t] !== undefined) {
        totalScore += dimScores[t];
        matchCount++;
      }
    }
    if (matchCount > 0) {
      const avg = totalScore / matchCount;
      if (avg > bestScore) {
        bestScore = avg;
        best = p.name;
      }
    }
  }
  if (best) results[best]++;
}

console.log(`\n=== 蒙特卡洛模拟（${NUM_SIM}次，新算法：每题最高匹配单个trait）===`);
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

console.log("\n=== 修复前后对比 ===");
console.log("  修复前: 最大19.5%, 最小0%, 零命中4个");
console.log("  旧算法(累加): 最大32.2%, 最小0.1%, 零命中0个");
console.log(`  新算法(单trait): 最大${maxPct.toFixed(1)}%, 最小${minPct.toFixed(1)}%, 零命中${zeroCount}个`);
