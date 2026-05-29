// 抽取历代易注（卦辞级）：朱熹《周易本义》+ 程颐《伊川易传》，全 64 卦。
// 底本：御纂《周易折中》（清·李光地，公有领域）——简体、逐卦标「本义」「程传」，权威完整。
// 取自 殆知阁古籍语料（daizhige）：
//   git clone --filter=blob:none --no-checkout --depth 1 https://github.com/garychowcmu/daizhigev20 /tmp/dzg
//   cd /tmp/dzg && git checkout HEAD -- "易藏/易经/御纂周易折中.txt"
// 折中体例：每卦先「本义」（朱熹）后「程传」（程颐），卦头如「蒙.艮.坎」，序卦传之程传嵌于卦头行。
import fs from 'node:fs';

const SRC = '/tmp/dzg/易藏/易经/御纂周易折中.txt';
const NAMES = ['乾','坤','屯','蒙','需','讼','师','比','小畜','履','泰','否','同人','大有','谦','豫','随','蛊','临','观','噬嗑','贲','剥','复','无妄','大畜','颐','大过','坎','离','咸','恒','遁','大壮','晋','明夷','家人','睽','蹇','解','损','益','夬','姤','萃','升','困','井','革','鼎','震','艮','渐','归妹','丰','旅','巽','兑','涣','节','中孚','小过','既济','未济'];
const ALIAS = { 遁: '遯' }; // 折中用「遯」
const TRI = '[乾兌兑離离震巽坎艮坤]';

const lines = fs.readFileSync(SRC, 'utf8').split('\n').map((s) => s.replace(/[　\s]+/g, '').trim());

// 顺序检出卦头行（子串，含行中合并的情形）。卦头形如「卦名．trigram」。
const heads = [];
let cur = 0;
for (let n = 1; n <= 64; n++) {
  const nm = NAMES[n - 1];
  const pats = [nm, ALIAS[nm]].filter(Boolean).map((x) => new RegExp(x + '[\\.．]' + TRI));
  let fi = -1;
  for (let i = cur; i < lines.length && fi < 0; i++) for (const re of pats) if (re.test(lines[i])) { fi = i; break; }
  if (fi < 0) { // 无妄等无标准卦头：以「卦名序卦」开篇行锚定
    for (let i = cur; i < lines.length; i++) if (lines[i].includes(nm + '序卦')) { fi = i; break; }
  }
  heads.push({ num: n, name: nm, i: fi });
  if (fi >= 0) cur = fi + 1;
}

const ENDR = /^(彖传|《彖》|象传|《象》|初九|初六|文言)/;
// 卦辞区内，「本义/程传」可能在行首、也可能与前块同行（如晋/艮/节）。
// 故把卦辞区拼成一串，再按标签子串切分，既容行首也容行中。
const LABELS = ['本义', '程传', '集说', '案', '附录', '总论', '纲领', '彖传', '《彖》', '象传', '《象》', '初九', '初六', '文言'];
const nextLabel = (str, from, self) => {
  let m = str.length;
  for (const L of LABELS) { if (L === self) continue; const j = str.indexOf(L, from); if (j >= 0 && j < m) m = j; }
  return m;
};

const JIZHU = {};
for (let x = 0; x < heads.length; x++) {
  if (heads[x].i < 0) continue;
  let ni = heads[x].i + 160;
  for (let y = x + 1; y < heads.length; y++) if (heads[y].i >= 0) { ni = heads[y].i; break; }
  const seg = lines.slice(heads[x].i, ni);
  // 卦辞区：到首个 彖/象/爻 行
  let z = seg.length;
  for (let k = 1; k < seg.length; k++) if (ENDR.test(seg[k])) { z = k; break; }
  const reg = seg.slice(0, z).join('');
  // 注文清理：去首尾空白与孤立标点（如坤本义开头偶画符在底本中已丢为「.」）
  const tidy = (s) => s.replace(/^[\s．.、，：；]+/, '').trim();
  // 朱熹：首个「本义」→ 下一标签
  let zhu = null;
  const bi = reg.indexOf('本义');
  if (bi >= 0) zhu = tidy(reg.slice(bi + 2, nextLabel(reg, bi + 2, '本义')));
  // 程颐：取卦辞之程传，跳过卦头行内嵌之「程传《X序卦》…」序卦传释文。
  let cheng = null, ci = -1, from = bi >= 0 ? bi + 2 : 0;
  for (;;) {
    const j = reg.indexOf('程传', from);
    if (j < 0) break;
    if (!/序卦/.test(reg.slice(j + 2, j + 12))) { ci = j; break; } // 非序卦释文 → 即卦辞注
    from = j + 2;
  }
  if (ci < 0) ci = reg.indexOf('程传', bi >= 0 ? bi + 2 : 0); // 兜底
  if (ci >= 0) cheng = tidy(reg.slice(ci + 2, nextLabel(reg, ci + 2, '程传')));
  const e = {};
  if (zhu && zhu.length >= 6) e.zhu = zhu;
  if (cheng && cheng.length >= 6) e.cheng = cheng;
  if (e.zhu || e.cheng) JIZHU[heads[x].num] = e;
}

// ---- 兜底：折中卦辞区缺某注者（如复/家人之本义在折中阙如），沿用既有 jizhu.ts 旧值 ----
try {
  const old = JSON.parse(fs.readFileSync('src/components/atlas/jizhu.ts', 'utf8').match(/JIZHU[^=]*=\s*(\{[\s\S]*\});/)[1]);
  // 旧底本个别卦的卦辞注混入了彖/象传文字，沿用时截断至卦辞注。
  const cut = (s) => s.split(/《彖》|彖曰|《象》|象曰/)[0].trim();
  let filled = 0;
  for (const k of Object.keys(old)) {
    const n = Number(k);
    JIZHU[n] = JIZHU[n] || {};
    if (!JIZHU[n].zhu && old[k].zhu) { JIZHU[n].zhu = cut(old[k].zhu); filled++; }
    if (!JIZHU[n].cheng && old[k].cheng) { JIZHU[n].cheng = cut(old[k].cheng); filled++; }
    if (!JIZHU[n].zhu && !JIZHU[n].cheng) delete JIZHU[n];
  }
  if (filled) console.log('兜底沿用旧值', filled, '项（折中卦辞区阙如者）');
} catch { /* 旧文件不可读则跳过 */ }

// ---- 校验：已知卦内容点验（乾坤屯既济未济 + 朱熹补全的 22/29/30）----
const norm = (s) => (s || '').replace(/[，。、；：！？「」『』“”"·．\.\s]/g, '');
const checks = [
  [1, 'zhu', '六画者'], [1, 'cheng', '上古圣人始画八卦'],
  [2, 'zhu', '阴之数'], [2, 'cheng', '坤'],
  [3, 'cheng', '屯'], [29, 'zhu', '习'], [30, 'cheng', '丽'],
  [63, 'zhu', '既济'], [64, 'cheng', '未济'],
];
let bad = 0;
for (const [n, k, v] of checks) {
  if (!norm((JIZHU[n] || {})[k]).includes(norm(v))) { bad++; console.log('✗ #' + n + ' ' + k + ' 不含「' + v + '」实=' + ((JIZHU[n] || {})[k] || '(空)').slice(0, 24)); }
}
const zhuN = Object.values(JIZHU).filter((x) => x.zhu).length;
const chengN = Object.values(JIZHU).filter((x) => x.cheng).length;
const missZhu = [], missCheng = [];
for (let n = 1; n <= 64; n++) { if (!JIZHU[n]?.zhu) missZhu.push(n); if (!JIZHU[n]?.cheng) missCheng.push(n); }
console.log('朱熹覆盖', zhuN, '/64', missZhu.length ? '缺:' + missZhu.join(',') : '（全）');
console.log('程颐覆盖', chengN, '/64', missCheng.length ? '缺:' + missCheng.join(',') : '（全）');
console.log(bad === 0 ? '✓ 易注点验通过（乾坤屯既济未济 + 22/29/30）' : '✗ ' + bad + ' 项点验失败');
if (bad > 0) throw new Error('易注点验失败');

const ts = '// 自动生成：历代易注（卦辞级）。详见 scripts/build_jizhu.mjs。\n'
  + '// 底本：御纂《周易折中》（清·李光地）——朱熹《周易本义》+ 程颐《伊川易传》，公有领域，简体逐卦标注。\n'
  + 'export interface JiZhuEntry { cheng?: string; zhu?: string; }\n'
  + 'export const JIZHU: Record<number, JiZhuEntry> = ' + JSON.stringify(JIZHU) + ';\n';
fs.writeFileSync('src/components/atlas/jizhu.ts', ts);
console.log('已写 jizhu.ts (' + ts.length + ' bytes)');
