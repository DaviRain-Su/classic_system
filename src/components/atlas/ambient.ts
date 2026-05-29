// 古琴留白 · 生成式古风背景音（Web Audio，无外部音频、无版权）。
// D 羽五声调式乐句（古琴音色 + 长音吟猱微颤）+ 极轻低音根 + 偶尔古筝上行 + 空灵混响。
// 默认关闭，由 Tweaks 开关触发（用户手势，合规）。
import { useEffect, useRef } from 'react';

// D 羽五声音阶（D F G A C），约二个半八度，Hz，自低而高
const SCALE = [
  73.42, 87.31, 98.00, 110.00, 130.81, // D2 F2 G2 A2 C3
  146.83, 174.61, 196.00, 220.00, 261.63, // D3 F3 G3 A3 C4
  293.66, 349.23, 392.00, 440.00, 523.25, // D4 F4 G4 A4 C5
  587.33, // D5
];
// 乐句：[音阶下标, 拍数]，多取中高音区(下标 8–15)，落音含蓄
type Note = [number, number];
const MOTIFS: Note[][] = [
  [[12, 2], [13, 1], [14, 1], [13, 2], [12, 2]],
  [[14, 2], [13, 1], [11, 1], [10, 3]],
  [[10, 1], [12, 1], [13, 2], [14, 2], [13, 2]],
  [[13, 1], [14, 1], [15, 2], [14, 1], [12, 1], [10, 3]],
  [[8, 2], [10, 1], [12, 1], [13, 2], [10, 2]],
  [[12, 1], [13, 1], [12, 1], [10, 1], [9, 3]],
];
const beat = 0.82;

type WindowWithAC = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;
  private last = -1;

  private ensure() {
    if (this.ctx || typeof window === 'undefined') return;
    const AC = window.AudioContext || (window as WindowWithAC).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2000; lp.Q.value = 0.3;
    const delay = ctx.createDelay(1.5); delay.delayTime.value = 0.38;
    const fb = ctx.createGain(); fb.gain.value = 0.34;
    const wet = ctx.createGain(); wet.gain.value = 0.3;
    master.connect(lp); lp.connect(ctx.destination);
    lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
    this.ctx = ctx; this.master = master;
  }

  // 一记古琴拨音：基音(正弦) + 二倍泛音(三角)，指数包络；长音加吟猱微颤
  private pluck(freq: number, at: number, durSec: number, vol = 1, vib = false) {
    const ctx = this.ctx, dest = this.master;
    if (!ctx || !dest) return;
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = freq;
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = freq * 2;
    const h = ctx.createGain(); h.gain.value = 0.13; o2.connect(h);
    const g = ctx.createGain();
    const peak = 0.9 * vol;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + durSec);
    o1.connect(g); h.connect(g); g.connect(dest);
    let lfo: OscillatorNode | null = null, lg: GainNode | null = null;
    if (vib) { // 吟猱：~5.5Hz 微颤
      lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 5.5;
      lg = ctx.createGain(); lg.gain.value = freq * 0.006;
      lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o2.frequency);
      lfo.start(at + 0.3); lfo.stop(at + durSec);
    }
    o1.start(at); o2.start(at); o1.stop(at + durSec); o2.stop(at + durSec);
  }

  private tick = () => {
    if (!this.running || !this.ctx) return;
    const t0 = this.ctx.currentTime + 0.06;
    let len: number;
    if (Math.random() < 0.12) { // 古筝上行点缀
      const lo = 8 + Math.floor(Math.random() * 3);
      for (let i = 0; i < 5; i++) this.pluck(SCALE[Math.min(lo + i, SCALE.length - 1)], t0 + i * 0.13, 1.6, 0.55);
      len = 5 * 0.13 + 1.4;
    } else {
      let mi = Math.floor(Math.random() * MOTIFS.length);
      if (mi === this.last) mi = (mi + 1) % MOTIFS.length;
      this.last = mi;
      const motif = MOTIFS[mi];
      const shift = Math.random() < 0.3 ? -2 : 0; // 偶尔低八度区
      this.pluck(SCALE[3], t0, 4.2, 0.4); // 极轻低音根 (A2)
      let cur = t0;
      for (const [deg, db] of motif) {
        const idx = Math.max(0, Math.min(SCALE.length - 1, deg + shift));
        const d = db * beat;
        this.pluck(SCALE[idx], cur, d * 0.96 + 1.2, 0.8, db >= 2);
        cur += d;
      }
      len = (cur - t0) + 0.6;
    }
    this.timer = setTimeout(this.tick, (len + 0.8 + Math.random() * 1.6) * 1000);
  };

  start() {
    this.ensure();
    const ctx = this.ctx, master = this.master;
    if (!ctx || !master) return;
    ctx.resume?.();
    if (ctx.state === 'suspended') {
      const once = () => { ctx.resume?.(); window.removeEventListener('pointerdown', once); };
      window.addEventListener('pointerdown', once);
    }
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.22, ctx.currentTime, 0.8);
    if (!this.running) { this.running = true; this.timer = setTimeout(this.tick, 500); }
  }

  stop() {
    this.running = false;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.4);
  }
}

let singleton: Ambient | null = null;

export function useAmbient(on: boolean) {
  const ref = useRef<Ambient | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!ref.current) { singleton = singleton || new Ambient(); ref.current = singleton; }
    if (on) ref.current.start(); else ref.current.stop();
    return () => { ref.current?.stop(); };
  }, [on]);
}
