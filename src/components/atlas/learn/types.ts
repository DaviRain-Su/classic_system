// 讲解层数据契约 —— 见 docs/learn-layer.md §2。
// Lesson / Module / Block / QuizItem 类型；课程数据（curriculum.ts）与各课 widget 均依此结构。

// 讲解内容块：讲解文以「块」为单位，渲染见 Block.tsx。
export type Block =
  | { t: 'h'; x: string }                                   // 小标题
  | { t: 'p'; x: string }                                   // 正文段落
  | { t: 'q'; x: string; src?: string }                     // 经典引文 + 出处
  | { t: 'note'; x: string }                                // 接入点 / 提示
  | { t: 'list'; x: string[] }                              // 要点列表
  | { t: 'table'; head: string[]; rows: string[][] };       // 表格

// 随堂练单选题：ans = 正确项下标(0 起)，fb = 判分后反馈。
export interface QuizItem {
  q: string;
  opts: string[];
  ans: number;
  fb: string;
}

export interface Lesson {
  id: string;                                   // "1.1"（前缀 = 所属单元 id）
  title: string;
  objective: string;                            // 本课目标
  body: Block[];                                // 讲解文（脚手架，尽量短）
  widget?: string;                              // widgets/ 注册表中的键，如 "YinYangFlux"
  quizzes?: QuizItem[];                         // 随堂练
  links?: { label: string; to: string }[];      // 关联跳转 chip（to → 对应画面，见 App 的 learnJump）
}

export interface Module {
  id: string;                                   // "1".."5"，与 Lesson.id 前缀对应
  title: string;
  sub: string;
  lessons: Lesson[];
}
