// 共享视图组件：TopBar / Slot / JiZhu / LinkChip / RelChips / BianPanel / GuaFamily。
import { useState, type CSSProperties } from 'react';
import { Mono, NavRail } from './chrome';
import { HexFigure } from './primitives';
import { bian, relatives, yaoName, type HexInfo } from './hex';
import { SCHOOL_INFO, type TrigramKey, type LinkSpec } from './data';
import { useProgress } from './progress';
import { JIZHU } from './jizhu';

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

// 历代易注（卦级真注）：程颐《伊川易传》 / 朱熹《周易本义》。按可用项显示 tab。
export function YiZhu({ num }: { num: number }) {
  const z = JIZHU[num] || {};
  const tabs: [string, string][] = [];
  if (z.cheng) tabs.push(['程颐《伊川易传》', z.cheng]);
  if (z.zhu) tabs.push(['朱熹《周易本义》', z.zhu]);
  const [t, setT] = useState(0);
  if (tabs.length === 0) {
    return <div style={{ marginTop: 10, padding: '12px 14px', border: '1px dashed var(--hair-2)', borderRadius: 6 }}><Mono dim>历代易注 · 此卦待补</Mono></div>;
  }
  const cur = tabs[Math.min(t, tabs.length - 1)];
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tabs.map(([label], i) => (
          <button key={label} onClick={() => setT(i)} style={{ border: '1px solid ' + (i === t ? 'var(--accent)' : 'var(--hair-2)'), background: i === t ? 'var(--accent-soft)' : 'transparent', color: i === t ? 'var(--ink)' : 'var(--ink-3)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 12.5 }}>{label}</button>
        ))}
      </div>
      <div style={{ marginTop: 10, maxHeight: 168, overflowY: 'auto', padding: '12px 14px', border: '1px solid var(--hair-2)', borderRadius: 8, background: 'var(--paper-2)', fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.9, color: 'var(--ink-2)' }}>{cur[1]}</div>
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
