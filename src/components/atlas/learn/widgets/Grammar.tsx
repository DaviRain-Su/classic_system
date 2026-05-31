// src/components/atlas/learn/widgets/Grammar.tsx
//
// 2.1「解卦的语法」交互件：六爻之位 / 当位 / 中·中正 / 应 / 上下卦。
// 逐步切换概念，亲手翻爻，右下角实时小结。
//
// 复用 _glyph.tsx（§3.1）：爻序【自下而上】，index 0 = 初爻——全程一致，不碰 hex.ts。

import { useState } from "react";
import { T, muted, card, Yao, TRI, nameOf, type Hex, type Line } from "./_glyph";

const POS = ["初", "二", "三", "四", "五", "上"];

const STEPS: { t: string; d: string }[] = [
  { t: "六爻之位", d: "自下而上为 初二三四五上。位是空间（下内上外）、时间（初始上终），亦含贵贱（五为君位）。读卦先问：爻在何位。" },
  { t: "当位 · 得正", d: "初三五为阳位、二四上为阴位。阳爻居阳位、阴爻居阴位为「当位」（绿）；反之失位（朱）。" },
  { t: "中 · 中正", d: "二、五为中。居中得中道；既中且当位则「中正」，乃一卦最善之爻（朱印）。" },
  { t: "应", d: "初应四、二应五、三应上。一阴一阳为有应（实线），同性为无应（虚线）。二五相应尤重。" },
  { t: "上下卦", d: "下三爻为内卦、上三爻为外卦。二经卦相重得卦名——观象之始。" },
];

const PRESETS: [string, Hex][] = [
  ["既济", [1, 0, 1, 0, 1, 0]],
  ["未济", [0, 1, 0, 1, 0, 1]],
  ["乾", [1, 1, 1, 1, 1, 1]],
  ["谦", [0, 0, 1, 0, 0, 0]],
];

function analyze(lines: Hex, i: number) {
  const yang = lines[i] === 1;
  const oddPos = i % 2 === 0; // i=0(初,第1位) 为阳位
  const dang = yang === oddPos;
  const zhong = i === 1 || i === 4;
  const partner = i < 3 ? i + 3 : i - 3;
  const ying = lines[i] !== lines[partner];
  return { yang, dang, zhong, zz: zhong && dang, partner, ying };
}

export function Grammar() {
  const [lines, setLines] = useState<Hex>([1, 0, 1, 0, 1, 0]);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<number | null>(null);

  const toggle = (i: number) => setLines((p) => p.map((v, k) => (k === i ? ((v ? 0 : 1) as Line) : v)) as Hex);
  const lower = TRI[`${lines[0]}${lines[1]}${lines[2]}`];
  const upper = TRI[`${lines[3]}${lines[4]}${lines[5]}`];
  const dangCount = lines.reduce<number>((a, _, i) => a + (analyze(lines, i).dang ? 1 : 0), 0);

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: "4px 10px", fontSize: 12, borderRadius: 999, cursor: "pointer", fontFamily: T.serif,
            border: `1px solid ${step === i ? T.accent : T.line}`,
            background: step === i ? T.accent : "transparent", color: step === i ? T.paper : T.ink,
          }}>{i + 1}·{s.t}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* 卦象 */}
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {PRESETS.map(([n, l]) => (
              <button key={n} onClick={() => { setLines(l); setSel(null); }} style={{
                padding: "2px 8px", fontSize: 12, borderRadius: 4, cursor: "pointer",
                border: `1px solid ${T.line}`, background: "transparent", color: T.ink, fontFamily: T.serif,
              }}>{n}</button>
            ))}
          </div>

          {step === 4 && <div style={{ fontSize: 12, textAlign: "center", color: T.accent, marginBottom: 4 }}>上卦（外） {upper.n}{upper.s}·{upper.x}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[5, 4, 3, 2, 1, 0].map((i) => {
              const a = analyze(lines, i);
              let col: string | undefined;
              if (step === 1) col = a.dang ? T.accent : T.seal;
              if (step === 4) col = i >= 3 ? T.accent : T.ink;
              return (
                <div key={i}>
                  {step === 4 && i === 2 && (
                    <>
                      <div style={{ height: 1, background: T.line, margin: "8px 0" }} />
                      <div style={{ fontSize: 12, textAlign: "center", color: T.accent, marginBottom: 6 }}>下卦（内） {lower.n}{lower.s}·{lower.x}</div>
                    </>
                  )}
                  <div onClick={() => { toggle(i); setSel(i); }} onMouseEnter={() => setSel(i)}
                    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <span style={{ fontSize: 12, width: 24, textAlign: "right", color: step === 0 ? T.accent : T.ink, opacity: step === 0 ? 1 : 0.55 }}>{POS[i]}</span>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <Yao yang={lines[i] === 1} color={col ?? (lines[i] === 1 ? T.seal : T.ink)} w={140} />
                    </div>
                    <span style={{ fontSize: 12, width: 56, ...muted() }}>
                      {step === 1 && <span style={{ color: a.dang ? T.accent : T.seal }}>{a.dang ? "当位" : "失位"}</span>}
                      {step === 2 && a.zhong && <span style={{ color: a.zz ? T.seal : T.accent }}>{a.zz ? "●中正" : "○中"}</span>}
                      {step === 3 && <span style={{ color: a.ying ? T.accent : T.ink }}>应{POS[a.partner]}{a.ying ? "─" : "┄"}</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: T.seal, color: T.paper, fontFamily: T.mono }}>{nameOf(lines)}</span>
          </div>
        </div>

        {/* 讲解 + 读数 + 小结 */}
        <div>
          <div style={{ ...card, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: T.accent, marginBottom: 4 }}>{step + 1} · {STEPS[step].t}</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{STEPS[step].d}</p>
          </div>

          {sel !== null && (() => {
            const a = analyze(lines, sel);
            return (
              <div style={{ ...card, marginBottom: 12, fontSize: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{POS[sel]}爻</div>
                <div>{a.yang ? "阳爻 ⚊" : "阴爻 ⚋"}，居{sel % 2 === 0 ? "阳位" : "阴位"}</div>
                <div>
                  <span style={{ color: a.dang ? T.accent : T.seal }}>{a.dang ? "当位" : "失位"}</span>
                  {a.zz && <span style={{ color: T.seal }}> · 中正</span>}
                </div>
                <div>与 {POS[a.partner]}爻 {a.ying ? <span style={{ color: T.accent }}>有应</span> : "无应"}</div>
              </div>
            );
          })()}

          <div style={{ borderRadius: 8, padding: 12, fontSize: 13, background: T.accent, color: T.paper }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{nameOf(lines)}</div>
            上{upper.n}下{lower.n} · 当位 {dangCount}/6 · 二五相应：{analyze(lines, 1).ying ? "是" : "否"}
          </div>
        </div>
      </div>
    </div>
  );
}
