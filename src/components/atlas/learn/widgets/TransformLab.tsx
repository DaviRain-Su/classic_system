// src/components/atlas/learn/widgets/TransformLab.tsx
//
// 5.1「错综复杂：四种变换」交互件：选一卦，实时观察错、综、互、交四种
// 关系。爻序沿用 _glyph.tsx：自下而上，index 0 = 初爻。

import { useState } from "react";
import { T, muted, card, Gua, nameOf, type Hex, type Line } from "./_glyph";

type TransformKey = "cuo" | "zong" | "hu" | "jiao";

const PRESETS: [string, Hex][] = [
  ["泰", [1, 1, 1, 0, 0, 0]],
  ["否", [0, 0, 0, 1, 1, 1]],
  ["既济", [1, 0, 1, 0, 1, 0]],
  ["谦", [0, 0, 1, 0, 0, 0]],
  ["复", [1, 0, 0, 0, 0, 0]],
];

const TRANSFORMS: Record<TransformKey, {
  label: string;
  alias: string;
  hint: string;
  detail: string;
  apply: (lines: Hex) => Hex;
}> = {
  cuo: {
    label: "错卦",
    alias: "旁通",
    hint: "六爻全反",
    detail: "把每一爻阴阳互换，得到当前处境的反相镜像。",
    apply: (lines) => lines.map((v) => (v ? 0 : 1) as Line) as Hex,
  },
  zong: {
    label: "综卦",
    alias: "反对",
    hint: "上下倒置",
    detail: "把整卦上下倒看，像从对方或反向处境回望本卦。",
    apply: (lines) => lines.slice().reverse() as Hex,
  },
  hu: {
    label: "互卦",
    alias: "卦中之卦",
    hint: "取二三四五",
    detail: "取中间四爻，二三四为下卦、三四五为上卦，读出内在结构。",
    apply: (lines) => [lines[1], lines[2], lines[3], lines[2], lines[3], lines[4]] as Hex,
  },
  jiao: {
    label: "交卦",
    alias: "内外交互",
    hint: "上下卦互换",
    detail: "把下三爻与上三爻交换位置，观察内外关系互换后的卦义。",
    apply: (lines) => [...lines.slice(3, 6), ...lines.slice(0, 3)] as Hex,
  },
};

const POS = ["初", "二", "三", "四", "五", "上"];

export function TransformLab() {
  const [base, setBase] = useState<Hex>([1, 1, 1, 0, 0, 0]);
  const [active, setActive] = useState<TransformKey>("cuo");
  const transform = TRANSFORMS[active];
  const result = transform.apply(base);

  const toggleLine = (i: number) => {
    setBase((prev) => prev.map((v, k) => (k === i ? ((v ? 0 : 1) as Line) : v)) as Hex);
  };

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {PRESETS.map(([name, lines]) => (
          <button key={name} onClick={() => setBase(lines)} style={pill(false)}>
            {name}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "stretch" }}>
        <div style={{ ...card, flex: "1 1 220px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 12, color: T.accent }}>本卦</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{nameOf(base)}</div>
            </div>
            <span style={{ fontFamily: T.mono, fontSize: 12, ...muted() }}>{base.join("")}</span>
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
            <Gua lines={base} w={128} />
          </div>

          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 5 }}>
            {POS.map((p, i) => (
              <button key={p} onClick={() => toggleLine(i)} style={{
                border: `1px solid ${T.line}`,
                background: "transparent",
                color: T.ink,
                borderRadius: 5,
                padding: "4px 0",
                cursor: "pointer",
                fontFamily: T.mono,
                fontSize: 11,
              }}>{p}</button>
            ))}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12, lineHeight: 1.6, ...muted() }}>
            可直接点爻位改变本卦，再看四种关系如何重算。
          </p>
        </div>

        <div style={{ flex: "1 1 260px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {(Object.keys(TRANSFORMS) as TransformKey[]).map((key) => {
            const item = TRANSFORMS[key];
            const lines = item.apply(base);
            const on = active === key;
            return (
              <button key={key} onClick={() => setActive(key)} style={{
                ...card,
                padding: 12,
                cursor: "pointer",
                textAlign: "left",
                borderColor: on ? T.accent : T.line,
                background: on ? T.soft : T.surface,
                display: "grid",
                gridTemplateColumns: "58px 1fr auto",
                alignItems: "center",
                gap: 10,
              }}>
                <Gua lines={lines} w={44} h={6} />
                <span>
                  <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>{item.label} · {nameOf(lines)}</span>
                  <span style={{ display: "block", fontSize: 12, marginTop: 2, ...muted() }}>{item.alias} · {item.hint}</span>
                </span>
                <span style={{ fontFamily: T.mono, fontSize: 11, color: on ? T.accent : T.ink, opacity: on ? 1 : 0.45 }}>看</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 16, borderRadius: 8, border: `1px solid ${T.accent}`, background: T.soft, padding: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <div style={{ flex: "0 0 auto" }}>
            <Gua lines={base} w={58} h={7} />
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 18, color: T.accent }}>→</div>
          <div style={{ flex: "0 0 auto" }}>
            <Gua lines={result} w={58} h={7} />
          </div>
          <div style={{ minWidth: 180, flex: "1 1 220px" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {nameOf(base)} 经 {transform.label} 成 {nameOf(result)}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.65, ...muted() }}>
              {transform.detail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function pill(on: boolean) {
  return {
    padding: "3px 10px",
    fontSize: 13,
    borderRadius: 999,
    cursor: "pointer",
    border: `1px solid ${on ? T.accent : T.line}`,
    background: on ? T.accent : "transparent",
    color: on ? T.paper : T.ink,
    fontFamily: T.serif,
  };
}
