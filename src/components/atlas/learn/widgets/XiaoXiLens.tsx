// 5.4「十二消息卦：六维闭环」交互件。
// 把六十四卦视作 Q6 = {0,1}^6 顶点后，十二消息卦是一条 Hamming weight 单峰 12-cycle。
import { useState, type KeyboardEvent } from "react";
import { XIAOXI_HEXES, type XiaoXiKey } from "../../XiaoXiCycle";
import { T, card } from "./_glyph";

const UPPER_PATH: XiaoXiKey[] = ["kun", "fu", "lin", "tai", "dazhuang", "guai", "qian"];
const LOWER_PATH: XiaoXiKey[] = ["qian", "gou", "dun", "pi", "guan", "bo", "kun"];
const NODE_KEYS: XiaoXiKey[] = ["kun", "fu", "lin", "tai", "dazhuang", "guai", "qian", "gou", "dun", "pi", "guan", "bo"];
const OPPOSITE: Record<XiaoXiKey, XiaoXiKey> = {
  kun: "qian",
  fu: "gou",
  lin: "dun",
  tai: "pi",
  dazhuang: "guan",
  guai: "bo",
  qian: "kun",
  gou: "fu",
  dun: "lin",
  pi: "tai",
  guan: "dazhuang",
  bo: "guai",
};
const FLIP_ROWS = [
  ["坤→复", "初爻 0→1", "乾→姤", "初爻 1→0"],
  ["复→临", "二爻 0→1", "姤→遁", "二爻 1→0"],
  ["临→泰", "三爻 0→1", "遁→否", "三爻 1→0"],
  ["泰→大壮", "四爻 0→1", "否→观", "四爻 1→0"],
  ["大壮→夬", "五爻 0→1", "观→剥", "五爻 1→0"],
  ["夬→乾", "上爻 0→1", "剥→坤", "上爻 1→0"],
];
const LAYER_COUNTS = [1, 6, 15, 20, 15, 6, 1];
const LEFT = 70;
const STEP = 100;
const MID = 190;
const x = (weight: number) => LEFT + weight * STEP;
const NODE_POS: Record<XiaoXiKey, { x: number; y: number }> = {
  kun: { x: x(0), y: MID },
  fu: { x: x(1), y: 104 },
  lin: { x: x(2), y: 78 },
  tai: { x: x(3), y: 64 },
  dazhuang: { x: x(4), y: 78 },
  guai: { x: x(5), y: 104 },
  qian: { x: x(6), y: MID },
  gou: { x: x(5), y: 276 },
  dun: { x: x(4), y: 302 },
  pi: { x: x(3), y: 316 },
  guan: { x: x(2), y: 302 },
  bo: { x: x(1), y: 276 },
};

function bitString(key: XiaoXiKey) {
  return [...XIAOXI_HEXES[key].lines].reverse().join("");
}

function points(keys: XiaoXiKey[]) {
  return keys.map((key) => `${NODE_POS[key].x},${NODE_POS[key].y}`).join(" ");
}

function MiniHex({ keyName, selected }: { keyName: XiaoXiKey; selected: boolean }) {
  const lines = XIAOXI_HEXES[keyName].lines;
  const yang = selected ? T.seal : T.ink;
  const yin = selected ? T.accent : "var(--ink-2)";
  return (
    <>
      {lines.map((line, i) => {
        const y = -16 + i * 6;
        if (line === 1) return <line key={i} x1="-19" y1={y} x2="19" y2={y} stroke={yang} strokeWidth="2.4" strokeLinecap="round" />;
        return (
          <g key={i}>
            <line x1="-19" y1={y} x2="-6" y2={y} stroke={yin} strokeWidth="2.4" strokeLinecap="round" />
            <line x1="6" y1={y} x2="19" y2={y} stroke={yin} strokeWidth="2.4" strokeLinecap="round" />
          </g>
        );
      })}
    </>
  );
}

export function XiaoXiLens() {
  const [selectedKey, setSelectedKey] = useState<XiaoXiKey>("fu");
  const selected = XIAOXI_HEXES[selectedKey];
  const opposite = XIAOXI_HEXES[OPPOSITE[selectedKey]];
  const selectedBits = bitString(selectedKey);
  const handleKey = (event: KeyboardEvent<SVGGElement>, key: XiaoXiKey) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedKey(key);
    }
  };

  return (
    <div style={{ fontFamily: T.serif, color: T.ink, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...card, padding: 14 }}>
        <svg viewBox="0 0 740 420" width="100%" role="img" aria-labelledby="xiaoxi-lens-title xiaoxi-lens-desc" style={{ display: "block" }}>
          <title id="xiaoxi-lens-title">十二消息卦在六维立方体中的透镜形闭环</title>
          <desc id="xiaoxi-lens-desc">十二消息卦按汉明权重从坤单调上升到乾，再单调下降回坤，形成 Q6 上的 12-cycle。</desc>
          {LAYER_COUNTS.map((count, k) => (
            <g key={k}>
              <line x1={x(k)} y1="42" x2={x(k)} y2="350" stroke={T.line} strokeWidth="1" strokeDasharray="2 8" />
              <text x={x(k)} y="28" textAnchor="middle" style={{ fill: "var(--ink-2)", fontFamily: T.mono, fontSize: 11 }}>k={k}</text>
              <text x={x(k)} y="376" textAnchor="middle" style={{ fill: "var(--ink-2)", fontFamily: T.mono, fontSize: 11 }}>{count}点</text>
            </g>
          ))}
          <polyline points={points(UPPER_PATH)} fill="none" stroke={T.seal} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={points(LOWER_PATH)} fill="none" stroke={T.accent} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="260" y="48" textAnchor="middle" style={{ fill: T.seal, fontFamily: T.serif, fontSize: 13, fontWeight: 700 }}>息：阳爻自下而上生长</text>
          <text x="480" y="402" textAnchor="middle" style={{ fill: T.accent, fontFamily: T.serif, fontSize: 13, fontWeight: 700 }}>消：阴爻自下而上生长</text>
          <text x="370" y="188" textAnchor="middle" style={{ fill: "var(--ink-3)", fontFamily: T.mono, fontSize: 12 }}>Hamming weight: 0 → 6 → 0</text>

          {NODE_KEYS.map((key) => {
            const item = XIAOXI_HEXES[key];
            const p = NODE_POS[key];
            const selectedNode = selectedKey === key;
            return (
              <g
                key={key}
                transform={`translate(${p.x} ${p.y})`}
                role="button"
                tabIndex={0}
                aria-label={`${item.name}，权重 ${item.yang}，位串 ${bitString(key)}`}
                onClick={() => setSelectedKey(key)}
                onKeyDown={(event) => handleKey(event, key)}
                style={{ cursor: "pointer", outline: "none" }}
              >
                <circle r="42" fill={selectedNode ? T.soft : T.paper} stroke={selectedNode ? T.accent : T.line} strokeWidth={selectedNode ? "1.8" : "1.2"} />
                <MiniHex keyName={key} selected={selectedNode} />
                <text y="36" textAnchor="middle" style={{ fill: selectedNode ? T.accent : T.ink, fontFamily: T.serif, fontSize: 14, fontWeight: selectedNode ? 800 : 600 }}>{item.name}</text>
                <text y="52" textAnchor="middle" style={{ fill: "var(--ink-2)", fontFamily: T.mono, fontSize: 10 }}>{bitString(key)}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <div style={{ ...card, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>当前顶点</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 7 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: T.accent, lineHeight: 1 }}>{selected.name}</span>
            <span style={{ fontSize: 13 }}>{selected.month}</span>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: "var(--ink-3)" }}>k={selected.yang}</span>
          </div>
          <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.75, color: "var(--ink-2)" }}>
            位串按自下而上读作 <b style={{ color: T.ink }}>{selectedBits}</b>。错卦是对径点 <b style={{ color: T.ink }}>{opposite.name}</b>，二者 XOR = 111111。
          </p>
        </div>
        <div style={{ ...card, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.seal }}>单峰闭环</div>
          <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.75, color: "var(--ink-2)" }}>
            权重序列为 0,1,2,3,4,5,6,5,4,3,2,1,0。每一步只翻一爻，所以它是 Q6 上长度为 12 的图论循环。
          </p>
        </div>
      </div>

      <div style={{ ...card, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12, color: "var(--ink-3)", fontFamily: T.mono }}>
          <span>息相翻转</span>
          <span>消相翻转</span>
        </div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 6 }}>
          {FLIP_ROWS.flatMap((row) => row).map((cell, i) => (
            <div key={`${cell}-${i}`} style={{ padding: "6px 8px", borderRadius: 6, background: i % 4 < 2 ? "rgba(156,58,47,.08)" : T.soft, fontSize: 12.5, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cell}</div>
          ))}
        </div>
      </div>

      <div style={{ ...card, padding: 14, borderStyle: "dashed" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Q3 对照</div>
        <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.75, color: "var(--ink-2)" }}>
          在三爻层面，同型小循环可写作：坤(000) → 震(100) → 兑(110) → 乾(111) → 巽(011) → 艮(001) → 坤。十二消息卦就是这个结构升到六爻后的时间版本。
        </p>
      </div>
    </div>
  );
}
