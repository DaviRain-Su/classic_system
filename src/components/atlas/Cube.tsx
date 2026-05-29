// 卦象立体图 — 64卦 = 六维超立方体；动一爻 = 一条棱。
import { useState, useMemo } from 'react';
import { TRIGRAMS } from './data';
import { HexFigure } from './primitives';
import { Mono } from './chrome';
import { hexFromLines, yaoName } from './hex';
import { TopBar, type OpenHex } from './shared';

const linesOf = (v: number) => [0, 1, 2, 3, 4, 5].map((i) => (v >> (5 - i)) & 1);
const valOf = (lines: number[]) => lines.reduce((a, l) => a * 2 + l, 0);
const popc = (v: number) => linesOf(v).reduce((a, b) => a + b, 0);
const nbByLine = (v: number, i: number) => v ^ (1 << (5 - i)); // 翻转 idx i (自上而下)

interface Pt { x: number; y: number; }

export function CubeView({ onBack, onOpenHex }: { onBack: () => void; onOpenHex: OpenHex }) {
  const [layout, setLayout] = useState<'cube' | 'ring'>('cube');
  const [sel, setSel] = useState(63); // 乾
  const [hover, setHover] = useState<number | null>(null);
  const CW = 1000, CH = 824, cx = 500, cy = 412;

  const positions = useMemo<Pt[]>(() => {
    const pos = new Array<Pt>(64);
    if (layout === 'cube') {
      const BIG = 168, SMALL = 52;
      const iso = (x: number, y: number, z: number, s: number): [number, number] => [(x - y) * 0.866 * s, (x + y) * 0.5 * s - z * s];
      for (let v = 0; v < 64; v++) {
        const u = v >> 3, l = v & 7;
        const [bx, by] = iso((u >> 2) & 1, (u >> 1) & 1, u & 1, BIG);
        const [sx, sy] = iso((l >> 2) & 1, (l >> 1) & 1, l & 1, SMALL);
        pos[v] = { x: cx + bx + sx, y: cy + by + sy - 6 };
      }
    } else {
      const maxR = 352;
      const groups: Record<number, number[]> = {};
      for (let v = 0; v < 64; v++) { const c = popc(v); (groups[c] = groups[c] || []).push(v); }
      Object.keys(groups).forEach((ck) => {
        const c = Number(ck);
        const arr = groups[c].sort((a, b) => a - b);
        const r = (c / 6) * maxR;
        const twist = c * 0.16 - Math.PI / 2;
        arr.forEach((v, j) => {
          const ang = arr.length === 1 ? twist : twist + (j / arr.length) * Math.PI * 2;
          pos[v] = { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r };
        });
      });
    }
    return pos;
  }, [layout]);

  const edges = useMemo<[number, number][]>(() => {
    const e: [number, number][] = [];
    for (let v = 0; v < 64; v++) for (let b = 0; b < 6; b++) { const w = v ^ (1 << b); if (v < w) e.push([v, w]); }
    return e;
  }, []);

  const selLines = linesOf(sel);
  const selInfo = hexFromLines(selLines);
  const nbs = [0, 1, 2, 3, 4, 5].map((i) => nbByLine(sel, i));
  const nbSet = new Set(nbs);
  const cuoV = sel ^ 63;
  const zongV = valOf(selLines.slice().reverse());
  const huV = valOf([selLines[1], selLines[2], selLines[3], selLines[2], selLines[3], selLines[4]]);

  const nodeStyle = (v: number) => {
    if (v === sel) return { r: 7.5, fill: 'var(--accent)', stroke: 'var(--accent)' };
    if (nbSet.has(v)) return { r: 5, fill: 'var(--paper)', stroke: 'var(--accent)' };
    if (v === cuoV) return { r: 5, fill: 'var(--seal)', stroke: 'var(--seal)' };
    if (v === zongV) return { r: 5, fill: 'var(--paper)', stroke: 'var(--ink-2)' };
    return { r: 3, fill: 'var(--ink-3)', stroke: 'var(--ink-3)' };
  };

  const FamilyItem = ({ label, hint, v }: { label: string; hint: string; v: number }) => {
    const info = hexFromLines(linesOf(v));
    return (
      <button onClick={() => setSel(v)} style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid var(--hair-2)', borderRadius: 8, padding: '9px 11px', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
        <HexFigure lines={info.lines} w={26} h={2.5} vgap={2.5} />
        <div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 11.5, fontWeight: 700, color: 'var(--accent)' }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--ink-3)' }}>{hint}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{info.name}</div>
        </div>
      </button>
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="卦象立体图" sub="六维超立方体" onBack={onBack} />

      {/* diagram */}
      <div style={{ position: 'absolute', top: 74, left: 0, width: 1000, bottom: 0 }}>
        <div style={{ position: 'absolute', top: 22, left: 40, zIndex: 3, display: 'flex', gap: 6, padding: 3, borderRadius: 999, border: '1px solid var(--hair-2)', background: 'var(--paper-2)' }}>
          {([['cube', '立方套立方'], ['ring', '同心环']] as ['cube' | 'ring', string][]).map(([k, lab]) => (
            <button key={k} onClick={() => setLayout(k)} style={{ border: 'none', borderRadius: 999, padding: '6px 16px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5, background: layout === k ? 'var(--accent)' : 'transparent', color: layout === k ? '#fff' : 'var(--ink-2)' }}>{lab}</button>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 22, left: 40, zIndex: 3 }}>
          <Mono dim>动一爻 = 一条棱 · 共 192 棱 · 点节点切换</Mono>
        </div>

        <svg width="100%" height="100%" viewBox={`0 0 ${CW} ${CH}`} style={{ position: 'absolute', inset: 0 }}>
          {edges.map(([v, w], i) => {
            const hot = (v === sel && nbSet.has(w)) || (w === sel && nbSet.has(v));
            const a = positions[v], b = positions[w];
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hot ? 'var(--accent)' : 'var(--hair-2)'} strokeWidth={hot ? 1.8 : 0.8} opacity={hot ? 0.95 : sel != null ? 0.12 : 0.22} style={{ transition: 'opacity .25s, stroke-width .2s' }} />;
          })}
          {/* 错卦 link across */}
          <line x1={positions[sel].x} y1={positions[sel].y} x2={positions[cuoV].x} y2={positions[cuoV].y} stroke="var(--seal)" strokeWidth="1" strokeDasharray="3 6" opacity="0.6" />
          {Array.from({ length: 64 }).map((_, v) => {
            const st = nodeStyle(v);
            const p = positions[v];
            const big = hover === v;
            return (
              <g key={v} style={{ cursor: 'pointer', transition: 'transform .3s cubic-bezier(.3,.7,.3,1)' }} transform={`translate(${p.x} ${p.y})`}
                onClick={() => setSel(v)} onMouseEnter={() => setHover(v)} onMouseLeave={() => setHover(null)}>
                <circle r={14} fill="transparent" />
                <circle r={big ? st.r + 2 : st.r} fill={st.fill} stroke={st.stroke} strokeWidth={st.fill === 'var(--paper)' ? 1.6 : 0} style={{ transition: 'r .2s' }} />
                {(v === sel || big) && (
                  <text x={0} y={-st.r - 7} textAnchor="middle" style={{ fontFamily: 'var(--font-serif)', fontSize: 12, fontWeight: 600, fill: 'var(--ink)' }}>{hexFromLines(linesOf(v)).name}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* side panel */}
      <div style={{ position: 'absolute', top: 74, right: 0, width: 440, bottom: 0, borderLeft: '1px solid var(--hair)', padding: '36px 40px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Mono>64 卦 = 2⁶ · 六维超立方体</Mono>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--ink-2)', margin: '10px 0 0' }}>每卦六爻即六个二进制位，恰是超立方体的一个顶点；动一爻就是走过一条棱。每卦有且仅有 <b style={{ color: 'var(--ink)' }}>6 个</b> 单爻邻居。</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 24, paddingTop: 22, borderTop: '1px solid var(--hair)' }}>
          <HexFigure lines={selLines} w={62} h={6} vgap={6} color="var(--accent)" />
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 24 }}>{selInfo.name}</div>
            <Mono dim style={{ marginTop: 4 }}>第 {selInfo.num} 卦 · {TRIGRAMS[selInfo.upper].name}上{TRIGRAMS[selInfo.lower].name}下</Mono>
            <button onClick={() => onOpenHex(selInfo.upper, selInfo.lower)} style={{ marginTop: 10, border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)', borderRadius: 999, padding: '5px 13px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5 }}>读此卦 ›</button>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <Mono dim>六邻 · 单爻之变（棱）</Mono>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 7, marginTop: 10 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const w = nbByLine(sel, i);
              const info = hexFromLines(linesOf(w));
              return (
                <button key={i} onClick={() => setSel(w)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--hair-2)', borderRadius: 7, padding: '6px 10px', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', width: 26 }}>{yaoName(i, selLines[i] === 1)}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 12.5, whiteSpace: 'nowrap' }}>{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <Mono dim>卦族 · 错 / 综 / 互</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            <FamilyItem label="错卦" hint="对角顶点" v={cuoV} />
            <FamilyItem label="综卦" hint="上下颠倒" v={zongV} />
            <FamilyItem label="互卦" hint="中四爻" v={huV} />
          </div>
        </div>
      </div>
    </div>
  );
}
