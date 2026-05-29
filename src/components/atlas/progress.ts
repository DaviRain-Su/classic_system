// 阅读进度 / 收藏 本地存储 + 订阅 hook。
import { useState, useEffect } from 'react';

const PKEY = 'jdt-progress';
interface PState { read: Record<string, number>; mark: Record<string, number>; }
const hasLS = () => typeof window !== 'undefined' && !!window.localStorage;

function loadP(): PState {
  if (hasLS()) {
    try {
      const s = JSON.parse(localStorage.getItem(PKEY) || 'null');
      if (s && s.read && s.mark) return s as PState;
    } catch { /* ignore */ }
  }
  return { read: {}, mark: {} };
}
let _p = loadP();
const subs = new Set<() => void>();
function saveP() {
  if (hasLS()) { try { localStorage.setItem(PKEY, JSON.stringify(_p)); } catch { /* ignore */ } }
  subs.forEach((f) => f());
}

export function markRead(k: string) { if (k && !_p.read[k]) { _p.read[k] = Date.now(); saveP(); } }
export function toggleMark(k: string) { if (!k) return; if (_p.mark[k]) delete _p.mark[k]; else _p.mark[k] = Date.now(); saveP(); }
export function isRead(k: string) { return !!_p.read[k]; }
export function isMarked(k: string) { return !!_p.mark[k]; }
export function counts() { return { read: Object.keys(_p.read).length, mark: Object.keys(_p.mark).length }; }

export function useProgress() {
  const [, bump] = useState(0);
  useEffect(() => { const f = () => bump((n) => n + 1); subs.add(f); return () => { subs.delete(f); }; }, []);
  return { read: _p.read, mark: _p.mark, markRead, toggleMark, isRead, isMarked, counts };
}
