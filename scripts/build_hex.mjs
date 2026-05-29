// 构建六十四卦原文数据（除已手工录入的 6 卦外的 58 卦）。
// 卦辞/爻辞：openqt/gua（简体，已校验）；彖/大象/小象：bollwarm/ZHOUYI（繁→简 opencc）。
// 卦序由本仓库 HEX_NAMES 经"上下卦"反查（不依赖 gua.index，其有错号）。
import fs from 'node:fs';
import * as OpenCC from 'opencc-js';
const t2s = OpenCC.Converter({ from: 't', to: 'cn' });

// ---- 本仓库权威卦表 HEX_NAMES → pair→{num,full} ----
const hexSrc = fs.readFileSync('src/components/atlas/hex.ts', 'utf8');
const m = hexSrc.match(/HEX_NAMES[^=]*=\s*(\{[\s\S]*?\n\};)/);
const HEX_NAMES = eval('(' + m[1].replace(/;\s*$/, '') + ')');
const pairToNum = {}, pairToFull = {};
for (const up of Object.keys(HEX_NAMES)) for (const lo of Object.keys(HEX_NAMES[up])) {
  const [full, num] = HEX_NAMES[up][lo];
  pairToNum[up + '_' + lo] = num; pairToFull[up + '_' + lo] = full;
}

// ---- gua source ----
const gua = JSON.parse(fs.readFileSync('/tmp/gua_data.json', 'utf8'));
const guaList = Array.isArray(gua) ? gua : Object.values(gua);
const TKEY = { 乾: 'qian', 坤: 'kun', 震: 'zhen', 巽: 'xun', 坎: 'kan', 离: 'li', 艮: 'gen', 兑: 'dui' };

// ---- ZHOUYI.pm → blocks[num-1] = {tuan, xiang[]} ----
// 收集两个《彖》之间的所有《象》（后段卦为爻辞/小象交替排版，故不要求连续）。
// 补异体字（opencc 未覆盖）：遯→遁 等。
const fixVariants = (s) => s.replace(/遯/g, '遁');
const raw = fixVariants(t2s(fs.readFileSync('/tmp/zy1/lib/ZHOUYI.pm', 'utf8')));
const blocks = []; let cur = null;
for (const line of raw.split('\n').map((l) => l.trim())) {
  if (line.startsWith('《彖》曰：')) { cur = { tuan: line.slice(5), xiang: [] }; blocks.push(cur); }
  else if (cur && line.startsWith('《象》曰：')) { cur.xiang.push(line.slice(5)); }
}
if (blocks.length !== 64) throw new Error('彖块数应为 64，实得 ' + blocks.length);

const sym = (num) => String.fromCodePoint(0x4dc0 + num - 1);

function buildHex(e) {
  const parts = e.short.split(/\s+/);
  const tm = parts[1].match(/(.)上(.)下/);
  const upper = TKEY[tm[1]], lower = TKEY[tm[2]];
  const num = pairToNum[upper + '_' + lower];
  if (!num) throw new Error('查不到卦序: ' + e.name + ' ' + e.short);
  const b = blocks[num - 1];
  const daxiang = b.xiang[0];
  const xiao = b.xiang.slice(1, 7); // 6 小象, 初→上
  const yaos = e.yao.map((y, k) => { // top→bottom
    const ci = y.text.indexOf('，');
    return { pos: y.text.slice(0, ci), text: y.text.slice(ci + 1), xiang: '象曰：' + xiao[5 - k] };
  });
  return { name: e.name, full: pairToFull[upper + '_' + lower], symbol: sym(num), num, upper, lower, gua: e.text, guaGloss: e.desc, tuan: b.tuan, xiang: daxiang, yaos };
}

const all = guaList.map(buildHex);
const byNum = {}; for (const h of all) byNum[h.num] = h;
for (let i = 1; i <= 64; i++) if (!byNum[i]) throw new Error('缺卦序 ' + i);

// 端到端校验：与设计已确认的 6 卦比对
const norm = (s) => (s || '').replace(/[，。、；：！？\s,.!?:;“”"《》]/g, '');
const checks = { 1: ['天行健，君子以自强不息', 'xiang'], 2: ['地势坤，君子以厚德载物', 'xiang'], 11: ['地天泰', 'full'], 12: ['天地否', 'full'], 63: ['既济', 'name'], 64: ['未济', 'name'] };
let bad = 0;
for (const [n, [v, k]] of Object.entries(checks)) { if (!norm(byNum[+n][k]).includes(norm(v))) { bad++; console.log('✗ #' + n + ' ' + k + '=[' + byNum[+n][k] + '] 期望含 [' + v + ']'); } }
console.log(bad === 0 ? '✓ 端到端校验通过（大象/全名/卦名 与设计一致）' : '✗ ' + bad + ' 项不符');

const existing = new Set([1, 2, 11, 12, 63, 64]);
const rest = [];
for (let n = 1; n <= 64; n++) if (!existing.has(n)) rest.push(byNum[n]);
for (const h of rest) { if (h.yaos.length !== 6 || !h.upper || !h.lower || !h.tuan || !h.xiang) throw new Error('字段缺失 @' + h.num); }
console.log('生成卦数:', rest.length, '(应 58)');

const ts = '// 自动生成：六十四卦原文（除乾坤泰否既济未济外的 58 卦）。详见 scripts/build_hex.mjs。\n'
  + '// 卦辞/爻辞：openqt/gua（简体，已对 6 卦端到端校验）；彖/大象/小象：bollwarm/ZHOUYI（繁→简 opencc-js）。\n'
  + '// guaGloss 为 gua 源编辑性简介；逐爻白话(gloss)待后续录入。\n'
  + "import type { FullHex } from './data';\n\n"
  + 'export const HEX_REST: FullHex[] = ' + JSON.stringify(rest, null, 1) + ';\n';
fs.writeFileSync('src/components/atlas/hex-rest.ts', ts);
console.log('已写 src/components/atlas/hex-rest.ts (' + ts.length + ' bytes)');
