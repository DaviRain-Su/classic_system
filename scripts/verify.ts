// 结构自检（独立重算，与 components/atlas/hex.ts 交叉验证）
// 运行：node --experimental-strip-types scripts/verify.ts
import { TRIGRAMS, TRIGRAM_ORDER, type TrigramKey } from '../src/components/atlas/data.ts';

let failures = 0;
const assert = (cond: boolean, msg: string) => { if (!cond) { failures++; console.error('✗ ' + msg); } };

// 1. 八卦：8 个互异的 3 位模式
const triPatterns = new Set(Object.values(TRIGRAMS).map((t) => t.lines.join('')));
assert(triPatterns.size === 8, `八卦应有 8 个互异模式，实得 ${triPatterns.size}`);

// 2. 64 卦（上×下）= 64 个互异的 6 位模式
const order = TRIGRAM_ORDER;
const hexPatterns = new Set<string>();
for (const up of order) for (const lo of order) {
  hexPatterns.add([...TRIGRAMS[up].lines, ...TRIGRAMS[lo].lines].join(''));
}
assert(hexPatterns.size === 64, `六十四卦应有 64 个互异模式，实得 ${hexPatterns.size}`);

// 3. 卦族算法（自上而下）：错/综/交 为对合，互卦对已知例正确
const cuo = (l: number[]) => l.map((x) => (x ? 0 : 1));
const zong = (l: number[]) => l.slice().reverse();
const jiao = (l: number[]) => [...l.slice(3, 6), ...l.slice(0, 3)];
const hu = (l: number[]) => [l[1], l[2], l[3], l[2], l[3], l[4]];
const linesOf = (up: TrigramKey, lo: TrigramKey) => [...TRIGRAMS[up].lines, ...TRIGRAMS[lo].lines];
const eq = (a: number[], b: number[]) => a.join('') === b.join('');

for (const up of order) for (const lo of order) {
  const L = linesOf(up, lo);
  assert(eq(cuo(cuo(L)), L), `错卦非对合：${up}/${lo}`);
  assert(eq(zong(zong(L)), L), `综卦非对合：${up}/${lo}`);
  assert(eq(jiao(jiao(L)), L), `交卦非对合：${up}/${lo}`);
}
// 既济(坎上离下) 互卦 = 未济(离上坎下)
assert(eq(hu(linesOf('kan', 'li')), linesOf('li', 'kan')), '既济之互卦应为未济');
// 乾错坤、乾交乾
assert(eq(cuo(linesOf('qian', 'qian')), linesOf('kun', 'kun')), '乾之错卦应为坤');
assert(eq(jiao(linesOf('qian', 'qian')), linesOf('qian', 'qian')), '乾之交卦应为乾');

if (failures === 0) {
  console.log('✓ 结构自检通过：八卦/六十四卦模式互异，错/综/交对合，互卦点验正确。');
} else {
  throw new Error(`结构自检失败：共 ${failures} 项`);
}
