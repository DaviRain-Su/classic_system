// src/components/atlas/learn/widgets/TextLayers.tsx
//
// 3.1「一卦的文本结构」交互件：以地山谦为例，逐层开关
//   卦名 / 卦辞 / 彖传 / 大象 / 爻辞 / 小象，看一卦之文如何叠成。
//
// 复用 _glyph.tsx（§3.1）：谦卦爻序【自下而上】 index 0 = 初爻 → [0,0,1,0,0,0]（下艮上坤）。
// 经文皆公有领域《周易》文本；白话/讲解为本项目原创。

import { useState } from "react";
import { T, muted, card, Gua, type Hex } from "./_glyph";

const QIAN: Hex = [0, 0, 1, 0, 0, 0]; // 下艮(001) 上坤(000) = 地山谦

const LAYERS: { tag: string; text: string; note: string }[] = [
  { tag: "卦名", text: "谦", note: "上坤（地）下艮（山）相重之卦。山本高而屈居地下，是为谦。" },
  { tag: "卦辞", text: "谦：亨，君子有终。", note: "断一卦之大势：谦道可亨通，君子能守谦至终而获吉。" },
  { tag: "彖传", text: "天道亏盈而益谦，地道变盈而流谦……（《彖》）", note: "释卦辞之所以然——天地人鬼皆「恶盈而好谦」，故谦者受益。" },
  { tag: "大象", text: "地中有山，谦；君子以裒多益寡，称物平施。", note: "观卦象以立德行：高山藏于地下，喻君子裒多益寡、施予均平。" },
  { tag: "爻辞", text: "九三：劳谦，君子有终，吉。", note: "每爻之占。九三阳居阳位、为成卦之主，有功而能谦，故吉。" },
  { tag: "小象", text: "劳谦君子，万民服也。", note: "释爻辞：有劳而谦，故众心归服。" },
];

export function TextLayers() {
  const [on, setOn] = useState<boolean[]>(LAYERS.map(() => true));
  const toggle = (i: number) => setOn((p) => p.map((v, k) => (k === i ? !v : v)));

  return (
    <div style={{ fontFamily: T.serif, color: T.ink, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Gua lines={QIAN} w={110} />
        <span style={{ marginTop: 8, fontSize: 12, padding: "2px 8px", borderRadius: 4, background: T.seal, color: T.paper, fontFamily: T.mono }}>地山谦</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16, justifyContent: "center" }}>
          {LAYERS.map((x, i) => (
            <button key={i} onClick={() => toggle(i)} style={{
              padding: "2px 10px", fontSize: 12, borderRadius: 999, cursor: "pointer", fontFamily: T.serif,
              border: `1px solid ${on[i] ? T.accent : T.line}`,
              background: on[i] ? T.accent : "transparent", color: on[i] ? T.paper : T.ink, opacity: on[i] ? 1 : 0.6,
            }}>{x.tag}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, marginTop: 12, textAlign: "center", ...muted() }}>逐层开关，看一卦之文如何叠成。</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LAYERS.map((x, i) => on[i] && (
          <div key={i} style={card}>
            <div style={{ fontSize: 12, marginBottom: 4, color: T.accent, fontFamily: T.mono }}>{x.tag}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{x.text}</div>
            <div style={{ fontSize: 12, marginTop: 4, ...muted() }}>{x.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
