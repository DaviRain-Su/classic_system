// 抽取历代易注（卦辞级）：朱熹《周易本义》(全 64) + 程颐《伊川易传》(现有底本部分卦)。
// 公有领域古籍（CnPeng/AncientChineseBook）。朱熹按"卦名：卦辞"行游标解析；程颐按"△□上下卦"头解析。
import fs from 'node:fs';
const DIR = '/tmp/abc/01易藏-0195部/01易经-49部';

// num→卦名（由 gua 上下卦经本仓库 HEX_NAMES 反查）
const hexSrc = fs.readFileSync('src/components/atlas/hex.ts', 'utf8');
const HEX_NAMES = eval('(' + hexSrc.match(/HEX_NAMES[^=]*=\s*(\{[\s\S]*?\n\};)/)[1].replace(/;\s*$/, '') + ')');
const p2n = {}; for (const u of Object.keys(HEX_NAMES)) for (const l of Object.keys(HEX_NAMES[u])) p2n[u + '_' + l] = HEX_NAMES[u][l][1];
const TK = { 乾: 'qian', 坤: 'kun', 震: 'zhen', 巽: 'xun', 坎: 'kan', 离: 'li', 艮: 'gen', 兑: 'dui' };
const gua = JSON.parse(fs.readFileSync('/tmp/gua_data.json', 'utf8'));
const guaList = Array.isArray(gua) ? gua : Object.values(gua);
const num2name = {};
for (const e of guaList) { const t = e.short.split(/\s+/)[1].match(/(.)上(.)下/); num2name[p2n[TK[t[1]] + '_' + TK[t[2]]]] = e.name; }
const clean = (s) => s.replace(/[　\s]+/g, '').trim();

const JIZHU = {};
const ensure = (n) => (JIZHU[n] = JIZHU[n] || {});

// ---- 朱熹《周易本义》：按"X下，Y上。"卦头分段，取至首爻(初九/初六)前的卦辞注 ----
{
  const txt = fs.readFileSync(DIR + '/周易本义-宋-朱熹.txt', 'utf8');
  const re = /([乾兑离震巽坎艮坤])下，?([乾兑离震巽坎艮坤])上[。\s]/g;
  const heads = []; let m;
  while ((m = re.exec(txt))) heads.push({ lower: m[1], upper: m[2], i: m.index, end: re.lastIndex });
  for (let k = 0; k < heads.length; k++) {
    const h = heads[k];
    const num = p2n[TK[h.upper] + '_' + TK[h.lower]]; if (!num) continue;
    const seg = txt.slice(h.end, k + 1 < heads.length ? heads[k + 1].i : txt.length);
    const out = [];
    for (const line of seg.split('\n')) { if (/^[　\s]*(初九|初六)/.test(line)) break; if (line.trim()) out.push(line.trim()); }
    const note = clean(out.join('')); if (note) ensure(num).zhu = note;
  }
  console.log('朱熹: 录入', Object.values(JIZHU).filter((x) => x.zhu).length, '/64（其余卦本义底本无独立卦头，暂缺）');
}

// ---- 程颐《伊川易传》：△□上下卦头后第一个（…） ----
{
  const txt = fs.readFileSync(DIR + '/伊川易传-宋-程颐.txt', 'utf8');
  const re = /△□([乾兑离震巽坎艮坤])下([乾兑离震巽坎艮坤])上/g;
  const heads = []; let m;
  while ((m = re.exec(txt))) heads.push({ lower: m[1], upper: m[2], end: re.lastIndex });
  for (let k = 0; k < heads.length; k++) {
    const h = heads[k];
    const num = p2n[TK[h.upper] + '_' + TK[h.lower]]; if (!num) continue;
    const seg = txt.slice(h.end, k + 1 < heads.length ? heads[k + 1].end : txt.length);
    const pm = seg.match(/（([^（）]*(?:（[^）]*）[^（）]*)*)）/);
    if (pm) { const note = clean(pm[1]); if (note.length > 4) ensure(num).cheng = note; }
  }
  console.log('程颐: 录入', Object.values(JIZHU).filter((x) => x.cheng).length, '卦（此底本残缺，仅部分）');
}

// ---- 校验（乾坤）----
const norm = (s) => (s || '').replace(/[，。、；：！？「」『』“”"]/g, '');
const checks = [[1, 'zhu', '大通而至正'], [2, 'zhu', '牝马'], [1, 'cheng', '乾，天也'], [2, 'cheng', '坤']];
let bad = 0;
for (const [n, k, v] of checks) if (!norm((JIZHU[n] || {})[k]).includes(norm(v))) { bad++; console.log('✗ #' + n + ' ' + k + ' 不含「' + v + '」实=' + ((JIZHU[n] || {})[k] || '(空)').slice(0, 30)); }
console.log(bad === 0 ? '✓ 易注校验通过（朱熹/程颐 乾坤点验一致）' : '✗ ' + bad + ' 项');
console.log('朱熹覆盖', Object.values(JIZHU).filter(x=>x.zhu).length, '· 程颐覆盖', Object.values(JIZHU).filter(x=>x.cheng).length);

const ts = '// 自动生成：历代易注（卦辞级）。详见 scripts/build_jizhu.mjs。\n'
  + '// 朱熹《周易本义》(全64) + 程颐《伊川易传》(现有底本部分卦)——公有领域古籍。\n'
  + 'export interface JiZhuEntry { cheng?: string; zhu?: string; }\n'
  + 'export const JIZHU: Record<number, JiZhuEntry> = ' + JSON.stringify(JIZHU) + ';\n';
fs.writeFileSync('src/components/atlas/jizhu.ts', ts);
console.log('已写 jizhu.ts (' + ts.length + ' bytes)');
