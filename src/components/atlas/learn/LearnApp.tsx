// 易学讲堂外壳 —— 目录 + 进度 + 翻页。见 docs/learn-layer.md §1/§3.4。
// 沿用既有 chrome（TopBar 的「‹ 星图」返回）、progress.ts 进度（与星图「已读 N」打通）、
// global.css 设计令牌；widget 以注册表解耦（import * as widgets，据键自动登记）。
import { useEffect, useState, type ComponentType } from 'react';
import { Mono } from '../chrome';
import { TopBar } from '../shared';
import { markRead, useProgress } from '../progress';
import { CURRICULUM, ALL_LESSONS, lessonKey } from './curriculum';
import { Blocks } from './Block';
import { Quiz } from './Quiz';
import * as widgets from './widgets';

// widget 注册表：barrel 的每个命名导出即一个交互件，键 = 导出名（= Lesson.widget）。
const WIDGETS = widgets as Record<string, ComponentType>;

const indexById = new Map(ALL_LESSONS.map((entry, i) => [entry.lesson.id, i]));

export function LearnApp({ onBack, onJump }: { onBack: () => void; onJump?: (to: string) => void }) {
  const prog = useProgress();
  const total = ALL_LESSONS.length;
  const [pos, setPos] = useState(0);
  const cur = total > 0 ? ALL_LESSONS[Math.min(pos, total - 1)] : null;

  // 进入某课即记为已读（与既有阅读视图一致，progress.ts 打通星图「已读 N」）。
  useEffect(() => {
    if (cur) markRead(lessonKey(cur.lesson.id));
  }, [cur]);

  const done = ALL_LESSONS.filter((e) => prog.isRead(lessonKey(e.lesson.id))).length;
  const sub = cur ? cur.module.title : '讲堂';
  const Widget = cur?.lesson.widget ? WIDGETS[cur.lesson.widget] : undefined;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <TopBar title="易学讲堂" sub={sub} onBack={onBack} />

      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        {/* 目录 + 进度 */}
        <aside style={{ width: 286, flex: '0 0 auto', borderRight: '1px solid var(--hair)', background: 'var(--paper-2)', overflowY: 'auto', padding: '22px 20px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Mono>目录</Mono>
            <Mono dim>{total > 0 ? `已完成 ${done} / ${total}` : '课程筹备中'}</Mono>
          </div>
          {total > 0 && (
            <div style={{ height: 3, borderRadius: 999, background: 'var(--hair)', margin: '12px 0 4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(done / total) * 100}%`, background: 'var(--accent)', transition: 'width .3s' }} />
            </div>
          )}

          <nav style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {CURRICULUM.map((m) => (
              <div key={m.id}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>
                  <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 11, marginRight: 7 }}>{m.id}</span>
                  {m.title}
                </div>
                <div style={{ marginTop: 1 }}><Mono dim>{m.sub}</Mono></div>
                {m.lessons.length === 0 ? (
                  <div style={{ marginTop: 8, fontFamily: 'var(--font-serif)', fontSize: 12.5, color: 'var(--ink-3)' }}>（课程将逐课上线）</div>
                ) : (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {m.lessons.map((lesson) => {
                      const i = indexById.get(lesson.id) ?? 0;
                      const active = cur?.lesson.id === lesson.id;
                      const read = prog.isRead(lessonKey(lesson.id));
                      return (
                        <button key={lesson.id} onClick={() => setPos(i)}
                          style={{ display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left', border: 'none', background: active ? 'var(--accent-soft)' : 'transparent', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 13.5, color: active ? 'var(--ink)' : 'var(--ink-2)' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', flex: '0 0 auto', background: read ? 'var(--accent)' : 'transparent', border: read ? 'none' : '1px solid var(--hair-2)' }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>{lesson.id}</span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* 主区：当前课 */}
        <main style={{ flex: 1, minWidth: 0, position: 'relative', overflowY: 'auto' }}>
          {!cur ? (
            <EmptyHall />
          ) : (
            <article style={{ maxWidth: 760, margin: '0 auto', padding: '34px 48px 80px' }}>
              <Mono dim>单元 {cur.module.id} · {cur.lesson.id}</Mono>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--ink)', margin: '8px 0 0', lineHeight: 1.3 }}>{cur.lesson.title}</h1>

              {cur.lesson.objective && (
                <div style={{ marginTop: 16, padding: '12px 16px', borderLeft: '3px solid var(--seal)', background: 'var(--paper-2)', borderRadius: '0 8px 8px 0' }}>
                  <Mono dim>本课目标</Mono>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.8, marginTop: 5 }}>{cur.lesson.objective}</div>
                </div>
              )}

              <div style={{ marginTop: 6 }}>
                <Blocks blocks={cur.lesson.body} />
              </div>

              {Widget && (
                <div style={{ margin: '24px 0' }}>
                  <Widget />
                </div>
              )}

              {cur.lesson.quizzes && cur.lesson.quizzes.length > 0 && (
                <section style={{ marginTop: 26 }}>
                  {cur.lesson.quizzes.map((quiz, i) => (
                    <Quiz key={i} item={quiz} index={i} />
                  ))}
                </section>
              )}

              {cur.lesson.links && cur.lesson.links.length > 0 && (
                <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {cur.lesson.links.map((link, i) => (
                    <button key={i} onClick={() => onJump?.(link.to)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)', borderRadius: 999, padding: '5px 13px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5 }}>
                      <span style={{ color: 'var(--accent)' }}>⟿</span> {link.label}
                    </button>
                  ))}
                </div>
              )}

              {/* 翻页 */}
              <div style={{ marginTop: 40, paddingTop: 18, borderTop: '1px solid var(--hair)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setPos((i) => Math.max(0, i - 1))} disabled={pos <= 0}
                  style={{ border: '1px solid var(--hair-2)', background: 'transparent', color: pos <= 0 ? 'var(--ink-3)' : 'var(--ink-2)', borderRadius: 999, padding: '8px 16px', cursor: pos <= 0 ? 'default' : 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
                  ‹ 上一课
                </button>
                <Mono dim>{pos + 1} / {total}</Mono>
                <button onClick={() => setPos((i) => Math.min(total - 1, i + 1))} disabled={pos >= total - 1}
                  style={{ border: '1px solid var(--accent)', background: pos >= total - 1 ? 'transparent' : 'var(--accent-soft)', color: pos >= total - 1 ? 'var(--ink-3)' : 'var(--ink)', borderRadius: 999, padding: '8px 16px', cursor: pos >= total - 1 ? 'default' : 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
                  下一课 ›
                </button>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}

// 空讲堂占位（骨架阶段课程未填）。
function EmptyHall() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ width: 86, height: 86, margin: '0 auto', borderRadius: '50%', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 6px var(--accent-soft)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, color: 'var(--accent)', lineHeight: 1, marginTop: 4 }}>讲</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 21, color: 'var(--ink)', marginTop: 22 }}>易学讲堂</div>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.85, marginTop: 10 }}>
          五单元 · 融合式交互课正在筹备。讲解文、可操作对象与随堂练将按课逐一上线。
        </p>
        <div style={{ marginTop: 16 }}><Mono dim>Learn Layer · Scaffolding ready</Mono></div>
      </div>
    </div>
  );
}
