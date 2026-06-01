// 皇极经世 · 元会运世盘 — 十二消息卦圆图 + 元会运世数表。
import { useEffect, useState } from 'react';
import { Mono } from './chrome';
import type { TrigramKey } from './data';
import { TopBar, type OpenHex } from './shared';
import { XiaoXiCycle, XIAOXI_HEXES, XIAOXI_SEQUENCE, type XiaoXiKey } from './XiaoXiCycle';

export function HuangjiPan({ onBack, onOpenHex, onOpenCube }: { onBack: () => void; onOpenHex: OpenHex; onOpenCube: () => void }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const curKey = XIAOXI_SEQUENCE[step] ?? 'fu';
  const cur = XIAOXI_HEXES[curKey];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setStep((s) => (s + 1) % XIAOXI_SEQUENCE.length), 1100);
    return () => clearInterval(t);
  }, [playing]);

  const units: [string, string, string][] = [
    ['元', '12 会', '129600 年'],
    ['会', '30 运', '10800 年'],
    ['运', '12 世', '360 年'],
    ['世', '30 年', '30 年'],
  ];

  const selectXiaoXi = (key: XiaoXiKey) => {
    const next = XIAOXI_SEQUENCE.indexOf(key);
    if (next < 0) return;
    setPlaying(false);
    setStep(next);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="皇极经世 · 元会运世盘" sub="邵雍 · 十二消息卦" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 620, flex: '0 0 auto', borderRight: '1px solid var(--hair)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 24px 88px' }}>
          <div style={{ width: '100%', maxWidth: 560 }}>
            <XiaoXiCycle selectedKey={curKey} onSelect={selectXiaoXi} />
          </div>
          <div style={{ position: 'absolute', bottom: 26, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => { setPlaying(false); setStep((s) => (s + XIAOXI_SEQUENCE.length - 1) % XIAOXI_SEQUENCE.length); }} style={{ border: '1px solid var(--hair-2)', background: 'transparent', borderRadius: 999, width: 36, height: 36, cursor: 'pointer', color: 'var(--ink-2)', fontSize: 15 }}>‹</button>
            <button onClick={() => setPlaying((p) => !p)} style={{ border: 'none', background: 'var(--accent)', color: '#fff', borderRadius: 999, padding: '9px 24px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 14 }}>{playing ? '暂停' : '演示阳长阴消'}</button>
            <button onClick={() => { setPlaying(false); setStep((s) => (s + 1) % XIAOXI_SEQUENCE.length); }} style={{ border: '1px solid var(--hair-2)', background: 'transparent', borderRadius: 999, width: 36, height: 36, cursor: 'pointer', color: 'var(--ink-2)', fontSize: 15 }}>›</button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '38px 48px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Mono>加一倍法 · 以数推天地始终</Mono>
          <p style={{ fontSize: 13.5, lineHeight: 1.85, color: 'var(--ink-2)', margin: '10px 0 0' }}>
            邵雍以十二<b style={{ color: 'var(--ink)' }}>消息卦</b>配一岁十二月：阳气自《复》一阳来复，渐长至《乾》纯阳，再自《姤》一阴始生，渐消至《坤》纯阴——一套以卦象记录<b style={{ color: 'var(--ink)' }}>阴阳消长</b>的时间模型。此图以《复》居子月冬至之下，《姤》居午月夏至之上；右半为<b style={{ color: 'var(--seal)' }}>息</b>，左半为<b style={{ color: 'var(--accent)' }}>消</b>。
          </p>

          <div style={{ marginTop: 18, padding: '12px 14px', border: '1px solid var(--hair)', borderRadius: 8, background: 'var(--paper-2)' }}>
            <Mono dim>当前消息</Mono>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--accent)', lineHeight: 1 }}>{cur.name}</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink)' }}>{cur.month}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>{cur.yang}阳{6 - cur.yang}阴</span>
            </div>
            <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-serif)', color: 'var(--ink-2)', fontSize: 13.5 }}>{cur.phase}。点击圆图任一卦，可停驻查看其月令位置与阴阳比例。</p>
          </div>

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
