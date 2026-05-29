// 六十四卦方阵(可搜索) + 单卦阅读页。
import { useState } from 'react';
import { TRIGRAMS, TRIGRAM_ORDER, type TrigramKey } from './data';
import { HexFigure, MorphYao } from './primitives';
import { Mono } from './chrome';
import { hexInfo, yaoName, bian } from './hex';
import { TopBar, Slot, RelChips, BianPanel, GuaFamily, type OpenNode, type OpenHex } from './shared';

// 六十四卦方阵
export function MatrixBrowse({ onBack, onOpenHex, onCube }: { onBack: () => void; onOpenHex: OpenHex; onCube: () => void }) {
  const order = TRIGRAM_ORDER;
  const [q, setQ] = useState('');
  const [hover, setHover] = useState<string | null>(null);
  const query = q.trim();
  const match = (up: TrigramKey, lo: TrigramKey) => {
    if (!query) return true;
    const info = hexInfo(up, lo);
    return info.name.includes(query) || String(info.num) === query ||
      TRIGRAMS[up].name.includes(query) || TRIGRAMS[lo].name.includes(query) ||
      TRIGRAMS[up].nature.includes(query) || TRIGRAMS[lo].nature.includes(query);
  };
  const CELL = 82;
  const matchCount = order.flatMap((u) => order.filter((l) => match(u, l))).length;

  const Axis = ({ k }: { k: TrigramKey }) => (
    <div style={{ width: CELL, height: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>{TRIGRAMS[k].name}</span>
      <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{TRIGRAMS[k].glyph} {TRIGRAMS[k].nature}</span>
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="六十四卦" sub="8 × 8 · 上卦 × 下卦" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 18 }}>
        {/* search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--hair-2)', borderRadius: 999, padding: '8px 16px', background: 'var(--paper-2)', width: 320 }}>
            <span style={{ color: 'var(--ink-3)', fontSize: 14 }}>⌕</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜卦名 / 卦序 / 八卦（如 既济、63、水、坎）"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--ink)', width: '100%' }} />
            {q && <button onClick={() => setQ('')} style={{ border: 'none', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', fontSize: 14 }}>✕</button>}
          </div>
          <Mono dim>{query ? `${matchCount} 卦匹配` : '共 64 卦 · 点击进入'}</Mono>
          <button onClick={onCube} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--hair-2)', background: 'transparent', borderRadius: 999, padding: '7px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--ink)' }}>
            <span style={{ width: 11, height: 11, border: '1.3px solid var(--accent)', transform: 'rotate(45deg)', display: 'inline-block' }} /> 立体图
          </button>
        </div>

        {/* grid */}
        <div>
          <div style={{ display: 'flex', marginLeft: 44 }}>
            {order.map((k) => <Axis key={k} k={k} />)}
          </div>
          {order.map((up) => (
            <div key={up} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 44, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>{TRIGRAMS[up].name}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{TRIGRAMS[up].glyph}</div>
              </div>
              {order.map((lo) => {
                const info = hexInfo(up, lo);
                const on = match(up, lo);
                const hl = hover === up + lo;
                const full = up === 'qian' && lo === 'qian';
                return (
                  <div key={lo} onClick={() => onOpenHex(up, lo)} onMouseEnter={() => setHover(up + lo)} onMouseLeave={() => setHover(null)}
                    style={{ width: CELL, height: CELL, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer', position: 'relative',
                      border: '1px solid var(--hair)', borderRadius: 6, margin: -0.5,
                      background: hl ? 'var(--accent-soft)' : 'transparent',
                      boxShadow: hl ? 'inset 0 0 0 1.5px var(--accent)' : 'none',
                      opacity: on ? 1 : 0.16, transition: 'opacity .2s, background .15s, box-shadow .15s' }}>
                    {full && <span style={{ position: 'absolute', top: 6, right: 7, width: 5, height: 5, borderRadius: '50%', background: 'var(--seal)' }} />}
                    <HexFigure lines={info.lines} w={28} h={3} vgap={2.5} color={hl ? 'var(--accent)' : 'var(--ink)'} />
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 11, color: hl ? 'var(--ink)' : 'var(--ink-2)', whiteSpace: 'nowrap' }}>{info.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-3)' }}>{String(info.num).padStart(2, '0')}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 单卦阅读页 (占位文本 + 可演示卦变)
export function ReadingHex({ upper, lower, onBack, onOpen, onOpenHex }: { upper: TrigramKey; lower: TrigramKey; onBack: () => void; onOpen: OpenNode; onOpenHex: OpenHex }) {
  const info = hexInfo(upper, lower);
  const [sel, setSel] = useState(5);
  const [changed, setChanged] = useState(false);
  const baseLines = info.lines;
  const dispLines = changed ? bian(baseLines, sel).lines : baseLines;

  const Row = ({ i }: { i: number }) => {
    const on = sel === i;
    const pos = yaoName(i, baseLines[i] === 1);
    return (
      <div onClick={() => { setSel(i); setChanged(false); }} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', background: on ? 'var(--accent-soft)' : 'transparent', transition: 'background .18s' }}>
        <span style={{ width: 30, fontFamily: 'var(--font-mono)', fontSize: 10, color: on ? 'var(--accent)' : 'var(--ink-3)', textAlign: 'right' }}>{pos}</span>
        <MorphYao broken={dispLines[i] === 0} w={150} h={12} gap={22} color={on ? (changed ? 'var(--seal)' : 'var(--accent)') : 'var(--ink)'} />
      </div>
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={'易经 · ' + info.name} sub={'第 ' + info.num + ' 卦'} onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 470, flex: '0 0 auto', borderRight: '1px solid var(--hair)', padding: '40px 48px' }}>
          <Mono>卦象 · {info.name}</Mono>
          <div style={{ marginTop: 16 }}>
            {baseLines.map((_, i) => <Row key={i} i={i} />)}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            {([['上卦', upper], ['下卦', lower]] as [string, TrigramKey][]).map(([lab, tk]) => (
              <div key={lab} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--hair)', borderRadius: 8 }}>
                <span style={{ fontSize: 20, color: 'var(--accent)' }}>{TRIGRAMS[tk].glyph}</span>
                <div>
                  <Mono dim>{lab}</Mono>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600 }}>{TRIGRAMS[tk].name} · {TRIGRAMS[tk].nature}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26 }}>
            <Mono dim>卦族 · 错 / 综 / 互 / 交</Mono>
            <div style={{ marginTop: 12 }}><GuaFamily lines={baseLines} onOpenHex={onOpenHex} /></div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '40px 56px', display: 'flex', flexDirection: 'column' }}>
          <Mono>卦辞</Mono>
          <div style={{ marginTop: 10 }}><Slot label="卦辞 · 编撰中" /></div>
          <div style={{ marginTop: 26, paddingTop: 24, borderTop: '1px solid var(--hair)' }}>
            <Mono>爻辞 · {yaoName(sel, baseLines[sel] === 1)}</Mono>
            <div style={{ marginTop: 10 }}><Slot label="爻辞 / 白话 / 注解 · 编撰中" /></div>
          </div>
          <div style={{ marginTop: 28 }}>
            <Mono dim>卦变 · 推演之卦</Mono>
            <div style={{ marginTop: 12 }}>
              <BianPanel originName={info.name} lines={baseLines} sel={sel} changed={changed} onToggle={() => setChanged((c) => !c)} onOpenHex={onOpenHex} />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 22 }}>
            <Mono dim>由此辐射 · 各家经典</Mono>
            <div style={{ marginTop: 12 }}><RelChips onOpen={onOpen} exclude="yi" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
