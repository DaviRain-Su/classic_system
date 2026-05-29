// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
// 部署目标按环境变量切换：
//  - GitHub Pages（工作流里设 GITHUB_PAGES=true）：子路径 /classic_system
//  - Vercel / 本地：根路径 /
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://davirain-su.github.io' : undefined,
  base: isGitHubPages ? '/classic_system' : '/',
  integrations: [mdx(), react()],
});
