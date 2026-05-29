// 抽取历代易注：朱熹《周易本义》+ 程颐《伊川易传》，卦辞级 + 爻级，全 64 卦。
// 底本：御纂《周易折中》（清·李光地，公有领域）——简体，逐卦先「本义」后「程传」，每爻同例。
// 取自 殆知阁古籍语料（daizhige）：
//   git clone --filter=blob:none --no-checkout --depth 1 https://github.com/garychowcmu/daizhigev20 /tmp/dzg
//   cd /tmp/dzg && git checkout HEAD -- "易藏/易经/御纂周易折中.txt"
// 复(24)卦辞本义折中阙如，另取自《周易本义通释》(胡炳文)所引朱子本义（见文末 ZHU24）。
// 注：底本为 OCR 简体，且常缺爻题行，故爻级以「本义/程传」标签序列为准、辅以爻题校正；个别字或有讹误。
import fs from 'node:fs';

const SRC = '/tmp/dzg/易藏/易经/御纂周易折中.txt';
const NAMES = ['乾','坤','屯','蒙','需','讼','师','比','小畜','履','泰','否','同人','大有','谦','豫','随','蛊','临','观','噬嗑','贲','剥','复','无妄','大畜','颐','大过','坎','离','咸','恒','遁','大壮','晋','明夷','家人','睽','蹇','解','损','益','夬','姤','萃','升','困','井','革','鼎','震','艮','渐','归妹','丰','旅','巽','兑','涣','节','中孚','小过','既济','未济'];
const ALIAS = { 遁: '遯' }; // 折中用「遯」
const TRI = '[乾兌兑離离震巽坎艮坤]';

// 八卦三爻（自下而上 = 初→上 之分量）与 King-Wen 上/下卦表 → 推每卦 6 爻题，供爻级定位/校正。
const TRIG = { 乾: [1, 1, 1], 兑: [1, 1, 0], 离: [1, 0, 1], 震: [1, 0, 0], 巽: [0, 1, 1], 坎: [0, 1, 0], 艮: [0, 0, 1], 坤: [0, 0, 0] };
const KW = [
  ['乾','乾'],['坤','坤'],['坎','震'],['艮','坎'],['坎','乾'],['乾','坎'],['坤','坎'],['坎','坤'],
  ['巽','乾'],['乾','兑'],['坤','乾'],['乾','坤'],['乾','离'],['离','乾'],['坤','艮'],['震','坤'],
  ['兑','震'],['艮','巽'],['坤','兑'],['巽','坤'],['离','震'],['艮','离'],['艮','坤'],['坤','震'],
  ['乾','震'],['艮','乾'],['艮','震'],['兑','巽'],['坎','坎'],['离','离'],['兑','艮'],['震','巽'],
  ['乾','艮'],['震','乾'],['离','坤'],['坤','离'],['巽','离'],['离','兑'],['坎','艮'],['震','坎'],
  ['艮','兑'],['巽','震'],['兑','乾'],['乾','巽'],['兑','坤'],['坤','巽'],['兑','坎'],['坎','巽'],
  ['兑','离'],['离','巽'],['震','震'],['艮','艮'],['巽','艮'],['震','兑'],['震','离'],['离','艮'],
  ['巽','巽'],['兑','兑'],['巽','坎'],['坎','兑'],['巽','兑'],['震','艮'],['坎','离'],['离','坎'],
];
function yaoSeqOf(n) {
  const [up, lo] = KW[n - 1];
  const lines = [...TRIG[lo], ...TRIG[up]]; // 初→上
  const seq = lines.map((bit, i) => {
    const yy = bit ? '九' : '六';
    const pos = i === 0 ? '初' : i === 5 ? '上' : ['', '二', '三', '四', '五'][i];
    return (i === 0 || i === 5) ? pos + yy : yy + pos;
  });
  if (n === 1) seq.push('用九');
  if (n === 2) seq.push('用六');
  return seq;
}

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
const tidy = (s) => s.replace(/^[\s．.、，：；]+/, '').trim();
const nextLabel = (str, from, self, labels) => {
  let m = str.length;
  for (const L of labels) { if (L === self) continue; const j = str.indexOf(L, from); if (j >= 0 && j < m) m = j; }
  return m;
};
const CARD_LABELS = ['本义', '程传', '集说', '案', '附录', '总论', '纲领', '彖传', '《彖》', '象传', '《象》', '初九', '初六', '文言'];

// ── 爻级抽取（逐行）──
// 真「本义/程传」标签在行首；集说引「《本义》《程传》」在行中，故按行首识别可避误判。
// 折中常缺爻题行，故以本义/程传序列为骨架（每见新本义即进一爻），辅以行首真爻题校正爻位。
const YAO_HEAD = /^(初九|初六|九二|六二|九三|六三|九四|六四|九五|六五|上九|上六|用九|用六)[，,]/;
// 注块止行：下一注家/集说/案/彖象/文言/序卦、或爻题、或集说式「X氏…曰 / X子…曰 / 《…语类》 / 又曰 / 又案 / 问」。
const stopLine = (ln) =>
  /^(本义|程传|集说|案|总论|纲领|附录|彖传|《彖》|象传|《象》|文言|序卦)/.test(ln)
  || YAO_HEAD.test(ln)
  || /^又(曰|案)/.test(ln)
  || /^《[^》]{1,10}》/.test(ln)
  || /^[^，。、：；]{1,4}(氏|子)[^，。、：；]{0,5}曰/.test(ln);
const NOTE_STOP_STR = ['集说', '案', '总论', '纲领', '附录', '彖传', '《彖》', '象传', '《象》', '文言'];
const headKey = (s) => (s || '').replace(/[\s，。、；：！？「」『』“”"·．.]/g, '').slice(0, 8);
// 逐行抽取爻级：行首本义/程传为注块、行首爻题为校正锚；卦辞注以内容比对剔除（其行位不稳）。
function extractYao(seg, yaoSeq, cardZhu, cardCheng) {
  const ev = [];
  for (let k = 1; k < seg.length; k++) {
    const ln = seg[k];
    const ym = ln.match(YAO_HEAD);
    if (ym) ev.push({ k, type: 'yao', name: ym[1] });
    const lab = ln.startsWith('本义') ? '本义' : ln.startsWith('程传') ? '程传' : null;
    if (lab) {
      let endK = seg.length;
      for (let j = k + 1; j < seg.length; j++) if (stopLine(seg[j])) { endK = j; break; }
      let s = seg.slice(k, endK).join('').slice(lab.length);
      s = s.slice(0, nextLabel(s, 0, '', NOTE_STOP_STR)); // 同行内「程传…集说…」截断
      ev.push({ k, type: lab, text: tidy(s) });
    }
  }
  ev.sort((a, b) => a.k - b.k);

  const zKey = cardZhu ? headKey(cardZhu) : null, cKey = cardCheng ? headKey(cardCheng) : null;
  let skipZ = false, skipC = false;
  const yao = {};
  let idx = 0, cur = null;
  const flush = () => { if (cur && (cur.zhu || cur.cheng) && idx >= 0 && idx < yaoSeq.length) { const key = yaoSeq[idx]; if (!yao[key]) yao[key] = cur; } cur = null; };
  for (const e of ev) {
    if (e.type === 'yao') { const p = yaoSeq.indexOf(e.name); if (p >= 0) { flush(); idx = p; cur = {}; } }
    else if (e.type === '本义') {
      if (!skipZ && zKey && headKey(e.text) === zKey) { skipZ = true; continue; } // 卦辞本义，剔除
      if (cur && cur.zhu) { flush(); idx++; } if (!cur) cur = {}; if (idx < yaoSeq.length && !cur.zhu && e.text.length >= 4) cur.zhu = e.text;
    } else {
      if (!skipC && cKey && headKey(e.text) === cKey) { skipC = true; continue; } // 卦辞程传，剔除
      if (cur && cur.cheng) { flush(); idx++; } if (!cur) cur = {}; if (idx < yaoSeq.length && !cur.cheng && e.text.length >= 4) cur.cheng = e.text;
    }
  }
  flush();
  return yao;
}

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
  // 朱熹卦辞
  let zhu = null;
  const bi = reg.indexOf('本义');
  if (bi >= 0) zhu = tidy(reg.slice(bi + 2, nextLabel(reg, bi + 2, '本义', CARD_LABELS)));
  // 程颐卦辞：跳过卦头行内嵌之「程传《X序卦》…」序卦传释文
  let cheng = null, ci = -1, fromc = bi >= 0 ? bi + 2 : 0;
  for (;;) {
    const j = reg.indexOf('程传', fromc);
    if (j < 0) break;
    if (!/序卦/.test(reg.slice(j + 2, j + 12))) { ci = j; break; }
    fromc = j + 2;
  }
  if (ci < 0) ci = reg.indexOf('程传', bi >= 0 ? bi + 2 : 0);
  if (ci >= 0) cheng = tidy(reg.slice(ci + 2, nextLabel(reg, ci + 2, '程传', CARD_LABELS)));
  const e = {};
  if (zhu && zhu.length >= 6) e.zhu = zhu;
  if (cheng && cheng.length >= 6) e.cheng = cheng;
  // 爻级：逐行抽取，卦辞注按内容比对剔除（zhu/cheng 已得）。
  const yao = extractYao(seg, yaoSeqOf(heads[x].num), zhu, cheng);
  if (Object.keys(yao).length) e.yao = yao;
  if (e.zhu || e.cheng || e.yao) JIZHU[heads[x].num] = e;
}

// ---- 兜底：折中卦辞区缺某注者者，沿用既有 jizhu.ts 旧值（截断混入的彖/象文字）----
try {
  const old = JSON.parse(fs.readFileSync('src/components/atlas/jizhu.ts', 'utf8').match(/JIZHU[^=]*=\s*(\{[\s\S]*\});/)[1]);
  const cut = (s) => s.split(/《彖》|彖曰|《象》|象曰/)[0].trim();
  let filled = 0;
  for (const k of Object.keys(old)) {
    const n = Number(k);
    JIZHU[n] = JIZHU[n] || {};
    if (!JIZHU[n].zhu && old[k].zhu) { JIZHU[n].zhu = cut(old[k].zhu); filled++; }
    if (!JIZHU[n].cheng && old[k].cheng) { JIZHU[n].cheng = cut(old[k].cheng); filled++; }
    if (!JIZHU[n].zhu && !JIZHU[n].cheng && !JIZHU[n].yao) delete JIZHU[n];
  }
  if (filled) console.log('兜底沿用旧值', filled, '项（折中卦辞区阙如者）');
} catch { /* 旧文件不可读则跳过 */ }

// ---- 复(24) 卦辞本义：折中阙如，取自《周易本义通释》(胡炳文，公有领域)所引朱子本义，标点为本项目所加 ----
const ZHU24 = '复，阳复生于下也。剥尽则为纯坤，十月之卦，而阳气已生于下矣。积之逾月，然后一阳之体始成而来复，故十有一月其卦为复。以其阳既往而复反，故有亨道。又内震外坤，有阳动于下而以顺上行之象，故其占又为己之出入既得无疾，朋类之来亦得无咎。又自五月姤卦一阴始生，至此七爻而一阳来复，乃天运之自然，故其占又为反复其道，至于七日当得来复。又以刚德方长，故其占又为利有攸往也。反复其道，往而复来、来而复往之意。七日者，所占来复之期也。';
JIZHU[24] = JIZHU[24] || {};
if (!JIZHU[24].zhu) JIZHU[24].zhu = ZHU24;

// ---- 乾(1) 爻级校正：折中 OCR 阙九五(飞龙在天)及上九/用九爻题行，致爻级序列前移一位 ----
// （九五槽实为上九注、上九槽实为用九注）。故校正错位，并据《周易本义通释》《伊川易传》补九五（标点为本项目所加）。
const q = JIZHU[1] && JIZHU[1].yao;
if (q && q['九五'] && /最上一爻|亢/.test(q['九五'].zhu || '')) {
  q['用九'] = q['上九'];   // 上九槽实为用九注
  q['上九'] = q['九五'];   // 九五槽实为上九注
  q['九五'] = {
    zhu: '刚健中正，以居尊位，如以圣人之德居圣人之位，故其象如此，而占法与九二同。特所利见者，在上之大人耳。若有其位，则为利见九二在下之大人也。',
    cheng: '进位乎天位也。圣人既得天位，则利见在下大德之人，与共成天下之事，天下固利见夫大德之君也。',
  };
}

// ---- 校验：卦辞级已知点 + 爻级点验 ----
const norm = (s) => (s || '').replace(/[，。、；：！？「」『』“”"·．\.\s]/g, '');
const cardChecks = [
  [1, 'zhu', '六画者'], [1, 'cheng', '上古圣人始画八卦'],
  [2, 'zhu', '阴之数'], [2, 'cheng', '坤'],
  [3, 'cheng', '屯'], [29, 'zhu', '习'], [30, 'cheng', '丽'],
  [24, 'zhu', '阳复生于下'], [63, 'zhu', '既济'], [64, 'cheng', '未济'],
];
const yaoChecks = [
  [3, '初九', 'zhu', '磐桓'], [10, '六三', 'zhu', '不中不正'],
  [4, '九二', 'zhu', '阳刚'], [24, '初九', 'zhu', '一阳'],
  [1, '用九', 'zhu', '凡筮得阳爻'], [2, '用六', 'zhu', '筮得阴爻'],
  [1, '九五', 'zhu', '刚健中正'], [1, '上九', 'zhu', '亢'],
];
let bad = 0;
for (const [n, k, v] of cardChecks) {
  if (!norm((JIZHU[n] || {})[k]).includes(norm(v))) { bad++; console.log('✗ 卦辞 #' + n + ' ' + k + ' 不含「' + v + '」实=' + ((JIZHU[n] || {})[k] || '(空)').slice(0, 20)); }
}
for (const [n, y, k, v] of yaoChecks) {
  const got = ((JIZHU[n] || {}).yao || {})[y] || {};
  if (!norm(got[k]).includes(norm(v))) { bad++; console.log('✗ 爻 #' + n + ' ' + y + ' ' + k + ' 不含「' + v + '」实=' + (got[k] || '(空)').slice(0, 20)); }
}

// ---- 覆盖统计 ----
const zhuN = Object.values(JIZHU).filter((x) => x.zhu).length;
const chengN = Object.values(JIZHU).filter((x) => x.cheng).length;
const missZhu = [], missCheng = [];
for (let n = 1; n <= 64; n++) { if (!JIZHU[n]?.zhu) missZhu.push(n); if (!JIZHU[n]?.cheng) missCheng.push(n); }
let yaoTotal = 0; const thin = [];
for (let n = 1; n <= 64; n++) {
  const ks = Object.keys(JIZHU[n]?.yao || {});
  yaoTotal += ks.length;
  const expect = n === 1 || n === 2 ? 7 : 6;
  if (ks.length < expect) thin.push(n + '(' + ks.length + ')');
}
console.log('朱熹卦辞', zhuN, '/64', missZhu.length ? '缺:' + missZhu.join(',') : '（全）');
console.log('程颐卦辞', chengN, '/64', missCheng.length ? '缺:' + missCheng.join(',') : '（全）');
console.log('爻级集注共', yaoTotal, '条', thin.length ? '；不足应有数之卦：' + thin.join(' ') : '；各卦爻数齐备');
console.log(bad === 0 ? '✓ 点验通过（卦辞 10 点 + 爻级 6 点）' : '✗ ' + bad + ' 项点验失败');
if (bad > 0) throw new Error('易注点验失败');

const ts = '// 自动生成：历代易注（卦辞级 + 爻级）。详见 scripts/build_jizhu.mjs。\n'
  + '// 底本：御纂《周易折中》（程颐《伊川易传》+ 朱熹《周易本义》），公有领域 OCR 简体；复(24)卦辞本义、乾九五爻注取自《周易本义通释》《伊川易传》。个别字或有讹误。\n'
  + 'export interface JiZhuYao { cheng?: string; zhu?: string; }\n'
  + 'export interface JiZhuEntry { cheng?: string; zhu?: string; yao?: Record<string, JiZhuYao>; }\n'
  + 'export const JIZHU: Record<number, JiZhuEntry> = ' + JSON.stringify(JIZHU) + ';\n';
fs.writeFileSync('src/components/atlas/jizhu.ts', ts);
console.log('已写 jizhu.ts (' + ts.length + ' bytes)');
