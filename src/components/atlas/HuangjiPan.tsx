// 皇极经世 · 元会运世盘 — 十二消息卦环 + 中心阳长阴消渐变大卦 + 元会运世数表。
// lines 自上而下（index 0 = 上爻），1=阳 0=阴。
import { useState, useEffect } from 'react';
import { Lines, MorphYao } from './primitives';
import { Mono } from './chrome';
import { TopBar, type OpenHex } from './shared';
import type { TrigramKey } from './data';

interface Xiao { name: string; lines: number[]; yang: number; month: string; sym: string; }
const XIAOXI: Record<string, Xiao> = {
  fu: { name: '复', lines: [0, 0, 0, 0, 0, 1], yang: 1, month: '十一月·子', sym: '䷗' },
  lin: { name: '临', lines: [0, 0, 0, 0, 1, 1], yang: 2, month: '十二月·丑', sym: '䷒' },
  tai: { name: '泰', lines: [0, 0, 0, 1, 1, 1], yang: 3, month: '正月·寅', sym: '䷊' },
  dzh: { name: '大壮', lines: [0, 0, 1, 1, 1, 1], yang: 4, month: '二月·卯', sym: '䷡' },
  guai: { name: '夬', lines: [0, 1, 1, 1, 1, 1], yang: 5, month: '三月·辰', sym: '䷪' },
  qian: { name: '乾', lines: [1, 1, 1, 1, 1, 1], yang: 6, month: '四月·巳', sym: '䷀' },
  gou: { name: '姤', lines: [1, 1, 1, 1, 1, 0], yang: 5, month: '五月·午', sym: '䷫' },
  dun: { name: '遁', lines: [1, 1, 1, 1, 0, 0], yang: 4, month: '六月·未', sym: '䷠' },
  pi: { name: '否', lines: [1, 1, 1, 0, 0, 0], yang: 3, month: '七月·申', sym: '䷋' },
  guan: { name: '观', lines: [1, 1, 0, 0, 0, 0], yang: 2, month: '八月·酉', sym: '䷓' },
  bo: { name: '剥', lines: [1, 0, 0, 0, 0, 0], yang: 1, month: '九月·戌', sym: '䷖' },
  kun: { name: '坤', lines: [0, 0, 0, 0, 0, 0], yang: 0, month: '十月·亥', sym: '䷁' },
};
const RING = ['qian', 'gou', 'dun', 'pi', 'guan', 'bo', 'kun', 'fu', 'lin', 'tai', 'dzh', 'guai'];
const SEQ = ['fu', 'lin', 'tai', 'dzh', 'guai', 'qian', 'gou', 'dun', 'pi', 'guan', 'bo', 'kun'];

export function HuangjiPan({ onBack, onOpenHex, onOpenCube }: { onBack: () => void; onOpenHex: OpenHex; onOpenCube: () => void }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const curKey = SEQ[step];
  const cur = XIAOXI[curKey];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 12), 1100);
    return () => clearInterval(t);
  }, [playing]);

  const cx = 285, cy = 270, R = 200;
  const ringPt = (i: number) => { const a = (-90 + i * 30) * Math.PI / 180; return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R }; };

  const units: [string, string, string][] = [
    ['元', '12 会', '129600 年'],
    ['会', '30 运', '10800 年'],
    ['运', '12 世', '360 年'],
    ['世', '30 年', '30 年'],
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="皇极经世 · 元会运世盘" sub="邵雍 · 十二消息卦" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 600, flex: '0 0 auto', borderRight: '1px solid var(--hair)', position: 'relative' }}>
          {RING.map((k, i) => {
            const p = ringPt(i); const g = XIAOXI[k]; const on = k === curKey;
            const si = SEQ.indexOf(k);
            return (
              <div key={k} onClick={() => setStep(si)} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <div style={{ padding: 4, borderRadius: 6, background: on ? 'var(--accent-soft)' : 'transparent', boxShadow: on ? 'inset 0 0 0 1.4px var(--accent)' : 'none' }}>
                  <Lines lines={g.lines} w={30} h={3} vgap={2.5} color={on ? 'var(--accent)' : g.yang >= 4 ? 'var(--ink)' : 'var(--ink-2)'} />
                </div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 12, fontWeight: on ? 700 : 500, color: on ? 'var(--accent)' : 'var(--ink-2)' }}>{g.name}</span>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            {cur.lines.map((l, i) => <MorphYao key={i} broken={l === 0} w={84} h={9} gap={16} color="var(--accent)" />)}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--ink)', marginTop: 8, lineHeight: 1 }}>{cur.name}</div>
            <Mono dim>{cur.month} · {cur.yang}阳</Mono>
          </div>
          <div style={{ position: 'absolute', bottom: 26, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => { setPlaying(false); setStep((s) => (s + 11) % 12); }} style={{ border: '1px solid var(--hair-2)', background: 'transparent', borderRadius: 999, width: 36, height: 36, cursor: 'pointer', color: 'var(--ink-2)', fontSize: 15 }}>‹</button>
            <button onClick={() => setPlaying((p) => !p)} style={{ border: 'none', background: 'var(--accent)', color: '#fff', borderRadius: 999, padding: '9px 24px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 14 }}>{playing ? '暂停' : '演示阳长阴消'}</button>
            <button onClick={() => { setPlaying(false); setStep((s) => (s + 1) % 12); }} style={{ border: '1px solid var(--hair-2)', background: 'transparent', borderRadius: 999, width: 36, height: 36, cursor: 'pointer', color: 'var(--ink-2)', fontSize: 15 }}>›</button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '38px 48px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Mono>加一倍法 · 以数推天地始终</Mono>
          <p style={{ fontSize: 13.5, lineHeight: 1.85, color: 'var(--ink-2)', margin: '10px 0 0' }}>
            邵雍以十二<b style={{ color: 'var(--ink)' }}>消息卦</b>配一岁十二月：阳气自《复》一阳来复，渐长至《乾》纯阳，再自《姤》一阴始生，渐消至《坤》纯阴——一套以卦象记录<b style={{ color: 'var(--ink)' }}>阴阳消长</b>的时间模型。
          </p>

          <div style={{ marginTop: 22 }}>
            <Mono dim>元 · 会 · 运 · 世 — 层层统摄</Mono>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
              {units.map(([u, sub, total], i) => (
                <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '11px 0', borderTop: i ? '1px solid var(--hair)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--accent)', width: 36 }}>{u}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, flex: 1 }}>统 {sub}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>{total}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, padding: '12px 14px', border: '1px dashed var(--hair-2)', borderRadius: 6 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink-2)' }}>一元 = 12 会 = 360 运 = 4320 世 = <b style={{ color: 'var(--ink)' }}>129600 年</b>，为天地一终始之大周期。</span>
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <Mono dim>由此回扣《易》</Mono>
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              <button onClick={onOpenCube} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)', borderRadius: 999, padding: '7px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                <span style={{ width: 11, height: 11, border: '1.3px solid var(--accent)', transform: 'rotate(45deg)', display: 'inline-block' }} /> 加一倍法 · 立体图
              </button>
              <button onClick={() => onOpenHex('kun' as TrigramKey, 'zhen' as TrigramKey)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink)', borderRadius: 999, padding: '7px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                读《复》· 一阳来复 ›
              </button>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 18 }}>
            <Mono dim>“天向一中分造化，人于心上起经纶。”</Mono>
          </div>
        </div>
      </div>
    </div>
  );
}
