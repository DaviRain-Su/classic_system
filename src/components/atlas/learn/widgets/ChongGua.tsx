// src/components/atlas/learn/widgets/ChongGua.tsx
// 1.4 重卦 / 内外二体：择下卦(内)、上卦(外)相重，观其名、其义；泰否反直觉。
import { useState } from "react";
import { T, muted, card, Gua, TRI, nameOf, type Hex, type Line } from "./_glyph";

const KEYS = ["111", "110", "101", "100", "011", "010", "001", "000"];
const toLines = (lk: string, uk: string): Hex =>
  [...lk, ...uk].map((b) => Number(b) as Line) as Hex; // 下卦(初中上) + 上卦(四五上)

export function ChongGua() {
  const [lk, setLk] = useState("111"); // 下/内
  const [uk, setUk] = useState("000"); // 上/外
  const lines = toLines(lk, uk);
  const name = nameOf(lines);
  const note =
    name === "地天泰" ? "天(阳)居下、地(阴)居上，看似颠倒，反而通泰：阳升阴降，二气得交而生化。"
    : name === "天地否" ? "天(阳)居上、地(阴)居下，看似各安其位，反而闭塞：二气不交，故否。"
    : "下卦为内、上卦为外。卦义常藏在内外二体的关系里——勿望文生义。";

  const presets: [string, string, string][] = [["泰", "111", "000"], ["否", "000", "111"], ["既济", "101", "010"], ["未济", "010", "101"]];
  const Sel = ({ val, set, tag }: { val: string; set: (k: string) => void; tag: string }) => (
    <div style={{ marginBottom: 8 }}>
      <span style={{ fontSize: 12, ...muted(), marginRight: 8 }}>{tag}</span>
      {KEYS.map((kk) => (
        <button key={kk} onClick={() => set(kk)} style={{
          width: 30, height: 26, marginRight: 4, cursor: "pointer", borderRadius: 4,
          border: `1px solid ${val === kk ? T.accent : T.line}`,
          background: val === kk ? T.accent : T.surface, color: val === kk ? T.paper : T.ink,
        }} title={TRI[kk].n}>{TRI[kk].s}</button>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {presets.map(([n, a, b]) => (
          <button key={n} onClick={() => { setLk(a); setUk(b); }} style={{
            padding: "2px 10px", fontSize: 13, borderRadius: 4, cursor: "pointer",
            border: `1px solid ${T.line}`, background: "transparent", color: T.ink, fontFamily: T.serif,
          }}>{n}</button>
        ))}
      </div>
      <div style={{ ...card, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Gua lines={lines} w={100} />
          <span style={{ marginTop: 8, fontSize: 16, fontWeight: 700, color: T.seal }}>{name}</span>
        </div>
        <div style={{ flex: 1 }}>
          <Sel val={uk} set={setUk} tag="上卦（外）" />
          <Sel val={lk} set={setLk} tag="下卦（内）" />
          <p style={{ fontSize: 13, marginTop: 8 }}>
            上 {TRI[uk].n}（{TRI[uk].x}）· 下 {TRI[lk].n}（{TRI[lk].x}）—— {note}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 12, marginTop: 8, ...muted() }}>8×8 = 2⁶ = 64：八经卦两两相重，即得六十四别卦。</p>
    </div>
  );
}
