# 讲解层集成交接文档 · `classic_system`

用途：把「易学讲堂」讲解层并入现有 Astro + React 仓库。本文件本身即可作为 Claude Code 的任务说明——保存为 `docs/learn-layer.md` 提交，或整段粘进 Claude Code 后执行。后续每一课的组件源码与数据，按本契约追加即可，无需改动结构。

## 0 · 目标

在不改动现有「星图 / 卷轴 / 卦阵 / 立体图」的前提下，新增一条讲解主线：五单元、若干课，每课为「融合式交互课」——讲解文（脚手架）+ 可操作对象（核心）+ 随堂练（即时反馈），带目录、进度、翻页。

## 1 · 文件落点（贴合现有 `src/components/atlas/`）

```
src/components/atlas/learn/
├─ types.ts          # Lesson / Module / Block / QuizItem 类型
├─ curriculum.ts     # 课程数据（单元→课），讲解文与题目都在此
├─ Block.tsx         # 讲解内容块渲染（p/h/q/note/list/table）
├─ Quiz.tsx          # 即时判分单选题
├─ LearnApp.tsx      # 讲堂外壳：目录 + 进度 + 翻页
├─ index.ts          # export { LearnApp }
└─ widgets/          # 各课交互件（一课一文件）
   ├─ YinYangFlux.tsx   # 1.1 阴阳消长（十二消息卦滑块）
   ├─ GenTree.tsx       # 1.2 加一倍法
   ├─ BaguaRef.tsx      # 1.3 八卦取象
   ├─ ChongGua.tsx      # 1.4 重卦 / 内外二体
   ├─ Grammar.tsx       # 2.x 解卦语法
   ├─ TextLayers.tsx    # 3.1 文本结构
   ├─ XiangshuYili.tsx  # 4.1 象数 / 义理双轨对照
   ├─ SixSchools.tsx    # 4.2 两派六宗矩阵
   ├─ TransformLab.tsx  # 5.1 错 / 综 / 互 / 交变换实验台
   ├─ SequencePairs.tsx # 5.2 今本卦序「非覆即变」
   └─ GroupView.tsx     # 5.3 群论 / 邻卦错卦
```

挂载：在 `src/components/atlas/App.tsx` 的画面枚举里加 `learn` 视图，从星图「易经」核心节点加入口；沿用现有 `view-enter` 转场、`Esc`/「‹ 星图」返回、`localStorage` 记忆当前画面。

## 2 · 数据契约（`types.ts`）

```ts
export type Block =
  | { t: "h"; x: string }
  | { t: "p"; x: string }
  | { t: "q"; x: string; src?: string }      // 经典引文 + 出处
  | { t: "note"; x: string }                  // 接入点 / 提示
  | { t: "list"; x: string[] }
  | { t: "table"; head: string[]; rows: string[][] };

export interface QuizItem { q: string; opts: string[]; ans: number; fb: string; }

export interface Lesson {
  id: string;            // "1.1"
  title: string;
  objective: string;     // 本课目标
  body: Block[];         // 讲解文（脚手架，尽量短）
  widget?: string;       // widgets/ 中的注册键，如 "YinYangFlux"
  quizzes?: QuizItem[];  // 随堂练
  links?: { label: string; to: string }[]; // 关联跳转 chip（接现有机制）
}

export interface Module { id: string; title: string; sub: string; lessons: Lesson[]; }
```

`curriculum.ts` 导出 `export const CURRICULUM: Module[] = [...]`。Widget 以注册表解耦：

```ts
// LearnApp 内
import * as W from "./widgets";
const REGISTRY: Record<string, React.FC> = { YinYangFlux: W.YinYangFlux, GenTree: W.GenTree, /* … */ };
```

## 3 · 移植规则（把我提供的 artifact 源码改造成仓库件）

我每课给出的源码是 artifact 沙箱版（单文件、JS、Tailwind 原子类、自带数据副本）。集成时 agent 须按以下规则改造，不要原样照抄：

1. **复用、勿重复数据。** artifact 内自带的 `TRI`（八卦表）、`N64`（六十四卦名）、`Yao`/`Gua`（爻/卦渲染）均与现有 `data.ts` / `hex.ts` / `primitives.tsx` 重合 —— 删除副本，改为从既有模块 import 等价物（agent 自行在仓库中定位对应导出）。
2. ⚠️ **爻序转换（头号坑）。** 仓库约定自上而下存储（index 0 = 上爻）；而我的 artifact 用自下而上（index 0 = 初爻）。复用 `hex.ts` 助手时必须做一次 reverse 适配；若各 widget 保持自带的自下而上局部约定，则在文件顶部注释标明，且不与 `hex.ts` 混用同一数组。二者择一，全程一致。
3. **样式令牌化。** 把 artifact 里的内联十六进制色（`#f7f6f4` 暖白 / `#1b1b19` 浓墨 / `#3a5f5a` 青瓷 / `#9c3a2f` 朱砂）替换为 `global.css` 里既有的设计令牌（CSS 变量），随深色主题切换。若仓库未引入 Tailwind，则把原子类改写为现有 CSS 方案（先确认 `package.json` 是否含 tailwind）。
4. **进度走 `progress.ts`。** LearnApp 的「已完成」状态用现有进度 hook，与星图「已读 N · 收藏 M」打通，勿用组件内 `useState` 临时态。
5. **字体。** 标题 `Ma Shan Zheng`，正文 `Noto Serif SC`，系统标签 `Space Mono`——沿用现有设定，勿在组件内重声明。
6. **关联跳转。** `links` 字段渲染为现有的 `⟿ 关联 chip`，`to` 指向对应画面（如 5.3 → 立体图 `Cube`，1.2 → 皇极经世）。

## 4 · 验收标准

* `pnpm check` 通过（Astro + TS 类型）。
* `pnpm verify` 通过（八卦/64卦模式互异、错综交对合等结构自检不被破坏）。
* `pnpm dev` 下「易经」节点可进入讲堂；目录、进度、翻页、随堂练判分、各 widget 交互均正常；深色主题与四主色切换不破版。
* 新增代码不触动既有画面行为；爻序在全仓库保持一致。
* `GITHUB_PAGES=true pnpm build` 子路径构建正常。

## 5 · 增量协议（后续每一课）

每当收到新一课的「组件源码 + 数据」：

1. 组件按 §3 改造后置于 `widgets/<Name>.tsx`，在注册表登记键。
2. 该课的 `Lesson` 对象（含 `objective` / `body` / `widget` / `quizzes` / `links`）追加进 `curriculum.ts` 对应单元。
3. 跑 §4 验收。

结构不变，只增不改——这就是"直接吃进去"的前提。

## 6 · 给 Claude Code 的起手任务（可直接粘贴）

阅读 `docs/learn-layer.md`。在 `src/components/atlas/learn/` 下按其文件落点与数据契约（§1、§2）搭建讲解层骨架：`types.ts`、空的 `curriculum.ts`（仅含五个单元的空壳）、`Block.tsx`、`Quiz.tsx`、`LearnApp.tsx`、`widgets/index.ts` 与注册表、`index.ts`；并在 `App.tsx` 加 `learn` 视图与星图入口，沿用既有转场/返回/记忆。先不填课程内容，确保 `pnpm check` 通过、空讲堂能进出。随后我会逐课提供 widget 源码与 Lesson 数据，你按 §3 移植、§5 追加。遇到爻序（§3.2）或 Tailwind（§3.3）相关歧义时，先在仓库中核对现有约定再决定，并在 PR 描述里说明所做的适配。

---

完成后，每课我在这里产出，你只需把那一段交给同一个 Claude Code 会话："按 docs/learn-layer.md §5 追加这一课。"
