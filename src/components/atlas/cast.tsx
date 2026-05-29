// 起卦 / 占问 — 三钱摇卦六次 → 本卦 + 动爻 → 之卦。
import { useState } from 'react';
import { Mono } from './chrome';
import { MorphYao } from './primitives';
import { hexFromLines } from './hex';
import { TopBar, type OpenHex } from './shared';

interface CastYao { val: number; coins: boolean[]; }

export function CastView({ onBack, onOpenHex }: { onBack: () => void; onOpenHex: OpenHex }) {
  const [yaos, setYaos] = useState<CastYao[]>([]);
  const [coins, setCoins] = useState([true, false, true]);
  const [tossing, setTossing] = useState(false);
  const [spin, setSpin] = useState(0);
  const done = yaos.length === 6;

  const toss = () => {
    if (tossing || done) return;
    setTossing(true);
    setSpin((s) => s + 1);
    const c = [Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5];
    setCoins(c);
    setTimeout(() => {
      const val = c.reduce((a, h) => a + (h ? 3 : 2), 0);
      setYaos((prev) => [...prev, { val, coins: c }]);
      setTossing(false);
    }, 620);
  };
  const reset = () => { setYaos([]); setTossing(false); };

  const isYang = (v: number) => v === 7 || v === 9;
  const isMoving = (v: number) => v === 6 || v === 9;
  const dispLines = [0, 1, 2, 3, 4, 5].map((r) => {
    const y = yaos[5 - r];
    return y ? (isYang(y.val) ? 1 : 0) : null;
  });
  const movingDisp = [0, 1, 2, 3, 4, 5].map((r) => { const y = yaos[5 - r]; return !!(y && isMoving(y.val)); });
  const benLines = done ? (dispLines as number[]) : null;
  const ben = benLines ? hexFromLines(benLines) : null;
  const zhiLines = benLines ? benLines.map((l, r) => (movingDisp[r] ? (l ? 0 : 1) : l)) : null;
  const zhi = zhiLines && movingDisp.some(Boolean) ? hexFromLines(zhiLines) : null;
  const valName: Record<number, string> = { 6: '老阴', 7: '少阳', 8: '少阴', 9: '老阳' };

  const Coin = ({ head }: { head: boolean }) => (
    <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `2px solid ${head ? 'var(--accent)' : 'var(--ink-3)'}`, background: head ? 'var(--accent-soft)' : 'var(--paper-2)',
      transform: `rotateX(${spin * 360}deg)`, transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
      fontFamily: 'var(--font-display)', fontSize: 24, color: head ? 'var(--accent)' : 'var(--ink-2)' }}>
      {head ? '阳' : '阴'}
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title="起卦 · 占问" sub="三钱成爻 · 六变成卦" onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, padding: 56, borderRight: '1px solid var(--hair)' }}>
          <Mono dim>{done ? '六爻已成' : `第 ${yaos.length + 1} 变 · 摇三枚铜钱`}</Mono>
          <div style={{ display: 'flex', gap: 22, perspective: 600 }}>
            {coins.map((h, i) => <Coin key={i} head={h} />)}
          </div>
          {!done ? (
            <button onClick={toss} disabled={tossing} style={{ border: 'none', background: 'var(--accent)', color: '#fff', borderRadius: 999, padding: '13px 38px', cursor: tossing ? 'default' : 'pointer', fontFamily: 'var(--font-serif)', fontSize: 17, opacity: tossing ? 0.6 : 1 }}>
              {tossing ? '摇卦中…' : '摇 卦'}
            </button>
          ) : (
            <button onClick={reset} style={{ border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-2)', borderRadius: 999, padding: '11px 30px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14 }}>
              重新起卦
            </button>
          )}
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.7, maxWidth: 320 }}>
            自下而上，六变成卦。<br />三枚皆阳得老阳(9)、皆阴得老阴(6)——老者为动爻，动则生“之卦”。
          </div>
        </div>

        <div style={{ width: 520, flex: '0 0 auto', padding: '44px 56px', display: 'flex', flexDirection: 'column' }}>
          <Mono>本卦 · 自下而上</Mono>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 1, 2, 3, 4, 5].map((r) => {
              const y = yaos[5 - r];
              const moving = movingDisp[r];
              return (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 16 }}>
                  <span style={{ width: 46, fontFamily: 'var(--font-mono)', fontSize: 10, color: moving ? 'var(--seal)' : 'var(--ink-3)', textAlign: 'right' }}>{y ? valName[y.val] : '—'}</span>
                  {y ? <MorphYao broken={!isYang(y.val)} w={190} h={13} gap={26} color={moving ? 'var(--seal)' : 'var(--ink)'} />
                    : <div style={{ width: 190, height: 13, borderRadius: 2, border: '1px dashed var(--hair-2)' }} />}
                  {moving && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--seal)' }}>动</span>}
                </div>
              );
            })}
          </div>

          {done && ben && (
            <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--hair)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div>
                  <Mono dim>本卦</Mono>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 22, marginTop: 4 }}>{ben.name}</div>
                  <Mono dim>第 {ben.num} 卦</Mono>
                </div>
                {zhi && (
                  <>
                    <span style={{ color: 'var(--seal)', fontSize: 22 }}>→</span>
                    <div>
                      <Mono dim>之卦</Mono>
                      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 22, marginTop: 4 }}>{zhi.name}</div>
                      <Mono dim>第 {zhi.num} 卦</Mono>
                    </div>
                  </>
                )}
              </div>
              <button onClick={() => onOpenHex(ben.upper, ben.lower)} style={{ marginTop: 20, border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)', borderRadius: 999, padding: '10px 22px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 15 }}>
                读 {ben.name} ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
