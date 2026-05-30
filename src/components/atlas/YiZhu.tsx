// 历代易注：程颐《伊川易传》 / 朱熹《周易本义》。
// 单独成块，避免首页和非卦页提前加载 jizhu.ts 的大表。
import { useEffect, useState } from 'react';
import { Mono } from './chrome';
import { JIZHU } from './jizhu';

export function YiZhu({ num, yao }: { num: number; yao?: string }) {
  const z = JIZHU[num] || {};
  const yz = (yao && z.yao && z.yao[yao]) || {};
  const sources = [
    { label: '程颐《伊川易传》', gua: z.cheng, yaoTxt: yz.cheng },
    { label: '朱熹《周易本义》', gua: z.zhu, yaoTxt: yz.zhu },
  ].filter((s) => s.gua || s.yaoTxt);
  const [t, setT] = useState(0);
  useEffect(() => setT(0), [num, yao]);

  if (sources.length === 0) {
    return <div style={{ marginTop: 10, padding: '12px 14px', border: '1px dashed var(--hair-2)', borderRadius: 6 }}><Mono dim>历代易注 · 此卦待补</Mono></div>;
  }

  const cur = sources[Math.min(t, sources.length - 1)];
  const para = (label: string, text: string) => (
    <div style={{ marginTop: 4 }}>
      <Mono dim>{label}</Mono>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.9, color: 'var(--ink-2)', marginTop: 4 }}>{text}</div>
    </div>
  );

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {sources.map((s, i) => (
          <button key={s.label} onClick={() => setT(i)} style={{ border: '1px solid ' + (i === t ? 'var(--accent)' : 'var(--hair-2)'), background: i === t ? 'var(--accent-soft)' : 'transparent', color: i === t ? 'var(--ink)' : 'var(--ink-3)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 12.5 }}>{s.label}</button>
        ))}
      </div>
      <div style={{ marginTop: 10, maxHeight: 200, overflowY: 'auto', padding: '12px 14px', border: '1px solid var(--hair-2)', borderRadius: 8, background: 'var(--paper-2)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cur.yaoTxt && para((yao || '') + ' · 爻注', cur.yaoTxt)}
        {cur.gua && para(cur.yaoTxt ? '卦辞' : '卦辞注', cur.gua)}
      </div>
    </div>
  );
}
