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
    text: '和朋友一起出去吃饭时，你更倾向',
    options: [
      { text: '极力推荐自己看好的餐厅', effects: { leadership: 8, confidence: 10 } },
      { text: '什么都行，朋友选哪家我去哪家', effects: { adaptable: 10, peaceful: 8 } },
      { text: '边走边看，看到合眼缘的直接冲', effects: { spontaneous: 10, adventurous: 8 } },
    ],
  },
  {
    id: 'q2',
    text: '遇到不合理的规定时，你忍不住想要',
    options: [
      { text: '质疑或绕过去', effects: { rebellious: 8, independent: 10 } },
      { text: '偶尔妥协一下也没事', effects: { balanced: 10, pragmatic: 8 } },
      { text: '打破规则', effects: { rebellious: 10, brave: 8 } },
    ],
  },
  {
    id: 'q3',
    text: '白天你被领导或老师骂了一顿，下班时看到ta不在座位上，此时你会在ta座位上',
    options: [
      { text: '塞一张闪电，并祈祷闪电判定生效', effects: { revengeful: 10, playful: 8 } },
      { text: '放一张桃，吃点桃下火', effects: { caring: 10, peaceful: 8 } },
      { text: '贴一张乐不思蜀，祈祷明天见不到ta', effects: { mischievous: 10, cunning: 8 } },
    ],
  },
  {
    id: 'q4',
    text: '你愿意和第一次见面的人一起玩三国杀',
    options: [
      { text: '认同，结交新朋友让我感到新鲜', effects: { extroverted: 10, social: 8 } },
      { text: '有时候，要看心情和情况', effects: { balanced: 10, selective: 8 } },
      { text: '不认同，我只想和熟人一起玩', effects: { introverted: 10, loyal: 8 } },
    ],
  },
  {
    id: 'q5',
    text: '睡梦中，你进入了必须选择一张卡牌才能离开的房间，你就选择以下哪张卡牌',
    options: [
      { text: '铁索连环', effects: { strategic: 10, tactical: 8 } },
      { text: '顺手牵羊', effects: { cunning: 10, opportunistic: 8 } },
      { text: '无懈可击', effects: { defensive: 10, cautious: 8 } },
    ],
  },
  {
    id: 'q6',
    text: '你穿越成为诸葛亮身边的士兵，第六次北伐，在上方谷差点烧死司马懿，突然天降大雨。你在旁边看着，心想：',
    options: [
      { text: '我就知道，这老狐狸命不该绝', effects: { philosophical: 10, resigned: 8 } },
      { text: '丞相的心理阴影面积我得算算', effects: { humorous: 10, empathetic: 8 } },
      { text: '下雨了，赶紧收衣服啊！', effects: { practical: 10, carefree: 8 } },
      { text: '司马懿是不是跟老天爷有亲戚关系？', effects: { witty: 10, rebellious: 8 } },
    ],
  },
  {
    id: 'q7',
    text: '你会站在对方的角度去思考而模糊了自己的立场',
    options: [
      { text: '是的', effects: { empathetic: 10, selfless: 8 } },
      { text: '不是的', effects: { assertive: 10, principled: 8 } },
      { text: '有时候', effects: { balanced: 10, wise: 8 } },
    ],
  },
  {
    id: 'q8',
    text: '面对强大几乎无法战胜的对手，哪种做法更符合你？',
    options: [
      { text: '选择走此小道，扬长避短、节约时间，把精力花在其他更有胜算的事情上不失为一种策略', effects: { strategic: 10, pragmatic: 8 } },
      { text: '选择咬牙坚持，不战斗到最后一刻，怎么知道胜利女神的天平到底倾向哪一边呢？', effects: { persistent: 10, brave: 8 } },
      { text: '选择求助他人，三个臭皮匠顶个诸葛亮，不好意思，我的朋友是谋诸葛亮', effects: { social: 10, collaborative: 8 } },
    ],
  },
  {
    id: 'q9',
    text: '闲暇时，你更喜欢玩三国杀的什么模式',
    options: [
      { text: '斗地主', effects: { competitive: 10, risktaking: 8 } },
      { text: '军八', effects: { social: 10, strategic: 8 } },
      { text: '2v2排位', effects: { teamwork: 10, coordinated: 8 } },
      { text: '国战', effects: { strategic: 10, versatile: 8 } },
      { text: '山河图', effects: { adventurous: 10, explorative: 8 } },
    ],
  },
  {
    id: 'q10',
    text: '如果穿越到三国时期，你更向往以下哪种关系？',
    options: [
      { text: '桃园结义式：真兄弟，你们是不求同年同月同日生，但求同年同月同日死的生死之交', effects: { loyal: 10, passionate: 8 } },
      { text: '煮酒论英雄式：你们惺惺相惜却站在彼此阵营的对立面，最纯恨的那年在战场上相爱相杀', effects: { romantic: 10, passionate: 8 } },
      { text: '宁教我负天下人式：高处不胜寒，绝对的实力与忧郁都是你与生俱来的天赋', effects: { ambitious: 10, independent: 8 } },
    ],
  },
  {
    id: 'q11',
    text: '看到感人的故事或视频，你很容易落泪',
    options: [
      { text: '是的', effects: { emotional: 10, sensitive: 8 } },
      { text: '不是的', effects: { stoic: 10, tough: 8 } },
      { text: '有时候', effects: { balanced: 10, authentic: 8 } },
    ],
  },
  {
    id: 'q12',
    text: '根据你的直觉，选择以下选项',
    options: [
      { text: '司马懿', effects: { patient: 10, cunning: 8 } },
      { text: '曹操', effects: { ambitious: 10, decisive: 8 } },
      { text: '曹丕', effects: { calculating: 10, ambitious: 8 } },
      { text: '怎么可以根据直觉做选择呢', effects: { rational: 10, analytical: 8 } },
    ],
  },
  {
    id: 'q13',
    text: '以下你认为最浪漫的事是？',
    options: [
      { text: '刘备白帝城托孤', effects: { tragic: 10, dramatic: 8 } },
      { text: '关羽千里走单骑', effects: { loyal: 10, heroic: 8 } },
      { text: '姜维一计害三贤', effects: { cunning: 10, tragic: 8 } },
      { text: '周瑜打黄盖', effects: { collaborative: 10, sacrificial: 8 } },
    ],
  },
  {
    id: 'q14',
    text: '你会因为一时冲动而做出一些让自己后悔的事情',
    options: [
      { text: '是的', effects: { impulsive: 10, passionate: 8 } },
      { text: '不是的', effects: { cautious: 10, deliberate: 8 } },
      { text: '有时候', effects: { balanced: 10, spontaneous: 8 } },
    ],
  },
  {
    id: 'q15',
    text: '你丢失了一件很重要的东西，你会？',
    options: [
      { text: '不惜一切代价寻找，直到找到', effects: { persistent: 10, determined: 8 } },
      { text: '相信总有一天它会回到你身边', effects: { optimistic: 10, peaceful: 8 } },
      { text: '伤心一段时间，然后放下', effects: { accepting: 10, resilient: 8 } },
    ],
  },
  {
    id: 'q16',
    text: '你最希望收到的生日礼物是？',
    options: [
      { text: '丈八蛇矛', effects: { aggressive: 10, passionate: 8 } },
      { text: '一顶草帽', effects: { carefree: 10, simple: 8 } },
      { text: '传世玉玺', effects: { ambitious: 10, leadership: 8 } },
      { text: '朱雀羽扇', effects: { strategic: 10, wise: 8 } },
    ],
  },
  {
    id: 'q17',
    text: '一般来说，你更倾向于哪个阵营？',
    options: [
      { text: '吴国', effects: { social: 10, collaborative: 8 } },
      { text: '蜀国', effects: { loyal: 10, passionate: 8 } },
      { text: '魏国', effects: { ambitious: 10, strategic: 8 } },
      { text: '群雄', effects: { independent: 10, rebellious: 8 } },
    ],
  },
  {
    id: 'q18',
    text: '当要做出重要的决定时，你更倾向于怎么做呢？',
    options: [
      { text: '根据实际情况进行自己的考察与衡量', effects: { rational: 10, independent: 8 } },
      { text: '参考好友、师长的建议，考虑他人的感受', effects: { social: 10, empathetic: 8 } },
      { text: '用骰子来做决定吧！', effects: { spontaneous: 10, adventurous: 8 } },
    ],
  },
  {
    id: 'q19',
    text: '不考虑其他情况，弃牌阶段你只能留下一张手牌时，你会留下？',
    options: [
      { text: '无懈可击', effects: { defensive: 10, strategic: 8 } },
      { text: '闪', effects: { cautious: 10, protective: 8 } },
      { text: '桃', effects: { caring: 10, selfless: 8 } },
      { text: '酒', effects: { impulsive: 10, brave: 8 } },
    ],
  },
  {
    id: 'q20',
    text: '不考虑其他情况，对手手牌数量较多的情况下向你打出【决斗】，此时你只有一张【杀】，你会？',
    options: [
      { text: '打出【杀】，博弈就是一场豪赌，万一他没有【杀】了呢', effects: { brave: 10, impulsive: 8 } },
      { text: '不打出【杀】，保留手牌，挨打不是无力还手，而是迷惑对手的策略', effects: { strategic: 10, patient: 8 } },
    ],
  },
];
