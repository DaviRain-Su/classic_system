// 讲解内容块渲染 —— 见 docs/learn-layer.md §2。p/h/q/note/list/table。
// 全程使用 global.css 设计令牌（CSS 变量），随深色主题与四主色切换。
import { Mono } from '../chrome';
import type { Block as BlockT } from './types';

export function Block({ block }: { block: BlockT }) {
  switch (block.t) {
    case 'h':
      return (
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '26px 0 2px', lineHeight: 1.4 }}>
          {block.x}
        </h3>
      );
    case 'p':
      return (
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.95, margin: '12px 0' }}>
          {block.x}
        </p>
      );
    case 'q':
      return (
        <blockquote style={{ margin: '16px 0', padding: '12px 18px', borderLeft: '3px solid var(--accent)', background: 'var(--paper-2)', borderRadius: '0 8px 8px 0' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--ink)', lineHeight: 1.9 }}>{block.x}</div>
          {block.src && <div style={{ marginTop: 6 }}><Mono dim>—— {block.src}</Mono></div>}
        </blockquote>
      );
    case 'note':
      return (
        <div style={{ margin: '16px 0', padding: '12px 16px', border: '1px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: 8, display: 'flex', gap: 10 }}>
          <span style={{ color: 'var(--accent)', fontSize: 14, lineHeight: 1.7, flex: '0 0 auto' }}>※</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.75 }}>{block.x}</span>
        </div>
      );
    case 'list':
      return (
        <ul style={{ margin: '12px 0', paddingLeft: 0, listStyle: 'none' }}>
          {block.x.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.9, margin: '4px 0' }}>
              <span style={{ color: 'var(--accent)', flex: '0 0 auto' }}>·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div style={{ margin: '16px 0', overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'var(--font-serif)', fontSize: 14 }}>
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1.5px solid var(--hair-2)', background: 'var(--paper-2)', color: 'var(--ink-2)', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} style={{ padding: '8px 12px', borderBottom: '1px solid var(--hair)', color: 'var(--ink)', verticalAlign: 'top' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

// 讲解文整段渲染。
export function Blocks({ blocks }: { blocks: BlockT[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </>
  );
}
