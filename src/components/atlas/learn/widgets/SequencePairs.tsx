// src/components/atlas/learn/widgets/SequencePairs.tsx
//
// 5.2「序卦与卦序」交互件：把今本六十四卦按 1-2、3-4……两两成组，
// 现场标出「非覆即变」。此件复用 hex.ts（自上而下）计算关系，渲染时
// reverse 成 _glyph.tsx 的自下而上爻序。

import { useMemo, useState } from "react";
import { HEX_NAMES, hexInfo, relatives, type HexInfo } from "../../hex";
import { T, muted, card, Gua, type Hex } from "./_glyph";
import type { TrigramKey } from "../../data";

type PairKind = "覆" | "变" | "兼";

interface Pair {
  a: HexInfo;
  b: HexInfo;
  kind: PairKind;
  note: string;
}

const toGlyphLines = (lines: number[]): Hex => lines.slice().reverse() as Hex;

const ALL_HEX = Object.entries(HEX_NAMES)
  .flatMap(([upper, lowers]) => Object.keys(lowers).map((lower) => hexInfo(upper as TrigramKey, lower as TrigramKey)))
  .sort((a, b) => a.num - b.num);

const PAIRS: Pair[] = Array.from({ length: 32 }, (_, i) => {
  const a = ALL_HEX[i * 2];
  const b = ALL_HEX[i * 2 + 1];
  const rel = relatives(a.lines);
  const isZong = rel.zong.num === b.num;
  const isCuo = rel.cuo.num === b.num;
  const kind: PairKind = isZong && isCuo ? "兼" : isZong ? "覆" : "变";
  return {
    a,
    b,
    kind,
    note: kind === "覆"
      ? "上下倒置而成对：同一结构换了方向。"
      : kind === "变"
        ? "六爻全反而成对：阴阳互换，势成反相。"
        : "既可倒置亦可全反，属于高度对称的一组。",
  };
});

const KIND_STYLE: Record<PairKind, { label: string; color: string; bg: string }> = {
  覆: { label: "覆 · 综卦", color: T.accent, bg: T.soft },
  变: { label: "变 · 错卦", color: T.seal, bg: "rgba(156,58,47,0.10)" },
  兼: { label: "覆变皆通", color: T.ink, bg: T.surface },
};

export function SequencePairs() {
  const [filter, setFilter] = useState<PairKind | "all">("all");
  const [selected, setSelected] = useState(0);
  const visible = useMemo(() => PAIRS.filter((p) => filter === "all" || p.kind === filter), [filter]);
  const pair = PAIRS[selected] ?? PAIRS[0];
  const counts = useMemo(() => PAIRS.reduce<Record<PairKind, number>>((acc, p) => {
    acc[p.kind] += 1;
    return acc;
  }, { 覆: 0, 变: 0, 兼: 0 }), []);

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 14 }}>
        {(["all", "覆", "变"] as const).map((k) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            border: `1px solid ${filter === k ? T.accent : T.line}`,
            background: filter === k ? T.accent : "transparent",
            color: filter === k ? T.paper : T.ink,
            borderRadius: 999,
            padding: "4px 11px",
            cursor: "pointer",
            fontFamily: T.serif,
            fontSize: 12.5,
          }}>
            {k === "all" ? "全部成对" : k === "覆" ? `覆 ${counts.覆}` : `变 ${counts.变}`}
          </button>
        ))}
        <span style={{ fontFamily: T.mono, fontSize: 11, ...muted() }}>
          今本卦序：32 组 · 非覆即变
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))", gap: 7, maxHeight: 198, overflowY: "auto", paddingRight: 3 }}>
          {visible.map((p) => {
            const idx = PAIRS.indexOf(p);
            const on = selected === idx;
            const style = KIND_STYLE[p.kind];
            return (
              <button key={p.a.num} onClick={() => setSelected(idx)} style={{
                border: `1px solid ${on ? style.color : T.line}`,
                background: on ? style.bg : T.surface,
                color: T.ink,
                borderRadius: 7,
                padding: "7px 8px",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: T.serif,
              }}>
                <span style={{ display: "block", fontFamily: T.mono, fontSize: 11, color: style.color }}>
                  {p.a.num}-{p.b.num} · {p.kind}
                </span>
                <span style={{ display: "block", fontSize: 12.5, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {shortName(p.a.name)} / {shortName(p.b.name)}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", background: KIND_STYLE[pair.kind].bg, borderBottom: `1px solid ${T.line}` }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: KIND_STYLE[pair.kind].color }}>
              第 {pair.a.num}-{pair.b.num} 卦 · {KIND_STYLE[pair.kind].label}
            </span>
            <div style={{ marginTop: 4, fontSize: 15, fontWeight: 700 }}>
              {pair.a.name} 与 {pair.b.name}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 22, padding: 18 }}>
            <HexCard h={pair.a} />
            <div style={{ textAlign: "center", minWidth: 96 }}>
              <div style={{ fontFamily: T.mono, fontSize: 24, color: KIND_STYLE[pair.kind].color }}>
                {pair.kind === "覆" ? "↕" : "↔"}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: KIND_STYLE[pair.kind].color }}>
                {KIND_STYLE[pair.kind].label}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.6, marginTop: 4, ...muted() }}>
                {pair.note}
              </div>
            </div>
            <HexCard h={pair.b} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HexCard({ h }: { h: HexInfo }) {
  return (
    <div style={{ minWidth: 138, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Gua lines={toGlyphLines(h.lines)} w={86} h={8} />
      <div style={{ marginTop: 9, fontSize: 15, fontWeight: 700 }}>{h.name}</div>
      <div style={{ fontFamily: T.mono, fontSize: 11, marginTop: 2, ...muted() }}>第 {h.num} 卦</div>
    </div>
  );
}

function shortName(name: string) {
  return name.length > 3 ? name.slice(-1) : name;
}
