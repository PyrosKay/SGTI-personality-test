import { Dimension, DimensionCategory, PersonalityResult, AnswerRecord } from '../data/types';
import { questions } from '../data/questions';

// 所有维度及其描述
interface DimensionMeta {
  name: string;
  category: DimensionCategory;
}

export const dimensionMeta: Record<string, DimensionMeta> = {
  introversion: { name: '内倾性', category: 'self' },
  creativity: { name: '创造性', category: 'self' },
  independence: { name: '独立性', category: 'self' },
  selfReflection: { name: '自我反思', category: 'self' },
  rationality: { name: '理性思维', category: 'self' },
  analytical: { name: '分析能力', category: 'self' },
  emotionalDepth: { name: '情感深度', category: 'emotion' },
  empathy: { name: '共情能力', category: 'emotion' },
  sensitivity: { name: '敏感度', category: 'emotion' },
  resilience: { name: '心理韧性', category: 'emotion' },
  optimism: { name: '乐观程度', category: 'emotion' },
  authenticity: { name: '真实自我', category: 'emotion' },
  extroversion: { name: '外倾性', category: 'social' },
  sociability: { name: '社交能力', category: 'social' },
  collaboration: { name: '协作能力', category: 'social' },
  socialBond: { name: '社交归属', category: 'social' },
  leadership: { name: '领导力', category: 'social' },
  assertiveness: { name: '主见性', category: 'social' },
  openness: { name: '开放性', category: 'stress' },
  spontaneity: { name: '随机应变', category: 'stress' },
  riskTaking: { name: '冒险精神', category: 'stress' },
  adaptability: { name: '适应能力', category: 'stress' },
  autonomy: { name: '自主性', category: 'stress' },
  courage: { name: '勇气', category: 'stress' },
};

// 计算所有维度的得分
export function calculateDimensions(answers: AnswerRecord[]): Dimension[] {
  // 初始化所有维度得分为50
  const dimensionScores: Record<string, number> = {};
  for (const dimId of Object.keys(dimensionMeta)) {
    dimensionScores[dimId] = 50;
  }

  // 累计每道题的得分影响
  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question && question.options[answer.optionIndex]) {
      const effects = question.options[answer.optionIndex].effects;
      for (const [dimId, increment] of Object.entries(effects)) {
        if (dimensionScores[dimId] !== undefined) {
          dimensionScores[dimId] = Math.min(100, Math.max(0, dimensionScores[dimId] + increment));
        }
      }
    }
  }

  // 转换为 Dimension 数组
  const dimensions: Dimension[] = [];
  for (const [id, score] of Object.entries(dimensionScores)) {
    const meta = dimensionMeta[id];
    dimensions.push({
      id,
      name: meta.name,
      category: meta.category,
      score,
    });
  }

  return dimensions;
}

// 获取等级标签
function getLevelLabel(score: number): { level: string; label: string } {
  if (score < 35) return { level: 'L', label: '偏低' };
  if (score < 45) return { level: 'M', label: '中等偏低' };
  if (score <= 55) return { level: 'M', label: '适中' };
  if (score <= 65) return { level: 'M', label: '中等偏高' };
  return { level: 'H', label: '偏高' };
}

// 获取维度描述
function getDimensionDescription(id: string, score: number): string {
  const meta = dimensionMeta[id];
  const { label } = getLevelLabel(score);
  
  const descriptions: Record<string, Record<string, string>> = {
    introversion: {
      '偏低': '你更倾向于外向，享受与人交往带来的能量',
      '中等偏低': '你有社交需求，但也需要独处时间来恢复精力',
      '适中': '你能在独处和社交之间灵活切换',
      '中等偏高': '你更喜欢安静的氛围，但也能正常社交',
      '偏高': '你享受独处，在安静中才能真正充电',
    },
    creativity: {
      '偏低': '你更倾向于按部就班，遵循已有方法',
      '中等偏低': '你有自己的想法，但会考虑可行性',
      '适中': '你有一定的创意，能提出有新意的想法',
      '中等偏高': '你思维活跃，常常有独特的想法',
      '偏高': '你极具创造力，思维跳跃，想象力丰富',
    },
    emotionalDepth: {
      '偏低': '你情绪稳定，不容易被情绪左右',
      '中等偏低': '你情绪波动较小，能保持理性',
      '适中': '你情绪丰富但不极端，能较好地处理情感',
      '中等偏高': '你情感细腻，对事物有较深的感受',
      '偏高': '你情感世界丰富而深刻，容易被触动',
    },
    empathy: {
      '偏低': '你更注重逻辑和事实',
      '中等偏低': '你能理解他人，但保持理性判断',
      '适中': '你有较好的共情能力',
      '中等偏高': '你很能理解他人感受',
      '偏高': '你极易感受他人情绪，有很强的共情能力',
    },
    rationality: {
      '偏低': '你更注重感受和直觉',
      '中等偏低': '你会考虑情感因素，但不失理性',
      '适中': '你能平衡理性与感性',
      '中等偏高': '你思维缜密，做事有逻辑',
      '偏高': '你极度理性，很少被情绪影响判断',
    },
    analytical: {
      '偏低': '你更依赖直觉和经验',
      '中等偏低': '你会分析问题但不钻牛角尖',
      '适中': '你有不错的分析能力',
      '中等偏高': '你擅长分析，能深入理解问题',
      '偏高': '你分析能力极强，善于拆解复杂问题',
    },
    openness: {
      '偏低': '你更喜欢熟悉和稳定',
      '中等偏低': '你接受新事物但保持谨慎',
      '适中': '你对新事物保持开放态度',
      '中等偏高': '你乐于接受新想法和体验',
      '偏高': '你极度开放，追求新鲜体验',
    },
    resilience: {
      '偏低': '面对挫折你容易受到打击',
      '中等偏低': '你有一定的抗压能力',
      '适中': '你能较好地应对挫折',
      '中等偏高': '你有较强的心理韧性',
      '偏高': '你心理素质极强，挫折无法击倒你',
    },
    sociability: {
      '偏低': '你更喜欢小圈子或独自活动',
      '中等偏低': '你有几个亲密朋友，不需要太多社交',
      '适中': '你社交适度，享受社交但不依赖',
      '中等偏高': '你喜欢社交，人缘不错',
      '偏高': '你非常外向，享受各种社交场合',
    },
    independence: {
      '偏低': '你依赖性较强，需要他人支持',
      '中等偏低': '你能独立但也愿意接受帮助',
      '适中': '你独立自主，能独自完成任务',
      '中等偏高': '你非常独立，不依赖他人',
      '偏高': '你极度独立，习惯独自解决问题',
    },
  };

  return descriptions[id]?.[label] || `${meta.name}${label}`;
}

// 生成人格结果
export function generatePersonalityResult(dimensions: Dimension[]): PersonalityResult {
  // 找出主要特征
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const highest = sorted.slice(0, 3);

  // 根据特征组合生成人格类型
  const typeInfo = generatePersonalityType(highest);
  
  // 分类维度
  const categorized: Record<DimensionCategory, Dimension[]> = {
    self: [],
    emotion: [],
    social: [],
    stress: [],
  };
  
  for (const dim of dimensions) {
    categorized[dim.category].push(dim);
  }

  return {
    ...typeInfo,
    dimensions,
  };
}

interface PersonalityTypeInfo {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
}

function generatePersonalityType(
  highest: Dimension[]
): PersonalityTypeInfo {
  // 根据最高分维度组合判断人格类型
  const topIds = highest.map((d) => d.id);
  
  const types: Record<string, PersonalityTypeInfo> = {
    'introversion+creativity+emotionalDepth': {
      type: '深沉的艺术家',
      title: '深沉的艺术家',
      subtitle: '内向 · 创造 · 感性',
      description: '你是一个内心世界丰富的人，拥有独特的审美和深邃的情感。你喜欢独处，在安静中思考人生的意义。你的创造力来自于对生活的细腻观察和对情感的深刻体验。你不善言辞，但你的作品或想法往往能触动人心。',
      quote: '「孤独是创造力的温床，而我在这温床里培育出独特的灵魂。」',
    },
    'rationality+analytical+independence': {
      type: '冷静的思考者',
      title: '冷静的思考者',
      subtitle: '理性 · 分析 · 独立',
      description: '你是一个理性至上的人，善于用逻辑分析问题。你独立自主，不依赖他人做决定。面对复杂问题，你能保持冷静，抽丝剥茧找到解决方案。你的思维方式让你的话更有说服力。',
      quote: '「情绪是迷雾，逻辑才是灯塔。」',
    },
    'empathy+collaboration+socialBond': {
      type: '温暖的治愈者',
      title: '温暖的治愈者',
      subtitle: '共情 · 协作 · 归属',
      description: '你天生具有强大的共情能力，是朋友眼中的温暖存在。你善于倾听，理解他人的感受和需求。你重视人际关系，愿意为他人付出。你的存在本身就是一种治愈力量。',
      quote: '「我愿意成为你黑暗中的那束光。」',
    },
    'extroversion+assertiveness+leadership': {
      type: '闪耀的领导者',
      title: '闪耀的领导者',
      subtitle: '外向 · 主见 · 领导',
      description: '你天生具有领导气质，自信而有魄力。你善于表达自己的想法，能激励他人跟随。你外向开朗，享受成为焦点的感觉。你敢于冒险，愿意带领团队开疆扩土。',
      quote: '「跟着我，我们一起创造奇迹。」',
    },
    'openness+spontaneity+creativity': {
      type: '自由的探索者',
      title: '自由的探索者',
      subtitle: '开放 · 随机 · 创造',
      description: '你是一个不安分的灵魂，对世界充满好奇。你追求自由，不愿被规则束缚。你的生活充满了惊喜和变化，思维跳跃而富有创意。你相信人生的意义在于体验。',
      quote: '「生活不是等待风暴过去，而是学会在雨中起舞。」',
    },
    'resilience+optimism+adaptability': {
      type: '乐观的战士',
      title: '乐观的战士',
      subtitle: '韧性 · 乐观 · 适应',
      description: '你是一个天生的乐观主义者，无论遇到什么困难都能保持积极心态。你适应能力强，能在各种环境中生存。你的韧性让你在逆境中成长，是真正的打不死的小强。',
      quote: '「只要活着，就没有什么过不去的坎。」',
    },
    'introversion+rationality+conscientiousness': {
      type: '沉稳的智者',
      title: '沉稳的智者',
      subtitle: '内敛 · 理性 · 严谨',
      description: '你是一个内敛而严谨的人，喜欢深度思考。你做事有计划，注重细节和品质。你不轻易发表意见，但一旦开口必有分量。你的沉稳让人感到安心。',
      quote: '「沉默是金，但当我说出口时，必定字字珠玑。」',
    },
    'emotionalDepth+sensitivity+introspection': {
      type: '敏感的诗人',
      title: '敏感的诗人',
      subtitle: '深度 · 敏感 · 内省',
      description: '你有着细腻敏感的心灵，能感受到常人忽略的细微之处。你喜欢独处和思考，人生对你来说是一场深度的内心旅程。你的感受力是你的天赋，也是你需要守护的脆弱。',
      quote: '「世界在我眼中，比在他人眼中要丰富得多。」',
    },
  };

  // 尝试匹配类型
  const combinations = [
    topIds.join('+'),
    [...topIds.slice(0, 2)].join('+'),
    topIds[0],
  ];

  for (const combo of combinations) {
    if (types[combo]) {
      return types[combo];
    }
  }

  // 默认类型
  return {
    type: '独特的我',
    title: '独特的我',
    subtitle: '独一无二的存在',
    description: '你是一个独特的存在，拥有多面的性格。你的特质难以用简单的标签定义，因为你是如此丰富多彩。每个维度都在塑造着独一无二的你。保持这份独特，世界需要你这样的色彩。',
    quote: '「我就是我，不被定义的我。」',
  };
}

// 获取维度得分的详细信息
export function getDimensionDetails(dimensions: Dimension[]): {
  category: DimensionCategory;
  categoryName: string;
  dimensions: {
    name: string;
    score: number;
    level: string;
    label: string;
    description: string;
  }[];
}[] {
  const categoryNames: Record<DimensionCategory, string> = {
    self: '自我维度',
    emotion: '情感维度',
    social: '社交维度',
    stress: '应对维度',
  };

  const categories: Record<DimensionCategory, Dimension[]> = {
    self: [],
    emotion: [],
    social: [],
    stress: [],
  };

  for (const dim of dimensions) {
    categories[dim.category].push(dim);
  }

  return (['self', 'emotion', 'social', 'stress'] as DimensionCategory[]).map((cat) => ({
    category: cat,
    categoryName: categoryNames[cat],
    dimensions: categories[cat].map((d) => {
      const { level, label } = getLevelLabel(d.score);
      return {
        name: d.name,
        score: d.score,
        level,
        label,
        description: getDimensionDescription(d.id, d.score),
      };
    }),
  }));
}

// 本地存储相关
const STORAGE_KEY = 'personality_quiz_progress';

export function saveProgress(answers: AnswerRecord[], currentIndex: number): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ answers, currentQuestionIndex: currentIndex })
  );
}

export function loadProgress(): { answers: AnswerRecord[]; currentIndex: number } | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      return { answers: data.answers, currentIndex: data.currentQuestionIndex };
    } catch {
      return null;
    }
  }
  return null;
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
