// Build the Ten Wings reading corpus from bollwarm/ZHOUYI.
// Usage:
//   ZHOUYI_PM=/path/to/ZHOUYI.pm node scripts/build_ten_wings.mjs
// Defaults to the temporary checkout path used during local content import.
import fs from 'node:fs';
import * as OpenCC from 'opencc-js';

const sourceCandidates = [
  process.env.ZHOUYI_PM,
  '/private/tmp/classic_system_ZHOUYI/lib/ZHOUYI.pm',
  '/tmp/zy1/lib/ZHOUYI.pm',
].filter(Boolean);
const sourcePath = sourceCandidates.find((path) => fs.existsSync(path));
if (!sourcePath) {
  throw new Error('missing ZHOUYI.pm; set ZHOUYI_PM=/path/to/ZHOUYI.pm before running this script');
}
const outPath = 'src/components/atlas/ten-wings.ts';
const t2s = OpenCC.Converter({ from: 't', to: 'cn' });

const raw = fs.readFileSync(sourcePath, 'utf8');
const protectedRaw = raw.slice(raw.indexOf('__DATA__')).replace(/乾/g, '__QIAN__');
const body = t2s(protectedRaw).replace(/__QIAN__/g, '乾').replace(/遯/g, '遁');

function between(text, start, end) {
  const s = text.indexOf(start);
  if (s < 0) throw new Error(`missing start marker: ${start}`);
  const e = end ? text.indexOf(end, s + start.length) : text.length;
  if (e < 0) throw new Error(`missing end marker: ${end}`);
  return text.slice(s + start.length, e).trim();
}

function clean(text) {
  return text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function paragraphs(block) {
  const compact = clean(block);
  const chunks = compact
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return chunks.map((text) => ({ text, gloss: '' }));
}

const qianWenyan = '《文言》曰' + between(body, '《文言》曰', '《易经》第二卦坤');
const kunStart = body.indexOf('《易经》第二卦坤');
const kunBody = body.slice(kunStart);
const kunWenyan = '《文言》曰' + between(kunBody, '《文言》曰', '《易经》第三卦屯');

const chapters = [
  { name: '文言传 · 乾', clauses: paragraphs(qianWenyan) },
  { name: '文言传 · 坤', clauses: paragraphs(kunWenyan) },
  { name: '系辞上传', clauses: paragraphs(between(body, '系辞上传', '系辞下传')) },
  { name: '系辞下传', clauses: paragraphs(between(body, '系辞下传', '说卦')) },
  { name: '说卦传', clauses: paragraphs(between(body, '说卦', '序卦')) },
  { name: '序卦传', clauses: paragraphs(between(body, '序卦', '杂卦')) },
  { name: '杂卦传', clauses: paragraphs(between(body, '杂卦', null)) },
];

const total = chapters.reduce((n, ch) => n + ch.clauses.length, 0);
if (chapters.length !== 7) throw new Error('Ten Wings should produce 7 reading chapters');
if (total < 80) throw new Error(`Ten Wings paragraph count looks too small: ${total}`);
for (const ch of chapters) {
  if (!ch.clauses.length) throw new Error(`empty Ten Wings chapter: ${ch.name}`);
}

const data = {
  id: 'xici',
  title: '十翼',
  author: '旧题孔子门人',
  relation: '由卦爻辞上升为易道总论 · 《周易》系统思维的理论层',
  chapters,
};

const ts = `// 自动生成：十翼全文阅读数据。详见 scripts/build_ten_wings.mjs。
// 底本：bollwarm/ZHOUYI 的 ZHOUYI.pm（繁体经 opencc-js 转简）。
// 原文由脚本生成；白话覆盖层维护在 ten-wing-gloss.ts。
import type { ChapterWork } from './data';
import { TEN_WING_GLOSS_BY_CHAPTER, TEN_WING_GLOSS_BY_TEXT } from './ten-wing-gloss';

export const TEN_WINGS: ChapterWork = ${JSON.stringify(data, null, 2)};

for (const chapter of TEN_WINGS.chapters) {
  const chapterGlosses = TEN_WING_GLOSS_BY_CHAPTER[chapter.name] || [];
  for (const [i, clause] of (chapter.clauses || []).entries()) {
    clause.gloss ||= chapterGlosses[i] || TEN_WING_GLOSS_BY_TEXT[clause.text] || '';
  }
}
`;

fs.writeFileSync(outPath, ts);
console.log(`已写 ${outPath}：${chapters.length} 章，${total} 句`);
