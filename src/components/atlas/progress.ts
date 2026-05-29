// 阅读进度 / 收藏 本地存储 + 订阅 hook。
import { useState, useEffect } from 'react';

const STORAGE_VERSION = 1;
const PKEY = 'jdt-progress';
interface PState { read: Record<string, number>; mark: Record<string, number>; }
const hasLS = () => typeof window !== 'undefined' && !!window.localStorage;

function normalizeRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof k === 'string' && typeof v === 'number' && Number.isFinite(v)) out[k] = v;
  }
  return out;
}

function normalizeP(value: unknown): PState {
  if (!value || typeof value !== 'object') return { read: {}, mark: {} };
  const raw = value as { read?: unknown; mark?: unknown };
  return { read: normalizeRecord(raw.read), mark: normalizeRecord(raw.mark) };
}

function loadP(): PState {
  if (hasLS()) {
    try {
      const raw = JSON.parse(localStorage.getItem(PKEY) || 'null');
      const s = raw && raw.version === STORAGE_VERSION && raw.state ? raw.state : raw;
      return normalizeP(s);
    } catch { /* ignore */ }
  }
  return { read: {}, mark: {} };
}
let _p = loadP();
const subs = new Set<() => void>();
function saveP() {
  if (hasLS()) {
    try { localStorage.setItem(PKEY, JSON.stringify({ version: STORAGE_VERSION, state: _p })); } catch { /* ignore */ }
  }
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
