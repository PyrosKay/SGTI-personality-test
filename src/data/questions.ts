// 题目数据结构
export interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    // 维度得分贡献: { dimensionId: scoreIncrement }
    effects: Record<string, number>;
  }[];
}

export const questions: Question[] = [
  {
    id: 'q1',
    text: '周末独自在家，你最想做什么？',
    options: [
      { text: '安静地看书或看电影', effects: { introversion: 10, creativity: 5 } },
      { text: '约朋友出来聚会', effects: { extroversion: 10, sociability: 5 } },
      { text: '整理房间或处理杂事', effects: { conscientiousness: 10, practicality: 5 } },
      { text: '突发奇想做些有趣的事', effects: { openness: 10, spontaneity: 5 } },
    ],
  },
  {
    id: 'q2',
    text: '面对工作中的突发问题，你的第一反应是？',
    options: [
      { text: '冷静分析，制定解决方案', effects: { rationality: 10, analytical: 5 } },
      { text: '先询问他人的意见', effects: { collaboration: 10, empathy: 5 } },
      { text: '凭直觉快速处理', effects: { intuition: 10, decisiveness: 5 } },
      { text: '先焦虑一下再想办法', effects: { sensitivity: 10, emotionalDepth: 5 } },
    ],
  },
  {
    id: 'q3',
    text: '你更喜欢什么样的朋友？',
    options: [
      { text: '逻辑清晰、理性讨论的伙伴', effects: { rationality: 8, analytical: 8 } },
      { text: '能倾听我、支持我的朋友', effects: { empathy: 10, emotionalDepth: 5 } },
      { text: '充满活力、带我去冒险的人', effects: { spontaneity: 8, openness: 8 } },
      { text: '稳定可靠、默默陪伴的类型', effects: { loyalty: 10, conscientiousness: 5 } },
    ],
  },
  {
    id: 'q4',
    text: '当别人批评你时，你通常会？',
    options: [
      { text: '认真反思是否说得对', effects: { rationality: 5, selfReflection: 10 } },
      { text: '感到受伤，需要时间消化', effects: { sensitivity: 10, emotionalDepth: 5 } },
      { text: '不在意，左耳进右耳出', effects: { resilience: 10, optimism: 8 } },
      { text: '立刻反驳，维护自己', effects: { assertiveness: 10, confidence: 8 } },
    ],
  },
  {
    id: 'q5',
    text: '你更倾向于哪种生活方式？',
    options: [
      { text: '按计划行事，有条不紊', effects: { conscientiousness: 10, practicality: 5 } },
      { text: '随性而为，享受当下', effects: { spontaneity: 10, openness: 5 } },
      { text: '追求刺激，不断尝试新事物', effects: { openness: 10, riskTaking: 8 } },
      { text: '安稳平静，注重内心感受', effects: { introversion: 8, emotionalDepth: 8 } },
    ],
  },
  {
    id: 'q6',
    text: '在团队项目中，你更愿意扮演什么角色？',
    options: [
      { text: '领导者，统筹全局', effects: { leadership: 10, assertiveness: 8 } },
      { text: '执行者，完成分配任务', effects: { conscientiousness: 10, reliability: 5 } },
      { text: '创意者，提供新想法', effects: { creativity: 10, openness: 8 } },
      { text: '协调者，促进团队沟通', effects: { empathy: 10, collaboration: 8 } },
    ],
  },
  {
    id: 'q7',
    text: '你做决定时主要依靠？',
    options: [
      { text: '逻辑分析和利弊权衡', effects: { rationality: 10, analytical: 8 } },
      { text: '内心的感受和价值观', effects: { emotionalDepth: 10, empathy: 5 } },
      { text: '直觉和第六感', effects: { intuition: 10, openness: 5 } },
      { text: '他人的建议和经验', effects: { collaboration: 10, humility: 5 } },
    ],
  },
  {
    id: 'q8',
    text: '你更喜欢什么样的工作环境？',
    options: [
      { text: '安静独立，能深度思考', effects: { introversion: 10, focus: 8 } },
      { text: '开放活跃，有很多交流机会', effects: { extroversion: 10, sociability: 8 } },
      { text: '有明确规则和流程', effects: { conscientiousness: 10, stability: 5 } },
      { text: '灵活自由，没有太多限制', effects: { openness: 10, autonomy: 8 } },
    ],
  },
  {
    id: 'q9',
    text: '当遇到困难时，你首先会？',
    options: [
      { text: '自己想办法解决', effects: { independence: 10, problemSolving: 8 } },
      { text: '向信任的人寻求帮助', effects: { collaboration: 10, socialBond: 8 } },
      { text: '暂时逃避，等待时机', effects: { caution: 10, adaptability: 5 } },
      { text: '积极面对，寻找资源', effects: { resilience: 10, optimism: 8 } },
    ],
  },
  {
    id: 'q10',
    text: '你理想中的完美一天是什么样的？',
    options: [
      { text: '高效完成多项任务，成就感满满', effects: { conscientiousness: 8, productivity: 10 } },
      { text: '和喜欢的人在一起，温馨美好', effects: { empathy: 8, socialBond: 10 } },
      { text: '独自探索未知，收获新体验', effects: { openness: 10, adventure: 8 } },
      { text: '放空发呆，享受悠闲时光', effects: { introversion: 8, mindfulness: 10 } },
    ],
  },
  {
    id: 'q11',
    text: '面对未来，你更多的心态是？',
    options: [
      { text: '充满期待，相信会更好', effects: { optimism: 10, openness: 8 } },
      { text: '有些担忧，做好准备应对', effects: { caution: 10, preparedness: 8 } },
      { text: '顺其自然，兵来将挡', effects: { adaptability: 10, resilience: 5 } },
      { text: '期待与焦虑并存', effects: { emotionalDepth: 10, sensitivity: 8 } },
    ],
  },
  {
    id: 'q12',
    text: '你更看重自己的什么品质？',
    options: [
      { text: '聪明和能力强', effects: { intelligence: 10, ambition: 8 } },
      { text: '善良和真诚', effects: { empathy: 10, authenticity: 8 } },
      { text: '勇敢和果断', effects: { courage: 10, assertiveness: 8 } },
      { text: '稳重和可靠', effects: { reliability: 10, loyalty: 8 } },
    ],
  },
  {
    id: 'q13',
    text: '当你独自一人时，你通常在思考什么？',
    options: [
      { text: '解决工作中的问题', effects: { analytical: 10, productivity: 5 } },
      { text: '人际关系和情感问题', effects: { emotionalDepth: 10, empathy: 5 } },
      { text: '人生意义和宇宙哲学', effects: { openness: 10, introspection: 8 } },
      { text: '实际的生活安排', effects: { practicality: 10, conscientiousness: 5 } },
    ],
  },
  {
    id: 'q14',
    text: '你更倾向于怎样表达自己？',
    options: [
      { text: '用文字清晰地表达观点', effects: { rationality: 8, introspection: 8 } },
      { text: '用行动展示自己的能力', effects: { assertiveness: 8, independence: 8 } },
      { text: '通过情感与他人连接', effects: { empathy: 10, emotionalDepth: 5 } },
      { text: '用创意和艺术形式表达', effects: { creativity: 10, openness: 8 } },
    ],
  },
  {
    id: 'q15',
    text: '在争吵中，你通常是什么角色？',
    options: [
      { text: '冷静分析，试图讲道理', effects: { rationality: 10, analytical: 5 } },
      { text: '沉默回避，不愿冲突', effects: { introversion: 8, conflictAversion: 10 } },
      { text: '情绪激动，据理力争', effects: { assertiveness: 8, emotionalDepth: 8 } },
      { text: '试图调解，缓和气氛', effects: { empathy: 10, collaboration: 5 } },
    ],
  },
  {
    id: 'q16',
    text: '你更喜欢哪种娱乐方式？',
    options: [
      { text: '阅读、学习新知识', effects: { intelligence: 10, introversion: 5 } },
      { text: '和朋友一起玩游戏', effects: { sociability: 10, collaboration: 5 } },
      { text: '看剧、刷视频放松', effects: { creativity: 5, openness: 8 } },
      { text: '运动、户外活动', effects: { energy: 10, openness: 5 } },
    ],
  },
  {
    id: 'q17',
    text: '你对规则和权威的态度是？',
    options: [
      { text: '尊重并遵守', effects: { conscientiousness: 10, stability: 5 } },
      { text: '质疑并寻求更好方案', effects: { openness: 10, independence: 8 } },
      { text: '看情况，合理的会遵守', effects: { adaptability: 10, rationality: 5 } },
      { text: '不喜欢被约束', effects: { autonomy: 10, spontaneity: 8 } },
    ],
  },
  {
    id: 'q18',
    text: '当取得成功时，你通常会？',
    options: [
      { text: '保持低调，继续努力', effects: { humility: 10, conscientiousness: 5 } },
      { text: '和身边的人分享喜悦', effects: { socialBond: 10, empathy: 5 } },
      { text: '犒劳自己，享受成果', effects: { selfReward: 10, spontaneity: 5 } },
      { text: '思考下一步目标', effects: { ambition: 10, analytical: 5 } },
    ],
  },
  {
    id: 'q19',
    text: '你觉得自己最大的优点是？',
    options: [
      { text: '思维敏捷，学习能力强', effects: { intelligence: 10, adaptability: 5 } },
      { text: '善于理解他人，有同理心', effects: { empathy: 10, emotionalDepth: 5 } },
      { text: '执行力强，敢想敢做', effects: { assertiveness: 10, independence: 5 } },
      { text: '耐心细致，值得信赖', effects: { reliability: 10, loyalty: 5 } },
    ],
  },
  {
    id: 'q20',
    text: '你如何看待"孤独"？',
    options: [
      { text: '享受独处，是充电的时刻', effects: { introversion: 10, selfReflection: 8 } },
      { text: '偶尔需要，但久了会寂寞', effects: { socialBond: 8, balance: 8 } },
      { text: '有时是灵感和创意的来源', effects: { creativity: 10, introspection: 8 } },
      { text: '尽量避免，享受热闹', effects: { extroversion: 10, sociability: 5 } },
    ],
  },
];
