// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
// 部署到 GitHub Pages 项目站点：https://davirain-su.github.io/classic_system/
// 本地开发可用环境变量覆盖 base（默认带子路径）。
export default defineConfig({
  site: 'https://davirain-su.github.io',
  base: '/classic_system',
  integrations: [mdx(), react()],
});
