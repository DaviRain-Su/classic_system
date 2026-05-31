// src/components/atlas/learn/widgets/BaguaRef.tsx
// 1.3 八卦取象：点击查看 象 / 德 / 家人 / 方位 / 五行 / 取象歌。
import { useState } from "react";
import { T, muted, card, TRI } from "./_glyph";

const ORDER = ["111", "110", "101", "100", "011", "010", "001", "000"];

export function BaguaRef() {
  const [sel, setSel] = useState("111");
  const t = TRI[sel];
  const row: { k: string; v: string }[] = [
    { k: "取象", v: t.x }, { k: "卦德", v: t.de }, { k: "家人", v: t.fam },
    { k: "五行", v: t.wx }, { k: "先天方位", v: t.wei }, { k: "取象歌", v: t.song },
  ];
  return (
    <div style={{ fontFamily: T.serif, color: T.ink, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {ORDER.map((kk) => (
          <button key={kk} onClick={() => setSel(kk)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", cursor: "pointer",
            borderRadius: 6, border: `1px solid ${sel === kk ? T.accent : T.line}`,
            background: sel === kk ? T.accent : T.surface, color: sel === kk ? T.paper : T.ink, fontFamily: T.serif,
          }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{TRI[kk].s}</span>
            <span style={{ fontSize: 14, marginTop: 4 }}>{TRI[kk].n}</span>
          </button>
        ))}
      </div>
      <div style={{ ...card, fontSize: 14 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: T.accent, marginBottom: 8 }}>{t.n} {t.s}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 6 }}>
          {row.map((r) => <span key={r.k}><span style={muted()}>{r.k}：</span>{r.v}</span>)}
        </div>
        <p style={{ fontSize: 12, marginTop: 12, ...muted() }}>「近取诸身，远取诸物」——解卦真正常用的是「卦德」。</p>
      </div>
    </div>
  );
}
