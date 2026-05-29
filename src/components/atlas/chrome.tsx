// 共享 chrome — wordmark、mono 标签、印章、frame。
import type { CSSProperties, ReactNode } from 'react';

export function Frame({ children, style = {}, pad = 56 }: { children: ReactNode; style?: CSSProperties; pad?: number }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', boxSizing: 'border-box',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: 'var(--font-body)', overflow: 'hidden', padding: pad, ...style,
    }}>{children}</div>
  );
}

// 小号等宽 eyebrow / 标签。
export function Mono({ children, style = {}, dim = false }: { children: ReactNode; style?: CSSProperties; dim?: boolean }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: dim ? 'var(--ink-3)' : 'var(--ink-2)',
      whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  );
}

// 经典图谱 wordmark（笔意「易」）。
export function Wordmark({ scale = 1, en = true }: { scale?: number; en?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 * scale }}>
      <div style={{
        width: 30 * scale, height: 30 * scale, borderRadius: '50%',
        border: '1.5px solid var(--accent)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 * scale, color: 'var(--accent)', lineHeight: 1, marginTop: 2 * scale }}>易</span>
      </div>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 17 * scale, letterSpacing: '0.04em' }}>经典图谱</div>
        {en && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5 * scale, letterSpacing: '0.22em', color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 2 }}>Classical Atlas</div>}
      </div>
    </div>
  );
}

// 右上工具导航（静态视觉）。
export function NavRail({ items = ['卦', '经', '索', '占'] }: { items?: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 22 }}>
      {items.map((it, i) => (
        <span key={i} style={{
          fontFamily: 'var(--font-serif)', fontSize: 14, color: i === 0 ? 'var(--ink)' : 'var(--ink-3)',
          fontWeight: i === 0 ? 600 : 400, paddingBottom: 4,
          borderBottom: i === 0 ? '1.5px solid var(--accent)' : '1.5px solid transparent',
        }}>{it}</span>
      ))}
    </div>
  );
}

// 朱砂印章 — 全图唯一一抹印泥红。
export function Seal({ char = '易', size = 34 }: { char?: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 4, border: '1.5px solid var(--seal)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
    }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.6, color: 'var(--seal)', lineHeight: 1, marginTop: 1 }}>{char}</span>
    </div>
  );
}
