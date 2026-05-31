// src/components/atlas/learn/widgets/XiangshuYili.tsx
//
// 4.1「象数与义理：两派」交互件：同一卦在两条解释路径中的读法对照。
// 爻序沿用 _glyph.tsx：自下而上，index 0 = 初爻。

import { useState } from "react";
import { T, muted, card, Gua, type Hex } from "./_glyph";

type Track = "象数" | "义理";

const TAI: Hex = [1, 1, 1, 0, 0, 0];

const FIGURES: {
  name: string;
  age: string;
  track: Track;
  method: string;
  focus: string;
  example: string;
}[] = [
  {
    name: "京房",
    age: "西汉",
    track: "象数",
    method: "纳甲、卦气、灾异",
    focus: "以卦象、爻位、时令推演天道变化。",
    example: "问泰卦，先看阴阳升降、内外二体、消息进退。",
  },
  {
    name: "邵雍",
    age: "北宋",
    track: "象数",
    method: "先天图、加一倍法",
    focus: "以数理生成卦序，把六十四卦放进圆方结构。",
    example: "问泰卦，可看其在先天图中的对待、消长与序位。",
  },
  {
    name: "王弼",
    age: "魏晋",
    track: "义理",
    method: "得意忘象",
    focus: "不滞于象数，直取卦爻背后的人事之理。",
    example: "问泰卦，重在「通」：上下交而志同，亨通来自秩序相交。",
  },
  {
    name: "程颐",
    age: "北宋",
    track: "义理",
    method: "以儒理释易",
    focus: "借卦爻明君臣、进退、修身、处世之理。",
    example: "问泰卦，重在君子处通泰时如何裁成辅相、守中防否。",
  },
];

export function XiangshuYili() {
  const [sel, setSel] = useState(FIGURES[0]);

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "stretch" }}>
        <div style={{ ...card, flex: "0 1 210px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Gua lines={TAI} w={112} />
          <div style={{ marginTop: 10, fontWeight: 700, fontSize: 18 }}>地天泰</div>
          <div style={{ marginTop: 4, fontFamily: T.mono, fontSize: 11, ...muted() }}>同一卦 · 两种读法</div>
        </div>

        <div style={{ flex: "1 1 360px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <Lane
            title="象数"
            sub="先问：象如何成？数如何变？"
            active={sel.track === "象数"}
            items={FIGURES.filter((f) => f.track === "象数")}
            selected={sel.name}
            onSelect={(name) => setSel(FIGURES.find((f) => f.name === name) ?? FIGURES[0])}
          />
          <Lane
            title="义理"
            sub="再问：此象寓何人事之理？"
            active={sel.track === "义理"}
            items={FIGURES.filter((f) => f.track === "义理")}
            selected={sel.name}
            onSelect={(name) => setSel(FIGURES.find((f) => f.name === name) ?? FIGURES[0])}
          />
        </div>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
        <div style={{ ...card, borderColor: sel.track === "象数" ? T.accent : T.line }}>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.accent }}>所选易家</div>
          <div style={{ marginTop: 4, fontSize: 18, fontWeight: 700 }}>{sel.name} <span style={{ fontSize: 12, fontWeight: 400, ...muted() }}>{sel.age}</span></div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.65 }}>{sel.method}</div>
          <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.65, ...muted() }}>{sel.focus}</div>
        </div>
        <div style={{ ...card, background: T.soft }}>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.accent }}>读泰卦示例</div>
          <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.75 }}>{sel.example}</div>
          <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.6, ...muted() }}>
            象数给出结构骨架，义理给出人事落点；偏废其一，就会或流于术数，或流于空谈。
          </div>
        </div>
      </div>
    </div>
  );
}

function Lane({
  title,
  sub,
  active,
  items,
  selected,
  onSelect,
}: {
  title: Track;
  sub: string;
  active: boolean;
  items: typeof FIGURES;
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div style={{
      border: `1px solid ${active ? T.accent : T.line}`,
      background: active ? T.soft : T.surface,
      borderRadius: 8,
      padding: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
        <div style={{ fontFamily: T.mono, fontSize: 11, ...muted() }}>{sub}</div>
      </div>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", gap: 8 }}>
        {items.map((item) => {
          const on = selected === item.name;
          return (
            <button key={item.name} onClick={() => onSelect(item.name)} style={{
              border: `1px solid ${on ? T.accent : T.line}`,
              background: on ? T.accent : "transparent",
              color: on ? T.paper : T.ink,
              borderRadius: 7,
              padding: "9px 10px",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: T.serif,
            }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>{item.name}</span>
              <span style={{ display: "block", fontSize: 11, marginTop: 2, opacity: on ? 0.86 : 0.56 }}>{item.method}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
