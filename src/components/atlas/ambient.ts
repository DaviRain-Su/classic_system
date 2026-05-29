// 古琴留白 · 生成式背景音（Web Audio，无外部音频、无版权、极简克制）。
// 稀疏五声音阶(宫商角徵羽)轻拨 + 空灵反馈延迟；默认关闭，由 Tweaks 开关触发（用户手势，合规）。
import { useEffect, useRef } from 'react';

// 宫商角徵羽 = C D E G A（相对 C4 的半音偏移）
const PENTA = [0, 2, 4, 7, 9];
const A4 = 440;
const noteFreq = (semisFromC4: number) => A4 * Math.pow(2, (semisFromC4 - 9) / 12);

function buildPool(): number[] {
  const pool: number[] = [];
  for (const oct of [-1, 0, 1]) for (const p of PENTA) pool.push(noteFreq(p + oct * 12));
  return pool;
}

type WindowWithAC = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pool = buildPool();
  private running = false;

  private ensure() {
    if (this.ctx || typeof window === 'undefined') return;
    const AC = window.AudioContext || (window as WindowWithAC).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1800; lp.Q.value = 0.4;
    // 空灵反馈延迟
    const delay = ctx.createDelay(1.5); delay.delayTime.value = 0.36;
    const fb = ctx.createGain(); fb.gain.value = 0.32;
    const wet = ctx.createGain(); wet.gain.value = 0.32;
    master.connect(lp); lp.connect(ctx.destination);
    lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
    this.ctx = ctx; this.master = master;
  }

  private pluck(freq: number, vol = 1) {
    const ctx = this.ctx, dest = this.master;
    if (!ctx || !dest) return;
    const now = ctx.currentTime;
    const dur = 3.4 + Math.random() * 1.6;
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = freq;
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = freq * 2;
    const h = ctx.createGain(); h.gain.value = 0.16; o2.connect(h); h.connect(dest);
    const g = ctx.createGain();
    const peak = 0.9 * vol;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o1.connect(g); g.connect(dest);
    o1.start(now); o2.start(now); o1.stop(now + dur); o2.stop(now + dur);
  }

  private tick = () => {
    if (!this.running || !this.ctx) return;
    if (Math.random() < 0.18) this.pluck(this.pool[Math.floor(Math.random() * 5)] / 2, 0.7); // 偶尔低音
    else this.pluck(this.pool[Math.floor(Math.random() * this.pool.length)], 0.75 + Math.random() * 0.4);
    this.timer = setTimeout(this.tick, 4500 + Math.random() * 6500); // 稀疏、留白
  };

  start() {
    this.ensure();
    const ctx = this.ctx, master = this.master;
    if (!ctx || !master) return;
    const resume = () => ctx.resume?.();
    resume();
    if (ctx.state === 'suspended') {
      const once = () => { resume(); window.removeEventListener('pointerdown', once); };
      window.addEventListener('pointerdown', once);
    }
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.2, ctx.currentTime, 0.8);
    if (!this.running) { this.running = true; this.timer = setTimeout(this.tick, 700); }
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
