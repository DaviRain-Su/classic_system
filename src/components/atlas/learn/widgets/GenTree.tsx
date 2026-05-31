// src/components/atlas/learn/widgets/GenTree.tsx
// 1.2 加一倍法：两仪 → 四象 → 八卦 的倍增生成。
import { useState } from "react";
import { T, muted, card, Yao, TRI, type Line } from "./_glyph";

export function GenTree() {
  const [k, setK] = useState(3);
  let combos: Line[][] = [[]];
  for (let s = 0; s < k; s++) combos = combos.flatMap((c) => [[...c, 1] as Line[], [...c, 0] as Line[]]);
  const label: Record<number, string> = { 1: "两仪", 2: "四象", 3: "八卦" };

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[1, 2, 3].map((s) => (
          <button key={s} onClick={() => setK(s)} style={{
            padding: "4px 12px", fontSize: 14, borderRadius: 999, cursor: "pointer",
            border: `1px solid ${k === s ? T.accent : T.line}`,
            background: k === s ? T.accent : "transparent", color: k === s ? T.paper : T.ink, fontFamily: T.serif,
          }}>{label[s]}（{2 ** s}）</button>
        ))}
      </div>
      <div style={{ ...card, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {combos.map((c, idx) => {
          const key = c.join("");
          return (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[...c].reverse().map((b, j) => <Yao key={j} yang={b === 1} w={36} h={8} />)}
              </div>
              {k === 3 && <span style={{ fontSize: 12, color: T.accent }}>{TRI[key].n}{TRI[key].s}</span>}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12, marginTop: 12, ...muted() }}>
        每一爻之上再判一次阴阳，数目随之倍增：2 → 4 → 8 → … → 64。这正是二进制的展开（n 爻 = 2ⁿ 种）。
      </p>
    </div>
  );
}
