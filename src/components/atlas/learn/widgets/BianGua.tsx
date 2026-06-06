// src/components/atlas/learn/widgets/BianGua.tsx
//
// 5.5「变卦 · 动爻与之卦」交互件：讲 → 玩 → 测 三联。
// 选一卦，实时观察错 / 综 / 互 / 变四种映射；其中「变」由动爻位决定，
// 本卦经动爻一变即「之卦」——占筮里最实用的一步。下半场是自适应预测练习：
// 先把答案爻摆出来，再验算，系统专攻你最弱的那一种变换。
//
// 爻序沿用 _glyph.tsx：自下而上，index 0 = 初爻（与 hex.ts 的自上而下相反，勿混用）。
// 这四个变换全是 (ℤ/2)⁶ 上的纯映射，故无需后端、无需 LLM，纯客户端确定性引擎。

import { useCallback, useMemo, useState } from "react";
import {
  T, muted, Yao, triKey, TRI, nameOf,
  type Hex, type Line,
} from "./_glyph";

type Lens = "错" | "综" | "互" | "变";
type Accent = "accent" | "seal";

const lowerTRI = (L: Hex) => TRI[triKey(L[0], L[1], L[2])];
const upperTRI = (L: Hex) => TRI[triKey(L[3], L[4], L[5])];

const TRANSFORMS: Record<Lens, {
  label: string;
  gloss: string;
  accent: Accent;
  fn: (L: Hex, p?: number) => Hex;
}> = {
  错: { label: "错卦", gloss: "六爻阴阳全反 — 一卦之背面", accent: "seal",
        fn: (L) => L.map((v) => (v ^ 1) as Line) as Hex },
  综: { label: "综卦", gloss: "整卦上下翻转 — 换个立场看同一件事", accent: "accent",
        fn: (L) => [...L].reverse() as Hex },
  互: { label: "互卦", gloss: "取二三四爻为下卦、三四五爻为上卦 — 藏在内部的卦", accent: "accent",
        fn: (L) => [L[1], L[2], L[3], L[2], L[3], L[4]] as Hex },
  变: { label: "变卦", gloss: "单一动爻变 → 之卦 — 一念之转的去向", accent: "seal",
        fn: (L, p = 0) => { const c = [...L] as Hex; c[p] = (c[p] ^ 1) as Line; return c; } },
};

const POS = ["初", "二", "三", "四", "五", "上"]; // 爻位名（自下而上）
const QUIZ_LENSES: Lens[] = ["错", "综", "互"]; // 测验只取位置无关的三种
const randHex = (): Hex => Array.from({ length: 6 }, () => (Math.random() < 0.5 ? 1 : 0)) as Hex;

// 色调 → 设计令牌
type Tone = "ink" | "dong" | "src" | "right" | "wrong";
const toneColor = (t: Tone): string =>
  t === "dong" || t === "wrong" ? T.seal : t === "src" || t === "right" ? T.accent : T.ink;
const accentColor = (a: Accent) => (a === "seal" ? T.seal : T.accent);

// ── 一卦（自顶向下渲染，支持逐爻着色与点击）─────────────
function Hexagram({ L, tones = {}, onToggle }: {
  L: Hex;
  tones?: Record<number, Tone>;
  onToggle?: (i: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
      {[5, 4, 3, 2, 1, 0].map((i) => (
        <div key={i} onClick={onToggle ? () => onToggle(i) : undefined}
          style={{ cursor: onToggle ? "pointer" : "default" }}>
          <Yao yang={L[i] === 1} w={116} h={12} color={toneColor(tones[i] ?? "ink")} />
        </div>
      ))}
    </div>
  );
}

// 卦名牌
function NameTag({ L, accent = "ink", sub }: { L: Hex; accent?: Accent | "ink"; sub?: string }) {
  const c = accent === "seal" ? T.seal : accent === "accent" ? T.accent : T.ink;
  const up = upperTRI(L), low = lowerTRI(L);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 700, color: c, lineHeight: 1.2 }}>{nameOf(L)}</div>
      <div style={{ fontFamily: T.mono, fontSize: 11, marginTop: 4, letterSpacing: 0.5, ...muted() }}>
        {up.s} {up.n}上 · {low.s} {low.n}下
      </div>
      {sub && <div style={{ fontSize: 11, marginTop: 2, ...muted() }}>{sub}</div>}
    </div>
  );
}

interface Stat { ok: number; n: number }
type Mastery = Record<Lens, Stat>;
const weakest = (m: Mastery): Lens => {
  let best: Lens = "错", score = Infinity;
  for (const k of QUIZ_LENSES) {
    const r = m[k].n === 0 ? -1 : m[k].ok / m[k].n; // 没做过的优先
    if (r < score) { score = r; best = k; }
  }
  return best;
};

export function BianGua() {
  // 玩：本卦默认「水雷屯」—— 错/综/互三象皆异，适合演示
  const [source, setSource] = useState<Hex>([1, 0, 0, 0, 1, 0]);
  const [lens, setLens] = useState<Lens>("错");
  const [dong, setDong] = useState(0); // 变卦动爻位（仅「变」用）

  const result = useMemo(
    () => (lens === "变" ? TRANSFORMS.变.fn(source, dong) : TRANSFORMS[lens].fn(source)),
    [source, lens, dong],
  );
  const toggleSrc = useCallback(
    (i: number) => setSource((s) => { const c = [...s] as Hex; c[i] = (c[i] ^ 1) as Line; return c; }),
    [],
  );

  const Tr = TRANSFORMS[lens];
  const isFixed = result.join("") === source.join("");
  // 互卦高亮来源爻（二三四五 = idx 1..4）；变卦高亮动爻
  const srcTones: Record<number, Tone> =
    lens === "互" ? { 1: "src", 2: "src", 3: "src", 4: "src" }
    : lens === "变" ? { [dong]: "dong" }
    : {};

  // ── 测：自适应预测题 ──────────────────────────────
  const [mastery, setMastery] = useState<Mastery>({
    错: { ok: 0, n: 0 }, 综: { ok: 0, n: 0 }, 互: { ok: 0, n: 0 }, 变: { ok: 0, n: 0 },
  });
  const [q, setQ] = useState<{ source: Hex; lens: Lens; answer: Hex }>(
    () => { const s = randHex(); return { source: s, lens: "错", answer: [...s] as Hex }; },
  );
  const [checked, setChecked] = useState<
    { target: Hex; tones: Record<number, Tone>; correct: boolean; nextLens: Lens } | null
  >(null);

  const newQuestion = useCallback((m: Mastery) => {
    const s = randHex();
    setQ({ source: s, lens: weakest(m), answer: [...s] as Hex });
    setChecked(null);
  }, []);

  const toggleAns = useCallback((i: number) => {
    if (checked) return;
    setQ((cur) => { const a = [...cur.answer] as Hex; a[i] = (a[i] ^ 1) as Line; return { ...cur, answer: a }; });
  }, [checked]);

  const verify = () => {
    const target = TRANSFORMS[q.lens].fn(q.source);
    const tones: Record<number, Tone> = {};
    let correct = true;
    for (let i = 0; i < 6; i++) {
      const ok = q.answer[i] === target[i];
      tones[i] = ok ? "right" : "wrong";
      if (!ok) correct = false;
    }
    const m: Mastery = {
      ...mastery,
      [q.lens]: { ok: mastery[q.lens].ok + (correct ? 1 : 0), n: mastery[q.lens].n + 1 },
    };
    setMastery(m);
    setChecked({ target, tones, correct, nextLens: weakest(m) });
  };

  return (
    <div style={{ fontFamily: T.serif, color: T.ink }}>
      {/* ── 讲：概念选择 ── */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
        {(Object.keys(TRANSFORMS) as Lens[]).map((k) => {
          const on = k === lens;
          return (
            <button key={k} onClick={() => setLens(k)} style={{
              fontFamily: T.serif, fontSize: 18, fontWeight: 700, padding: "5px 18px", cursor: "pointer",
              border: `1px solid ${on ? T.accent : T.line}`, borderRadius: 4,
              background: on ? T.accent : "transparent", color: on ? T.paper : T.ink, transition: "all .25s",
            }}>{k}</button>
          );
        })}
      </div>
      <div style={{ textAlign: "center", fontSize: 13, minHeight: 20, marginBottom: 20, ...muted() }}>
        <b style={{ fontWeight: 700, color: T.ink }}>{Tr.label}</b> · {Tr.gloss}
      </div>

      {/* 变卦：动爻选择 */}
      {lens === "变" && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontSize: 12, marginRight: 4, ...muted() }}>动爻：</span>
          {POS.map((p, i) => (
            <button key={p} onClick={() => setDong(i)} style={{
              width: 30, height: 30, cursor: "pointer", borderRadius: "50%", fontSize: 13, transition: "all .2s",
              border: `1px solid ${dong === i ? T.seal : T.line}`,
              background: dong === i ? T.seal : "transparent", color: dong === i ? T.paper : T.ink,
            }}>{p}</button>
          ))}
        </div>
      )}

      {/* ── 玩：交互变换 ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap", marginBottom: 12 }}>
        <div>
          <Hexagram L={source} tones={srcTones} onToggle={toggleSrc} />
          <div style={{ marginTop: 14 }}><NameTag L={source} sub="本卦 · 点击爻可变阴阳" /></div>
        </div>

        <div style={{ textAlign: "center", color: T.accent, minWidth: 56 }}>
          <div style={{ fontSize: 22 }}>⟿</div>
          <div style={{ fontFamily: T.mono, fontSize: 11, marginTop: 2 }}>{Tr.label}</div>
        </div>

        <div>
          <Hexagram L={result} />
          <div style={{ marginTop: 14 }}>
            <NameTag L={result} accent={Tr.accent} sub={isFixed ? `↩ ${Tr.label}即自身` : undefined} />
          </div>
        </div>
      </div>

      {/* 动态解说句 */}
      <div style={{
        textAlign: "center", fontSize: 14, lineHeight: 1.8, color: T.ink,
        background: T.soft, border: `1px solid ${T.line}`, borderRadius: 6,
        padding: "12px 18px", margin: "8px 0 32px",
      }}>
        〈{nameOf(source)}〉的{Tr.label}是〈<b style={{ color: accentColor(Tr.accent) }}>{nameOf(result)}</b>〉
        {lens === "变" && `（${POS[dong]}爻动）`}
        {" — "}{Tr.gloss.split(" — ")[0]}。
        {isFixed && lens !== "变" && `此卦左右/内外对称，故${Tr.label}回到自身。`}
      </div>

      {/* ── 测：自适应预测 ── */}
      <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <div style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 700 }}>测 · 先推演，再验算</div>
          <div style={{ fontFamily: T.mono, fontSize: 11, ...muted() }}>
            {QUIZ_LENSES.map((k) => `${k} ${mastery[k].ok}/${mastery[k].n}`).join("　")}
          </div>
        </div>

        <div style={{ fontSize: 14, marginBottom: 16 }}>
          求本卦〈<b>{nameOf(q.source)}</b>〉的 <b style={{ color: T.accent }}>{TRANSFORMS[q.lens].label}</b>：
          <span style={muted()}> 点右侧爻位，把它摆成你认为的答案。</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <Hexagram L={q.source} />
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, ...muted() }}>本卦 {nameOf(q.source)}</div>
          </div>
          <div style={{ color: T.accent, fontSize: 20 }}>⟿</div>
          <div>
            <Hexagram L={q.answer} tones={checked ? checked.tones : {}} onToggle={toggleAns} />
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, ...muted() }}>
              {checked
                ? <>你解：{nameOf(q.answer)}　正解：<b style={{ color: T.accent }}>{nameOf(checked.target)}</b></>
                : "你的答案"}
            </div>
          </div>
        </div>

        {checked && (
          <div style={{ textAlign: "center", marginBottom: 16, fontSize: 14, color: checked.correct ? T.accent : T.seal }}>
            {checked.correct ? "○ 推演无误。" : "× 再看看变换规则 —— 朱色为错位之爻。"}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {!checked ? (
            <button onClick={verify} style={btn(T.ink)}>验算</button>
          ) : (
            <button onClick={() => newQuestion(mastery)} style={btn(T.accent)}>
              下一题 · 攻你最弱的「{checked.nextLens}」
            </button>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 26, fontFamily: T.mono, fontSize: 10, letterSpacing: 1, ...muted() }}>
        确定性映射 · 无需后端 · 64卦 ≅ (ℤ/2)⁶
      </div>
    </div>
  );
}

function btn(color: string) {
  return {
    fontFamily: T.serif, fontSize: 14, padding: "9px 22px", cursor: "pointer",
    border: `1px solid ${color}`, borderRadius: 4, background: color, color: T.paper, transition: "all .2s",
  } as const;
}
