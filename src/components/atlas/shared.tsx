// 共享视图组件：TopBar / Slot / RelChips / BianPanel / GuaFamily。
import type { CSSProperties } from 'react';
import { Mono, NavRail } from './chrome';
import { HexFigure } from './primitives';
import { bian, relatives, yaoName, type HexInfo } from './hex';
import { NODES, type TrigramKey } from './data';

export type OpenHex = (upper: TrigramKey, lower: TrigramKey) => void;
export type OpenNode = (id: string) => void;

export function TopBar({ title, sub, onBack }: { title: string; sub?: string; onBack: () => void }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px', borderBottom: '1px solid var(--hair)', zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-2)', borderRadius: 999, padding: '7px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
          <span style={{ fontSize: 15 }}>‹</span> 星图
        </button>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap' }}>{title}</span>
          {sub && <Mono dim>{sub}</Mono>}
        </div>
      </div>
      <NavRail items={['读', '经', '索', '占']} />
    </div>
  );
}

export function Slot({ label, style = {} }: { label: string; style?: CSSProperties }) {
  return (
    <div style={{ padding: '11px 14px', border: '1px dashed var(--hair-2)', borderRadius: 6, ...style }}>
      <Mono dim>{label}</Mono>
    </div>
  );
}

export function RelChips({ onOpen, exclude }: { onOpen: OpenNode; exclude?: string }) {
  const items = NODES.filter((n) => n.status !== 'ghost' && n.id !== exclude);
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {items.map((n) => (
        <button key={n.id} onClick={() => onOpen(n.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 13px', border: '1px solid var(--hair-2)', borderRadius: 999, background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)' }}>{n.glyph}</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{n.name.replace('易经 · ', '')}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{n.rel}</span>
        </button>
      ))}
    </div>
  );
}

// 卦变面板（乾卦 & 单卦页共用）
export function BianPanel({ originName, lines, sel, changed, onToggle, onOpenHex }: {
  originName: string; lines: number[]; sel: number; changed: boolean; onToggle: () => void; onOpenHex: OpenHex;
}) {
  const pos = yaoName(sel, lines[sel] === 1);
  if (!changed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 9, border: '1px solid var(--seal)', color: 'var(--seal)', background: 'transparent', borderRadius: 999, padding: '8px 16px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
          变 · {pos} <span style={{ fontSize: 15 }}>→</span>
        </button>
        <Mono dim>点击使此爻动，推演之卦</Mono>
      </div>
    );
  }
  const z = bian(lines, sel);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '16px 20px', border: '1px solid var(--hair-2)', borderRadius: 10, background: 'var(--paper-2)' }}>
      <div style={{ textAlign: 'center' }}>
        <Mono dim>之卦</Mono>
        <div style={{ marginTop: 8 }}><HexFigure lines={z.lines} w={58} h={6} vgap={5} markIdx={sel} /></div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17 }}>
          <span style={{ color: 'var(--ink-2)' }}>{originName} · {pos}动</span>
          <span style={{ color: 'var(--seal)', margin: '0 10px' }}>→</span>
          <span style={{ fontWeight: 700 }}>{z.name}</span>
          <span style={{ color: 'var(--ink-3)', fontSize: 13, marginLeft: 8 }}>第 {z.num} 卦</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button onClick={() => onOpenHex(z.upper, z.lower)} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)', borderRadius: 999, padding: '6px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13 }}>读 {z.name} ›</button>
          <button onClick={onToggle} style={{ border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-2)', borderRadius: 999, padding: '6px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13 }}>还原</button>
        </div>
      </div>
    </div>
  );
}

// 卦族面板（错 / 综 / 互 / 交）
export function GuaFamily({ lines, onOpenHex }: { lines: number[]; onOpenHex: OpenHex }) {
  const r = relatives(lines);
  const items: [string, HexInfo, string][] = [
    ['错卦', r.cuo, '六爻全反'],
    ['综卦', r.zong, '上下颠倒'],
    ['互卦', r.hu, '中四爻'],
    ['交卦', r.jiao, '上下卦换'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {items.map(([lab, info, hint]) => (
        <button key={lab} onClick={() => onOpenHex(info.upper, info.lower)} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--hair-2)', borderRadius: 8, padding: '10px 12px', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
          <HexFigure lines={info.lines} w={30} h={3} vgap={2.5} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{lab}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-3)' }}>{hint}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', marginTop: 2 }}>{info.name}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
