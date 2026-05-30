// 经典图谱 · 手机版（竖屏阅读优先，真机全屏；复用数据层）。
// 大画幅可视化（卦阵/立体图/方圆图/元会运世/起卦）在手机给「横屏/桌面」优雅占位。
import { useState, useRef, useEffect, type CSSProperties, type ReactNode } from 'react';
import {
  QIAN, KUN, XICI, DAODE, ZHUANGZI, QINGJING, YINFU, CANTONGQI, ZHONGYONG, TAIJITU, XIMING, HUANGJI, YANGMING,
  XINJING, JINGANG, BUER, BASHI, RUPUSA, ZHENGJIAN, TANJING,
  SCHOOL_INFO, WORK_BY_ID, WEST_MAP, WEST_INTRO, TRIGRAMS, HEX_FULL, HEX_FULL_BY_PAIR,
  type FullHex, type ClauseWork, type ChapterWork,
} from './data';
import { TEN_WINGS } from './ten-wings';
import { JIZHU } from './jizhu';
import { Lines } from './primitives';

type AnyWork = Partial<FullHex & ClauseWork & ChapterWork>;
const READ: Record<string, AnyWork> = {
  ...Object.fromEntries(Object.entries(HEX_FULL).map(([num, hex]) => [num, hex])),
  yi: QIAN, kun: KUN, xici: XICI, shiyi: TEN_WINGS,
  daode: DAODE, zhuangzi: ZHUANGZI, qjing: QINGJING, yinfu: YINFU, cantongqi: CANTONGQI,
  zhongyong: ZHONGYONG, taijitu: TAIJITU, ximing: XIMING, huangji: HUANGJI, yangming: YANGMING,
  xinjing: XINJING, jingang: JINGANG, buer: BUER, bashi: BASHI, rupusa: RUPUSA, zhengjian: ZHENGJIAN, tanjing: TANJING,
};

type MScreen =
  | { mode: 'home' } | { mode: 'trunk' } | { mode: 'west' } | { mode: 'land' }
  | { mode: 'school'; id: string } | { mode: 'read'; id: string };

const mRowStyle: CSSProperties = { width: '100%', textAlign: 'left', border: '1px solid var(--hair-2)', borderRadius: 14, padding: '14px 16px', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 13 };
const mRowGlyph: CSSProperties = { width: 38, height: 38, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)', lineHeight: 1 };
const mRowTitle: CSSProperties = { fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15.5 };
const mRowSub: CSSProperties = { fontSize: 12, color: 'var(--ink-3)', marginTop: 2 };
const mBadge = (c: string): CSSProperties => ({ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: c, border: `1px solid ${c}`, borderRadius: 999, padding: '1px 6px' });
const TEXTS_XICI = '易有太极，是生两仪，两仪生四象，四象生八卦。八卦定吉凶，吉凶生大业。';

function MMono({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)', ...style }}>{children}</span>;
}

function MHeader({ title, sub, onBack }: { title: string; sub?: string; onBack?: () => void }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'color-mix(in srgb, var(--paper) 88%, transparent)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid var(--hair)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
      {onBack
        ? <button onClick={onBack} style={{ flex: '0 0 auto', width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-2)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>‹</button>
        : <div style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><span style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--accent)', lineHeight: 1, marginTop: 2 }}>易</span></div>}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 17, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

type Go = (s: MScreen) => void;

function MHome({ go }: { go: Go }) {
  const schools = ['dao', 'ru', 'fo'].map((id) => SCHOOL_INFO[id]);
  return (
    <div>
      <MHeader title="经典图谱" sub="Classical Atlas" />
      <div style={{ padding: '20px 18px 36px' }}>
        <button onClick={() => go({ mode: 'trunk' })} style={{ width: '100%', textAlign: 'left', border: '1px solid var(--accent)', borderRadius: 18, padding: '24px 22px', background: 'var(--accent-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', right: -18, bottom: -34, fontFamily: 'var(--font-display)', fontSize: 150, color: 'var(--accent)', opacity: 0.12, lineHeight: 0.8 }}>易</span>
          <MMono>骨干 · The Trunk</MMono>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 24, marginTop: 8 }}>易经 · 周易</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.6 }}>中国系统思维的结晶——以阴阳为骨，统摄诸家。</div>
          <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--accent)' }}>进入主干 ›</div>
        </button>

        <div style={{ marginTop: 26 }}><MMono>三家 · 向外辐射</MMono></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {schools.map((s) => (
            <button key={s.id} onClick={() => go({ mode: 'school', id: s.id })} style={{ width: '100%', textAlign: 'left', border: '1px solid var(--hair-2)', borderRadius: 14, padding: '16px 18px', background: 'var(--paper-2)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)', lineHeight: 1, marginTop: 2 }}>{s.glyph}</span>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 17 }}>{s.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{s.tagline}</div>
              </div>
              <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 26 }}><MMono>更多</MMono></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <button onClick={() => go({ mode: 'read', id: 'xici' })} style={mRowStyle}>
            <span style={mRowGlyph}>系</span>
            <div style={{ flex: 1 }}><div style={mRowTitle}>系辞传</div><div style={mRowSub}>系统思维的源头</div></div>
            <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>›</span>
          </button>
          <button onClick={() => go({ mode: 'west' })} style={mRowStyle}>
            <span style={mRowGlyph}>西</span>
            <div style={{ flex: 1 }}><div style={mRowTitle}>西方经典 · 对照枝</div><div style={mRowSub}>东西照面 · 系统思维</div></div>
            <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>›</span>
          </button>
          <button onClick={() => go({ mode: 'land' })} style={mRowStyle}>
            <span style={{ ...mRowGlyph, color: 'var(--ink-3)' }}>◇</span>
            <div style={{ flex: 1 }}><div style={mRowTitle}>卦阵 · 立体图 · 方圆图</div><div style={mRowSub}>大画幅可视化 · 建议横屏 / 桌面</div></div>
            <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MTrunk({ go, back }: { go: Go; back: () => void }) {
  return (
    <div>
      <MHeader title="易经 · 主干" sub="The Trunk" onBack={back} />
      <div style={{ padding: '18px 18px 36px' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.9, color: 'var(--ink-2)' }}>{TEXTS_XICI}</div>
        <div style={{ marginTop: 22 }}><MMono>读卦 · 已编全文</MMono></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {([['yi', '乾为天', '第一卦'], ['kun', '坤为地', '第二卦']] as [string, string, string][]).map(([id, t, s]) => (
            <button key={id} onClick={() => go({ mode: 'read', id })} style={mRowStyle}>
              <span style={mRowGlyph}>{t[0]}</span>
              <div style={{ flex: 1 }}><div style={mRowTitle}>{t}</div><div style={mRowSub}>{s}</div></div>
              <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>›</span>
            </button>
          ))}
          <button onClick={() => go({ mode: 'read', id: 'xici' })} style={mRowStyle}>
            <span style={mRowGlyph}>系</span>
            <div style={{ flex: 1 }}><div style={mRowTitle}>系辞传</div><div style={mRowSub}>一阴一阳之谓道</div></div>
            <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>›</span>
          </button>
        </div>
        <div style={{ marginTop: 22 }}><MMono>大画幅 · 建议横屏 / 桌面</MMono></div>
        <div style={{ marginTop: 12, border: '1px dashed var(--hair-2)', borderRadius: 14, padding: '18px 16px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, color: 'var(--ink-3)' }}>
            <span style={{ fontSize: 26 }}>⊞</span><span style={{ fontSize: 24, transform: 'rotate(45deg)', display: 'inline-block' }}>◻</span><span style={{ fontSize: 26 }}>◉</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink-2)', marginTop: 12, lineHeight: 1.7 }}>六十四卦方阵、六维立体图、先天方圆图、元会运世盘<br />是空间可视化，<b style={{ color: 'var(--ink)' }}>横屏或在桌面打开</b>体验更佳。</div>
        </div>
      </div>
    </div>
  );
}

function MSchool({ id, go, back }: { id: string; go: Go; back: () => void }) {
  const s = SCHOOL_INFO[id];
  const grouped = s.workIds.some((w) => WORK_BY_ID[w] && WORK_BY_ID[w].group);
  const order = ['汉传', '藏传', '导读', '经传', '理学', '心学'];
  const groups: Record<string, string[]> = {};
  s.workIds.forEach((w) => { const g = (WORK_BY_ID[w] || {}).group || '经典'; (groups[g] = groups[g] || []).push(w); });
  const keys = grouped ? order.filter((k) => groups[k]).concat(Object.keys(groups).filter((k) => !order.includes(k))) : ['经典'];

  const card = (wid: string) => {
    const n = WORK_BY_ID[wid];
    if (!n) return null;
    const live = n.status === 'ready' || n.status === 'partial' || n.status === 'guide';
    const badge = n.status === 'ready' ? null
      : n.status === 'partial' ? <span style={mBadge('var(--accent)')}>部分</span>
      : n.status === 'guide' ? <span style={mBadge('var(--seal)')}>导读</span>
      : <span style={mBadge('var(--ink-3)')}>即将</span>;
    return (
      <button key={wid} disabled={!live} onClick={() => live && go({ mode: 'read', id: wid })} style={{ width: '100%', textAlign: 'left', border: '1px solid var(--hair-2)', borderRadius: 13, padding: '14px 16px', background: live ? 'var(--paper-2)' : 'transparent', cursor: live ? 'pointer' : 'default', opacity: live ? 1 : 0.55, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ ...mRowGlyph, width: 34, height: 34, fontSize: 17 }}>{s.glyph}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15.5 }}>{n.title}</span>{badge}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{n.author} · {n.frag}</div>
        </div>
        {live && <span style={{ color: 'var(--ink-3)', fontSize: 17 }}>›</span>}
      </button>
    );
  };

  return (
    <div>
      <MHeader title={s.name} sub={s.tagline} onBack={back} />
      <div style={{ padding: '18px 18px 36px' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14.5, lineHeight: 1.85, color: 'var(--ink-2)' }}>{s.intro}</div>
        <div style={{ marginTop: 12, padding: '12px 14px', borderLeft: '2px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: '0 8px 8px 0' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.7 }}>{s.relation}</div>
        </div>
        {keys.map((g) => (
          <div key={g} style={{ marginTop: 20 }}>
            {grouped && <MMono>{g}</MMono>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: grouped ? 10 : 0 }}>{groups[g].map(card)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MReader({ id, back }: { id: string; back: () => void }) {
  const d = READ[id];
  const [open, setOpen] = useState(0);
  const [chap, setChap] = useState(0);
  if (!d) return <div><MHeader title="编撰中" onBack={back} /><div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>内容编撰中</div></div>;

  if (d.yaos && d.gua) {
    const lines = d.upper && d.lower ? [...TRIGRAMS[d.upper].lines, ...TRIGRAMS[d.lower].lines] : id === 'kun' ? [0, 0, 0, 0, 0, 0] : [1, 1, 1, 1, 1, 1];
    return (
      <div>
        <MHeader title={'易经 · ' + d.full} sub={'第 ' + (d.num || '') + ' 卦'} onBack={back} />
        <div style={{ padding: '20px 18px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Lines lines={lines} w={56} h={7} vgap={7} color="var(--accent)" />
            <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 44, color: 'var(--ink)', lineHeight: 1 }}>{d.name}</div><MMono style={{ marginTop: 4, display: 'block' }}>{d.full}</MMono></div>
          </div>
          <div style={{ marginTop: 18, fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.7, letterSpacing: '0.02em' }}>{d.gua}</div>
          {d.guaGloss && (
            <div style={{ marginTop: 12, padding: '12px 14px', border: '1px solid var(--hair-2)', borderRadius: 10, background: 'var(--paper-2)' }}>
              <MMono>导读</MMono>
              {d.upper && d.lower && (
                <>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink-2)', marginTop: 6 }}>
                    {TRIGRAMS[d.upper].nature}上 · {TRIGRAMS[d.lower].nature}下，{TRIGRAMS[d.upper].name}外 {TRIGRAMS[d.lower].name}内。
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink-2)', marginTop: 4 }}>
                    六爻码 {[...TRIGRAMS[d.upper].lines, ...TRIGRAMS[d.lower].lines].join('')}。
                  </div>
                </>
              )}
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink-2)', marginTop: 4 }}>{d.guaGloss}</div>
            </div>
          )}
          {d.xiang && <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 10 }}><MMono>象</MMono><div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.7, marginTop: 5 }}>{d.xiang}</div></div>}
          <div style={{ marginTop: 22 }}><MMono>爻辞 · 点开看白话</MMono></div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}>
            {d.yaos.map((y, i) => {
              const o = open === i;
              const zhu = JIZHU[d.num || 0]?.yao?.[y.pos];
              return (
                <div key={i} style={{ borderTop: i ? '1px solid var(--hair)' : 'none' }}>
                  <div onClick={() => setOpen(o ? -1 : i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', cursor: 'pointer' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', width: 28, flex: '0 0 auto' }}>{y.pos}</span>
                    <span style={{ flex: 1, fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.6 }}>{y.text}</span>
                    <span style={{ color: 'var(--ink-3)', fontSize: 11, transform: o ? 'rotate(180deg)' : 'none' }}>▾</span>
                  </div>
                  {o && (
                    <div style={{ padding: '2px 0 14px 40px', fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8 }}>
                      {y.gloss}
                      {y.xiang && <div style={{ color: 'var(--ink-3)', marginTop: 4 }}>{y.xiang}</div>}
                      {zhu && (
                        <div style={{ marginTop: 10, padding: '10px 12px', border: '1px solid var(--hair-2)', borderRadius: 8, background: 'var(--paper-2)' }}>
                          {zhu.zhu && <div><MMono>朱熹</MMono><div style={{ marginTop: 4 }}>{zhu.zhu}</div></div>}
                          {zhu.cheng && <div style={{ marginTop: zhu.zhu ? 10 : 0 }}><MMono>程颐</MMono><div style={{ marginTop: 4 }}>{zhu.cheng}</div></div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const clauses = d.chapters ? (d.chapters[chap].clauses || []) : (d.clauses || []);
  const title = WORK_BY_ID[id] ? WORK_BY_ID[id].title : d.title;
  return (
    <div>
      <MHeader title={title || ''} sub={d.author || ''} onBack={back} />
      <div style={{ padding: '18px 18px 40px' }}>
        {d.intro && <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, lineHeight: 1.85, color: 'var(--ink-2)', marginBottom: 16 }}>{d.intro}</div>}
        {d.sijiao && <div style={{ marginBottom: 18, padding: '14px 16px', borderLeft: '2px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: '0 8px 8px 0' }}><MMono>四句教</MMono>{d.sijiao.map((s, i) => <div key={i} style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.6, marginTop: i ? 4 : 8 }}>{s}</div>)}</div>}
        {d.chapters && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
            {d.chapters.map((ch, i) => (
              <button key={i} onClick={() => { setChap(i); setOpen(-1); }} disabled={!ch.clauses} style={{ flex: '0 0 auto', border: `1px solid ${chap === i ? 'var(--accent)' : 'var(--hair-2)'}`, background: chap === i ? 'var(--accent-soft)' : 'transparent', color: ch.clauses ? 'var(--ink)' : 'var(--ink-3)', borderRadius: 999, padding: '6px 13px', cursor: ch.clauses ? 'pointer' : 'default', fontFamily: 'var(--font-serif)', fontSize: 13, opacity: ch.clauses ? 1 : 0.5 }}>{ch.name}</button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {clauses.map((c, i) => {
            const o = open === i;
            return (
              <div key={i} style={{ borderTop: i ? '1px solid var(--hair)' : 'none' }}>
                <div onClick={() => setOpen(o ? -1 : i)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0', cursor: 'pointer' }}>
                  <span style={{ flex: 1, fontFamily: 'var(--font-serif)', fontSize: 17.5, lineHeight: 1.7, letterSpacing: '0.01em' }}>{c.text}</span>
                  <span style={{ color: 'var(--ink-3)', fontSize: 11, marginTop: 7, transform: o ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
                {o && (
                  <div style={{ padding: '0 0 16px' }}>
                    {c.gloss && <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.85 }}>{c.gloss}</div>}
                    {c.link && <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-serif)', fontSize: 12.5, color: 'var(--accent)' }}>⟿ {c.link.label}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {d.mantra && <div style={{ marginTop: 18, padding: '14px 16px', background: 'var(--accent-soft)', borderRadius: 10 }}><MMono>咒</MMono><div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.8, color: 'var(--accent)', marginTop: 6 }}>{d.mantra}</div></div>}
        {d.relation && <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)' }}>易</span><span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{d.relation}</span></div>}
      </div>
    </div>
  );
}

function MWest({ back }: { back: () => void }) {
  const [open, setOpen] = useState(-1);
  return (
    <div>
      <MHeader title="西方经典 · 对照枝" sub="East to West" onBack={back} />
      <div style={{ padding: '18px 18px 36px' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, lineHeight: 1.85, color: 'var(--ink-2)' }}>{WEST_INTRO}</div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 14 }}>
          {WEST_MAP.map((r, i) => {
            const o = open === i;
            return (
              <div key={i} style={{ borderTop: i ? '1px solid var(--hair)' : 'none' }}>
                <div onClick={() => setOpen(o ? -1 : i)} style={{ padding: '14px 0', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15 }}>{r.facet}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)' }}>{r.year}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>⟷</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink-2)' }}>{r.cn} · {r.author}</span>
                  </div>
                </div>
                {o && (
                  <div style={{ padding: '0 0 16px' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, lineHeight: 1.85 }}><b style={{ color: 'var(--accent)' }}>重合 · </b>{r.rhyme}</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, lineHeight: 1.8, color: 'var(--ink-2)', marginTop: 8 }}><b style={{ color: 'var(--seal)' }}>分歧 · </b>{r.diverge}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MLanding({ back }: { back: () => void }) {
  const items: [string, string, string][] = [['⊞', '六十四卦方阵', '8×8 即点即读'], ['◻', '六维立体图', '动一爻＝一条棱'], ['◉', '先天方圆图', '邵雍圆图＋方图'], ['☷', '元会运世盘', '十二消息卦消长']];
  return (
    <div>
      <MHeader title="大画幅可视化" sub="Landscape / Desktop" onBack={back} />
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 46, color: 'var(--ink-3)' }}>⟳</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 19, marginTop: 16 }}>请横屏或在桌面查看</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.85, marginTop: 12 }}>六十四卦方阵、六维立体图（Cayley 图）、先天方圆图、元会运世盘与起卦，是大画幅的空间可视化——在更宽的屏幕上才能完整施展。</div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          {items.map(([g, t, s]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 13, border: '1px solid var(--hair-2)', borderRadius: 13, padding: '13px 16px', opacity: 0.7 }}>
              <span style={{ fontSize: 22, color: 'var(--accent)', width: 28, textAlign: 'center' }}>{g}</span>
              <div><div style={mRowTitle}>{t}</div><div style={mRowSub}>{s}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const M_KEY = 'jdt-m-screen';
const enc = (value: string) => encodeURIComponent(value);
const dec = (value: string) => {
  try { return decodeURIComponent(value); } catch { return value; }
};
const hasLS = () => typeof window !== 'undefined' && !!window.localStorage;
const hasWindow = () => typeof window !== 'undefined';

function readIdForHexNum(num: number) {
  if (!HEX_FULL[num]) return null;
  if (num === 1) return 'yi';
  if (num === 2) return 'kun';
  return String(num);
}

function mScreenFromHash(): MScreen | null {
  if (!hasWindow()) return null;
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw) return window.location.hash ? { mode: 'home' } : null;
  const [kind, a, b] = raw.split('/').filter(Boolean).map(dec);
  if (kind === 'trunk') return { mode: 'trunk' };
  if (kind === 'west') return { mode: 'west' };
  if (kind === 'school' && a) return { mode: 'school', id: a };
  if (kind === 'reading' && a) return { mode: 'read', id: a };
  if (kind === 'hex' && a) {
    const id = readIdForHexNum(Number(a));
    if (id) return { mode: 'read', id };
  }
  if (kind === 'hex-pair' && a && b) {
    const hex = HEX_FULL_BY_PAIR[a + '_' + b];
    const id = hex ? readIdForHexNum(hex.num) : null;
    if (id) return { mode: 'read', id };
  }
  if (kind === 'matrix' || kind === 'cube' || kind === 'square' || kind === 'cast') return { mode: 'land' };
  return { mode: 'home' };
}

function mScreenToHash(screen: MScreen) {
  if (screen.mode === 'west') return '#/west';
  if (screen.mode === 'land') return '#/cube';
  if (screen.mode === 'trunk') return '#/trunk';
  if (screen.mode === 'school') return '#/school/' + enc(screen.id);
  if (screen.mode === 'read') {
    const num = screen.id === 'yi' ? 1 : screen.id === 'kun' ? 2 : Number(screen.id);
    if (Number.isInteger(num) && HEX_FULL[num]) return '#/hex/' + num;
    return '#/reading/' + enc(screen.id);
  }
  return '#/';
}

function writeMobileHash(screen: MScreen) {
  if (!hasWindow()) return;
  const hash = mScreenToHash(screen);
  if (window.location.hash === hash) return;
  const url = new URL(window.location.href);
  url.hash = hash;
  window.history.pushState(null, '', url);
}

export function MobileApp() {
  const [screen, setScreen] = useState<MScreen>(() => {
    const routed = mScreenFromHash();
    if (routed) return routed;
    if (hasLS()) { try { const s = JSON.parse(localStorage.getItem(M_KEY) || 'null'); if (s && s.mode) return s as MScreen; } catch { /* ignore */ } }
    return { mode: 'home' };
  });
  const stackRef = useRef<MScreen[]>([]);
  const save = (s: MScreen) => {
    if (hasLS()) { try { localStorage.setItem(M_KEY, JSON.stringify(s)); } catch { /* ignore */ } }
  };
  const go: Go = (s) => {
    stackRef.current.push(screen);
    setScreen(s);
    save(s);
    writeMobileHash(s);
  };
  const back = () => {
    const prev = stackRef.current.pop() || { mode: 'home' as const };
    setScreen(prev);
    save(prev);
    writeMobileHash(prev);
  };

  useEffect(() => {
    const syncFromHash = () => {
      const routed = mScreenFromHash();
      if (!routed) return;
      setScreen(routed);
      save(routed);
    };
    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('popstate', syncFromHash);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, []);

  let view: ReactNode;
  if (screen.mode === 'trunk') view = <MTrunk go={go} back={back} />;
  else if (screen.mode === 'school') view = <MSchool id={screen.id} go={go} back={back} />;
  else if (screen.mode === 'read') view = <MReader id={screen.id} back={back} />;
  else if (screen.mode === 'west') view = <MWest back={back} />;
  else if (screen.mode === 'land') view = <MLanding back={back} />;
  else view = <MHome go={go} />;

  return (
    <div style={{ position: 'fixed', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>
      {view}
    </div>
  );
}
