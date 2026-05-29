// 结构自检：八卦/六十四卦模式互异，错/综/交对合，互卦点验，并检查生成内容完整性。
// 运行：node --experimental-strip-types scripts/verify.ts
import { readFileSync } from 'node:fs';

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

// 4. 生成内容完整性：58 个非手工卦必须同时有原文与白话，避免回退到占位阅读。
const manualNums = new Set([1, 2, 11, 12, 63, 64]);
const expectedGenerated = Array.from({ length: 64 }, (_, i) => i + 1).filter((n) => !manualNums.has(n));
const file = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const hexRest = file('../src/components/atlas/hex-rest.ts');
const hexGloss = file('../src/components/atlas/hex-gloss.ts');
const generatedNums = [...hexRest.matchAll(/"num":\s*(\d+)/g)].map((m) => Number(m[1]));
const glossNums = [...hexGloss.matchAll(/^\s*(\d+):\s*\{/gm)].map((m) => Number(m[1]));
const generatedSet = new Set(generatedNums);
const glossSet = new Set(glossNums);

assert(generatedNums.length === 58, `hex-rest.ts 应含 58 个生成卦，实得 ${generatedNums.length}`);
assert(generatedSet.size === 58, 'hex-rest.ts 生成卦序应互异');
assert(glossNums.length === 58, `hex-gloss.ts 应含 58 个白话条目，实得 ${glossNums.length}`);
assert(glossSet.size === 58, 'hex-gloss.ts 白话卦序应互异');
for (const n of expectedGenerated) {
  assert(generatedSet.has(n), `hex-rest.ts 缺第 ${n} 卦`);
  assert(glossSet.has(n), `hex-gloss.ts 缺第 ${n} 卦白话`);
}
const app = file('../src/components/atlas/App.tsx');
assert(/const full = HEX_FULL_BY_PAIR/.test(app) && /mode: 'reading', id: String\(full\.num\), from/.test(app), 'openHex 应优先把 64 卦导向完整 ReadingGua 数据页');

// 5. 历代易注（卦辞级）覆盖：朱熹《周易本义》≥63、程颐《伊川易传》=64（御纂周易折中底本）。
const jizhu = file('../src/components/atlas/jizhu.ts');
const zhuCount = (jizhu.match(/"zhu":/g) || []).length;
const chengCount = (jizhu.match(/"cheng":/g) || []).length;
assert(zhuCount >= 63, `jizhu.ts 朱熹注应≥63 卦，实得 ${zhuCount}`);
assert(chengCount >= 64, `jizhu.ts 程颐注应=64 卦，实得 ${chengCount}`);

if (failures === 0) console.log('✓ 结构自检通过：八卦/六十四卦模式互异，错/综/交对合，互卦点验、64 卦内容完整性与历代易注覆盖正确。');
else throw new Error(`结构自检失败：共 ${failures} 项`);
