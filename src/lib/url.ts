/**
 * 生成 base 感知的站内链接。
 * 部署在子路径（GitHub Pages 的 /classic_system）时，所有站内链接都需带上 base。
 * 在服务端与客户端（React island）均可用——Vite 会内联 import.meta.env.BASE_URL。
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // '' 或 '/classic_system'
  if (path === '/' || path === '') return base + '/';
  return base + (path.startsWith('/') ? path : '/' + path);
}
