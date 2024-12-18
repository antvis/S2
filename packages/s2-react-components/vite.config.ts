/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-named-capture-group */
import react from '@vitejs/plugin-react';
import path from 'path';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { getBaseConfig } from '../../build.config.base.mjs';

const { getViteConfig, isDevMode } = getBaseConfig({
  aliasReact: true,
});

const root = path.join(__dirname, isDevMode ? 'playground' : '');

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  // 开发配置
  root,

  ...(getViteConfig({
    port: 3002,
    name: 's2-react-components',
    libName: 'S2ReactComponents',
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
    ] as UserConfig['plugins'],
  }) as UserConfig),
});
