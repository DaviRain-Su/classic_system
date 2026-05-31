// 课程数据 —— 见 docs/learn-layer.md §2/§5。
// 骨架阶段：仅五个单元的空壳（lessons 为空）。后续按 §5「增量协议」逐课把 Lesson
// 追加进对应单元的 lessons 数组即可——结构不变，只增不改。
//
// 约定：Module.id 为 "1".."5"，与 Lesson.id 前缀对应（如 "1.1" 属单元 "1"，"5.3" 属单元 "5"）。
// 各单元 title/sub 为占位脚手架，可在补课时按内容微调。
import type { Module } from './types';

export const CURRICULUM: Module[] = [
  { id: '1', title: '卦象之生成', sub: '从阴阳到六十四卦', lessons: [] },
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
