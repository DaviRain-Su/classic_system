// 先天「外圆内方」合体图（邵雍/伏羲六十四卦方圆图）。
import { useState } from 'react';
import { TRIGRAMS, type TrigramKey } from './data';
import { HexFigure } from './primitives';
import { Mono } from './chrome';
import { hexFromLines } from './hex';
import { TopBar, type OpenHex } from './shared';

const linesOf = (v: number) => [0, 1, 2, 3, 4, 5].map((i) => (v >> (5 - i)) & 1);
const rev6 = (v: number) => { let r = 0; for (let i = 0; i < 6; i++) r = (r << 1) | ((v >> i) & 1); return r; };
const FX: TrigramKey[] = ['qian', 'dui', 'li', 'zhen', 'xun', 'kan', 'gen', 'kun'];
const triVal: Record<TrigramKey, number> = { qian: 7, dui: 6, li: 5, zhen: 4, xun: 3, kan: 2, gen: 1, kun: 0 };

export function CircleSquare({ onBack, onOpenHex }: { onBack: () => void; onOpenHex: OpenHex }) {
  const [sel, setSel] = useState(63);
  const [hover, setHover] = useState<number | null>(null);
  const W = 1000, H = 824, cx = 500, cy = 408, R = 372;
  const selInfo = hexFromLines(linesOf(sel));
  const cuoV = sel ^ 63;

  const ringPos = (v: number) => {
    const bv = rev6(v);
    const k = bv >= 32 ? 63 - bv : bv + 32; // 乾(bv63)→顶, 坤(bv0)→底
    const ang = (-90 + k * (360 / 64)) * Math.PI / 180;
    return { x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R, ang };
  };

  const SQ = 280, cell = SQ / 8, sx0 = cx - SQ / 2, sy0 = cy - SQ / 2;
  const sqCellVal = (row: number, col: number) => triVal[FX[row]] * 8 + triVal[FX[col]];

  const a = ringPos(sel), b = ringPos(cuoV);

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="先天 · 方圆图" sub="伏羲六十四卦 · 外圆内方" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, width: 1000, bottom: 0 }}>
        <div style={{ position: 'absolute', bottom: 20, left: 40, zIndex: 3 }}>
          <Mono dim>外圆＝伏羲次序(二进制) · 内方＝8×8方图(上卦×下卦) · 点卦进入</Mono>
        </div>

        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={cx} cy={cy} r={R + 26} fill="none" stroke="var(--hair-2)" strokeWidth="1" opacity="0.5" />
          <circle cx={cx} cy={cy} r={R - 26} fill="none" stroke="var(--hair-2)" strokeWidth="1" opacity="0.5" />
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--seal)" strokeWidth="1" strokeDasharray="3 6" opacity="0.55" />
        </svg>

        {Array.from({ length: 64 }).map((_, v) => {
          const p = ringPos(v);
          const on = v === sel, hl = hover === v;
          const info = hexFromLines(linesOf(v));
          return (
            <div key={v} onClick={() => setSel(v)} onMouseEnter={() => setHover(v)} onMouseLeave={() => setHover(null)}
              onDoubleClick={() => onOpenHex(info.upper, info.lower)} title={info.name}
              style={{ position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%,-50%) rotate(${p.ang * 180 / Math.PI + 90}deg)`, cursor: 'pointer' }}>
              <div style={{ padding: 2, borderRadius: 3, background: on ? 'var(--accent-soft)' : 'transparent', boxShadow: on ? 'inset 0 0 0 1.2px var(--accent)' : 'none' }}>
                <HexFigure lines={info.lines} w={20} h={2} vgap={1.6} color={on || hl ? 'var(--accent)' : 'var(--ink-2)'} />
              </div>
            </div>
          );
        })}

        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <rect x={sx0} y={sy0} width={SQ} height={SQ} fill="var(--paper)" stroke="var(--hair-2)" strokeWidth="1" />
        </svg>
        {Array.from({ length: 8 }).map((_, row) => (
          Array.from({ length: 8 }).map((__, col) => {
            const v = sqCellVal(row, col);
            const on = v === sel, hl = hover === v;
            const info = hexFromLines(linesOf(v));
            return (
              <div key={row + '-' + col} onClick={() => setSel(v)} onMouseEnter={() => setHover(v)} onMouseLeave={() => setHover(null)}
                onDoubleClick={() => onOpenHex(info.upper, info.lower)} title={info.name}
                style={{ position: 'absolute', left: sx0 + col * cell, top: sy0 + row * cell, width: cell, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  borderRight: col < 7 ? '1px solid var(--hair)' : 'none', borderBottom: row < 7 ? '1px solid var(--hair)' : 'none',
                  background: on || hl ? 'var(--accent-soft)' : 'transparent', boxShadow: on ? 'inset 0 0 0 1.4px var(--accent)' : 'none' }}>
                <HexFigure lines={info.lines} w={20} h={2.2} vgap={1.8} color={on || hl ? 'var(--accent)' : 'var(--ink)'} />
              </div>
            );
          })
        ))}
      </div>

      <div style={{ position: 'absolute', top: 74, right: 0, width: 440, bottom: 0, borderLeft: '1px solid var(--hair)', padding: '40px', display: 'flex', flexDirection: 'column' }}>
        <Mono>方圆图 · 邵雍</Mono>
        <p style={{ fontSize: 13.5, lineHeight: 1.85, color: 'var(--ink-2)', margin: '12px 0 0' }}>
          相传伏羲所画。<b style={{ color: 'var(--ink)' }}>外圆</b>象天，六十四卦循二进制次序环列，乾起正上、坤居正下，错卦恰在对径；<b style={{ color: 'var(--ink)' }}>内方</b>象地，8×8 方图以上卦为行、下卦为列——正是本平台的卦阵。圆方相合，天地一体。
        </p>
        <div style={{ marginTop: 26, paddingTop: 24, borderTop: '1px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 22 }}>
          <HexFigure lines={selInfo.lines} w={60} h={6} vgap={6} color="var(--accent)" />
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 24 }}>{selInfo.name}</div>
            <Mono dim style={{ marginTop: 4 }}>第 {selInfo.num} 卦 · {TRIGRAMS[selInfo.upper].name}上{TRIGRAMS[selInfo.lower].name}下</Mono>
            <button onClick={() => onOpenHex(selInfo.upper, selInfo.lower)} style={{ marginTop: 10, border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)', borderRadius: 999, padding: '5px 13px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5 }}>读此卦 ›</button>
          </div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Mono dim>错卦 · 对径</Mono>
          {(() => { const ci = hexFromLines(linesOf(cuoV)); return (
            <button onClick={() => setSel(cuoV)} style={{ display: 'flex', alignItems: 'center', gap: 9, border: '1px solid var(--hair-2)', borderRadius: 8, padding: '7px 11px', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <HexFigure lines={ci.lines} w={24} h={2.4} vgap={2} color="var(--seal)" />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 600 }}>{ci.name}</span>
            </button>
          ); })()}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <Mono dim>单击选中 · 双击进入阅读</Mono>
        </div>
      </div>
    </div>
  );
}
