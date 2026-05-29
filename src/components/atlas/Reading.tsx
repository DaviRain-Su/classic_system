// 经卷长轴阅读 — 乾卦(可交互) / 道德经 / 占位。
import { useState } from 'react';
import { QIAN, DAODE1, NODE_BY_ID } from './data';
import { Mono } from './chrome';
import { MorphYao } from './primitives';
import { TopBar, Slot, RelChips, BianPanel, GuaFamily, type OpenNode, type OpenHex } from './shared';

const QIAN_LINES = [1, 1, 1, 1, 1, 1];

// 乾卦 · interactive
function ReadingQian({ onBack, onOpen, onOpenHex }: { onBack: () => void; onOpen: OpenNode; onOpenHex: OpenHex }) {
  const q = QIAN;
  const [sel, setSel] = useState(5); // 默认 初九
  const [changed, setChanged] = useState(false);
  const cur = q.yaos[sel];

  const YaoRow = ({ i }: { i: number }) => {
    const y = q.yaos[i];
    const on = sel === i;
    return (
      <div onClick={() => { setSel(i); setChanged(false); }} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', background: on ? 'var(--accent-soft)' : 'transparent', transition: 'background .18s' }}>
        <span style={{ width: 30, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: on ? (changed ? 'var(--seal)' : 'var(--accent)') : 'var(--ink-3)', textAlign: 'right' }}>{y.pos}</span>
        <MorphYao broken={changed && on} w={150} h={12} gap={22} color={on ? (changed ? 'var(--seal)' : 'var(--accent)') : 'var(--ink)'} />
      </div>
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, paddingTop: 74, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="易经 · 乾为天" sub="䷀ 第一卦" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        {/* left: trunk */}
        <div style={{ width: 470, flex: '0 0 auto', borderRight: '1px solid var(--hair)', padding: '40px 48px', display: 'flex', flexDirection: 'column' }}>
          <Mono>骨干 · 乾</Mono>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 72, color: 'var(--accent)', lineHeight: 0.9 }}>乾</span>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 18 }}>乾为天</div>
              <Mono dim style={{ marginTop: 3 }}>The Creative</Mono>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 19, marginTop: 18, letterSpacing: '0.03em' }}>{q.gua}</div>

          <div style={{ marginTop: 22 }}>
            <Mono dim>点击爻位 · 读爻辞</Mono>
          </div>
          <div style={{ marginTop: 8 }}>
            {q.yaos.map((_, i) => <YaoRow key={i} i={i} />)}
          </div>
          <div style={{ marginTop: 10, paddingTop: 12, borderTop: '1px dashed var(--hair-2)', display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 12 }}>
            <span style={{ width: 30, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--seal)', textAlign: 'right' }}>{q.yongjiu.pos}</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-2)' }}>{q.yongjiu.text}</span>
          </div>
          <div style={{ marginTop: 22 }}>
            <Mono dim>卦族 · 错 / 综 / 互 / 交</Mono>
            <div style={{ marginTop: 12 }}><GuaFamily lines={QIAN_LINES} onOpenHex={onOpenHex} /></div>
          </div>
        </div>

        {/* right: reading panel */}
        <div style={{ flex: 1, padding: '40px 56px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <div style={{ flex: 1 }}>
              <Mono>象传</Mono>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.8, marginTop: 6, color: 'var(--ink-2)' }}>{q.xiang}</div>
            </div>
            <div style={{ flex: 1 }}>
              <Mono>彖传</Mono>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.8, marginTop: 6, color: 'var(--ink-2)' }}>{q.tuan}</div>
            </div>
          </div>

          <div style={{ marginTop: 30, paddingTop: 28, borderTop: '1px solid var(--hair)' }}>
            <Mono>爻辞 · {cur.pos}</Mono>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 600, lineHeight: 1.5, marginTop: 14, letterSpacing: '0.02em' }}>{cur.text}</div>
            <div style={{ display: 'flex', gap: 14, marginTop: 22 }}>
              <div style={{ flex: 1 }}>
                <Mono dim>白话 · 示意</Mono>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.8, marginTop: 7, color: 'var(--ink-2)' }}>{cur.gloss}</div>
              </div>
              <Slot label="历代注解 · 占位" style={{ flex: 1, display: 'flex', alignItems: 'center' }} />
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            <Mono dim>卦变 · 推演之卦</Mono>
            <div style={{ marginTop: 12 }}>
              <BianPanel originName={q.full} lines={QIAN_LINES} sel={sel} changed={changed} onToggle={() => setChanged((c) => !c)} onOpenHex={onOpenHex} />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 22 }}>
            <Mono dim>由乾辐射 · 各家经典</Mono>
            <div style={{ marginTop: 12 }}><RelChips onOpen={onOpen} exclude="yi" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 道德经 · 第一章
function ReadingDao({ onBack, onOpen }: { onBack: () => void; onOpen: OpenNode }) {
  const d = DAODE1;
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="道德经" sub="老子" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        {/* left: 经卷 index */}
        <div style={{ width: 360, flex: '0 0 auto', borderRight: '1px solid var(--hair)', padding: '40px 44px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 80, color: 'var(--accent)', lineHeight: 1 }}>道</span>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 22, marginTop: 10 }}>道德经</div>
          <Mono dim style={{ marginTop: 4 }}>老子 · 八十一章</Mono>
          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column' }}>
            {d.chapters.map((c, i) => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 8, background: i === 0 ? 'var(--accent-soft)' : 'transparent' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: i === 0 ? 'var(--accent)' : 'var(--ink-3)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--ink)' : 'var(--ink-3)' }}>{c}</span>
                {i > 0 && <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)' }}>占位</span>}
              </div>
            ))}
          </div>
        </div>

        {/* right: chapter text */}
        <div style={{ flex: 1, padding: '40px 64px', display: 'flex', flexDirection: 'column' }}>
          <Mono>正在阅读 · {d.chapter}</Mono>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 30, margin: '12px 0 4px' }}>道德经 · 第一章</h1>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column' }}>
            {d.clauses.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '14px 0', borderTop: i ? '1px solid var(--hair)' : 'none' }}>
                <div style={{ flex: 1, fontFamily: 'var(--font-serif)', fontSize: 23, lineHeight: 1.7, letterSpacing: '0.02em' }}>{c}</div>
                <Slot label="注 · 占位" style={{ flex: '0 0 168px' }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <button onClick={() => onOpen('yi')} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: 999, padding: '8px 16px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)' }}>易</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{d.relation}</span>
              <span style={{ color: 'var(--accent)' }}>›</span>
            </button>
            <Mono dim>D · 经卷长轴</Mono>
          </div>
        </div>
      </div>
    </div>
  );
}

// 占位 (即将上线)
function ReadingSoon({ id, onBack, onOpen }: { id: string; onBack: () => void; onOpen: OpenNode }) {
  const n = NODE_BY_ID[id];
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={n.name} sub={n.author} onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 56 }}>
        <div style={{ width: 92, height: 92, borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, color: 'var(--accent)', lineHeight: 1, marginTop: 4 }}>{n.glyph}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 26, marginTop: 22 }}>{n.name}</div>
        <Mono dim style={{ marginTop: 6 }}>{n.author} · {n.rel}</Mono>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ink-2)', marginTop: 24, lineHeight: 1.7 }}>{n.frag}</div>
        <div style={{ marginTop: 28, padding: '10px 20px', border: '1px dashed var(--hair-2)', borderRadius: 999 }}>
          <Mono dim>内容编撰中 · 即将上线</Mono>
        </div>
        <div style={{ marginTop: 40 }}>
          <Mono dim>先读已上线的经典</Mono>
          <div style={{ marginTop: 14 }}><RelChips onOpen={onOpen} exclude={id} /></div>
        </div>
      </div>
    </div>
  );
}

export function Reading({ id, onBack, onOpen, onOpenHex }: { id: string; onBack: () => void; onOpen: OpenNode; onOpenHex: OpenHex }) {
  if (id === 'yi') return <ReadingQian onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} />;
  if (id === 'dao') return <ReadingDao onBack={onBack} onOpen={onOpen} />;
  return <ReadingSoon id={id} onBack={onBack} onOpen={onOpen} />;
}
