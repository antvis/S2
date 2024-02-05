if (window) {
  (window as any).react = require('react');
  // 如果写成 reactDOM 会导致在 playground 运行时找不到 (应该是 dumi 还有主题包存在多版本 React 导致的),
  (window as any).reactDom = require('react-dom');
  (window as any).reactDOMClient = require('react-dom/client');
  (window as any).lodash = require('lodash');
  (window as any).reactColor = require('react-color');
  (window as any).copyToClipboard = require('copy-to-clipboard');

  (window as any).antd = require('antd');
  (window as any).antdIcons = require('@ant-design/icons');

  (window as any).gCanvas = require('@antv/g-canvas');
  (window as any).g = require('@antv/g');
  (window as any).gPluginA11y = require('@antv/g-plugin-a11y');
  (
    window as any
  ).gPluginRoughCanvasRenderer = require('@antv/g-plugin-rough-canvas-renderer');
  (window as any).g2 = require('@antv/g2');
  (window as any).s2 = require('@antv/s2');
  (window as any).s2React = require('@antv/s2-react');

  // 本地通过 monorepoRedirect link 时不需要引入样式, 发布时引入, 避免样式丢失
  if (process.env.NODE_ENV === 'production') {
    (window as any).s2CSS = require('@antv/s2/dist/style.min.css');
    (window as any).s2ReactCSS = require('@antv/s2-react/dist/style.min.css');
  }

  // 码云和老网站统一跳转 antgroup 新域名
  const hosts = ['s2.antv.vision', 'antv-s2.gitee.io'];
  if (hosts.includes(location.host)) {
    (window as any).location.href = location.href.replace(
      location.origin,
      'https://s2.antv.antgroup.com',
    );
  }

  // 能获取到 version 说明没有走 dumi 的代理, 运行的 node_modules 的包
  console.table([
    {
      package: '@antv/s2',
      version: (window as any).s2?.version || 'development',
    },
    {
      package: '@antv/s2-react',
      version: (window as any).s2React?.version || 'development',
    },
    {
      package: 'react',
      version: (window as any).react?.version || 'development',
    },
    {
      package: 'react-dom',
      version: (window as any).reactDom?.version || 'development',
    },
    {
      package: 'antd',
      version: (window as any).antd?.version || 'development',
    },
  ]);
}
