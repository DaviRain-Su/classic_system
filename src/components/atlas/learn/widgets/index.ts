// 各课交互件桶文件（barrel） —— 见 docs/learn-layer.md §1/§5。
//
// 增量协议：每课按 §3 把 artifact 改造成 widgets/<Name>.tsx 后，在此 re-export；
// LearnApp 的注册表（import * as widgets）会据键自动登记，无需改动 LearnApp。
export { YinYangFlux } from './YinYangFlux';
