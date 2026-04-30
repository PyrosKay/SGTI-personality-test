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

// 构建人格→选项映射（每选项只取最高匹配的单个trait）
const optionPersonalityEffects: { qid: string; optIdx: number; effects: Record<string, number> }[] = [];

for (let qi = 0; qi < questions.length; qi++) {
  const q = questions[qi];
  for (let oi = 0; oi < q.options.length; oi++) {
    const opt = q.options[oi];
    const pe: Record<string, number> = {};
    for (const p of personalityTypes) {
      let maxScore = 0;
      for (const t of p.traits) {
        maxScore = Math.max(maxScore, opt.effects[t] || 0);
      }
      if (maxScore > 0) pe[p.name] = maxScore;
    }
    optionPersonalityEffects.push({ qid: q.id, optIdx: oi, effects: pe });
  }
}

// 统计每个人格的总加成机会
const pMaxTotal: Record<string, number> = {};
const pQCount: Record<string, number> = {};
for (const p of personalityTypes) { pMaxTotal[p.name] = 0; pQCount[p.name] = 0; }

for (const entry of optionPersonalityEffects) {
  for (const [pName, score] of Object.entries(entry.effects)) {
    pMaxTotal[pName] += score;
    pQCount[pName]++;
  }
}

console.log("=== 直接人格评分：各人格加成机会 ===");
for (const p of personalityTypes) {
  console.log(`  ${p.name.padEnd(6)}: ${String(pQCount[p.name]).padStart(2)}个选项有加成, max_total=${String(pMaxTotal[p.name]).padStart(3)}`);
}

// 蒙特卡洛：直接人格评分
const results: Record<string, number> = {};
for (const p of personalityTypes) results[p.name] = 0;

let rng = 42;
function rand() {
  rng = (rng * 16807) % 2147483647;
  return rng / 2147483647;
}

for (let i = 0; i < 20000; i++) {
  const pScores: Record<string, number> = {};
  for (const p of personalityTypes) pScores[p.name] = 0;

  for (const q of questions) {
    const optIdx = Math.floor(rand() * q.options.length);
    const opt = q.options[optIdx];
    for (const p of personalityTypes) {
      let maxScore = 0;
      for (const t of p.traits) {
        maxScore = Math.max(maxScore, opt.effects[t] || 0);
      }
      pScores[p.name] += maxScore;
    }
  }

  let best: string | null = null;
  let bestScore = -1;
  for (const p of personalityTypes) {
    if (pScores[p.name] > bestScore) {
      bestScore = pScores[p.name];
      best = p.name;
    }
  }
  if (best) results[best]++;
}

console.log(`\n=== 直接人格评分蒙特卡洛（20000次）===`);
const total = Object.values(results).reduce((a, b) => a + b, 0);
const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
for (const [name, count] of sorted) {
  const pct = (count / total) * 100;
  const bar = "█".repeat(Math.floor(pct / 1.5));
  console.log(`  ${name.padEnd(6)}: ${String(count).padStart(5)} (${pct.toFixed(1).padStart(5)}%) ${bar}`);
}

const maxPct = Math.max(...Object.values(results)) / total * 100;
const minPct = Math.min(...Object.values(results).filter(v => v > 0)) / total * 100;
const zeroCount = Object.values(results).filter(v => v === 0).length;
console.log(`\n  最大偏差: ${maxPct.toFixed(1)}%, 最小偏差: ${minPct.toFixed(1)}%, 零命中: ${zeroCount}`);

// 归一化直接评分
const results2: Record<string, number> = {};
for (const p of personalityTypes) results2[p.name] = 0;

rng = 42;
for (let i = 0; i < 20000; i++) {
  const pScores: Record<string, number> = {};
  for (const p of personalityTypes) pScores[p.name] = 0;

  for (const q of questions) {
    const optIdx = Math.floor(rand() * q.options.length);
    const opt = q.options[optIdx];
    for (const p of personalityTypes) {
      let maxScore = 0;
      for (const t of p.traits) {
        maxScore = Math.max(maxScore, opt.effects[t] || 0);
      }
      pScores[p.name] += maxScore;
    }
  }

  let best: string | null = null;
  let bestScore = -999;
  for (const p of personalityTypes) {
    const norm = pScores[p.name] / (pMaxTotal[p.name] || 1);
    if (norm > bestScore) {
      bestScore = norm;
      best = p.name;
    }
  }
  if (best) results2[best]++;
}

console.log(`\n=== 归一化直接评分（score/max_total）===`);
const total2 = Object.values(results2).reduce((a, b) => a + b, 0);
const sorted2 = Object.entries(results2).sort((a, b) => b[1] - a[1]);
for (const [name, count] of sorted2) {
  const pct = (count / total2) * 100;
  const bar = "█".repeat(Math.floor(pct / 1.5));
  console.log(`  ${name.padEnd(6)}: ${String(count).padStart(5)} (${pct.toFixed(1).padStart(5)}%) ${bar}`);
}

const maxPct2 = Math.max(...Object.values(results2)) / total2 * 100;
const minPct2 = Math.min(...Object.values(results2).filter(v => v > 0)) / total2 * 100;
const zeroCount2 = Object.values(results2).filter(v => v === 0).length;
console.log(`\n  最大偏差: ${maxPct2.toFixed(1)}%, 最小偏差: ${minPct2.toFixed(1)}%, 零命中: ${zeroCount2}`);
