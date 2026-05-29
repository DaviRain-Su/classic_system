// 交互原型外壳：星图 ⇆ 经卷长轴 ⇆ 卦阵 ⇆ 立体图，含转场与 Tweaks。
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { TrigramKey } from './data';
import { StarMap } from './StarMap';
import { Reading } from './Reading';
import { MatrixBrowse, ReadingHex } from './Matrix';
import { CubeView } from './Cube';
import { Tweaks, type TweakState } from './Tweaks';

const FONT_MAP: Record<TweakState['font'], string> = {
  song: '"Noto Serif SC", serif',
  hei: '"Noto Sans SC", sans-serif',
  kai: '"Kaiti SC", "STKaiti", "KaiTi", "楷体", "Noto Serif SC", serif',
};

type Screen =
  | { mode: 'map' }
  | { mode: 'matrix' }
  | { mode: 'cube' }
  | { mode: 'reading'; id: string; from?: string }
  | { mode: 'hex'; upper: TrigramKey; lower: TrigramKey; from?: string };

const SCREEN_KEY = 'jdt-proto-screen';
const TWEAK_KEY = 'jdt-tweaks';
const hasLS = () => typeof window !== 'undefined' && !!window.localStorage;

function loadScreen(): Screen {
  if (hasLS()) {
    try {
      const s = JSON.parse(localStorage.getItem(SCREEN_KEY) || 'null');
      if (s && s.mode) return s as Screen;
    } catch { /* ignore */ }
  }
  return { mode: 'map' };
}
function loadTweaks(): TweakState {
  const d: TweakState = { font: 'song', dark: false, accent: '#3a5f5a' };
  if (hasLS()) {
    try {
      const s = JSON.parse(localStorage.getItem(TWEAK_KEY) || 'null');
      if (s) return { ...d, ...s };
    } catch { /* ignore */ }
  }
  return d;
}

// 把 1440×900 舞台缩放进视口
function Stage({ children }: { children: ReactNode }) {
  const [s, setS] = useState(1);
  useEffect(() => {
    const fit = () => setS(Math.min(window.innerWidth / 1440, window.innerHeight / 900, 1.25));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--canvas-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: 1440, height: 900, transform: `scale(${s})`, transformOrigin: 'center', position: 'relative', background: 'var(--paper)', overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,.16)' }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [tw, setTw] = useState<TweakState>(loadTweaks);
  const [screen, setScreen] = useState<Screen>(loadScreen);

  const setTweak = useCallback(<K extends keyof TweakState>(k: K, v: TweakState[K]) => {
    setTw((prev) => {
      const next = { ...prev, [k]: v };
      if (hasLS()) { try { localStorage.setItem(TWEAK_KEY, JSON.stringify(next)); } catch { /* ignore */ } }
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = tw.dark ? 'dark' : 'light';
    root.style.setProperty('--font-body', FONT_MAP[tw.font] || FONT_MAP.song);
    root.style.setProperty('--accent', tw.accent);
  }, [tw.font, tw.dark, tw.accent]);

  const go = useCallback((next: Screen) => {
    setScreen(next);
    if (hasLS()) { try { localStorage.setItem(SCREEN_KEY, JSON.stringify(next)); } catch { /* ignore */ } }
  }, []);

  const openNode = (id: string) => go({ mode: 'reading', id });
  const openMatrix = () => go({ mode: 'matrix' });
  const openCube = () => go({ mode: 'cube' });
  const openHex = (upper: TrigramKey, lower: TrigramKey, from = 'matrix') => {
    if (upper === 'qian' && lower === 'qian') go({ mode: 'reading', id: 'yi', from });
    else go({ mode: 'hex', upper, lower, from });
  };
  const back = () => {
    const from = (screen as { from?: string }).from;
    go(from === 'cube' ? { mode: 'cube' } : from === 'matrix' ? { mode: 'matrix' } : { mode: 'map' });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && (screen.mode === 'reading' || screen.mode === 'hex')) back(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const key = screen.mode === 'reading' ? 'r-' + screen.id
    : screen.mode === 'hex' ? 'h-' + screen.upper + screen.lower
    : screen.mode;

  const hexFrom = (u: TrigramKey, l: TrigramKey) => openHex(u, l, (screen as { from?: string }).from || 'matrix');

  return (
    <>
      <Stage>
        <div key={key} className="view-enter" style={{ position: 'absolute', inset: 0 }}>
          {screen.mode === 'map' && <StarMap onOpen={openNode} onMatrix={openMatrix} onCube={openCube} />}
          {screen.mode === 'matrix' && <MatrixBrowse onBack={() => go({ mode: 'map' })} onOpenHex={(u, l) => openHex(u, l, 'matrix')} onCube={openCube} />}
          {screen.mode === 'cube' && <CubeView onBack={() => go({ mode: 'map' })} onOpenHex={(u, l) => openHex(u, l, 'cube')} />}
          {screen.mode === 'reading' && <Reading id={screen.id} onBack={back} onOpen={openNode} onOpenHex={hexFrom} />}
          {screen.mode === 'hex' && <ReadingHex upper={screen.upper} lower={screen.lower} onBack={back} onOpen={openNode} onOpenHex={hexFrom} />}
        </div>
      </Stage>
      <Tweaks value={tw} onChange={setTweak} />
    </>
  );
}
