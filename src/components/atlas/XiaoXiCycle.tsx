import type { KeyboardEvent } from 'react';

export type XiaoXiKey =
  | 'fu'
  | 'lin'
  | 'tai'
  | 'dazhuang'
  | 'guai'
  | 'qian'
  | 'gou'
  | 'dun'
  | 'pi'
  | 'guan'
  | 'bo'
  | 'kun';

export interface XiaoXiHex {
  key: XiaoXiKey;
  name: string;
  lines: readonly [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1];
  yang: number;
  month: string;
  shortMonth: string;
  phase: string;
}

export const XIAOXI_SEQUENCE = [
  'fu',
  'lin',
  'tai',
  'dazhuang',
  'guai',
  'qian',
  'gou',
  'dun',
  'pi',
  'guan',
  'bo',
  'kun',
] as const;

export const XIAOXI_HEXES: Record<XiaoXiKey, XiaoXiHex> = {
  fu: { key: 'fu', name: '复', lines: [0, 0, 0, 0, 0, 1], yang: 1, month: '子月 · 冬至', shortMonth: '十一月·子', phase: '一阳来复' },
  lin: { key: 'lin', name: '临', lines: [0, 0, 0, 0, 1, 1], yang: 2, month: '丑月', shortMonth: '十二月·丑', phase: '二阳上息' },
  tai: { key: 'tai', name: '泰', lines: [0, 0, 0, 1, 1, 1], yang: 3, month: '寅月', shortMonth: '正月·寅', phase: '三阳开泰' },
  dazhuang: { key: 'dazhuang', name: '大壮', lines: [0, 0, 1, 1, 1, 1], yang: 4, month: '卯月 · 春分', shortMonth: '二月·卯', phase: '四阳大壮' },
  guai: { key: 'guai', name: '夬', lines: [0, 1, 1, 1, 1, 1], yang: 5, month: '辰月', shortMonth: '三月·辰', phase: '五阳决阴' },
  qian: { key: 'qian', name: '乾', lines: [1, 1, 1, 1, 1, 1], yang: 6, month: '巳月', shortMonth: '四月·巳', phase: '六阳满盈' },
  gou: { key: 'gou', name: '姤', lines: [1, 1, 1, 1, 1, 0], yang: 5, month: '午月 · 夏至', shortMonth: '五月·午', phase: '一阴始生' },
  dun: { key: 'dun', name: '遁', lines: [1, 1, 1, 1, 0, 0], yang: 4, month: '未月', shortMonth: '六月·未', phase: '二阴渐长' },
  pi: { key: 'pi', name: '否', lines: [1, 1, 1, 0, 0, 0], yang: 3, month: '申月', shortMonth: '七月·申', phase: '三阴闭塞' },
  guan: { key: 'guan', name: '观', lines: [1, 1, 0, 0, 0, 0], yang: 2, month: '酉月 · 秋分', shortMonth: '八月·酉', phase: '四阴观化' },
  bo: { key: 'bo', name: '剥', lines: [1, 0, 0, 0, 0, 0], yang: 1, month: '戌月', shortMonth: '九月·戌', phase: '五阴剥阳' },
  kun: { key: 'kun', name: '坤', lines: [0, 0, 0, 0, 0, 0], yang: 0, month: '亥月', shortMonth: '十月·亥', phase: '六阴满盈' },
};

const CENTER = 340;
const RADIUS = 250;
const LINE_YS = [-15, -9, -3, 3, 9, 15];

function position(i: number) {
  const angle = (90 - i * 30) * Math.PI / 180;
  return {
    x: CENTER + Math.cos(angle) * RADIUS,
    y: CENTER + Math.sin(angle) * RADIUS,
  };
}

function HexLines({ lines, selected }: { lines: XiaoXiHex['lines']; selected: boolean }) {
  const yang = selected ? 'var(--seal)' : 'var(--ink)';
  const yin = selected ? 'var(--accent)' : 'var(--ink-3)';
  return (
    <>
      {lines.map((line, i) => {
        const y = LINE_YS[i];
        if (line === 1) {
          return <line key={i} x1="-20" y1={y} x2="20" y2={y} stroke={yang} strokeWidth="2.6" strokeLinecap="round" />;
        }
        return (
          <g key={i}>
            <line x1="-20" y1={y} x2="-6" y2={y} stroke={yin} strokeWidth="2.6" strokeLinecap="round" />
            <line x1="6" y1={y} x2="20" y2={y} stroke={yin} strokeWidth="2.6" strokeLinecap="round" />
          </g>
        );
      })}
    </>
  );
}

export function XiaoXiCycle({
  selectedKey = 'fu',
  onSelect,
  compact = false,
}: {
  selectedKey?: XiaoXiKey;
  onSelect?: (key: XiaoXiKey) => void;
  compact?: boolean;
}) {
  const selected = XIAOXI_HEXES[selectedKey] ?? XIAOXI_HEXES.fu;
  const interactive = Boolean(onSelect);
  const handleKey = (event: KeyboardEvent<SVGGElement>, key: XiaoXiKey) => {
    if (!onSelect) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(key);
    }
  };

  return (
    <svg
      width="100%"
      viewBox="0 0 680 680"
      role="img"
      aria-labelledby="xiaoxi-title xiaoxi-desc"
      style={{ display: 'block', maxHeight: compact ? 430 : 620 }}
    >
      <title id="xiaoxi-title">十二消息卦圆图</title>
      <desc id="xiaoxi-desc">十二消息卦按一年阴阳消长排列：复在冬至，一阳来复；姤在夏至，一阴始生；右半为息，左半为消。</desc>

      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--hair-2)" strokeWidth="0.8" strokeDasharray="3 5" />
      <path d="M 396 546 A 220 220 0 0 0 560 340 A 220 220 0 0 0 396 134" fill="none" stroke="var(--seal)" strokeWidth="1.2" strokeOpacity="0.38" strokeLinecap="round" />
      <path d="M 284 134 A 220 220 0 0 0 120 340 A 220 220 0 0 0 284 546" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.42" strokeLinecap="round" />

      <text x="340" y="316" textAnchor="middle" style={{ fill: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>十二消息卦</text>
      <text x="340" y="340" textAnchor="middle" style={{ fill: 'var(--ink-2)', fontFamily: 'var(--font-serif)', fontSize: 13 }}>一岁阴阳消长</text>
      <text x="340" y="360" textAnchor="middle" style={{ fill: 'var(--ink-2)', fontFamily: 'var(--font-serif)', fontSize: 12 }}>右半「息」 ↑ · 左半「消」 ↓</text>
      <text x="340" y="388" textAnchor="middle" style={{ fill: 'var(--accent)', fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 700 }}>
        {selected.name} · {selected.month}
      </text>
      {!compact && (
        <text x="340" y="410" textAnchor="middle" style={{ fill: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          {selected.phase} · {selected.yang}阳{6 - selected.yang}阴
        </text>
      )}

      <text x="520" y="326" textAnchor="middle" style={{ fill: 'var(--seal)', fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 700 }}>息</text>
      <text x="160" y="326" textAnchor="middle" style={{ fill: 'var(--accent)', fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 700 }}>消</text>

      {XIAOXI_SEQUENCE.map((key, i) => {
        const item = XIAOXI_HEXES[key];
        const pt = position(i);
        const isSelected = item.key === selected.key;
        return (
          <g
            key={key}
            transform={`translate(${pt.x} ${pt.y})`}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={`${item.name}，${item.month}，${item.phase}`}
            onClick={onSelect ? () => onSelect(item.key) : undefined}
            onKeyDown={(event) => handleKey(event, item.key)}
            style={{ cursor: interactive ? 'pointer' : 'default', outline: 'none' }}
          >
            <circle r="43" fill={isSelected ? 'var(--accent-soft)' : 'transparent'} stroke={isSelected ? 'var(--accent)' : 'transparent'} strokeWidth="1.2" />
            <circle r="48" fill="transparent" />
            <HexLines lines={item.lines} selected={isSelected} />
            <text y="34" textAnchor="middle" style={{ fill: isSelected ? 'var(--accent)' : 'var(--ink)', fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: isSelected ? 800 : 600 }}>
              {item.name}
            </text>
            <text y="52" textAnchor="middle" style={{ fill: 'var(--ink-3)', fontFamily: 'var(--font-serif)', fontSize: 12 }}>
              {item.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
