// 视觉基元 — 阴阳爻、爻叠、卦象、动爻形变。
import type { CSSProperties } from 'react';

// 单爻。on=1 阳(实线)，on=0 阴(中断两段)。
export function Yao({ on, w = 46, h = 8, gap = 9, color = 'var(--ink)', r = 1 }: {
  on: number; w?: number; h?: number; gap?: number; color?: string; r?: number;
}) {
  if (on) {
    return <div style={{ width: w, height: h, background: color, borderRadius: r }} />;
  }
  const seg = (w - gap) / 2;
  return (
    <div style={{ display: 'flex', gap, width: w, height: h }}>
      <div style={{ width: seg, height: h, background: color, borderRadius: r }} />
      <div style={{ width: seg, height: h, background: color, borderRadius: r }} />
    </div>
  );
}

// 爻叠（自上而下）。markIdx 给某一爻着色（动爻）。
export function Lines({ lines, w = 46, h = 8, vgap = 6, color = 'var(--ink)', markIdx = -1, markColor = 'var(--seal)' }: {
  lines: number[]; w?: number; h?: number; vgap?: number; color?: string; markIdx?: number; markColor?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: vgap, alignItems: 'center' }}>
      {lines.map((l, i) => (
        <Yao key={i} on={l} w={w} h={h} color={i === markIdx ? markColor : color} />
      ))}
    </div>
  );
}

// 六十四卦：上卦叠下卦（6 爻）。
export function Hexagram({ upper, lower, ...rest }: { upper: number[]; lower: number[] } & Record<string, unknown>) {
  return <Lines lines={[...upper, ...lower]} {...rest} />;
}

// 动爻：在 阳(实) ⇄ 阴(断) 之间形变。
export function MorphYao({ broken, w = 150, h = 12, color = 'var(--ink)', gap = 18 }: {
  broken: boolean; w?: number; h?: number; color?: string; gap?: number;
}) {
  const g = broken ? gap : 0;
  const seg = (w - g) / 2;
  const T = 'width .46s cubic-bezier(.5,0,.2,1), background .3s';
  return (
    <div style={{ display: 'flex', width: w, height: h, alignItems: 'center' }}>
      <div style={{ height: h, width: seg, background: color, borderRadius: 1, transition: T }} />
      <div style={{ width: g, transition: 'width .46s cubic-bezier(.5,0,.2,1)' }} />
      <div style={{ height: h, width: seg, background: color, borderRadius: 1, transition: T }} />
    </div>
  );
}

// 竖排卦象（lines 自上而下）；markIdx 着色一爻。
export function HexFigure({ lines, w = 70, h = 7, vgap = 6, color = 'var(--ink)', markIdx = -1, markColor = 'var(--seal)' }: {
  lines: number[]; w?: number; h?: number; vgap?: number; color?: string; markIdx?: number; markColor?: string;
}) {
  const style: CSSProperties = { display: 'flex', flexDirection: 'column', gap: vgap, alignItems: 'center' };
  return (
    <div style={style}>
      {lines.map((l, i) => (
        <MorphYao key={i} broken={l === 0} w={w} h={h} gap={Math.max(10, w * 0.16)}
          color={i === markIdx ? markColor : color} />
      ))}
    </div>
  );
}
