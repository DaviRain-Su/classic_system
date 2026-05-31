// 随堂练 —— 即时判分单选题。见 docs/learn-layer.md §2。
// 选项选择是临时交互态（本地 useState）；课程「已完成」状态走 progress.ts（见 LearnApp），不在此持久化。
import { useState } from 'react';
import { Mono } from '../chrome';
import type { QuizItem } from './types';

export function Quiz({ item, index, onAnswered }: { item: QuizItem; index?: number; onAnswered?: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const isCorrect = picked === item.ans;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    onAnswered?.(i === item.ans);
  };

  const optColor = (i: number) => {
    if (!answered) return 'var(--hair-2)';
    if (i === item.ans) return 'var(--accent)';
    if (i === picked) return 'var(--seal)';
    return 'var(--hair-2)';
  };
  const optBg = (i: number) => {
    if (!answered) return 'transparent';
    if (i === item.ans) return 'var(--accent-soft)';
    if (i === picked) return 'color-mix(in srgb, var(--seal) 12%, var(--paper))';
    return 'transparent';
  };

  return (
    <div style={{ border: '1px solid var(--hair-2)', borderRadius: 10, background: 'var(--paper-2)', padding: '16px 18px', margin: '14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <Mono dim>随堂练{typeof index === 'number' ? ' ' + String(index + 1).padStart(2, '0') : ''}</Mono>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15.5, fontWeight: 700, color: 'var(--ink)', margin: '8px 0 14px', lineHeight: 1.7 }}>{item.q}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {item.opts.map((opt, i) => {
          const marked = answered && (i === item.ans || i === picked);
          return (
            <button key={i} onClick={() => choose(i)} disabled={answered}
              style={{ display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', border: `1px solid ${optColor(i)}`, background: optBg(i), borderRadius: 8, padding: '10px 13px', cursor: answered ? 'default' : 'pointer', fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--ink)', transition: 'border-color .2s, background .2s' }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${optColor(i)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: marked ? optColor(i) : 'var(--ink-3)' }}>
                {answered && i === item.ans ? '✓' : answered && i === picked ? '✕' : String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontWeight: 700, color: isCorrect ? 'var(--accent)' : 'var(--seal)', flex: '0 0 auto', lineHeight: 1.8 }}>
            {isCorrect ? '答对了' : '再想想'}
          </span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.8 }}>{item.fb}</span>
          <button onClick={() => setPicked(null)} style={{ marginLeft: 'auto', flex: '0 0 auto', border: '1px solid var(--hair-2)', background: 'transparent', color: 'var(--ink-3)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12 }}>
            重做
          </button>
        </div>
      )}
    </div>
  );
}
