// 课程数据 —— 见 docs/learn-layer.md §2/§5。
// 骨架阶段：仅五个单元的空壳（lessons 为空）。后续按 §5「增量协议」逐课把 Lesson
// 追加进对应单元的 lessons 数组即可——结构不变，只增不改。
//
// 约定：Module.id 为 "1".."5"，与 Lesson.id 前缀对应（如 "1.1" 属单元 "1"，"5.3" 属单元 "5"）。
// 各单元 title/sub 为占位脚手架，可在补课时按内容微调。
import type { Module } from './types';

export const CURRICULUM: Module[] = [
  {
    id: '1',
    title: '卦象之生成',
    sub: '从阴阳到六十四卦',
    lessons: [
      {
        id: '1.1',
        title: '阴阳与爻',
        objective: '认识阴阳两个基本符号及其属性，理解「互根」与「消长」，并能在十二消息卦上读出从一阳来复到阴极而返的节律。',
        body: [
          { t: 'p', x: '易经的全部符号，归根到底只有两个记号：阳爻与阴爻。但易之为「易」，不在符号本身，而在两者之间永不停歇的转化。' },
          { t: 'q', x: '一阴一阳之谓道。', src: '系辞上' },
          { t: 'p', x: '下面三节循序展开：先认两个符号，再看它们如何互为根源，最后用十二消息卦体会阴阳消长的节律——动手拨一拨滑块。' },
        ],
        widget: 'YinYangFlux',
        quizzes: [
          {
            q: '太极图中「阳中之阴」的那枚鱼眼，寓意是什么？',
            opts: ['极盛之阳已含退藏之机', '阳与阴彼此无关', '阳可以独立长存', '阴是阳的对立面，应被消灭'],
            ans: 0,
            fb: '孤阴不生，独阳不长——极盛之阳中已伏退藏之机，故阳中有阴、两极互为根源。',
          },
          {
            q: '十二消息卦中，乾卦（六阳满盈）之后紧接的是哪一卦？',
            opts: ['复', '姤', '坤', '泰'],
            ans: 1,
            fb: '盛极而衰：乾之后，姤卦一阴始生于初爻，由此转入阳消。',
          },
        ],
        links: [{ label: '皇极经世 · 加一倍法', to: 'huangji' }],
      },
    ],
  },
  { id: '2', title: '解卦之语法', sub: '爻位 · 当位 · 应比', lessons: [] },
  { id: '3', title: '文本之层次', sub: '经传与十翼', lessons: [] },
  { id: '4', title: '义理与象数', sub: '两派 · 六宗', lessons: [] },
  { id: '5', title: '结构与变换', sub: '群论 · 邻卦错卦', lessons: [] },
];

// 扁平化的全部课程（按单元顺序），供讲堂翻页与进度统计使用。
export const ALL_LESSONS = CURRICULUM.flatMap((m) =>
  m.lessons.map((lesson) => ({ lesson, module: m })),
);

// 课程进度键：与星图「已读 N」打通（progress.ts）。
export const lessonKey = (id: string) => 'lesson:' + id;
