// 关系图谱 — 汇集全平台跨经典 ⟿ 关联 + 家级关系总览。
import { useMemo } from 'react';
import {
  XINJING, JINGANG, BUER, BASHI, RUPUSA, ZHENGJIAN, QINGJING, YINFU, CANTONGQI, XICI,
  ZHONGYONG, TAIJITU, XIMING, HUANGJI, YANGMING, DAODE, TANJING, ZHUANGZI,
  SCHOOL_INFO, type ClauseWork, type ChapterWork, type LinkSpec,
} from './data';
import { Mono } from './chrome';
import { TopBar } from './shared';

interface Harvested { fromTitle: string; fromText: string; link: LinkSpec; }

function harvestLinks(): Harvested[] {
  const out: Harvested[] = [];
  const add = (fromTitle: string, fromText: string, link?: LinkSpec) => { if (link) out.push({ fromTitle, fromText, link }); };
  const clauseWorks: [string, ClauseWork][] = [
    ['心经', XINJING], ['金刚经', JINGANG], ['维摩诘·不二', BUER], ['八识规矩颂', BASHI],
    ['入菩萨行论', RUPUSA], ['正见·四法印', ZHENGJIAN], ['常清静经', QINGJING], ['阴符经', YINFU],
    ['周易参同契', CANTONGQI], ['系辞传', XICI], ['中庸', ZHONGYONG], ['太极图说', TAIJITU],
    ['西铭', XIMING], ['皇极经世书', HUANGJI], ['阳明心学', YANGMING],
  ];
  clauseWorks.forEach(([title, d]) => d.clauses.forEach((c) => add(title, c.text, c.link)));
  const chapterWorks: [string, ChapterWork][] = [['道德经', DAODE], ['六祖坛经', TANJING], ['庄子', ZHUANGZI]];
  chapterWorks.forEach(([title, d]) => d.chapters.forEach((ch) => (ch.clauses || []).forEach((c) => add(title + '·' + ch.name, c.text, c.link))));
  return out;
}

export function RelationsView({ onBack, onJump }: { onBack: () => void; onJump: (link: LinkSpec) => void }) {
  const links = useMemo(() => harvestLinks(), []);
  const cx = 500, cy = 250;
  const schools = [
    { id: 'dao', glyph: '道', name: '道家', x: 840, y: 150 },
    { id: 'ru', glyph: '儒', name: '儒家', x: 840, y: 360 },
    { id: 'fo', glyph: '佛', name: '佛家', x: 160, y: 360 },
    { id: 'west', glyph: '西', name: '西学', x: 160, y: 150 },
  ];
  const relOf = (id: string) => (SCHOOL_INFO[id] ? SCHOOL_INFO[id].relation : '');

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="关系图谱" sub="易为骨干 · 诸家相系" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 560, flex: '0 0 auto', borderRight: '1px solid var(--hair)', position: 'relative' }}>
          <svg width="100%" height="500" viewBox="0 0 1000 500" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid meet">
            {schools.map((s) => (
              <line key={s.id} x1={cx} y1={cy} x2={s.x} y2={s.y} stroke={s.id === 'west' ? 'var(--ink-3)' : 'var(--accent)'} strokeWidth="1" strokeDasharray={s.id === 'west' ? '2 7' : 'none'} opacity="0.5" />
            ))}
            {schools.map((s) => {
              const mx = cx + (s.x - cx) * 0.52, my = cy + (s.y - cy) * 0.52;
              return <foreignObject key={s.id + 'l'} x={mx - 70} y={my - 12} width="140" height="24"><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-3)', textAlign: 'center', background: 'var(--paper)' }}>{relOf(s.id).split(' · ')[0] || relOf(s.id)}</div></foreignObject>;
            })}
          </svg>
          <div style={{ position: 'absolute', left: (cx / 1000 * 100) + '%', top: cy / 500 * 100 + '%', transform: 'translate(-50%,-50%)', width: 96, height: 96, borderRadius: '50%', background: 'var(--paper)', border: '1.5px solid var(--accent)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 6px var(--accent-soft)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 50, color: 'var(--accent)', lineHeight: 1, marginTop: 3 }}>易</span>
          </div>
          {schools.map((s) => (
            <button key={s.id} onClick={() => onJump(s.id === 'west' ? { kind: 'west', label: '西学' } : { kind: 'node', id: s.id, label: s.name })} style={{ position: 'absolute', left: s.x / 1000 * 100 + '%', top: s.y / 500 * 100 + '%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: s.id === 'west' ? 'var(--paper)' : 'var(--accent-soft)', border: `1px ${s.id === 'west' ? 'dashed' : 'solid'} ${s.id === 'west' ? 'var(--ink-3)' : 'var(--accent)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: s.id === 'west' ? 'var(--ink-3)' : 'var(--accent)', lineHeight: 1, marginTop: 2 }}>{s.glyph}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 600 }}>{s.name}</span>
            </button>
          ))}
          <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center', padding: '0 40px' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8 }}>《易》以阴阳为骨干；道之有无、儒之心性、佛之空、西学之系统，皆与之相系。</p>
          </div>
        </div>

        <div style={{ flex: 1, padding: '32px 48px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Mono>逐句关联 · {links.length} 处 ⟿</Mono>
          <div style={{ marginTop: 14, flex: 1, overflowY: 'auto', paddingRight: 6 }}>
            {links.map((lk, i) => (
              <button key={i} onClick={() => onJump(lk.link)} style={{ width: '100%', textAlign: 'left', border: 'none', borderTop: i ? '1px solid var(--hair)' : 'none', background: 'transparent', cursor: 'pointer', padding: '14px 4px', fontFamily: 'var(--font-body)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <Mono dim>{lk.fromTitle}</Mono>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15.5, lineHeight: 1.55, marginTop: 5 }}>{lk.fromText}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 8, fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--accent)' }}>
                  <span>⟿</span> {lk.link.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
