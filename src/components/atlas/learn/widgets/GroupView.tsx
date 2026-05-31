// src/components/atlas/learn/widgets/GroupView.tsx
//
// 5.3「易与数：群论视角」交互件：取一卦，看其 6 个邻卦（翻一爻，汉明距离 1）
//   与错卦（六爻全反，距离 6 = 超立方对径点）。直指 Cube.tsx 所画的 Cayley 图。
//
// 复用 _glyph.tsx（§3.1）：爻序【自下而上】 index 0 = 初爻。

import { useState } from "react";
import { T, muted, card, Gua, nameOf, type Hex, type Line } from "./_glyph";

const POS = ["初", "二", "三", "四", "五", "上"];
const flip = (l: Hex, i: number): Hex => l.map((v, k) => (k === i ? ((v ? 0 : 1) as Line) : v)) as Hex;
const invert = (l: Hex): Hex => l.map((v) => (v ? 0 : 1) as Line) as Hex;

const PRESETS: [string, Hex][] = [
  ["既济", [1, 0, 1, 0, 1, 0]],
  ["乾", [1, 1, 1, 1, 1, 1]],
  ["谦", [0, 0, 1, 0, 0, 0]],
];

export function GroupView() {
  const [base, setBase] = useState<Hex>([1, 0, 1, 0, 1, 0]);
  const inv = invert(base);

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {PRESETS.map(([n, l]) => (
          <button key={n} onClick={() => setBase(l)} style={{
            padding: "2px 10px", fontSize: 13, borderRadius: 4, cursor: "pointer",
            border: `1px solid ${T.line}`, background: "transparent", color: T.ink, fontFamily: T.serif,
          }}>{n}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
        <Gua lines={base} w={110} />
        <span style={{ marginTop: 8, fontSize: 13, padding: "2px 8px", borderRadius: 4, background: T.seal, color: T.paper, fontFamily: T.mono }}>
          {nameOf(base)} · {base.join("")}
        </span>
      </div>

      <div style={{ fontSize: 12, color: T.accent, marginBottom: 8 }}>翻一爻 → 6 个邻卦（汉明距离 = 1）</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const nb = flip(base, i);
          return (
            <div key={i} style={{ ...card, padding: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Gua lines={nb} w={44} h={6} />
              <span style={{ fontSize: 12, marginTop: 6 }}>{nameOf(nb)}</span>
              <span style={{ fontSize: 11, ...muted() }}>翻{POS[i]}爻</span>
            </div>
          );
        })}
      </div>

      <div style={{ borderRadius: 8, padding: 12, fontSize: 13, background: T.accent, color: T.paper }}>
        错卦（六爻全反 · 加 111111 · 距离 6 · 超立方对径点）：<b>{nameOf(inv)}</b>
        <div style={{ fontSize: 11, marginTop: 4, opacity: 0.85, fontFamily: T.mono }}>64 卦 ≅ (ℤ/2)⁶ —— 此即 Cube.tsx 所画的 Cayley 图</div>
      </div>
    </div>
  );
}
