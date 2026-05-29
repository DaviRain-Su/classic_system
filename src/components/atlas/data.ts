// 数据层 — 八卦、真实经文、各家经典、星图节点。
// 爻一律「自上而下」存储（index 0 = 上爻）：1 = 阳爻(实)，0 = 阴爻(断)，与渲染叠放一致。

export type TrigramKey = 'qian' | 'dui' | 'li' | 'zhen' | 'xun' | 'kan' | 'gen' | 'kun';
export type Line = 0 | 1;

export interface Trigram {
  key: TrigramKey;
  glyph: string;
  name: string;
  nature: string;
  lines: [Line, Line, Line];
}

// 八卦
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

// 先天 order，用于 8×8 方阵轴
export const TRIGRAM_ORDER: TrigramKey[] = ['qian', 'dui', 'li', 'zhen', 'xun', 'kan', 'gen', 'kun'];

// 真实经文（公有领域古籍原文）
export const TEXTS: Record<string, string> = {
  xici: '易有太极，是生两仪，两仪生四象，四象生八卦。',
  qianGua: '乾：元、亨、利、贞。',
  qianJiuWu: '九五：飞龙在天，利见大人。',
  qianXiang: '天行健，君子以自强不息。',
  kunXiang: '地势坤，君子以厚德载物。',
  dao1: '道可道，非常道；名可名，非常名。',
  dao25: '人法地，地法天，天法道，道法自然。',
  qingjing: '大道无形，生育天地；大道无情，运行日月；大道无名，长养万物。',
  xinjing: '色不异空，空不异色；色即是空，空即是色。',
  yangming: '无善无恶心之体，有善有恶意之动，知善知恶是良知，为善去恶是格物。',
};

// 易经 · 乾卦（完整、可交互）— yaos 自上而下
export interface YaoLine {
  pos: string;
  text: string;
  gloss?: string;
}
export interface QianData {
  id: string;
  name: string;
  full: string;
  symbol: string;
  gua: string;
  tuan: string;
  xiang: string;
  yaos: YaoLine[];
  yongjiu: YaoLine;
}
export const QIAN: QianData = {
  id: 'yi',
  name: '乾',
  full: '乾为天',
  symbol: '䷀',
  gua: '乾：元、亨、利、贞。',
  tuan: '大哉乾元，万物资始，乃统天。',
  xiang: '天行健，君子以自强不息。',
  yaos: [
    { pos: '上九', text: '亢龙有悔。', gloss: '居高思危，盈不可久。' },
    { pos: '九五', text: '飞龙在天，利见大人。', gloss: '德位相配，大有作为之时。' },
    { pos: '九四', text: '或跃在渊，无咎。', gloss: '进退之际，审时而动。' },
    { pos: '九三', text: '君子终日乾乾，夕惕若厉，无咎。', gloss: '勤勉自省，虽危无咎。' },
    { pos: '九二', text: '见龙在田，利见大人。', gloss: '才德初显，宜见贤者。' },
    { pos: '初九', text: '潜龙勿用。', gloss: '时机未至，宜藏锋蓄势。' },
  ],
  yongjiu: { pos: '用九', text: '见群龙无首，吉。' },
};

// 道德经 · 第一章（完整）
export interface DaoData {
  id: string;
  title: string;
  chapter: string;
  author: string;
  clauses: string[];
  chapters: string[];
  relation: string;
}
export const DAODE1: DaoData = {
  id: 'dao',
  title: '道德经',
  chapter: '第一章',
  author: '老子',
  clauses: [
    '道可道，非常道。',
    '名可名，非常名。',
    '无名天地之始；有名万物之母。',
    '故常无欲，以观其妙；常有欲，以观其徼。',
    '此两者，同出而异名，同谓之玄。',
    '玄之又玄，众妙之门。',
  ],
  chapters: ['第一章', '第二章', '第三章', '第四章', '第五章'],
  relation: '有无相生 · 与《易》之阴阳同源',
};

// 星图节点（坐标基于 1440×900 舞台）
export type NodeStatus = 'ready' | 'soon' | 'ghost';
export interface StarNode {
  id: string;
  kind?: 'core';
  x: number;
  y: number;
  glyph: string;
  name: string;
  sub?: string;
  author?: string;
  frag?: string;
  rel?: string;
  status: NodeStatus;
}
export const NODES: StarNode[] = [
  { id: 'yi', kind: 'core', x: 612, y: 462, glyph: '易', name: '易经 · 乾卦', sub: '系统思维 · 骨干', status: 'ready' },
  { id: 'dao', x: 1016, y: 232, glyph: '道', name: '道德经', author: '老子', frag: '道可道，非常道', rel: '阴阳 · 自然', status: 'ready' },
  { id: 'qj', x: 1226, y: 506, glyph: '清', name: '常清静经', author: '太上老君', frag: '大道无形，长养万物', rel: '清静 · 无为', status: 'soon' },
  { id: 'ru', x: 930, y: 724, glyph: '儒', name: '阳明心学', author: '王阳明', frag: '心外无物 · 知行合一', rel: '心性 · 良知', status: 'soon' },
  { id: 'fo', x: 296, y: 686, glyph: '佛', name: '心经', author: '般若部', frag: '色即是空，空即是色', rel: '空 · 无常', status: 'soon' },
  { id: 'west', x: 252, y: 250, glyph: '∅', name: '西方经典', author: '未来辐射', frag: '逻各斯 · 系统论 · ……', rel: '待连线', status: 'ghost' },
];
export const NODE_BY_ID: Record<string, StarNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));
