// 交互原型外壳：星图 ⇆ 阅读 ⇆ 卦阵 ⇆ 立体图 ⇆ 方圆图 ⇆ 起卦 ⇆ 西方对照，含转场、背景、引导、进度。
import { Component, Suspense, lazy, useState, useEffect, useCallback, type ErrorInfo, type ReactNode } from 'react';
import { SCHOOL_INFO, WORK_BY_ID, HEX_FULL, HEX_FULL_BY_PAIR, TRIGRAMS, WEST_MAP, type TrigramKey, type LinkSpec } from './data';
import { hexInfo } from './hex';
import { markRead } from './progress';
import { StarMap } from './StarMap';
import { SchoolView, TrigramView, Onboard } from './detail';
import { Tweaks, type TweakState } from './Tweaks';
import { useAmbient } from './ambient';

const Reading = lazy(() => import('./Reading').then((m) => ({ default: m.Reading })));
const MatrixBrowse = lazy(() => import('./Matrix').then((m) => ({ default: m.MatrixBrowse })));
const ReadingHex = lazy(() => import('./Matrix').then((m) => ({ default: m.ReadingHex })));
const CubeView = lazy(() => import('./Cube').then((m) => ({ default: m.CubeView })));
const CircleSquare = lazy(() => import('./CircleSquare').then((m) => ({ default: m.CircleSquare })));
const CastView = lazy(() => import('./cast').then((m) => ({ default: m.CastView })));
const WestHome = lazy(() => import('./West').then((m) => ({ default: m.WestHome })));
const WestDetail = lazy(() => import('./West').then((m) => ({ default: m.WestDetail })));
const SearchView = lazy(() => import('./Search').then((m) => ({ default: m.SearchView })));
const RelationsView = lazy(() => import('./Relations').then((m) => ({ default: m.RelationsView })));
const MobileApp = lazy(() => import('./Mobile').then((m) => ({ default: m.MobileApp })));

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

const STORAGE_VERSION = 1;
const SCREEN_KEY = 'jdt-proto-screen';
const TWEAK_KEY = 'jdt-tweaks';
const ONBOARD_KEY = 'jdt-onboarded';
const DEFAULT_SCREEN: Screen = { mode: 'map' };
const DEFAULT_TWEAKS: TweakState = { font: 'song', dark: false, accent: '#3a5f5a', motif: 'bagua', sound: 'off' };
const hasWindow = () => typeof window !== 'undefined';
const hasLS = () => typeof window !== 'undefined' && !!window.localStorage;

function isTrigramKey(value: string): value is TrigramKey {
  return Object.prototype.hasOwnProperty.call(TRIGRAMS, value);
}

function screenForHexNum(num: number, from?: string): Screen | null {
  if (!HEX_FULL[num]) return null;
  const id = num === 1 ? 'yi' : num === 2 ? 'kun' : String(num);
  return from ? { mode: 'reading', id, from } : { mode: 'reading', id };
}

function persistableScreen(screen: Screen): Screen {
  const copy: Screen = { ...screen };
  delete copy.ret;
  return copy;
}

function normalizeScreen(screen: Screen | null): Screen {
  if (!screen || !screen.mode) return DEFAULT_SCREEN;
  if (screen.mode === 'hex') {
    const full = HEX_FULL_BY_PAIR[screen.upper + '_' + screen.lower];
    return full ? (screenForHexNum(full.num, screen.from) || DEFAULT_SCREEN) : screen;
  }
  if (screen.mode === 'reading') {
    if (screen.id === 'yi' || screen.id === 'kun') return screen;
    const num = Number(screen.id);
    if (Number.isFinite(num) && HEX_FULL[num]) return screenForHexNum(num, screen.from) || DEFAULT_SCREEN;
    return screen.id ? screen : DEFAULT_SCREEN;
  }
  if (screen.mode === 'westItem') {
    return WEST_MAP[screen.idx] ? screen : { mode: 'west' };
  }
  if (screen.mode === 'trigram') {
    return isTrigramKey(screen.tkey) ? screen : DEFAULT_SCREEN;
  }
  return screen;
}

function saveScreen(screen: Screen) {
  if (!hasLS()) return;
  try {
    localStorage.setItem(SCREEN_KEY, JSON.stringify({ version: STORAGE_VERSION, screen: persistableScreen(screen) }));
  } catch { /* ignore */ }
}

function loadStoredScreen(): Screen {
  if (hasLS()) {
    try {
      const raw = JSON.parse(localStorage.getItem(SCREEN_KEY) || 'null');
      const s = raw && raw.version === STORAGE_VERSION && raw.screen ? raw.screen : raw;
      if (s && s.mode) return normalizeScreen(s as Screen);
    } catch { /* ignore */ }
  }
  return DEFAULT_SCREEN;
}

function normalizeTweaks(value: Partial<TweakState> | null): TweakState {
  const font = value && ['song', 'hei', 'kai'].includes(String(value.font)) ? value.font as TweakState['font'] : DEFAULT_TWEAKS.font;
  const motif = value && ['bagua', 'ink', 'none'].includes(String(value.motif)) ? value.motif as TweakState['motif'] : DEFAULT_TWEAKS.motif;
  const sound = value && ['off', 'guqin'].includes(String(value.sound)) ? value.sound as TweakState['sound'] : DEFAULT_TWEAKS.sound;
  return {
    font,
    dark: !!value?.dark,
    accent: typeof value?.accent === 'string' && value.accent ? value.accent : DEFAULT_TWEAKS.accent,
    motif,
    sound,
  };
}

function saveTweaks(tweaks: TweakState) {
  if (!hasLS()) return;
  try {
    localStorage.setItem(TWEAK_KEY, JSON.stringify({ version: STORAGE_VERSION, tweaks }));
  } catch { /* ignore */ }
}

function loadTweaks(): TweakState {
  if (hasLS()) {
    try {
      const raw = JSON.parse(localStorage.getItem(TWEAK_KEY) || 'null');
      const s = raw && raw.version === STORAGE_VERSION && raw.tweaks ? raw.tweaks : raw;
      if (s) return normalizeTweaks(s);
    } catch { /* ignore */ }
  }
  return DEFAULT_TWEAKS;
}

const enc = (value: string) => encodeURIComponent(value);
const dec = (value: string) => {
  try { return decodeURIComponent(value); } catch { return value; }
};

function screenToHash(screen: Screen): string {
  const s = normalizeScreen(screen);
  if (s.mode === 'map') return '#/';
  if (s.mode === 'matrix') return '#/matrix';
  if (s.mode === 'cube') return '#/cube';
  if (s.mode === 'square') return '#/square';
  if (s.mode === 'cast') return '#/cast';
  if (s.mode === 'west') return '#/west';
  if (s.mode === 'search') return '#/search';
  if (s.mode === 'relations') return '#/relations';
  if (s.mode === 'westItem') return '#/west/' + s.idx;
  if (s.mode === 'school') return '#/school/' + enc(s.id);
  if (s.mode === 'trigram') return '#/trigram/' + s.tkey;
  if (s.mode === 'hex') return '#/hex-pair/' + s.upper + '/' + s.lower;
  if (s.mode === 'reading') {
    const num = s.id === 'yi' ? 1 : s.id === 'kun' ? 2 : Number(s.id);
    if (Number.isInteger(num) && HEX_FULL[num]) return '#/hex/' + num;
    return '#/reading/' + enc(s.id);
  }
  return '#/';
}

function screenFromHash(): Screen | null {
  if (!hasWindow()) return null;
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw) return window.location.hash ? DEFAULT_SCREEN : null;
  const parts = raw.split('/').filter(Boolean).map(dec);
  const [kind, a, b] = parts;
  if (kind === 'matrix') return { mode: 'matrix' };
  if (kind === 'cube') return { mode: 'cube' };
  if (kind === 'square') return { mode: 'square' };
  if (kind === 'cast') return { mode: 'cast' };
  if (kind === 'west') return a == null ? { mode: 'west' } : normalizeScreen({ mode: 'westItem', idx: Number(a) });
  if (kind === 'search') return { mode: 'search' };
  if (kind === 'relations') return { mode: 'relations' };
  if (kind === 'reading' && a) return { mode: 'reading', id: a };
  if (kind === 'school' && a) return { mode: 'school', id: a };
  if (kind === 'trigram' && a && isTrigramKey(a)) return { mode: 'trigram', tkey: a };
  if (kind === 'hex' && a) return screenForHexNum(Number(a));
  if (kind === 'hex-pair' && a && b && isTrigramKey(a) && isTrigramKey(b)) {
    return normalizeScreen({ mode: 'hex', upper: a, lower: b });
  }
  return DEFAULT_SCREEN;
}

function writeHash(screen: Screen, replace = false) {
  if (!hasWindow()) return;
  const hash = screenToHash(screen);
  if (window.location.hash === hash) return;
  const url = new URL(window.location.href);
  url.hash = hash;
  if (replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
}

function loadInitialScreen(): Screen {
  return normalizeScreen(screenFromHash() || loadStoredScreen());
}

class AtlasErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Atlas render failed', error, info);
  }

  reset = () => {
    if (hasLS()) {
      try { localStorage.removeItem(SCREEN_KEY); } catch { /* ignore */ }
    }
    if (hasWindow()) {
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--canvas-bg)', color: 'var(--ink)', fontFamily: 'var(--font-body)', padding: 24 }}>
        <div style={{ width: 520, maxWidth: '100%', border: '1px solid var(--hair-2)', borderRadius: 12, background: 'var(--paper)', padding: 28, boxShadow: '0 20px 70px rgba(0,0,0,.16)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700 }}>页面暂时无法显示</div>
          <p style={{ color: 'var(--ink-2)', lineHeight: 1.8, margin: '12px 0 0' }}>当前视图渲染失败。可以先回到星图，避免整座应用白屏。</p>
          <button onClick={this.reset} style={{ marginTop: 20, border: 'none', background: 'var(--accent)', color: '#fff', borderRadius: 999, padding: '10px 22px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 15 }}>回到星图</button>
        </div>
      </div>
    );
  }
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

// 全屏自适应舞台 — 内容随视口铺满（星图用百分比定位，其余视图 inset:0 弹性布局），不再是缩放卡片。
function Stage({ children, motif, glyph }: { children: ReactNode; motif: string; glyph: string }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--paper)', overflow: 'hidden' }}>
      <Backdrop motif={motif} glyph={glyph} />
      {children}
    </div>
  );
}

function RouteFallback() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-3)' }}>
      载入中...
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
  const [screen, setScreen] = useState<Screen>(loadInitialScreen);
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
      saveTweaks(next);
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
    const normalized = normalizeScreen(next);
    setScreen(normalized);
    saveScreen(normalized);
    writeHash(normalized);
  }, []);

  const openNode = useCallback((id: string) => {
    if (id === 'west') return go({ mode: 'west' });
    if (SCHOOL_INFO[id]) return go({ mode: 'school', id });
    go({ mode: 'reading', id });
  }, [go]);
  const openMatrix = useCallback(() => go({ mode: 'matrix' }), [go]);
  const openCube = useCallback(() => go({ mode: 'cube' }), [go]);
  const openCast = useCallback(() => go({ mode: 'cast' }), [go]);
  const openSquare = useCallback(() => go({ mode: 'square' }), [go]);
  const openSearch = useCallback(() => go({ mode: 'search' }), [go]);
  const openRelations = useCallback(() => go({ mode: 'relations' }), [go]);
  const openHex = useCallback((upper: TrigramKey, lower: TrigramKey, from = 'matrix') => {
    if (upper === 'qian' && lower === 'qian') return go({ mode: 'reading', id: 'yi', from });
    if (upper === 'kun' && lower === 'kun') return go({ mode: 'reading', id: 'kun', from });
    const full = HEX_FULL_BY_PAIR[upper + '_' + lower];
    if (full) return go({ mode: 'reading', id: String(full.num), from });
    go({ mode: 'hex', upper, lower, from });
  }, [go]);
  const setScreenWithRet = useCallback((next: Screen) => go({ ...next, ret: screen }), [go, screen]);
  const openTrigram = useCallback((tkey: TrigramKey) => setScreenWithRet({ mode: 'trigram', tkey }), [setScreenWithRet]);
  const openSchool = useCallback((id: string) => setScreenWithRet({ mode: 'school', id }), [setScreenWithRet]);
  const back = useCallback(() => {
    if (screen.ret) return go(screen.ret);
    if (screen.from === 'cube') return go({ mode: 'cube' });
    if (screen.from === 'matrix') return go({ mode: 'matrix' });
    return go({ mode: 'map' });
  }, [go, screen]);

  useEffect(() => {
    saveScreen(screen);
    if (hasWindow() && !window.location.hash) writeHash(screen, true);
  }, [screen]);

  useEffect(() => {
    const syncFromHash = () => {
      const next = screenFromHash();
      if (!next) return;
      const normalized = normalizeScreen(next);
      setScreen(normalized);
      saveScreen(normalized);
    };
    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('popstate', syncFromHash);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, []);

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
  }, [back, screen.mode]);

  const key = screen.mode === 'reading' ? 'r-' + screen.id
    : screen.mode === 'hex' ? 'h-' + screen.upper + screen.lower
    : screen.mode === 'trigram' ? 't-' + screen.tkey
    : screen.mode === 'school' ? 's-' + screen.id
    : screen.mode === 'westItem' ? 'wi-' + screen.idx
    : screen.mode;

  const hexFrom = useCallback((u: TrigramKey, l: TrigramKey) => openHex(u, l, screen.from || 'matrix'), [openHex, screen.from]);

  const routeJump = useCallback((j: LinkSpec) => {
    if (j.kind === 'west') go({ mode: 'west' });
    else if (j.kind === 'hex' && j.upper && j.lower) openHex(j.upper, j.lower, 'west');
    else if (j.kind === 'cube') go({ mode: 'cube' });
    else if (j.kind === 'square') go({ mode: 'square' });
    else if (j.kind === 'matrix') go({ mode: 'matrix' });
    else if (j.id) openNode(j.id);
  }, [go, openHex, openNode]);

  if (isMobile) {
    return (
      <>
        <Suspense fallback={<RouteFallback />}>
          <MobileApp />
        </Suspense>
        <Tweaks value={tw} onChange={setTweak} />
      </>
    );
  }

  return (
    <AtlasErrorBoundary>
      <Stage motif={tw.motif} glyph={motifGlyphFor(screen)}>
        <div key={key} className="view-enter" style={{ position: 'absolute', inset: 0 }}>
          <Suspense fallback={<RouteFallback />}>
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
          </Suspense>
        </div>
      </Stage>
      {onboard && <Onboard onClose={closeOnboard} />}
      <Tweaks value={tw} onChange={setTweak} />
    </AtlasErrorBoundary>
  );
}
