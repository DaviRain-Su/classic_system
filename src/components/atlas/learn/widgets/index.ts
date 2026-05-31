// 各课交互件桶文件（barrel） —— 见 docs/learn-layer.md §1/§5。
//
// 增量协议：每课按 §3 把 artifact 改造成 widgets/<Name>.tsx 后，在此 re-export；
// LearnApp 的注册表（import * as widgets）会据键自动登记，无需改动 LearnApp。
// 注意：_glyph.tsx 是共用 helper，不是 widget——不要在此导出。
export { YinYangFlux } from './YinYangFlux';
export { GenTree } from './GenTree';
export { BaguaRef } from './BaguaRef';
export { ChongGua } from './ChongGua';
export { Grammar } from './Grammar';
export { TextLayers } from './TextLayers';
