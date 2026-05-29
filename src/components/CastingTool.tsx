import { useState, useCallback, useRef } from 'react';
import { castHexagram, resolveCast, YAO_INFO, type CastResult } from '../lib/cast';
import { yaoTitle, type LineValue } from '../lib/iching';

function MiniGua({ lines, changing = [] }: { lines: LineValue[]; changing?: boolean[] }) {
  const size = 92;
  const bar = size / 9;
  const gap = bar * 0.62;
  const yinGap = size * 0.2;
  const segW = (size - yinGap) / 2;
  const n = lines.length;
  const height = n * bar + (n - 1) * gap;
  return (
    <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`} role="img" aria-label="卦象">
      {Array.from({ length: n }, (_, r) => {
        const idx = n - 1 - r;
        const y = r * (bar + gap);
        const isChanging = changing[idx] ?? false;
        const fill = isChanging ? 'var(--accent, #a8322d)' : 'var(--ink, #2b2622)';
        if (lines[idx] === 1) {
          return <rect key={idx} x={0} y={y} width={size} height={bar} rx={1.5} fill={fill} />;
        }
        return (
          <g key={idx}>
            <rect x={0} y={y} width={segW} height={bar} rx={1.5} fill={fill} />
            <rect x={size - segW} y={y} width={segW} height={bar} rx={1.5} fill={fill} />
          </g>
        );
      })}
    </svg>
  );
}

export default function CastingTool() {
  const [result, setResult] = useState<CastResult | null>(null);
  const [revealed, setRevealed] = useState(0); // 已显示的爻数（自下而上）
  const [rolling, setRolling] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const onCast = useCallback(() => {
    clearTimers();
    const r = castHexagram();
    setResult(r);
    setRevealed(0);
    setRolling(true);
    for (let i = 1; i <= 6; i++) {
      timers.current.push(
        setTimeout(() => {
          setRevealed(i);
          if (i === 6) setRolling(false);
        }, i * 420),
      );
    }
  }, []);

  const shownLines = result
    ? (result.lines.map((l, i) => (i < revealed ? l.value : 0)) as LineValue[])
    : ([0, 0, 0, 0, 0, 0] as LineValue[]);
  const shownChanging = result
    ? result.lines.map((l, i) => (i < revealed ? l.changing : false))
    : [];

  const resolved = result && revealed === 6 ? resolveCast(result) : null;

  return (
    <div className="casting">
      <div className="casting-stage">
        <div className="casting-gua">
          <MiniGua lines={shownLines} changing={shownChanging} />
          <div className="casting-caption">{rolling ? '起卦中…' : result ? '本卦' : '尚未起卦'}</div>
        </div>
        {resolved?.resulting && (
          <>
            <div className="casting-arrow" aria-hidden="true">→</div>
            <div className="casting-gua">
              <MiniGua lines={result!.resulting} />
              <div className="casting-caption">之卦</div>
            </div>
          </>
        )}
      </div>

      <button className="casting-btn" onClick={onCast} disabled={rolling}>
        {result ? '再起一卦' : '掷三枚铜钱起卦'}
      </button>

      {result && revealed === 6 && resolved && (
        <div className="casting-result">
          <p className="casting-line-1">
            <a href={`/gua/${resolved.primary.id}`}>
              第 {resolved.primary.id} 卦 · {resolved.primary.fullName}（{resolved.primary.name}）
            </a>
            {resolved.resulting && (
              <>
                <span className="casting-bian"> 之 </span>
                <a href={`/gua/${resolved.resulting.id}`}>
                  第 {resolved.resulting.id} 卦 · {resolved.resulting.fullName}
                </a>
              </>
            )}
          </p>

          <table className="casting-table">
            <thead>
              <tr>
                <th>爻位</th>
                <th>铜钱</th>
                <th>四象</th>
              </tr>
            </thead>
            <tbody>
              {[...result.lines]
                .map((l, i) => ({ l, i }))
                .reverse()
                .map(({ l, i }) => {
                  const info = YAO_INFO[l.type];
                  return (
                    <tr key={i} className={l.changing ? 'is-changing' : ''}>
                      <td>{yaoTitle(i, l.value)}</td>
                      <td className="coins">{l.coins.join(' · ')}</td>
                      <td>
                        {info.label} {info.symbol}
                        {l.changing && <span className="tag-bian">动</span>}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <p className="casting-hint muted">
            {result.changingIndexes.length === 0
              ? '六爻无变，以本卦卦辞为占。'
              : `动爻 ${result.changingIndexes.length} 处：老阴（✗）老阳（○）将变，由本卦演为之卦。`}
          </p>
        </div>
      )}

      <style>{`
        .casting { margin: 1.5rem 0; }
        .casting-stage {
          display: flex; align-items: center; justify-content: center; gap: 1.5rem;
          min-height: 130px; padding: 1.2rem; background: var(--paper-2);
          border: 1px solid var(--line); border-radius: 12px;
        }
        .casting-gua { text-align: center; }
        .casting-caption { margin-top: 0.5rem; font-size: 0.85rem; color: var(--ink-soft); }
        .casting-arrow { font-size: 1.6rem; color: var(--accent); }
        .casting-btn {
          display: block; margin: 1.1rem auto 0; padding: 0.6rem 1.6rem;
          font-family: var(--serif); font-size: 1.02rem; color: var(--paper);
          background: var(--accent); border: none; border-radius: 999px; cursor: pointer;
          box-shadow: var(--shadow); transition: opacity 0.15s ease;
        }
        .casting-btn:hover { opacity: 0.9; }
        .casting-btn:disabled { opacity: 0.5; cursor: default; }
        .casting-result { margin-top: 1.4rem; }
        .casting-line-1 { text-align: center; font-size: 1.12rem; }
        .casting-bian { color: var(--ink-soft); }
        .casting-table {
          width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem;
        }
        .casting-table th, .casting-table td {
          padding: 0.45rem 0.6rem; border-bottom: 1px solid var(--line); text-align: left;
        }
        .casting-table th { color: var(--ink-soft); font-weight: 500; font-size: 0.85rem; }
        .casting-table .coins { color: var(--ink-soft); letter-spacing: 0.1em; }
        .casting-table tr.is-changing td { color: var(--accent); }
        .tag-bian {
          display: inline-block; margin-left: 0.4rem; padding: 0 0.4rem;
          font-size: 0.72rem; color: var(--paper); background: var(--accent); border-radius: 4px;
        }
        .casting-hint { text-align: center; font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
