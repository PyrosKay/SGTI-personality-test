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
    description: '你是三国杀中最令人闻风丧胆的存在——神曹操。选将阶段你就开始PUA了："兄弟们，有我在稳了。"然后在游戏里你用归心把全场手牌据为己有，美其名曰"帮大家保管"。你的队友还在等你分牌，结果你已经把他们的牌打完了。你深谙人性弱点，善于操控他人情绪，让对手在不知不觉中为你买单。你的一句"领导先摸两张"就能让全场心态崩溃，一句"我这是为了团队"就能让被你收割的队友哑口无言。你不是在玩三国杀，你是在玩心理战。生活中的你也是社交场上的操盘手，朋友聚餐你选餐厅，团建活动你定方案，连群聊话题都由你主导。别人觉得你强势，你只是觉得——你们不听我的，怎么赢？',
    quote: '「要么全场是我的队友，要么全场都是我的工具人。」',
    traits: ['leadership', 'cunning', 'manipulative'],
    image: '/characters/shencaocao.png',
  },
  {
    chineseName: '鲁肃',
    englishName: '送钱者',
    subtitle: 'ATM-er',
    description: '你是三国杀中的"散财童子"鲁肃，乐善好施到让队友心惊肉跳。你的手牌就像流水一样往外送，美其名曰"联姻"，实则是纯纯的ATM体质。别人打三国杀是来赢的，你是来做慈善的。你的缔盟让对面感动到想给你发锦旗，你的好施让你自己的手牌比脸还干净。你是全场最想保护的人，也是全场最容易被集火的人——因为谁都知道，打你等于打两份收益。生活中的你也是朋友圈里的提款机，"我请""没事我来""这点小钱不算什么"是你的口头禅。月底看余额的时候你的表情和被乐不思蜀时一模一样——欲哭无泪但下次还敢。',
    quote: '「能帮就帮，能送就送，反正我死了你们也赢不了。」',
    traits: ['generous', 'caring', 'selfless'],
    image: '/characters/lusu.png',
  },
  {
    chineseName: '祢衡',
    englishName: '西海岸',
    subtitle: 'RAP',
    description: '你是嘴强王者祢衡，一开口就是RAP，让敌人血压飙升。你的毒舌可以让任何人破防，你的嘴可以让整场游戏变成单口相声。你不是在输出伤害，你是在输出精神污染。狂才一开，全场都得听你的freestyle，每个人都被你点名diss一遍，连队友都躲着你走。你的舌剑比手里的杀还疼，毕竟杀只能掉血，你的嘴可以直接让人红温退群。生活中的你也是社交恐怖分子，谁敢跟你吵架谁就等着被降维打击。你不是故意刻薄，你只是觉得这世界需要更多真话——虽然你的真话比别人的人身攻击还狠。',
    quote: '「诸葛村夫！司马老贼！江东鼠辈！」',
    traits: ['rebellious', 'confident', 'playful'],
    image: '/characters/miheng.png',
  },
  {
    chineseName: '刘焉',
    englishName: '梦想家',
    subtitle: 'DREAM-er',
    description: '你是白日梦想家刘焉，立着图v的flag却做着丈八的梦。你的激情可以点燃全场，你的乐观可以感染队友，虽然经常翻车，但你的梦想从未熄灭。选到刘焉的那一刻，你的眼里就已经只有丈八蛇矛了，仿佛下一秒就能七杀超神。然现实往往是：图还没摸到，血已经见底；丈八在手，对面已经闪满了。但你从不气馁，翻车了只是微微一笑："再来一把，这次一定行。"你的人生信条就是赌，大赌大赢，小赌小赢，不赌那才是真输。生活中的你也是永不停歇的梦想家，创业计划写了八版，投资方案换了三轮，虽然目前还在"即将起飞"阶段，但你的眼里永远闪着光——那是丈八蛇矛的光。',
    quote: '「图！给我图！丈八蛇矛直取首级！」',
    traits: ['ambitious', 'passionate', 'dramatic'],
    image: '/characters/liuyan.png',
  },
  {
    chineseName: '司马懿',
    englishName: '我命由我不由天',
    subtitle: '♠2-9',
    description: '你是忍辱负重的司马懿，场上最沉得住气的蹲子。别人急着出牌，你急着屯牌；别人忙着进攻，你忙着挨打。你的鬼才不是说说而已，是真能把对面耗到心态爆炸。你挨最毒的打，存最多的牌，翻最狠的盘。你是养生流大师，能不动就不动，让对手先打，打累了你再收割。你信奉"活着就是胜利"，别人眼里你是怂，你自己知道这叫战略性隐忍。反馈一亮，对面用牌都得掂量掂量；鬼才一出，你的手牌比你的未来还难以预测。生活中的你也是那种表面佛系、内心卷王的存在——看似什么都不争，实际上已经把每一步算好了。别人笑你太躺平，你笑别人看不穿。',
    quote: '「天命？不好意思，我自己就是天命。」',
    traits: ['patient', 'strategic', 'cunning'],
    image: '/characters/simayi.png',
  },
  {
    chineseName: '郭嘉',
    englishName: '深夜文学家',
    subtitle: 'EMO',
    description: '你是emo达人郭嘉，泪流满面却不忘给队友递牌。别人掉血是坏事，你掉血是战术——天妒英才不是白说的，每掉一滴血都是给队友送温暖。你的伤感可以写成诗，你的遗计可以定乾坤。你是天生的悲剧主角，也是最可靠的辅助。你活着的时候是全场最强智囊，你"走"了之后留下的遗产比活着还多——这让队友经常纠结到底该救你还是该让你赶紧"走"。你的人生就是一部文艺片，朋友圈永远是深夜emo文学，配图永远是黑白滤镜。但你骨子里比谁都温柔，嘴上说着"我没事"，手里已经把最好的牌递给了队友。',
    quote: '「主公策马奔逃，嘉早为其备良马...我这是遗计，不是遗言啊！」',
    traits: ['emotional', 'strategic', 'tragic'],
    image: '/characters/guojia.png',
  },
  {
    chineseName: '诸葛亮',
    englishName: '妈沫',
    subtitle: 'MUM',
    description: '你是场上的操心命诸葛亮，所有人的妈沫。你既要观星看牌堆顶，又要空城骗对面杀，既要保核保主公，又要控底防内奸——你的手比千手观音还忙。别人玩三国杀是来爽的，你玩三国杀是来上班的。你的观星不是超能力，是你操碎了心的证明；你的空城不是从容，是你已经弹尽粮绝还要硬撑的倔强。你是全场的总指挥、大管家、安全员，谁的血量你都记着，谁的手牌你都在算。你的队友或许不记得你打了什么牌，但一定记得每次快死的时候，是你挡在了前面。生活中的你也是朋友圈的定海神针，群聊里永远是你提醒这提醒那，出行攻略永远是你做，迷路了大家都看向你——累是真累，但谁让你放不下心呢。',
    quote: '「你们都给我活着，我来断后！」',
    traits: ['caring', 'strategic', 'protective'],
    image: '/characters/zhugeliang.png',
  },
  {
    chineseName: '华佗',
    englishName: '移动泉水',
    subtitle: 'CURE',
    description: '你是神医华佗，场上行走的泉水，队友的续命神器。你的急救让残血队友瞬间满血复活，你的青囊让全场都想去你那里挂号。然而讽刺的是，你经常摸到丈八蛇矛而不是红桃——明明是医生却总想当战士，这种职业错位感就是你的人生缩影。你是所有人的守护神，也是内奸最想先解决的眼中钉，毕竟有你在，他的击杀计划就永远完不成。你一边奶人一边吐槽："我是个医生不是坦克啊！"但下一秒还是默默挡在了队友前面。生活中的你也是那个永远在照顾别人的人，朋友生病你第一个送药，同事加班你第一个点外卖，但谁问你"你还好吗"的时候，你总是笑着说"没事没事"——因为你太习惯治愈别人，忘了自己也需要被治愈。',
    quote: '「伤筋动骨一百天，我给你治！」',
    traits: ['caring', 'generous', 'selfless'],
    image: '/characters/huatuo.png',
  },
  {
    chineseName: '左慈',
    englishName: '尤物',
    subtitle: 'SEXY',
    description: '你是变化多端的左慈，场上化身最多，让对手永远摸不清你的套路。你每一回合都是不同的角色，上一秒是忠臣下一秒就变成了反贼的模样——不是你善变，是你太全能。你是真正的花板子玩家，每一局都是全新的体验，别人需要选对将才能赢，你只需要化身对就行。你的快乐来自于对手的懵逼：他以为你在空城，结果你化身许褚一刀劈过来；他以为你要输出，结果你化身华佗开始奶人。跟你打牌就像拆盲盒，永远不知道下一秒会蹦出什么。生活中的你也是百变怪，今天搞艺术明天做投资，朋友圈的人设一天换三个。别人说你没有定性，你说这叫"多元宇宙版本的自己"——每一个都是真的你，但加在一起谁也看不懂。',
    quote: '「化身？让我想想用哪个身份搞你。」',
    traits: ['spontaneous', 'strategic', 'mischievous'],
    image: '/characters/zuoci.png',
  },
  {
    chineseName: '孙尚香',
    englishName: '剁手者',
    subtitle: 'POOR',
    description: '你是牌差女王孙尚香，装备装到破产，换装换到手软。别人打牌靠脑子，你打牌靠换装——结姻一开，全场看着你把装备栏穿成衣柜，再把牌堆摸成你的私人衣橱。你的名言是"装备不穿留着干嘛"，于是你每回合的装备更换速度比时尚博主还快。你是场上最穷的人，也是输出最高的人；你花最少的钱，打最狠的仗。你的经济管理能力堪比月光族——钱到手就花，装备到手就穿，但谁也不能否认你穿的时候是真好看。生活中的你也是购物狂本狂，双十一预售第一天就开始算满减，收快递的速度比发工资还快。钱包空了？没关系，先把这件买了再说。',
    quote: '「联姻？先让我把装备换了再说！」',
    traits: ['aggressive', 'decisive', 'reckless'],
    image: '/characters/sunshangxiang.png',
  },
  {
    chineseName: 'SP赵云',
    englishName: '孤勇者',
    subtitle: '7in7out',
    description: '你是孤胆英雄SP赵云，怀里揣着七张牌就敢单挑全场的狠人。龙胆一开，杀当闪闪当杀，你的攻防转换比变脸还快。你的眼里没有队友，只有敌人——不是你不配合，是你一个人就够了。你是真正的独狼，也是全场最靓的冲锋战士。别人需要队友掩护、需要牌差计算、需要形势判断，你只需要一件事：冲。七进七出不是传说，是你的日常操作。你的打法就是最朴素的暴力美学——能动手绝不哔哔，能出杀绝不屯牌。生活中的你也是行动派，遇到问题从不犹豫，先干再说。别人还在分析利弊的时候，你已经冲上去把事情解决了。虽然偶尔会冲过头，但至少你从不后悔——因为你根本没时间后悔，下一个挑战已经来了。',
    quote: '「七张牌，够杀七个了，谁赞成？谁反对？」',
    traits: ['brave', 'independent', 'aggressive'],
    image: '/characters/spzhaoyun.png',
  },
  {
    chineseName: '费祎',
    englishName: '极品费车',
    subtitle: 'F1',
    description: '你是稳健派代表费祎，三国杀界的极品费车——能扛能跑，稳如老狗。回合开始回口血，回合结束再回口血，你的血线稳得跟心电图直线一样让人安心。你不是最强的输出，不是最秀的操作，但你一定是最让人放心的存在。你的调稳让队友觉得"有你在就稳了"，你的守成让对手觉得"这人怎么打不死"。别人追求的是一波带走的爽感，你追求的是温水煮青蛙的耐力——最后赢不赢不重要，重要的是你永远是最后一个倒下的。生活中的你也是团队里那个靠谱到无聊的人，从不迟到从不缺席，永远提前十分钟到场。你的朋友们虽然觉得你缺乏激情，但每次出事第一个想到的永远是你。',
    quote: '「来来来，都坐下，咱们慢慢耗。」',
    traits: ['balanced', 'protective', 'patient'],
    image: '/characters/feiyi.png',
  },
  {
    chineseName: '刘禅',
    englishName: '傻乐者',
    subtitle: 'HHHH',
    description: '你是全场最快乐的人刘禅，享乐流代表人物，快乐就是你的武器。别人打牌靠技术，你打牌靠享乐——放权直接让队友多动一回合，自己躺平当甩手掌柜。你的快乐可以感染全场，你的傻笑可以气死内奸。内奸苦心经营了半天局势，你一个享乐直接让局面又稳了，这谁顶得住？你不需要操作，不需要算计，你只需要"嘿嘿嘿"就行了。管你什么身份，反正你有爹就行——主公是你爹，忠臣是你保镖，反贼都不好意思打你因为你太可爱了。生活中的你也是快乐本体，天塌下来当被子盖，火烧眉毛先拍个照。别人焦虑的时候你在笑，别人内耗的时候你在吃——不是你不懂烦恼，是你选择了快乐。毕竟人生苦短，不如享乐。',
    quote: '「嘿嘿嘿，有爹爹在，我怕谁！」',
    traits: ['optimistic', 'carefree', 'trusting'],
    image: '/characters/liushan.png',
  },
  {
    chineseName: '界徐盛',
    englishName: '版本答案',
    subtitle: 'OMG',
    description: '你是版本之子界徐盛，阴间到让对手想挂机的存在。破军一出，对面的手牌直接被你没收，连"等等我还有闪"的机会都不给。你是一刀999的代名词，让所有人闻风丧胆。别人需要算牌差、控距离、等时机，你只需要一件事——砍。你的刀不讲道理，不讲武德，不给你任何反应时间，就像突然被降维打击一样毫无还手之力。你不是在玩游戏，你是在虐菜；你不是在出牌，你是在发布更新公告——"本次更新：砍了你的手牌，谢谢。"生活中的你也是那种降维打击型选手，别人还在犹豫你就已经把事办了，别人还在准备你就已经交卷了。虽然偶尔会被说"太强了没意思"，但谁不想当版本答案呢？',
    quote: '「大宝的刀，砍谁谁死，这还用解释吗？」',
    traits: ['aggressive', 'confident', 'powerful'],
    image: '/characters/jixusheng.png',
  },
  {
    chineseName: '魔张飞',
    englishName: '熹飞回宫',
    subtitle: 'BACK',
    description: '你是魔张飞，三国杀里最不讲道理的存在——因为你根本不需要道理。别人打牌靠算计，你打牌靠吼；别人出杀要考虑收益，你出杀纯粹因为手痒。你的咆哮不是技能，是你灵魂深处的呐喊：杀杀杀杀杀！你每一回合都是全场的焦点，不是因为你多厉害，而是因为你多吵。你不是在玩游戏，你是在释放天性。别人三思而后行，你三杀而后爽。你是那种打到残血还要追着对面砍的疯子，手牌只剩一张杀你也敢冲，因为你信奉一个道理——不出杀的手牌不是手牌，是废纸。生活中的你也是行动派的极致代表，想到什么立刻去做，谁拦你跟谁急。你的字典里没有"犹豫"这个词，因为在你看来，犹豫就意味着败北。',
    quote: '「我从未见过如此厚颜无耻之人——等等，我才是那个最厚颜无耻的！」',
    traits: ['aggressive', 'impulsive', 'brave', 'passionate'],
    image: '/characters/mozhangfei.png',
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
