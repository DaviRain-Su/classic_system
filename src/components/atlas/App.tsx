// 交互原型外壳：星图 ⇆ 阅读 ⇆ 卦阵 ⇆ 立体图 ⇆ 方圆图 ⇆ 起卦 ⇆ 西方对照，含转场、背景、引导、进度。
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { SCHOOL_INFO, WORK_BY_ID, HEX_FULL_BY_PAIR, type TrigramKey, type LinkSpec } from './data';
import { hexInfo } from './hex';
import { markRead } from './progress';
import { StarMap } from './StarMap';
import { Reading } from './Reading';
import { MatrixBrowse, ReadingHex } from './Matrix';
import { CubeView } from './Cube';
import { CircleSquare } from './CircleSquare';
import { CastView } from './cast';
import { WestHome, WestDetail } from './West';
import { SearchView } from './Search';
import { RelationsView } from './Relations';
import { SchoolView, TrigramView, Onboard } from './detail';
import { Tweaks, type TweakState } from './Tweaks';
import { useAmbient } from './ambient';
import { MobileApp } from './Mobile';

const FONT_MAP: Record<TweakState['font'], string> = {
  song: '"Noto Serif SC", serif',
  hei: '"Noto Sans SC", sans-serif',
  kai: '"Kaiti SC", "STKaiti", "KaiTi", "楷体", "Noto Serif SC", serif',
};

type ScreenBase = { from?: string; ret?: Screen };
type Screen = ScreenBase & (
  | { mode: 'map' | 'matrix' | 'cube' | 'square' | 'cast' | 'west' | 'search' | 'relations' }
  | { mode: 'westItem'; idx: number }
  | { mode: 'reading'; id: string }
  | { mode: 'hex'; upper: TrigramKey; lower: TrigramKey }
  | { mode: 'trigram'; tkey: TrigramKey }
  | { mode: 'school'; id: string }
);

const SCREEN_KEY = 'jdt-proto-screen';
const TWEAK_KEY = 'jdt-tweaks';
const ONBOARD_KEY = 'jdt-onboarded';
const hasLS = () => typeof window !== 'undefined' && !!window.localStorage;

function loadScreen(): Screen {
  if (hasLS()) {
    try { const s = JSON.parse(localStorage.getItem(SCREEN_KEY) || 'null'); if (s && s.mode) return s as Screen; } catch { /* ignore */ }
  }
  return { mode: 'map' };
}
function loadTweaks(): TweakState {
  const d: TweakState = { font: 'song', dark: false, accent: '#3a5f5a', motif: 'bagua', sound: 'off' };
  if (hasLS()) {
    try { const s = JSON.parse(localStorage.getItem(TWEAK_KEY) || 'null'); if (s) return { ...d, ...s }; } catch { /* ignore */ }
  }
  return d;
}

// 当前视图对应的主题字 (道/儒/佛/易/西)
function motifGlyphFor(screen: Screen): string {
  if (screen.mode === 'west') return '西';
  if (screen.mode === 'school' && SCHOOL_INFO[screen.id]) return SCHOOL_INFO[screen.id].glyph;
  if (screen.mode === 'reading' && screen.id) {
    const w = WORK_BY_ID[screen.id];
    if (w && SCHOOL_INFO[w.school]) return SCHOOL_INFO[w.school].glyph;
  }
  return '易';
}

const BAGUA = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

// 极淡东方纹样背景
function Backdrop({ motif, glyph }: { motif: string; glyph: string }) {
  if (motif === 'none') return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <div style={{ position: 'absolute', right: -60, bottom: -120, fontFamily: 'var(--font-display)', fontSize: 560, lineHeight: 0.8, color: 'var(--ink)', opacity: 0.04, userSelect: 'none' }}>{glyph}</div>
      {motif === 'bagua' && (
        <svg width="520" height="520" viewBox="0 0 520 520" style={{ position: 'absolute', left: -150, top: -150, opacity: 0.05 }}>
          <circle cx="260" cy="260" r="210" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="260" cy="260" r="150" fill="none" stroke="var(--ink)" strokeWidth="1" />
          {BAGUA.map((g, i) => {
            const a = (i * 45 - 90) * Math.PI / 180;
            return <text key={i} x={260 + Math.cos(a) * 180} y={260 + Math.sin(a) * 180 + 12} textAnchor="middle" style={{ fontSize: 34, fill: 'var(--ink)' }}>{g}</text>;
          })}
        </svg>
      )}
    </div>
  );
}

function Stage({ children, motif, glyph }: { children: ReactNode; motif: string; glyph: string }) {
  const [s, setS] = useState(1);
  useEffect(() => {
    const fit = () => setS(Math.min(window.innerWidth / 1440, window.innerHeight / 900, 1.25));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(circle at 50% 38%, color-mix(in srgb, var(--canvas-bg) 92%, #fff), var(--canvas-bg) 72%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: 1440, height: 900, transform: `scale(${s})`, transformOrigin: 'center', position: 'relative', background: 'var(--paper)', overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,.16)' }}>
        <Backdrop motif={motif} glyph={glyph} />
        {children}
      </div>
    </div>
  );
}

// 窄视口（手机）检测：SSR 默认 false，hydrate 后由 resize 监听决定
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return m;
}

export default function App() {
  const [tw, setTw] = useState<TweakState>(loadTweaks);
  const isMobile = useIsMobile();
  const [screen, setScreen] = useState<Screen>(loadScreen);
  const [onboard, setOnboard] = useState(() => {
    if (hasLS()) { try { return localStorage.getItem(ONBOARD_KEY) !== '1'; } catch { return true; } }
    return false; // SSR: 默认不弹，hydrate 后由 effect 决定
  });

  // hydrate 后再决定是否首次引导（避免 SSR 闪烁）
  useEffect(() => {
    if (hasLS()) { try { setOnboard(localStorage.getItem(ONBOARD_KEY) !== '1'); } catch { /* ignore */ } }
  }, []);

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

  useAmbient(tw.sound === 'guqin');

  const go = useCallback((next: Screen) => {
    setScreen(next);
    if (hasLS()) { try { localStorage.setItem(SCREEN_KEY, JSON.stringify(next)); } catch { /* ignore */ } }
  }, []);

  const openNode = (id: string) => {
    if (id === 'west') return go({ mode: 'west' });
    if (SCHOOL_INFO[id]) return go({ mode: 'school', id });
    go({ mode: 'reading', id });
  };
  const openMatrix = () => go({ mode: 'matrix' });
  const openCube = () => go({ mode: 'cube' });
  const openCast = () => go({ mode: 'cast' });
  const openSquare = () => go({ mode: 'square' });
  const openSearch = () => go({ mode: 'search' });
  const openRelations = () => go({ mode: 'relations' });
  const openHex = (upper: TrigramKey, lower: TrigramKey, from = 'matrix') => {
    if (upper === 'qian' && lower === 'qian') return go({ mode: 'reading', id: 'yi', from });
    if (upper === 'kun' && lower === 'kun') return go({ mode: 'reading', id: 'kun', from });
    const full = HEX_FULL_BY_PAIR[upper + '_' + lower];
    if (full) return go({ mode: 'reading', id: String(full.num), from });
    go({ mode: 'hex', upper, lower, from });
  };
  const setScreenWithRet = (next: Screen) => go({ ...next, ret: screen });
  const openTrigram = (tkey: TrigramKey) => setScreenWithRet({ mode: 'trigram', tkey });
  const openSchool = (id: string) => setScreenWithRet({ mode: 'school', id });
  const back = () => {
    if (screen.ret) return go(screen.ret);
    if (screen.from === 'cube') return go({ mode: 'cube' });
    if (screen.from === 'matrix') return go({ mode: 'matrix' });
    return go({ mode: 'map' });
  };

  useEffect(() => {
    if (screen.mode === 'reading' && screen.id) markRead(screen.id);
    else if (screen.mode === 'hex') markRead('gua:' + hexInfo(screen.upper, screen.lower).num);
  }, [screen]);

  const closeOnboard = (dontShow: boolean) => {
    setOnboard(false);
    if (dontShow && hasLS()) { try { localStorage.setItem(ONBOARD_KEY, '1'); } catch { /* ignore */ } }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && (screen.mode === 'reading' || screen.mode === 'hex')) back(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const key = screen.mode === 'reading' ? 'r-' + screen.id
    : screen.mode === 'hex' ? 'h-' + screen.upper + screen.lower
    : screen.mode === 'trigram' ? 't-' + screen.tkey
    : screen.mode === 'school' ? 's-' + screen.id
    : screen.mode === 'westItem' ? 'wi-' + screen.idx
    : screen.mode;

  const hexFrom = (u: TrigramKey, l: TrigramKey) => openHex(u, l, screen.from || 'matrix');

  const routeJump = (j: LinkSpec) => {
    if (j.kind === 'west') go({ mode: 'west' });
    else if (j.kind === 'hex' && j.upper && j.lower) openHex(j.upper, j.lower, 'west');
    else if (j.kind === 'cube') go({ mode: 'cube' });
    else if (j.kind === 'square') go({ mode: 'square' });
    else if (j.kind === 'matrix') go({ mode: 'matrix' });
    else if (j.id) openNode(j.id);
  };

  if (isMobile) {
    return (
      <>
        <MobileApp />
        <Tweaks value={tw} onChange={setTweak} />
      </>
    );
  }

  return (
    <>
      <Stage motif={tw.motif} glyph={motifGlyphFor(screen)}>
        <div key={key} className="view-enter" style={{ position: 'absolute', inset: 0 }}>
          {screen.mode === 'map' && <StarMap onOpen={openNode} onMatrix={openMatrix} onCube={openCube} onCast={openCast} onXici={() => openNode('xici')} onSearch={openSearch} onRelations={openRelations} />}
          {screen.mode === 'search' && <SearchView onBack={() => go({ mode: 'map' })} onOpen={openNode} />}
          {screen.mode === 'relations' && <RelationsView onBack={() => go({ mode: 'map' })} onJump={routeJump} />}
          {screen.mode === 'matrix' && <MatrixBrowse onBack={() => go({ mode: 'map' })} onOpenHex={(u, l) => openHex(u, l, 'matrix')} onCube={openCube} onSquare={openSquare} />}
          {screen.mode === 'cube' && <CubeView onBack={() => go({ mode: 'map' })} onOpenHex={(u, l) => openHex(u, l, 'cube')} />}
          {screen.mode === 'square' && <CircleSquare onBack={() => go({ mode: 'map' })} onOpenHex={(u, l) => openHex(u, l, 'square')} />}
          {screen.mode === 'cast' && <CastView onBack={() => go({ mode: 'map' })} onOpenHex={(u, l) => openHex(u, l, 'cast')} />}
          {screen.mode === 'west' && <WestHome onBack={() => go({ mode: 'map' })} onOpenItem={(idx) => go({ mode: 'westItem', idx })} />}
          {screen.mode === 'westItem' && <WestDetail index={screen.idx} onBack={() => go({ mode: 'west' })} onOpenItem={(idx) => go({ mode: 'westItem', idx })} onJump={routeJump} />}
          {screen.mode === 'reading' && <Reading id={screen.id} onBack={back} onOpen={openNode} onOpenHex={hexFrom} onOpenTrigram={openTrigram} onOpenSchool={openSchool} onOpenCube={openCube} />}
          {screen.mode === 'hex' && <ReadingHex upper={screen.upper} lower={screen.lower} onBack={back} onOpen={openNode} onOpenHex={hexFrom} onOpenTrigram={openTrigram} />}
          {screen.mode === 'trigram' && <TrigramView tkey={screen.tkey} onBack={back} onOpenHex={(u, l) => openHex(u, l, 'matrix')} />}
          {screen.mode === 'school' && <SchoolView id={screen.id} onBack={back} onOpen={openNode} />}
        </div>
      </Stage>
      {onboard && <Onboard onClose={closeOnboard} />}
      <Tweaks value={tw} onChange={setTweak} />
    </>
  );
}
