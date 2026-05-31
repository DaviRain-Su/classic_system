// src/components/atlas/learn/widgets/SixSchools.tsx
//
// 4.2「易学六宗」交互件：两派六宗矩阵。点击任一宗，查看代表人物、
// 方法、关键词与读易倾向。

import { useState } from "react";
import { T, muted, card } from "./_glyph";

type Side = "象数" | "义理";

const SCHOOLS: {
  side: Side;
  name: string;
  figures: string;
  method: string;
  keywords: string[];
  note: string;
}[] = [
  {
    side: "象数",
    name: "占卜宗",
    figures: "《左传》筮例",
    method: "以筮得卦，据卦爻辞断吉凶。",
    keywords: ["筮法", "卦爻辞", "吉凶"],
    note: "最接近《易》作为占筮书的原始功能。",
  },
  {
    side: "象数",
    name: "禨祥宗",
    figures: "京房 · 易纬",
    method: "以卦气、灾异、天人感应推验时变。",
    keywords: ["卦气", "灾异", "天人感应"],
    note: "把卦象接到天象、灾祥与政治得失上。",
  },
  {
    side: "象数",
    name: "造化宗",
    figures: "陈抟 · 邵雍",
    method: "以图书、先天图、数理结构推天道生成。",
    keywords: ["图书", "先天图", "加一倍法"],
    note: "重在宇宙生成与结构秩序，是本讲堂图形化最容易承接的一支。",
  },
  {
    side: "义理",
    name: "老庄宗",
    figures: "王弼 · 韩康伯",
    method: "以玄理释易，得意忘象，重本体与通变。",
    keywords: ["玄理", "得意忘象", "无"],
    note: "不拘泥象数，追问卦爻背后的抽象义理。",
  },
  {
    side: "义理",
    name: "儒理宗",
    figures: "胡瑗 · 程颐",
    method: "以儒家伦理、君臣进退、修身处世解释卦爻。",
    keywords: ["修身", "君臣", "进退"],
    note: "宋明以后影响极大，适合把《易》读成人事与德性的书。",
  },
  {
    side: "义理",
    name: "史事宗",
    figures: "李光 · 杨万里",
    method: "引历史事例证卦义，以史事明易理。",
    keywords: ["史证", "事例", "鉴戒"],
    note: "把抽象卦义落回具体历史，强在可感、可证。",
  },
];

export function SixSchools() {
  const [selected, setSelected] = useState(SCHOOLS[2]);

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {(["象数", "义理"] as Side[]).map((side) => (
          <section key={side} style={{ ...card, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{side}一派</div>
              <div style={{ fontFamily: T.mono, fontSize: 11, ...muted() }}>
                {side === "象数" ? "占卜 · 禨祥 · 造化" : "老庄 · 儒理 · 史事"}
              </div>
            </div>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {SCHOOLS.filter((s) => s.side === side).map((school) => {
                const on = selected.name === school.name;
                return (
                  <button key={school.name} onClick={() => setSelected(school)} style={{
                    border: `1px solid ${on ? T.accent : T.line}`,
                    background: on ? T.soft : "transparent",
                    color: T.ink,
                    borderRadius: 7,
                    padding: "10px 11px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: T.serif,
                  }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{school.name}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 10.5, color: on ? T.accent : T.ink, opacity: on ? 1 : 0.45 }}>{school.side}</span>
                    </span>
                    <span style={{ display: "block", fontSize: 12.5, lineHeight: 1.55, marginTop: 4, ...muted() }}>
                      {school.method}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 14, borderRadius: 8, border: `1px solid ${T.accent}`, background: T.soft, padding: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 9 }}>
          <div style={{ fontSize: 19, fontWeight: 700 }}>{selected.name}</div>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.accent }}>{selected.side} · {selected.figures}</div>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.75 }}>{selected.method}</p>
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
          {selected.keywords.map((kw) => (
            <span key={kw} style={{
              border: `1px solid ${T.line}`,
              background: T.surface,
              borderRadius: 999,
              padding: "3px 9px",
              fontSize: 12,
            }}>{kw}</span>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.65, ...muted() }}>{selected.note}</div>
      </div>
    </div>
  );
}
