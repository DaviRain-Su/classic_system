import type { LineValue } from '../lib/iching';

/**
 * 八卦（经卦）定义。
 * lines 为三爻，自下而上（index 0 = 初爻 / 最下，index 2 = 最上）。
 * 1 = 阳爻（—），0 = 阴爻（- -）。
 */
export interface Trigram {
  id: string; // 拼音标识，用于程序引用
  name: string; // 卦名
  symbol: string; // Unicode 卦象符号
  nature: string; // 自然象（天地雷风水火山泽）
  attribute: string; // 卦德（健顺动入陷丽止说）
  family: string; // 家庭象（父母六子）
  direction: string; // 后天八卦方位
  mnemonic: string; // 取象口诀
  lines: [LineValue, LineValue, LineValue]; // 自下而上
}

export const TRIGRAMS: Trigram[] = [
  { id: 'qian', name: '乾', symbol: '☰', nature: '天', attribute: '健', family: '父', direction: '西北', mnemonic: '乾三连', lines: [1, 1, 1] },
  { id: 'kun', name: '坤', symbol: '☷', nature: '地', attribute: '顺', family: '母', direction: '西南', mnemonic: '坤六断', lines: [0, 0, 0] },
  { id: 'zhen', name: '震', symbol: '☳', nature: '雷', attribute: '动', family: '长男', direction: '东', mnemonic: '震仰盂', lines: [1, 0, 0] },
  { id: 'kan', name: '坎', symbol: '☵', nature: '水', attribute: '陷', family: '中男', direction: '北', mnemonic: '坎中满', lines: [0, 1, 0] },
  { id: 'gen', name: '艮', symbol: '☶', nature: '山', attribute: '止', family: '少男', direction: '东北', mnemonic: '艮覆碗', lines: [0, 0, 1] },
  { id: 'xun', name: '巽', symbol: '☴', nature: '风', attribute: '入', family: '长女', direction: '东南', mnemonic: '巽下断', lines: [0, 1, 1] },
  { id: 'li', name: '离', symbol: '☲', nature: '火', attribute: '丽', family: '中女', direction: '南', mnemonic: '离中虚', lines: [1, 0, 1] },
  { id: 'dui', name: '兑', symbol: '☱', nature: '泽', attribute: '说', family: '少女', direction: '西', mnemonic: '兑上缺', lines: [1, 1, 0] },
];

/** 先天八卦次序（用于 64 卦方阵的轴排列）：乾兑离震巽坎艮坤 */
export const XIANTIAN_ORDER = ['qian', 'dui', 'li', 'zhen', 'xun', 'kan', 'gen', 'kun'];
