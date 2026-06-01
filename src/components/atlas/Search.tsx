// 全文检索 — 索引全平台真经文（六十四卦 + 十翼 + 道儒佛），搜词跳句。
import { useMemo, useState, type ReactNode } from 'react';
import {
  XINJING, JINGANG, BUER, BASHI, RUPUSA, ZHENGJIAN, QINGJING, YINFU, CANTONGQI, XICI,
  SHUOGUA, XUGUA, ZAGUA, WENYAN,
  ZHONGYONG, TAIJITU, XIMING, HUANGJI, YANGMING, DAODE, TANJING, ZHUANGZI, LIEZI, TAIYI,
  HEX_FULL_LIST, type ClauseWork, type ChapterWork, type FullHex,
} from './data';
import { TEN_WINGS } from './ten-wings';
import { Mono } from './chrome';
import { TopBar, type OpenNode } from './shared';

interface Item { route: string; title: string; text: string; gloss: string; }

function buildCorpus(): Item[] {
  const out: Item[] = [];
  const push = (route: string, title: string, text?: string, gloss?: string) => { if (text) out.push({ route, title, text, gloss: gloss || '' }); };

  const clauseWorks: [string, ClauseWork][] = [
    ['xinjing', XINJING], ['jingang', JINGANG], ['buer', BUER], ['bashi', BASHI],
    ['rupusa', RUPUSA], ['zhengjian', ZHENGJIAN], ['qjing', QINGJING], ['yinfu', YINFU],
    ['cantongqi', CANTONGQI], ['xici', XICI], ['wenyan', WENYAN], ['shuogua', SHUOGUA], ['xugua', XUGUA], ['zagua', ZAGUA],
    ['zhongyong', ZHONGYONG], ['taijitu', TAIJITU],
    ['ximing', XIMING], ['huangji', HUANGJI], ['yangming', YANGMING],
  ];
  clauseWorks.forEach(([route, d]) => {
    d.clauses.forEach((c) => push(route, d.title, c.text, c.gloss));
    if (d.sijiao) d.sijiao.forEach((s) => push(route, d.title + '·四句教', s));
    if (d.mantra) push(route, d.title + '·咒', d.mantra);
  });

  const chapterWorks: [string, ChapterWork][] = [['shiyi', TEN_WINGS], ['daode', DAODE], ['tanjing', TANJING], ['zhuangzi', ZHUANGZI], ['liezi', LIEZI], ['taiyi', TAIYI]];
  chapterWorks.forEach(([route, d]) => {
    d.chapters.forEach((ch) => (ch.clauses || []).forEach((c) => push(route, d.title + '·' + ch.name, c.text, c.gloss)));
  });

  // 六十四卦（全文）
  HEX_FULL_LIST.forEach((h: FullHex) => {
    const route = h.num === 1 ? 'yi' : h.num === 2 ? 'kun' : String(h.num);
    push(route, '易经·' + h.full, h.gua, h.guaGloss);
    if (h.xiang) push(route, '易经·' + h.full + '·象', h.xiang);
    h.yaos.forEach((y) => push(route, '易经·' + h.full + '·' + y.pos, y.text, y.gloss));
  });
  return out;
}

function hl(text: string, q: string): ReactNode {
  if (!q) return text;
  const i = text.indexOf(q);
  if (i < 0) return text;
  return [
    <span key="a">{text.slice(0, i)}</span>,
    <mark key="b" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '0 2px', borderRadius: 3 }}>{q}</mark>,
    <span key="c">{text.slice(i + q.length)}</span>,
  ];
}

export function SearchView({ onBack, onOpen }: { onBack: () => void; onOpen: OpenNode }) {
  const corpus = useMemo(() => buildCorpus(), []);
  const [q, setQ] = useState('');
  const query = q.trim();
  const results = query ? corpus.filter((it) => it.text.includes(query) || it.gloss.includes(query) || it.title.includes(query)) : [];
  const chips = ['阴阳', '无常', '知行', '空', '中', '太极', '自然'];

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="全文检索" sub={corpus.length + ' 句经文'} onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 56px', overflow: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: 720 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--hair-2)', borderRadius: 999, padding: '11px 20px', background: 'var(--paper-2)' }}>
            <span style={{ color: 'var(--ink-3)', fontSize: 16 }}>⌕</span>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜经文原文或白话（如 阴阳、无常、知行合一）"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)' }} />
            {q && <button onClick={() => setQ('')} style={{ border: 'none', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', fontSize: 15 }}>✕</button>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <button key={c} onClick={() => setQ(c)} style={{ border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-2)', borderRadius: 999, padding: '4px 13px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5 }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 720, marginTop: 18, flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {query && <Mono dim>{results.length} 条结果</Mono>}
          {!query && <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--ink-3)', fontFamily: 'var(--font-serif)', fontSize: 15 }}>跨易经、道、儒、佛、系辞——一处搜尽</div>}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
            {results.map((it, i) => (
              <button key={i} onClick={() => onOpen(it.route)} style={{ textAlign: 'left', border: 'none', borderTop: i ? '1px solid var(--hair)' : 'none', background: 'transparent', cursor: 'pointer', padding: '13px 6px', fontFamily: 'var(--font-body)' }}>
                <Mono dim>{it.title}</Mono>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, lineHeight: 1.6, marginTop: 5 }}>{hl(it.text, query)}</div>
                {it.gloss && <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.7, marginTop: 3 }}>{hl(it.gloss, query)}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
