// 引擎完整性自检（独立重算，与 lib/iching.ts 交叉验证）
// 运行：node --experimental-strip-types scripts/verify.ts
import { TRIGRAMS } from '../src/data/trigrams.ts';
import { RAW_HEXAGRAMS } from '../src/data/hexagrams.raw.ts';

type L = number;
const triLines = new Map<string, L[]>(TRIGRAMS.map((t) => [t.id, t.lines]));
const linesOf = (up: string, lo: string): L[] => {
  const u = triLines.get(up)!;
  const l = triLines.get(lo)!;
  return [l[0], l[1], l[2], u[0], u[1], u[2]];
};
const key = (a: L[]) => a.join('');
const flip = (a: L[]) => a.map((v) => (v ? 0 : 1));
const reverse = (a: L[]) => [...a].reverse();
const nuclear = (a: L[]) => [a[1], a[2], a[3], a[2], a[3], a[4]];

const hexes = RAW_HEXAGRAMS.map((r) => {
  const lines = linesOf(r.upper, r.lower);
  return { ...r, lines, key: key(lines) };
});
const idByKey = new Map<string, number>(hexes.map((h) => [h.key, h.id]));
const look = (a: L[]): number => {
  const id = idByKey.get(key(a));
  if (id === undefined) throw new Error('找不到卦：' + key(a));
  return id;
};

let failures = 0;
const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    failures++;
    console.error('✗ ' + msg);
  }
};

// 1. 64 卦齐备，序号唯一，二进制唯一
assert(hexes.length === 64, `应有 64 卦，实得 ${hexes.length}`);
const ids = new Set(hexes.map((h) => h.id));
for (let i = 1; i <= 64; i++) assert(ids.has(i), `缺少第 ${i} 卦`);
assert(idByKey.size === 64, '六爻二进制应有 64 种且唯一');

// 2. 错卦、综卦为对合（自反）
for (const h of hexes) {
  const opp = look(flip(h.lines));
  const oppLines = hexes.find((x) => x.id === opp)!.lines;
  assert(look(flip(oppLines)) === h.id, `错卦非对合：第 ${h.id} 卦`);
  const rev = look(reverse(h.lines));
  const revLines = hexes.find((x) => x.id === rev)!.lines;
  assert(look(reverse(revLines)) === h.id, `综卦非对合：第 ${h.id} 卦`);
}

// 3. 八个自综卦（综卦即自身）：乾坤颐大过坎离中孚小过
const selfReverse = hexes
  .filter((h) => look(reverse(h.lines)) === h.id)
  .map((h) => h.id)
  .sort((a, b) => a - b);
assert(
  JSON.stringify(selfReverse) === JSON.stringify([1, 2, 27, 28, 29, 30, 61, 62]),
  `自综卦应为 [1,2,27,28,29,30,61,62]，实得 [${selfReverse}]`,
);

// 4. 已知关系点验
assert(look(flip(linesOf('kun', 'qian'))) === 12 && look(reverse(linesOf('kun', 'qian'))) === 12, '泰之错综应皆为否');
assert(look(flip(linesOf('kan', 'li'))) === 64 && look(reverse(linesOf('kan', 'li'))) === 64, '既济之错综应皆为未济');
assert(look(nuclear(linesOf('qian', 'qian'))) === 1, '乾之互卦应为乾');
assert(look(nuclear(linesOf('kan', 'li'))) === 64, '既济之互卦应为未济');

if (failures === 0) {
  console.log('✓ 引擎自检全部通过：64 卦齐备，错/综卦自反，自综卦集合正确，关系点验通过。');
} else {
  throw new Error(`引擎自检失败：共 ${failures} 项`);
}
