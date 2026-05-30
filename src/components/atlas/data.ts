// 数据层 — 八卦、六十四卦全文、各家经典、星图节点(家)、作品注册、词条、东西对照、八卦属性。
// 爻一律「自上而下」存储（index 0 = 上爻）：1 = 阳爻(实)，0 = 阴爻(断)。
import { HEX_REST } from './hex-rest';
import { HEX_GLOSS } from './hex-gloss';
import { HEX_YILI } from './hex-yili';

export type TrigramKey = 'qian' | 'dui' | 'li' | 'zhen' | 'xun' | 'kan' | 'gen' | 'kun';
export type Line = 0 | 1;

export interface Trigram {
  key: TrigramKey;
  glyph: string;
  name: string;
  nature: string;
  lines: [Line, Line, Line];
}

export const TRIGRAMS: Record<TrigramKey, Trigram> = {
  qian: { key: 'qian', glyph: '☰', name: '乾', nature: '天', lines: [1, 1, 1] },
  dui: { key: 'dui', glyph: '☱', name: '兑', nature: '泽', lines: [0, 1, 1] },
  li: { key: 'li', glyph: '☲', name: '离', nature: '火', lines: [1, 0, 1] },
  zhen: { key: 'zhen', glyph: '☳', name: '震', nature: '雷', lines: [0, 0, 1] },
  xun: { key: 'xun', glyph: '☴', name: '巽', nature: '风', lines: [1, 1, 0] },
  kan: { key: 'kan', glyph: '☵', name: '坎', nature: '水', lines: [0, 1, 0] },
  gen: { key: 'gen', glyph: '☶', name: '艮', nature: '山', lines: [1, 0, 0] },
  kun: { key: 'kun', glyph: '☷', name: '坤', nature: '地', lines: [0, 0, 0] },
};

export const TRIGRAM_ORDER: TrigramKey[] = ['qian', 'dui', 'li', 'zhen', 'xun', 'kan', 'gen', 'kun'];

// —— 链接规格（行内关联 / 跳转）——
export interface LinkSpec {
  kind: 'node' | 'hex' | 'cube' | 'square' | 'matrix' | 'school' | 'west';
  id?: string;
  upper?: TrigramKey;
  lower?: TrigramKey;
  label: string;
  onClick?: () => void;
}
export interface Clause { text: string; gloss: string; link?: LinkSpec; }
export interface Chapter { name: string; clauses: Clause[] | null; }
export interface YaoLine { pos: string; text: string; gloss?: string; xiang?: string; xiangGloss?: string; }

export interface FullHex {
  id?: string; name: string; full: string; symbol: string; num: number;
  upper: TrigramKey; lower: TrigramKey;
  gua: string; guaGloss: string; tuan: string; xiang: string; tuanGloss?: string; xiangGloss?: string;
  yaos: YaoLine[]; yongjiu?: YaoLine; yongliu?: YaoLine; lines?: number[];
}

// ── 易经 · 乾卦 ──
export const QIAN: FullHex = {
  id: 'yi', name: '乾', full: '乾为天', symbol: '䷀', num: 1, upper: 'qian', lower: 'qian',
  gua: '乾：元、亨、利、贞。', guaGloss: '乾卦：大通而至正，于占问大为有利。',
  tuan: '大哉乾元，万物资始，乃统天。', xiang: '天行健，君子以自强不息。',
  yaos: [
    { pos: '上九', text: '亢龙有悔。', gloss: '龙飞过高，必有悔恨——居高当思危，盈满不可久。', xiang: '象曰：盈不可久也。' },
    { pos: '九五', text: '飞龙在天，利见大人。', gloss: '龙翔于天，德位相配、大有作为之时，宜见贤者。', xiang: '象曰：大人造也。' },
    { pos: '九四', text: '或跃在渊，无咎。', gloss: '或腾跃、或退渊，审时进退，无所咎害。', xiang: '象曰：进无咎也。' },
    { pos: '九三', text: '君子终日乾乾，夕惕若厉，无咎。', gloss: '终日勤勉自强，入夜仍戒惧反省，虽处危地而无咎。', xiang: '象曰：反复道也。' },
    { pos: '九二', text: '见龙在田，利见大人。', gloss: '龙现于田，才德初显之时，宜见贤者以成其用。', xiang: '象曰：德施普也。' },
    { pos: '初九', text: '潜龙勿用。', gloss: '龙潜于渊，时机未至，宜藏锋蓄势、不可妄动。', xiang: '象曰：阳在下也。' },
  ],
  yongjiu: { pos: '用九', text: '见群龙无首，吉。' },
};

// ── 易经 · 坤卦 ──
export const KUN: FullHex = {
  id: 'kun', name: '坤', full: '坤为地', symbol: '䷁', num: 2, upper: 'kun', lower: 'kun',
  gua: '坤：元，亨，利牝马之贞。君子有攸往，先迷后得主，利。', guaGloss: '坤卦：大亨通，利于像母马那样柔顺而坚贞。',
  tuan: '至哉坤元，万物资生，乃顺承天。', xiang: '地势坤，君子以厚德载物。',
  yaos: [
    { pos: '上六', text: '龙战于野，其血玄黄。', gloss: '阴盛与阳相争，两败俱伤——极盛则险。', xiang: '象曰：其道穷也。' },
    { pos: '六五', text: '黄裳，元吉。', gloss: '黄为中色、裳为下饰，守中居下而大吉。', xiang: '象曰：文在中也。' },
    { pos: '六四', text: '括囊，无咎无誉。', gloss: '束口如布囊，谨慎藏锋，无咎也无誉。', xiang: '象曰：慎不害也。' },
    { pos: '六三', text: '含章可贞，或从王事，无成有终。', gloss: '含藏才华而守正，辅事不居功，终有好结果。', xiang: '象曰：以时发也。' },
    { pos: '六二', text: '直、方、大，不习无不利。', gloss: '正直、方正、宏大，不必刻意而无往不利。', xiang: '象曰：地道光也。' },
    { pos: '初六', text: '履霜，坚冰至。', gloss: '脚踏薄霜，便知坚冰将至——见微知著。', xiang: '象曰：阴始凝也。' },
  ],
  yongliu: { pos: '用六', text: '利永贞。' },
};

// ── 易经 · 泰 / 否 / 既济 / 未济 ──
export const TAI: FullHex = {
  name: '泰', full: '地天泰', symbol: '䷊', num: 11, upper: 'kun', lower: 'qian',
  gua: '泰：小往大来，吉亨。', guaGloss: '泰卦：阴退阳进、天地交感，吉而亨通。',
  tuan: '天地交而万物通也，上下交而其志同也。', xiang: '天地交，泰；后以财成天地之道，辅相天地之宜，以左右民。',
  yaos: [
    { pos: '上六', text: '城复于隍，勿用师，自邑告命，贞吝。', gloss: '城墙倾塌入沟，泰极将否，不宜兴兵，守正以防憾。', xiang: '象曰：其命乱也。' },
    { pos: '六五', text: '帝乙归妹，以祉元吉。', gloss: '帝乙嫁妹，谦尊下交，得福而大吉。', xiang: '象曰：中以行愿也。' },
    { pos: '六四', text: '翩翩，不富以其邻，不戒以孚。', gloss: '联翩而下，虚己亲邻，以诚相待不需戒备。', xiang: '象曰：皆失实也。' },
    { pos: '九三', text: '无平不陂，无往不复，艰贞无咎。', gloss: '无平不斜、无往不返——守正处艰则无咎。', xiang: '象曰：天地际也。' },
    { pos: '九二', text: '包荒，用冯河，不遐遗，朋亡，得尚于中行。', gloss: '包容荒秽、刚毅涉险，不遗远、不偏党，合于中道。', xiang: '象曰：以光大也。' },
    { pos: '初九', text: '拔茅茹，以其汇，征吉。', gloss: '拔茅连根、同类相从，奋进则吉。', xiang: '象曰：志在外也。' },
  ],
};
export const PI: FullHex = {
  name: '否', full: '天地否', symbol: '䷋', num: 12, upper: 'qian', lower: 'kun',
  gua: '否之匪人，不利君子贞，大往小来。', guaGloss: '否卦：天地不交、闭塞之时，不利君子守常。',
  tuan: '天地不交而万物不通也，上下不交而天下无邦也。', xiang: '天地不交，否；君子以俭德辟难，不可荣以禄。',
  yaos: [
    { pos: '上九', text: '倾否，先否后喜。', gloss: '倾覆闭塞、否极泰来，先困后喜。', xiang: '象曰：否终则倾，何可长也。' },
    { pos: '九五', text: '休否，大人吉。其亡其亡，系于苞桑。', gloss: '止息闭塞，大人吉；常存戒惧，方如系于丛桑般稳固。', xiang: '象曰：位正当也。' },
    { pos: '九四', text: '有命无咎，畴离祉。', gloss: '奉命而行则无咎，众人同获其福。', xiang: '象曰：志行也。' },
    { pos: '六三', text: '包羞。', gloss: '心怀羞惭，处否而知耻。', xiang: '象曰：位不当也。' },
    { pos: '六二', text: '包承，小人吉，大人否，亨。', gloss: '承顺含容，小人得吉；大人守否不苟，终亨。', xiang: '象曰：不乱群也。' },
    { pos: '初六', text: '拔茅茹，以其汇，贞吉亨。', gloss: '拔茅连根、同类相聚，守正则吉亨。', xiang: '象曰：志在君也。' },
  ],
};
export const JIJI: FullHex = {
  name: '既济', full: '水火既济', symbol: '䷾', num: 63, upper: 'kan', lower: 'li',
  gua: '既济：亨小，利贞，初吉终乱。', guaGloss: '既济卦：事已成、小有亨通，利于守正；初吉而终须防乱。',
  tuan: '既济亨，小者亨也；利贞，刚柔正而位当也。', xiang: '水在火上，既济；君子以思患而豫防之。',
  yaos: [
    { pos: '上六', text: '濡其首，厉。', gloss: '渡水濡湿头顶，成极将危。', xiang: '象曰：何可久也。' },
    { pos: '九五', text: '东邻杀牛，不如西邻之禴祭，实受其福。', gloss: '丰祭不如诚祭，质胜于文者真受福。', xiang: '象曰：吉大来也。' },
    { pos: '六四', text: '繻有衣袽，终日戒。', gloss: '盛装而备破絮塞漏，终日戒惧不懈。', xiang: '象曰：有所疑也。' },
    { pos: '九三', text: '高宗伐鬼方，三年克之，小人勿用。', gloss: '高宗征鬼方三年方克，成事艰难，不可用小人。', xiang: '象曰：惫也。' },
    { pos: '六二', text: '妇丧其茀，勿逐，七日得。', gloss: '妇人失车帘，不必追，七日自得——顺时则复。', xiang: '象曰：以中道也。' },
    { pos: '初九', text: '曳其轮，濡其尾，无咎。', gloss: '拽住车轮、沾湿尾巴，谨慎缓进则无咎。', xiang: '象曰：义无咎也。' },
  ],
};
export const WEIJI: FullHex = {
  name: '未济', full: '火水未济', symbol: '䷿', num: 64, upper: 'li', lower: 'kan',
  gua: '未济：亨，小狐汔济，濡其尾，无攸利。', guaGloss: '未济卦：终能亨通；如小狐将渡而濡尾，未竟之时不可冒进。',
  tuan: '未济亨，柔得中也；小狐汔济，未出中也。', xiang: '火在水上，未济；君子以慎辨物居方。',
  yaos: [
    { pos: '上九', text: '有孚于饮酒，无咎，濡其首，有孚失是。', gloss: '诚信自得而饮，无咎；然沉湎过度则失其正。', xiang: '象曰：饮酒濡首，亦不知节也。' },
    { pos: '六五', text: '贞吉，无悔，君子之光，有孚，吉。', gloss: '守正则吉无悔，君子德辉外显、有诚而吉。', xiang: '象曰：其晖吉也。' },
    { pos: '九四', text: '贞吉，悔亡，震用伐鬼方，三年有赏于大国。', gloss: '守正吉、悔消，奋力征伐，三年终获大国之赏。', xiang: '象曰：志行也。' },
    { pos: '六三', text: '未济，征凶，利涉大川。', gloss: '事未成，贸然进则凶；惟蓄力终利于涉险。', xiang: '象曰：位不当也。' },
    { pos: '九二', text: '曳其轮，贞吉。', gloss: '拽轮缓行、节制守正，则吉。', xiang: '象曰：中以行正也。' },
    { pos: '初六', text: '濡其尾，吝。', gloss: '渡水濡尾、急于求成，致有憾惜。', xiang: '象曰：亦不知极也。' },
  ],
};

// 乾坤泰否既济未济为手工精校（含逐爻白话）；其余 58 卦原文由 scripts/build_hex.mjs 生成，
// 白话由 hex-gloss.ts（本项目原创简译）注入。
const REST_GLOSSED: FullHex[] = HEX_REST.map((h) => {
  const g = HEX_GLOSS[h.num];
  if (!g) return h;
  return { ...h, guaGloss: g.gua, yaos: h.yaos.map((y, i) => ({ ...y, gloss: g.yao[i] })) as FullHex['yaos'] };
});
const withYili = (h: FullHex): FullHex => {
  const y = HEX_YILI[h.num];
  if (!y) return h;
  return {
    ...h,
    tuanGloss: y.tuan ?? h.tuanGloss,
    xiangGloss: y.daxiang ?? h.xiangGloss,
    yaos: h.yaos.map((yo, i) => (y.xiaoxiang?.[i] ? { ...yo, xiangGloss: y.xiaoxiang[i] } : yo)) as FullHex['yaos'],
  };
};
export const HEX_FULL_LIST: FullHex[] = [QIAN, KUN, TAI, PI, JIJI, WEIJI, ...REST_GLOSSED].map(withYili);
export const HEX_FULL: Record<number, FullHex> = Object.fromEntries(HEX_FULL_LIST.map((h) => [h.num, h]));
export const HEX_FULL_BY_PAIR: Record<string, FullHex> = Object.fromEntries(HEX_FULL_LIST.map((h) => [h.upper + '_' + h.lower, h]));

// ── 逐句类经文（心经 / 常清静 / 系辞 / 阳明 / 阴符 / 参同契）──
export interface ClauseWork {
  id: string; title: string; full?: string; author?: string; glyph?: string; school?: string; kind?: string;
  relation: string; intro?: string; sijiao?: string[]; mantra?: string; clauses: Clause[];
}
// ── 多章类经文（道德经 / 庄子 / 坛经）──
export interface ChapterWork { id: string; title: string; author?: string; relation: string; chapters: Chapter[]; }

export const XINJING: ClauseWork = {
  id: 'xinjing', title: '心经', full: '般若波罗蜜多心经', author: '玄奘 译',
  relation: '“色空不二”与《易》之阴阳相生同观流转',
  clauses: [
    { text: '观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。', gloss: '观自在菩萨修深般若时，照见色受想行识五蕴皆空，从而越一切苦难。' },
    { text: '舍利子，色不异空，空不异色；色即是空，空即是色。', gloss: '色与空并无差别：色本是空，空亦显为色。', link: { kind: 'node', id: 'daode', label: '与老子“有无”相参' } },
    { text: '受想行识，亦复如是。', gloss: '受、想、行、识四蕴，也同样是空。' },
    { text: '舍利子，是诸法空相，不生不灭，不垢不净，不增不减。', gloss: '万法空相，不生不灭、不垢不净、不增不减。' },
    { text: '是故空中无色，无受想行识。', gloss: '所以空中无色，也无受想行识。' },
    { text: '菩提萨埵，依般若波罗蜜多故，心无挂碍。', gloss: '菩萨依般若智慧，心无牵挂障碍。' },
    { text: '无挂碍故，无有恐怖，远离颠倒梦想，究竟涅槃。', gloss: '心无障碍故无所恐惧，远离虚妄，终至寂静涅槃。' },
  ],
  mantra: '揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。',
};

export const JINGANG: ClauseWork = {
  id: 'jingang', title: '金刚经', full: '金刚般若波罗蜜经', author: '鸠摩罗什 译', glyph: '金', school: 'fo',
  relation: '无住生心 · 与《易》之“变动不居”相参',
  clauses: [
    { text: '凡所有相，皆是虚妄。若见诸相非相，即见如来。', gloss: '一切外相皆是虚妄；能于相上见其非相、不执著，便见如来本性。' },
    { text: '应无所住而生其心。', gloss: '不滞著于任何境相，而生起清净之心——金刚经之眼目。', link: { kind: 'node', id: 'qjing', label: '与《常清静经》“遣欲澄心”相参' } },
    { text: '不应住色生心，不应住声香味触法生心，应无所住，而生其心。', gloss: '不依色声香味触法而起执心，无所住著，方生真心。' },
    { text: '过去心不可得，现在心不可得，未来心不可得。', gloss: '三世之心皆念念迁流、了不可得——心本无住。' },
    { text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', gloss: '一切因缘造作之法，如梦幻泡影、如朝露闪电，当如此观照其无常。', link: { kind: 'node', id: 'yi', label: '与《易》“变动不居”相参' } },
  ],
};

export const BUER: ClauseWork = {
  id: 'buer', title: '维摩诘经·不二法门', full: '维摩诘所说经 · 入不二法门品', author: '鸠摩罗什 译', glyph: '维', school: 'fo',
  relation: '不二 · 与阴阳一体、有无相生相参',
  intro: '维摩居士问“云何入不二法门”，众菩萨各陈所见，文殊以“无言无说”作答，维摩则默然不语——“不二”与《易》阴阳一体、老子有无相生遥相呼应。',
  clauses: [
    { text: '生灭为二。法本不生，今则无灭，得此无生法忍，是为入不二法门。', gloss: '把生与灭看作二；而法本无生、亦无所灭，证此无生法忍，即入不二。' },
    { text: '我、我所为二。因有我故，便有我所；若内无我，则无我所，是为入不二法门。', gloss: '我与我所是二；因执有“我”才生“我所”，若无我执则无我所，即入不二。' },
    { text: '文殊师利曰：于一切法无言无说、无示无识，离诸问答，是为入不二法门。', gloss: '文殊答：于一切法不立言说、不起分别、离于问答，便是入不二。' },
    { text: '于是文殊师利问维摩诘：何等是菩萨入不二法门？时维摩诘默然无言。', gloss: '轮到维摩，他默然不答——“一默如雷”，无言正是不二的极致。', link: { kind: 'node', id: 'yi', label: '“不二”与阴阳一体相参' } },
  ],
};

export const BASHI: ClauseWork = {
  id: 'bashi', title: '八识规矩颂', full: '八识规矩颂', author: '玄奘', glyph: '识', school: 'fo',
  relation: '心识分层 · 与系统层级结构相参',
  intro: '玄奘以四章颂括唯识“八识”：前五识（眼耳鼻舌身）、第六意识、第七末那识（我执之根）、第八阿赖耶识（藏识）——一套层层依持的心识系统模型。',
  clauses: [
    { text: '〔前五识〕性境现量通三性。', gloss: '前五识（眼耳鼻舌身）缘现量实境，通善、恶、无记三性——是感官直觉之识。' },
    { text: '〔第六识〕三性三量通三境，三界轮时易可知。', gloss: '第六意识遍通三性、三量、三境，分别最强；众生轮转三界，由它最为显著。' },
    { text: '〔第七识·末那〕带质有覆通情本，随缘执我量为非。', gloss: '末那识恒执第八识为“我”，是我执之根，其认知为非量（错认）。' },
    { text: '〔第八识·阿赖耶〕浩浩三藏不可穷，渊深七浪境为风。', gloss: '阿赖耶藏识浩瀚含藏一切种子；前七识如波浪、外境如风——藏识为根本所依。', link: { kind: 'cube', label: '于立体图看层级结构' } },
  ],
};

export const RUPUSA: ClauseWork = {
  id: 'rupusa', title: '入菩萨行论', full: '入菩萨行论 · 菩提心要（节选）', author: '寂天', glyph: '入', school: 'fo',
  relation: '菩提心 · 自他相换',
  intro: '寂天（约 8 世纪）所造，藏传显教修心根本论。下为广传偈颂之白话节选，旨在示其菩提心要。',
  clauses: [
    { text: '若有暇满身，而不修善法，自欺莫胜此，亦无过此愚。', gloss: '得此难得的暇满人身却不修善，是最大的自欺与愚痴。' },
    { text: '众生欲除苦，反行痛苦因；愚人虽求乐，毁乐如灭仇。', gloss: '众生想离苦，却偏造苦因；想求乐，又毁坏安乐如灭仇敌——颠倒可悯。' },
    { text: '自与他双方，恶苦既相同，自他何差别？何故唯自护？', gloss: '我与他人同样厌苦求乐，本无差别，何必只顾护己？——自他相换之理。', link: { kind: 'node', id: 'yi', label: '与“天地与我并生”相参' } },
    { text: '乃至有虚空，以及众生住，愿吾住世间，尽除众生苦。', gloss: '只要虚空尚存、众生尚在，愿我长留世间，除尽一切众生之苦——菩萨大愿。' },
  ],
};

export const ZHENGJIAN: ClauseWork = {
  id: 'zhengjian', title: '正见 · 四法印', full: '四法印 · 见地导读', author: '宗萨钦哲仁波切', glyph: '见', school: 'fo', kind: 'guide',
  relation: '见地 · 与《易》之“变 / 无常”相参',
  intro: '“四法印”是判别佛法的四条印记。本页为据宗萨钦哲仁波切《正见》一书的导读式提要（书目参考，非原文转录）。',
  clauses: [
    { text: '一、诸行无常', gloss: '凡因缘和合者皆迁流不住、刹那生灭——没有恒常之物。', link: { kind: 'node', id: 'yi', label: '与《易》“变动不居”相参' } },
    { text: '二、诸漏皆苦', gloss: '凡有执取（漏）者，终究是苦——苦源于对无常的抓取。' },
    { text: '三、诸法无我', gloss: '一切法皆无独立、常住、自主之“我”——我执本是错认。' },
    { text: '四、涅槃寂静', gloss: '灭尽烦恼执著，即得寂静解脱——超越苦乐对待。' },
  ],
};

export const DAODE: ChapterWork = {
  id: 'daode', title: '道德经', author: '老子', relation: '有无相生 · 与《易》之阴阳同源',
  chapters: [
    { name: '第一章', clauses: [
      { text: '道可道，非常道。', gloss: '可以言说的“道”，便不是那永恒之道。' },
      { text: '名可名，非常名。', gloss: '可以命名的“名”，便不是那永恒之名。' },
      { text: '无名天地之始；有名万物之母。', gloss: '“无”是天地的开端，“有”是万物的母体。', link: { kind: 'node', id: 'yi', label: '“有无”即《易》之阴阳' } },
      { text: '故常无欲，以观其妙；常有欲，以观其徼。', gloss: '常从“无”中观其玄妙，常从“有”中观其端倪。' },
      { text: '此两者，同出而异名，同谓之玄。', gloss: '有与无同源而异名，皆可称为“玄”。' },
      { text: '玄之又玄，众妙之门。', gloss: '玄而又玄，正是一切奥妙的总门。', link: { kind: 'node', id: 'xinjing', label: '与《心经》“空”相参' } },
    ] },
    { name: '第二章', clauses: [
      { text: '天下皆知美之为美，斯恶已；皆知善之为善，斯不善已。', gloss: '人皆知美，丑的观念便随之而生；皆知善，不善亦随之而立。' },
      { text: '故有无相生，难易相成，长短相形，高下相倾。', gloss: '有无彼此相生，难易彼此相成，长短相比，高下相倾。', link: { kind: 'node', id: 'yi', label: '相生相成 · 即阴阳之理' } },
      { text: '音声相和，前后相随。', gloss: '音与声相和，前与后相随——皆相待而成。' },
      { text: '是以圣人处无为之事，行不言之教。', gloss: '所以圣人以无为处事，以不言行教。' },
      { text: '万物作焉而不辞，生而不有，为而不恃，功成而弗居。', gloss: '任万物兴作而不推辞，生养而不据为己有，作为而不自恃。' },
    ] },
    { name: '第三章', clauses: [
      { text: '不尚贤，使民不争；不贵难得之货，使民不为盗。', gloss: '不标榜贤能，民众便不争；不贵重难得之物，民众便不为盗。' },
      { text: '不见可欲，使民心不乱。', gloss: '不显露引发贪欲之物，民心便不被扰乱。' },
      { text: '是以圣人之治，虚其心，实其腹，弱其志，强其骨。', gloss: '圣人治世，使民心虚静、衣食充实、意志柔和、筋骨强健。' },
      { text: '常使民无知无欲，使夫智者不敢为也。', gloss: '常使民无伪知伪欲，令逞智者不敢妄为。' },
      { text: '为无为，则无不治。', gloss: '以无为而为，则无不治。' },
    ] },
    { name: '第四章', clauses: null },
    { name: '第五章', clauses: null },
  ],
};

export const TANJING: ChapterWork = {
  id: 'tanjing', title: '六祖坛经', author: '惠能', relation: '明心见性 · 与《易》观象见意相参',
  chapters: [
    { name: '行由品', clauses: [
      { text: '时有风吹幡动，一僧曰风动，一僧曰幡动，议论不已。惠能进曰：不是风动，不是幡动，仁者心动。', gloss: '风幡之争，惠能一语点破：所动者非风非幡，而是观者之心。' },
      { text: '神秀偈曰：身是菩提树，心如明镜台，时时勤拂拭，勿使惹尘埃。', gloss: '神秀主渐修：以身心为可拂拭之镜，时时用功去尘。' },
      { text: '惠能偈曰：菩提本无树，明镜亦非台，本来无一物，何处惹尘埃。', gloss: '惠能主顿悟：自性本空，无树无台、本无一物，尘埃无处可惹。', link: { kind: 'node', id: 'xinjing', label: '与《心经》“五蕴皆空”相参' } },
    ] },
    { name: '般若品', clauses: [
      { text: '菩提自性，本来清净，但用此心，直了成佛。', gloss: '自性本自清净，只须直用此心，便可当下成佛。' },
      { text: '凡夫即佛，烦恼即菩提。前念迷即凡夫，后念悟即佛。', gloss: '迷悟只在一念之间：前念迷是凡夫，后念悟即是佛。' },
      { text: '一切般若智，皆从自性而生，不从外入。', gloss: '一切般若智慧，皆由自性生发，并非从外面得来。' },
    ] },
    { name: '定慧品', clauses: [
      { text: '我此法门，以定慧为本。定是慧体，慧是定用；即定之时慧在定，即慧之时定在慧。', gloss: '定慧一体不二：定为慧之体，慧为定之用，二者相即不离。', link: { kind: 'node', id: 'yangming', label: '与阳明“知行合一”相参' } },
    ] },
    { name: '坐禅品', clauses: null },
    { name: '忏悔品', clauses: null },
    { name: '机缘品', clauses: null },
    { name: '顿渐品', clauses: null },
    { name: '付嘱品', clauses: null },
  ],
};

export const ZHUANGZI: ChapterWork = {
  id: 'zhuangzi', title: '庄子', author: '庄周', relation: '逍遥齐物 · 与《易》之流变观相参',
  chapters: [
    { name: '逍遥游', clauses: [
      { text: '北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。', gloss: '北海有鱼名鲲，大不知几千里；化而为鸟，名鹏——以巨变开篇，状物之化。' },
      { text: '鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里。', gloss: '鹏迁往南海，击水三千里，乘旋风直上九万里。' },
      { text: '且夫水之积也不厚，则其负大舟也无力。', gloss: '水积不深，就托不起大船——蓄积不厚则无以承大。' },
      { text: '至人无己，神人无功，圣人无名。', gloss: '至人忘我、神人不恃功、圣人不求名——真逍遥在无所待。' },
    ] },
    { name: '齐物论', clauses: [
      { text: '天地与我并生，而万物与我为一。', gloss: '天地与我同生，万物与我一体——泯除物我对立。', link: { kind: 'node', id: 'yi', label: '与《易》“天人一体”相参' } },
      { text: '物无非彼，物无非是。彼出于是，是亦因彼。', gloss: '万物皆可为“彼”亦可为“此”，彼此相因而立——分别本是相对。' },
      { text: '昔者庄周梦为胡蝶，栩栩然胡蝶也。不知周之梦为胡蝶与，胡蝶之梦为周与？', gloss: '庄周梦蝶，醒后不辨是周梦蝶、还是蝶梦周——物化之喻，真幻难分。' },
    ] },
    { name: '养生主', clauses: [
      { text: '吾生也有涯，而知也无涯。以有涯随无涯，殆已。', gloss: '生命有限而知识无穷，以有限追逐无穷，必致困殆——养生贵在守中。' },
      { text: '为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生。', gloss: '行善不为名、避恶不触刑，循中道而行，便可保身全生。' },
    ] },
    { name: '人间世', clauses: null },
    { name: '德充符', clauses: null },
    { name: '大宗师', clauses: null },
    { name: '应帝王', clauses: null },
  ],
};

export const YINFU: ClauseWork = {
  id: 'yinfu', title: '阴符经', full: '黄帝阴符经', author: '旧题黄帝', glyph: '符', school: 'dao',
  relation: '观天执行 · 与系统机变之理相参',
  clauses: [
    { text: '观天之道，执天之行，尽矣。', gloss: '洞观天道、践行天则，修养之要尽在于此。', link: { kind: 'node', id: 'yi', label: '“观天之道”与《易》观象相参' } },
    { text: '天有五贼，见之者昌。五贼在心，施行于天。', gloss: '天地间有五种暗运的机理（五行相克），能洞见者昌；五贼系于一心，施行则合于天。' },
    { text: '天性，人也；人心，机也。立天之道，以定人也。', gloss: '天性即人之本性，人心是发动的关枢；确立天道，方能安定人事。' },
    { text: '天发杀机，移星易宿；地发杀机，龙蛇起陆；人发杀机，天地反覆。', gloss: '天地人各有“杀机”之动，牵一发而动全局——变之至大者。' },
    { text: '天生天杀，道之理也。', gloss: '生与杀皆出于天、皆道之常理。' },
    { text: '绝利一源，用师十倍。', gloss: '专注一处、断除旁骛，其效十倍于众——专一则力倍。' },
  ],
};

export const CANTONGQI: ClauseWork = {
  id: 'cantongqi', title: '周易参同契', full: '周易参同契', author: '魏伯阳', glyph: '丹', school: 'dao',
  relation: '借《易》之卦象明丹道 · 易与道之交汇',
  clauses: [
    { text: '乾坤者，易之门户，众卦之父母。', gloss: '乾坤是《易》的门户、六十四卦的父母——以纯阳纯阴统摄众卦。', link: { kind: 'node', id: 'yi', label: '读乾卦 · 易之门户' } },
    { text: '坎离匡郭，运毂正轴。', gloss: '坎离如车厢之框郭、转毂之正轴——以水火二卦喻丹道运转之枢。', link: { kind: 'cube', label: '于立体图看坎离之位' } },
    { text: '牝牡四卦，以为橐籥。覆冒阴阳之道，犹工御者准绳墨。', gloss: '乾坤坎离四卦如鼓风的橐籥，统御阴阳之道，犹如工匠依准绳墨。' },
    { text: '月节有五六，经纬奉日使。', gloss: '历法以卦象配月节，经纬运行皆奉日而动——以《易》纪丹道火候。' },
  ],
};

export const XICI: ClauseWork = {
  id: 'xici', title: '系辞传', full: '易 · 十翼', glyph: '系',
  relation: '由卦爻上升为天地法则 · 系统思维的源头',
  intro: '《系辞》为孔门解《易》之作，分上下传，纵论易道之本——“一阴一阳之谓道”，正是中国系统思维的总纲。下为上下传要义选段（〔上〕〔下〕标其所属）。',
  clauses: [
    { text: '〔上〕天尊地卑，乾坤定矣。卑高以陈，贵贱位矣。', gloss: '天高地下，乾坤的位序即定；高下既已陈列，贵贱之次第便分明——以天地立易之纲。' },
    { text: '〔上〕方以类聚，物以群分，吉凶生矣。', gloss: '事各依类相聚、物各依群相分，于是吉凶（因向背异同）而生。' },
    { text: '〔上〕一阴一阳之谓道；继之者善也，成之者性也。', gloss: '一阴一阳交替相成便是“道”；能承继它的是“善”，能成就它的是“性”——道在阴阳，禀之为性。' },
    { text: '〔上〕生生之谓易。', gloss: '生而又生、化育不息，就是“易”的本义。' },
    { text: '〔上〕易与天地准，故能弥纶天地之道。', gloss: '《易》与天地相齐准，所以能统贯、范围天地之理。' },
    { text: '〔上〕仰以观于天文，俯以察于地理，是故知幽明之故。', gloss: '仰观天象、俯察地理，因而通晓幽（隐）明（显）之所以然——易学源于观象。' },
    { text: '〔上〕范围天地之化而不过，曲成万物而不遗。', gloss: '《易》道笼括天地之化育而无过差，曲尽地成就万物而无遗漏。' },
    { text: '〔上〕形而上者谓之道，形而下者谓之器。', gloss: '超越形体的是“道”（规律），落于形体的是“器”（事物）——道器之分。' },
    { text: '〔上〕易有太极，是生两仪，两仪生四象，四象生八卦。', gloss: '易有太极，太极生阴阳两仪，两仪生四象，四象生八卦——一套层层倍生的系统。', link: { kind: 'cube', label: '看八卦如何层层倍生' } },
    { text: '〔上〕大衍之数五十，其用四十有九。', gloss: '大衍之数为五十，实际所用四十九（虚一不用）——这是揲蓍成卦之筮法的开端。' },
    { text: '〔上〕易有圣人之道四焉：以言者尚其辞，以动者尚其变，以制器者尚其象，以卜筮者尚其占。', gloss: '《易》含圣人之道四端：重言辞者取其辞、重行动者取其变、制器物者取其象、卜筮者取其占——一书四用。' },
    { text: '〔上〕书不尽言，言不尽意。圣人立象以尽意，设卦以尽情伪。', gloss: '文字不能尽表言语、言语不能尽表心意；故圣人立卦象以尽其意、设卦爻以尽万物之真伪——“立象以尽意”。' },
    { text: '〔下〕八卦成列，象在其中矣；因而重之，爻在其中矣。', gloss: '八卦排成序列，物象便在其中；八卦两两相重而为六十四卦，爻便在其中——卦爻之所由立。' },
    { text: '〔下〕古者包牺氏之王天下也，仰则观象于天，俯则观法于地，于是始作八卦，以通神明之德，以类万物之情。', gloss: '上古伏羲治天下，仰观天象、俯察地法，于是始画八卦，用以会通神明之德、比类万物之情——八卦之缘起。', link: { kind: 'cube', label: '于立体图看八卦成象' } },
    { text: '〔下〕易穷则变，变则通，通则久，是以自天祐之，吉无不利。', gloss: '《易》理：事穷尽则变、变则通达、通则长久；如此则得天之佑助，吉而无所不利——穷变通久之道。' },
    { text: '〔下〕天地之大德曰生。', gloss: '天地最大的德，就是生养万物、生生不息。' },
    { text: '〔下〕天下何思何虑？天下同归而殊涂，一致而百虑。', gloss: '天下何须多思多虑？万途虽异而同归一处、百虑虽杂而归于一致——“殊途同归”。', link: { kind: 'west', id: 'west', label: '与西方“殊途同归”对照' } },
    { text: '〔下〕尺蠖之屈，以求信也；龙蛇之蛰，以存身也。', gloss: '尺蠖弯曲身体，是为了再伸展；龙蛇蛰伏，是为了保全自身——屈以求伸、退以为进。' },
    { text: '〔下〕君子安而不忘危，存而不忘亡，治而不忘乱，是以身安而国家可保也。', gloss: '君子安定时不忘危险、生存时不忘败亡、治世时不忘祸乱，所以能身安而国家可保——忧患意识。' },
    { text: '〔下〕善不积不足以成名，恶不积不足以灭身。', gloss: '善不积累不足以成就美名，恶不积累也不足以毁灭其身——祸福皆由渐积。' },
    { text: '〔下〕易之为书也不可远，为道也屡迁，变动不居，周流六虚。', gloss: '《易》这部书不可须臾远离，其道屡屡迁移、变动不停，周流于六爻之间（六虚）——变易之妙。' },
  ],
};

export const SHUOGUA: ClauseWork = {
  id: 'shuogua', title: '说卦传', full: '易 · 十翼', glyph: '说',
  relation: '八卦之性情·取象·方位 · 系统的“基元”说明书',
  intro: '《说卦》专说八卦：其性情、取象、方位与所配身物，是六十四卦得以成象、立体图与方圆图得以成立的“基元”说明书。',
  clauses: [
    { text: '天地定位，山泽通气，雷风相薄，水火不相射，八卦相错。', gloss: '八卦两两相对而交感（先天方位）：天地上下定位、山泽气息相通、雷风相互激荡、水火并行不悖——八卦交错而成象。', link: { kind: 'cube', label: '于立体图看八卦相错' } },
    { text: '帝出乎震，齐乎巽，相见乎离，致役乎坤，说言乎兑，战乎乾，劳乎坎，成言乎艮。', gloss: '以八卦配四时方位（后天）：万物出于震（春）、洁齐于巽、相见于离（夏）、致养于坤、喜悦于兑（秋）、相薄于乾、归息于坎（冬）、成终成始于艮。' },
    { text: '乾，健也；坤，顺也；震，动也；巽，入也；坎，陷也；离，丽也；艮，止也；兑，说也。', gloss: '八卦之性情：乾刚健、坤柔顺、震奋动、巽潜入、坎陷险、离附丽、艮静止、兑和悦——卦德之纲。' },
    { text: '乾为天，坤为地，震为雷，巽为风，坎为水，离为火，艮为山，兑为泽。', gloss: '八卦之取象：乾天、坤地、震雷、巽风、坎水、离火、艮山、兑泽——一切卦象之根。', link: { kind: 'cube', label: '于立体图看八卦取象' } },
    { text: '乾为首，坤为腹，震为足，巽为股，坎为耳，离为目，艮为手，兑为口。', gloss: '八卦配于人身：乾首、坤腹、震足、巽股、坎耳、离目、艮手、兑口——“近取诸身”之象。' },
    { text: '乾，天也，故称乎父；坤，地也，故称乎母。震一索而得男，故谓之长男；巽一索而得女，故谓之长女。', gloss: '乾为父、坤为母，二者交索而生六子：震坎艮为长中少三男，巽离兑为长中少三女——八卦即一家之象。' },
  ],
};

export const XUGUA: ClauseWork = {
  id: 'xugua', title: '序卦传', full: '易 · 十翼', glyph: '序',
  relation: '六十四卦相生次第 · 系统演化的因果链',
  intro: '《序卦》逐一申说六十四卦何以如此相次——由乾坤而屯蒙、以至既济未济，是一条“物极必反、相生相承”的系统演化链。',
  clauses: [
    { text: '有天地，然后万物生焉。盈天地之间者唯万物，故受之以屯。屯者，盈也；屯者，物之始生也。', gloss: '先有天地（乾坤），而后万物生；充盈天地之间的唯有万物，故乾坤之后受之以屯——屯是郁结初生、万物始生之象。' },
    { text: '物生必蒙，故受之以蒙。蒙者，蒙也，物之稚也。', gloss: '物初生必蒙昧幼稚，故屯之后受之以蒙——蒙是稚嫩待启之时。' },
    { text: '履而泰，然后安，故受之以泰。泰者，通也。物不可以终通，故受之以否。', gloss: '循礼而行则通泰、通泰然后安定，故受之以泰——泰是天地交通之象；而万物不能永远通泰，故泰极受之以否（闭塞）。' },
    { text: '物不可以终尽，剥穷上反下，故受之以复。', gloss: '万物不会终归剥尽，剥到极点便由上返下、一阳来复，故剥之后受之以复——示循环不息。' },
    { text: '有过物者必济，故受之以既济。物不可穷也，故受之以未济终焉。', gloss: '能超越于物者必有所成，故受之以既济（已成）；然而物理不会穷尽，故终之以未济（未成）——以“未完成”作结，正见生生不息。', link: { kind: 'node', id: 'yi', label: '与《系辞》“生生之谓易”相参' } },
  ],
};

export const ZAGUA: ClauseWork = {
  id: 'zagua', title: '杂卦传', full: '易 · 十翼', glyph: '杂',
  relation: '错综两两对举 · 以反见义的系统对照',
  intro: '《杂卦》打乱卦序、两两对举，以一字之反点出各卦要义——是《易》以“相反相成”见义的极简对照表。',
  clauses: [
    { text: '乾刚坤柔，比乐师忧。', gloss: '乾刚健、坤柔顺；比卦（亲附）可乐、师卦（用兵）多忧——两两对举，以反见义。' },
    { text: '临、观之义，或与或求。', gloss: '临是以上临下、施与于人，观是以下观上、有所瞻求——一与一求，相对成义。' },
    { text: '损、益，盛衰之始也。', gloss: '损与益，正是盛衰消长的开端——损极而益、益极而损，机在毫端。' },
    { text: '大过，颠也。姤，遇也，柔遇刚也。', gloss: '大过是本末过重、颠覆之象；姤是不期而遇，一阴始生而遇五阳——柔遇刚也。' },
    { text: '既济，定也；未济，男之穷也。', gloss: '既济是六爻各得其正、安定之象；未济是阳刚未得其位、犹处困穷——《杂卦》亦以未济殿后，与《序卦》同归。' },
  ],
};

export const WENYAN: ClauseWork = {
  id: 'wenyan', title: '文言传', full: '易 · 十翼', glyph: '文',
  relation: '乾坤二卦义理之渊 · 四德 / 进退存亡 / 敬义直方',
  intro: '《文言》是十翼中独释乾、坤二卦之作——乾坤为《易》之门户，故孔门专申其义理：四德之本、潜亢之戒、敬义直方之学。下为乾坤《文言》要义选段。',
  clauses: [
    { text: '〔乾〕元者，善之长也；亨者，嘉之会也；利者，义之和也；贞者，事之干也。君子体仁足以长人，嘉会足以合礼，利物足以和义，贞固足以干事。君子行此四德者，故曰：乾，元亨利贞。', gloss: '释乾"元亨利贞"四德：元为众善之首，亨为嘉美之会聚，利为义之调和，贞为事之主干。君子体仁可为人长、聚美可合礼、利物可和义、守正可成事——行此四德，正是"元亨利贞"。' },
    { text: '〔乾〕初九曰"潜龙勿用"，何谓也？子曰：龙德而隐者也。不易乎世，不成乎名，遯世无闷，不见是而无闷；乐则行之，忧则违之，确乎其不可拔，潜龙也。', gloss: '孔子释"潜龙勿用"：有龙德而隐居者——不为世俗改节、不求虚名，避世无闷、不被认可亦无闷；可行则行、可隐则违，坚定不可动摇——此即潜龙。' },
    { text: '〔乾〕九三曰"君子终日乾乾，夕惕若厉，无咎"，何谓也？子曰：君子进德修业。忠信，所以进德也；修辞立其诚，所以居业也。', gloss: '孔子释九三：君子终日勤勉、入夜戒惧而无咎，在于进德修业——以忠信进德，以修辞立诚而守业；故居上不骄、在下不忧。' },
    { text: '〔乾〕九五曰"飞龙在天，利见大人"，何谓也？子曰：同声相应，同气相求。水流湿，火就燥，云从龙，风从虎，圣人作而万物睹。本乎天者亲上，本乎地者亲下，则各从其类也。', gloss: '孔子释九五："同声相应，同气相求"——水流湿处、火就燥处，云随龙、风随虎，圣人兴起则万物瞻仰；本于天者亲上、本于地者亲下，各从其类——德位相配，故"飞龙在天"。', link: { kind: 'cube', label: '于立体图看同类相应' } },
    { text: '〔乾〕亢之为言也，知进而不知退，知存而不知亡，知得而不知丧。其唯圣人乎！知进退存亡而不失其正者，其唯圣人乎！', gloss: '释上九"亢龙有悔"："亢"即只知进不知退、只知存不知亡、只知得不知丧。能通晓进退存亡而不失其正者，其唯圣人——盈极当思反。' },
    { text: '〔坤〕坤至柔而动也刚，至静而德方。后得主而有常，含万物而化光。坤道其顺乎，承天而时行。', gloss: '释坤德：坤极柔而其动也刚、极静而其德方正；随后得主而有常道，含育万物而化育广大。坤道何其柔顺——承奉天道而顺时运行。' },
    { text: '〔坤〕积善之家，必有余庆；积不善之家，必有余殃。臣弑其君，子弑其父，非一朝一夕之故，其所由来者渐矣，由辩之不早辩也。', gloss: '释初六"履霜坚冰至"：积善之家必有余庆，积恶之家必有余殃。臣弑君、子弑父绝非一朝一夕，而是渐积而成——只因未能及早辨察。见微知著、防渐于初。' },
    { text: '〔坤〕君子敬以直内，义以方外，敬义立而德不孤。"直方大，不习无不利"，则不疑其所行也。', gloss: '释六二"直方大"：君子以"敬"端正内心、以"义"方正行事，敬义并立则德不孤。如此则"正直、方正、宏大，不习而无不利"——于所行不复疑虑。' },
    { text: '〔坤〕阴虽有美，含之以从王事，弗敢成也。地道也，妻道也，臣道也。地道无成而代有终也。', gloss: '释六三"含章可贞"：阴虽有美，亦当含藏以辅王事，不敢自居其成——此地道、妻道、臣道：地道不自居成功，而代天成其终。' },
    { text: '〔坤〕天地变化，草木蕃；天地闭，贤人隐。《易》曰："括囊，无咎无誉。"盖言谨也。', gloss: '释六四"括囊"：天地交通则草木繁盛，天地闭塞则贤人隐退。《易》言"扎紧口袋，无咎无誉"——正谓谨慎自守、危邦当晦。' },
  ],
};

export const QINGJING: ClauseWork = {
  id: 'qjing', title: '常清静经', full: '太上老君说常清静经', author: '太上老君', glyph: '清', school: 'dao',
  relation: '清静无为 · 与《易》之“寂然不动”相参',
  clauses: [
    { text: '大道无形，生育天地；大道无情，运行日月；大道无名，长养万物。吾不知其名，强名曰道。', gloss: '道无形而生天地，无情而运日月，无名而养万物；不得已，勉强称之为“道”。' },
    { text: '夫道者：有清有浊，有动有静。天清地浊，天动地静。降本流末，而生万物。', gloss: '道含清浊动静：天清地浊、天动地静，由本及末，化生万物。' },
    { text: '清者浊之源，动者静之基。人能常清静，天地悉皆归。', gloss: '清为浊之源、动为静之本；人若常清静，天地之德皆归于身。' },
    { text: '夫人神好清，而心扰之；人心好静，而欲牵之。常能遣其欲，而心自静；澄其心，而神自清。', gloss: '神本好清却为心所扰，心本好静却为欲所牵；能遣欲则心静，能澄心则神清。' },
    { text: '内观其心，心无其心；外观其形，形无其形；远观其物，物无其物。三者既悟，唯见于空。', gloss: '内观心、外观形、远观物，皆了不可得；三者既悟，唯见空寂。', link: { kind: 'node', id: 'xinjing', label: '“唯见于空”与《心经》相参' } },
    { text: '观空亦空，空无所空；所空既无，无无亦无；无无既无，湛然常寂。', gloss: '观空之空亦空，层层遣除，终至湛然常寂之境。' },
    { text: '真常应物，真常得性；常应常静，常清静矣。', gloss: '以真常应万物而不失其性，常应常静，即是常清静。' },
  ],
};

export const YANGMING: ClauseWork = {
  id: 'yangming', title: '阳明心学', full: '王阳明 · 传习录', author: '王阳明', glyph: '儒', school: 'ru',
  relation: '心即理 · 与《易》“天行健”之自强相承',
  sijiao: ['无善无恶心之体', '有善有恶意之动', '知善知恶是良知', '为善去恶是格物'],
  clauses: [
    { text: '心即理也。天下又有心外之事、心外之理乎？', gloss: '心就是理；天下没有心外之事、心外之理。' },
    { text: '知是行之始，行是知之成。', gloss: '知是行的开端，行是知的完成——二者本是一体。' },
    { text: '知行合一。', gloss: '真知必能行，能行才是真知，知行不可分作两截。' },
    { text: '你未看此花时，此花与汝心同归于寂；你来看此花时，则此花颜色一时明白起来。', gloss: '未观花时心物俱寂，观花时花色与心同时朗现——心物一体之喻。' },
    { text: '破山中贼易，破心中贼难。', gloss: '降伏外敌易，克治己心之私欲难——修身之要在治心。' },
  ],
};

export const ZHONGYONG: ClauseWork = {
  id: 'zhongyong', title: '中庸', full: '礼记 · 中庸', author: '子思', glyph: '儒', school: 'ru',
  relation: '时中 · 与《易》之中正、时位相参',
  clauses: [
    { text: '天命之谓性，率性之谓道，修道之谓教。', gloss: '天所赋予的是性，循性而行是道，修明此道是教。' },
    { text: '喜怒哀乐之未发，谓之中；发而皆中节，谓之和。', gloss: '情未发为“中”，发而中节为“和”——中和是天下之本与达道。' },
    { text: '君子之中庸也，君子而时中。', gloss: '君子能行中庸，在于随时处中、不偏不倚。', link: { kind: 'node', id: 'yi', label: '与《易》“中正·时位”相参' } },
    { text: '诚者，天之道也；诚之者，人之道也。', gloss: '诚是天之道，求诚是人之道——以诚通天人。' },
  ],
};

export const TAIJITU: ClauseWork = {
  id: 'taijitu', title: '太极图说', full: '太极图说', author: '周敦颐', glyph: '儒', school: 'ru',
  relation: '太极生阴阳 · 理学开山，与《易》同源',
  intro: '宋明理学开山之作。一篇之内，由太极而阴阳、而五行、而万物——正是《易》“太极生两仪”的理学展开。',
  clauses: [
    { text: '无极而太极。太极动而生阳，动极而静，静而生阴；静极复动。一动一静，互为其根。', gloss: '由无极而显太极；太极一动生阳、动极转静而生阴，动静互为其根——阴阳之本。', link: { kind: 'node', id: 'yi', label: '与《系辞》“易有太极”相参' } },
    { text: '分阴分阳，两仪立焉。', gloss: '阴阳既分，两仪（天地）于是确立。' },
    { text: '阳变阴合，而生水火木金土。五气顺布，四时行焉。', gloss: '阳变阴合，化生五行；五气顺序布列，四时由之运行。' },
    { text: '二气交感，化生万物。万物生生，而变化无穷焉。', gloss: '阴阳二气交感，化生万物；生生不息，变化无穷。', link: { kind: 'cube', label: '于立体图看阴阳层层倍生' } },
  ],
};

export const XIMING: ClauseWork = {
  id: 'ximing', title: '西铭', full: '正蒙 · 西铭', author: '张载', glyph: '儒', school: 'ru',
  relation: '一物两体 · 民胞物与，本于乾坤',
  clauses: [
    { text: '乾称父，坤称母；予兹藐焉，乃混然中处。', gloss: '以乾为父、坤为母；我虽渺小，却混然处于天地之中。', link: { kind: 'node', id: 'yi', label: '本于《易》之乾坤' } },
    { text: '天地之塞，吾其体；天地之帅，吾其性。', gloss: '充塞天地的气是我的身体，统帅天地的理是我的本性。' },
    { text: '民，吾同胞；物，吾与也。', gloss: '百姓是我的同胞，万物是我的同伴——“民胞物与”之怀。' },
    { text: '一物两体，气也；一故神，两故化。', gloss: '一气而含阴阳两体：唯其一，故能神妙不测；唯其两，故能变化生成——阴阳辩证之纲。' },
  ],
};

export const HUANGJI: ClauseWork = {
  id: 'huangji', title: '皇极经世书', full: '皇极经世书', author: '邵雍', glyph: '儒', school: 'ru',
  relation: '加一倍法 · 元会运世，先天易学之大成',
  intro: '邵雍以“先天之学”推演天地始终。其“加一倍法”层层倍增而成卦，正是本平台立体图、先天方圆图的生成机理；“元会运世”则以《易》之数建模宇宙治乱之周期。',
  clauses: [
    { text: '太极既分，两仪立矣。一分为二，二分为四，四分为八，八分为十六，十六分为三十二，三十二分为六十四。', gloss: '由太极层层一分为二（加一倍法），递生两仪、四象、八卦以至六十四卦——一套纯粹的二分倍生系统。', link: { kind: 'cube', label: '于立体图看加一倍法' } },
    { text: '一元统十二会，一会统三十运，一运统十二世，一世统三十年。', gloss: '元→会→运→世→年 层层统摄（1元＝12会＝360运＝4320世＝129600年），以数建模宇宙时序。' },
    { text: '先天之学，心法也。图皆从中起，万化万事生乎心。', gloss: '先天之学是心法：图象皆自中心生发，万化万事根于一心。', link: { kind: 'square', label: '于先天方圆图看“从中起”' } },
    { text: '天向一中分造化，人于心上起经纶。', gloss: '天地于太极一中分出造化，人则在一心之上经营天下——数与心相贯。' },
  ],
};

// ── 星图节点 = 家 ──
export type NodeStatus = 'ready' | 'soon' | 'ghost' | 'west';
export interface StarNode {
  id: string; kind?: 'core' | 'school' | 'west'; x: number; y: number; glyph: string;
  name: string; sub?: string; author?: string; frag?: string; rel?: string; status: NodeStatus;
}
export const NODES: StarNode[] = [
  { id: 'yi', kind: 'core', x: 612, y: 462, glyph: '易', name: '易经 · 乾卦', sub: '系统思维 · 骨干', status: 'ready' },
  { id: 'dao', kind: 'school', x: 1016, y: 232, glyph: '道', name: '道家', author: '老子 · 太上老君', frag: '道德经 · 常清静经', rel: '阴阳 · 自然', status: 'ready' },
  { id: 'ru', kind: 'school', x: 1040, y: 690, glyph: '儒', name: '儒家', author: '王阳明', frag: '阳明心学 · 传习录', rel: '心性 · 良知', status: 'ready' },
  { id: 'fo', kind: 'school', x: 252, y: 686, glyph: '佛', name: '佛家', author: '般若部 · 惠能', frag: '心经 · 六祖坛经', rel: '空 · 无常', status: 'ready' },
  { id: 'west', kind: 'west', x: 252, y: 250, glyph: '西', name: '西方经典', author: '对照·印证', frag: '系统思维 · 东西照面', rel: '对照 · 跳架', status: 'west' },
];
export const NODE_BY_ID: Record<string, StarNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

// ── 作品注册 (家 → 经) ──
export type WorkStatus = 'ready' | 'partial' | 'soon' | 'guide';
export interface WorkMeta { id: string; school: string; group?: string; title: string; author: string; frag: string; status: WorkStatus; }
export const WORKS: WorkMeta[] = [
  { id: 'daode', school: 'dao', title: '道德经', author: '老子', frag: '道可道，非常道', status: 'ready' },
  { id: 'zhuangzi', school: 'dao', title: '庄子', author: '庄周', frag: '北冥有鱼，其名为鲲', status: 'partial' },
  { id: 'qjing', school: 'dao', title: '常清静经', author: '太上老君', frag: '大道无形，长养万物', status: 'ready' },
  { id: 'yinfu', school: 'dao', title: '阴符经', author: '旧题黄帝', frag: '观天之道，执天之行', status: 'ready' },
  { id: 'cantongqi', school: 'dao', title: '周易参同契', author: '魏伯阳', frag: '乾坤者，易之门户', status: 'ready' },
  { id: 'liezi', school: 'dao', title: '列子', author: '列御寇', frag: '冲虚 · 贵虚', status: 'soon' },
  { id: 'taiyi', school: 'dao', title: '太乙金华宗旨', author: '旧题吕洞宾', frag: '性命双修 · 内丹', status: 'soon' },
  { id: 'zhongyong', school: 'ru', group: '经传', title: '中庸', author: '子思', frag: '君子而时中', status: 'ready' },
  { id: 'taijitu', school: 'ru', group: '理学', title: '太极图说', author: '周敦颐', frag: '无极而太极', status: 'ready' },
  { id: 'ximing', school: 'ru', group: '理学', title: '西铭', author: '张载', frag: '民吾同胞，物吾与也', status: 'ready' },
  { id: 'huangji', school: 'ru', group: '理学', title: '皇极经世书', author: '邵雍', frag: '加一倍法 · 元会运世', status: 'partial' },
  { id: 'yangming', school: 'ru', group: '心学', title: '阳明心学', author: '王阳明', frag: '知行合一 · 致良知', status: 'ready' },
  { id: 'xinjing', school: 'fo', group: '汉传', title: '心经', author: '玄奘 译', frag: '色即是空，空即是色', status: 'ready' },
  { id: 'jingang', school: 'fo', group: '汉传', title: '金刚经', author: '鸠摩罗什 译', frag: '应无所住而生其心', status: 'ready' },
  { id: 'buer', school: 'fo', group: '汉传', title: '维摩诘·不二法门', author: '鸠摩罗什 译', frag: '一默如雷 · 入不二门', status: 'ready' },
  { id: 'bashi', school: 'fo', group: '汉传', title: '八识规矩颂', author: '玄奘', frag: '八识 · 心识分层之系统', status: 'ready' },
  { id: 'tanjing', school: 'fo', group: '汉传', title: '六祖坛经', author: '惠能', frag: '菩提本无树，明镜亦非台', status: 'partial' },
  { id: 'rupusa', school: 'fo', group: '藏传', title: '入菩萨行论', author: '寂天', frag: '菩提心 · 自他相换', status: 'partial' },
  { id: 'zhengjian', school: 'fo', group: '导读', title: '正见·四法印', author: '宗萨钦哲仁波切', frag: '见地 · 四法印', status: 'guide' },
];
export const WORK_BY_ID: Record<string, WorkMeta> = Object.fromEntries(WORKS.map((w) => [w.id, w]));

// ── 家级介绍 ──
export interface SchoolInfo { id: string; name: string; glyph: string; tagline: string; intro: string; relation: string; workIds: string[]; }
export const SCHOOL_INFO: Record<string, SchoolInfo> = {
  dao: { id: 'dao', name: '道家', glyph: '道', tagline: '道法自然 · 阴阳为枢', intro: '道家以“道”为万物本原，主张顺应自然、清静无为，于流变中见恒常。', relation: '《易》以阴阳为骨，道家以“有无相生”为脉——本是同一套“变”的智慧。', workIds: ['daode', 'zhuangzi', 'qjing', 'yinfu', 'cantongqi', 'liezi', 'taiyi'] },
  ru: { id: 'ru', name: '儒家', glyph: '儒', tagline: '心性 · 知行合一', intro: '儒家重人伦与修身；自易学传承至宋明理学，一脉直承《易》之太极阴阳与中正时位。', relation: '《易·象》言“天行健，君子以自强不息”——儒家修身之本即由此出。', workIds: ['zhongyong', 'taijitu', 'ximing', 'huangji', 'yangming'] },
  fo: { id: 'fo', name: '佛家', glyph: '佛', tagline: '缘起 · 性空', intro: '佛家观“缘起性空”，照见五蕴皆空，于无常中超越执着。', relation: '《易》言“穷则变，变则通”，与佛家“诸行无常”同观流转之理。', workIds: ['xinjing', 'jingang', 'buer', 'bashi', 'tanjing', 'rupusa', 'zhengjian'] },
};

// ── 词条释名 ──
export const TERMS: Record<string, string> = {
  '元亨利贞': '《乾》卦四德：元为始生，亨为通达，利为各得其宜，贞为正固守成。',
  '太极': '阴阳未分之前的一体根源；在《系辞》中为“两仪”生成之本。',
  '两仪': '阴与阳两种基本势能，也是二分生成的第一层。',
  '四象': '阴阳再分所得的四种组合，可视作二分系统的第二层。',
  '八卦': '三爻组合成的八种基本象：乾兑离震巽坎艮坤。',
  '阴阳': '相反相成的两种势：阴主柔、静、承；阳主刚、动、发。',
  '乾坤': '乾为天、坤为地；六十四卦的两极，也是众卦之父母。',
  '卦辞': '文王所系的一卦总辞，用来判定该卦的整体时势。',
  '爻辞': '周公所系的逐爻辞，用来观察同一卦中六个位置的变化。',
  '彖': '《彖传》对卦名、卦辞和卦体的总论解释。',
  '象': '《象传》从卦象、爻象引出修身处世的观法。',
  '爻': '构成卦的阴阳线位；六爻自下而上成卦，本项目按渲染自上而下存储。',
  '错卦': '六爻全反所得之卦，可看作与当前处境相反的镜像。',
  '综卦': '六爻上下倒置所得之卦，用来观察同一结构的反向视角。',
  '互卦': '取中四爻重组所得之卦，用来观察当前处境的内在结构。',
  '交卦': '上下卦互换所得之卦，用来观察内外关系调换后的形势。',
  '般若波罗蜜多': '梵语 prajñā-pāramitā，“以根本智慧到彼岸”，即圆满的觉悟之智。',
  '般若': '梵语 prajñā，超越概念分别的根本智慧。',
  '波罗蜜多': '梵语 pāramitā，“到彼岸”，指修行的圆满成就。',
  '五蕴': '色、受、想、行、识——构成身心的五类聚合。',
  '受想行识': '五蕴中的四种心理聚合（受、想、行、识）。',
  '色': '物质现象与有形之相（与“空”相对）。',
  '空': '无自性、因缘和合而现，并非“虚无”。',
  '舍利子': '佛弟子舍利弗，于声闻中智慧第一。',
  '观自在菩萨': '即观世音菩萨，观照自在、寻声救苦。',
  '菩提萨埵': '梵语 bodhisattva，菩萨，求觉悟而度众生者。',
  '菩萨': '梵语 bodhisattva 略称，觉有情、自觉觉他者。',
  '涅槃': '梵语 nirvāṇa，烦恼熄灭、寂静解脱之境。',
  '菩提': '梵语 bodhi，觉悟、正觉。',
  '揭谛': '咒语音译，约意为“去吧、去吧（共度彼岸）”。',
  '萨婆诃': '咒语结句音译，约意为“速疾成就、圆满”。',
  '挂碍': '心有牵挂与障碍。',
  '颠倒梦想': '违于真相的虚妄分别与妄想。',
  '自性': '本心本具的清净体性。',
  '大道': '宇宙的本原与根本规律。',
  '真常': '真实而恒常的本性。',
  '如来': '梵语 tathāgata，佛之德号，意为“如实而来”、契合真如。',
  '有为法': '因缘造作、有生灭的一切现象（与“无为”相对）。',
  '不二': '泯除对立的两边，归于一体——如生灭、我与我所本无二。',
  '阿赖耶识': '第八识、藏识，含藏一切种子，为身心世界之根本依。',
  '末那识': '第七识，恒执第八识为“我”，是我执的根源。',
  '无生法忍': '证悟诸法本不生灭、安住其上而不动的智慧。',
};

// ── 东西对照地图 ──
export const WEST_INTRO = '西方系统思维，不是《周易》“里”的东西，而是另一条路爬到相近高处的山头。易走定性、整体、读势；西方走可量化、可仿真、可证伪。重合处印证直觉，分歧处正是“两边都懂的人”能站的位置。';
export interface WestRow {
  facet: string; hexLabel: string; jump: LinkSpec; work: string; cn: string; author: string; year: string; rhyme: string; diverge: string;
}
export const WEST_MAP: WestRow[] = [
  { facet: '反馈回路 · 杠杆点', hexLabel: '否极泰来 · 爻位当中', jump: { kind: 'hex', upper: 'kun', lower: 'qian', label: '跳·地天泰' }, work: 'Thinking in Systems', cn: '系统之美', author: 'Donella Meadows', year: '2008', rhyme: '平衡回路即“否极泰来”的西方版：偏离太远会自我拉回；杠杆点≈爻位的“居中当位”——同一干预，位置对了效果天差地别。', diverge: '她把回路画成可仿真的存量-流量模型；易只给心法与势，不给方程。' },
  { facet: '整体涌现', hexLabel: '部分织成整体', jump: { kind: 'node', id: 'xici', label: '跳·系辞传' }, work: 'The Systems View of Life', cn: '生命的系统观', author: 'Fritjof Capra', year: '2014', rhyme: '整体不等于部分之和——与《系辞》“阴阳生八卦、八卦生万物”的涌现观同调。', diverge: 'Capra 有时过度浪漫化“东西互证”，宜带批判读。' },
  { facet: '易＝变 · 过程优先于实体', hexLabel: '生生之谓易', jump: { kind: 'node', id: 'xici', label: '跳·系辞传' }, work: 'Process and Reality', cn: '过程与实在', author: 'A. N. Whitehead', year: '1929', rhyme: '世界的基本单位是“过程/事件”而非“物”——恰是《易》“没有静止的卦，只有流变的爻”。', diverge: '怀特海用严密的思辨学体系推导；易用象与占。' },
  { facet: '顺与逆 · 展开与折回', hexLabel: '道生万物 / 万物归根', jump: { kind: 'cube', label: '跳·立体图' }, work: 'Wholeness and the Implicate Order', cn: '整体性与隐缠序', author: 'David Bohm', year: '1980', rhyme: '“隐缠序”折叠为万象、万象又折回底层秩序——几乎是“阶层生成与归根”的物理版。', diverge: 'Bohm 源于量子力学的实验难题；易源于占筮与观象。' },
  { facet: '二进制骨架', hexLabel: '先天六十四卦＝0→63', jump: { kind: 'square', label: '跳·方圆图' }, work: '二进制算术·伏羲图', cn: '莱布尼茨致白晋信', author: 'G. W. Leibniz', year: '1703', rhyme: '莱布尼茨发明二进制后，骇见先天六十四卦恰是 0→63——东西在形式结构层面的第一次正式照面。', diverge: '莱氏只取其计数结构；易还赋予每位以义理。' },
  { facet: '递归 · 自我嵌套生成', hexLabel: '每一层再做一次二分', jump: { kind: 'cube', label: '跳·立体图' }, work: 'Gödel, Escher, Bach', cn: 'GEB · 集异璧之大成', author: 'Douglas Hofstadter', year: '1979', rhyme: '简单规则递归施加、涌现无穷复杂——即八卦“在每一层再二分”的生成机制。', diverge: 'GEB 谈形式系统与自指涉；易谈象数与人事。' },
  { facet: '64 原型·情境分类', hexLabel: '每卦为一种处境原型', jump: { kind: 'matrix', label: '跳·卦阵' }, work: 'Jung · 《易经》英译本前言', cn: '荣格·原型与共时性', author: 'C. G. Jung', year: '1949', rhyme: '荣格的“原型”与 64 卦同构——都是人类处境的有限组典型模式。', diverge: '荣格由心理原型切入；易由阴阳组合切入。' },
  { facet: '卦象＝情境模式', hexLabel: '情境 + 问题 + 应对之势', jump: { kind: 'matrix', label: '跳·卦阵' }, work: 'A Pattern Language', cn: '模式语言', author: 'Christopher Alexander', year: '1977', rhyme: '253 个“模式”每个＝情境+问题+解法，与 64 卦“一卦一势”几乎同构；还直接启发了软件设计模式。', diverge: 'Alexander 着眼可复用的工程解法；易着眼随时而变的占断。' },
  { facet: '群结构 · 二元域 GF(2)', hexLabel: '64卦 ≅ (ℤ/2)⁶ · 错卦＝异或 111111', jump: { kind: 'cube', label: '跳·立体图(Cayley图)' }, work: 'Group Theory / Abelian Group', cn: '群论 · 初等阿贝尔2-群', author: 'Galois · Cayley', year: '19C', rhyme: '六爻＝六个 GF(2) 位，64卦构成初等阿贝尔2-群 (ℤ/2)⁶；错卦＝与111111异或，动一爻＝沿一个生成元移动——立体图正是该群的 Cayley 图。', diverge: '群论给出可证明的封闭/结合/逆元结构；易以此为象数骨架而归于义理。' },
];

// ── 八卦属性 (依《说卦传》) ──
export interface TrigramAttr { attr: string; family: string; dir: string; element: string; animal: string; body: string; img: string; }
export const TRIGRAM_ATTR: Record<TrigramKey, TrigramAttr> = {
  qian: { attr: '健', family: '父', dir: '西北', element: '金', animal: '马', body: '首', img: '天' },
  kun: { attr: '顺', family: '母', dir: '西南', element: '土', animal: '牛', body: '腹', img: '地' },
  zhen: { attr: '动', family: '长男', dir: '东', element: '木', animal: '龙', body: '足', img: '雷' },
  xun: { attr: '入', family: '长女', dir: '东南', element: '木', animal: '鸡', body: '股', img: '风' },
  kan: { attr: '陷', family: '中男', dir: '北', element: '水', animal: '豕', body: '耳', img: '水' },
  li: { attr: '丽', family: '中女', dir: '南', element: '火', animal: '雉', body: '目', img: '火' },
  gen: { attr: '止', family: '少男', dir: '东北', element: '土', animal: '狗', body: '手', img: '山' },
  dui: { attr: '悦', family: '少女', dir: '西', element: '金', animal: '羊', body: '口', img: '泽' },
};
