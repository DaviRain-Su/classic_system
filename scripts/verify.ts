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

// 5. 历代易注（御纂周易折中底本）：卦辞级朱熹/程颐皆 64 卦；爻级集注每卦齐备（乾坤 7 含用九/用六，余 6）。
const JIZHU = JSON.parse(file('../src/components/atlas/jizhu.ts').match(/JIZHU[^=]*=\s*(\{[\s\S]*\});/)![1]) as Record<string, { zhu?: string; cheng?: string; yao?: Record<string, { zhu?: string; cheng?: string }> }>;
let cardZhu = 0, cardCheng = 0, yaoTotal = 0;
for (let n = 1; n <= 64; n++) {
  const e = JIZHU[n] || {};
  if (e.zhu) cardZhu++;
  if (e.cheng) cardCheng++;
  const ks = Object.keys(e.yao || {});
  yaoTotal += ks.length;
  assert(ks.length >= (n === 1 || n === 2 ? 7 : 6), `jizhu.ts 第 ${n} 卦爻级集注不足（实得 ${ks.length}）`);
}
assert(cardZhu === 64, `jizhu.ts 朱熹卦辞注应=64 卦，实得 ${cardZhu}`);
assert(cardCheng === 64, `jizhu.ts 程颐卦辞注应=64 卦，实得 ${cardCheng}`);
assert(yaoTotal === 386, `jizhu.ts 爻级集注应=386 条（62×6+乾坤各7），实得 ${yaoTotal}`);
assert(!!JIZHU[1].yao?.['用九'] && !!JIZHU[2].yao?.['用六'], 'jizhu.ts 乾用九/坤用六爻注应齐备');

// 6. 义理白话（hex-yili.ts，本项目原创简译）：彖、大象 64 全备（小象逐阶段补）。
const yili = file('../src/components/atlas/hex-yili.ts');
const tuanN = (yili.match(/tuan:/g) || []).length;
const daxiangN = (yili.match(/daxiang:/g) || []).length;
const xiaoN = (yili.match(/^\s+\d+: \[/gm) || []).length;
assert(tuanN === 64, `hex-yili.ts 彖白话应=64 卦，实得 ${tuanN}`);
assert(daxiangN === 64, `hex-yili.ts 大象白话应=64 卦，实得 ${daxiangN}`);
assert(xiaoN === 64, `hex-yili.ts 小象白话应=64 卦，实得 ${xiaoN}`);

// 7. 十翼全文：独立全文底本必须保留，精读页可继续使用带白话的选段数据。
const tenWings = file('../src/components/atlas/ten-wings.ts');
for (const name of ['文言传 · 乾', '文言传 · 坤', '系辞上传', '系辞下传', '说卦传', '序卦传', '杂卦传']) {
  assert(tenWings.includes(`"name": "${name}"`), `ten-wings.ts 缺 ${name}`);
}
for (const text of ['一阴一阳之谓道', '有太极，是生两仪', '天地定位，山泽通气', '有天地，然后万物生焉', '《乾》刚《坤》柔']) {
  assert(tenWings.includes(text), `ten-wings.ts 缺关键经文：${text}`);
}

if (failures === 0) console.log('✓ 结构自检通过：八卦/六十四卦模式互异，错/综/交对合，互卦点验、64 卦内容完整性、十翼全文与历代易注（卦辞级+爻级 386 条）覆盖正确。');
else throw new Error(`结构自检失败：共 ${failures} 项`);
