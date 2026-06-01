// src/components/atlas/learn/widgets/YinYangFlux.tsx
//
// 1.1「阴阳与爻」交互件：两个符号 / 互根 / 消长（十二消息卦）。
//
// 约定（§3.2）：本件自带【自下而上】局部爻序，index 0 = 初爻（最下）。
//   —— 自成一体，不复用 hex.ts、不与其数组混用。
//   若改用 primitives.tsx 的爻/卦组件（仓库为自上而下，index 0 = 上爻），
//   传入前需对下列 L 数组做一次 reverse。
// 样式（§3.3）：纯内联样式 + global.css 设计令牌（带十六进制回退）。
//   适配：本仓库无 --line / --surface，已映射为 --hair-2 / --paper-2；
//   其余 --paper/--ink/--accent/--seal/--accent-soft 与 --font-serif/--font-mono 仓库均有。

import { useState, type CSSProperties } from "react";
import { XiaoXiCycle, XIAOXI_SEQUENCE, type XiaoXiKey } from "../../XiaoXiCycle";

const T = {
  paper: "var(--paper, #f7f6f4)",
  ink: "var(--ink, #1b1b19)",
  accent: "var(--accent, #3a5f5a)", // 青瓷绿 · 主强调
  seal: "var(--seal, #9c3a2f)", // 朱砂 · 阳爻/印章/极点
  soft: "var(--accent-soft, #eef1f0)",
  line: "var(--hair-2, #d3cec2)",
  surface: "var(--paper-2, #fdfcfa)",
  serif: "var(--font-serif, 'Noto Serif SC', serif)",
  mono: "var(--font-mono, 'Space Mono', monospace)",
};
const muted = (c: string = T.ink) => ({ color: c, opacity: 0.55 });

type Line = 0 | 1;
type Hex = [Line, Line, Line, Line, Line, Line]; // index 0 = 初爻

function Yao({ yang, w = 150, h = 12, color }: { yang: boolean; w?: number; h?: number; color?: string }) {
  const c = color ?? (yang ? T.seal : T.ink);
  if (yang) return <div style={{ height: h, width: w, background: c, borderRadius: 2 }} />;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: w }}>
      <div style={{ height: h, width: "42%", background: c, borderRadius: 2 }} />
      <div style={{ height: h, width: "42%", background: c, borderRadius: 2 }} />
    </div>
  );
}
function Gua({ lines, w = 110, h = 11 }: { lines: Hex; w?: number; h?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {[5, 4, 3, 2, 1, 0].map((i) => (
        <Yao key={i} yang={lines[i] === 1} w={w} h={h} />
      ))}
    </div>
  );
}

// 十二消息卦（自下而上；index 0 = 初爻）
const MSG: { n: string; y: number; L: Hex; m: string }[] = [
  { n: "复", y: 1, L: [1, 0, 0, 0, 0, 0], m: "十一月·子" },
  { n: "临", y: 2, L: [1, 1, 0, 0, 0, 0], m: "十二月·丑" },
  { n: "泰", y: 3, L: [1, 1, 1, 0, 0, 0], m: "正月·寅" },
  { n: "大壮", y: 4, L: [1, 1, 1, 1, 0, 0], m: "二月·卯" },
  { n: "夬", y: 5, L: [1, 1, 1, 1, 1, 0], m: "三月·辰" },
  { n: "乾", y: 6, L: [1, 1, 1, 1, 1, 1], m: "四月·巳" },
  { n: "姤", y: 5, L: [0, 1, 1, 1, 1, 1], m: "五月·午" },
  { n: "遁", y: 4, L: [0, 0, 1, 1, 1, 1], m: "六月·未" },
  { n: "否", y: 3, L: [0, 0, 0, 1, 1, 1], m: "七月·申" },
  { n: "观", y: 2, L: [0, 0, 0, 0, 1, 1], m: "八月·酉" },
  { n: "剥", y: 1, L: [0, 0, 0, 0, 0, 1], m: "九月·戌" },
  { n: "坤", y: 0, L: [0, 0, 0, 0, 0, 0], m: "十月·亥" },
];
function caption(i: number): [string, string] {
  if (i === 0) return ["一阳来复", "阳气始生于最下一爻——剥极而复，生机自地底萌动。"];
  if (i === 5) return ["六阳满盈 · 阳极", "阳已至极。物极必反——下一刻，一阴便要自下而生。"];
  if (i === 6) return ["一阴始生", "盛极而衰之机：乾之后，姤卦一阴生于初，由此转入阳消。"];
  if (i === 11) return ["六阴满盈 · 阴极", "阴已至极，一阳将复，周而复始。阴阳从无静止。"];
  return i < 5
    ? ["阳息（阳长阴消）", "阳气自下逐爻上长，万物随之生发。"]
    : ["阳消（阴长阳消）", "阴气自下逐爻上长，万物随之收敛。"];
}

const card: CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.line}`,
  borderRadius: 8,
  padding: 16,
};

export function YinYangFlux() {
  const [yang, setYang] = useState(true);
  const [idx, setIdx] = useState(0);
  const cur = MSG[idx];
  const [capTitle, capText] = caption(idx);
  const extreme = idx === 5 || idx === 11;

  return (
    <div style={{ fontFamily: T.serif, color: T.ink, display: "flex", flexDirection: "column", gap: 28 }}>
      {/* 一 · 两个符号 */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.accent, margin: "0 0 4px" }}>一 · 两个符号</h3>
        <p style={{ fontSize: 14, margin: "0 0 12px" }}>易的全部符号，最终只用两个记号。点一下，让它在阴阳间翻转——</p>
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 24 }}>
          <button
            onClick={() => setYang(!yang)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", background: "none", border: "none", padding: 0 }}
          >
            <Yao yang={yang} w={120} color={yang ? T.seal : T.ink} />
            <span style={{ fontSize: 12, ...muted() }}>点击翻转</span>
          </button>
          <div style={{ fontSize: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: yang ? T.seal : T.ink }}>{yang ? "阳爻 ⚊" : "阴爻 ⚋"}</div>
            <div style={{ marginTop: 4, ...muted() }}>{yang ? "实 · 刚 · 动 · 奇 · 明 · 进" : "虚 · 柔 · 静 · 偶 · 暗 · 退"}</div>
          </div>
        </div>
        <p style={{ fontSize: 12, marginTop: 8, ...muted() }}>※ 阴阳不是「好/坏」，而是互补的两种态势——且时时相互转化（见第三节）。</p>
      </section>

      {/* 二 · 互根 */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.accent, margin: "0 0 4px" }}>二 · 互根</h3>
        <p style={{ fontSize: 14, margin: "0 0 12px" }}>「孤阴不生，独阳不长。」阳中有阴、阴中有阳——太极图的两枚鱼眼，正画此意。</p>
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 20 }}>
          <svg viewBox="0 0 200 200" width={120} height={120} aria-label="太极图">
            <circle cx="100" cy="100" r="92" fill={T.paper} stroke={T.ink} strokeWidth="3" />
            <path d="M100,8 a92,92 0 0 1 0,184 a46,46 0 0 1 0,-92 a46,46 0 0 0 0,-92 z" fill={T.ink} />
            <circle cx="100" cy="54" r="13" fill={T.ink} />
            <circle cx="100" cy="146" r="13" fill={T.paper} />
          </svg>
          <div style={{ fontSize: 14 }}>
            <div><span style={{ color: T.seal }}>●</span> 阳中之阴：极盛之阳，已含退藏之机。</div>
            <div style={{ marginTop: 4 }}><span style={{ color: T.accent }}>○</span> 阴中之阳：至静之阴，已伏生发之芽。</div>
            <div style={{ marginTop: 8, fontSize: 12, ...muted() }}>没有纯粹孤立的一极；两极互为根源。</div>
          </div>
        </div>
      </section>

      {/* 三 · 消长（核心交互） */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.accent, margin: "0 0 4px" }}>三 · 消长转化（十二消息卦）</h3>
        <p style={{ fontSize: 14, margin: "0 0 12px" }}>
          「消长转化」说的是此消彼长：阳长则阴消，阴长则阳消，六爻总数守恒。拖动滑块，看一阳如何自地底生起、逐爻盈满至乾，又如何一阴始生、逐爻退尽归坤——一年十二月的呼吸。
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
          <div style={{ ...card, padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.seal }}>息 xi</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: "5px 0 0" }}>阳爻自下而上生长：复、临、泰、大壮、夬、乾。起点是冬至的《复》，不是纯阳的《乾》。</p>
          </div>
          <div style={{ ...card, padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>消 xiao</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: "5px 0 0" }}>阳爻退去，阴爻也自下而上生长：姤、遁、否、观、剥、坤。乾是顶点，下一步即反转。</p>
          </div>
        </div>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Gua lines={cur.L} w={110} />
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{cur.n}</span>
                <div style={{ fontSize: 12, ...muted() }}>{cur.m} · {cur.y} 阳</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: extreme ? T.seal : T.accent, marginBottom: 4 }}>{capTitle}</div>
              <p style={{ fontSize: 14, margin: 0 }}>{capText}</p>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={11}
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            style={{ width: "100%", marginTop: 16, accentColor: "var(--accent, #3a5f5a)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4, ...muted() }}>
            <span>复（一阳生）</span>
            <span>乾（阳极）</span>
            <span>姤（一阴生）</span>
            <span>坤（阴极）</span>
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, color: T.ink, opacity: 0.68 }}>
              <span style={{ fontWeight: 700 }}>十二消息卦圆图</span>
              <span>点击圆图节点同步滑块</span>
            </div>
            <div style={{ maxWidth: 520, margin: "8px auto 0" }}>
              <XiaoXiCycle
                selectedKey={XIAOXI_SEQUENCE[idx] ?? "fu"}
                compact
                onSelect={(key: XiaoXiKey) => {
                  const next = XIAOXI_SEQUENCE.indexOf(key);
                  if (next >= 0) setIdx(next);
                }}
              />
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, marginTop: 8, ...muted() }}>※「一阴一阳之谓道」——道不是阴、也不是阳，而是这「一来一往」本身。</p>
      </section>
    </div>
  );
}
