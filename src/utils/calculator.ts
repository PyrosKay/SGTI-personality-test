import { Dimension, DimensionCategory, PersonalityResult, AnswerRecord } from '../data/types';
import { questions } from '../data/questions';

// 所有维度及其描述
interface DimensionMeta {
  name: string;
  category: DimensionCategory;
}

export const dimensionMeta: Record<string, DimensionMeta> = {
  // 自我维度
  leadership: { name: '领导力', category: 'self' },
  confidence: { name: '自信', category: 'self' },
  rebellious: { name: '反叛精神', category: 'self' },
  independent: { name: '独立性', category: 'self' },
  philosophical: { name: '哲学思维', category: 'self' },
  humorous: { name: '幽默感', category: 'self' },
  rational: { name: '理性思维', category: 'self' },
  analytical: { name: '分析能力', category: 'self' },
  strategic: { name: '战略思维', category: 'self' },
  persistent: { name: '坚持不懈', category: 'self' },
  competitive: { name: '竞争意识', category: 'self' },
  ambitious: { name: '雄心壮志', category: 'self' },
  
  // 情感维度
  empathetic: { name: '共情能力', category: 'emotion' },
  peaceful: { name: '平和心态', category: 'emotion' },
  emotional: { name: '情感丰富', category: 'emotion' },
  sensitive: { name: '敏感细腻', category: 'emotion' },
  passionate: { name: '热情似火', category: 'emotion' },
  dramatic: { name: '戏剧性', category: 'emotion' },
  authentic: { name: '真实自我', category: 'emotion' },
  resilient: { name: '心理韧性', category: 'emotion' },
  stoic: { name: '坚韧克制', category: 'emotion' },
  tragic: { name: '悲剧色彩', category: 'emotion' },
  romantic: { name: '浪漫主义', category: 'emotion' },
  tough: { name: '坚强硬朗', category: 'emotion' },
  
  // 社交维度
  social: { name: '社交能力', category: 'social' },
  extroverted: { name: '外向性格', category: 'social' },
  introverted: { name: '内向性格', category: 'social' },
  loyal: { name: '忠诚可靠', category: 'social' },
  collaborative: { name: '协作精神', category: 'social' },
  heroic: { name: '英雄气概', category: 'social' },
  playful: { name: '玩世不恭', category: 'social' },
  mischievous: { name: '调皮捣蛋', category: 'social' },
  caring: { name: '关心他人', category: 'social' },
  selective: { name: '选择性社交', category: 'social' },
  teamwork: { name: '团队意识', category: 'social' },
  coordinated: { name: '协调能力', category: 'social' },
  
  // 应对维度
  spontaneous: { name: '随性而为', category: 'stress' },
  adventurous: { name: '冒险精神', category: 'stress' },
  balanced: { name: '平衡之道', category: 'stress' },
  pragmatic: { name: '务实主义', category: 'stress' },
  brave: { name: '勇敢无畏', category: 'stress' },
  tactical: { name: '战术灵活', category: 'stress' },
  defensive: { name: '防守意识', category: 'stress' },
  cautious: { name: '谨慎小心', category: 'stress' },
  optimistic: { name: '乐观心态', category: 'stress' },
  accepting: { name: '接受放下', category: 'stress' },
  cunning: { name: '狡黠机敏', category: 'stress' },
  opportunistic: { name: '抓住机会', category: 'stress' },
  witty: { name: '机智俏皮', category: 'stress' },
  decisive: { name: '果断决策', category: 'stress' },
  impulsive: { name: '冲动行事', category: 'stress' },
  deliberate: { name: '深思熟虑', category: 'stress' },
  determined: { name: '决心坚定', category: 'stress' },
  principled: { name: '有原则', category: 'stress' },
  wise: { name: '睿智通透', category: 'stress' },
  carefree: { name: '无忧无虑', category: 'stress' },
  practical: { name: '务实实际', category: 'stress' },
  resigned: { name: '顺其自然', category: 'stress' },
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
    leadership: {
      '偏低': '你更倾向于跟随而非领导',
      '中等偏低': '你有领导潜质但更愿保持低调',
      '适中': '你能在需要时承担领导角色',
      '中等偏高': '你有较强的领导能力和号召力',
      '偏高': '你天生具有领导气质，善于指挥和决策',
    },
    empathetic: {
      '偏低': '你更注重事实和逻辑',
      '中等偏低': '你能理解他人但保持理性',
      '适中': '你有较好的共情能力',
      '中等偏高': '你很能理解他人的感受',
      '偏高': '你极易感受他人情绪，是天生的倾听者',
    },
    social: {
      '偏低': '你更喜欢独处或小圈子社交',
      '中等偏低': '你有选择性社交的需求',
      '适中': '你社交适度，享受与人交往',
      '中等偏高': '你喜欢结交新朋友',
      '偏高': '你是社交达人，人缘极好',
    },
    spontaneous: {
      '偏低': '你更喜欢有计划的生活',
      '中等偏低': '你会偶尔放松但保持克制',
      '适中': '你能平衡计划与随性',
      '中等偏高': '你享受即兴带来的惊喜',
      '偏高': '你完全随心所欲，生活充满惊喜',
    },
    ambitious: {
      '偏低': '你更注重当下的幸福',
      '中等偏低': '你有目标但不会强求',
      '适中': '你有适度的进取心',
      '中等偏高': '你追求成功和成就',
      '偏高': '你野心勃勃，追求卓越',
    },
    emotional: {
      '偏低': '你情绪稳定，不易被触动',
      '中等偏低': '你情绪波动较小',
      '适中': '你情感丰富但可控',
      '中等偏高': '你容易被感动',
      '偏高': '你情感充沛，是性情中人',
    },
    strategic: {
      '偏低': '你更注重眼前而非长远',
      '中等偏低': '你会考虑策略但更凭直觉',
      '适中': '你有不错的策略思维',
      '中等偏高': '你善于规划和布局',
      '偏高': '你是战略大师，深谋远虑',
    },
    loyal: {
      '偏低': '你更注重个人利益',
      '中等偏低': '你会权衡利弊再决定忠诚',
      '适中': '你对朋友有适度的忠诚',
      '中等偏高': '你非常重视承诺和友谊',
      '偏高': '你为朋友两肋插刀，是最可靠的后盾',
    },
    rebellious: {
      '偏低': '你更遵守规则',
      '中等偏低': '你会质疑但不一定行动',
      '适中': '你有适度的反叛精神',
      '中等偏高': '你不甘平庸，追求自由',
      '偏高': '你是规则的挑战者，天生的叛逆者',
    },
    brave: {
      '偏低': '你更倾向于谨慎行事',
      '中等偏低': '你会谨慎评估风险',
      '适中': '你能在关键时刻勇敢',
      '中等偏高': '你有较强的勇气',
      '偏高': '你无所畏惧，是真正的勇者',
    },
  };

  return descriptions[id]?.[label] || `${meta.name}${label}`;
}

// 14种人格类型定义
interface PersonalityTypeDefinition {
  chineseName: string;
  englishName: string;
  subtitle: string;
  description: string;
  quote: string;
  traits: string[]; // 关联的特征
  image?: string; // 配图路径
}

const personalityTypes: PersonalityTypeDefinition[] = [
  {
    chineseName: '神曹操',
    englishName: 'PUA大师',
    subtitle: 'PUA-R',
    description: '你是三国杀中最令人闻风丧胆的存在——神曹操。你深谙人性弱点，善于操控他人情绪，让对手在不知不觉中为你买单。你的一句"领导 先摸两张"就能让全场心态崩溃。你不是在玩三国杀，你是在玩心理战。',
    quote: '「要么全场是我的队友，要么全场都是我的工具人。」',
    traits: ['leadership', 'cunning', 'manipulative'],
    image: '/characters/shencaocao.png',
  },
  {
    chineseName: '鲁肃',
    englishName: '送钱者',
    subtitle: 'ATM-er',
    description: '你是三国杀中的"散财童子"鲁肃，乐善好施到让队友心惊肉跳。你的手牌就像流水一样往外送，美其名曰"联姻"，实则是纯纯的ATM体质。你是全场最想保护的人，也是全场最容易被集火的人。',
    quote: '「能帮就帮，能送就送，反正我死了你们也赢不了。」',
    traits: ['generous', 'caring', 'selfless'],
  },
  {
    chineseName: '祢衡',
    englishName: '西海岸',
    subtitle: 'RAP',
    description: '你是嘴强王者祢衡，一开口就是RAP，让敌人血压飙升。你的毒舌可以让任何人破防，你的嘴可以让整场游戏变成单口相声。你不是在输出伤害，你是在输出精神污染。',
    quote: '「诸葛村夫！司马老贼！江东鼠辈！」',
    traits: ['rebellious', 'confident', 'playful'],
  },
  {
    chineseName: '刘焉',
    englishName: '梦想家',
    subtitle: 'DREAM-er',
    description: '你是白日梦想家刘焉，立着图v的flag却做着丈八的梦。你的激情可以点燃全场，你的乐观可以感染队友，虽然经常翻车，但你的梦想从未熄灭。',
    quote: '「图！给我图！丈八蛇矛直取首级！」',
    traits: ['ambitious', 'passionate', 'dramatic'],
    image: '/characters/liuyan.png',
  },
  {
    chineseName: '司马懿',
    englishName: '我命由我不由天',
    subtitle: '♠2-9',
    description: '你是忍辱负重的司马懿，擅长"死诸葛吓退活仲达"的戏码。你是场上的养生大师，能不动就不动，让对手先打。你是场上最靓的蹲子，也是最后的赢家。',
    quote: '「天命？不好意思，我自己就是天命。」',
    traits: ['patient', 'strategic', 'cunning'],
    image: '/characters/simayi.jpeg',
  },
  {
    chineseName: '郭嘉',
    englishName: '深夜文学家',
    subtitle: 'EMO',
    description: '你是emo达人郭嘉，泪流满面却不忘给队友递牌。你的伤感可以写成诗，你的遗计可以定乾坤。你是天生的悲剧主角，也是最可靠的辅助。',
    quote: '「主公策马奔逃，嘉早为其备良马...我这是遗计，不是遗言啊！」',
    traits: ['emotional', 'strategic', 'tragic'],
  },
  {
    chineseName: '诸葛亮',
    englishName: '妈沫',
    subtitle: 'MUM',
    description: '你是场上的操心命诸葛亮，既要观星又要空城，既要保核又要控底。你是天生的操心的妈沫，所有人的安全都是你的责任。',
    quote: '「你们都给我活着，我来断后！」',
    traits: ['caring', 'strategic', 'protective'],
    image: '/characters/zhugeliang.png',
  },
  {
    chineseName: '华佗',
    englishName: '移动泉水',
    subtitle: 'CURE',
    description: '你是神医华佗，场上行走的泉水，但是经常摸到丈八。你是所有人的守护神，也是最容易成为内奸针对的对象。你的存在就是让队友多一条命。',
    quote: '「伤筋动骨一百天，我给你治！」',
    traits: ['caring', 'generous', 'selfless'],
  },
  {
    chineseName: '左慈',
    englishName: '尤物',
    subtitle: 'SEXY',
    description: '你是变化多端的左慈，场上化身最多，让对手摸不清你的身份。你是真正的花板子，每一局都是全新的体验。你的快乐来自于对手的懵逼。',
    quote: '「化身？让我想想用哪个身份搞你。」',
    traits: ['spontaneous', 'strategic', 'mischievous'],
  },
  {
    chineseName: '孙尚香',
    englishName: '剁手者',
    subtitle: 'POOR',
    description: '你是牌差女王孙尚香，装备装到破产，牌堆摸到破产。你是场上最穷的人，也是输出最高的人。你的名言是：装备不穿，留着干嘛？',
    quote: '「联姻？先让我把装备换了再说！」',
    traits: ['aggressive', 'decisive', 'reckless'],
  },
  {
    chineseName: 'SP赵云',
    englishName: '孤勇者',
    subtitle: '7in7out',
    description: '你是孤胆英雄SP赵云，怀里揣着七张牌就敢单挑全场。你的眼里没有队友，只有敌人。你是真正的独狼，也是全场最靓的冲锋战士。',
    quote: '「七张牌，够杀七个了，谁赞成？谁反对？」',
    traits: ['brave', 'independent', 'aggressive'],
  },
  {
    chineseName: '费祎',
    englishName: '保核专家',
    subtitle: 'F1',
    description: '你是稳健派代表费祎，回合开始回口血，回合结束再回口血。你不是最强的，但你一定是最稳的。你的存在就是让主公安心。',
    quote: '「来来来，都坐下，咱们慢慢耗。」',
    traits: ['balanced', 'protective', 'patient'],
    image: '/characters/feiyi.png',
  },
  {
    chineseName: '刘禅',
    englishName: '傻乐者',
    subtitle: 'HHHH',
    description: '你是全场最快乐的人刘禅，享乐流代表人物。管你什么身份，反正你有爹就行。你的快乐可以感染全场，你的傻笑可以气死内奸。',
    quote: '「嘿嘿嘿，有爹爹在，我怕谁！」',
    traits: ['optimistic', 'carefree', 'trusting'],
  },
  {
    chineseName: '界徐盛',
    englishName: '版本答案',
    subtitle: 'OMG',
    description: '你是版本之子界徐盛，阴间到让对手想挂机。你是一刀999的代名词，让所有人闻风丧胆。你不是在玩游戏，你是在虐菜。',
    quote: '「大宝的刀，砍谁谁死，这还用解释吗？」',
    traits: ['aggressive', 'confident', 'powerful'],
    image: '/characters/jixusheng.png',
  },
];

// 生成人格结果
export function generatePersonalityResult(dimensions: Dimension[]): PersonalityResult {
  // 计算各特征的平均得分
  const dimensionScores: Record<string, number> = {};
  for (const dim of dimensions) {
    dimensionScores[dim.id] = dim.score;
  }

  // 根据特征计算每个人格的匹配度
  let bestMatch = personalityTypes[0];
  let highestScore = -1;

  for (const personType of personalityTypes) {
    let matchScore = 0;
    let matchCount = 0;

    for (const trait of personType.traits) {
      if (dimensionScores[trait] !== undefined) {
        // 计算该特征得分与理想值的匹配度
        // 人格特征理想值在60-80之间
        const ideal = 70;
        const diff = Math.abs(dimensionScores[trait] - ideal);
        matchScore += (100 - diff);
        matchCount++;
      }
    }

    if (matchCount > 0) {
      const avgScore = matchScore / matchCount;
      // 添加一些随机性让结果更有趣
      const randomFactor = Math.random() * 10;
      if (avgScore + randomFactor > highestScore) {
        highestScore = avgScore + randomFactor;
        bestMatch = personType;
      }
    }
  }

  return {
    type: bestMatch.chineseName,
    title: bestMatch.chineseName,
    subtitle: bestMatch.subtitle,
    description: bestMatch.description,
    quote: bestMatch.quote,
    image: bestMatch.image,
    dimensions,
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
