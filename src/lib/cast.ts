import { hexagramByLines, type Lines, type LineValue, type Hexagram } from './iching';

/** 四象：6 老阴、7 少阳、8 少阴、9 老阳。老阴 / 老阳为「动爻」，将变。 */
export type YaoType = 6 | 7 | 8 | 9;

export interface CastLine {
  type: YaoType;
  coins: [number, number, number]; // 三枚铜钱点数（反=2，正=3）
  value: LineValue; // 本卦此爻的阴阳
  changing: boolean; // 是否为动爻
}

export interface CastResult {
  lines: CastLine[]; // 六爻，自下而上（初 → 上）
  primary: Lines; // 本卦
  resulting: Lines; // 之卦（动爻变化后）
  changingIndexes: number[]; // 动爻位置（0 = 初爻）
}

export const YAO_INFO: Record<YaoType, { label: string; symbol: string; changing: boolean }> = {
  6: { label: '老阴', symbol: '✗', changing: true },
  7: { label: '少阳', symbol: '', changing: false },
  8: { label: '少阴', symbol: '', changing: false },
  9: { label: '老阳', symbol: '○', changing: true },
};

/** 掷一枚铜钱：反面 2，正面 3 */
function tossCoin(): 2 | 3 {
  return Math.random() < 0.5 ? 2 : 3;
}

/** 掷三枚铜钱成一爻，点数和为 6–9 */
export function tossLine(): CastLine {
  const coins: [number, number, number] = [tossCoin(), tossCoin(), tossCoin()];
  const sum = (coins[0] + coins[1] + coins[2]) as YaoType;
  const value: LineValue = sum === 7 || sum === 9 ? 1 : 0;
  return { type: sum, coins, value, changing: YAO_INFO[sum].changing };
}

/** 完整起一卦：自下而上掷六爻 */
export function castHexagram(): CastResult {
  const lines = Array.from({ length: 6 }, () => tossLine());
  const primary = lines.map((l) => l.value) as Lines;
  const resulting = lines.map((l) => (l.changing ? ((l.value ? 0 : 1) as LineValue) : l.value)) as Lines;
  const changingIndexes = lines.map((l, i) => (l.changing ? i : -1)).filter((i) => i >= 0);
  return { lines, primary, resulting, changingIndexes };
}

/** 取本卦与之卦对应的卦对象 */
export function resolveCast(result: CastResult): { primary: Hexagram; resulting: Hexagram | null } {
  const primary = hexagramByLines(result.primary);
  const resulting = result.changingIndexes.length > 0 ? hexagramByLines(result.resulting) : null;
  return { primary, resulting };
}
