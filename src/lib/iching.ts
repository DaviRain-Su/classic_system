import { TRIGRAMS, type Trigram } from '../data/trigrams';
import { RAW_HEXAGRAMS } from '../data/hexagrams.raw';

/** 0 = 阴爻（- -），1 = 阳爻（—） */
export type LineValue = 0 | 1;

/** 六爻，自下而上：index 0 = 初爻（最下），index 5 = 上爻（最上） */
export type Lines = [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue];

export interface Hexagram {
  id: number; // 1–64，《周易》序卦次序
  name: string; // 卦名，如「屯」
  alias?: string; // 别名，如「习坎」
  fullName: string; // 全名，如「水雷屯」「乾为天」
  upper: string; // 上卦 trigram id
  lower: string; // 下卦 trigram id
  lines: Lines; // 六爻（自下而上）
  key: string; // 二进制键，自下而上，如 "111111"
  // —— 卦变关系（指向相关卦的序号 id）——
  opposite: number; // 错卦（旁通）：六爻全变
  reverse: number; // 综卦（反对）：整卦颠倒
  nuclear: number; // 互卦：取二三四爻为下、三四五爻为上
}

// —— 八卦查询 ——
const trigramByLines = new Map<string, Trigram>();
const trigramById = new Map<string, Trigram>();
for (const t of TRIGRAMS) {
  trigramByLines.set(t.lines.join(''), t);
  trigramById.set(t.id, t);
}

export function getTrigram(id: string): Trigram {
  const t = trigramById.get(id);
  if (!t) throw new Error(`未知卦：${id}`);
  return t;
}

export function trigramOfLines(three: LineValue[]): Trigram {
  const t = trigramByLines.get(three.join(''));
  if (!t) throw new Error(`未知三爻组合：${three.join('')}`);
  return t;
}

// —— 由上下卦推导六爻（下卦在内 / 下，上卦在外 / 上）——
function linesFrom(upperId: string, lowerId: string): Lines {
  const u = getTrigram(upperId).lines;
  const l = getTrigram(lowerId).lines;
  return [l[0], l[1], l[2], u[0], u[1], u[2]];
}

const keyOf = (l: readonly LineValue[]): string => l.join('');
const flipAll = (l: Lines): Lines => l.map((v) => (v ? 0 : 1)) as Lines; // 错卦
const turnOver = (l: Lines): Lines => [...l].reverse() as Lines; // 综卦
// 互卦：下互 = 二三四爻，上互 = 三四五爻
const nuclearOf = (l: Lines): Lines => [l[1], l[2], l[3], l[2], l[3], l[4]];

function fullNameOf(name: string, upperId: string, lowerId: string): string {
  if (upperId === lowerId) {
    // 八纯卦：「X 为 自然象」
    return `${getTrigram(upperId).name}为${getTrigram(upperId).nature}`;
  }
  return `${getTrigram(upperId).nature}${getTrigram(lowerId).nature}${name}`;
}

// —— 构建全部 64 卦 ——
const idByKey = new Map<string, number>();
const baseList = RAW_HEXAGRAMS.map((r) => {
  const lines = linesFrom(r.upper, r.lower);
  return { raw: r, lines, key: keyOf(lines) };
});
for (const b of baseList) idByKey.set(b.key, b.raw.id);

function lookupId(lines: Lines): number {
  const id = idByKey.get(keyOf(lines));
  if (id === undefined) throw new Error(`找不到卦：${keyOf(lines)}`);
  return id;
}

export const HEXAGRAMS: Hexagram[] = baseList.map(({ raw, lines, key }) => ({
  id: raw.id,
  name: raw.name,
  alias: raw.alias,
  fullName: fullNameOf(raw.name, raw.upper, raw.lower),
  upper: raw.upper,
  lower: raw.lower,
  lines,
  key,
  opposite: lookupId(flipAll(lines)),
  reverse: lookupId(turnOver(lines)),
  nuclear: lookupId(nuclearOf(lines)),
}));

const hexById = new Map<number, Hexagram>();
const hexByKey = new Map<string, Hexagram>();
for (const h of HEXAGRAMS) {
  hexById.set(h.id, h);
  hexByKey.set(h.key, h);
}

export function getHexagram(id: number): Hexagram {
  const h = hexById.get(id);
  if (!h) throw new Error(`未知卦序：${id}`);
  return h;
}

export function hexagramByLines(lines: Lines): Hexagram {
  const h = hexByKey.get(keyOf(lines));
  if (!h) throw new Error(`找不到卦：${keyOf(lines)}`);
  return h;
}

/** 由上下卦 id 取卦（用于 64 卦方阵） */
export function hexagramByTrigrams(upperId: string, lowerId: string): Hexagram {
  return hexagramByLines(linesFrom(upperId, lowerId));
}

/**
 * 爻题：阳爻称「九」，阴爻称「六」；
 * 最下为「初」，最上为「上」，其余按位次。
 * 例：初九、九二、六三、上六。
 */
export function yaoTitle(index: number, value: LineValue): string {
  const yinYang = value ? '九' : '六';
  if (index === 0) return `初${yinYang}`;
  if (index === 5) return `上${yinYang}`;
  const pos = ['二', '三', '四', '五'][index - 1];
  return `${yinYang}${pos}`;
}
