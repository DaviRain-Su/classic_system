// 结构自检（自包含、独立于源码）：八卦/六十四卦模式互异，错/综/交对合，互卦点验。
// 运行：node --experimental-strip-types scripts/verify.ts

type Key = 'qian' | 'dui' | 'li' | 'zhen' | 'xun' | 'kan' | 'gen' | 'kun';
const LINES: Record<Key, number[]> = {
  qian: [1, 1, 1], dui: [0, 1, 1], li: [1, 0, 1], zhen: [0, 0, 1],
  xun: [1, 1, 0], kan: [0, 1, 0], gen: [1, 0, 0], kun: [0, 0, 0],
};
const ORDER: Key[] = ['qian', 'dui', 'li', 'zhen', 'xun', 'kan', 'gen', 'kun'];

let failures = 0;
const assert = (cond: boolean, msg: string) => { if (!cond) { failures++; console.error('✗ ' + msg); } };

// 1. 八卦：8 个互异 3 位模式
assert(new Set(Object.values(LINES).map((l) => l.join(''))).size === 8, '八卦应有 8 个互异模式');

// 2. 64 卦（上×下）= 64 个互异 6 位模式
const hexPatterns = new Set<string>();
for (const up of ORDER) for (const lo of ORDER) hexPatterns.add([...LINES[up], ...LINES[lo]].join(''));
assert(hexPatterns.size === 64, `六十四卦应有 64 个互异模式，实得 ${hexPatterns.size}`);

// 3. 卦族算法（自上而下）：错/综/交 对合，互卦点验
const cuo = (l: number[]) => l.map((x) => (x ? 0 : 1));
const zong = (l: number[]) => l.slice().reverse();
const jiao = (l: number[]) => [...l.slice(3, 6), ...l.slice(0, 3)];
const hu = (l: number[]) => [l[1], l[2], l[3], l[2], l[3], l[4]];
const linesOf = (up: Key, lo: Key) => [...LINES[up], ...LINES[lo]];
const eq = (a: number[], b: number[]) => a.join('') === b.join('');

for (const up of ORDER) for (const lo of ORDER) {
  const L = linesOf(up, lo);
  assert(eq(cuo(cuo(L)), L), `错卦非对合：${up}/${lo}`);
  assert(eq(zong(zong(L)), L), `综卦非对合：${up}/${lo}`);
  assert(eq(jiao(jiao(L)), L), `交卦非对合：${up}/${lo}`);
}
assert(eq(hu(linesOf('kan', 'li')), linesOf('li', 'kan')), '既济之互卦应为未济');
assert(eq(cuo(linesOf('qian', 'qian')), linesOf('kun', 'kun')), '乾之错卦应为坤');
assert(eq(jiao(linesOf('qian', 'qian')), linesOf('qian', 'qian')), '乾之交卦应为乾');

if (failures === 0) console.log('✓ 结构自检通过：八卦/六十四卦模式互异，错/综/交对合，互卦点验正确。');
else throw new Error(`结构自检失败：共 ${failures} 项`);
