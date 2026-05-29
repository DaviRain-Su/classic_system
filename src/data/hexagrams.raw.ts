/**
 * 六十四卦原始数据（《周易》通行本序卦次序）。
 *
 * 只记录最小事实：序号、卦名、上卦、下卦（trigram id）。
 * 六爻、二进制、错卦 / 综卦 / 互卦等一律由 lib/iching.ts 程序推导，
 * 以保证结构正确、零手抄误差。
 */
export interface RawHexagram {
  id: number;
  name: string;
  upper: string; // 上卦 trigram id
  lower: string; // 下卦 trigram id
  alias?: string; // 别名（如「习坎」）
}

export const RAW_HEXAGRAMS: RawHexagram[] = [
  { id: 1, name: '乾', upper: 'qian', lower: 'qian' },
  { id: 2, name: '坤', upper: 'kun', lower: 'kun' },
  { id: 3, name: '屯', upper: 'kan', lower: 'zhen' },
  { id: 4, name: '蒙', upper: 'gen', lower: 'kan' },
  { id: 5, name: '需', upper: 'kan', lower: 'qian' },
  { id: 6, name: '讼', upper: 'qian', lower: 'kan' },
  { id: 7, name: '师', upper: 'kun', lower: 'kan' },
  { id: 8, name: '比', upper: 'kan', lower: 'kun' },
  { id: 9, name: '小畜', upper: 'xun', lower: 'qian' },
  { id: 10, name: '履', upper: 'qian', lower: 'dui' },
  { id: 11, name: '泰', upper: 'kun', lower: 'qian' },
  { id: 12, name: '否', upper: 'qian', lower: 'kun' },
  { id: 13, name: '同人', upper: 'qian', lower: 'li' },
  { id: 14, name: '大有', upper: 'li', lower: 'qian' },
  { id: 15, name: '谦', upper: 'kun', lower: 'gen' },
  { id: 16, name: '豫', upper: 'zhen', lower: 'kun' },
  { id: 17, name: '随', upper: 'dui', lower: 'zhen' },
  { id: 18, name: '蛊', upper: 'gen', lower: 'xun' },
  { id: 19, name: '临', upper: 'kun', lower: 'dui' },
  { id: 20, name: '观', upper: 'xun', lower: 'kun' },
  { id: 21, name: '噬嗑', upper: 'li', lower: 'zhen' },
  { id: 22, name: '贲', upper: 'gen', lower: 'li' },
  { id: 23, name: '剥', upper: 'gen', lower: 'kun' },
  { id: 24, name: '复', upper: 'kun', lower: 'zhen' },
  { id: 25, name: '无妄', upper: 'qian', lower: 'zhen' },
  { id: 26, name: '大畜', upper: 'gen', lower: 'qian' },
  { id: 27, name: '颐', upper: 'gen', lower: 'zhen' },
  { id: 28, name: '大过', upper: 'dui', lower: 'xun' },
  { id: 29, name: '坎', upper: 'kan', lower: 'kan', alias: '习坎' },
  { id: 30, name: '离', upper: 'li', lower: 'li' },
  { id: 31, name: '咸', upper: 'dui', lower: 'gen' },
  { id: 32, name: '恒', upper: 'zhen', lower: 'xun' },
  { id: 33, name: '遁', upper: 'qian', lower: 'gen' },
  { id: 34, name: '大壮', upper: 'zhen', lower: 'qian' },
  { id: 35, name: '晋', upper: 'li', lower: 'kun' },
  { id: 36, name: '明夷', upper: 'kun', lower: 'li' },
  { id: 37, name: '家人', upper: 'xun', lower: 'li' },
  { id: 38, name: '睽', upper: 'li', lower: 'dui' },
  { id: 39, name: '蹇', upper: 'kan', lower: 'gen' },
  { id: 40, name: '解', upper: 'zhen', lower: 'kan' },
  { id: 41, name: '损', upper: 'gen', lower: 'dui' },
  { id: 42, name: '益', upper: 'xun', lower: 'zhen' },
  { id: 43, name: '夬', upper: 'dui', lower: 'qian' },
  { id: 44, name: '姤', upper: 'qian', lower: 'xun' },
  { id: 45, name: '萃', upper: 'dui', lower: 'kun' },
  { id: 46, name: '升', upper: 'kun', lower: 'xun' },
  { id: 47, name: '困', upper: 'dui', lower: 'kan' },
  { id: 48, name: '井', upper: 'kan', lower: 'xun' },
  { id: 49, name: '革', upper: 'dui', lower: 'li' },
  { id: 50, name: '鼎', upper: 'li', lower: 'xun' },
  { id: 51, name: '震', upper: 'zhen', lower: 'zhen' },
  { id: 52, name: '艮', upper: 'gen', lower: 'gen' },
  { id: 53, name: '渐', upper: 'xun', lower: 'gen' },
  { id: 54, name: '归妹', upper: 'zhen', lower: 'dui' },
  { id: 55, name: '丰', upper: 'zhen', lower: 'li' },
  { id: 56, name: '旅', upper: 'li', lower: 'gen' },
  { id: 57, name: '巽', upper: 'xun', lower: 'xun' },
  { id: 58, name: '兑', upper: 'dui', lower: 'dui' },
  { id: 59, name: '涣', upper: 'xun', lower: 'kan' },
  { id: 60, name: '节', upper: 'kan', lower: 'dui' },
  { id: 61, name: '中孚', upper: 'xun', lower: 'dui' },
  { id: 62, name: '小过', upper: 'zhen', lower: 'gen' },
  { id: 63, name: '既济', upper: 'kan', lower: 'li' },
  { id: 64, name: '未济', upper: 'li', lower: 'kan' },
];
