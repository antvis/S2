/* eslint-disable import/order */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import path from 'path';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { getBaseConfig } from '../../build.config.base.mjs';

const { getViteConfig, isDevMode } = getBaseConfig({
  aliasReactComponents: true,
});

const root = path.join(__dirname, isDevMode ? 'playground' : '');

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  // 开发配置
  root,

  ...(getViteConfig({
    port: 3001,
    name: 's2-react',
    libName: 'S2React',
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
      svgr(),
    ] as UserConfig['plugins'],
  }) as UserConfig),
});
