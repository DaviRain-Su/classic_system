// 星图首页 — 易经为最亮核心，各家(节点=家)如连线之星。
import { useState } from 'react';
import { NODES, NODE_BY_ID } from './data';
import { Yao } from './primitives';
import { Wordmark, Mono } from './chrome';
import { useProgress } from './progress';
import type { OpenNode } from './shared';

export function StarMap({ onOpen, onMatrix, onCube, onCast, onXici, onSearch, onRelations }: { onOpen: OpenNode; onMatrix: () => void; onCube: () => void; onCast: () => void; onXici: () => void; onSearch: () => void; onRelations: () => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const prog = useProgress();
  const core = NODE_BY_ID.yi;
  const sats = NODES.filter((n) => n.id !== 'yi');
  const stars = [
    { x: 430, y: 130, on: 1 }, { x: 792, y: 96, on: 0 }, { x: 1140, y: 312, on: 1 },
    { x: 1330, y: 640, on: 0 }, { x: 560, y: 712, on: 1 }, { x: 150, y: 470, on: 0 },
    { x: 770, y: 540, on: 0 }, { x: 1048, y: 470, on: 1 }, { x: 470, y: 360, on: 1 },
  ];
  const dim = (id: string) => hover !== null && hover !== id;
  const pill = { display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--hair-2)', background: 'transparent', borderRadius: 999, padding: '7px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)' } as const;
  const pillLabel = { fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--ink)' } as const;

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <div style={{ position: 'absolute', top: 34, left: 56, right: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
        <Wordmark />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onSearch} title="全文检索" style={pill}>
            <span style={{ color: 'var(--accent)', fontSize: 14 }}>⌕</span>
            <span style={pillLabel}>检索</span>
          </button>
          <button onClick={onRelations} title="关系图谱" style={pill}>
            <span style={{ color: 'var(--accent)', fontSize: 13 }}>❉</span>
            <span style={pillLabel}>关系</span>
          </button>
          <button onClick={onXici} style={pill}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--accent)', lineHeight: 1 }}>系</span>
            <span style={pillLabel}>系辞</span>
          </button>
          <button onClick={onCast} style={pill}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', border: '1.4px solid var(--seal)', display: 'inline-block' }} />
            <span style={pillLabel}>起卦</span>
          </button>
          <button onClick={onMatrix} style={pill}>
            <span style={{ display: 'grid', gridTemplateColumns: 'repeat(3,3px)', gap: 1.5 }}>
              {Array.from({ length: 9 }).map((_, i) => <span key={i} style={{ width: 3, height: 3, background: 'var(--accent)' }} />)}
            </span>
            <span style={pillLabel}>卦阵</span>
          </button>
          <button onClick={onCube} style={pill}>
            <span style={{ width: 12, height: 12, border: '1.4px solid var(--accent)', transform: 'rotate(45deg)', display: 'inline-block' }} />
            <span style={pillLabel}>立体</span>
          </button>
        </div>
      </div>

      <svg width={1440} height={900} viewBox="0 0 1440 900" style={{ position: 'absolute', inset: 0 }}>
        {sats.map((n) => {
          const on = hover === n.id;
          return (
            <line key={n.id} x1={core.x} y1={core.y} x2={n.x} y2={n.y}
              stroke={n.status === 'ghost' ? 'var(--ink-3)' : 'var(--accent)'}
              strokeWidth={on ? 1.8 : 1}
              strokeDasharray={n.status === 'ghost' ? '2 7' : 'none'}
              opacity={dim(n.id) ? 0.14 : n.status === 'ghost' ? 0.5 : on ? 0.95 : 0.5}
              style={{ transition: 'opacity .25s, stroke-width .25s' }} />
          );
        })}
      </svg>

      {stars.map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, transform: 'translate(-50%,-50%)', opacity: hover ? 0.16 : 0.3, transition: 'opacity .25s' }}>
          <Yao on={s.on} w={22} h={3} color="var(--ink-3)" />
        </div>
      ))}

      {sats.map((n) => {
        const mx = core.x + (n.x - core.x) * 0.5, my = core.y + (n.y - core.y) * 0.5;
        const on = hover === n.id;
        return (
          <div key={n.id + 'l'} style={{ position: 'absolute', left: mx, top: my, transform: 'translate(-50%,-50%)', background: 'var(--paper)', padding: '2px 8px', opacity: dim(n.id) ? 0.2 : 1, transition: 'opacity .25s', zIndex: 2 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: on ? 'var(--accent)' : n.status === 'ghost' ? 'var(--ink-3)' : 'var(--ink-2)', fontWeight: on ? 700 : 400, whiteSpace: 'nowrap' }}>{n.rel}</span>
          </div>
        );
      })}

      <div onClick={() => onOpen('yi')} onMouseEnter={() => setHover('yi')} onMouseLeave={() => setHover(null)}
        style={{ position: 'absolute', left: core.x, top: core.y, transform: `translate(-50%,-50%) scale(${hover === 'yi' ? 1.05 : 1})`, transition: 'transform .3s cubic-bezier(.3,.7,.3,1)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 240, cursor: 'pointer', zIndex: 3, opacity: dim('yi') ? 0.4 : 1 }}>
        <div style={{ position: 'relative', width: 134, height: 134 }}>
          <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--accent)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--paper)', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 7px var(--paper), 0 0 0 8px var(--accent-soft)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 78, color: 'var(--accent)', lineHeight: 1, marginTop: 4 }}>易</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 20, whiteSpace: 'nowrap' }}>易经 · 周易</span>
          {prog.isMarked('yi') && <span style={{ color: 'var(--seal)', fontSize: 14 }}>★</span>}
          {prog.isRead('yi') && !prog.isMarked('yi') && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />}
        </div>
        <Mono dim style={{ marginTop: 5 }}>系统思维 · 骨干</Mono>
      </div>

      {sats.map((n) => {
        const ghost = n.status === 'ghost';
        const on = hover === n.id;
        return (
          <div key={n.id} onClick={() => !ghost && onOpen(n.id)} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
            style={{ position: 'absolute', left: n.x, top: n.y, transform: `translate(-50%,-50%) scale(${on ? 1.06 : 1})`, transition: 'transform .3s cubic-bezier(.3,.7,.3,1), opacity .25s', width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: ghost ? 'default' : 'pointer', opacity: dim(n.id) ? 0.38 : 1, zIndex: 3 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: ghost ? 'var(--paper)' : 'var(--accent-soft)', border: `1px ${ghost ? 'dashed' : 'solid'} ${ghost ? 'var(--ink-3)' : 'var(--accent)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: on ? '0 6px 22px rgba(0,0,0,.12)' : 'none', transition: 'box-shadow .25s' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 23, color: ghost ? 'var(--ink-3)' : 'var(--accent)', lineHeight: 1, marginTop: 2 }}>{n.glyph}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 16.5, color: ghost ? 'var(--ink-3)' : 'var(--ink)' }}>{n.name}</span>
              {!ghost && prog.isMarked(n.id) && <span style={{ color: 'var(--seal)', fontSize: 13 }}>★</span>}
              {!ghost && prog.isRead(n.id) && !prog.isMarked(n.id) && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2, whiteSpace: 'nowrap' }}>{n.author}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: ghost ? 'var(--ink-3)' : 'var(--ink-2)', marginTop: 7, lineHeight: 1.55, whiteSpace: 'nowrap' }}>{n.frag}</div>
            {n.status === 'soon' && <span style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-3)', border: '1px solid var(--hair-2)', borderRadius: 999, padding: '2px 8px' }}>即将上线</span>}
            {n.status === 'west' && <span style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 999, padding: '2px 8px' }}>对照地图</span>}
          </div>
        );
      })}

      <div style={{ position: 'absolute', bottom: 30, left: 56, right: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14.5, color: 'var(--ink-2)' }}>关联网络 · 以《易经》为核心，点击节点进入阅读</div>
        <Mono dim>{`已读 ${prog.counts().read} · 收藏 ${prog.counts().mark}`}</Mono>
      </div>
    </div>
  );
}
