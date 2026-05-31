// ════════════════════════════════════════════════════════════════════════
// src/components/atlas/learn/widgets/_glyph.tsx
// 讲解层交互件共用：设计令牌 + 爻/卦渲染 + 八卦/六十四卦名表。
// 这是本地 helper，不是 widget——【不要】加进 widgets/index.ts barrel。
// 约定（§3.2）：本模块【自下而上】，index 0 = 初爻。不与 hex.ts（自上而下）混用。
// 适配（§3.3）：--line → --hair-2、--surface → --paper-2（本仓库等价令牌）。
// 可选优化（§3.1）：TRI / N64 可改为从 data.ts / hex.ts 复用（反转爻序后），
//   此处自带以保持各件独立、零外部依赖。
// ════════════════════════════════════════════════════════════════════════
import { type CSSProperties } from "react";

export const T = {
  paper: "var(--paper, #f7f6f4)",
  ink: "var(--ink, #1b1b19)",
  accent: "var(--accent, #3a5f5a)",
  seal: "var(--seal, #9c3a2f)",
  soft: "var(--accent-soft, #eef1f0)",
  line: "var(--hair-2, #d3cec2)",
  surface: "var(--paper-2, #fdfcfa)",
  serif: "var(--font-serif, 'Noto Serif SC', serif)",
  mono: "var(--font-mono, 'Space Mono', monospace)",
};
export const muted = (c: string = T.ink): CSSProperties => ({ color: c, opacity: 0.55 });
export const card: CSSProperties = { background: T.surface, border: `1px solid ${T.line}`, borderRadius: 8, padding: 16 };

export type Line = 0 | 1;
export type Hex = [Line, Line, Line, Line, Line, Line]; // index 0 = 初爻

// 八卦 key = 初中上（自下而上），阳=1 阴=0
export const TRI: Record<string, { n: string; s: string; x: string; de: string; fam: string; wei: string; wx: string; song: string }> = {
  "111": { n: "乾", s: "☰", x: "天", de: "健", fam: "父", wei: "南", wx: "金", song: "乾三连" },
  "110": { n: "兑", s: "☱", x: "泽", de: "悦", fam: "少女", wei: "东南", wx: "金", song: "兑上缺" },
  "101": { n: "离", s: "☲", x: "火", de: "丽", fam: "中女", wei: "东", wx: "火", song: "离中虚" },
  "100": { n: "震", s: "☳", x: "雷", de: "动", fam: "长男", wei: "东北", wx: "木", song: "震仰盂" },
  "011": { n: "巽", s: "☴", x: "风", de: "入", fam: "长女", wei: "西南", wx: "木", song: "巽下断" },
  "010": { n: "坎", s: "☵", x: "水", de: "陷", fam: "中男", wei: "西", wx: "水", song: "坎中满" },
  "001": { n: "艮", s: "☶", x: "山", de: "止", fam: "少男", wei: "西北", wx: "土", song: "艮覆碗" },
  "000": { n: "坤", s: "☷", x: "地", de: "顺", fam: "母", wei: "北", wx: "土", song: "坤六断" },
};

// 六十四卦名 [上卦][下卦]
export const N64: Record<string, Record<string, string>> = {
  乾: { 乾: "乾为天", 兑: "天泽履", 离: "天火同人", 震: "天雷无妄", 巽: "天风姤", 坎: "天水讼", 艮: "天山遁", 坤: "天地否" },
  兑: { 乾: "泽天夬", 兑: "兑为泽", 离: "泽火革", 震: "泽雷随", 巽: "泽风大过", 坎: "泽水困", 艮: "泽山咸", 坤: "泽地萃" },
  离: { 乾: "火天大有", 兑: "火泽睽", 离: "离为火", 震: "火雷噬嗑", 巽: "火风鼎", 坎: "火水未济", 艮: "火山旅", 坤: "火地晋" },
  震: { 乾: "雷天大壮", 兑: "雷泽归妹", 离: "雷火丰", 震: "震为雷", 巽: "雷风恒", 坎: "雷水解", 艮: "雷山小过", 坤: "雷地豫" },
  巽: { 乾: "风天小畜", 兑: "风泽中孚", 离: "风火家人", 震: "风雷益", 巽: "巽为风", 坎: "风水涣", 艮: "风山渐", 坤: "风地观" },
  坎: { 乾: "水天需", 兑: "水泽节", 离: "水火既济", 震: "水雷屯", 巽: "水风井", 坎: "坎为水", 艮: "水山蹇", 坤: "水地比" },
  艮: { 乾: "山天大畜", 兑: "山泽损", 离: "山火贲", 震: "山雷颐", 巽: "山风蛊", 坎: "山水蒙", 艮: "艮为山", 坤: "山地剥" },
  坤: { 乾: "地天泰", 兑: "地泽临", 离: "地火明夷", 震: "地雷复", 巽: "地风升", 坎: "地水师", 艮: "地山谦", 坤: "坤为地" },
};
export const triKey = (a: Line, b: Line, c: Line) => `${a}${b}${c}`;
export const nameOf = (l: Hex) => N64[TRI[triKey(l[3], l[4], l[5])].n][TRI[triKey(l[0], l[1], l[2])].n];

export function Yao({ yang, w = 150, h = 12, color }: { yang: boolean; w?: number; h?: number; color?: string }) {
  const c = color ?? (yang ? T.seal : T.ink);
  if (yang) return <div style={{ height: h, width: w, background: c, borderRadius: 2 }} />;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: w }}>
      <div style={{ height: h, width: "42%", background: c, borderRadius: 2 }} />
      <div style={{ height: h, width: "42%", background: c, borderRadius: 2 }} />
    </div>
  );
}
export function Gua({ lines, w = 110, h = 11 }: { lines: Hex; w?: number; h?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {[5, 4, 3, 2, 1, 0].map((i) => <Yao key={i} yang={lines[i] === 1} w={w} h={h} />)}
    </div>
  );
}
