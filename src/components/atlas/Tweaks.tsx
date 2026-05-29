// 站点 Tweaks 控件 — 字体(宋/黑/楷)、深色模式、主色四选。
import { useState } from 'react';

export interface TweakState {
  font: 'song' | 'hei' | 'kai';
  dark: boolean;
  accent: string;
  motif: 'bagua' | 'ink' | 'none';
}

const FONTS: [TweakState['font'], string][] = [['song', '宋'], ['hei', '黑'], ['kai', '楷']];
const ACCENTS: [string, string][] = [['#3a5f5a', '青瓷'], ['#4a5a72', '黛蓝'], ['#6e4f48', '陶'], ['#5a5640', '橄榄']];
const MOTIFS: [TweakState['motif'], string][] = [['bagua', '八卦'], ['ink', '水墨字'], ['none', '素净']];

export function Tweaks({ value, onChange }: { value: TweakState; onChange: <K extends keyof TweakState>(k: K, v: TweakState[K]) => void }) {
  const [open, setOpen] = useState(false);
  const btn = (active: boolean): React.CSSProperties => ({
    flex: 1, border: 'none', borderRadius: 7, padding: '6px 0', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 13,
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--ink-2)', transition: 'background .15s',
  });
  const label: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' };

  return (
    <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 2147483646, fontFamily: 'var(--font-body)' }}>
      {open && (
        <div style={{
          position: 'absolute', right: 0, bottom: 52, width: 232,
          background: 'var(--paper-2)', border: '1px solid var(--hair-2)', borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,.18)', padding: 16, display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <div>
            <span style={label}>字体 · 正文</span>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, padding: 3, borderRadius: 9, background: 'var(--accent-soft)' }}>
              {FONTS.map(([k, lab]) => (
                <button key={k} onClick={() => onChange('font', k)} style={btn(value.font === k)}>{lab}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={label}>深色模式</span>
            <button onClick={() => onChange('dark', !value.dark)} role="switch" aria-checked={value.dark}
              style={{ position: 'relative', width: 38, height: 22, border: 'none', borderRadius: 999, cursor: 'pointer', background: value.dark ? 'var(--accent)' : 'var(--hair-2)', transition: 'background .15s', padding: 0 }}>
              <span style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)', transform: value.dark ? 'translateX(16px)' : 'none', transition: 'transform .15s' }} />
            </button>
          </div>

          <div>
            <span style={label}>主色</span>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {ACCENTS.map(([hex, name]) => {
                const on = value.accent.toLowerCase() === hex.toLowerCase();
                return (
                  <button key={hex} onClick={() => onChange('accent', hex)} title={name} aria-label={name}
                    style={{ flex: 1, height: 30, borderRadius: 7, cursor: 'pointer', background: hex, border: on ? '2px solid var(--ink)' : '1px solid rgba(0,0,0,.12)', boxShadow: on ? '0 0 0 2px var(--paper-2) inset' : 'none' }} />
                );
              })}
            </div>
          </div>

          <div>
            <span style={label}>背景纹样</span>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, padding: 3, borderRadius: 9, background: 'var(--accent-soft)' }}>
              {MOTIFS.map(([k, lab]) => (
                <button key={k} onClick={() => onChange('motif', k)} style={btn(value.motif === k)}>{lab}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((o) => !o)} aria-label="Tweaks"
        style={{ display: 'flex', alignItems: 'center', gap: 7, height: 40, padding: '0 16px', borderRadius: 999, cursor: 'pointer', border: '1px solid var(--hair-2)', background: 'var(--paper-2)', color: 'var(--ink)', boxShadow: '0 4px 16px rgba(0,0,0,.1)', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)' }} />
        {open ? '收起' : '调'}
      </button>
    </div>
  );
}
