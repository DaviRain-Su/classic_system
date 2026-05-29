// 西方对照枝（拆分）：WestHome 落地页(卡片) + WestDetail 单条详情。仅书目 + 原创对照评注。
import { WEST_MAP, WEST_INTRO, type LinkSpec } from './data';
import { Mono } from './chrome';
import { TopBar } from './shared';

// 落地页：西学对照总览，每条对照为一张卡片
export function WestHome({ onBack, onOpenItem }: { onBack: () => void; onOpenItem: (idx: number) => void }) {
  const rows = WEST_MAP;
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="西方经典 · 对照枝" sub="系统思维 · 东西照面" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '34px 56px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22 }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--accent)', lineHeight: 1, marginTop: 3 }}>西</span>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 28, margin: 0 }}>西方经典 · 对照枝</h1>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: 'var(--ink-2)', margin: '8px 0 0', maxWidth: 760 }}>{WEST_INTRO}</p>
          </div>
        </div>

        <Mono dim style={{ marginTop: 24 }}>{rows.length} 条对照 · 点卡片看「重合 / 分歧」并跳回《易》</Mono>
        <div style={{ flex: 1, overflowY: 'auto', marginTop: 14, paddingRight: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {rows.map((r, i) => (
              <button key={i} onClick={() => onOpenItem(i)} style={{ textAlign: 'left', border: '1px solid var(--hair-2)', borderRadius: 12, padding: '18px 20px', background: 'var(--paper-2)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 16 }}>{r.facet}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>{r.year}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--ink-2)' }}>{r.hexLabel}</div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 7, paddingTop: 8, borderTop: '1px solid var(--hair)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--accent)' }}>⟷</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 600 }}>{r.cn}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 'auto' }}>{r.author}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <Mono dim style={{ marginTop: 12 }}>仅书目与对照评注 · 不含版权原文</Mono>
      </div>
    </div>
  );
}

// 单条详情：易侧面 ⟷ 著作 + 重合 / 分歧 + 跳回易
export function WestDetail({ index, onBack, onOpenItem, onJump }: { index: number; onBack: () => void; onOpenItem: (idx: number) => void; onJump: (j: LinkSpec) => void }) {
  const rows = WEST_MAP;
  const cur = rows[index];
  const prev = (index - 1 + rows.length) % rows.length;
  const next = (index + 1) % rows.length;
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={cur.cn} sub="西方经典 · 对照" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '40px 64px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span onClick={onBack} style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-3)', cursor: 'pointer' }}>西方经典 · 对照枝 <span style={{ margin: '0 2px' }}>›</span></span>
          <Mono dim>{index + 1} / {rows.length}</Mono>
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 18, marginTop: 18 }}>
          <button onClick={() => onJump(cur.jump)} style={{ flex: 1, textAlign: 'left', border: '1px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: 12, padding: '22px 24px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <Mono>《易》的侧面</Mono>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 23, marginTop: 8 }}>{cur.facet}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14.5, color: 'var(--ink-2)', marginTop: 6 }}>{cur.hexLabel}</div>
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>{cur.jump.label} →</div>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--ink-3)' }}>⟷</div>
          <div style={{ flex: 1, border: '1px solid var(--hair-2)', borderRadius: 12, padding: '22px 24px' }}>
            <Mono dim>西方 · 对照著作</Mono>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 21, marginTop: 8 }}>{cur.cn}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-3)', marginTop: 5 }}>{cur.work}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 8 }}>{cur.author} · {cur.year}</div>
          </div>
        </div>

        <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 22, flex: 1, overflowY: 'auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
              <Mono>重合 · 印证直觉</Mono>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.85, marginTop: 10 }}>{cur.rhyme}</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--seal)' }} />
              <Mono style={{ color: 'var(--seal)' }}>分歧 · 各自的路</Mono>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.85, marginTop: 10, color: 'var(--ink-2)' }}>{cur.diverge}</div>
          </div>
        </div>

        <div style={{ marginTop: 12, paddingTop: 18, borderTop: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => onOpenItem(prev)} style={{ border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-2)', borderRadius: 999, padding: '7px 15px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13 }}>‹ {rows[prev].cn}</button>
          <button onClick={() => onJump(cur.jump)} style={{ border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)', borderRadius: 999, padding: '8px 20px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 14 }}>{cur.jump.label} ›</button>
          <button onClick={() => onOpenItem(next)} style={{ border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-2)', borderRadius: 999, padding: '7px 15px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13 }}>{rows[next].cn} ›</button>
        </div>
      </div>
    </div>
  );
}
