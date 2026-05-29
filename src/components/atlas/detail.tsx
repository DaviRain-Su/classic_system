// 家级落地页 SchoolView · 八卦详情 TrigramView · 首次引导 Onboard。
import { SCHOOL_INFO, WORK_BY_ID, TRIGRAMS, TRIGRAM_ATTR, TRIGRAM_ORDER, type TrigramKey } from './data';
import { Mono } from './chrome';
import { Yao, Lines, HexFigure } from './primitives';
import { hexInfo } from './hex';
import { TopBar, type OpenNode, type OpenHex } from './shared';

export function SchoolView({ id, onBack, onOpen }: { id: string; onBack: () => void; onOpen: OpenNode }) {
  const s = SCHOOL_INFO[id];
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={s.name} sub={s.tagline} onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 56px', overflow: 'auto' }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'var(--accent-soft)', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 56, color: 'var(--accent)', lineHeight: 1, marginTop: 4 }}>{s.glyph}</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 34, margin: '22px 0 6px' }}>{s.name}</h1>
        <Mono dim>{s.tagline}</Mono>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, lineHeight: 1.9, color: 'var(--ink-2)', maxWidth: 620, textAlign: 'center', margin: '20px 0 0' }}>{s.intro}</p>
        <div style={{ maxWidth: 620, marginTop: 22, padding: '16px 22px', borderLeft: '2px solid var(--accent)', background: 'var(--accent-soft)', borderRadius: '0 8px 8px 0' }}>
          <Mono>与《易经》的关系</Mono>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15.5, lineHeight: 1.85, marginTop: 8 }}>{s.relation}</div>
        </div>
        <div style={{ marginTop: 30, width: '100%', maxWidth: 760 }}>
          <Mono dim>旗下经典</Mono>
          <div style={{ display: 'flex', gap: 16, marginTop: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {s.workIds.map((wid) => {
              const n = WORK_BY_ID[wid];
              if (!n) return null;
              return (
                <button key={wid} onClick={() => onOpen(wid)} style={{ width: 230, textAlign: 'left', border: '1px solid var(--hair-2)', borderRadius: 10, padding: '18px 20px', background: 'var(--paper-2)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)' }}>{s.glyph}</span>
                    {n.status === 'ready' ? <Mono dim>可读</Mono> : n.status === 'partial' ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 999, padding: '2px 7px' }}>部分上线</span> : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)', border: '1px solid var(--hair-2)', borderRadius: 999, padding: '2px 7px' }}>即将上线</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 18, marginTop: 12 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{n.author}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--ink-2)', marginTop: 9 }}>{n.frag}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrigramView({ tkey, onBack, onOpenHex }: { tkey: TrigramKey; onBack: () => void; onOpenHex: OpenHex }) {
  const t = TRIGRAMS[tkey], a = TRIGRAM_ATTR[tkey];
  const order = TRIGRAM_ORDER;
  const attrs: [string, string][] = [['卦德', a.attr], ['取象', a.img], ['家人', a.family], ['方位', a.dir], ['五行', a.element], ['取物', a.animal + ' · ' + a.body]];

  const HexMini = ({ up, lo }: { up: TrigramKey; lo: TrigramKey }) => {
    const info = hexInfo(up, lo);
    return (
      <button onClick={() => onOpenHex(up, lo)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, border: '1px solid var(--hair-2)', borderRadius: 7, padding: '10px 6px', background: 'transparent', cursor: 'pointer', width: 74 }}>
        <HexFigure lines={info.lines} w={26} h={3} vgap={2.5} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 11, whiteSpace: 'nowrap' }}>{info.name}</span>
      </button>
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <TopBar title={'八卦 · ' + t.name} sub={t.glyph + ' ' + t.nature} onBack={onBack} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        <div style={{ width: 420, flex: '0 0 auto', borderRight: '1px solid var(--hair)', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Lines lines={t.lines} w={120} h={16} vgap={16} color="var(--accent)" />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 60, color: 'var(--ink)', marginTop: 22, lineHeight: 1 }}>{t.name}</div>
          <Mono dim style={{ marginTop: 6 }}>{t.glyph} · 象{t.nature}</Mono>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 30, width: '100%' }}>
            {attrs.map(([k, v]) => (
              <div key={k} style={{ border: '1px solid var(--hair)', borderRadius: 8, padding: '12px 14px' }}>
                <Mono dim>{k}</Mono>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: '44px 56px', overflow: 'auto' }}>
          <Mono>含 {t.name}（{t.nature}）之卦 · 点击进入</Mono>
          <div style={{ marginTop: 18 }}>
            <Mono dim>作为上卦</Mono>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {order.map((lo) => <HexMini key={'u' + lo} up={tkey} lo={lo} />)}
            </div>
          </div>
          <div style={{ marginTop: 26 }}>
            <Mono dim>作为下卦</Mono>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {order.map((up) => <HexMini key={'l' + up} up={up} lo={tkey} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Onboard({ onClose }: { onClose: (dontShow: boolean) => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(20,18,15,.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: 560, maxWidth: '90vw', background: 'var(--paper)', borderRadius: 16, padding: '40px 44px', boxShadow: '0 30px 90px rgba(0,0,0,.35)', color: 'var(--ink)' }}>
        <Mono dim>欢迎 · 经典图谱</Mono>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 28, margin: '10px 0 0' }}>先识阴阳两爻</h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.9, color: 'var(--ink-2)', margin: '12px 0 0' }}>整座图谱以《易经》为骨干。读卦之前，只需认得两种最小符号——</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 22 }}>
          <div style={{ flex: 1, border: '1px solid var(--hair)', borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Yao on={1} w={70} h={9} />
            <div><div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 16 }}>阳爻</div><Mono dim>连 · 刚</Mono></div>
          </div>
          <div style={{ flex: 1, border: '1px solid var(--hair)', borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Yao on={0} w={70} h={9} />
            <div><div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 16 }}>阴爻</div><Mono dim>断 · 柔</Mono></div>
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--ink-2)', margin: '20px 0 0' }}>
          三爻相叠成 <b style={{ color: 'var(--ink)' }}>八卦</b>，六爻相叠成 <b style={{ color: 'var(--ink)' }}>六十四卦</b>。星图中点亮的节点即各家经典——<b style={{ color: 'var(--ink)' }}>《易经》</b>居核心，向道、儒、佛辐射。点节点即可入读。
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
          <button onClick={() => onClose(true)} style={{ border: 'none', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>不再显示</button>
          <button onClick={() => onClose(false)} style={{ border: 'none', background: 'var(--accent)', color: '#fff', borderRadius: 999, padding: '11px 30px', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: 15 }}>开始探索</button>
        </div>
      </div>
    </div>
  );
}
