/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import type { UserConfig } from 'vite';
import { getBaseConfig } from '../../build.config.base.mjs';

const { getViteConfig, isDevMode } = getBaseConfig();
const root = path.join(__dirname, isDevMode ? 'playground' : '');

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  // 开发配置
  root,

  ...getViteConfig({
    port: 5050,
    libName: 'S2-Vue',
    plugins: [
      vue(),
      svgLoader({
        defaultImport: 'component',
      }),
      vueJsx(),
    ] as UserConfig['plugins'],
  }),
} as UserConfig);
