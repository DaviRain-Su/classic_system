// 经卷长轴阅读 — 乾/坤等全卦(可交互) / 道德经·庄子·坛经(多章) / 心经·常清静·系辞·阳明·阴符·参同契(逐句) / 占位。
import { useState } from 'react';
import {
  QIAN, KUN, HEX_FULL, DAODE, ZHUANGZI, TANJING, YINFU, CANTONGQI, XINJING, QINGJING, YANGMING, XICI,
  JINGANG, BUER, BASHI, RUPUSA, ZHENGJIAN, ZHONGYONG, TAIJITU, XIMING,
  TRIGRAMS, SCHOOL_INFO, WORK_BY_ID, NODE_BY_ID,
  type FullHex, type ClauseWork, type ChapterWork, type TrigramKey,
} from './data';
import { HuangjiPan } from './HuangjiPan';
import { Mono } from './chrome';
import { MorphYao } from './primitives';
import { TermText, ModeToggle, ParallelView } from './reading-modes';
import { TopBar, JiZhu, YiZhu, LinkChip, RelChips, BianPanel, GuaFamily, type OpenNode, type OpenHex } from './shared';

type OpenTrigram = (t: TrigramKey) => void;
type OpenSchool = (id: string) => void;

// ── 通用完整卦阅读（乾/坤/泰/否/既济/未济）──
function ReadingGua({ data, bmKey, onBack, onOpen, onOpenHex, onOpenTrigram, onOpenSchool }: {
  data: FullHex; bmKey: string; onBack: () => void; onOpen: OpenNode; onOpenHex: OpenHex; onOpenTrigram: OpenTrigram; onOpenSchool: OpenSchool;
}) {
  const q = data;
  const baseLines = q.lines || [...TRIGRAMS[q.upper].lines, ...TRIGRAMS[q.lower].lines];
  const [sel, setSel] = useState(5);
  const [changed, setChanged] = useState(false);
  const [showZhu, setShowZhu] = useState(false);
  const cur = q.yaos[sel];
  const yong = q.yongjiu || q.yongliu;

  const YaoRow = ({ i }: { i: number }) => {
    const y = q.yaos[i];
    const on = sel === i;
    const broken = changed && on ? baseLines[i] === 1 : baseLines[i] === 0;
    return (
      <div onClick={() => { setSel(i); setChanged(false); }} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', background: on ? 'var(--accent-soft)' : 'transparent', transition: 'background .18s' }}>
        <span style={{ width: 30, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: on ? (changed ? 'var(--seal)' : 'var(--accent)') : 'var(--ink-3)', textAlign: 'right' }}>{y.pos}</span>
        <MorphYao broken={broken} w={150} h={12} gap={22} color={on ? (changed ? 'var(--seal)' : 'var(--accent)') : 'var(--ink)'} />
      </div>
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={'易经 · ' + q.full} sub={q.symbol + ' 第 ' + (q.num || 1) + ' 卦'} onBack={onBack} bookmarkKey={bmKey} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 470, flex: '0 0 auto', borderRight: '1px solid var(--hair)', padding: '40px 48px', display: 'flex', flexDirection: 'column' }}>
          <Mono>骨干 · {q.name}</Mono>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 72, color: 'var(--accent)', lineHeight: 0.9 }}>{q.name}</span>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 18 }}>{q.full}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                <button onClick={() => onOpenTrigram(q.upper)} style={{ border: '1px solid var(--hair-2)', background: 'transparent', borderRadius: 999, padding: '3px 10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--ink-2)' }}>{TRIGRAMS[q.upper].name}上 ›</button>
                <button onClick={() => onOpenTrigram(q.lower)} style={{ border: '1px solid var(--hair-2)', background: 'transparent', borderRadius: 999, padding: '3px 10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--ink-2)' }}>{TRIGRAMS[q.lower].name}下 ›</button>
              </div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 19, marginTop: 18, letterSpacing: '0.03em', lineHeight: 1.6 }}>{q.gua}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.7 }}>{q.guaGloss}</div>

          <div style={{ marginTop: 18 }}><Mono dim>点击爻位 · 读爻辞</Mono></div>
          <div style={{ marginTop: 6 }}>{q.yaos.map((_, i) => <YaoRow key={i} i={i} />)}</div>
          {yong && (
            <div style={{ marginTop: 6, paddingTop: 10, borderTop: '1px dashed var(--hair-2)', display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 12 }}>
              <span style={{ width: 30, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--seal)', textAlign: 'right' }}>{yong.pos}</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--ink-2)' }}>{yong.text}</span>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <Mono dim>卦族 · 错 / 综 / 互 / 交</Mono>
            <div style={{ marginTop: 10 }}><GuaFamily lines={baseLines} onOpenHex={onOpenHex} /></div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '40px 56px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <div style={{ flex: 1 }}>
              <Mono>象传</Mono>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.8, marginTop: 6, color: 'var(--ink-2)' }}>{q.xiang}</div>
              {q.id === 'yi' && <div style={{ marginTop: 10 }}><LinkChip link={{ kind: 'school', label: '儒家修身之本由此出', onClick: () => onOpenSchool('ru') }} onOpen={onOpen} onOpenHex={onOpenHex} /></div>}
            </div>
            <div style={{ flex: 1 }}>
              <Mono>彖传</Mono>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.8, marginTop: 6, color: 'var(--ink-2)' }}>{q.tuan}</div>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 22, borderTop: '1px solid var(--hair)' }}>
            <Mono>爻辞 · {cur.pos}</Mono>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 600, lineHeight: 1.5, marginTop: 12, letterSpacing: '0.02em' }}>{cur.text}</div>
            <div style={{ display: 'flex', gap: 30, marginTop: 16 }}>
              {cur.gloss && (
                <div style={{ flex: 1 }}>
                  <Mono dim>白话</Mono>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.85, marginTop: 7, color: 'var(--ink-2)' }}>{cur.gloss}</div>
                </div>
              )}
              {cur.xiang && (
                <div style={{ flex: 1 }}>
                  <Mono dim>小象</Mono>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.85, marginTop: 7, color: 'var(--ink-2)' }}>{cur.xiang}</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setShowZhu((s) => !s)} style={{ border: 'none', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, padding: 0 }}>
                {showZhu ? '收起历代易注 ▴' : '展开历代易注（程颐 · 朱熹）▾'}
              </button>
              {showZhu && <YiZhu num={q.num || 1} />}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <Mono dim>卦变 · 推演之卦</Mono>
            <div style={{ marginTop: 12 }}>
              <BianPanel originName={q.full} lines={baseLines} sel={sel} changed={changed} onToggle={() => setChanged((c) => !c)} onOpenHex={onOpenHex} />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <Mono dim>由此辐射 · 各家经典</Mono>
            <div style={{ marginTop: 12 }}><RelChips onOpen={onOpenSchool} exclude={null} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 多章/品 通用阅读（道德经 / 庄子 / 坛经）──
function ChapterReader({ data, glyph, sideSub, school, bmKey, zhuNames, footLabel, onBack, onOpen, onOpenHex, onOpenSchool }: {
  data: ChapterWork; glyph: string; sideSub: string; school: string; bmKey: string; zhuNames: string[]; footLabel: string;
  onBack: () => void; onOpen: OpenNode; onOpenHex: OpenHex; onOpenSchool: OpenSchool;
}) {
  const d = data;
  const firstReal = Math.max(0, d.chapters.findIndex((c) => c.clauses));
  const [ch, setCh] = useState(firstReal);
  const [open, setOpen] = useState(0);
  const chapter = d.chapters[ch];
  const clauses = chapter.clauses || [];

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={d.title} sub={sideSub} onBack={onBack} bookmarkKey={bmKey} school={school} onOpenSchool={onOpenSchool} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 360, flex: '0 0 auto', borderRight: '1px solid var(--hair)', padding: '40px 44px', overflowY: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 80, color: 'var(--accent)', lineHeight: 1 }}>{glyph}</span>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 22, marginTop: 10 }}>{d.title}</div>
          <Mono dim style={{ marginTop: 4 }}>{sideSub}</Mono>
          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column' }}>
            {d.chapters.map((c, i) => {
              const has = !!c.clauses;
              const on = i === ch;
              return (
                <div key={c.name} onClick={() => { if (has) { setCh(i); setOpen(0); } }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 8, background: on ? 'var(--accent-soft)' : 'transparent', cursor: has ? 'pointer' : 'default', opacity: has ? 1 : 0.6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: on ? 'var(--accent)' : 'var(--ink-3)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: on ? 600 : 400, color: on ? 'var(--ink)' : 'var(--ink-3)' }}>{c.name}</span>
                  {!has && <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)' }}>占位</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, padding: '36px 60px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Mono>正在阅读 · {chapter.name} · 点句读注</Mono>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 28, margin: '10px 0 2px' }}>{d.title} · {chapter.name}</h1>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: 6 }}>
            {clauses.map((c, i) => {
              const o = open === i;
              return (
                <div key={i} style={{ borderTop: i ? '1px solid var(--hair)' : 'none' }}>
                  <div onClick={() => setOpen(o ? -1 : i)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 0', cursor: 'pointer' }}>
                    <div style={{ flex: 1 }}><TermText text={c.text} size={20} lh={1.7} /></div>
                    <span style={{ color: 'var(--ink-3)', fontSize: 12, transform: o ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
                  </div>
                  {o && (
                    <div style={{ padding: '4px 0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div><Mono dim>白话</Mono><div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.85, marginTop: 6, color: 'var(--ink-2)' }}>{c.gloss}</div></div>
                      {c.link && <div><LinkChip link={c.link} onOpen={onOpen} onOpenHex={onOpenHex} /></div>}
                      <JiZhu names={zhuNames} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <button onClick={() => onOpen('yi')} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: 999, padding: '8px 16px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)' }}>易</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{d.relation}</span>
              <span style={{ color: 'var(--accent)' }}>›</span>
            </button>
            <Mono dim>{footLabel}</Mono>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 逐句通用阅读（心经 / 常清静 / 系辞 / 阳明 / 阴符 / 参同契）──
function ClauseReader({ data, glyph, sideTitle, sideSub, school, bmKey, zhuNames, footLabel, onBack, onOpen, onOpenHex, onOpenSchool, onOpenCube }: {
  data: ClauseWork; glyph: string; sideTitle: string; sideSub?: string; school?: string; bmKey: string; zhuNames: string[]; footLabel: string;
  onBack: () => void; onOpen: OpenNode; onOpenHex: OpenHex; onOpenSchool: OpenSchool; onOpenCube: () => void;
}) {
  const x = data;
  const [open, setOpen] = useState(0);
  const [mode, setMode] = useState('unfold');
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={x.title} sub={sideSub} onBack={onBack} bookmarkKey={bmKey} school={school} onOpenSchool={onOpenSchool} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 360, flex: '0 0 auto', borderRight: '1px solid var(--hair)', padding: '40px 44px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 80, color: 'var(--accent)', lineHeight: 1 }}>{glyph}</span>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 22, marginTop: 10 }}>{sideTitle}</div>
          <Mono dim style={{ marginTop: 4 }}>{sideSub}</Mono>
          {x.intro && <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--ink-2)', marginTop: 16 }}>{x.intro}</p>}
          {x.sijiao && (
            <div style={{ marginTop: 18, padding: '16px 18px', borderLeft: '2px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: '0 8px 8px 0' }}>
              <Mono>四句教</Mono>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {x.sijiao.map((s, i) => <div key={i} style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.5 }}>{s}</div>)}
              </div>
            </div>
          )}
          {x.mantra && (
            <div style={{ marginTop: 'auto' }}>
              <Mono dim>咒</Mono>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.9, marginTop: 8, color: 'var(--accent)' }}>{x.mantra}</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: '36px 60px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Mono>{footLabel} · {mode === 'parallel' ? '原文白话对照' : '点句读注 · 点术语释名'}</Mono>
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 28, margin: '10px 0 2px' }}>{x.title}</h1>
          {mode === 'parallel' ? (
            <div style={{ marginTop: 12, flex: 1, minHeight: 0 }}>
              <ParallelView clauses={x.clauses} onOpen={onOpen} onOpenHex={onOpenHex} />
            </div>
          ) : (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: 6 }}>
              {x.clauses.map((c, i) => {
                const o = open === i;
                return (
                  <div key={i} style={{ borderTop: i ? '1px solid var(--hair)' : 'none' }}>
                    <div onClick={() => setOpen(o ? -1 : i)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 0', cursor: 'pointer' }}>
                      <div style={{ flex: 1 }}><TermText text={c.text} size={19} lh={1.7} /></div>
                      <span style={{ color: 'var(--ink-3)', fontSize: 12, transform: o ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
                    </div>
                    {o && (
                      <div style={{ padding: '4px 0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div><Mono dim>白话</Mono><div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.85, marginTop: 6, color: 'var(--ink-2)' }}>{c.gloss}</div></div>
                        {c.link && <div><LinkChip link={{ ...c.link, onClick: c.link.kind === 'cube' ? onOpenCube : c.link.onClick }} onOpen={onOpen} onOpenHex={onOpenHex} /></div>}
                        <JiZhu names={zhuNames} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <button onClick={() => onOpen('yi')} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: 999, padding: '8px 16px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)' }}>易</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{x.relation}</span>
              <span style={{ color: 'var(--accent)' }}>›</span>
            </button>
            <Mono dim>{footLabel}</Mono>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 占位（即将上线）──
function ReadingSoon({ id, onBack, onOpenSchool }: { id: string; onBack: () => void; onOpenSchool: OpenSchool }) {
  const w = WORK_BY_ID[id];
  const n = w
    ? { name: w.title, author: w.author, glyph: (SCHOOL_INFO[w.school] || {}).glyph || '经', rel: '', frag: w.frag, school: w.school }
    : (NODE_BY_ID[id] ? { name: NODE_BY_ID[id].name, author: NODE_BY_ID[id].author || '', glyph: NODE_BY_ID[id].glyph, rel: NODE_BY_ID[id].rel || '', frag: NODE_BY_ID[id].frag || '', school: undefined as string | undefined } : { name: '经典', author: '', glyph: '经', rel: '', frag: '', school: undefined });
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={n.name} sub={n.author} onBack={onBack} bookmarkKey={id} school={n.school} onOpenSchool={onOpenSchool} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 56 }}>
        <div style={{ width: 92, height: 92, borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, color: 'var(--accent)', lineHeight: 1, marginTop: 4 }}>{n.glyph}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 26, marginTop: 22 }}>{n.name}</div>
        <Mono dim style={{ marginTop: 6 }}>{n.author} · {n.rel}</Mono>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ink-2)', marginTop: 24, lineHeight: 1.7 }}>{n.frag}</div>
        <div style={{ marginTop: 28, padding: '10px 20px', border: '1px dashed var(--hair-2)', borderRadius: 999 }}>
          <Mono dim>内容编撰中 · 即将上线</Mono>
        </div>
        <div style={{ marginTop: 40 }}>
          <Mono dim>先读已上线的经典</Mono>
          <div style={{ marginTop: 14 }}><RelChips onOpen={onOpenSchool} exclude={null} /></div>
        </div>
      </div>
    </div>
  );
}

export function Reading({ id, onBack, onOpen, onOpenHex, onOpenTrigram, onOpenSchool, onOpenCube }: {
  id: string; onBack: () => void; onOpen: OpenNode; onOpenHex: OpenHex; onOpenTrigram: OpenTrigram; onOpenSchool: OpenSchool; onOpenCube: () => void;
}) {
  const guaProps = { onBack, onOpen, onOpenHex, onOpenTrigram, onOpenSchool };
  if (id === 'yi') return <ReadingGua data={QIAN} bmKey="yi" {...guaProps} />;
  if (id === 'kun') return <ReadingGua data={KUN} bmKey="gua:2" {...guaProps} />;
  const numId = Number(id);
  if (HEX_FULL[numId]) return <ReadingGua data={HEX_FULL[numId]} bmKey={'gua:' + id} {...guaProps} />;
  if (id === 'daode') return <ChapterReader data={DAODE} glyph="道" sideSub="老子 · 八十一章" school="dao" bmKey="daode" zhuNames={['王弼', '河上公', '苏辙']} footLabel="道家 · 道德经" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} />;
  if (id === 'zhuangzi') return <ChapterReader data={ZHUANGZI} glyph="庄" sideSub="庄周 · 内七篇" school="dao" bmKey="zhuangzi" zhuNames={['郭象', '成玄英', '王夫之']} footLabel="道家 · 庄子" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} />;
  if (id === 'tanjing') return <ChapterReader data={TANJING} glyph="佛" sideSub="惠能 · 十品" school="fo" bmKey="tanjing" zhuNames={['宗宝', '德异', '契嵩']} footLabel="佛家 · 六祖坛经" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} />;
  if (id === 'yinfu') return <ClauseReader data={YINFU} glyph="符" sideTitle={YINFU.full!} sideSub={YINFU.author} school="dao" bmKey="yinfu" zhuNames={['李筌', '张果', '朱熹']} footLabel="道家 · 阴符经" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'cantongqi') return <ClauseReader data={CANTONGQI} glyph="丹" sideTitle={CANTONGQI.full!} sideSub={CANTONGQI.author} school="dao" bmKey="cantongqi" zhuNames={['彭晓', '朱熹', '陈致虚']} footLabel="道家 · 参同契" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'xinjing') return <ClauseReader data={XINJING} glyph="佛" sideTitle={XINJING.full!} sideSub={XINJING.author} school="fo" bmKey="xinjing" zhuNames={['玄奘', '智旭', '憨山']} footLabel="般若部 · 心经" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'jingang') return <ClauseReader data={JINGANG} glyph="金" sideTitle={JINGANG.full!} sideSub={JINGANG.author} school="fo" bmKey="jingang" zhuNames={['僧肇', '智顗', '宗密']} footLabel="般若部 · 金刚经" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'buer') return <ClauseReader data={BUER} glyph="维" sideTitle={BUER.full!} sideSub={BUER.author} school="fo" bmKey="buer" zhuNames={['僧肇', '智顗', '湛然']} footLabel="佛家 · 不二法门" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'bashi') return <ClauseReader data={BASHI} glyph="识" sideTitle={BASHI.full!} sideSub={BASHI.author} school="fo" bmKey="bashi" zhuNames={['窥基', '太虚']} footLabel="唯识 · 八识规矩颂" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'rupusa') return <ClauseReader data={RUPUSA} glyph="入" sideTitle={RUPUSA.full!} sideSub={RUPUSA.author} school="fo" bmKey="rupusa" zhuNames={['寂天', '宗喀巴', '如石']} footLabel="藏传 · 入菩萨行论" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'zhengjian') return <ClauseReader data={ZHENGJIAN} glyph="见" sideTitle={ZHENGJIAN.full!} sideSub={ZHENGJIAN.author} school="fo" bmKey="zhengjian" zhuNames={['导读']} footLabel="藏传导读 · 四法印" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'qjing') return <ClauseReader data={QINGJING} glyph="清" sideTitle={QINGJING.full!} sideSub={QINGJING.author} school="dao" bmKey="qjing" zhuNames={['杜光庭', '王重阳', '李道纯']} footLabel="道家 · 常清静经" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'yangming') return <ClauseReader data={YANGMING} glyph="儒" sideTitle={YANGMING.full!} sideSub={YANGMING.author} school="ru" bmKey="yangming" zhuNames={['钱德洪', '黄宗羲']} footLabel="儒家 · 阳明心学" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'zhongyong') return <ClauseReader data={ZHONGYONG} glyph="儒" sideTitle={ZHONGYONG.full!} sideSub={ZHONGYONG.author} school="ru" bmKey="zhongyong" zhuNames={['郑玄', '朱熹']} footLabel="儒家 · 中庸" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'taijitu') return <ClauseReader data={TAIJITU} glyph="儒" sideTitle={TAIJITU.full!} sideSub={TAIJITU.author} school="ru" bmKey="taijitu" zhuNames={['朱熹']} footLabel="理学 · 太极图说" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'ximing') return <ClauseReader data={XIMING} glyph="儒" sideTitle={XIMING.full!} sideSub={XIMING.author} school="ru" bmKey="ximing" zhuNames={['朱熹', '王夫之']} footLabel="理学 · 西铭" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  if (id === 'huangji') return <HuangjiPan onBack={onBack} onOpenHex={onOpenHex} onOpenCube={onOpenCube} />;
  if (id === 'xici') return <ClauseReader data={XICI} glyph="系" sideTitle={XICI.title} sideSub={XICI.full} bmKey="xici" zhuNames={['韩康伯', '孔颖达', '朱熹']} footLabel="十翼 · 系辞传" onBack={onBack} onOpen={onOpen} onOpenHex={onOpenHex} onOpenSchool={onOpenSchool} onOpenCube={onOpenCube} />;
  return <ReadingSoon id={id} onBack={onBack} onOpenSchool={onOpenSchool} />;
}
