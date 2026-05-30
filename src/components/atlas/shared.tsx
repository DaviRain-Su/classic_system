// 共享视图组件：TopBar / Slot / JiZhu / LinkChip / RelChips / BianPanel / GuaFamily。
import { type CSSProperties } from 'react';
import { Mono, NavRail } from './chrome';
import { HexFigure } from './primitives';
import { bian, hexFromLines, relatives, yaoName, type HexInfo } from './hex';
import { SCHOOL_INFO, type TrigramKey, type LinkSpec } from './data';
import { useProgress } from './progress';

export type OpenHex = (upper: TrigramKey, lower: TrigramKey) => void;
export type OpenNode = (id: string) => void;

export function TopBar({ title, sub, onBack, bookmarkKey, school, onOpenSchool }: {
  title: string; sub?: string; onBack: () => void; bookmarkKey?: string; school?: string; onOpenSchool?: (id: string) => void;
}) {
  const prog = useProgress();
  const marked = bookmarkKey ? prog.isMarked(bookmarkKey) : false;
  const sName = school && SCHOOL_INFO[school] ? SCHOOL_INFO[school].name : null;
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px', borderBottom: '1px solid var(--hair)', zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-2)', borderRadius: 999, padding: '7px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
          <span style={{ fontSize: 15 }}>‹</span> 星图
        </button>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          {sName && (
            <span onClick={() => onOpenSchool && onOpenSchool(school!)} style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-3)', cursor: 'pointer' }}>{sName} <span style={{ margin: '0 2px' }}>›</span></span>
          )}
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap' }}>{title}</span>
          {sub && <Mono dim>{sub}</Mono>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {bookmarkKey && (
          <button onClick={() => prog.toggleMark(bookmarkKey)} title="收藏" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, lineHeight: 1, color: marked ? 'var(--seal)' : 'var(--ink-3)', padding: 2 }}>
            {marked ? '★' : '☆'}
          </button>
        )}
        <NavRail items={['读', '经', '索', '占']} />
      </div>
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

// 逐句集注待接入真实底本。避免展示“编撰中”假标签误导读者。
export function JiZhu({ names }: { names: string[] }) {
  void names;
  return null;
}

export function LinkChip({ link, onOpen, onOpenHex }: { link?: LinkSpec; onOpen: OpenNode; onOpenHex: OpenHex }) {
  if (!link) return null;
  const go = () => {
    if (link.onClick) return link.onClick();
    if (link.kind === 'hex' && link.upper && link.lower) return onOpenHex(link.upper, link.lower);
    if (link.id) return onOpen(link.id);
  };
  return (
    <button onClick={go} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)', borderRadius: 999, padding: '5px 13px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5 }}>
      <span style={{ color: 'var(--accent)' }}>⟿</span> {link.label}
    </button>
  );
}

// 由此辐射 · 各家 chips（点击进家级落地页）
export function RelChips({ onOpen, exclude }: { onOpen: OpenNode; exclude?: string | null }) {
  const items = Object.values(SCHOOL_INFO).filter((s) => s.id !== exclude);
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {items.map((s) => (
        <button key={s.id} onClick={() => onOpen(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 13px', border: '1px solid var(--hair-2)', borderRadius: 999, background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', flex: '0 0 auto' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)' }}>{s.glyph}</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{s.name}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.tagline}</span>
        </button>
      ))}
    </div>
  );
}

// 卦变面板
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
  const origin = hexFromLines(lines);
  const r = relatives(lines);
  const items: [string, HexInfo, string, string, number, number][] = [
    ['错卦', r.cuo, '六爻全反', '反相', 50, 15],
    ['综卦', r.zong, '上下倒置', '倒观', 18, 52],
    ['互卦', r.hu, '中四爻成卦', '内核', 82, 52],
    ['交卦', r.jiao, '上下卦互换', '换位', 50, 85],
  ];
  const node = (lab: string, info: HexInfo, hint: string, tag: string, x: number, y: number) => (
    <button key={lab} onClick={() => onOpenHex(info.upper, info.lower)} title={`${lab}：${hint}`}
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', width: 118, minHeight: 64, border: '1px solid var(--hair-2)', borderRadius: 8, background: 'color-mix(in srgb, var(--paper) 93%, transparent)', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left', padding: '8px 10px', boxShadow: '0 2px 10px rgba(0,0,0,.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <HexFigure lines={info.lines} w={28} h={3} vgap={2.5} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{lab}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-3)' }}>{tag}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', marginTop: 2 }}>{info.name}</div>
        </div>
      </div>
      <div style={{ marginTop: 5, fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-3)', letterSpacing: '0.06em' }}>{hint}</div>
    </button>
  );
  return (
    <div style={{ border: '1px solid var(--hair)', borderRadius: 10, background: 'var(--paper-2)', padding: '12px 12px 10px' }}>
      <div style={{ position: 'relative', height: 252, overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 320 240" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <line x1="160" y1="120" x2="160" y2="36" stroke="var(--accent)" strokeWidth="1.1" opacity="0.42" />
          <line x1="160" y1="120" x2="58" y2="120" stroke="var(--accent)" strokeWidth="1.1" opacity="0.42" />
          <line x1="160" y1="120" x2="262" y2="120" stroke="var(--accent)" strokeWidth="1.1" opacity="0.42" />
          <line x1="160" y1="120" x2="160" y2="204" stroke="var(--accent)" strokeWidth="1.1" opacity="0.42" />
          <circle cx="160" cy="120" r="46" fill="none" stroke="var(--hair-2)" strokeWidth="1" strokeDasharray="3 6" opacity="0.9" />
        </svg>

        <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)', width: 112, minHeight: 74, border: '1.5px solid var(--accent)', borderRadius: 10, background: 'var(--paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 5px var(--accent-soft)' }}>
          <HexFigure lines={origin.lines} w={36} h={3.5} vgap={3} color="var(--accent)" />
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', marginTop: 6 }}>{origin.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-3)', marginTop: 1 }}>本卦 · {String(origin.num).padStart(2, '0')}</div>
        </div>

        {items.map(([lab, info, hint, tag, x, y]) => node(lab, info, hint, tag, x, y))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, borderTop: '1px solid var(--hair)', paddingTop: 9 }}>
        {items.map(([lab, , hint, tag]) => (
          <div key={lab} style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 11.5, fontWeight: 700, color: 'var(--accent)' }}>{lab}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--ink-3)', marginTop: 2 }}>{tag} · {hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
