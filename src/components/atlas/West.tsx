// 东西对照地图 — 西方系统思维著作 ↔ 《易》的侧面。仅书目 + 原创对照评注。
import { useState } from 'react';
import { WEST_MAP, WEST_INTRO, type LinkSpec } from './data';
import { Mono } from './chrome';
import { TopBar } from './shared';

export function WestView({ onBack, onJump }: { onBack: () => void; onJump: (j: LinkSpec) => void }) {
  const [sel, setSel] = useState(0);
  const rows = WEST_MAP;
  const cur = rows[sel];

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="西方经典 · 对照地图" sub="系统思维 · 东西照面" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 470, flex: '0 0 auto', borderRight: '1px solid var(--hair)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '26px 40px 18px' }}>
            <Mono>易 ⟷ 西方 · 对照</Mono>
            <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--ink-2)', margin: '12px 0 0' }}>{WEST_INTRO}</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
            {rows.map((r, i) => {
              const on = i === sel;
              return (
                <div key={i} onClick={() => setSel(i)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 10, cursor: 'pointer', background: on ? 'var(--accent-soft)' : 'transparent', boxShadow: on ? 'inset 0 0 0 1.4px var(--accent)' : 'none', marginBottom: 6, transition: 'background .15s' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{r.facet}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--accent)', marginTop: 3 }}>{r.cn} · {r.author}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>{r.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, padding: '40px 56px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 18 }}>
            <button onClick={() => onJump(cur.jump)} style={{ flex: 1, textAlign: 'left', border: '1px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: 12, padding: '20px 22px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <Mono>《易》的侧面</Mono>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 21, marginTop: 8 }}>{cur.facet}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-2)', marginTop: 6 }}>{cur.hexLabel}</div>
              <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>{cur.jump.label} →</div>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--ink-3)' }}>⟷</div>
            <div style={{ flex: 1, border: '1px solid var(--hair-2)', borderRadius: 12, padding: '20px 22px' }}>
              <Mono dim>西方 · 对照著作</Mono>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 19, marginTop: 8 }}>{cur.cn}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4 }}>{cur.work}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 8 }}>{cur.author} · {cur.year}</div>
            </div>
          </div>

          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                <Mono>重合 · 印证直觉</Mono>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, lineHeight: 1.85, marginTop: 10 }}>{cur.rhyme}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--seal)' }} />
                <Mono style={{ color: 'var(--seal)' }}>分歧 · 各自的路</Mono>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15.5, lineHeight: 1.85, marginTop: 10, color: 'var(--ink-2)' }}>{cur.diverge}</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 22, borderTop: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Mono dim>仅书目与对照评注 · 不含版权原文</Mono>
            <button onClick={() => onJump(cur.jump)} style={{ border: '1px solid var(--accent)', background: 'transparent', color: 'var(--ink)', borderRadius: 999, padding: '8px 18px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 14 }}>{cur.jump.label} ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
