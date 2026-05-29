// 点读升级：词条释名(浮注·Portal 视口定位) + 双栏对照。
import { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TERMS, type Clause } from './data';
import { Mono } from './chrome';
import { LinkChip, type OpenNode, type OpenHex } from './shared';

interface Anchor { cx: number; top: number; bottom: number; below: boolean; }

// 渲染一段经文，将 TERMS 中的术语高亮为可点词条（点击弹浮注，Portal 到 body、视口定位）。
export function TermText({ text, size = 19, color = 'var(--ink)', lh = 1.7 }: { text: string; size?: number; color?: string; lh?: number }) {
  const terms = TERMS;
  const [open, setOpen] = useState(-1);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const keys = useMemo(() => Object.keys(terms).sort((a, b) => b.length - a.length), [terms]);

  const close = useCallback(() => { setOpen(-1); setAnchor(null); }, []);
  const onTermClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (open === idx) return close();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setAnchor({ cx: r.left + r.width / 2, top: r.top, bottom: r.bottom, below: r.top < 200 });
    setOpen(idx);
  };
  useEffect(() => {
    if (open < 0) return;
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => { window.removeEventListener('resize', close); window.removeEventListener('scroll', close, true); };
  }, [open, close]);

  const segs: { term?: string; plain?: string }[] = [];
  let i = 0;
  while (i < text.length) {
    let m: string | null = null;
    for (const k of keys) { if (text.startsWith(k, i)) { m = k; break; } }
    if (m) { segs.push({ term: m }); i += m.length; }
    else {
      const last = segs[segs.length - 1];
      if (last && last.plain !== undefined) last.plain += text[i];
      else segs.push({ plain: text[i] });
      i++;
    }
  }
  const openTerm = open >= 0 && segs[open] ? segs[open].term : null;

  return (
    <span style={{ fontFamily: 'var(--font-serif)', fontSize: size, lineHeight: lh, color, letterSpacing: '0.02em' }}>
      {segs.map((s, idx) => s.term ? (
        <span key={idx} onClick={(e) => onTermClick(e, idx)}
          style={{ color: 'var(--accent)', borderBottom: open === idx ? '1px solid var(--accent)' : '1px dotted var(--accent)', cursor: 'pointer', paddingBottom: 1 }}>{s.term}</span>
      ) : <span key={idx}>{s.plain}</span>)}
      {open >= 0 && anchor && openTerm && createPortal(
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            position: 'fixed',
            left: Math.max(12, Math.min(anchor.cx - 130, window.innerWidth - 272)),
            ...(anchor.below ? { top: anchor.bottom + 10 } : { top: anchor.top - 10, transform: 'translateY(-100%)' }),
            width: 260, maxWidth: 'calc(100vw - 24px)', background: 'var(--paper)', border: '1px solid var(--accent)',
            borderRadius: 10, padding: '13px 15px', boxShadow: '0 16px 40px rgba(0,0,0,.22)', textAlign: 'left', fontFamily: 'var(--font-body)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15, color: 'var(--accent)' }}>{openTerm}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>释名</span>
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.8, color: 'var(--ink-2)', marginTop: 8 }}>{terms[openTerm]}</span>
          </div>
        </div>,
        document.body,
      )}
    </span>
  );
}

// 展开 / 双栏 切换段
export function ModeToggle({ mode, onChange }: { mode: string; onChange: (m: string) => void }) {
  const opts: [string, string][] = [['unfold', '展开点注'], ['parallel', '双栏对照']];
  return (
    <div style={{ display: 'inline-flex', gap: 4, padding: 3, borderRadius: 999, border: '1px solid var(--hair-2)', background: 'var(--paper-2)' }}>
      {opts.map(([k, lab]) => (
        <button key={k} onClick={() => onChange(k)} style={{ border: 'none', borderRadius: 999, padding: '5px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, background: mode === k ? 'var(--accent)' : 'transparent', color: mode === k ? '#fff' : 'var(--ink-2)' }}>{lab}</button>
      ))}
    </div>
  );
}

// 双栏对照：左原文(可点词条) 右白话，逐句对齐
export function ParallelView({ clauses, onOpen, onOpenHex }: { clauses: Clause[]; onOpen: OpenNode; onOpenHex: OpenHex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: 6 }}>
      <div style={{ display: 'flex', gap: 28, padding: '0 0 10px' }}>
        <div style={{ flex: 1 }}><Mono dim>原文</Mono></div>
        <div style={{ flex: 1 }}><Mono dim>白话</Mono></div>
      </div>
      {clauses.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 28, padding: '15px 0', borderTop: '1px solid var(--hair)' }}>
          <div style={{ flex: 1 }}>
            <TermText text={c.text} size={18} lh={1.75} />
            {c.link && <div style={{ marginTop: 10 }}><LinkChip link={c.link} onOpen={onOpen} onOpenHex={onOpenHex} /></div>}
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--font-serif)', fontSize: 14.5, lineHeight: 1.85, color: 'var(--ink-2)', paddingTop: 1 }}>{c.gloss}</div>
        </div>
      ))}
    </div>
  );
}
