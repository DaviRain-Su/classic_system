// 六十四卦 name/number 表、由爻查卦、卦变、卦族(错/综/互/交)、爻位名。
// 爻自上而下：idx 0 = 上爻 … 5 = 初爻。
import { TRIGRAMS, type TrigramKey } from './data';

// HEX_NAMES[上卦][下卦] = [卦名, 序号(King Wen)]
export const HEX_NAMES: Record<TrigramKey, Record<TrigramKey, [string, number]>> = {
  qian: { qian: ['乾为天', 1], dui: ['天泽履', 10], li: ['天火同人', 13], zhen: ['天雷无妄', 25], xun: ['天风姤', 44], kan: ['天水讼', 6], gen: ['天山遁', 33], kun: ['天地否', 12] },
  dui: { qian: ['泽天夬', 43], dui: ['兑为泽', 58], li: ['泽火革', 49], zhen: ['泽雷随', 17], xun: ['泽风大过', 28], kan: ['泽水困', 47], gen: ['泽山咸', 31], kun: ['泽地萃', 45] },
  li: { qian: ['火天大有', 14], dui: ['火泽睽', 38], li: ['离为火', 30], zhen: ['火雷噬嗑', 21], xun: ['火风鼎', 50], kan: ['火水未济', 64], gen: ['火山旅', 56], kun: ['火地晋', 35] },
  zhen: { qian: ['雷天大壮', 34], dui: ['雷泽归妹', 54], li: ['雷火丰', 55], zhen: ['震为雷', 51], xun: ['雷风恒', 32], kan: ['雷水解', 40], gen: ['雷山小过', 62], kun: ['雷地豫', 16] },
  xun: { qian: ['风天小畜', 9], dui: ['风泽中孚', 61], li: ['风火家人', 37], zhen: ['风雷益', 42], xun: ['巽为风', 57], kan: ['风水涣', 59], gen: ['风山渐', 53], kun: ['风地观', 20] },
  kan: { qian: ['水天需', 5], dui: ['水泽节', 60], li: ['水火既济', 63], zhen: ['水雷屯', 3], xun: ['水风井', 48], kan: ['坎为水', 29], gen: ['水山蹇', 39], kun: ['水地比', 8] },
  gen: { qian: ['山天大畜', 26], dui: ['山泽损', 41], li: ['山火贲', 22], zhen: ['山雷颐', 27], xun: ['山风蛊', 18], kan: ['山水蒙', 4], gen: ['艮为山', 52], kun: ['山地剥', 23] },
  kun: { qian: ['地天泰', 11], dui: ['地泽临', 19], li: ['地火明夷', 36], zhen: ['地雷复', 24], xun: ['地风升', 46], kan: ['地水师', 7], gen: ['地山谦', 15], kun: ['坤为地', 2] },
};

export interface HexInfo {
  upper: TrigramKey;
  lower: TrigramKey;
  name: string;
  num: number;
  lines: number[];
}

// lines(top→bottom) → trigram key
const _L2T: Record<string, TrigramKey> = {};
(Object.values(TRIGRAMS) as { key: TrigramKey; lines: number[] }[]).forEach((t) => {
  _L2T[t.lines.join('')] = t.key;
});
export function trigramFromLines(lines: number[]): TrigramKey {
  return _L2T[lines.join('')];
}

export function hexInfo(upper: TrigramKey, lower: TrigramKey): HexInfo {
  const [name, num] = HEX_NAMES[upper][lower];
  return { upper, lower, name, num, lines: [...TRIGRAMS[upper].lines, ...TRIGRAMS[lower].lines] };
}

export function hexFromLines(lines: number[]): HexInfo {
  const upper = trigramFromLines(lines.slice(0, 3));
  const lower = trigramFromLines(lines.slice(3, 6));
  const [name, num] = HEX_NAMES[upper][lower];
  return { upper, lower, name, num, lines };
}

// 之卦: 翻转 idx 爻 (0=上 … 5=初)
export function bian(lines: number[], idx: number): HexInfo {
  const nl = lines.slice();
  nl[idx] = nl[idx] ? 0 : 1;
  return hexFromLines(nl);
}

// 卦族
const cuoLines = (lines: number[]) => lines.map((l) => (l ? 0 : 1)); // 错卦: 六爻全反
const zongLines = (lines: number[]) => lines.slice().reverse(); // 综卦: 上下颠倒
const huLines = (lines: number[]) => [lines[1], lines[2], lines[3], lines[2], lines[3], lines[4]]; // 互卦: 中四爻
const jiaoLines = (lines: number[]) => [...lines.slice(3, 6), ...lines.slice(0, 3)]; // 交卦: 上下卦换

export interface Relatives {
  cuo: HexInfo;
  zong: HexInfo;
  hu: HexInfo;
  jiao: HexInfo;
}
export function relatives(lines: number[]): Relatives {
  return {
    cuo: hexFromLines(cuoLines(lines)),
    zong: hexFromLines(zongLines(lines)),
    hu: hexFromLines(huLines(lines)),
    jiao: hexFromLines(jiaoLines(lines)),
  };
}

// 爻位名: idx 0=上爻 … 5=初爻；阳→九，阴→六。
const POS_TOP = ['上', '五', '四', '三', '二', '初'];
export function yaoName(idx: number, isYang: boolean): string {
  const order = idx === 0 ? '上' : idx === 5 ? '初' : POS_TOP[idx];
  const yy = isYang ? '九' : '六';
  return idx === 0 || idx === 5 ? order + yy : yy + order;
}
